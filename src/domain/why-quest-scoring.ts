import type { GameAttempt, MissionScore, SkillId } from './learning';

function percent(parts: boolean[]) {
  if (!parts.length) return 0;
  return Math.round((parts.filter(Boolean).length / parts.length) * 100);
}

export function scoreWhyQuest(attempt: GameAttempt): MissionScore {
  const response = attempt.response;
  const feelingRecognition = percent([
    ...response.thinkResponses.slice(0, 5).map((item) => Boolean(item.moods.length)),
    Boolean(response.feeling),
    Boolean(response.secondFeeling),
    Boolean(response.laterFeeling),
  ]);
  const situationConnection = percent([
    ...response.thinkResponses.slice(0, 5).map((item) => Boolean(item.reason?.trim())),
    Boolean(response.reflectionReasonText?.trim()),
  ]);
  const reasonBuilding = percent([
    Boolean(response.reasonText?.trim()),
    Boolean(response.secondReasonText?.trim()),
    Boolean(response.changeReasonText?.trim()),
    Boolean(response.mainReasonText?.trim()),
    ...(['why-talk-direct', 'why-talk-reflect', 'why-talk-advanced'] as const).map((turnId) => response.talkAnswers.some((answer) => answer.turnId === turnId && answer.attempted)),
  ]);
  const speakingPractice = percent([
    attempt.practiceStageIds.includes('why-speak-p6'),
    attempt.practiceStageIds.includes('why-speak-p7'),
    ...(['why-talk-direct', 'why-talk-reflect', 'why-talk-advanced'] as const).map((turnId) => response.talkAnswers.some((answer) => answer.turnId === turnId && answer.attempted)),
  ]);
  const skills: Record<SkillId, number> = { feelingRecognition, situationConnection, reasonBuilding, speakingPractice };
  const overall = Math.round(Object.values(skills).reduce((sum, value) => sum + value, 0) / Object.values(skills).length);
  return { overall, ...skills };
}
