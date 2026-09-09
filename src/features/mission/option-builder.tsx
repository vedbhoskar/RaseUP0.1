import { Check, PencilLine } from 'lucide-react';

export function OptionBuilder({ label, options, value, onChange, placeholder }: { label: string; options: readonly string[]; value: string; onChange: (value: string) => void; placeholder: string }) {
  return <div className="option-builder"><p className="stage-question">{label}</p><div className="choice-chip-grid">{options.map((option) => <button key={option} className={value === option ? 'selected' : ''} onClick={() => onChange(option)}>{value === option && <Check />}{option}</button>)}</div><label className="custom-answer"><PencilLine /><span className="sr-only">{placeholder}</span><input value={options.includes(value) ? '' : value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /></label></div>;
}
