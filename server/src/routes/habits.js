const express = require("express");

const {
  createHabit,
  getHabits,
  getHabitById,
  addLog,
  countConsecutiveMisses,
  getRecentLogs,
} = require("../db/memoryStore");

const { computeEscalationStage } = require("../services/escalation");
const { generateRoast } = require("../services/roastGenerator");

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
router.post("/:id/logs", async (req, res) => {
  const habitId = req.params.id;
  const { outcome } = req.body;

  // Optional (MVP defaults)
  const brutalityLevel = req.body.brutalityLevel || "hard"; // soft | medium | hard | brutal
  const persona = req.body.persona || "drill_sergeant"; // placeholder for later

  if (outcome !== "done" && outcome !== "missed") {
    return res
      .status(400)
      .json({ error: "outcome must be 'done' or 'missed'" });
  }

  const habit = getHabitById(habitId);
  if (!habit) return res.status(404).json({ error: "habit not found" });

  const log = addLog(habitId, { outcome });

  const daysMissed = countConsecutiveMisses(habitId);
  const escalationStage = computeEscalationStage(daysMissed);
  const recentOutcomes = getRecentLogs(habitId, 3).map((l) => l.outcome);

  let roast = null;

  if (outcome === "missed") {
    try {
      roast = await generateRoast({
        habitType: habit.name,
        daysMissed,
        escalationStage,
        brutalityLevel,
        persona,
        recentOutcomes,
      });
    } catch (err) {
      // already handled inside generateRoast, but catch here if needed
      console.error("Roast generation error:", err);
    }
  }

  res.status(201).json({
    log,
    escalation: {
      daysMissed,
      stage: escalationStage,
      recentOutcomes,
    },
    roast,
  });
});

module.exports = router;
