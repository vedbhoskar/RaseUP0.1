import { INITIAL_STUDENT_STATE, type LegacyAttempt, type StudentState } from '@/src/domain/learning';

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

export function migrateLearningState(value: unknown): StudentState {
  if (isRecord(value) && value.schemaVersion === 2 && Array.isArray(value.attempts)) return value as StudentState;
  if (!isRecord(value)) return structuredClone(INITIAL_STUDENT_STATE);

  const legacyAttempts: LegacyAttempt[] = Array.isArray(value.attempts) ? value.attempts.filter(isRecord).map((attempt, index) => ({
    id: typeof attempt.id === 'string' ? attempt.id : `legacy-${index}`,
    title: typeof attempt.journeyTitle === 'string' ? attempt.journeyTitle : 'Previous activity',
    completedAt: typeof attempt.completedAt === 'string' ? attempt.completedAt : new Date(0).toISOString(),
    score: typeof attempt.score === 'number' ? attempt.score : 0,
    sentence: typeof attempt.sentence === 'string' ? attempt.sentence : '',
  })) : [];

  return {
    schemaVersion: 2,
    student: { id: 'local-student', displayName: typeof value.learnerName === 'string' ? value.learnerName : 'Aarav' },
    attempts: [],
    legacyAttempts,
    streak: { current: typeof value.streak === 'number' ? value.streak : 0 },
  };
}
