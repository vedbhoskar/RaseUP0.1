import type { StageId } from './learning';

type TalkStageId = Extract<StageId, `talk-${string}`>;
type MascotTurn = { id: TalkStageId; prompt: string; suggestions: string[] };

const TURNS: Record<TalkStageId, MascotTurn> = {
  'talk-feeling': { id: 'talk-feeling', prompt: 'How do you feel when you win a game?', suggestions: ['I feel happy.', 'I feel proud.', 'I feel excited.'] },
  'talk-reason': { id: 'talk-reason', prompt: 'Why do you feel that way?', suggestions: ['Because I tried my best.', 'Because it was fun.', 'Because my friends cheered for me.'] },
  'talk-life': { id: 'talk-life', prompt: 'When did you feel proud?', suggestions: ['When I helped someone.', 'When I learned something new.', 'When I kept trying.'] },
};

export function getMascotTurn(stageId: TalkStageId) { return TURNS[stageId]; }
export function getScaffold(stageId: TalkStageId, answer: string) {
  if (stageId === 'talk-reason' && !answer.trim().toLowerCase().startsWith('because')) return 'You can start with “because…”';
  return null;
}
export function getAcknowledgement(stageId: TalkStageId) {
  const messages: Record<TalkStageId, string> = {
    'talk-feeling': 'Thanks for naming that feeling.',
    'talk-reason': 'That reason makes your idea clearer.',
    'talk-life': 'You shared a thoughtful example.',
  };
  return messages[stageId];
}
