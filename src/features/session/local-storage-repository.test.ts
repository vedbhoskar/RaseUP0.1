import { describe, expect, it } from 'vitest';
import { INITIAL_STUDENT_STATE } from '@/src/domain/learning';
import { LocalStorageLearningRepository } from './local-storage-repository';

class MemoryStorage {
  values = new Map<string, string>();
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { this.values.set(key, value); }
  removeItem(key: string) { this.values.delete(key); }
}

describe('local learning repository', () => {
  it('migrates v1 data and writes v2 only after a successful conversion', () => {
    const storage = new MemoryStorage();
    storage.setItem('raseup-learning-state-v1', JSON.stringify({ learnerName: 'Mira', attempts: [], streak: 2 }));
    const repository = new LocalStorageLearningRepository(storage);

    expect(repository.load().student.displayName).toBe('Mira');
    expect(JSON.parse(storage.getItem('raseup-student-state-v2') ?? '{}').schemaVersion).toBe(2);
  });

  it('falls back safely when storage throws', () => {
    const broken = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); }, removeItem() {} };
    const repository = new LocalStorageLearningRepository(broken);
    expect(repository.load()).toEqual(INITIAL_STUDENT_STATE);
    expect(repository.save(INITIAL_STUDENT_STATE)).toBe(false);
  });
});
