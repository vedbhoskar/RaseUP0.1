'use client';

import { Check, Mic2, Pause, Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAcknowledgement, getMascotTurn, getScaffold } from '@/src/domain/conversation-engine';
import type { GameAttempt, TalkAnswer } from '@/src/domain/learning';
import { canAdvance } from '@/src/domain/mission-engine';
import { useVoiceRecorder } from '@/src/features/session/use-voice-recorder';
import { StageActions } from './stage-actions';

type TalkStageId = TalkAnswer['turnId'];

export function MascotConversation({ attempt, onChange, onNext, onBack }: { attempt: GameAttempt; onChange: (attempt: GameAttempt) => void; onNext: () => void; onBack: () => void }) {
  const stageId = attempt.currentStageId as TalkStageId;
  const turn = getMascotTurn(stageId);
  const recorder = useVoiceRecorder();
  const answer = attempt.response.talkAnswers.find((item) => item.turnId === stageId);
  const scaffold = getScaffold(stageId, answer?.text ?? '');

  function saveAnswer(next: Omit<TalkAnswer, 'turnId' | 'retryCount'>) {
    const others = attempt.response.talkAnswers.filter((item) => item.turnId !== stageId);
    const retryCount = answer ? answer.retryCount + 1 : 0;
    onChange({ ...attempt, response: { ...attempt.response, talkAnswers: [...others, { ...next, turnId: stageId, retryCount }] } });
  }

  return <div className="conversation-stage"><div className="nova-dialogue"><span className="mini-nova"><i /><i /><i /></span><div><small>Nova</small><p>{turn.prompt}</p></div></div>{answer && <div className="nova-ack"><Check /> {getAcknowledgement(stageId)}</div>}<div className="talk-suggestions">{turn.suggestions.map((suggestion) => <button key={suggestion} className={answer?.text === suggestion ? 'selected' : ''} onClick={() => saveAnswer({ mode: 'suggestion', text: suggestion, attempted: true })}>{suggestion}</button>)}</div><label className="talk-input"><span>Type your answer</span><textarea value={answer?.mode === 'text' ? answer.text ?? '' : ''} onChange={(event) => saveAnswer({ mode: 'text', text: event.target.value, attempted: Boolean(event.target.value.trim()) })} placeholder="Write one short sentence…" /></label>{stageId === 'talk-reason' && scaffold && <p className="talk-scaffold">{scaffold}</p>}<div className="talk-voice-controls">{recorder.status !== 'recording' ? <Button variant="outline" onClick={() => void recorder.start()} disabled={recorder.status === 'requesting'}><Mic2 /> {recorder.status === 'recorded' ? 'Record again' : 'Answer with voice'}</Button> : <Button className="recording-button" onClick={recorder.stop}><Pause /> Stop</Button>}{recorder.audioUrl && <><Button variant="outline" onClick={recorder.play}><Play /> Replay</Button><Button variant="ghost" onClick={recorder.reset}><RotateCcw /> Retry</Button><Button onClick={() => saveAnswer({ mode: 'voice', attempted: true })}>Use this answer</Button></>}<button className="spoken-only" onClick={() => saveAnswer({ mode: 'spoken-confirmation', attempted: true })}>I answered aloud without recording</button></div>{(recorder.status === 'denied' || recorder.status === 'unavailable') && <p className="voice-note">No microphone? Choose a suggestion, type, or answer aloud without recording.</p>}<StageActions onBack={onBack} onNext={onNext} disabled={!canAdvance(attempt)} nextLabel={stageId === 'talk-life' ? 'Finish mission' : 'Nova’s next question'} /></div>;
}
