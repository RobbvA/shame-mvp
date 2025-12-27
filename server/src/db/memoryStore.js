// In-memory store for MVP scaffolding (replace with DB later)
const store = {
  habits: new Map(), // habitId -> habit
  logs: new Map(), // habitId -> array of logs
};

function createHabit({ name, deadlineTime }) {
  const id = cryptoRandomId();
  const habit = {
    id,
    name,
    deadlineTime, // e.g. "21:00"
    createdAt: new Date().toISOString(),
  };

  store.habits.set(id, habit);
  store.logs.set(id, []);

  return habit;
}

function getHabits() {
  return Array.from(store.habits.values());
}

function getHabitById(habitId) {
  return store.habits.get(habitId) || null;
}

function addLog(habitId, { outcome }) {
  const habit = getHabitById(habitId);
  if (!habit) return null;

  const logs = store.logs.get(habitId) || [];
  const log = {
    id: cryptoRandomId(),
    habitId,
    outcome, // "done" | "missed"
    createdAt: new Date().toISOString(),
  };

  logs.unshift(log); // newest first
  store.logs.set(habitId, logs);

  return log;
}

function getRecentLogs(habitId, limit = 3) {
  const logs = store.logs.get(habitId) || [];
  return logs.slice(0, limit);
}

function countConsecutiveMisses(habitId) {
  const logs = store.logs.get(habitId) || [];
  let count = 0;
  for (const log of logs) {
    if (log.outcome === "missed") count += 1;
    else break;
  }
  return count;
}

function cryptoRandomId() {
  // no external dep; works on modern Node
  return require("crypto").randomBytes(8).toString("hex");
}

module.exports = {
  createHabit,
  getHabits,
  getHabitById,
  addLog,
  getRecentLogs,
  countConsecutiveMisses,
};
