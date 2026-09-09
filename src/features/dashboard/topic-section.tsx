import type { GameDefinition, TopicDefinition } from '@/src/domain/learning';
import { getGameCardStatus } from '@/src/domain/dashboard-stats';
import type { GameAttempt } from '@/src/domain/learning';
import { GameCard } from './game-card';

export function TopicSection({ topic, games, attempts }: { topic: TopicDefinition; games: GameDefinition[]; attempts: GameAttempt[] }) {
  return <section className="topic-section" id="games"><header><div><p className="eyebrow">Topic {topic.order}</p><h2>{topic.title}</h2></div><p>{topic.description}</p></header><div className="topic-games">{games.map((game) => <GameCard key={game.id} game={game} status={getGameCardStatus(attempts)} />)}</div></section>;
}
