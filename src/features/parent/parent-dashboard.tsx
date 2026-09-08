'use client';

import { useState } from 'react';
import { ArrowRight, Check, ChevronRight, CircleCheckBig, Flame, Headphones, LockKeyhole, RotateCcw, ShieldCheck, Sparkles, Star, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { JOURNEY } from '@/src/data/brave-mic';
import { averageSkill } from '@/src/domain/learning';
import { useLearningStore } from '@/src/features/session/learning-store';

export function ParentDashboard({ onOpenLearner }: { onOpenLearner: () => void }) {
  const { state, approveJourney, resetDemo } = useLearningStore();
  const [changeRequested, setChangeRequested] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const latest = state.attempts[0];
  const feeling = latest ? averageSkill(state.attempts, 'feeling') : 0;
  const reason = latest ? averageSkill(state.attempts, 'reason') : 0;
  const speaking = latest ? averageSkill(state.attempts, 'speaking') : 0;

  return <div className="dashboard-grid">
    <section className={`feature-card ${state.approvalStatus === 'approved' ? 'approved-card' : 'coral-card'}`}>
      <div>
        <span className="status-pill">{state.approvalStatus === 'approved' ? 'Approved for Aarav' : 'Ready for review'}</span>
        <p className="eyebrow dark">Today’s learning journey</p><h2>{JOURNEY.title}</h2>
        <p>A guided classroom story for naming feelings, explaining reasons, and speaking with growing independence.</p>
      </div>
      <div className="feature-actions">
        {state.approvalStatus === 'needs-review' ? <Button onClick={() => setReviewOpen((open) => !open)} className="primary-button">{reviewOpen ? 'Close review' : 'Review journey'} <ArrowRight /></Button> : <Button onClick={onOpenLearner} className="primary-button">Open learner view <ArrowRight /></Button>}
        <span>{JOURNEY.duration} · Speaking & reflection</span>
      </div>
      <div className="orbit orbit-one" aria-hidden="true" /><div className="orbit orbit-two" aria-hidden="true" />
    </section>

    {reviewOpen && state.approvalStatus === 'needs-review' && <ReviewPanel onApprove={() => { approveJourney(); setReviewOpen(false); }} changeRequested={changeRequested} onRequestChange={() => setChangeRequested(true)} />}

    <section className="metric-card"><div className="metric-icon mint"><Flame /></div><span>This week</span><strong>{state.streak} day streak</strong><p>{state.attempts.length ? `${state.attempts.length} journey attempt${state.attempts.length === 1 ? '' : 's'} saved on this device.` : 'Aarav’s first guided journey is ready.'}</p></section>

    <section className="metric-card trend-card"><span className="eyebrow">Latest score</span><strong className="big-number">{latest ? `${latest.score}%` : '—'}</strong><div className="spark-bars" aria-hidden="true"><i style={{height:latest ? '52%' : '18%'}}/><i style={{height:latest ? '62%' : '18%'}}/><i style={{height:latest ? '68%' : '18%'}}/><i style={{height:latest ? `${Math.max(latest.score, 24)}%` : '18%'}}/></div><p>{latest ? 'The score reflects communication skills, not which feeling Aarav selected.' : 'Complete a journey to see skill evidence here.'}</p></section>

    <section className="panel wide" id="progress">
      <div className="panel-heading"><div><p className="eyebrow">{latest ? 'Latest attempt' : 'Learning focus'}</p><h2>{latest ? latest.journeyTitle : 'Expressing feelings with reasons'}</h2></div><span className="score-ring">{latest?.score ?? 0}<small>%</small></span></div>
      <SkillRow label="Names a feeling" value={feeling} />
      <SkillRow label="Connects a reason" value={reason} />
      <SkillRow label="Speaks independently" value={speaking} />
    </section>

    <section className="panel" id="journeys">
      <div className="panel-heading"><div><p className="eyebrow">Recent activity</p><h2>Learning trail</h2></div>{(state.attempts.length > 0 || state.approvalStatus === 'approved') && <button className="text-button" onClick={resetDemo}><RotateCcw /> Reset demo</button>}</div>
      {latest ? state.attempts.slice(0, 3).map((attempt) => <div className="trail-item" key={attempt.id}><span className="trail-icon amber"><Star /></span><div className="trail-copy"><strong>{attempt.journeyTitle}</strong><p>{new Date(attempt.completedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} · {attempt.score}% · {attempt.beforeFeeling} → {attempt.afterFeeling}</p></div><ChevronRight /></div>) : <div className="empty-trail"><LockKeyhole /><strong>No attempts yet</strong><p>Approve the journey, then switch to Learner to begin.</p></div>}
    </section>

    {latest && <section className="panel insight-panel"><div className="metric-icon mint"><TrendingUp /></div><p className="eyebrow">What changed</p><h2>{latest.beforeFeeling} → {latest.afterFeeling}</h2><blockquote>“{latest.sentence}”</blockquote><p>The response is stored as learning evidence. Personal feelings are never graded as right or wrong.</p></section>}
  </div>;
}

function SkillRow({ label, value }: { label: string; value: number }) {
  const descriptor = value >= 85 ? 'Strong' : value >= 65 ? 'Growing' : value > 0 ? 'Practising' : 'Not tried';
  return <div className="skill-row"><span>{label}</span><Progress value={value}/><strong>{descriptor}</strong></div>;
}

function ReviewPanel({ onApprove, changeRequested, onRequestChange }: { onApprove: () => void; changeRequested: boolean; onRequestChange: () => void }) {
  return <section className="review-panel" aria-label="Parent journey review"><div className="review-panel-heading"><div><span className="dialog-kicker"><ShieldCheck /> Parent review</span><h2>{JOURNEY.title}</h2><p>Check what Aarav will see and what will be recorded before unlocking the journey.</p></div><span className="review-duration">8–10 min</span></div><div className="review-list"><ReviewItem icon={<Sparkles />} label="Learning goal" value={JOURNEY.objective}/><ReviewItem icon={<Headphones />} label="Learner actions" value="Choose feelings, build a reason, practise speaking, and reflect."/><ReviewItem icon={<CircleCheckBig />} label="How feedback works" value="Effort and clear expression are recognised. Feelings are never marked wrong."/><ReviewItem icon={<ShieldCheck />} label="Data saved" value="Attempts, skill scores, selected feelings, and the completed sentence stay on this device."/></div>{changeRequested && <div className="request-note"><Check /> Change request saved: reduce speaking support next time.</div>}<div className="review-actions"><Button variant="outline" onClick={onRequestChange}>Request a change</Button><Button className="approve-button" onClick={onApprove}>Approve & unlock</Button></div></section>;
}

function ReviewItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="review-item"><span>{icon}</span><div><strong>{label}</strong><p>{value}</p></div></div>;
}
