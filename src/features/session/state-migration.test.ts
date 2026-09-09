import { describe, expect, it } from 'vitest';
import { migrateLearningState } from './state-migration';

describe('learning state migration', () => {
  it('preserves old attempts as legacy evidence instead of relabeling them', () => {
    const migrated = migrateLearningState({ learnerName: 'Aarav', parentName: 'Priya', approvalStatus: 'approved', streak: 3, attempts: [
      { id: 'old-1', journeyTitle: 'The Brave Mic', completedAt: '2026-09-08T10:00:00Z', score: 88, sentence: 'At first I felt nervous.' },
    ] });
    expect(migrated.schemaVersion).toBe(2);
    expect(migrated.student.displayName).toBe('Aarav');
    expect(migrated.legacyAttempts[0].title).toBe('The Brave Mic');
    expect(migrated.attempts).toEqual([]);
    expect('approvalStatus' in migrated).toBe(false);
  });

  it('returns a safe initial state for corrupt input', () => {
    expect(migrateLearningState('not-an-object').schemaVersion).toBe(2);
    expect(migrateLearningState(null).student.displayName).toBe('Aarav');
  });
});
