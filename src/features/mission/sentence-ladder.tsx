import { Check } from 'lucide-react';
import type { MissionResponse, StageId } from '@/src/domain/learning';
import { buildP1, buildP2, buildP3, buildP4, buildP5 } from '@/src/domain/sentence-builder';

export function SentenceLadder({ response, currentStage }: { response: MissionResponse; currentStage: StageId }) {
  if (!response.feeling) return null;
  const lines: { id: StageId; label: string; text: string }[] = [{ id: 'speak-p1', label: 'P1', text: buildP1(response.feeling) }];
  if (response.situationText) lines.push({ id: 'speak-p2', label: 'P2', text: buildP2(response.feeling, response.situationText) });
  if (response.situationText && response.reasonText) lines.push({ id: 'speak-p3', label: 'P3', text: buildP3(response.feeling, response.situationText, response.reasonText) });
  if (response.situationText && response.reasonText && response.intensity) lines.push({ id: 'speak-p4', label: 'P4', text: buildP4({ feeling: response.feeling, situation: response.situationText, reason: response.reasonText, intensity: response.intensity }) });
  if (response.personalExample) lines.push({ id: 'speak-p5', label: 'P5', text: buildP5(response.feeling, response.personalExample) });
  return <div className="sentence-ladder" aria-label="Your growing sentence">{lines.map((line) => <div key={line.id} className={line.id === currentStage ? 'current' : ''}><span>{line.label}</span><p>{line.text}</p>{line.id !== currentStage && <Check />}</div>)}</div>;
}
