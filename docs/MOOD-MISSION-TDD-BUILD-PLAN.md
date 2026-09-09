# Nova's Mood Mission: Dependency Architecture and TDD Build Plan

Branch: `codex/student-dashboard-mood-mission`  
Method: vertical slices built with red → green → refactor cycles.

## Critique of the first design

The first design established the right product direction but was not yet an efficient build plan.

1. It mixed MVP decisions with future possibilities. The separate results route, server storage, and open-ended adapters were not required for the first release.
2. It described 14 top-level stages. That would make the progress indicator feel longer than the actual lesson. The revised player uses 11 visible stops and keeps the three Think situations inside one coherent stage.
3. It specified types and function names but not their dependency direction. That leaves room for UI components to import storage or calculate scores directly.
4. The scoring prose was not executable. The revised plan starts with exact fixtures and expected scores.
5. The proposed migration renamed Brave Mic history as Mood Mission history. That would make old evidence look as though it came from the new activity. The revised migration preserves it as legacy activity.
6. “Deterministic conversation” was underspecified. The revised engine owns reviewed prompts, acknowledgement templates, scaffolds, and completion rules.
7. Replay behavior was repeated in prose but lacked one shared contract. The revised architecture provides a single instruction-replay hook and one stage action bar.
8. The document did not define commit-sized implementation checkpoints. This plan does.

## Fixed MVP decisions

- One device-local student named Aarav.
- No parent or teacher view, approval state, or locked journey.
- One active topic and one active game; registries support adding more later.
- Two routes: `/` and `/games/nova-mood-mission`.
- Results render inside the game route.
- Nova uses reviewed deterministic prompts, not a network AI service.
- Voice is optional; typed and spoken-confirmation paths remain fully completable.
- Instruction replay uses browser speech synthesis.
- Recordings are temporary object URLs and are never persisted.

## Dependency rule

Dependencies may point only downward:

```text
routes
  ↓
feature composition (dashboard, mission)
  ↓
shared feature controls (mascot, audio, stage actions)
  ↓
session store and local-storage adapter
  ↓
pure domain services and selectors
  ↓
domain types and static curriculum data
```

Forbidden dependencies:

- Domain modules must not import React, browser APIs, or feature components.
- Curriculum data must not import the store.
- UI components must not calculate scores or mutate localStorage directly.
- The conversation engine must not access microphone APIs.
- The recorder must not know about game stages.
- Routes must not contain curriculum arrays or scoring rules.

## Module dependency graph

| Module | Depends on | Consumers | Test boundary |
| --- | --- | --- | --- |
| `domain/learning.ts` | nothing | all modules | TypeScript compilation |
| `data/topics.ts` | learning types | dashboard | registry lookup tests |
| `data/nova-mood-mission.ts` | learning types | engine and mission UI | unique stage/content IDs |
| `domain/sentence-builder.ts` | learning types | Speak UI and results | P1–P5 exact strings |
| `domain/mission-engine.ts` | types and mission data | store and player | start, validate, back, advance, finish |
| `domain/conversation-engine.ts` | types | Talk UI | reviewed prompt and scaffold fixtures |
| `domain/scoring.ts` | types | engine and results | evidence → exact rubric |
| `domain/dashboard-stats.ts` | types | dashboard | zero, in-progress, completed histories |
| `session/state-migration.ts` | types | repository | v1, v2, corrupt input |
| `session/local-storage-repository.ts` | migration | provider | load/save failure behavior |
| `session/learning-store.tsx` | repository and engine | routes/features | command integration through domain tests |
| `mascot/use-instruction-replay.ts` | browser speech API | mission shell | manual browser boundary |
| `session/use-voice-recorder.ts` | MediaRecorder | Speak/Talk controls | manual browser boundary |
| dashboard components | selectors, data, store | `/` | state-driven rendering |
| mission components | data, domain, store, audio | game route | full completion path |

## TDD sequence

### Cycle 1 — pure learning kernel

Red: write failing tests for P1–P5 sentences, transitions, Nova prompts, evidence scores, dashboard states, and v1 migration.

Green: add only the types and pure functions required to pass.

Refactor: remove duplicate normalization and stage lookup logic; confirm no pure module imports React or browser APIs.

Checkpoint: `test: define mood mission learning kernel`

### Cycle 2 — persistence commands

Red: exercise v1 migration, v2 reload, corrupt input, duplicate completion, and resume selection.

Green: add the v2 repository and store commands; persist after meaningful responses and stage transitions.

Refactor: keep serialization and browser failure handling outside React state transitions.

Checkpoint: `feat: add resumable student progress store`

### Cycle 3 — student dashboard vertical slice

Red: use selector fixtures for Start, Continue, and Play again states.

Green: render one student dashboard directly at `/`; render stats, topic grouping, and the first playable game card.

Refactor: split only components with a distinct responsibility and remove role-switch imports.

First meaningful preview gate: the dashboard visibly represents the new product and its Start action responds successfully.

Checkpoint: `feat: replace role dashboards with student home`

### Cycle 4 — Think and Speak vertical slice

Red: extend stage fixtures for three Think rounds and P1–P5 requirements.

Green: build the shared shell, situation rounds, mood picker, sentence ladder, replay, recording, typing, and spoken-confirmation controls.

Refactor: keep stage rendering declarative and revoke recording URLs on retry and unmount.

Checkpoint: `feat: build think and sentence ladder modules`

### Cycle 5 — Talk, scoring, and results

Red: add a complete no-microphone acceptance fixture and verify repeated completion is idempotent.

Green: build Nova's three-turn conversation, calculate evidence scores, save results, and update dashboard stats.

Refactor: keep prompt branching out of the mascot UI and chosen-emotion judgment out of scoring.

Checkpoint: `feat: complete nova conversation and results`

### Cycle 6 — cleanup and delivery

- Delete obsolete parent, learner, Brave Mic, approval, and lock modules.
- Update metadata, README, and WebMCP tools.
- Run tests, type-checking, lint, and production build.
- Publish only the validated branch version through the existing Site.

Checkpoint: `chore: remove legacy role experience`

## Revised visible sequence

| Stop | Module | Required evidence |
| ---: | --- | --- |
| 1 | Welcome | Start selected |
| 2 | Let's Think | Three situation responses with at least one mood each |
| 3 | Speak P1 | Feeling selected |
| 4 | Speak P2 | Situation added |
| 5 | Speak P3 | Reason added |
| 6 | Speak P4 | Natural opener/intensity chosen and practice attempted |
| 7 | Speak P5 | Personal example selected or typed |
| 8 | Talk: feeling | Answer attempted by voice, text, suggestion, or confirmation |
| 9 | Talk: reason | Reason answer attempted |
| 10 | Talk: life | Personal-life answer or safe suggestion attempted |
| 11 | Results | Attempt saved once |

## Branch quality gates

Every checkpoint must meet the gates available at that layer:

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

During red steps, only the newly introduced tests are expected to fail. A checkpoint is created only after the complete suite is green.

## Completion evidence

- Branch name starts with `codex/` and never modifies `main` directly.
- Commit history follows dependency order.
- Pure behavior has unit-test evidence.
- Dashboard and game use the same v2 state selectors.
- The entire game can be completed with microphone permission denied.
- Refresh resumes a game without duplicating a completed attempt.
- Parent/teacher approval concepts do not remain in visible UI or active state.
