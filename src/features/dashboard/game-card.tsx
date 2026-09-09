'use client';

import { ArrowRight, CheckCircle2, Clock3, MessageCircle, Play, RotateCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import type { GameDefinition } from '@/src/domain/learning';
import { useLearningStore } from '@/src/features/session/learning-store';

const LABEL = { start: 'Start mission', continue: 'Continue mission', replay: 'Play again' } as const;

export function GameCard({ game, status }: { game: GameDefinition; status: keyof typeof LABEL }) {
  const router = useRouter();
  const { startGame } = useLearningStore();
  const ActionIcon = status === 'continue' ? Play : status === 'replay' ? RotateCcw : ArrowRight;
  function openGame() { startGame(game.id); router.push(`/games/${game.slug}`); }

  return <article className={`student-game-card ${game.id === 'nova-why-quest' ? 'why-quest-card' : ''}`}>
    <div className="game-card-art" aria-hidden="true"><span className="nova-orb"><i /><i /><i /></span><strong>{game.curriculumCode}</strong></div>
    <div className="student-game-copy">
      <p className="game-topic-code">Topic {game.curriculumCode}</p>
      <div className="game-meta"><span><Clock3 /> {game.estimatedMinutes} min</span><span><MessageCircle /> {game.id === 'nova-why-quest' ? 'Reasons · Reflect · Talk' : 'Feel · Build · Talk'}</span></div>
      <h3>{game.title}</h3><p>{game.summary}</p>
      <div className="game-module-row" aria-label="Mission modules"><span><CheckCircle2 /> Let’s Think</span><span>Let’s Speak</span><span>Let’s Talk</span></div>
      <Button className="student-game-action" onClick={openGame}>{LABEL[status]} <ActionIcon /></Button>
    </div>
  </article>;
}
