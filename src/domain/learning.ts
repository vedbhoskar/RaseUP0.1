export type ApprovalStatus = 'needs-review' | 'approved';

export type SkillScore = {
  feeling: number;
  reason: number;
  speaking: number;
  reflection: number;
};

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
  approvalStatus: ApprovalStatus;
  attempts: LearningAttempt[];
  streak: number;
};

export const INITIAL_LEARNING_STATE: LearningState = {
  learnerName: 'Aarav',
  parentName: 'Priya',
  approvalStatus: 'needs-review',
  attempts: [],
  streak: 3,
};

export function averageSkill(attempts: LearningAttempt[], skill: keyof SkillScore) {
  if (!attempts.length) return 0;
  return Math.round(attempts.reduce((sum, attempt) => sum + attempt.skills[skill], 0) / attempts.length);
}
