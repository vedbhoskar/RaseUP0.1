import { describe, expect, it } from 'vitest';
import { advanceWhyAttempt, canAdvanceWhy, createWhyAttempt, goBackWhy } from './why-quest-engine';

describe('Why Quest stage engine', () => {
  it('uses a separate thirteen-stop sequence', () => {
    const original = createWhyAttempt('why-1', new Date('2026-09-09T10:00:00Z'));
    const next = advanceWhyAttempt(original);
    expect(original.currentStageId).toBe('why-welcome');
    expect(next.currentStageId).toBe('why-think');
    expect(next.completedStageIds).toEqual(['why-welcome']);
  });

  it('requires a feeling and reason for all five Think situations', () => {
    const attempt = { ...createWhyAttempt('why-1', new Date()), currentStageId: 'why-think' as const };
    expect(canAdvanceWhy(attempt)).toBe(false);
    const complete = {
      ...attempt,
      response: {
        ...attempt.response,
        thinkResponses: ['worked-hard', 'friend-helped', 'spoke-class', 'mistake-noticed', 'helped-unnoticed'].map((situationId, index) => ({
          situationId,
          moods: [index % 2 ? 'happy' as const : 'unsure' as const],
          reason: `reason ${index + 1}`,
        })),
      },
    };
    expect(canAdvanceWhy(complete)).toBe(true);
  });

  it('preserves response evidence when moving back', () => {
    const attempt = {
      ...createWhyAttempt('why-1', new Date()),
      currentStageId: 'why-speak-p2' as const,
      response: { ...createWhyAttempt('why-2', new Date()).response, reasonText: 'I tried hard' },
    };
    const previous = goBackWhy(attempt);
    expect(previous.currentStageId).toBe('why-speak-p1');
    expect(previous.response.reasonText).toBe('I tried hard');
  });
});
