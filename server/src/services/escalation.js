function computeEscalationStage(daysMissed) {
  if (!Number.isInteger(daysMissed) || daysMissed < 0) {
    throw new Error("daysMissed must be a non-negative integer");
  }

  if (daysMissed <= 1) return "mild";
  if (daysMissed <= 3) return "medium";
  return "hard";
}

module.exports = { computeEscalationStage };
