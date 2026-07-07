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
    const { messages = [] } = JSON.parse(event.body || "{}");

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
