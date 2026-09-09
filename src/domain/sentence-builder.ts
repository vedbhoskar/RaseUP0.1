import type { MoodId } from './learning';

type NaturalSentenceInput = { feeling: MoodId; situation: string; reason: string; intensity?: string };
function fragment(value: string) { return value.trim().replace(/[.!?]+$/u, ''); }

export function buildP1(feeling: MoodId) { return `I feel ${feeling}.`; }
export function buildP2(feeling: MoodId, situation: string) { return `I feel ${feeling} when ${fragment(situation)}.`; }
export function buildP3(feeling: MoodId, situation: string, reason: string) {
  return `I feel ${feeling} when ${fragment(situation)} because ${fragment(reason)}.`;
}
export function buildP4({ feeling, situation, reason, intensity }: NaturalSentenceInput) {
  const modifier = intensity ? `${fragment(intensity)} ` : '';
  return `To be honest, I feel ${modifier}${feeling} when ${fragment(situation)} because ${fragment(reason)}.`;
}
export function buildP5(feeling: MoodId, personalExample: string) {
  return `One thing that makes me feel ${feeling} is ${fragment(personalExample)}.`;
}
