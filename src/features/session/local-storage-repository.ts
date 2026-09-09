import { INITIAL_STUDENT_STATE, type StudentState } from '@/src/domain/learning';
import { migrateLearningState } from './state-migration';

const V1_KEY = 'raseup-learning-state-v1';
const V2_KEY = 'raseup-student-state-v2';

type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

export interface LearningRepository {
  load(): StudentState;
  save(state: StudentState): boolean;
  clear(): void;
}

export class LocalStorageLearningRepository implements LearningRepository {
  constructor(private readonly storage: StorageLike) {}

  load() {
    try {
      const v2 = this.storage.getItem(V2_KEY);
      if (v2) return migrateLearningState(JSON.parse(v2));
      const v1 = this.storage.getItem(V1_KEY);
      if (!v1) return structuredClone(INITIAL_STUDENT_STATE);
      const migrated = migrateLearningState(JSON.parse(v1));
      this.storage.setItem(V2_KEY, JSON.stringify(migrated));
      return migrated;
    } catch {
      return structuredClone(INITIAL_STUDENT_STATE);
    }
  }

  save(state: StudentState) {
    try {
      this.storage.setItem(V2_KEY, JSON.stringify(state));
      return true;
    } catch {
      return false;
    }
  }

  clear() {
    try { this.storage.removeItem(V2_KEY); } catch { /* Storage may be unavailable. */ }
  }
}
