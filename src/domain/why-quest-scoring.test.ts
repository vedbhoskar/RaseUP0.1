import { describe, expect, it } from 'vitest';
import { scoreWhyQuest } from './why-quest-scoring';
import { createWhyAttempt } from './why-quest-engine';

describe('Why Quest evidence scoring', () => {
  it('scores completed reasoning evidence without judging the chosen emotions', () => {
    const base = createWhyAttempt('why-1', new Date());
    const completed = {
      ...base,
      response: {
        ...base.response,
        thinkResponses: ['a', 'b', 'c', 'd', 'e'].map((situationId) => ({ situationId, moods: ['unsure' as const], reason: 'That is how it feels to me' })),
        feeling: 'sad' as const,
        secondFeeling: 'happy' as const,
        laterFeeling: 'proud' as const,
        reasonText: 'I worked hard',
        secondReasonText: 'I wanted to succeed',
        changeReasonText: 'people supported me',
        mainReasonText: 'my effort mattered',
        reflectionReasonText: 'I learned from it',
        talkAnswers: ['why-talk-direct', 'why-talk-reflect', 'why-talk-advanced'].map((turnId) => ({ turnId: turnId as 'why-talk-direct' | 'why-talk-reflect' | 'why-talk-advanced', mode: 'text' as const, text: 'Because it matters to me.', attempted: true, retryCount: 0 })),
      },
      practiceStageIds: ['why-speak-p6' as const, 'why-speak-p7' as const],
    };

    expect(scoreWhyQuest(completed)).toEqual({
      overall: 100,
      feelingRecognition: 100,
      situationConnection: 100,
      reasonBuilding: 100,
      speakingPractice: 100,
    });
  });
});
