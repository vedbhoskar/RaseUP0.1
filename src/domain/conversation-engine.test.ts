import { describe, expect, it } from 'vitest';
import { getMascotTurn, getScaffold } from './conversation-engine';

describe('Nova conversation engine', () => {
  it('uses reviewed curriculum prompts for each talk stage', () => {
    expect(getMascotTurn('talk-feeling').prompt).toBe('How do you feel when you win a game?');
    expect(getMascotTurn('talk-reason').prompt).toBe('Why do you feel that way?');
    expect(getMascotTurn('talk-life').prompt).toBe('When did you feel proud?');
    expect(getMascotTurn('why-talk-direct').prompt).toContain('Why do you feel nervous');
    expect(getMascotTurn('why-talk-reflect').prompt).toContain('proud recently');
    expect(getMascotTurn('why-talk-advanced').prompt).toContain('two emotions');
  });

  it('offers a because scaffold without judging the answer', () => {
    expect(getScaffold('talk-reason', '')).toBe('You can start with “because…”');
    expect(getScaffold('talk-reason', 'Because my friend helped me.')).toBeNull();
  });
});
