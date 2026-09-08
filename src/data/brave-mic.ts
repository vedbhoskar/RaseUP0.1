export const JOURNEY = {
  id: 'brave-mic' as const,
  title: 'The Brave Mic',
  unit: 'Quest 1 · Self Awareness & Identity',
  duration: '8–10 min',
  objective: 'Express how a feeling changes over time and connect it to a clear reason.',
  sentencePattern: 'At first I felt ___, but later I felt ___ because ___.',
};

export const GAME_STEPS = [
  { id: 'arrival', label: 'Meet the moment' },
  { id: 'before', label: 'Notice' },
  { id: 'reason', label: 'Explain' },
  { id: 'prepare', label: 'Prepare' },
  { id: 'practice', label: 'Practise' },
  { id: 'present', label: 'Speak' },
  { id: 'after', label: 'Notice again' },
  { id: 'connect', label: 'Connect' },
  { id: 'transfer', label: 'Try it yourself' },
  { id: 'complete', label: 'Reflect' },
] as const;

export const BEFORE_FEELINGS = [
  { id: 'nervous', label: 'Nervous', symbol: '〰', color: '#f7bf62' },
  { id: 'scared', label: 'Scared', symbol: '!', color: '#dd91ef' },
  { id: 'excited', label: 'Excited', symbol: '✦', color: '#86ddd1' },
  { id: 'unsure', label: 'Unsure', symbol: '?', color: '#94bff4' },
] as const;

export const AFTER_FEELINGS = [
  { id: 'proud', label: 'Proud', symbol: '★', color: '#c9f56b' },
  { id: 'relieved', label: 'Relieved', symbol: '◡', color: '#8ddccc' },
  { id: 'happy', label: 'Happy', symbol: '●', color: '#ffd56b' },
  { id: 'still nervous', label: 'Still nervous', symbol: '〰', color: '#f1a4a7' },
] as const;

export const REASONS = [
  'I might make a mistake.',
  'Everyone is looking at me.',
  'I want to do well.',
  'I have not spoken to a class before.',
] as const;

export const PREPARATION_TOOLS = [
  { id: 'breathe', title: 'Take three calm breaths', detail: 'Follow the circle as it grows and shrinks.', symbol: '○' },
  { id: 'rehearse', title: 'Rehearse one time', detail: 'Say the idea quietly before the big moment.', symbol: '↻' },
  { id: 'cue', title: 'Keep a cue card', detail: 'Use three tiny prompts instead of memorising.', symbol: '≡' },
] as const;

export const PRESENTATION_LINES = [
  'Good morning, everyone.',
  'Today I want to share one thing I learned.',
  'Thank you for listening.',
] as const;
