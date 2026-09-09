import { createAttempt } from '@/src/domain/mission-engine';
import { scoreMission } from '@/src/domain/scoring';
import type { GameAttempt, StudentState } from '@/src/domain/learning';

export function startOrResumeGame(state: StudentState, createId: () => string, now: Date) {
  const active = state.attempts.find((attempt) => attempt.gameId === 'nova-mood-mission' && attempt.status === 'in-progress');
  if (active) return { state, attemptId: active.id, action: 'resumed' as const };
  const attempt = createAttempt(createId(), now);
  return { state: { ...state, attempts: [attempt, ...state.attempts] }, attemptId: attempt.id, action: 'started' as const };
}

export function replaceAttempt(state: StudentState, nextAttempt: GameAttempt) {
  if (!state.attempts.some((attempt) => attempt.id === nextAttempt.id)) return state;
  return { ...state, attempts: state.attempts.map((attempt) => attempt.id === nextAttempt.id ? nextAttempt : attempt) };
}

export function completeGame(state: StudentState, attemptId: string, now: Date) {
  const current = state.attempts.find((attempt) => attempt.id === attemptId);
  if (!current || current.status === 'completed') return state;
  const completed: GameAttempt = {
    ...current,
    status: 'completed',
    currentStageId: 'results',
    completedAt: now.toISOString(),
    score: scoreMission(current),
  };
  const playedOn = now.toISOString().slice(0, 10);
  return {
    ...replaceAttempt(state, completed),
    streak: {
      current: state.streak.lastPlayedOn === playedOn ? state.streak.current : state.streak.current + 1,
      lastPlayedOn: playedOn,
    },
  };
}
