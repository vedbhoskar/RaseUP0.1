import { Check } from 'lucide-react';
import { MOODS } from '@/src/data/nova-mood-mission';
import type { MoodId } from '@/src/domain/learning';

export function MoodPicker({ value, onChange, multiple = false }: { value: MoodId[]; onChange: (moods: MoodId[]) => void; multiple?: boolean }) {
  function toggle(mood: MoodId) {
    if (!multiple) { onChange([mood]); return; }
    if (value.includes(mood)) onChange(value.filter((item) => item !== mood));
    else onChange([...value, mood].slice(-2));
  }
  return <div className="mission-mood-grid">{MOODS.map((mood) => {
    const selected = value.includes(mood.id);
    return <button key={mood.id} className={selected ? 'selected' : ''} style={{ '--mood': mood.color } as React.CSSProperties} onClick={() => toggle(mood.id)} aria-pressed={selected}><span>{mood.symbol}</span><strong>{mood.label}</strong>{selected && <Check />}</button>;
  })}</div>;
}
