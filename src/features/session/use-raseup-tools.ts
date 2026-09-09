'use client';

import { useEffect } from 'react';
import { useLearningStore } from './learning-store';

type ToolDefinition = {
  name: string;
  title: string;
  description: string;
  inputSchema: Record<string, unknown>;
  annotations: { readOnlyHint: boolean; untrustedContentHint: boolean };
  execute: (input: unknown) => unknown;
};

declare global {
  interface Document {
    modelContext?: { registerTool(tool: ToolDefinition, options?: { signal?: AbortSignal }): void | Promise<void> };
  }
}

export function useRaseUpTools() {
  const { state, startGame } = useLearningStore();

  useEffect(() => {
    const context = document.modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();

    const tools: ToolDefinition[] = [
      {
        name: 'read_learning_summary',
        title: 'Read learning summary',
        description: 'Read the student name, completed game count, current streak, and latest score shown in RaseUP.',
        inputSchema: { type: 'object', properties: {}, additionalProperties: false },
        annotations: { readOnlyHint: true, untrustedContentHint: false },
        execute: (input) => {
          assertEmptyInput(input);
          const completed = state.attempts.filter((attempt) => attempt.status === 'completed');
          return { student: state.student.displayName, completedGames: completed.length, currentStreak: state.streak.current, latestScore: completed[0]?.score?.overall ?? null };
        },
      },
      {
        name: 'start_or_resume_mood_mission',
        title: "Start or resume Nova's Mood Mission",
        description: "Start Nova's Mood Mission, or resume the student's existing in-progress attempt.",
        inputSchema: { type: 'object', properties: {}, additionalProperties: false },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        execute: (input) => { assertEmptyInput(input); return { gameId: 'nova-mood-mission', attemptId: startGame('nova-mood-mission'), path: '/games/nova-mood-mission' }; },
      },
      {
        name: 'start_or_resume_why_quest',
        title: "Start or resume Nova's Why Quest",
        description: "Start Topic 1.2, Nova's Why Quest, or resume the student's in-progress attempt.",
        inputSchema: { type: 'object', properties: {}, additionalProperties: false },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        execute: (input) => { assertEmptyInput(input); return { gameId: 'nova-why-quest', attemptId: startGame('nova-why-quest'), path: '/games/nova-why-quest' }; },
      },
    ];

    for (const tool of tools) {
      try { void Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })); } catch { /* Unsupported preview host. */ }
    }
    return () => lifecycle.abort();
  }, [startGame, state]);
}

function assertEmptyInput(input: unknown) {
  if (!input || typeof input !== 'object' || Array.isArray(input) || Object.keys(input).length > 0) {
    throw new Error('This tool accepts an empty object only.');
  }
}
