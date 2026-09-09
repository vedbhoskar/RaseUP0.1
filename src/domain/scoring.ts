import type { GameAttempt, MissionScore, SkillId } from './learning';

function percent(parts: boolean[]) {
  if (!parts.length) return 0;
  return Math.round((parts.filter(Boolean).length / parts.length) * 100);
}

export function scoreMission(attempt: GameAttempt): MissionScore {
  const response = attempt.response;
  const feelingRecognition = percent([
    ...[0, 1, 2].map((index) => Boolean(response.thinkResponses[index]?.moods.length)),
    Boolean(response.feeling),
  ]);
  const situationConnection = percent([Boolean(response.situationText?.trim()), Boolean(response.personalExample?.trim())]);
  const reasonBuilding = percent([
    Boolean(response.reasonText?.trim()),
    response.talkAnswers.some((answer) => answer.turnId === 'talk-reason' && answer.attempted),
  ]);
  const speakingPractice = percent([
    attempt.practiceStageIds.includes('speak-p4'),
    ...(['talk-feeling', 'talk-reason', 'talk-life'] as const).map((turnId) => response.talkAnswers.some((answer) => answer.turnId === turnId && answer.attempted)),
  ]);
  const skills: Record<SkillId, number> = { feelingRecognition, situationConnection, reasonBuilding, speakingPractice };
  const overall = Math.round(Object.values(skills).reduce((sum, value) => sum + value, 0) / Object.values(skills).length);
  return { overall, ...skills };
}
