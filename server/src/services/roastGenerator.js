// Simple roast generator for MVP
// Exports: generateRoast(options) => string
// options: { habitType, daysMissed, escalationStage, brutalityLevel, persona, recentOutcomes }

import { callGrok } from "./grokclient.js";

function capitalize(s) {
  return String(s || "").replace(/_/g, " ").replace(/\b[a-z]/g, (m) => m.toUpperCase());
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function generateRoast({
  habitType = "habit",
  daysMissed = 0,
  escalationStage = 0,
  brutalityLevel = "hard",
  persona = "drill_sergeant",
  recentOutcomes = [],
} = {}) {
  const prompt = [
    `Persona: ${persona}`,
    `Brutality: ${brutalityLevel}`,
    `Habit: ${habitType}`,
    `Days missed: ${daysMissed}`,
    `Escalation stage: ${escalationStage}`,
    `Recent outcomes: ${recentOutcomes.join(", ")}`,
    "Write one short roast (1-2 sentences) tailored to the persona and brutality."
  ].join("\n");

  try {
    const text = await callGrok(prompt, { temperature: 0.8, maxTokens: 80, timeoutMs: 6000 });
    return text.trim();
  } catch (err) {
    // graceful fallback (previous local generator)
    console.warn("Grok API failed:", err.message);
    return localFallbackRoast({ habitType, daysMissed, escalationStage, brutalityLevel, persona, recentOutcomes });
  }
}

export { generateRoast };
