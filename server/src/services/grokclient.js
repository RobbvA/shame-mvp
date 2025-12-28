// server/src/services/grokClient.js
const DEFAULT_TIMEOUT_MS = 10_000;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * callGrok(prompt, options)
 * - prompt: string
 * - options: { model, temperature, maxTokens, timeoutMs }
 *
 * returns string (generated text) or throws
 */
async function callGrok(prompt, options = {}) {
  const baseUrl = process.env.GROK_BASE_URL;
  const apiKey = process.env.GROK_API_KEY;
  if (!baseUrl || !apiKey) {
    throw new Error("GROK_BASE_URL and GROK_API_KEY must be set in env");
  }

  const body = {
    prompt,
    model: options.model || "grok-1",
    temperature: options.temperature ?? 0.8,
    max_tokens: options.maxTokens ?? 256,
    // adapt to real API fields as needed
  };

  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  // simple retry/backoff
  const maxAttempts = options.retries ?? 3;
  let attempt = 0;
  let lastErr = null;

  while (attempt < maxAttempts) {
    attempt += 1;
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeoutMs);

      const res = await fetch(process.env.GROK_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROK_API_KEY}`,
        },
        body: JSON.stringify({
          prompt: "Write one snarky roast",
          model: "grok-1",
          max_tokens: 80
        }),
        signal: controller.signal,
      });

      clearTimeout(id);

      if (!res.ok) {
        // retry on server errors
        const text = await res.text().catch(() => "");
        const err = new Error(`Grok API error ${res.status}: ${text}`);
        if (res.status >= 500 && attempt < maxAttempts) {
          lastErr = err;
          await sleep(200 * attempt); // backoff
          continue;
        } else {
          throw err;
        }
      }

      const data = await res.json().catch(() => null);
      // adapt this depending on provider response shape
      // assume { text: "generated..." } or { choices: [{text}] }
      if (!data) throw new Error("Empty JSON from Grok API");

      if (typeof data.text === "string") return data.text;
      if (Array.isArray(data.choices) && data.choices[0] && data.choices[0].text) {
        return data.choices[0].text;
      }

      // fallback: coerce to string
      return JSON.stringify(data);
    } catch (err) {
      lastErr = err;
      if (err.name === "AbortError") {
        lastErr = new Error("Grok API request timed out");
      }
      if (attempt < maxAttempts) {
        await sleep(200 * attempt);
        continue;
      }
      throw lastErr;
    }
  }

  throw lastErr || new Error("Unknown Grok client error");
}

module.exports = { callGrok };