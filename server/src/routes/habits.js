const express = require("express");
const {
  createHabit,
  getHabits,
  addLog,
  countConsecutiveMisses,
  getRecentLogs,
} = require("../db/memoryStore");
const { computeEscalationStage } = require("../services/escalation");

const router = express.Router();

// GET /habits
router.get("/", (req, res) => {
  res.status(200).json({ habits: getHabits() });
});

// POST /habits
router.post("/", (req, res) => {
  const { name, deadlineTime } = req.body;

  if (!name || typeof name !== "string") {
    return res.status(400).json({ error: "name is required (string)" });
  }

  if (!deadlineTime || typeof deadlineTime !== "string") {
    return res
      .status(400)
      .json({ error: "deadlineTime is required (string, e.g. '21:00')" });
  }

  const habit = createHabit({ name, deadlineTime });
  res.status(201).json({ habit });
});

// POST /habits/:id/logs
router.post("/:id/logs", (req, res) => {
  const habitId = req.params.id;
  const { outcome } = req.body;

  if (outcome !== "done" && outcome !== "missed") {
    return res
      .status(400)
      .json({ error: "outcome must be 'done' or 'missed'" });
  }

  const log = addLog(habitId, { outcome });
  if (!log) return res.status(404).json({ error: "habit not found" });

  const daysMissed = countConsecutiveMisses(habitId);
  const escalationStage = computeEscalationStage(daysMissed);
  const recentOutcomes = getRecentLogs(habitId, 3).map((l) => l.outcome);

  res.status(201).json({
    log,
    escalation: {
      daysMissed,
      stage: escalationStage,
      recentOutcomes,
    },
  });
});

module.exports = router;
