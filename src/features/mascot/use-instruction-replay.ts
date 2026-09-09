'use client';

import { useCallback, useEffect, useState } from 'react';

export function useInstructionReplay(text: string) {
  const [status, setStatus] = useState<'idle' | 'speaking' | 'unavailable'>('idle');

  const stop = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setStatus('idle');
  }, []);

  const replay = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
      setStatus('unavailable');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.05;
    utterance.onstart = () => setStatus('speaking');
    utterance.onend = () => setStatus('idle');
    utterance.onerror = () => setStatus('unavailable');
    window.speechSynthesis.speak(utterance);
  }, [text]);

  useEffect(() => () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
  }, [text]);

  return { status, replay, stop };
}
