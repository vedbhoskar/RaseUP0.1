import type { GameDefinition, TopicDefinition, TopicId } from '@/src/domain/learning';
import { NOVA_MOOD_MISSION } from './nova-mood-mission';

export const TOPICS: readonly TopicDefinition[] = [{
  id: 'self-awareness',
  title: 'Self Awareness & Identity',
  description: 'Notice feelings, understand what shapes them, and express yourself clearly.',
  order: 1,
}];

export const GAMES: readonly GameDefinition[] = [NOVA_MOOD_MISSION];

export function listTopics() { return [...TOPICS].sort((a, b) => a.order - b.order); }
export function listGamesByTopic(topicId: TopicId) { return GAMES.filter((game) => game.topicId === topicId); }
export function getGame(gameId: GameDefinition['id']) {
  const game = GAMES.find((candidate) => candidate.id === gameId);
  if (!game) throw new Error(`Unknown game: ${gameId}`);
  return game;
}
