import { Flame, Gamepad2, Sparkles, TrendingUp } from 'lucide-react';
import type { SkillId } from '@/src/domain/learning';

const SKILL_LABELS: Record<SkillId, string> = {
  feelingRecognition: 'Feeling Finder',
  situationConnection: 'Situation Connector',
  reasonBuilding: 'Reason Builder',
  speakingPractice: 'Brave Speaker',
};

export function StatsGrid({ completedGames, streak, averageScore, strongestSkill }: { completedGames: number; streak: number; averageScore: number | null; strongestSkill: SkillId | null }) {
  const stats = [
    { label: 'Games completed', value: completedGames || 'New', icon: Gamepad2, tone: 'lime' },
    { label: 'Practice streak', value: `${streak} days`, icon: Flame, tone: 'coral' },
    { label: 'Average score', value: averageScore === null ? '—' : `${averageScore}%`, icon: TrendingUp, tone: 'blue' },
    { label: 'Strongest skill', value: strongestSkill ? SKILL_LABELS[strongestSkill] : 'Ready to grow', icon: Sparkles, tone: 'violet' },
  ];
  return <section className="student-stats" aria-label="Your learning stats">{stats.map(({ label, value, icon: Icon, tone }) => <article className="student-stat" key={label}><span className={`student-stat-icon ${tone}`}><Icon /></span><div><p>{label}</p><strong>{value}</strong></div></article>)}</section>;
}
