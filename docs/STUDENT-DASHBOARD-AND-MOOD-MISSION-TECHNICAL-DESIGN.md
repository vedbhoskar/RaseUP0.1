# RaseUP Student Dashboard and Nova's Mood Mission

Status: product design reviewed on 9 September 2026; dependency and TDD details are refined in [`MOOD-MISSION-TDD-BUILD-PLAN.md`](MOOD-MISSION-TDD-BUILD-PLAN.md)  
Scope: replace the parent/learner split with one student experience and redesign the first game from the supplied Self Awareness & Identity curriculum.

## 1. Product decision

RaseUP will open directly to a student dashboard. The parent dashboard, learner dashboard, role switch, approval workflow, and locked-game state will be removed.

The first game will be named **Nova's Mood Mission**.

- Topic: Self Awareness & Identity
- Learning goal: notice a feeling, connect it to a situation and reason, expand it into a natural sentence, and speak about it in a short conversation.
- Audience: school-age learners using touch, mouse, keyboard, or microphone.
- Session length: 8–12 minutes.
- Core loop: **Let's Think → Let's Speak → Let's Talk → Results**.
- Mascot: **Nova**, a friendly conversation guide who prompts, listens, and encourages without judging a child's emotion.

## 2. Experience principles

1. A feeling is never graded as right or wrong. The game scores recognition, sentence construction, effort, detail, and reflection.
2. One decision appears at a time. Every stage has a visible goal and one primary action.
3. Every instructional stage has **Hear again**. Speaking stages also have **Replay my answer** and **Try again** when a recording exists.
4. Microphone use is optional. A learner can choose, type, or confirm that they spoke aloud.
5. Voice recordings remain in memory for the current stage and are discarded when the page closes unless a future consented storage feature is added.
6. The dashboard shows useful progress immediately and groups games by learning topic.

## 3. Information architecture

### Routes

| Route | Purpose |
| --- | --- |
| `/` | Student dashboard with stats, topic sections, and game cards |
| `/games/nova-mood-mission` | Game player and resumable session |
| `/games/nova-mood-mission/results` | Optional shareable results view; the MVP may render results inside the player |

The first implementation should use the first two routes. Add the results route only if refreshable result URLs are needed.

### Student dashboard

The first viewport contains:

1. Student greeting and current streak.
2. Four concise statistics: games completed, current streak, average communication score, and strongest skill.
3. A **Continue learning** card when an unfinished attempt exists.
4. Games grouped by topic. The initial release contains one topic and one playable game; the data model supports additional topics without duplicating dashboard code.

Topic section example:

```text
Self Awareness & Identity
└── Nova's Mood Mission
    8–12 min · Feelings · Reasons · Speaking
    [Start] / [Continue] / [Play again]
```

Do not show teacher, parent, approval, review, or unlock controls.

## 4. Complete game sequence

### Overview and timing

| Order | Phase | Time | Learner outcome |
| --- | --- | ---: | --- |
| 0 | Welcome | 20–30 sec | Understand Nova and the mission |
| 1–3 | Let's Think | 2–3 min | Match situations to possible feelings and explain one choice |
| 4–8 | Let's Speak | 3–4 min | Expand one thought from a word into a natural sentence |
| 9–12 | Let's Talk | 3–4 min | Answer Nova's questions in a guided conversation |
| 13 | Results | 30–60 sec | Review skill evidence, score, and next action |

### Stage 0 — Welcome: “Meet Nova”

- Nova says: “We feel different things in different moments. Let's find the words together.”
- Show the three mission stops: Think, Speak, Talk.
- Actions: **Hear again**, **Start mission**, **Back to dashboard**.
- Completion rule: learner selects Start mission.

### Let's Think — situation and mood recognition

#### Stage 1 — Happy or positive moment

- Situation is chosen from a small deterministic pool, for example: “You answered correctly in class” or “A friend shared with you.”
- Prompt: “How might you feel in this situation?”
- Choices: happy, proud, excited, nervous, sad, unsure.
- Follow-up: Nova acknowledges the choice without marking the emotion wrong.
- Actions: **Hear again**, **Choose another feeling**, **Continue**.

#### Stage 2 — Difficult moment

- Example: “You lost a game” or “A friend did not play with you.”
- Use the same mood-choice interaction so the learner develops a stable mental model.
- Ask for an optional short reason: “What makes you think that?”
- The reason can be selected from suggestions or entered as text.

#### Stage 3 — New or mixed moment

- Example: “You spoke in front of the class,” “You tried something new,” or “You made a mistake.”
- Allow more than one emotion to make mixed feelings visible.
- Prompt: “Could you feel two things at once?”
- Completion requires at least one feeling; selecting a second earns detail credit but is never required.

### Let's Speak — progressive sentence expansion

The same chosen situation and primary feeling carry through every step. The learner should see their sentence grow rather than receive unrelated exercises.

#### Stage 4 — P1: name the feeling

Template: `I feel [feeling].`

- Learner chooses or confirms a feeling.
- Nova reads the completed sentence.
- Actions: **Hear again**, **Say it**, **Replay my answer**, **Try again**, **Continue**.

#### Stage 5 — P2: add when

Template: `I feel [feeling] when [situation].`

- The previous sentence remains visible as a completed layer.
- Learner chooses a situation phrase or types a short one.
- Nova reads the expanded sentence.

#### Stage 6 — P3: add because

Template: `I feel [feeling] when [situation] because [reason].`

- Learner chooses a reason suggestion or types their own.
- Score sentence completeness, not the personal content of the reason.

#### Stage 7 — P4: speak naturally

Template: `To be honest, I feel [intensity] [feeling] when [situation] because [reason].`

- Optional intensity choices: a little, really, sometimes, very.
- Teach the learner that natural speech may add a soft opening or intensity word.
- Record/speak the full sentence one time.

#### Stage 8 — P5: transfer to the learner's life

Template: `One thing that makes me feel [feeling] is [personal example].`

- Provide safe suggestions plus a text option.
- This answer becomes the starting context for the mascot conversation.
- The personal example is not shown publicly or graded for sentiment.

### Let's Talk — guided conversation with Nova

The MVP uses a deterministic conversation engine, not an open-ended AI model. This makes prompts predictable, age-appropriate, testable, and functional without a server dependency.

#### Stage 9 — Warm-up question

- Nova asks one situation question, for example: “How do you feel when you win a game?”
- Learner answers by speaking or typing.
- Nova response pattern: acknowledge + reflect one selected feeling + ask the next question.

#### Stage 10 — Reason question

- Nova asks: “Why do you feel that way?”
- If the answer has no reason, Nova offers a scaffold: “You can start with ‘because…’”
- Learner may replay the prompt and retry the response.

#### Stage 11 — Personal-life question

- Nova asks one curriculum-aligned prompt such as “When did you feel proud?” or “What makes you feel happy every day?”
- The learner can skip personal detail and choose a suggested answer.
- Nova never asks for names, addresses, school names, contact details, or other identifying information.

#### Stage 12 — Conversation close

- Nova summarizes only the in-session learning structure: feeling + situation + reason.
- Example: “You named a feeling, explained when it happens, and told me why. That makes your idea clear.”
- Actions: **Hear again**, **Replay my last answer**, **Finish mission**.

### Stage 13 — Results

Show:

- Overall communication score.
- Four skill scores: Feeling Finder, Situation Connector, Reason Builder, Brave Speaker.
- The final expanded sentence.
- Stages completed and speaking attempts.
- Badge earned when applicable.
- Actions: **Back to dashboard**, **Play again**.

## 5. Interaction state machine

```text
dashboard
  └─ start/resume
      └─ welcome
          └─ think.situation-positive
              └─ think.situation-difficult
                  └─ think.situation-mixed
                      └─ speak.feeling
                          └─ speak.when
                              └─ speak.because
                                  └─ speak.natural
                                      └─ speak.personal
                                          └─ talk.warmup
                                              └─ talk.reason
                                                  └─ talk.personal
                                                      └─ talk.close
                                                          └─ results
```

Rules:

- `Continue` is disabled only when the required response for the current stage is missing.
- `Back` preserves previous responses.
- `Try again` clears only the current recording, never the sentence data.
- `Hear again` repeats the current instruction and never changes progress.
- Refresh resumes the latest incomplete attempt at its last completed stage.
- Finishing is idempotent: one attempt ID may be saved only once.
- Restarting creates a new attempt ID and preserves history.

## 6. Domain model

Replace the single hard-coded journey state with topic, game, progress, and attempt records.

```ts
export type TopicId = 'self-awareness';
export type GameId = 'nova-mood-mission';
export type ModuleKind = 'think' | 'speak' | 'talk';

export type TopicDefinition = {
  id: TopicId;
  title: string;
  description: string;
  order: number;
};

export type GameDefinition = {
  id: GameId;
  slug: string;
  topicId: TopicId;
  title: string;
  summary: string;
  estimatedMinutes: number;
  skills: SkillId[];
  stages: StageDefinition[];
};

export type StageDefinition = {
  id: string;
  module: ModuleKind;
  title: string;
  instruction: string;
  requiredFields: ResponseField[];
  replayable: true;
};

export type MoodId =
  | 'happy'
  | 'sad'
  | 'excited'
  | 'nervous'
  | 'proud'
  | 'scared'
  | 'unsure';

export type MissionResponse = {
  situationId?: string;
  moods: MoodId[];
  situationText?: string;
  reasonText?: string;
  intensity?: string;
  personalExample?: string;
  talkAnswers: TalkAnswer[];
};

export type TalkAnswer = {
  turnId: string;
  mode: 'voice' | 'text' | 'suggestion' | 'spoken-confirmation';
  text?: string;
  attempted: boolean;
  retryCount: number;
};

export type GameAttempt = {
  id: string;
  gameId: GameId;
  status: 'in-progress' | 'completed' | 'abandoned';
  startedAt: string;
  completedAt?: string;
  currentStageId: string;
  completedStageIds: string[];
  response: MissionResponse;
  speakingAttemptCount: number;
  score?: MissionScore;
};

export type MissionScore = {
  overall: number;
  feelingRecognition: number;
  situationConnection: number;
  reasonBuilding: number;
  speakingPractice: number;
};

export type StudentState = {
  schemaVersion: 2;
  student: { id: string; displayName: string };
  attempts: GameAttempt[];
  streak: { current: number; lastPlayedOn?: string };
};
```

## 7. Code architecture

### Target file structure

```text
app/
├── page.tsx                              # student dashboard route
└── games/
    └── nova-mood-mission/
        └── page.tsx                      # game route

src/
├── data/
│   ├── topics.ts                         # topic registry
│   └── nova-mood-mission.ts              # situations, stages, prompts, options
├── domain/
│   ├── learning.ts                       # topic/game/attempt types
│   ├── sentence-builder.ts               # progressive sentence functions
│   ├── mission-engine.ts                 # stage transition rules
│   ├── conversation-engine.ts            # safe deterministic mascot turns
│   ├── scoring.ts                        # rubric calculation
│   └── dashboard-stats.ts                # derived student statistics
├── features/
│   ├── dashboard/
│   │   ├── student-dashboard.tsx
│   │   ├── stats-grid.tsx
│   │   ├── topic-section.tsx
│   │   └── game-card.tsx
│   ├── mission/
│   │   ├── mood-mission-player.tsx
│   │   ├── mission-shell.tsx
│   │   ├── stage-actions.tsx
│   │   ├── mood-picker.tsx
│   │   ├── sentence-ladder.tsx
│   │   ├── mascot-conversation.tsx
│   │   └── mission-results.tsx
│   ├── mascot/
│   │   ├── nova.tsx
│   │   ├── mascot-message.tsx
│   │   └── use-instruction-replay.ts
│   └── session/
│       ├── learning-store.tsx
│       ├── learning-repository.ts
│       ├── local-storage-repository.ts
│       └── use-voice-recorder.ts
└── test/
    └── fixtures.ts
```

### Existing code changes

| Current module | Action | Reason |
| --- | --- | --- |
| `app/page.tsx` | Replace | Remove role switch and render `StudentDashboard` directly |
| `app/journey/brave-mic/page.tsx` | Replace route | Use `/games/nova-mood-mission` naming |
| `parent-dashboard.tsx` | Delete | Parent approval flow is no longer part of the product |
| `learner-dashboard.tsx` | Replace and rename | New dashboard groups games by topic and owns all student stats |
| `brave-mic-game.tsx` | Split into mission modules | Current single component mixes state, content, scoring, recording, and rendering |
| `brave-mic.ts` | Replace and rename | New content follows Think/Speak/Talk curriculum |
| `learning.ts` | Migrate to schema v2 | Remove `parentName` and `approvalStatus`; support multiple games |
| `learning-store.tsx` | Refactor | Expose attempt lifecycle commands instead of approval commands |
| `scoring.ts` | Replace rubric | Score observable learning actions, not fixed constants |
| `use-raseup-tools.ts` | Update | Remove approval tool and expose student summary/resume tools |

## 8. Function-level contracts

### Content registry

```ts
getTopic(topicId: TopicId): TopicDefinition
listTopics(): TopicDefinition[]
getGame(gameId: GameId): GameDefinition
listGamesByTopic(topicId: TopicId): GameDefinition[]
getStage(gameId: GameId, stageId: string): StageDefinition
```

Definitions are immutable data. Components must not embed situation pools, prompt strings, or score weights.

### Attempt lifecycle

```ts
startAttempt(state: StudentState, gameId: GameId, now: Date): GameAttempt
resumeAttempt(state: StudentState, gameId: GameId): GameAttempt | null
updateResponse(attempt: GameAttempt, patch: Partial<MissionResponse>): GameAttempt
canAdvance(attempt: GameAttempt, stage: StageDefinition): boolean
advanceStage(attempt: GameAttempt, game: GameDefinition): GameAttempt
goToPreviousStage(attempt: GameAttempt, game: GameDefinition): GameAttempt
restartCurrentStage(attempt: GameAttempt): GameAttempt
completeAttempt(attempt: GameAttempt, now: Date): GameAttempt
```

All domain functions are pure. The React store performs persistence after receiving the returned state.

### Sentence expansion

```ts
buildP1(feeling: MoodId): string
buildP2(feeling: MoodId, situation: string): string
buildP3(feeling: MoodId, situation: string, reason: string): string
buildP4(input: NaturalSentenceInput): string
buildP5(feeling: MoodId, personalExample: string): string
getSentenceForStage(stageId: string, response: MissionResponse): string
```

Input text must be trimmed and terminal punctuation normalized. Never alter the learner's chosen emotion or infer a diagnosis.

### Mascot conversation

```ts
startConversation(response: MissionResponse): ConversationState
getMascotTurn(state: ConversationState): MascotTurn
submitTalkAnswer(state: ConversationState, answer: TalkAnswer): ConversationState
getScaffold(turn: MascotTurn, answer: TalkAnswer): Scaffold | null
isConversationComplete(state: ConversationState): boolean
```

`MascotTurn` selects only from reviewed prompt templates. The function may branch on missing fields, response mode, or answer length, but not on sentiment labels such as “good” or “bad.”

### Scoring

```ts
scoreFeelingRecognition(attempt: GameAttempt): number
scoreSituationConnection(attempt: GameAttempt): number
scoreReasonBuilding(attempt: GameAttempt): number
scoreSpeakingPractice(attempt: GameAttempt): number
scoreMission(attempt: GameAttempt): MissionScore
```

Initial rubric:

| Skill | Weight | Evidence |
| --- | ---: | --- |
| Feeling recognition | 25% | Selected a feeling in all required situations; mixed feeling adds detail credit |
| Situation connection | 25% | Completed the `when` part and one transfer example |
| Reason building | 25% | Completed the `because` part and responded to Nova's reason prompt |
| Speaking practice | 25% | Attempted the speaking stages; recording is not required for full access |

Rules:

- A selected mood never earns or loses points because of which mood it is.
- A typed answer and a voice attempt are equivalent for core completion.
- Retrying cannot lower a score.
- Scores derive from saved evidence and contain no fixed “always 90” values.

### Dashboard statistics

```ts
getCompletedGameCount(attempts: GameAttempt[]): number
getCurrentStreak(state: StudentState, today: Date): number
getAverageScore(attempts: GameAttempt[]): number | null
getStrongestSkill(attempts: GameAttempt[]): SkillId | null
getGameCardStatus(state: StudentState, gameId: GameId): 'start' | 'continue' | 'replay'
getLatestAttempt(state: StudentState, gameId?: GameId): GameAttempt | null
```

The dashboard imports these selectors rather than calculating stats inside JSX.

### Audio and replay

```ts
useInstructionReplay(text: string): {
  status: 'idle' | 'speaking' | 'unavailable';
  replay(): void;
  stop(): void;
}

useVoiceRecorder(): {
  status: 'idle' | 'requesting' | 'recording' | 'recorded' | 'denied' | 'unavailable';
  audioUrl?: string;
  start(): Promise<void>;
  stop(): void;
  reset(): void;
}
```

Use browser speech synthesis for instructions in the MVP. Stop speech on stage change and component unmount. Revoke every recording object URL on retry and unmount to prevent memory leaks.

## 9. Store and persistence API

The React context should expose product commands rather than raw setters:

```ts
type LearningStore = {
  state: StudentState;
  ready: boolean;
  startGame(gameId: GameId): string;
  updateAttempt(attemptId: string, update: AttemptUpdate): void;
  completeGame(attemptId: string): void;
  abandonGame(attemptId: string): void;
  resetProgress(): void;
};
```

Use a repository boundary:

```ts
interface LearningRepository {
  load(): StudentState | null;
  save(state: StudentState): void;
  clear(): void;
}
```

The first adapter remains browser `localStorage`. This keeps the UI independent from a later server, account, or school data layer.

### v1 to v2 migration

1. Read `raseup-learning-state-v1` once.
2. Convert completed Brave Mic attempts into completed Nova's Mood Mission legacy attempts where fields can be mapped safely.
3. Remove `parentName` and `approvalStatus`.
4. Keep learner name, attempt dates, sentences, scores, and streak.
5. Save as `raseup-student-state-v2`.
6. Keep migration idempotent and do not delete v1 until the v2 save succeeds.

## 10. Component responsibilities

### `StudentDashboard`

- Loads derived stats and topic/game lists.
- Owns no scoring logic.
- Navigates Start/Continue/Replay to the game route with the selected attempt.
- Shows a friendly zero state when no attempt exists.

### `MoodMissionPlayer`

- Selects the current stage from the game definition.
- Coordinates store commands and the pure mission engine.
- Does not contain stage-specific curriculum strings.
- Renders one stage component through a typed stage renderer.

### `MissionShell`

- Shows Nova, phase name, stage progress, Back, Hear again, and dashboard exit.
- Provides a stable mobile and desktop layout so individual stages only supply content.
- Announces stage changes through an `aria-live="polite"` region.

### `SentenceLadder`

- Shows P1–P5 as stacked layers.
- Highlights the newest fragment (`feeling`, `when`, `because`, natural opener, or personal example).
- Calls the sentence-builder functions; it never concatenates sentence text itself.

### `MascotConversation`

- Renders Nova's current message and the learner response controls.
- Supports voice, typing, suggestions, replay, and retry.
- Receives the next reviewed turn from `conversation-engine.ts`.
- Does not call an external language model in the MVP.

## 11. Visual and responsive direction

Visual thesis: **a bright mission map inside a calm learning workspace**.

- Retain RaseUP's energetic colors, rounded controls, and clear progress bars.
- Make Nova the consistent visual anchor, not a decorative side illustration.
- Dashboard cards use topic color as an accent, while game status remains readable without color.
- The game uses one central activity card with a compact mission rail.
- Desktop: stats row, topic list, and two-column game cards; game uses mascot rail + activity panel.
- Mobile: single column; sticky bottom actions; progress and replay remain visible.
- Minimum regular text size: 16px; minimum interactive target: 44 × 44px.
- All mood choices include text labels and icons; never communicate meaning by color alone.
- Respect reduced-motion preferences and keep animation under 350ms.

## 12. Error, privacy, and accessibility states

| Condition | Required behavior |
| --- | --- |
| Local storage unavailable | Continue in memory and show a non-blocking “Progress will not be saved” notice |
| Corrupt saved state | Preserve a backup value, initialize v2 safely, and avoid a blank screen |
| Microphone denied | Offer typing and “I said it aloud” immediately |
| Recording unsupported | Hide recording controls but keep the stage completable |
| Speech synthesis unsupported | Disable Hear again with an accessible explanation |
| Interrupted recording | Preserve sentence data and allow retry |
| Refresh mid-game | Resume at the last completed stage |
| Keyboard use | Visible focus, logical order, Enter/Space activation, no keyboard trap |
| Screen reader | Stage title is the page heading; progress and feedback are announced |

No answer should request or store personally identifying details. Do not upload recordings or persist blob URLs.

## 13. WebMCP surface

Remove `approve_brave_mic`. Retain a small task-oriented surface:

```ts
read_student_summary(): {
  student: string;
  completedGames: number;
  currentStreak: number;
  averageScore: number | null;
  resumableGame: string | null;
}

start_or_resume_mood_mission(): {
  gameId: 'nova-mood-mission';
  attemptId: string;
  action: 'started' | 'resumed';
  path: '/games/nova-mood-mission';
}
```

The first tool is read-only. The second changes only the student's local game state and must be idempotent when an in-progress attempt already exists.

## 14. Test plan

### Unit tests

- P1–P5 sentence builders normalize spaces and punctuation.
- Every stage validates only its declared required fields.
- Back/continue/retry preserve the correct data.
- Duplicate completion does not create duplicate attempts.
- Scoring never depends on the identity of the chosen mood.
- Dashboard stats ignore abandoned attempts.
- Conversation prompts remain within the reviewed prompt registry.
- v1 state migrates to v2 exactly once.

### Component tests

- Dashboard displays start, continue, and replay states.
- Each stage exposes Hear again.
- Microphone denial reveals non-voice alternatives.
- Sentence ladder carries values through P1–P5.
- Mascot conversation can complete entirely by keyboard and text.
- Results update dashboard stats after returning home.

### End-to-end acceptance path

1. Open `/` and see a student dashboard without a role switch.
2. Start Nova's Mood Mission from Self Awareness & Identity.
3. Complete three situation/mood stages.
4. Expand one sentence through P1–P5.
5. Replay at least one instruction and retry one response.
6. Complete the Nova conversation without granting microphone permission.
7. Finish and see evidence-based scores.
8. Return to the dashboard and see updated stats and Replay status.
9. Refresh and confirm progress remains saved.

## 15. Implementation sequence

### Slice 1 — state and content foundation

1. Add v2 domain types, topic registry, and Nova's Mood Mission definition.
2. Implement sentence builder, mission engine, dashboard selectors, and tests.
3. Add v1-to-v2 migration and repository boundary.

### Slice 2 — direct student dashboard

1. Replace the role-based home page.
2. Build stats, topic section, and game-card components.
3. Remove all parent approval and locked-journey behavior.

### Slice 3 — Let's Think and Let's Speak

1. Build the shared mission shell and stage actions.
2. Implement the three situation/mood stages.
3. Implement the P1–P5 sentence ladder.
4. Add instruction replay and recording alternatives to every applicable stage.

### Slice 4 — Let's Talk and results

1. Implement the deterministic Nova conversation engine.
2. Build voice/text/suggestion answer controls.
3. Replace fixed scoring with evidence-based scoring.
4. Save results and update dashboard stats.

### Slice 5 — removal and verification

1. Delete parent, approval, lock, and old Brave Mic modules after imports are removed.
2. Update WebMCP tools and README architecture notes.
3. Run unit tests, type-checking, linting, and production build.
4. Verify the complete keyboard-only and microphone-denied paths.

## 16. Definition of done

- `/` opens directly to one student dashboard.
- Games are rendered from topic-grouped data rather than hard-coded dashboard JSX.
- Nova's Mood Mission implements Think, Speak, Talk, and Results in order.
- The sentence expands visibly through all five curriculum patterns.
- Every stage can replay its instruction; recorded stages can replay and retry answers.
- The Nova conversation works without a microphone or network AI service.
- Scores use observable evidence and never judge which feeling was selected.
- Refresh resumes incomplete work and completed results update dashboard stats.
- Parent/teacher approval code, UI, copy, and stored fields are removed or migrated.
- Unit tests, type-checking, linting, and production build pass.
