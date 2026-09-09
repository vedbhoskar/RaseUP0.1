import { describe, expect, it } from 'vitest';
import { buildWhyP1, buildWhyP2, buildWhyP3, buildWhyP4, buildWhyP5, buildWhyP6, buildWhyP7 } from './why-sentence-builder';

describe('Why Quest sentence patterns', () => {
  it('builds all seven reviewed curriculum patterns', () => {
    expect(buildWhyP1('proud', 'I helped someone')).toBe('I feel proud because I helped someone.');
    expect(buildWhyP2('nervous', 'I am not confident', 'I am afraid of making mistakes')).toBe('I feel nervous because I am not confident, and also because I am afraid of making mistakes.');
    expect(buildWhyP3('scared', 'comfortable', 'people supported me')).toBe('At first I felt scared, but later I felt comfortable because people supported me.');
    expect(buildWhyP4('happy', 'nervous')).toBe('Part of me feels happy, but another part feels nervous.');
    expect(buildWhyP5('proud', 'I helped someone sincerely')).toBe('The main reason I feel proud is that I helped someone sincerely.');
    expect(buildWhyP6('sad', 'I felt left out')).toBe('To be honest, I feel sad because I felt left out.');
    expect(buildWhyP7('nervous', 'I was not prepared')).toBe('Looking back, I realize that I felt nervous because I was not prepared.');
  });

  it('normalises trailing punctuation without changing the learner wording', () => {
    expect(buildWhyP1('happy', 'someone supported me.')).toBe('I feel happy because someone supported me.');
  });
});

