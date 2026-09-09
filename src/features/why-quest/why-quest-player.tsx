'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, Brain, MessageCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NOVA_WHY_QUEST } from '@/src/data/nova-why-quest';
import { canAdvanceWhy, advanceWhyAttempt, goBackWhy } from '@/src/domain/why-quest-engine';
import { buildWhyP2, buildWhyP7 } from '@/src/domain/why-sentence-builder';
import { MascotConversation } from '@/src/features/mission/mascot-conversation';
import { MissionResults } from '@/src/features/mission/mission-results';
import { MissionShell } from '@/src/features/mission/mission-shell';
import { StageActions } from '@/src/features/mission/stage-actions';
import { useLearningStore } from '@/src/features/session/learning-store';
import { WhySpeakStage } from './why-speak-stage';
import { WhyThinkStage } from './why-think-stage';

export function WhyQuestPlayer() {
  const { state, startGame, updateAttempt, completeGame } = useLearningStore();
  const attempt = state.attempts.find((candidate) => candidate.gameId === NOVA_WHY_QUEST.id && candidate.status === 'in-progress') ?? state.attempts.find((candidate) => candidate.gameId === NOVA_WHY_QUEST.id && candidate.currentStageId === 'why-results');
  const startQuest = () => startGame(NOVA_WHY_QUEST.id);
  if (!attempt) return <main className="mission-preview-page"><section className="mission-preview-card"><NovaMark /><p className="eyebrow">Self Awareness & Identity · 1.2</p><h1>{NOVA_WHY_QUEST.title}</h1><p>{NOVA_WHY_QUEST.summary}</p><Button className="student-game-action" onClick={startQuest}>Start quest <ArrowRight /></Button><Link href="/" className="mission-back"><ArrowLeft /> Back to dashboard</Link></section></main>;

  const currentAttempt = attempt;
  const stage = NOVA_WHY_QUEST.stages.find((candidate) => candidate.id === currentAttempt.currentStageId) ?? NOVA_WHY_QUEST.stages[0];
  function next() {
    if (currentAttempt.currentStageId === 'why-talk-advanced') completeGame(currentAttempt.id);
    else updateAttempt(advanceWhyAttempt(currentAttempt));
  }
  function back() { updateAttempt(goBackWhy(currentAttempt)); }
  const resultSentences = [];
  if (currentAttempt.response.feeling && currentAttempt.response.reasonText && currentAttempt.response.secondReasonText) resultSentences.push(buildWhyP2(currentAttempt.response.feeling, currentAttempt.response.reasonText, currentAttempt.response.secondReasonText));
  if (currentAttempt.response.feeling && currentAttempt.response.reflectionReasonText) resultSentences.push(buildWhyP7(currentAttempt.response.feeling, currentAttempt.response.reflectionReasonText));

  return <MissionShell game={NOVA_WHY_QUEST} stage={stage}>
    {stage.id === 'why-welcome' && <WhyWelcomeStage onNext={next} />}
    {stage.id === 'why-think' && <WhyThinkStage attempt={currentAttempt} onChange={updateAttempt} onNext={next} onBack={back} />}
    {stage.module === 'speak' && <WhySpeakStage attempt={currentAttempt} onChange={updateAttempt} onNext={next} onBack={back} />}
    {stage.module === 'talk' && <MascotConversation attempt={currentAttempt} onChange={updateAttempt} onNext={next} onBack={back} canContinue={canAdvanceWhy} finalStageId="why-talk-advanced" />}
    {stage.id === 'why-results' && <MissionResults attempt={currentAttempt} onPlayAgain={startQuest} title="Your reasons made your ideas clearer" summary="You explained, compared, reflected, and spoke your thinking through." sentences={resultSentences} />}
  </MissionShell>;
}

function NovaMark() {
  return <div className="nova-preview why-nova-preview"><span><i /><i /><i /></span><div><MessageCircle /><Sparkles /></div></div>;
}

function WhyWelcomeStage({ onNext }: { onNext: () => void }) {
  return <div className="mission-welcome"><div className="mission-map-preview"><div><Brain /><strong>Let’s Think</strong><span>Find what is behind the feeling</span></div><i /><div><MessageCircle /><strong>Let’s Speak</strong><span>Practise seven reason patterns</span></div><i /><div><Sparkles /><strong>Let’s Talk</strong><span>Explain your thinking to Nova</span></div></div><p>A feeling can have one reason, many reasons, or even change over time. You decide what fits—Nova helps you make the reason clear.</p><StageActions onNext={onNext} nextLabel="Start Why Quest" /></div>;
}
