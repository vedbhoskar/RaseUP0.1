export type TopicId = string;
export type GameId = 'nova-mood-mission';
export type ModuleKind = 'welcome' | 'think' | 'speak' | 'talk' | 'results';
export type StageId =
  | 'welcome'
  | 'think'
  | 'speak-p1'
  | 'speak-p2'
  | 'speak-p3'
  | 'speak-p4'
  | 'speak-p5'
  | 'talk-feeling'
  | 'talk-reason'
  | 'talk-life'
  | 'results';

export type MoodId = 'happy' | 'sad' | 'excited' | 'nervous' | 'proud' | 'scared' | 'unsure';
export type SkillId = 'feelingRecognition' | 'situationConnection' | 'reasonBuilding' | 'speakingPractice';

export type TopicDefinition = { id: TopicId; title: string; description: string; order: number };
export type StageDefinition = { id: StageId; module: ModuleKind; label: string; title: string; instruction: string };
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
export type SituationDefinition = { id: string; category: 'positive' | 'difficult' | 'mixed'; text: string; prompt: string };
export type ThinkResponse = { situationId: string; moods: MoodId[]; reason?: string };
export type TalkAnswer = {
  turnId: Extract<StageId, `talk-${string}`>;
  mode: 'voice' | 'text' | 'suggestion' | 'spoken-confirmation';
  text?: string;
  attempted: boolean;
  retryCount: number;
};
export type MissionResponse = {
  thinkResponses: ThinkResponse[];
  feeling?: MoodId;
  situationText?: string;
  reasonText?: string;
  intensity?: string;
  personalExample?: string;
  talkAnswers: TalkAnswer[];
};
export type MissionScore = Record<SkillId, number> & { overall: number };
export type GameAttempt = {
  id: string;
  gameId: GameId;
  status: 'in-progress' | 'completed' | 'abandoned';
  startedAt: string;
  completedAt?: string;
  currentStageId: StageId;
  completedStageIds: StageId[];
  response: MissionResponse;
  practiceStageIds: StageId[];
  score?: MissionScore;
};
export type LegacyAttempt = { id: string; title: string; completedAt: string; score: number; sentence: string };
export type StudentState = {
  schemaVersion: 2;
  student: { id: string; displayName: string };
  attempts: GameAttempt[];
  legacyAttempts: LegacyAttempt[];
  streak: { current: number; lastPlayedOn?: string };
};

export const INITIAL_STUDENT_STATE: StudentState = {
  schemaVersion: 2,
  student: { id: 'local-student', displayName: 'Aarav' },
  attempts: [],
  legacyAttempts: [],
  streak: { current: 3 },
};

// Temporary v1 compatibility surface. Deleted after the role-based UI is removed.
export type SkillScore = { feeling: number; reason: number; speaking: number; reflection: number };
export type LearningAttempt = {
  id: string;
  journeyId: 'brave-mic';
  journeyTitle: string;
  completedAt: string;
  durationMinutes: number;
  score: number;
  beforeFeeling: string;
  afterFeeling: string;
  reason: string;
  sentence: string;
  skills: SkillScore;
};
export type LearningState = {
  learnerName: string;
  parentName: string;
  approvalStatus: 'needs-review' | 'approved';
  attempts: LearningAttempt[];
  streak: number;
};
export const INITIAL_LEARNING_STATE: LearningState = {
  learnerName: 'Aarav', parentName: 'Priya', approvalStatus: 'needs-review', attempts: [], streak: 3,
};
export function averageSkill(attempts: LearningAttempt[], skill: keyof SkillScore) {
  if (!attempts.length) return 0;
  return Math.round(attempts.reduce((sum, attempt) => sum + attempt.skills[skill], 0) / attempts.length);
}
