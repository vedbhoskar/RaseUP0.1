import { MISSION_STAGES } from '@/src/data/nova-mood-mission';
import type { GameAttempt, StageId } from './learning';

export const STAGE_ORDER = MISSION_STAGES.map((stage) => stage.id);

export function createAttempt(id: string, now: Date): GameAttempt {
  return {
    id,
    gameId: 'nova-mood-mission',
    status: 'in-progress',
    startedAt: now.toISOString(),
    currentStageId: 'welcome',
    completedStageIds: [],
    response: { thinkResponses: [], talkAnswers: [] },
    practiceStageIds: [],
  };
}

export function canAdvance(attempt: GameAttempt) {
  const response = attempt.response;
  switch (attempt.currentStageId) {
    case 'welcome': return true;
    case 'think': return response.thinkResponses.length >= 3 && response.thinkResponses.every((item) => item.moods.length > 0);
    case 'speak-p1': return Boolean(response.feeling);
    case 'speak-p2': return Boolean(response.situationText?.trim());
    case 'speak-p3': return Boolean(response.reasonText?.trim());
    case 'speak-p4': return Boolean(response.intensity && attempt.practiceStageIds.includes('speak-p4'));
    case 'speak-p5': return Boolean(response.personalExample?.trim());
    case 'talk-feeling':
    case 'talk-reason':
    case 'talk-life': return response.talkAnswers.some((answer) => answer.turnId === attempt.currentStageId && answer.attempted);
    case 'results': return false;
    default: return false;
  }
}

export function advanceAttempt(attempt: GameAttempt): GameAttempt {
  if (!canAdvance(attempt)) return attempt;
  const index = STAGE_ORDER.indexOf(attempt.currentStageId);
  const next = STAGE_ORDER[Math.min(index + 1, STAGE_ORDER.length - 1)] as StageId;
  return {
    ...attempt,
    currentStageId: next,
    completedStageIds: attempt.completedStageIds.includes(attempt.currentStageId) ? attempt.completedStageIds : [...attempt.completedStageIds, attempt.currentStageId],
  };
}

export function goBack(attempt: GameAttempt): GameAttempt {
  const index = STAGE_ORDER.indexOf(attempt.currentStageId);
  return index <= 0 ? attempt : { ...attempt, currentStageId: STAGE_ORDER[index - 1] as StageId };
}
