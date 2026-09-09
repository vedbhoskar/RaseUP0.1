'use client';

import { useState } from 'react';
import { Lightbulb, PencilLine, Shuffle } from 'lucide-react';
import { WHY_MOODS, WHY_THINK_SITUATIONS } from '@/src/data/nova-why-quest';
import type { GameAttempt, MoodId, ThinkResponse } from '@/src/domain/learning';
import { MoodPicker } from '@/src/features/mission/mood-picker';
import { StageActions } from '@/src/features/mission/stage-actions';

export function WhyThinkStage({ attempt, onChange, onNext, onBack }: { attempt: GameAttempt; onChange: (attempt: GameAttempt) => void; onNext: () => void; onBack: () => void }) {
  const [round, setRound] = useState(Math.min(attempt.response.thinkResponses.length, WHY_THINK_SITUATIONS.length - 1));
  const situation = WHY_THINK_SITUATIONS[round];
  const response = attempt.response.thinkResponses.find((item) => item.situationId === situation.id);
  const selected = response?.moods ?? [];
  const reason = response?.reason ?? '';

  function save(patch: Partial<ThinkResponse>) {
    const next: ThinkResponse = { situationId: situation.id, moods: selected, reason, ...patch };
    const existing = attempt.response.thinkResponses.filter((item) => item.situationId !== situation.id);
    onChange({ ...attempt, response: { ...attempt.response, thinkResponses: [...existing, next] } });
  }

  return <div className="think-stage why-think-stage"><div className="round-dots" aria-label={`Situation ${round + 1} of ${WHY_THINK_SITUATIONS.length}`}>{WHY_THINK_SITUATIONS.map((item, index) => <span key={item.id} className={index <= round ? 'active' : ''}>{index + 1}</span>)}</div><div className={`situation-card ${situation.category}`}><span>{situation.category === 'mixed' ? <Shuffle /> : <Lightbulb />}</span><p>{situation.text}</p><strong>{situation.prompt}</strong></div><MoodPicker moods={WHY_MOODS} value={selected} onChange={(moods: MoodId[]) => save({ moods })} multiple={situation.category === 'mixed'} /><label className="why-reason-input"><span><PencilLine /> My reason</span><textarea value={reason} onChange={(event) => save({ reason: event.target.value })} placeholder="I might feel this way because…" /></label>{situation.category === 'mixed' && <p className="stage-help">You can choose one feeling or two feelings that fit together.</p>}<StageActions onBack={round > 0 ? () => setRound((value) => value - 1) : onBack} onNext={round < WHY_THINK_SITUATIONS.length - 1 ? () => setRound((value) => value + 1) : onNext} nextLabel={round < WHY_THINK_SITUATIONS.length - 1 ? 'Next situation' : 'Build my reasons'} disabled={!selected.length || !reason.trim()} /></div>;
}

