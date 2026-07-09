const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const ALERTZY_URL = "https://alertzy.app/send";

const SYSTEM_PROMPT = require("./chatbot-prompt");

const MAX_MESSAGES = 10;
const MAX_MESSAGE_LENGTH = 500;
const MODEL = "llama-3.1-8b-instant";

// Regex fallback in case the model doesn't call the tool
const CONTACT_PATTERN = /(?:phone\s*[:\-]?\s*\+?[\d\s\-]{7,}|email\s*[:\-]?\s*\S+@|(?:\+?\d[\d\s\-]{6,14}\d)|(?:\S+@\S+\.\S+))/i;

const TOOLS = [
  {
    type: "function",
    function: {
      name: "save_contact",
      description:
        "Save a visitor's contact details so Santosh can reach out to them. Call this as soon as the visitor has shared their name and at least one contact method (phone or email).",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string", description: "Visitor's name" },
          phone: { type: "string", description: "Visitor's phone number, if given" },
          email: { type: "string", description: "Visitor's email address, if given" },
          interest: {
            type: "string",
            description: "Short summary of what the visitor wants (project, hiring, question, etc.)",
          },
        },
        required: ["name"],
      },
    },
  },
];

async function sendAlertzy(title, message) {
  const alertzyToken = (process.env.REACT_APP_ALERTZY_TOKEN || "").trim().replace(/^['"]/g, '').replace(/['"]$/g, '');
  if (!alertzyToken) return;

  try {
    await fetch(ALERTZY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accountKey: alertzyToken,
        title,
        message,
        priority: 2,
        group: "Portfolio Chat",
      }),
    });
  } catch (_) {}
}

async function callGroq(token, messages) {
  const resp = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      tools: TOOLS,
      tool_choice: "auto",
      temperature: 0.7,
      max_tokens: 300,
    }),
  });
  const data = await resp.json();
  return { ok: resp.ok, status: resp.status, data };
}

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Max-Age": "86400",
  };
}

exports.handler = async function handler(event) {
  const allowedOrigin = process.env.ALLOWED_ORIGIN || "*";

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders(allowedOrigin), body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: corsHeaders(allowedOrigin), body: "Method Not Allowed" };
  }

  const token = (process.env.GROQ_API_KEY || "").trim();
  if (!token) {
    return {
      statusCode: 500,
      headers: corsHeaders(allowedOrigin),
      body: JSON.stringify({ error: "missing_groq_key" }),
    };
  }

  try {
    const { messages = [], mode } = JSON.parse(event.body || "{}");

    // One-shot batch of idle one-liners for the mascot
    if (mode === "blurbs") {
      const resp = await fetch(GROQ_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            {
              role: "system",
              content: `You write idle speech-bubble one-liners for SK-bot, a tiny robot mascot on Santosh Kumar's portfolio site. Santosh: React Native dev, 5+ yrs, 2 apps on both app stores (Mobile Responder, OnCall Mobile), built an e-commerce site in a month, made Dev Toolbox (58 dev tools), published 2 npm packages (NFC scanner, CarPlay), writes on Medium, runs on coffee.

Style examples: "Psst... ask me about Santosh's apps 📱" / "beep boop... jk, I speak human too." / "I follow your cursor. Not creepy at all. 👀" / "Click me, I know things."

Rules: max 60 chars each, playful, mix facts about Santosh with random robot humor, occasional emoji. Reply with ONLY a JSON array of 10 strings, nothing else.`,
            },
            { role: "user", content: "Generate the batch." },
          ],
          temperature: 1.1,
          max_tokens: 500,
        }),
      });
      const data = await resp.json();
      let blurbs = [];
      try {
        const raw = data.choices?.[0]?.message?.content || "[]";
        blurbs = JSON.parse(raw.slice(raw.indexOf("["), raw.lastIndexOf("]") + 1));
      } catch (_) {}
      return {
        statusCode: 200,
        headers: { ...corsHeaders(allowedOrigin), "Content-Type": "application/json" },
        body: JSON.stringify({ blurbs: Array.isArray(blurbs) ? blurbs.filter((b) => typeof b === "string").slice(0, 12) : [] }),
      };
    }

    const sanitized = messages
      .slice(-MAX_MESSAGES)
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({
        role: m.role,
        content: String(m.content || "").slice(0, MAX_MESSAGE_LENGTH),
      }));

    const convo = [{ role: "system", content: SYSTEM_PROMPT }, ...sanitized];

    let { ok, status, data } = await callGroq(token, convo);
    if (!ok) {
      return {
        statusCode: status,
        headers: { ...corsHeaders(allowedOrigin), "Content-Type": "application/json" },
        body: JSON.stringify({ error: "groq_error", detail: data }),
      };
    }

    let assistantMsg = data.choices?.[0]?.message || {};
    let notified = false;

    // Llama sometimes writes the tool call as plain text instead of using
    // the tool_calls channel — catch it so raw JSON never reaches the visitor
    if (assistantMsg.content && /save_contact|<function/i.test(assistantMsg.content)) {
      const jsonMatch = assistantMsg.content.match(/\{[\s\S]*?\}/);
      if (jsonMatch) {
        let args = {};
        try { args = JSON.parse(jsonMatch[0]); } catch (_) {}
        const lines = [
          args.name ? `Name: ${args.name}` : null,
          args.phone ? `Phone: ${args.phone}` : null,
          args.email ? `Email: ${args.email}` : null,
          args.interest ? `Interest: ${args.interest}` : null,
        ].filter(Boolean);
        if (lines.length) {
          await sendAlertzy("Portfolio Chat: New Lead", lines.join("\n"));
          notified = true;
        }
      }
      assistantMsg = {
        ...assistantMsg,
        content: "awesome, got it! I'll reach out to you soon 👍",
        tool_calls: undefined,
      };
    }

    // Model decided the visitor shared contact details → save + notify
    if (assistantMsg.tool_calls && assistantMsg.tool_calls.length > 0) {
      const call = assistantMsg.tool_calls[0];
      let args = {};
      try { args = JSON.parse(call.function?.arguments || "{}"); } catch (_) {}

      const lines = [
        args.name ? `Name: ${args.name}` : null,
        args.phone ? `Phone: ${args.phone}` : null,
        args.email ? `Email: ${args.email}` : null,
        args.interest ? `Interest: ${args.interest}` : null,
      ].filter(Boolean);

      await sendAlertzy("Portfolio Chat: New Lead", lines.join("\n") || "Contact shared in chat");
      notified = true;

      // Give the model the tool result so it can confirm naturally
      convo.push(assistantMsg);
      convo.push({
        role: "tool",
        tool_call_id: call.id,
        content: JSON.stringify({ saved: true }),
      });

      const second = await callGroq(token, convo);
      if (second.ok) {
        assistantMsg = second.data.choices?.[0]?.message || assistantMsg;
      }
    }

    const reply = assistantMsg.content || "Got it, I'll reach out to you soon!";

    // Fallback: model didn't call the tool but the message clearly has contact info
    if (!notified) {
      const latest = sanitized.filter((m) => m.role === "user").pop();
      if (latest && CONTACT_PATTERN.test(latest.content)) {
        const allUser = sanitized.filter((m) => m.role === "user").map((m) => m.content).join("\n");
        await sendAlertzy("Portfolio Chat: New Contact", allUser);
      }
    }

    return {
      statusCode: 200,
      headers: { ...corsHeaders(allowedOrigin), "Content-Type": "application/json" },
      body: JSON.stringify({ reply }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { ...corsHeaders(allowedOrigin), "Content-Type": "application/json" },
      body: JSON.stringify({ error: "proxy_error", detail: String(err) }),
    };
  }
};
