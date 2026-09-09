'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { INITIAL_STUDENT_STATE, type GameAttempt, type GameId, type StudentState } from '@/src/domain/learning';
import { completeGame, replaceAttempt, startOrResumeGame } from './learning-state';
import { LocalStorageLearningRepository } from './local-storage-repository';

type LearningStore = {
  state: StudentState;
  ready: boolean;
  persistent: boolean;
  startGame: (gameId: GameId) => string;
  updateAttempt: (attempt: GameAttempt) => void;
  completeGame: (attemptId: string) => void;
  resetProgress: () => void;
};

const LearningContext = createContext<LearningStore | null>(null);

export function LearningProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StudentState>(INITIAL_STUDENT_STATE);
  const [ready, setReady] = useState(false);
  const [persistent, setPersistent] = useState(true);
  const repository = useRef<LocalStorageLearningRepository | null>(null);

  useEffect(() => {
    repository.current = new LocalStorageLearningRepository(window.localStorage);
    const timer = window.setTimeout(() => {
      setState(repository.current?.load() ?? INITIAL_STUDENT_STATE);
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const saved = repository.current?.save(state) ?? false;
    if (!saved) {
      const timer = window.setTimeout(() => setPersistent(false), 0);
      return () => window.clearTimeout(timer);
    }
  }, [ready, state]);

  const startGame = useCallback((gameId: GameId) => {
    const result = startOrResumeGame(state, gameId, () => crypto.randomUUID(), new Date());
    setState(result.state);
    return result.attemptId;
  }, [state]);
  const updateAttempt = useCallback((attempt: GameAttempt) => setState((current) => replaceAttempt(current, attempt)), []);
  const finishGame = useCallback((attemptId: string) => setState((current) => completeGame(current, attemptId, new Date())), []);
  const resetProgress = useCallback(() => {
    repository.current?.clear();
    setState(structuredClone(INITIAL_STUDENT_STATE));
    setPersistent(true);
  }, []);

  const value = useMemo(() => ({ state, ready, persistent, startGame, updateAttempt, completeGame: finishGame, resetProgress }), [state, ready, persistent, startGame, updateAttempt, finishGame, resetProgress]);
  return <LearningContext.Provider value={value}>{children}</LearningContext.Provider>;
}

export function useLearningStore() {
  const context = useContext(LearningContext);
  if (!context) throw new Error('useLearningStore must be used within LearningProvider');
  return context;
}
