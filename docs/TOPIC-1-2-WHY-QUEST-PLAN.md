# Topic 1.2 — Nova's Why Quest

## Product decision

Topic 1.2 becomes a second game inside **Self Awareness & Identity**. It keeps the trusted Topic 1.1 rhythm—Think, Speak, Talk, Results—but raises the reasoning demand from naming a feeling to explaining, comparing, and reflecting on reasons.

The game is named **Nova's Why Quest**. It is designed for a 12–15 minute independent student session.

## Curriculum critique and validation

The workbook progression is strong: it moves from a single reason to multiple reasons, changing feelings, mixed feelings, a main reason, honest expression, and reflection. Two adaptations are necessary for a digital game:

1. P1–P7 are related speaking patterns, but they are not one continuously expanding sentence. The UI will therefore use a reusable **pattern ladder** that preserves each pattern as its own thinking tool.
2. Five Think situations and twelve Talk prompts would be too much in one sitting. Think keeps all five short situations in one guided round sequence; Talk samples three reviewed prompts with increasing depth (direct, personal reflection, advanced thinking).

The game never scores which feeling a student chooses. It scores only observable learning evidence: completing reflections, connecting feelings to reasons, building clearer patterns, and attempting speaking practice.

## Learning sequence

| Stop | Phase | Learning job | Completion evidence |
| --- | --- | --- | --- |
| 1 | Welcome | Understand the mission | Student starts |
| 2 | Let's Think | Respond to five situations with feeling(s) and a reason | Every situation has a feeling and reason |
| 3 | P1 Clear reason | `I feel ___ because ___.` | Feeling + reason |
| 4 | P2 Multiple reasons | Add a second reason | Two reasons |
| 5 | P3 Change in feelings | Contrast an earlier and later feeling | Initial feeling + later feeling + reason |
| 6 | P4 Internal conflict | Name two simultaneous feelings | Two feelings |
| 7 | P5 Main reason | Prioritise one reason | Main reason |
| 8 | P6 Honest expression | Practise the honest-expression pattern aloud | Voice attempt or spoken confirmation |
| 9 | P7 Reflection | Look back and explain a past feeling | Reflection reason + practice attempt |
| 10 | Let's Talk: Direct | Explain a familiar feeling to Nova | Answer attempted |
| 11 | Let's Talk: Reflection | Connect a reason to personal experience | Answer attempted |
| 12 | Let's Talk: Advanced | Explain how two feelings can coexist | Answer attempted |
| 13 | Results | Review evidence and sentence patterns | Attempt is scored and saved |

## Module architecture

```text
Topic registry
  ├── Nova's Mood Mission (1.1)
  └── Nova's Why Quest (1.2)
        ├── Why Quest content definitions
        ├── Why Quest stage engine
        ├── Why sentence-pattern builders
        └── Why Quest evidence scoring

Shared interaction modules
  ├── Student dashboard + game cards
  ├── Mission shell + stage progress
  ├── Mood picker
  ├── Pattern ladder
  ├── Option/text builders
  ├── Voice practice with microphone-free fallback
  ├── Nova conversation surface
  ├── Results surface
  └── Local persisted learning store
```

Game-specific domain rules stay separate so Topic 1.2 cannot silently change Topic 1.1. Shared components receive configuration or data instead of importing one game's constants.

## TDD build order

1. Define Topic 1.2 content, stage order, and exact P1–P7 sentence outputs.
2. Test stage gates and back/forward preservation.
3. Test evidence scoring and the rule that emotion identity is never judged.
4. Generalise shared progress, dashboard, conversation, ladder, and results components.
5. Build the Topic 1.2 route and player from those modules.
6. Validate old and new domain tests, type checking, linting, production build, and a meaningful browser preview.

## Acceptance checks

- Topic 1.1 remains resumable and unchanged in learning intent.
- Topic 1.2 has its own resumable attempt and route.
- Starting one game never resumes the other.
- All five Think situations require a reason but accept any feeling.
- P1–P7 render the reviewed curriculum grammar.
- Every voice task offers replay/retry and a microphone-free completion path.
- Nova's three prompts progress from direct to reflective to advanced.
- Dashboard status is calculated per game.
- Local progress survives refresh.

