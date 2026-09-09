# RaseUP

## How to run locally

Requires Node.js 22.13 or newer and npm.

```bash
git clone https://github.com/vedbhoskar/RaseUP0.1.git
cd RaseUP0.1
npm install
npm run dev
```

Open `http://localhost:3000`. Start **Nova's Mood Mission** from the student dashboard, complete the Think, Speak, and Talk modules, then return to the dashboard to see the updated stats.

RaseUP is a student learning dashboard for topic-based communication games. **Nova's Mood Mission** turns the Self Awareness & Identity curriculum into a situation, sentence-building, speaking, and guided-conversation experience.

## Product design

The product specification for the direct student dashboard and **Nova's Mood Mission** is in [`docs/STUDENT-DASHBOARD-AND-MOOD-MISSION-TECHNICAL-DESIGN.md`](docs/STUDENT-DASHBOARD-AND-MOOD-MISSION-TECHNICAL-DESIGN.md). The reviewed dependency architecture and sequential TDD plan are in [`docs/MOOD-MISSION-TDD-BUILD-PLAN.md`](docs/MOOD-MISSION-TDD-BUILD-PLAN.md).

## Product structure

- `app/` - routes, page metadata, providers, and shared visual theme
- `src/data/` - topic registry, reviewed prompts, situations, and selectable options
- `src/domain/` - learning types, stage engine, sentence builders, scoring, conversation rules, and dashboard selectors
- `src/features/dashboard/` - student stats, topic sections, and game cards
- `src/features/mission/` - reusable Think, Speak, Talk, replay, and results modules
- `src/features/mascot/` - Nova instruction replay behavior
- `src/features/session/` - versioned device-local persistence, migration, recording, and page-level WebMCP tools
- `components/ui/` - selected interface primitives retained from the reference project

## Data model

The current prototype stores student progress and learning attempts in browser `localStorage`. Voice recordings remain in memory and are not uploaded or saved after leaving the game. A versioned repository boundary preserves old activity as legacy evidence and allows a future server implementation without changing the dashboard or game engine.

## Verification

```bash
npm test
npm run typecheck
npm run lint
npm run build
```
