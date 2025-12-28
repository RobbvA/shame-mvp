// Simple roast generator for MVP
// Exports: generateRoast(options) => string
// options: { habitType, daysMissed, escalationStage, brutalityLevel, persona, recentOutcomes }

function capitalize(s) {
  return String(s || "").replace(/_/g, " ").replace(/\b[a-z]/g, (m) => m.toUpperCase());
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateRoast({
  habitType = "habit",
  daysMissed = 0,
  escalationStage = 0,
  brutalityLevel = "hard", // soft | medium | hard | brutal
  persona = "drill_sergeant",
  recentOutcomes = [],
} = {}) {
  const personaName = capitalize(persona);
  const base = `You missed ${habitType} for ${daysMissed} day${daysMissed === 1 ? '' : 's'}.`;

  const stagePhrases = [
    "Don't let it slide.",
    "This is getting worrying.",
    "You're on thin ice.",
    "Alarm bells are ringing."
  ];

  const brutalityBuckets = {
    soft: [
      `Hey, ${personaName} here: ${base} ${pick(["Take it easy and try again tomorrow.", "Small steps — you got this."])} `,
    ],
    medium: [
      `Listen up, ${personaName}: ${base} ${pick(["Pull yourself together.", "Get back on track before it becomes a habit."])} `,
    ],
    hard: [
      `Warning from ${personaName}: ${base} ${pick(["Stop making excuses.", "This is on you — fix it."])} `,
    ],
    brutal: [
      `Final call by ${personaName}: ${base} ${pick(["Seriously — what are you doing with your life?", "This is pathetic. Change or accept it."])} `,
    ],
  };

  const brutality = brutalityBuckets[brutalityLevel] || brutalityBuckets.hard;

  const stageMsg = stagePhrases[Math.min(escalationStage, stagePhrases.length - 1)];

  // small personalization using recent outcomes
  let recentNote = "";
  if (recentOutcomes && recentOutcomes.length) {
    const summary = recentOutcomes.join(", ");
    recentNote = ` Recent outcomes: ${summary}.`;
  }

  return `${pick(brutality)}${stageMsg}${recentNote}`.trim();
}

module.exports = { generateRoast };
