import type { SkillScore } from './learning';

export function buildFeelingChangeSentence(beforeFeeling: string, afterFeeling: string, reason: string) {
  if (!beforeFeeling || !afterFeeling || !reason) return '';
  const normalizedReason = reason.replace(/\.$/, '');
  return `At first I felt ${beforeFeeling}, but later I felt ${afterFeeling} because ${normalizedReason}.`;
}

export function scoreAttempt(speakingMode: 'recorded' | 'practised' | 'supported') {
  const skills: SkillScore = {
    feeling: 100,
    reason: 90,
    speaking: speakingMode === 'recorded' ? 100 : speakingMode === 'practised' ? 78 : 60,
    reflection: 92,
  };
  const score = Math.round(Object.values(skills).reduce((sum, value) => sum + value, 0) / Object.keys(skills).length);
  return { skills, score };
}
