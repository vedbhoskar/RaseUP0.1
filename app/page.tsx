'use client';

import { StudentDashboard } from '@/src/features/dashboard/student-dashboard';
import { useRaseUpTools } from '@/src/features/session/use-raseup-tools';

export default function HomePage() {
  useRaseUpTools();
  return <StudentDashboard />;
}
