import { Check } from 'lucide-react';
import type { StageId } from '@/src/domain/learning';

export type PatternLine = { id: StageId; label: string; text: string };

export function SentenceLadder({ lines, currentStage, label = 'Your sentence patterns' }: { lines: PatternLine[]; currentStage: StageId; label?: string }) {
  if (!lines.length) return null;
  return <div className="sentence-ladder" aria-label={label}>{lines.map((line) => <div key={line.id} className={line.id === currentStage ? 'current' : ''}><span>{line.label}</span><p>{line.text}</p>{line.id !== currentStage && <Check />}</div>)}</div>;
}
