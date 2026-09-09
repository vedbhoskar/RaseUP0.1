'use client';

import { Mic2, Pause, Play, RotateCcw, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVoiceRecorder } from '@/src/features/session/use-voice-recorder';

export function VoicePractice({ complete, onComplete }: { complete: boolean; onComplete: () => void }) {
  const recorder = useVoiceRecorder();
  return <div className="voice-practice"><div className="voice-controls">
    {recorder.status !== 'recording' ? <Button variant="outline" onClick={() => void recorder.start()} disabled={recorder.status === 'requesting'}><Mic2 /> {recorder.status === 'requesting' ? 'Opening microphone…' : recorder.status === 'recorded' ? 'Record again' : 'Record my voice'}</Button> : <Button className="recording-button" onClick={recorder.stop}><Pause /> Stop</Button>}
    {recorder.audioUrl && <><Button variant="outline" onClick={recorder.play}><Play /> Replay my answer</Button><Button variant="ghost" onClick={recorder.reset}><RotateCcw /> Try again</Button></>}
  </div>{(recorder.status === 'denied' || recorder.status === 'unavailable') && <p className="voice-note">The microphone is not available. You can still say the sentence aloud and continue.</p>}
  <button className={`spoken-confirm ${complete ? 'complete' : ''}`} onClick={onComplete}><Volume2 /> {complete ? 'Speaking practice complete' : 'I said the sentence aloud'}</button></div>;
}
