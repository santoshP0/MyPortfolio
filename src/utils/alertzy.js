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

/**
 * @async
 * @function sendAlertzyTransmission
 * @description Sends a notification payload to the Alertzy service. This function is designed
 * to be robust, attempting to send the payload to a series of endpoints, including
 * Netlify functions or a direct API endpoint. It gracefully falls back to the next
 * endpoint if a request fails. It handles both direct API calls (which require a token)
 * and proxied requests through serverless functions.
 *
 * @param {object} basePayload - The core payload for the Alertzy API (e.g., { title, message, priority }).
 * @param {object} [options={}] - Optional configuration for the transmission.
 * @param {string} [options.token] - The Alertzy account key/token, required for direct API calls.
 * @param {Array<string>} [options.endpoints=DEFAULT_ALERTZY_ENDPOINTS] - An array of API endpoints to try in sequence.
 * @returns {Promise<{ok: boolean, endpoint?: string, error?: Error}>} A promise that resolves to an object indicating success or failure.
 * - On success: `{ ok: true, endpoint: string }`
 * - On failure: `{ ok: false, error: Error }`
 */
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
