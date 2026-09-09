'use client';

import Link from 'next/link';
import { ArrowLeft, MessageCircle, Volume2, X } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import type { GameDefinition, StageDefinition } from '@/src/domain/learning';
import { useInstructionReplay } from '@/src/features/mascot/use-instruction-replay';

export function MissionShell({ game, stage, onBack, children }: { game: GameDefinition; stage: StageDefinition; onBack?: () => void; children: React.ReactNode }) {
  const replay = useInstructionReplay(stage.instruction);
  const index = game.stages.findIndex((candidate) => candidate.id === stage.id);
  const firstIndex = (module: StageDefinition['module']) => game.stages.findIndex((candidate) => candidate.module === module);
  const phase = stage.module === 'speak' ? 'Let’s Speak' : stage.module === 'talk' ? 'Let’s Talk' : stage.label;
  return <main className="mood-mission-page">
    <header className="mission-topbar"><Link href="/" className="mission-brand"><span className="brand-mark">R</span><span>RaseUP</span></Link><div className="mission-progress"><div><span>Stop {index + 1} of {game.stages.length}</span><strong>{phase}</strong></div><Progress value={((index + 1) / game.stages.length) * 100} /></div><Link href="/" className="mission-exit" aria-label="Exit to dashboard"><X /></Link></header>
    <div className="mission-workspace"><aside className="nova-rail"><div className="nova-face"><MessageCircle /><span><i /><i /><i /></span></div><p className="eyebrow light">Nova says</p><blockquote>{stage.instruction}</blockquote><button className="replay-instruction" onClick={replay.status === 'speaking' ? replay.stop : replay.replay}><Volume2 /> {replay.status === 'speaking' ? 'Stop' : 'Hear again'}</button>{replay.status === 'unavailable' && <small>Audio replay is unavailable in this browser.</small>}<nav aria-label="Mission phases"><span className={index >= firstIndex('think') ? 'done' : ''}>Think</span><span className={index >= firstIndex('speak') ? 'done' : ''}>Speak</span><span className={index >= firstIndex('talk') ? 'done' : ''}>Talk</span></nav></aside>
      <section className="mission-stage" aria-labelledby="mission-stage-title"><header><p className="stage-kicker">{stage.label}</p><h1 id="mission-stage-title">{stage.title}</h1></header>{children}{onBack && <button className="mission-floating-back" onClick={onBack}><ArrowLeft /> Back</button>}</section>
    </div>
  </main>;
}
