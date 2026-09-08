'use client';

import { useEffect, useRef, useState } from 'react';

export function useVoiceRecorder() {
  const [status, setStatus] = useState<'idle' | 'recording' | 'recorded' | 'unavailable'>('idle');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const recorder = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const chunks = useRef<Blob[]>([]);

  useEffect(() => () => {
    stream.current?.getTracks().forEach((track) => track.stop());
    if (audioUrl) URL.revokeObjectURL(audioUrl);
  }, [audioUrl]);

  async function start() {
    try {
      stream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunks.current = [];
      recorder.current = new MediaRecorder(stream.current);
      recorder.current.ondataavailable = (event) => { if (event.data.size) chunks.current.push(event.data); };
      recorder.current.onstop = () => {
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        setAudioUrl(URL.createObjectURL(new Blob(chunks.current, { type: recorder.current?.mimeType || 'audio/webm' })));
        stream.current?.getTracks().forEach((track) => track.stop());
        setStatus('recorded');
      };
      recorder.current.start();
      setStatus('recording');
    } catch {
      setStatus('unavailable');
    }
  }

  function stop() {
    if (recorder.current?.state === 'recording') recorder.current.stop();
  }

  function clear() {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setStatus('idle');
  }

  return { status, audioUrl, start, stop, clear };
}
