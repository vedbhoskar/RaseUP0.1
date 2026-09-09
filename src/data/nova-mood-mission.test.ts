import { describe, expect, it } from 'vitest';
import { MISSION_STAGES, THINK_SITUATIONS } from './nova-mood-mission';

describe('Nova Mood Mission curriculum registry', () => {
  it('has eleven unique visible stops in dependency order', () => {
    const ids = MISSION_STAGES.map((stage) => stage.id);
    expect(ids).toHaveLength(11);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual(['welcome', 'think', 'speak-p1', 'speak-p2', 'speak-p3', 'speak-p4', 'speak-p5', 'talk-feeling', 'talk-reason', 'talk-life', 'results']);
  });

  it('covers positive, difficult, and mixed situation rounds', () => {
    expect(THINK_SITUATIONS.map((situation) => situation.category)).toEqual(['positive', 'difficult', 'mixed']);
  });
});
