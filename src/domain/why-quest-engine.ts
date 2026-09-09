import { WHY_QUEST_STAGES } from '@/src/data/nova-why-quest';
import type { GameAttempt, StageId } from './learning';

export const WHY_STAGE_ORDER = WHY_QUEST_STAGES.map((stage) => stage.id);

export function createWhyAttempt(id: string, now: Date): GameAttempt {
  return {
    id,
    gameId: 'nova-why-quest',
    status: 'in-progress',
    startedAt: now.toISOString(),
    currentStageId: 'why-welcome',
    completedStageIds: [],
    response: { thinkResponses: [], talkAnswers: [] },
    practiceStageIds: [],
  };
}

export function canAdvanceWhy(attempt: GameAttempt) {
  const response = attempt.response;
  switch (attempt.currentStageId) {
    case 'why-welcome': return true;
    case 'why-think': return response.thinkResponses.length >= 5 && response.thinkResponses.every((item) => item.moods.length > 0 && Boolean(item.reason?.trim()));
    case 'why-speak-p1': return Boolean(response.feeling && response.reasonText?.trim());
    case 'why-speak-p2': return Boolean(response.secondReasonText?.trim());
    case 'why-speak-p3': return Boolean(response.laterFeeling && response.changeReasonText?.trim());
    case 'why-speak-p4': return Boolean(response.secondFeeling && response.secondFeeling !== response.feeling);
    case 'why-speak-p5': return Boolean(response.mainReasonText?.trim());
    case 'why-speak-p6': return attempt.practiceStageIds.includes('why-speak-p6');
    case 'why-speak-p7': return Boolean(response.reflectionReasonText?.trim() && attempt.practiceStageIds.includes('why-speak-p7'));
    case 'why-talk-direct':
    case 'why-talk-reflect':
    case 'why-talk-advanced': return response.talkAnswers.some((answer) => answer.turnId === attempt.currentStageId && answer.attempted);
    case 'why-results': return false;
    default: return false;
  }
}

export function advanceWhyAttempt(attempt: GameAttempt): GameAttempt {
  if (!canAdvanceWhy(attempt)) return attempt;
  const index = WHY_STAGE_ORDER.indexOf(attempt.currentStageId);
  const next = WHY_STAGE_ORDER[Math.min(index + 1, WHY_STAGE_ORDER.length - 1)] as StageId;
  return {
    ...attempt,
    currentStageId: next,
    completedStageIds: attempt.completedStageIds.includes(attempt.currentStageId) ? attempt.completedStageIds : [...attempt.completedStageIds, attempt.currentStageId],
  };
}

export function goBackWhy(attempt: GameAttempt): GameAttempt {
  const index = WHY_STAGE_ORDER.indexOf(attempt.currentStageId);
  return index <= 0 ? attempt : { ...attempt, currentStageId: WHY_STAGE_ORDER[index - 1] as StageId };
}
