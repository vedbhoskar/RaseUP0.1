export type TopicId = string;
export type GameId = 'nova-mood-mission' | 'nova-why-quest';
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
  | 'results'
  | 'why-welcome'
  | 'why-think'
  | 'why-speak-p1'
  | 'why-speak-p2'
  | 'why-speak-p3'
  | 'why-speak-p4'
  | 'why-speak-p5'
  | 'why-speak-p6'
  | 'why-speak-p7'
  | 'why-talk-direct'
  | 'why-talk-reflect'
  | 'why-talk-advanced'
  | 'why-results';

export type MoodId = 'happy' | 'sad' | 'excited' | 'nervous' | 'proud' | 'scared' | 'unsure' | 'disappointed' | 'confused' | 'frustrated' | 'comfortable';
export type SkillId = 'feelingRecognition' | 'situationConnection' | 'reasonBuilding' | 'speakingPractice';

export type TopicDefinition = { id: TopicId; title: string; description: string; order: number };
export type StageDefinition = { id: StageId; module: ModuleKind; label: string; title: string; instruction: string };
export type GameDefinition = {
  id: GameId;
  slug: string;
  curriculumCode: string;
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
  turnId: Extract<StageId, `${string}talk-${string}`>;
  mode: 'voice' | 'text' | 'suggestion' | 'spoken-confirmation';
  text?: string;
  attempted: boolean;
  retryCount: number;
};
export type MissionResponse = {
  thinkResponses: ThinkResponse[];
  feeling?: MoodId;
  secondFeeling?: MoodId;
  laterFeeling?: MoodId;
  situationText?: string;
  reasonText?: string;
  secondReasonText?: string;
  changeReasonText?: string;
  mainReasonText?: string;
  reflectionReasonText?: string;
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
