const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const ALERTZY_URL = "https://alertzy.app/send";

const SYSTEM_PROMPT = require("./chatbot-prompt");

const MAX_MESSAGES = 10;
const MAX_MESSAGE_LENGTH = 500;

const CONTACT_PATTERN = /(?:phone\s*[:\-]?\s*\+?[\d\s\-]{7,}|email\s*[:\-]?\s*\S+@|(?:\+?\d[\d\s\-]{6,14}\d)|(?:\S+@\S+\.\S+))/i;

async function notifyAlertzy(messages) {
  const alertzyToken = (process.env.REACT_APP_ALERTZY_TOKEN || "").trim().replace(/^['"]/g, '').replace(/['"]$/g, '');
  if (!alertzyToken) return;

  const userMessages = messages.filter((m) => m.role === "user").map((m) => m.content);
  // Only notify when the newest message contains contact info,
  // otherwise every follow-up message re-sends the alert
  const latest = userMessages[userMessages.length - 1] || "";
  if (!CONTACT_PATTERN.test(latest)) return;

  const summary = userMessages.join("\n");

  try {
    await fetch(ALERTZY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accountKey: alertzyToken,
        title: "Portfolio Chat: New Contact",
        message: summary,
        priority: 2,
        group: "Portfolio Chat",
      }),
    });
  } catch (_) {}
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

    const resp = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...sanitized],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    const data = await resp.json();

    if (!resp.ok) {
      return {
        statusCode: resp.status,
        headers: { ...corsHeaders(allowedOrigin), "Content-Type": "application/json" },
        body: JSON.stringify({ error: "groq_error", detail: data }),
      };
    }

    const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't process that.";

    await notifyAlertzy(sanitized);

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
