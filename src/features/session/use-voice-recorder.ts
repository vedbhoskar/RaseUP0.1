'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type RecorderStatus = 'idle' | 'requesting' | 'recording' | 'recorded' | 'denied' | 'unavailable';

export function useVoiceRecorder() {
  const [status, setStatus] = useState<RecorderStatus>('idle');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  const recorder = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const chunks = useRef<Blob[]>([]);

  const reset = useCallback(() => {
    if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
    audioUrlRef.current = null;
    setAudioUrl(null);
    setStatus('idle');
  }, []);

  useEffect(() => () => {
    stream.current?.getTracks().forEach((track) => track.stop());
    if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
  }, []);

  const start = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setStatus('unavailable');
      return;
    }
    setStatus('requesting');
    try {
      const nextStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.current = nextStream;
      chunks.current = [];
      const nextRecorder = new MediaRecorder(nextStream);
      recorder.current = nextRecorder;
      nextRecorder.ondataavailable = (event) => { if (event.data.size) chunks.current.push(event.data); };
      nextRecorder.onstop = () => {
        if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
        const url = URL.createObjectURL(new Blob(chunks.current, { type: nextRecorder.mimeType || 'audio/webm' }));
        audioUrlRef.current = url;
        setAudioUrl(url);
        nextStream.getTracks().forEach((track) => track.stop());
        setStatus('recorded');
      };
      nextRecorder.start();
      setStatus('recording');
    } catch (error) {
      const denied = error instanceof DOMException && (error.name === 'NotAllowedError' || error.name === 'SecurityError');
      setStatus(denied ? 'denied' : 'unavailable');
    }
  }, []);

  const stop = useCallback(() => {
    if (recorder.current?.state === 'recording') recorder.current.stop();
  }, []);

  const play = useCallback(() => {
    if (audioUrlRef.current) void new Audio(audioUrlRef.current).play();
  }, []);

  return { status, audioUrl, start, stop, play, reset };
}
