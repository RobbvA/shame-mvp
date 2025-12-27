# Escalation State Machine

## Deterministic Rules
Escalation is deterministic and handled by the backend.

- 0–1 days missed: mild
- 2–3 days missed: medium
- 4+ days missed: hard / brutal (based on user setting)

AI never decides escalation level.

## State per Habit
Each habit maintains its own escalation state.
Escalation resets only when the habit is successfully completed.

## Edge Cases
- Missed logging counts as missed habit
- Escalation does not decay automatically
- Changing brutality level affects tone, not escalation logic
