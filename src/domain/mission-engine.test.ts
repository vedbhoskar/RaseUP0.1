import { describe, expect, it } from 'vitest';
import { createAttempt, advanceAttempt, canAdvance, goBack } from './mission-engine';

describe('Mood Mission stage engine', () => {
  it('starts at welcome and advances without mutating the old attempt', () => {
    const original = createAttempt('attempt-1', new Date('2026-09-09T10:00:00Z'));
    const next = advanceAttempt(original);
    expect(original.currentStageId).toBe('welcome');
    expect(next.currentStageId).toBe('think');
    expect(next.completedStageIds).toEqual(['welcome']);
  });

  it('requires three completed situation responses before leaving Think', () => {
    const attempt = { ...createAttempt('attempt-1', new Date()), currentStageId: 'think' as const };
    expect(canAdvance(attempt)).toBe(false);
    const complete = { ...attempt, response: { ...attempt.response, thinkResponses: [
      { situationId: 'won-game', moods: ['happy' as const] },
      { situationId: 'lost-game', moods: ['sad' as const] },
      { situationId: 'spoke-class', moods: ['nervous' as const, 'proud' as const] },
    ] } };
    expect(canAdvance(complete)).toBe(true);
  });

  it('preserves answers when moving back', () => {
    const attempt = { ...createAttempt('attempt-1', new Date()), currentStageId: 'speak-p2' as const };
    const previous = goBack(attempt);
    expect(previous.currentStageId).toBe('speak-p1');
    expect(previous.response).toEqual(attempt.response);
  });

  it('accepts a microphone-free answer in every Talk stage', () => {
    for (const stage of ['talk-feeling', 'talk-reason', 'talk-life'] as const) {
      const attempt = {
        ...createAttempt(`attempt-${stage}`, new Date()),
        currentStageId: stage,
        response: {
          thinkResponses: [],
          talkAnswers: [{ turnId: stage, mode: 'spoken-confirmation' as const, attempted: true, retryCount: 0 }],
        },
      };
      expect(canAdvance(attempt)).toBe(true);
    }
  });
});
