'use client';

import { WHY_MAIN_REASON_OPTIONS, WHY_MOODS, WHY_REASON_OPTIONS, WHY_REFLECTION_OPTIONS, WHY_SECOND_REASON_OPTIONS } from '@/src/data/nova-why-quest';
import type { GameAttempt, MissionResponse, MoodId } from '@/src/domain/learning';
import { canAdvanceWhy } from '@/src/domain/why-quest-engine';
import { buildWhyP1, buildWhyP2, buildWhyP3, buildWhyP4, buildWhyP5, buildWhyP6, buildWhyP7 } from '@/src/domain/why-sentence-builder';
import { MoodPicker } from '@/src/features/mission/mood-picker';
import { OptionBuilder } from '@/src/features/mission/option-builder';
import { type PatternLine, SentenceLadder } from '@/src/features/mission/sentence-ladder';
import { StageActions } from '@/src/features/mission/stage-actions';
import { VoicePractice } from '@/src/features/mission/voice-practice';

export function WhySpeakStage({ attempt, onChange, onNext, onBack }: { attempt: GameAttempt; onChange: (attempt: GameAttempt) => void; onNext: () => void; onBack: () => void }) {
  const stage = attempt.currentStageId;
  const response = attempt.response;
  function update(patch: Partial<MissionResponse>) { onChange({ ...attempt, response: { ...response, ...patch } }); }
  function practise(stageId: 'why-speak-p6' | 'why-speak-p7') {
    if (!attempt.practiceStageIds.includes(stageId)) onChange({ ...attempt, practiceStageIds: [...attempt.practiceStageIds, stageId] });
  }

  const lines: PatternLine[] = [];
  if (response.feeling && response.reasonText) lines.push({ id: 'why-speak-p1', label: 'P1', text: buildWhyP1(response.feeling, response.reasonText) });
  if (response.feeling && response.reasonText && response.secondReasonText) lines.push({ id: 'why-speak-p2', label: 'P2', text: buildWhyP2(response.feeling, response.reasonText, response.secondReasonText) });
  if (response.feeling && response.laterFeeling && response.changeReasonText) lines.push({ id: 'why-speak-p3', label: 'P3', text: buildWhyP3(response.feeling, response.laterFeeling, response.changeReasonText) });
  if (response.feeling && response.secondFeeling) lines.push({ id: 'why-speak-p4', label: 'P4', text: buildWhyP4(response.feeling, response.secondFeeling) });
  if (response.feeling && response.mainReasonText) lines.push({ id: 'why-speak-p5', label: 'P5', text: buildWhyP5(response.feeling, response.mainReasonText) });
  if (response.feeling && response.reasonText) lines.push({ id: 'why-speak-p6', label: 'P6', text: buildWhyP6(response.feeling, response.reasonText) });
  if (response.feeling && response.reflectionReasonText) lines.push({ id: 'why-speak-p7', label: 'P7', text: buildWhyP7(response.feeling, response.reflectionReasonText) });

  return <div className="speak-stage why-speak-stage"><SentenceLadder lines={lines} currentStage={stage} label="Your reason patterns" />
    {stage === 'why-speak-p1' && <div className="why-builder-stack"><p className="stage-question">Which feeling do you want to explain?</p><MoodPicker moods={WHY_MOODS} value={response.feeling ? [response.feeling] : []} onChange={(moods) => update({ feeling: moods[0] })} /><OptionBuilder label="What is one clear reason?" options={WHY_REASON_OPTIONS} value={response.reasonText ?? ''} onChange={(reasonText) => update({ reasonText })} placeholder="Or write your own reason" /></div>}
    {stage === 'why-speak-p2' && <OptionBuilder label="What is another reason for that feeling?" options={WHY_SECOND_REASON_OPTIONS} value={response.secondReasonText ?? ''} onChange={(secondReasonText) => update({ secondReasonText })} placeholder="Add a different reason" />}
    {stage === 'why-speak-p3' && <div className="why-builder-stack"><p className="stage-question">How did you feel later?</p><MoodPicker moods={WHY_MOODS.filter((mood) => mood.id !== response.feeling)} value={response.laterFeeling ? [response.laterFeeling] : []} onChange={(moods: MoodId[]) => update({ laterFeeling: moods[0] })} /><OptionBuilder label="What helped the feeling change?" options={['people supported me', 'I understood the topic', 'I asked questions', 'I kept trying']} value={response.changeReasonText ?? ''} onChange={(changeReasonText) => update({ changeReasonText })} placeholder="Or explain what changed" /></div>}
    {stage === 'why-speak-p4' && <><p className="stage-question">What other feeling can be true at the same time?</p><MoodPicker moods={WHY_MOODS.filter((mood) => mood.id !== response.feeling)} value={response.secondFeeling ? [response.secondFeeling] : []} onChange={(moods: MoodId[]) => update({ secondFeeling: moods[0] })} /><p className="stage-help">Mixed feelings are normal. Pick a feeling different from your first one.</p></>}
    {stage === 'why-speak-p5' && <OptionBuilder label="Which reason matters most to you?" options={WHY_MAIN_REASON_OPTIONS} value={response.mainReasonText ?? ''} onChange={(mainReasonText) => update({ mainReasonText })} placeholder="Write your main reason" />}
    {stage === 'why-speak-p6' && <><p className="stage-question">Practise the honest-expression pattern.</p>{response.feeling && response.reasonText && <blockquote className="practice-sentence">{buildWhyP6(response.feeling, response.reasonText)}</blockquote>}<VoicePractice complete={attempt.practiceStageIds.includes('why-speak-p6')} onComplete={() => practise('why-speak-p6')} /></>}
    {stage === 'why-speak-p7' && <><OptionBuilder label="Looking back, what reason do you understand now?" options={WHY_REFLECTION_OPTIONS} value={response.reflectionReasonText ?? ''} onChange={(reflectionReasonText) => update({ reflectionReasonText })} placeholder="Write what you understand now" />{response.feeling && response.reflectionReasonText && <blockquote className="practice-sentence">{buildWhyP7(response.feeling, response.reflectionReasonText)}</blockquote>}<VoicePractice complete={attempt.practiceStageIds.includes('why-speak-p7')} onComplete={() => practise('why-speak-p7')} /></>}
    <StageActions onBack={onBack} onNext={onNext} disabled={!canAdvanceWhy(attempt)} nextLabel={stage === 'why-speak-p7' ? 'Talk with Nova' : 'Next speaking pattern'} />
  </div>;
}

