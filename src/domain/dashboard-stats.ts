import type { GameAttempt, GameId, SkillId } from './learning';

export function getDashboardStats(attempts: GameAttempt[]) {
  const completed = attempts.filter((attempt) => attempt.status === 'completed' && attempt.score);
  if (!completed.length) return { completedGames: 0, averageScore: null, strongestSkill: null };
  const averageScore = Math.round(completed.reduce((sum, attempt) => sum + (attempt.score?.overall ?? 0), 0) / completed.length);
  const skillIds: SkillId[] = ['feelingRecognition', 'situationConnection', 'reasonBuilding', 'speakingPractice'];
  const strongestSkill = skillIds.reduce((best, skill) => {
    const total = completed.reduce((sum, attempt) => sum + (attempt.score?.[skill] ?? 0), 0);
    const bestTotal = completed.reduce((sum, attempt) => sum + (attempt.score?.[best] ?? 0), 0);
    return total > bestTotal ? skill : best;
  });
  return { completedGames: completed.length, averageScore, strongestSkill };
}

export function getGameCardStatus(attempts: GameAttempt[], gameId: GameId): 'start' | 'continue' | 'replay' {
  if (attempts.some((attempt) => attempt.gameId === gameId && attempt.status === 'in-progress')) return 'continue';
  if (attempts.some((attempt) => attempt.gameId === gameId && attempt.status === 'completed')) return 'replay';
  return 'start';
}
