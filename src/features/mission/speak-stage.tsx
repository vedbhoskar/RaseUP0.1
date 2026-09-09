'use client';

import { Check, PencilLine } from 'lucide-react';
import { INTENSITY_OPTIONS, PERSONAL_OPTIONS, REASON_OPTIONS, SITUATION_OPTIONS } from '@/src/data/nova-mood-mission';
import type { GameAttempt, MissionResponse } from '@/src/domain/learning';
import { canAdvance } from '@/src/domain/mission-engine';
import { MoodPicker } from './mood-picker';
import { SentenceLadder } from './sentence-ladder';
import { StageActions } from './stage-actions';
import { VoicePractice } from './voice-practice';

export function SpeakStage({ attempt, onChange, onNext, onBack }: { attempt: GameAttempt; onChange: (attempt: GameAttempt) => void; onNext: () => void; onBack: () => void }) {
  const stage = attempt.currentStageId;
  function update(patch: Partial<MissionResponse>) { onChange({ ...attempt, response: { ...attempt.response, ...patch } }); }
  function choose(field: 'situationText' | 'reasonText' | 'intensity' | 'personalExample', value: string) { update({ [field]: value }); }

  return <div className="speak-stage"><SentenceLadder response={attempt.response} currentStage={stage} />
    {stage === 'speak-p1' && <><p className="stage-question">Which feeling do you want to express?</p><MoodPicker value={attempt.response.feeling ? [attempt.response.feeling] : []} onChange={(moods) => update({ feeling: moods[0] })} /></>}
    {stage === 'speak-p2' && <OptionBuilder label="When does it happen?" options={SITUATION_OPTIONS} value={attempt.response.situationText ?? ''} onChange={(value) => choose('situationText', value)} placeholder="Or write your own situation" />}
    {stage === 'speak-p3' && <OptionBuilder label="Why do you feel that way?" options={REASON_OPTIONS} value={attempt.response.reasonText ?? ''} onChange={(value) => choose('reasonText', value)} placeholder="Or write your own reason" />}
    {stage === 'speak-p4' && <><p className="stage-question">Choose a natural detail, then say the complete sentence.</p><div className="choice-chip-grid">{INTENSITY_OPTIONS.map((option) => <button key={option} className={attempt.response.intensity === option ? 'selected' : ''} onClick={() => choose('intensity', option)}>{attempt.response.intensity === option && <Check />}{option}</button>)}</div><VoicePractice complete={attempt.practiceStageIds.includes('speak-p4')} onComplete={() => onChange({ ...attempt, practiceStageIds: attempt.practiceStageIds.includes('speak-p4') ? attempt.practiceStageIds : [...attempt.practiceStageIds, 'speak-p4'] })} /></>}
    {stage === 'speak-p5' && <OptionBuilder label="One thing that makes you feel this way is…" options={PERSONAL_OPTIONS} value={attempt.response.personalExample ?? ''} onChange={(value) => choose('personalExample', value)} placeholder="Or write your own safe example" />}
    <StageActions onBack={onBack} onNext={onNext} disabled={!canAdvance(attempt)} nextLabel={stage === 'speak-p5' ? 'Talk with Nova' : 'Grow my sentence'} />
  </div>;
}

function OptionBuilder({ label, options, value, onChange, placeholder }: { label: string; options: readonly string[]; value: string; onChange: (value: string) => void; placeholder: string }) {
  return <div className="option-builder"><p className="stage-question">{label}</p><div className="choice-chip-grid">{options.map((option) => <button key={option} className={value === option ? 'selected' : ''} onClick={() => onChange(option)}>{value === option && <Check />}{option}</button>)}</div><label className="custom-answer"><PencilLine /><span className="sr-only">{placeholder}</span><input value={options.includes(value) ? '' : value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /></label></div>;
}
