// server/src/services/roastGenerator.js
// Grok-first with deterministic fallback. Always returns a string.

const { callGrok } = require("./grokclient");

/**
 * Deterministic local fallback (2–4 sentences, no emojis, no encouragement, no advice).
 * Behavior-focused, not identity-focused.
 */
function localFallbackRoast(context) {
  const { habitType, daysMissed, escalationStage, brutalityLevel } = context;

  const base = `You skipped "${habitType}" again.`;

  const streak = daysMissed >= 2 ? `${daysMissed} days straight.` : "";

  let escalation;
  if (escalationStage === "mild") {
    escalation = "You're already building a streak of avoidance.";
  } else if (escalationStage === "medium") {
    escalation = "You keep choosing comfort over the commitment you made.";
  } else {
    escalation = "You keep breaking the same promise and acting surprised.";
  }

  let brutality;
  if (brutalityLevel === "soft") {
    brutality = "You said you'd do it. You didn't.";
  } else if (brutalityLevel === "medium") {
    brutality = "This is the exact behavior that keeps you stuck.";
  } else if (brutalityLevel === "hard") {
    brutality =
      "Either do it now, or admit you don't take your own promises seriously.";
  } else {
    brutality =
      "This is what quitting looks like in real time. Stop performing and act.";
  }

  const line2 = streak ? `${streak} ${escalation}` : escalation;
  return `${base} ${line2} ${brutality}`;
}

/**
 * Grok-first roast generator.
 * Always returns a string. Falls back to local deterministic roast if Grok fails or env vars are missing.
 */
async function generateRoast(context) {
  try {
    const text = await callGrok(context);
    if (typeof text === "string" && text.trim().length > 0) return text.trim();
    // If Grok returns empty/invalid, fallback.
    return localFallbackRoast(context);
  } catch (err) {
    console.warn("Grok API failed:", err?.message || err);
    return localFallbackRoast(context);
  }
}

module.exports = { generateRoast };
