import { describe, expect, it } from 'vitest';
import { buildP1, buildP2, buildP3, buildP4, buildP5 } from './sentence-builder';

describe('Mood Mission sentence ladder', () => {
  it('expands one idea through P1 to P5', () => {
    expect(buildP1('nervous')).toBe('I feel nervous.');
    expect(buildP2('nervous', 'I speak in class.')).toBe('I feel nervous when I speak in class.');
    expect(buildP3('nervous', 'I speak in class.', 'I might make mistakes.')).toBe(
      'I feel nervous when I speak in class because I might make mistakes.',
    );
    expect(buildP4({ feeling: 'nervous', situation: 'I speak in class.', reason: 'I might make mistakes.', intensity: 'a little' })).toBe(
      'To be honest, I feel a little nervous when I speak in class because I might make mistakes.',
    );
    expect(buildP5('proud', 'helping someone.')).toBe('One thing that makes me feel proud is helping someone.');
  });

  it('normalizes whitespace and terminal punctuation', () => {
    expect(buildP3('happy', '  I win a game! ', ' it is fun? ')).toBe('I feel happy when I win a game because it is fun.');
  });
});
