'use client';

import { useState } from 'react';
import { Lightbulb, Shuffle } from 'lucide-react';
import { THINK_SITUATIONS } from '@/src/data/nova-mood-mission';
import type { GameAttempt, MoodId, ThinkResponse } from '@/src/domain/learning';
import { MoodPicker } from './mood-picker';
import { StageActions } from './stage-actions';

export function ThinkStage({ attempt, onChange, onNext, onBack }: { attempt: GameAttempt; onChange: (attempt: GameAttempt) => void; onNext: () => void; onBack: () => void }) {
  const [round, setRound] = useState(Math.min(attempt.response.thinkResponses.length, THINK_SITUATIONS.length - 1));
  const situation = THINK_SITUATIONS[round];
  const selected = attempt.response.thinkResponses.find((item) => item.situationId === situation.id)?.moods ?? [];

  function choose(moods: MoodId[]) {
    const response: ThinkResponse = { situationId: situation.id, moods };
    const existing = attempt.response.thinkResponses.filter((item) => item.situationId !== situation.id);
    onChange({ ...attempt, response: { ...attempt.response, thinkResponses: [...existing, response] } });
  }

  return <div className="think-stage"><div className="round-dots" aria-label={`Situation ${round + 1} of ${THINK_SITUATIONS.length}`}>{THINK_SITUATIONS.map((item, index) => <span key={item.id} className={index <= round ? 'active' : ''}>{index + 1}</span>)}</div><div className={`situation-card ${situation.category}`}><span>{situation.category === 'mixed' ? <Shuffle /> : <Lightbulb />}</span><p>{situation.text}</p><strong>{situation.prompt}</strong></div><MoodPicker value={selected} onChange={choose} multiple={situation.category === 'mixed'} />{situation.category === 'mixed' && <p className="stage-help">You can choose one feeling or two mixed feelings.</p>}<StageActions onBack={round > 0 ? () => setRound((value) => value - 1) : onBack} onNext={round < THINK_SITUATIONS.length - 1 ? () => setRound((value) => value + 1) : onNext} nextLabel={round < THINK_SITUATIONS.length - 1 ? 'Next moment' : 'Build my sentence'} disabled={!selected.length} /></div>;
}
