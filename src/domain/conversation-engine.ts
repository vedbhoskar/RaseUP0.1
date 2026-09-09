import type { StageId } from './learning';

type TalkStageId = Extract<StageId, `${string}talk-${string}`>;
export type MascotTurn = { id: TalkStageId; prompt: string; suggestions: string[] };

const TURNS: Record<TalkStageId, MascotTurn> = {
  'talk-feeling': { id: 'talk-feeling', prompt: 'How do you feel when you win a game?', suggestions: ['I feel happy.', 'I feel proud.', 'I feel excited.'] },
  'talk-reason': { id: 'talk-reason', prompt: 'Why do you feel that way?', suggestions: ['Because I tried my best.', 'Because it was fun.', 'Because my friends cheered for me.'] },
  'talk-life': { id: 'talk-life', prompt: 'When did you feel proud?', suggestions: ['When I helped someone.', 'When I learned something new.', 'When I kept trying.'] },
  'why-talk-direct': { id: 'why-talk-direct', prompt: 'Why do you feel nervous before speaking in class?', suggestions: ['I feel nervous because I might make a mistake.', 'I feel nervous because everyone is listening.', 'I feel nervous because I want to do well.'] },
  'why-talk-reflect': { id: 'why-talk-reflect', prompt: 'Why did you feel proud recently?', suggestions: ['I felt proud because I helped someone.', 'I felt proud because I kept trying.', 'I felt proud because I learned something new.'] },
  'why-talk-advanced': { id: 'why-talk-advanced', prompt: 'Can a person feel two emotions at the same time? Why?', suggestions: ['Yes, because one moment can mean two things.', 'Yes, because feelings can change while something happens.', 'I think so, because I can be excited and nervous together.'] },
};

export function getMascotTurn(stageId: TalkStageId) { return TURNS[stageId]; }
export function getScaffold(stageId: TalkStageId, answer: string) {
  if (stageId === 'talk-reason' && !answer.trim().toLowerCase().startsWith('because')) return 'You can start with “because…”';
  if (stageId.startsWith('why-talk-') && !answer.toLowerCase().includes('because')) return 'Try adding “because…” to make your reason clear.';
  return null;
}
export function getAcknowledgement(stageId: TalkStageId) {
  const messages: Record<TalkStageId, string> = {
    'talk-feeling': 'Thanks for naming that feeling.',
    'talk-reason': 'That reason makes your idea clearer.',
    'talk-life': 'You shared a thoughtful example.',
    'why-talk-direct': 'That reason makes your feeling clearer.',
    'why-talk-reflect': 'You connected a feeling to your own experience.',
    'why-talk-advanced': 'You explained a complex idea in your own way.',
  };
  return messages[stageId];
}
