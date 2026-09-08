'use client';

import { ArrowRight, Check, LockKeyhole, Mic2, ShieldCheck, Sparkles, Star, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { JOURNEY } from '@/src/data/brave-mic';
import { useLearningStore } from '@/src/features/session/learning-store';

export function LearnerDashboard({ onOpenParent }: { onOpenParent: () => void }) {
  const { state } = useLearningStore();
  const approved = state.approvalStatus === 'approved';
  const latest = state.attempts[0];

  return <div className="learner-dashboard">
    <section className={`learner-stage ${approved ? '' : 'learner-locked'}`}>
      <div className="learner-copy"><span className="status-pill mint-pill">{approved ? 'Ready to play' : 'Waiting for a grown-up'}</span><p className="eyebrow dark">{JOURNEY.unit}</p><h2>{JOURNEY.title}</h2><p>Help Nova face a big classroom moment. Notice feelings, find the reasons, and build a brave sentence.</p>{approved ? <Button onClick={() => { window.location.href = '/journey/brave-mic'; }} className="primary-button learner-start">{latest ? 'Play again' : 'Start journey'} <ArrowRight /></Button> : <Button onClick={onOpenParent} className="primary-button"><ShieldCheck /> Ask a grown-up to review</Button>}</div>
      <div className="mission-map" aria-label="Five part journey"><div className="path-line"/><span className="map-stop done">1<small>Notice</small></span><span className="map-stop">2<small>Prepare</small></span><span className="map-stop">3<small>Speak</small></span><span className="map-stop">4<small>Reflect</small></span><span className={`map-stop ${approved ? '' : 'locked'}`}>5<small>Grow</small></span>{!approved && <div className="map-lock"><LockKeyhole /><strong>Review needed</strong><span>Your grown-up checks the journey before it opens.</span></div>}</div>
    </section>
    <section className="learner-lower-grid">
      <article className="learner-stat"><span className="learner-stat-icon lime"><Trophy /></span><div><p>Best score</p><strong>{latest ? `${Math.max(...state.attempts.map((item) => item.score))}%` : 'New!'}</strong></div></article>
      <article className="learner-stat"><span className="learner-stat-icon coral"><Mic2 /></span><div><p>Speaking attempts</p><strong>{state.attempts.length}</strong></div></article>
      <article className="learner-stat"><span className="learner-stat-icon violet"><Star /></span><div><p>Journey streak</p><strong>{state.streak} days</strong></div></article>
      <article className="learner-achievement"><Sparkles /><div><p className="eyebrow">Next badge</p><strong>Reason Builder</strong><span>{latest ? <><Check /> Earned</> : 'Complete a feeling-and-reason sentence.'}</span></div></article>
    </section>
  </div>;
}
