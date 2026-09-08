'use client';

import { LearningProvider } from '@/src/features/session/learning-store';

export function Providers({ children }: { children: React.ReactNode }) {
  return <LearningProvider>{children}</LearningProvider>;
}
