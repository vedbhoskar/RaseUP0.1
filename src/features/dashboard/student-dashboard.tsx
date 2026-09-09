'use client';

import { BookOpenCheck, Gamepad2, Home, Sparkles } from 'lucide-react';
import { getDashboardStats } from '@/src/domain/dashboard-stats';
import { listGamesByTopic, listTopics } from '@/src/data/topics';
import { useLearningStore } from '@/src/features/session/learning-store';
import { StatsGrid } from './stats-grid';
import { TopicSection } from './topic-section';

export function StudentDashboard() {
  const { state, ready, persistent } = useLearningStore();
  const stats = getDashboardStats(state.attempts);
  return <main className="app-shell student-home">
    <aside className="sidebar">
      <a className="brand" href="#top" aria-label="RaseUP home"><span className="brand-mark">R</span><span>RaseUP</span></a>
      <nav aria-label="Primary navigation"><a className="nav-item active" href="#top"><Home /> Home</a><a className="nav-item" href="#games"><Gamepad2 /> Games</a><a className="nav-item" href="#progress"><BookOpenCheck /> Progress</a></nav>
      <div className="student-sidebar-note"><Sparkles /><div><strong>Your words matter</strong><span>There is no wrong feeling here.</span></div></div>
    </aside>
    <section className="workspace" id="top">
      {!persistent && <output className="storage-notice">Progress cannot be saved on this device right now.</output>}
      <header className="student-topbar"><div><p className="eyebrow">Your learning space</p><h1>Ready to grow, {state.student.displayName}?</h1><p>Choose a game, practise at your pace, and watch your communication skills grow.</p></div><span className="student-avatar" aria-label={`${state.student.displayName}'s profile`}>{state.student.displayName.slice(0, 1)}</span></header>
      <div id="progress"><StatsGrid completedGames={stats.completedGames} streak={state.streak.current} averageScore={stats.averageScore} strongestSkill={stats.strongestSkill} /></div>
      {!ready ? <output className="dashboard-loading">Loading your games…</output> : listTopics().map((topic) => <TopicSection key={topic.id} topic={topic} games={listGamesByTopic(topic.id)} attempts={state.attempts} />)}
    </section>
  </main>;
}
