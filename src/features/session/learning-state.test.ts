import { describe, expect, it } from 'vitest';
import { INITIAL_STUDENT_STATE } from '@/src/domain/learning';
import { completeGame, startOrResumeGame } from './learning-state';

describe('student progress commands', () => {
  it('resumes the active mission instead of creating a duplicate', () => {
    const first = startOrResumeGame(INITIAL_STUDENT_STATE, 'nova-mood-mission', () => 'attempt-1', new Date('2026-09-09T10:00:00Z'));
    const second = startOrResumeGame(first.state, 'nova-mood-mission', () => 'attempt-2', new Date('2026-09-09T10:05:00Z'));

    expect(first.action).toBe('started');
    expect(second.action).toBe('resumed');
    expect(second.attemptId).toBe('attempt-1');
    expect(second.state.attempts).toHaveLength(1);
  });

  it('keeps a separate resumable attempt for each game', () => {
    const mood = startOrResumeGame(INITIAL_STUDENT_STATE, 'nova-mood-mission', () => 'mood-1', new Date());
    const why = startOrResumeGame(mood.state, 'nova-why-quest', () => 'why-1', new Date());
    const resumedWhy = startOrResumeGame(why.state, 'nova-why-quest', () => 'why-2', new Date());

    expect(why.state.attempts.map((attempt) => attempt.gameId)).toEqual(['nova-why-quest', 'nova-mood-mission']);
    expect(resumedWhy.attemptId).toBe('why-1');
    expect(resumedWhy.action).toBe('resumed');
  });

  it('completes and scores an attempt only once', () => {
    const started = startOrResumeGame(INITIAL_STUDENT_STATE, 'nova-mood-mission', () => 'attempt-1', new Date());
    const ready = {
      ...started.state,
      attempts: started.state.attempts.map((attempt) => ({
        ...attempt,
        response: {
          thinkResponses: [
            { situationId: 'one', moods: ['happy' as const] },
            { situationId: 'two', moods: ['sad' as const] },
            { situationId: 'three', moods: ['nervous' as const] },
          ],
          feeling: 'happy' as const,
          situationText: 'I win',
          reasonText: 'I tried',
          intensity: 'really',
          personalExample: 'helping',
          talkAnswers: [
            { turnId: 'talk-feeling' as const, mode: 'text' as const, attempted: true, retryCount: 0 },
            { turnId: 'talk-reason' as const, mode: 'text' as const, attempted: true, retryCount: 0 },
            { turnId: 'talk-life' as const, mode: 'text' as const, attempted: true, retryCount: 0 },
          ],
        },
        practiceStageIds: ['speak-p4' as const],
      })),
    };
    const once = completeGame(ready, 'attempt-1', new Date('2026-09-09T11:00:00Z'));
    const twice = completeGame(once, 'attempt-1', new Date('2026-09-09T11:01:00Z'));

    expect(once.attempts[0].status).toBe('completed');
    expect(once.attempts[0].score?.overall).toBe(100);
    expect(twice).toEqual(once);
  });
});
