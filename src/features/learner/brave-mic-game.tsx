'use client';

import { useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, CircleCheckBig, Home, LockKeyhole, Mic2, Pause, Play, Presentation, RotateCcw, Sparkles, Star, Volume2 } from 'lucide-react';
import { animate } from 'motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AFTER_FEELINGS, BEFORE_FEELINGS, GAME_STEPS, JOURNEY, PREPARATION_TOOLS, PRESENTATION_LINES, REASONS } from '@/src/data/brave-mic';
import type { LearningAttempt } from '@/src/domain/learning';
import { buildFeelingChangeSentence, scoreAttempt } from '@/src/domain/scoring';
import { useLearningStore } from '@/src/features/session/learning-store';
import { useVoiceRecorder } from './use-voice-recorder';

export function BraveMicGame() {
  const { state, saveAttempt } = useLearningStore();
  const [stage, setStage] = useState(0);
  const [beforeFeeling, setBeforeFeeling] = useState('');
  const [reason, setReason] = useState('');
  const [preparation, setPreparation] = useState('');
  const [practised, setPractised] = useState(false);
  const [spokenLines, setSpokenLines] = useState(0);
  const [afterFeeling, setAfterFeeling] = useState('');
  const [transferChoice, setTransferChoice] = useState('');
  const [savedAttempt, setSavedAttempt] = useState<LearningAttempt | null>(null);
  const startedAt = useRef(Date.now());
  const recorder = useVoiceRecorder();

  const sentence = useMemo(() => buildFeelingChangeSentence(beforeFeeling, afterFeeling, reason), [afterFeeling, beforeFeeling, reason]);

  if (state.approvalStatus !== 'approved') return <LockedJourney />;

  function move(next: number) {
    setStage(next);
    requestAnimationFrame(() => {
      const card = document.querySelector('.game-card');
      if (card) animate(card, { opacity: [0, 1], y: [12, 0] }, { duration: .32 });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function finish() {
    const { score, skills } = scoreAttempt(recorder.status === 'recorded' ? 'recorded' : practised ? 'practised' : 'supported');
    const attempt: LearningAttempt = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      journeyId: 'brave-mic', journeyTitle: JOURNEY.title, completedAt: new Date().toISOString(),
      durationMinutes: Math.max(1, Math.round((Date.now() - startedAt.current) / 60000)),
      score,
      beforeFeeling, afterFeeling, reason, sentence,
      skills,
    };
    saveAttempt(attempt);
    setSavedAttempt(attempt);
    move(GAME_STEPS.length - 1);
  }

  return <main className="game-shell">
    <header className="game-header"><a href="/" aria-label="Back to dashboard" className="game-home"><span className="brand-mark">R</span><span>RaseUP</span></a><div className="game-progress"><span>Step {Math.min(stage + 1, GAME_STEPS.length)} of {GAME_STEPS.length}</span><Progress value={((stage + 1) / GAME_STEPS.length) * 100}/><strong>{GAME_STEPS[stage].label}</strong></div><button className="sound-button" aria-label="Replay instruction"><Volume2 /></button></header>
    <section className="game-layout">
      <aside className="story-panel"><p className="eyebrow light">{JOURNEY.unit}</p><div className="story-icon"><Presentation /></div><h1>{stage < 6 ? 'A big classroom moment' : 'Your feeling journey'}</h1><p>{stage < 6 ? 'Nova is about to share an idea with the whole class. You will help with every step.' : 'Look at what changed before, during, and after Nova spoke.'}</p><div className="story-timeline"><span className={stage >= 1 ? 'active' : ''}>Before</span><i/><span className={stage >= 5 ? 'active' : ''}>During</span><i/><span className={stage >= 6 ? 'active' : ''}>After</span></div></aside>
      <section className="game-card">{renderStage()}</section>
    </section>
  </main>;

  function renderStage() {
    switch (stage) {
      case 0: return <GameIntro onStart={() => move(1)} />;
      case 1: return <ChoiceStage title="How might Nova feel before speaking?" hint="There is no single correct feeling." items={BEFORE_FEELINGS} value={beforeFeeling} onChange={setBeforeFeeling} onNext={() => move(2)} />;
      case 2: return <ReasonStage value={reason} onChange={setReason} beforeFeeling={beforeFeeling} onNext={() => move(3)} onBack={() => move(1)} />;
      case 3: return <PreparationStage value={preparation} onChange={setPreparation} onNext={() => move(4)} onBack={() => move(2)} />;
      case 4: return <PracticeStage feeling={beforeFeeling} reason={reason} practised={practised} setPractised={setPractised} recorder={recorder} onNext={() => move(5)} onBack={() => move(3)} />;
      case 5: return <PresentationStage count={spokenLines} setCount={setSpokenLines} onNext={() => move(6)} onBack={() => move(4)} />;
      case 6: return <ChoiceStage title="How might Nova feel after finishing?" hint="It is okay if some nervousness remains." items={AFTER_FEELINGS} value={afterFeeling} onChange={setAfterFeeling} onNext={() => move(7)} onBack={() => move(5)} />;
      case 7: return <ConnectStage sentence={sentence} beforeFeeling={beforeFeeling} afterFeeling={afterFeeling} onNext={() => move(8)} onBack={() => move(6)} />;
      case 8: return <TransferStage value={transferChoice} onChange={setTransferChoice} onFinish={finish} onBack={() => move(7)} />;
      default: return <CompleteStage attempt={savedAttempt} />;
    }
  }
}

function GameIntro({ onStart }: { onStart: () => void }) {
  return <div className="center-stage"><span className="stage-kicker"><Sparkles /> New story</span><div className="speaker-bubble">“Good morning, Nova. Would you like to share your idea with the class?”</div><h2>Help Nova find the words</h2><p>You will notice a feeling, find its reason, practise, and look at what changes.</p><Button className="game-primary" onClick={onStart}>Begin the moment <ArrowRight /></Button></div>;
}

type FeelingItem = { id: string; label: string; symbol: string; color: string };
function ChoiceStage({ title, hint, items, value, onChange, onNext, onBack }: { title: string; hint: string; items: readonly FeelingItem[]; value: string; onChange: (value: string) => void; onNext: () => void; onBack?: () => void }) {
  return <><div className="stage-heading"><span className="stage-kicker">Notice the feeling</span><h2>{title}</h2><p>{hint}</p></div><div className="feeling-grid">{items.map((item) => <button key={item.id} className={`feeling-choice ${value === item.id ? 'selected' : ''}`} onClick={() => onChange(item.id)} style={{'--feeling-color':item.color} as React.CSSProperties}><span>{item.symbol}</span><strong>{item.label}</strong>{value === item.id && <Check />}</button>)}</div><GameActions onBack={onBack} onNext={onNext} disabled={!value} /></>;
}

function ReasonStage({ value, onChange, beforeFeeling, onNext, onBack }: { value: string; onChange: (value: string) => void; beforeFeeling: string; onNext: () => void; onBack: () => void }) {
  return <><div className="stage-heading"><span className="stage-kicker">Find the reason</span><h2>What could be behind that feeling?</h2><p>A clear reason helps another person understand.</p></div><div className="thought-preview"><span>I feel <strong>{beforeFeeling}</strong> because…</span></div><div className="reason-list">{REASONS.map((item) => <button key={item} className={value === item ? 'selected' : ''} onClick={() => onChange(item)}><span>{value === item ? <Check /> : '?'}</span>{item}</button>)}</div><GameActions onBack={onBack} onNext={onNext} disabled={!value} /></>;
}

function PreparationStage({ value, onChange, onNext, onBack }: { value: string; onChange: (value: string) => void; onNext: () => void; onBack: () => void }) {
  return <><div className="stage-heading"><span className="stage-kicker">Prepare, your way</span><h2>Choose one tool for the big moment</h2><p>Being brave can include using support.</p></div><div className="tool-grid">{PREPARATION_TOOLS.map((tool) => <button key={tool.id} className={value === tool.id ? 'selected' : ''} onClick={() => onChange(tool.id)}><span>{tool.symbol}</span><strong>{tool.title}</strong><small>{tool.detail}</small></button>)}</div>{value === 'breathe' && <div className="breathing-cue"><i/>Breathe in slowly · breathe out gently</div>}<GameActions onBack={onBack} onNext={onNext} disabled={!value} label="Use this tool" /></>;
}

type Recorder = ReturnType<typeof useVoiceRecorder>;
function PracticeStage({ feeling, reason, practised, setPractised, recorder, onNext, onBack }: { feeling: string; reason: string; practised: boolean; setPractised: (value: boolean) => void; recorder: Recorder; onNext: () => void; onBack: () => void }) {
  const line = `Before speaking, I feel ${feeling} because ${reason}`;
  return <><div className="stage-heading"><span className="stage-kicker">Practice booth</span><h2>Say the thought out loud</h2><p>You can record, replay, and retry. Your recording never leaves this device.</p></div><blockquote className="practice-line">“{line}”</blockquote><div className="recorder-row">{recorder.status !== 'recording' ? <Button variant="outline" className="record-button" onClick={() => void recorder.start()}><Mic2 /> {recorder.status === 'recorded' ? 'Record again' : 'Start recording'}</Button> : <Button className="record-button recording" onClick={recorder.stop}><Pause /> Stop recording</Button>}{recorder.audioUrl && <audio controls src={recorder.audioUrl} aria-label="Your practice recording"/>}{recorder.status === 'unavailable' && <span className="recorder-note">Microphone is unavailable here. You can still practise aloud.</span>}</div><button className={`practice-confirm ${practised ? 'selected' : ''}`} onClick={() => setPractised(true)}><CircleCheckBig /> {practised ? 'Practice marked complete' : 'I practised the sentence aloud'}</button><GameActions onBack={onBack} onNext={onNext} disabled={!practised && recorder.status !== 'recorded'} label="Ready to present" /></>;
}

function PresentationStage({ count, setCount, onNext, onBack }: { count: number; setCount: (value: number) => void; onNext: () => void; onBack: () => void }) {
  return <><div className="stage-heading"><span className="stage-kicker">The presentation</span><h2>Help Nova speak one idea at a time</h2><p>Tap each cue when you are ready to say it.</p></div><div className="presentation-list">{PRESENTATION_LINES.map((line, index) => <button key={line} disabled={index > count} className={index < count ? 'complete' : index === count ? 'current' : ''} onClick={() => { if (index === count) setCount(count + 1); }}><span>{index < count ? <Check /> : index + 1}</span><strong>{line}</strong>{index === count && <Play />}</button>)}</div>{count === PRESENTATION_LINES.length && <div className="success-note"><Sparkles /> Nova finished the whole talk—even with a small pause.</div>}<GameActions onBack={onBack} onNext={onNext} disabled={count < PRESENTATION_LINES.length} label="See what changed" /></>;
}

function ConnectStage({ sentence, beforeFeeling, afterFeeling, onNext, onBack }: { sentence: string; beforeFeeling: string; afterFeeling: string; onNext: () => void; onBack: () => void }) {
  return <><div className="stage-heading"><span className="stage-kicker">Emotion bridge</span><h2>Connect before and after</h2><p>A reason explains why a feeling changed.</p></div><div className="emotion-bridge"><div><span>Before</span><strong>{beforeFeeling}</strong></div><i><ArrowRight /></i><div><span>After</span><strong>{afterFeeling}</strong></div></div><blockquote className="completed-sentence">{sentence}</blockquote><div className="success-note"><Check /> Clear change + clear reason</div><GameActions onBack={onBack} onNext={onNext} label="Try a new moment" /></>;
}

function TransferStage({ value, onChange, onFinish, onBack }: { value: string; onChange: (value: string) => void; onFinish: () => void; onBack: () => void }) {
  const choices = ['Trying a new game', 'Answering a question in class', 'Joining a new team'];
  return <><div className="stage-heading"><span className="stage-kicker">Your turn</span><h2>Where else could a feeling change?</h2><p>Choose a new situation. This checks whether the idea can travel with you.</p></div><div className="transfer-grid">{choices.map((choice, index) => <button key={choice} className={value === choice ? 'selected' : ''} onClick={() => onChange(choice)}><span>{index + 1}</span><strong>{choice}</strong>{value === choice && <Check />}</button>)}</div>{value && <div className="transfer-prompt"><strong>Think it through:</strong> At first I might feel ___, but later I might feel ___ because ___.</div>}<GameActions onBack={onBack} onNext={onFinish} disabled={!value} label="Finish journey" /></>;
}

function CompleteStage({ attempt }: { attempt: LearningAttempt | null }) {
  return <div className="complete-stage"><span className="completion-star"><Star /></span><span className="stage-kicker">Journey complete</span><h2>You found the feeling story</h2><p>You noticed, explained, practised, spoke, and reflected.</p><div className="final-score"><strong>{attempt?.score ?? 0}%</strong><span>communication score</span></div><div className="badge-row"><span><Check /> Feeling Finder</span><span><Check /> Reason Builder</span><span><Check /> Brave Voice</span></div><div className="complete-actions"><Button className="game-primary" onClick={() => { window.location.href = '/'; }}><Home /> See my dashboard</Button><Button variant="outline" onClick={() => window.location.reload()}><RotateCcw /> Play again</Button></div></div>;
}

function GameActions({ onBack, onNext, disabled = false, label = 'Continue' }: { onBack?: () => void; onNext: () => void; disabled?: boolean; label?: string }) {
  return <div className="game-actions">{onBack ? <Button variant="ghost" onClick={onBack}><ArrowLeft /> Back</Button> : <span/>}<Button className="game-primary" onClick={onNext} disabled={disabled}>{label} <ArrowRight /></Button></div>;
}

function LockedJourney() {
  return <main className="locked-page"><div><LockKeyhole /><p className="eyebrow">Grown-up review needed</p><h1>This journey is not unlocked yet.</h1><p>Return to the parent dashboard, review The Brave Mic, and approve it for the learner.</p><Button onClick={() => { window.location.href = '/'; }} className="game-primary"><Home /> Return home</Button></div></main>;
}
