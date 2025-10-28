// Netlify Function: Alertzy proxy with CORS and server-side token
// Reads REACT_APP_ALERTZY_TOKEN and optional ALLOWED_ORIGIN from environment

const ALERTZY_URL = "https://alertzy.app/send";

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

  // Preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders(allowedOrigin), body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: corsHeaders(allowedOrigin), body: "Method Not Allowed" };
  }

  const token = process.env.REACT_APP_ALERTZY_TOKEN;
  if (!token) {
    return {
      statusCode: 500,
      headers: corsHeaders(allowedOrigin),
      body: JSON.stringify({ error: "missing_server_token" }),
    };
  }

  try {
    const { title, message, priority = 1, group = "Portfolio Contact" } = JSON.parse(event.body || "{}");
    const payload = { accountKey: token, title, message, priority, group };

    const resp = await fetch(ALERTZY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await resp.text();
    return {
      statusCode: resp.status,
      headers: { ...corsHeaders(allowedOrigin), "Content-Type": resp.headers.get("content-type") || "application/json" },
      body: text,
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: corsHeaders(allowedOrigin),
      body: JSON.stringify({ error: "proxy_error", detail: String(err) }),
    };
  }
};

