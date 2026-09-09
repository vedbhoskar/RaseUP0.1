import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function StageActions({ onBack, onNext, nextLabel = 'Continue', disabled = false }: { onBack?: () => void; onNext: () => void; nextLabel?: string; disabled?: boolean }) {
  return <div className="mission-stage-actions">{onBack ? <Button variant="ghost" onClick={onBack}><ArrowLeft /> Back</Button> : <span />}<Button className="mission-next" disabled={disabled} onClick={onNext}>{nextLabel} <ArrowRight /></Button></div>;
}
