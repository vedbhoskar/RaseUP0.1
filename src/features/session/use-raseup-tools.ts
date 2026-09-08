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
  const { state, approveJourney } = useLearningStore();

  useEffect(() => {
    const context = document.modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();

    const tools: ToolDefinition[] = [
      {
        name: 'read_learning_summary',
        title: 'Read learning summary',
        description: 'Read the learner name, journey approval state, attempt count, and latest score shown in RaseUP.',
        inputSchema: { type: 'object', properties: {}, additionalProperties: false },
        annotations: { readOnlyHint: true, untrustedContentHint: false },
        execute: (input) => { assertEmptyInput(input); return { learner: state.learnerName, approvalStatus: state.approvalStatus, attempts: state.attempts.length, latestScore: state.attempts[0]?.score ?? null }; },
      },
      {
        name: 'approve_brave_mic',
        title: 'Approve The Brave Mic',
        description: 'Approve The Brave Mic journey and unlock it on the learner dashboard.',
        inputSchema: { type: 'object', properties: {}, additionalProperties: false },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        execute: (input) => { assertEmptyInput(input); approveJourney(); return { journeyId: 'brave-mic', status: 'approved' }; },
      },
    ];

    for (const tool of tools) {
      try { void Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })); } catch { /* Unsupported preview host. */ }
    }
    return () => lifecycle.abort();
  }, [approveJourney, state]);
}

function assertEmptyInput(input: unknown) {
  if (!input || typeof input !== 'object' || Array.isArray(input) || Object.keys(input).length > 0) {
    throw new Error('This tool accepts an empty object only.');
  }
}
