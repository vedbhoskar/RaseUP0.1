import Link from 'next/link';
import { Check, Home, RotateCcw, Sparkles, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { GameAttempt, SkillId } from '@/src/domain/learning';
import { buildP4, buildP5 } from '@/src/domain/sentence-builder';

const LABELS: Record<SkillId, string> = { feelingRecognition: 'Feeling Finder', situationConnection: 'Situation Connector', reasonBuilding: 'Reason Builder', speakingPractice: 'Brave Speaker' };

export function MissionResults({ attempt, onPlayAgain }: { attempt: GameAttempt; onPlayAgain: () => void }) {
  const score = attempt.score;
  const response = attempt.response;
  const completeSentence = response.feeling && response.situationText && response.reasonText ? buildP4({ feeling: response.feeling, situation: response.situationText, reason: response.reasonText, intensity: response.intensity }) : '';
  const personalSentence = response.feeling && response.personalExample ? buildP5(response.feeling, response.personalExample) : '';
  return <div className="mission-results"><span className="result-star"><Star /></span><p className="stage-kicker"><Sparkles /> Mission complete</p><h2>You made your idea clear</h2><p>You noticed, built, spoke, and talked your thought through.</p><div className="result-score"><strong>{score?.overall ?? 0}%</strong><span>communication score</span></div><div className="result-skills">{(Object.keys(LABELS) as SkillId[]).map((skill) => <div key={skill}><span><Check /> {LABELS[skill]}</span><strong>{score?.[skill] ?? 0}%</strong></div>)}</div>{completeSentence && <blockquote>{completeSentence}</blockquote>}{personalSentence && <blockquote>{personalSentence}</blockquote>}<div className="result-actions"><Link href="/" className="result-home"><Home /> See my dashboard</Link><Button variant="outline" onClick={onPlayAgain}><RotateCcw /> Play again</Button></div></div>;
}
