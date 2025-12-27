# shame-mvp

SHAME - Structured Habit Accountability &amp; Motivation Engine (MVP)

# SHAME (MVP)

Structured Habit Accountability & Motivation Engine

SHAME is a confrontational habit tracker MVP. No soft motivation, no rewards.
Success is silence. Failure triggers escalating, AI-generated accountability.

## Hypothesis

Confrontational, escalating AI accountability increases habit logging consistency among discipline-oriented users compared to soft motivation.

## MVP Scope

In scope:

- Manual habit logging (done / missed)
- Per-habit escalation (deterministic)
- AI-generated confrontation on failure only
- Configurable brutality level and persona

Out of scope (MVP):

- Sensor tracking
- Gamification or rewards
- Social features
- Analytics dashboards
- Image/selfie input

## Core Loop

1. User defines a habit and deadline
2. Deadline passes
3. User logs done or missed
4. If missed:
   - Escalation increases (backend deterministic)
   - AI generates confrontation (language only)
5. System remembers state
6. Repeat

## Repo Structure

- `/docs` — MVP contracts (scope, escalation rules, AI prompt contract)
- `/client` — frontend (MVP UI)
- `/server` — backend (API, DB, AI integration)

## Branching

- `main` — stable
- `dev` — active collaboration
- feature branches: `feat/<name>`, `fix/<name>`

## Getting Started

This repo currently contains the foundation structure and documentation contracts.
Implementation starts on `dev`.

## TEAM

- Robbert van Asselt
- Simon Bates
