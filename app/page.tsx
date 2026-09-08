'use client';

import { useState } from 'react';
import { BarChart3, BookOpenCheck, Home, ShieldCheck, Sparkles, UserRound } from 'lucide-react';
import { ParentDashboard } from '@/src/features/parent/parent-dashboard';
import { LearnerDashboard } from '@/src/features/learner/learner-dashboard';
import { useLearningStore } from '@/src/features/session/learning-store';
import { useRaseUpTools } from '@/src/features/session/use-raseup-tools';

type View = 'parent' | 'learner';

export default function HomePage() {
  const [view, setView] = useState<View>('parent');
  const { state } = useLearningStore();
  useRaseUpTools();

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#top" aria-label="RaseUP home"><span className="brand-mark">R</span><span>RaseUP</span></a>
        <nav aria-label="Primary navigation">
          <a className="nav-item active" href="#top"><Home /> Home</a>
          <a className="nav-item" href="#journeys"><BookOpenCheck /> Journeys</a>
          <a className="nav-item" href="#progress"><BarChart3 /> Progress</a>
        </nav>
        <div className="sidebar-note"><ShieldCheck /><div><strong>Grown-up approved</strong><span>Every journey is reviewed before play.</span></div></div>
      </aside>

      <section className="workspace" id="top">
        <header className="topbar">
          <div><p className="eyebrow">Tuesday, 8 September</p><h1>{view === 'parent' ? `Good morning, ${state.parentName}` : `Ready for your next adventure, ${state.learnerName}?`}</h1></div>
          <div className="role-switch" aria-label="Choose dashboard">
            <button className={view === 'parent' ? 'selected' : ''} onClick={() => setView('parent')}><UserRound /> Parent</button>
            <button className={view === 'learner' ? 'selected' : ''} onClick={() => setView('learner')}><Sparkles /> Learner</button>
          </div>
        </header>
        {view === 'parent' ? <ParentDashboard onOpenLearner={() => setView('learner')} /> : <LearnerDashboard onOpenParent={() => setView('parent')} />}
      </section>
    </main>
  );
}
