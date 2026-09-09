import { describe, expect, it } from 'vitest';
import { createAttempt } from './mission-engine';
import { scoreMission } from './scoring';

describe('Mood Mission evidence scoring', () => {
  it('scores observable completion and never the identity of a feeling', () => {
    const base = createAttempt('attempt-1', new Date());
    const completed = {
      ...base,
      response: {
        thinkResponses: [
          { situationId: 'won-game', moods: ['sad' as const] },
          { situationId: 'lost-game', moods: ['happy' as const] },
          { situationId: 'spoke-class', moods: ['unsure' as const] },
        ],
        feeling: 'sad' as const,
        situationText: 'I win a game',
        reasonText: 'my friend was not there',
        intensity: 'really',
        personalExample: 'drawing pictures',
        talkAnswers: [
          { turnId: 'talk-feeling' as const, mode: 'text' as const, text: 'I feel mixed.', attempted: true, retryCount: 0 },
          { turnId: 'talk-reason' as const, mode: 'suggestion' as const, text: 'Because I wanted to share it.', attempted: true, retryCount: 0 },
          { turnId: 'talk-life' as const, mode: 'spoken-confirmation' as const, attempted: true, retryCount: 1 },
        ],
      },
      practiceStageIds: ['speak-p4' as const],
    };

    expect(scoreMission(completed)).toEqual({
      overall: 100,
      feelingRecognition: 100,
      situationConnection: 100,
      reasonBuilding: 100,
      speakingPractice: 100,
    });
  });
});
