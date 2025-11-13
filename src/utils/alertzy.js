export const DEFAULT_ALERTZY_ENDPOINTS = Object.freeze([
  "/.netlify/functions/alertzy",
  "/api/alertzy/send",
]);

const parseJson = (raw) => {
  try {
    return JSON.parse(raw);
  } catch (_) {
    return null;
  }
};

const isNetlifyEndpoint = (endpoint) => endpoint.includes("/.netlify/functions/alertzy");

export async function sendAlertzyTransmission(basePayload, { token, endpoints = DEFAULT_ALERTZY_ENDPOINTS } = {}) {
  let lastError = null;

  for (const endpoint of endpoints) {
    const payload = { ...basePayload };

    if (endpoint.includes("/api/alertzy")) {
      if (!token) {
        lastError = new Error("Missing Alertzy token for direct API call");
        continue;
      }
      payload.accountKey = token;
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json,text/plain,*/*" },
        body: JSON.stringify(payload),
      });

      const contentType = response.headers.get("content-type") || "";
      const bodyText = await response.text();
      const bodyJson = contentType.includes("application/json") ? parseJson(bodyText) : null;

      const success = isNetlifyEndpoint(endpoint)
        ? response.ok && bodyJson && bodyJson.ok === true
        : response.ok && (
          bodyText.toLowerCase().includes("success") ||
          bodyText.toLowerCase().includes("ok") ||
          (bodyJson && (bodyJson.ok || bodyJson.success))
        );

      if (success) {
        return { ok: true, endpoint };
      }

      lastError = new Error(bodyText || `Unexpected status: ${response.status}`);
    } catch (error) {
      lastError = error;
    }
  }

  return { ok: false, error: lastError };
}
