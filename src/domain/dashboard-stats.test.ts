import { describe, expect, it } from 'vitest';
import { createAttempt } from './mission-engine';
import { getDashboardStats, getGameCardStatus } from './dashboard-stats';

describe('student dashboard selectors', () => {
  it('returns an honest zero state', () => {
    expect(getDashboardStats([])).toEqual({ completedGames: 0, averageScore: null, strongestSkill: null });
    expect(getGameCardStatus([], 'nova-mood-mission')).toBe('start');
  });

  it('prioritizes a resumable attempt over completed history', () => {
    const inProgress = createAttempt('current', new Date());
    const completed = { ...createAttempt('done', new Date()), status: 'completed' as const };
    expect(getGameCardStatus([completed, inProgress], 'nova-mood-mission')).toBe('continue');
    expect(getGameCardStatus([completed], 'nova-mood-mission')).toBe('replay');
    expect(getGameCardStatus([completed, inProgress], 'nova-why-quest')).toBe('start');
  });
});
