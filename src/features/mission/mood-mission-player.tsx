'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, MessageCircle, Sparkles, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NOVA_MOOD_MISSION } from '@/src/data/nova-mood-mission';
import { advanceAttempt } from '@/src/domain/mission-engine';
import { useLearningStore } from '@/src/features/session/learning-store';

export function MoodMissionPlayer() {
  const { state, startGame, updateAttempt } = useLearningStore();
  const attempt = state.attempts.find((candidate) => candidate.status === 'in-progress');
  if (!attempt) return <main className="mission-preview-page"><section className="mission-preview-card"><NovaMark /><p className="eyebrow">Self Awareness & Identity</p><h1>{NOVA_MOOD_MISSION.title}</h1><p>{NOVA_MOOD_MISSION.summary}</p><Button className="student-game-action" onClick={startGame}>Start mission <ArrowRight /></Button><Link href="/" className="mission-back"><ArrowLeft /> Back to dashboard</Link></section></main>;

  const stage = NOVA_MOOD_MISSION.stages.find((candidate) => candidate.id === attempt.currentStageId) ?? NOVA_MOOD_MISSION.stages[0];
  return <main className="mission-preview-page"><section className="mission-preview-card"><NovaMark /><p className="eyebrow">{stage.label}</p><h1>{stage.title}</h1><p>{stage.instruction}</p><div className="mission-preview-actions"><Button variant="outline"><Volume2 /> Hear again</Button>{stage.id === 'welcome' && <Button className="student-game-action" onClick={() => updateAttempt(advanceAttempt(attempt))}>Begin Let’s Think <ArrowRight /></Button>}</div><Link href="/" className="mission-back"><ArrowLeft /> Back to dashboard</Link></section></main>;
}

function NovaMark() {
  return <div className="nova-preview"><span><i /><i /><i /></span><div><MessageCircle /><Sparkles /></div></div>;
}
