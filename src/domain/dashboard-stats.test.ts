import { describe, expect, it } from 'vitest';
import { createAttempt } from './mission-engine';
import { getDashboardStats, getGameCardStatus } from './dashboard-stats';

describe('student dashboard selectors', () => {
  it('returns an honest zero state', () => {
    expect(getDashboardStats([])).toEqual({ completedGames: 0, averageScore: null, strongestSkill: null });
    expect(getGameCardStatus([])).toBe('start');
  });

  it('prioritizes a resumable attempt over completed history', () => {
    const inProgress = createAttempt('current', new Date());
    const completed = { ...createAttempt('done', new Date()), status: 'completed' as const };
    expect(getGameCardStatus([completed, inProgress])).toBe('continue');
    expect(getGameCardStatus([completed])).toBe('replay');
  });
});
