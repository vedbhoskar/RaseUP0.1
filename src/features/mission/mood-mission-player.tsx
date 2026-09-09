'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, Brain, MessageCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NOVA_MOOD_MISSION } from '@/src/data/nova-mood-mission';
import { advanceAttempt, goBack } from '@/src/domain/mission-engine';
import { useLearningStore } from '@/src/features/session/learning-store';
import { MascotConversation } from './mascot-conversation';
import { MissionResults } from './mission-results';
import { MissionShell } from './mission-shell';
import { SpeakStage } from './speak-stage';
import { StageActions } from './stage-actions';
import { ThinkStage } from './think-stage';

export function MoodMissionPlayer() {
  const { state, startGame, updateAttempt, completeGame } = useLearningStore();
  const attempt = state.attempts.find((candidate) => candidate.status === 'in-progress') ?? state.attempts.find((candidate) => candidate.currentStageId === 'results');
  if (!attempt) return <main className="mission-preview-page"><section className="mission-preview-card"><NovaMark /><p className="eyebrow">Self Awareness & Identity</p><h1>{NOVA_MOOD_MISSION.title}</h1><p>{NOVA_MOOD_MISSION.summary}</p><Button className="student-game-action" onClick={startGame}>Start mission <ArrowRight /></Button><Link href="/" className="mission-back"><ArrowLeft /> Back to dashboard</Link></section></main>;

  const currentAttempt = attempt;
  const stage = NOVA_MOOD_MISSION.stages.find((candidate) => candidate.id === currentAttempt.currentStageId) ?? NOVA_MOOD_MISSION.stages[0];
  function next() {
    if (currentAttempt.currentStageId === 'talk-life') completeGame(currentAttempt.id);
    else updateAttempt(advanceAttempt(currentAttempt));
  }
  function back() { updateAttempt(goBack(currentAttempt)); }

  return <MissionShell stage={stage}>
    {stage.id === 'welcome' && <WelcomeStage onNext={next} />}
    {stage.id === 'think' && <ThinkStage attempt={currentAttempt} onChange={updateAttempt} onNext={next} onBack={back} />}
    {stage.module === 'speak' && <SpeakStage attempt={currentAttempt} onChange={updateAttempt} onNext={next} onBack={back} />}
    {stage.module === 'talk' && <MascotConversation attempt={currentAttempt} onChange={updateAttempt} onNext={next} onBack={back} />}
    {stage.id === 'results' && <MissionResults attempt={currentAttempt} onPlayAgain={startGame} />}
  </MissionShell>;
}

function NovaMark() {
  return <div className="nova-preview"><span><i /><i /><i /></span><div><MessageCircle /><Sparkles /></div></div>;
}

function WelcomeStage({ onNext }: { onNext: () => void }) {
  return <div className="mission-welcome"><div className="mission-map-preview"><div><Brain /><strong>Let’s Think</strong><span>Notice the mood</span></div><i /><div><MessageCircle /><strong>Let’s Speak</strong><span>Grow a sentence</span></div><i /><div><Sparkles /><strong>Let’s Talk</strong><span>Chat with Nova</span></div></div><p>There are no wrong feelings. Choose what fits you, build your thought one piece at a time, and use your voice in the way that feels comfortable.</p><StageActions onNext={onNext} nextLabel="Start mission" /></div>;
}
