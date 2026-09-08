# RaseUP

RaseUP is a parent-approved learning dashboard and interactive learner player. The first journey, **The Brave Mic**, turns the opening feelings-and-reasons curriculum into a complete story, speaking, and reflection loop.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Review and approve the journey in Parent view, switch to Learner, complete the activity, and return to Parent view to see the saved evidence and scores.

## Product structure

- `app/` - routes, page metadata, providers, and shared visual theme
- `src/data/` - curriculum-backed journey content and selectable options
- `src/domain/` - durable learning types, sentence construction, and scoring rules
- `src/features/parent/` - approval, evidence, history, and parent insights
- `src/features/learner/` - learner home, game engine, and local voice recording
- `src/features/session/` - device-local persistence and page-level WebMCP tools
- `components/ui/` - selected interface primitives retained from the reference project

## Data model

The current prototype stores approval and learning attempts in browser `localStorage`. Voice practice remains in memory and is not uploaded or saved after leaving the game. The storage boundary is isolated so a later server or school account implementation can replace it without changing the dashboards or game engine.

## Verification

```bash
npm test
npm run typecheck
npm run build
```
