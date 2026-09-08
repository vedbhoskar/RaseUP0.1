'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { INITIAL_LEARNING_STATE, type LearningAttempt, type LearningState } from '@/src/domain/learning';

const STORAGE_KEY = 'raseup-learning-state-v1';

type LearningStore = {
  state: LearningState;
  ready: boolean;
  approveJourney: () => void;
  saveAttempt: (attempt: LearningAttempt) => void;
  resetDemo: () => void;
};

const LearningContext = createContext<LearningStore | null>(null);

export function LearningProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<LearningState>(INITIAL_LEARNING_STATE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) setState(JSON.parse(stored) as LearningState);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (ready) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [ready, state]);

  const approveJourney = useCallback(() => setState((current) => ({ ...current, approvalStatus: 'approved' })), []);
  const saveAttempt = useCallback((attempt: LearningAttempt) => setState((current) => {
    if (current.attempts.some((item) => item.id === attempt.id)) return current;
    return { ...current, streak: current.streak + 1, attempts: [attempt, ...current.attempts] };
  }), []);
  const resetDemo = useCallback(() => setState(INITIAL_LEARNING_STATE), []);

  const value = useMemo(() => ({ state, ready, approveJourney, saveAttempt, resetDemo }), [state, ready, approveJourney, saveAttempt, resetDemo]);
  return <LearningContext.Provider value={value}>{children}</LearningContext.Provider>;
}

export function useLearningStore() {
  const context = useContext(LearningContext);
  if (!context) throw new Error('useLearningStore must be used within LearningProvider');
  return context;
}
