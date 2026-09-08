import { describe, expect, it } from 'vitest';
import { buildFeelingChangeSentence, scoreAttempt } from './scoring';

describe('Brave Mic learning evidence', () => {
  it('builds the target curriculum sentence', () => {
    expect(buildFeelingChangeSentence('nervous', 'proud', 'I completed my talk.')).toBe(
      'At first I felt nervous, but later I felt proud because I completed my talk.',
    );
  });

  it('recognises recorded practice without grading the selected feeling', () => {
    expect(scoreAttempt('recorded')).toEqual({
      score: 96,
      skills: { feeling: 100, reason: 90, speaking: 100, reflection: 92 },
    });
  });
});
