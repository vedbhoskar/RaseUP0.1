import type { MoodId } from './learning';

function fragment(value: string) { return value.trim().replace(/[.!?]+$/u, ''); }

export function buildWhyP1(feeling: MoodId, reason: string) {
  return `I feel ${feeling} because ${fragment(reason)}.`;
}

export function buildWhyP2(feeling: MoodId, reason: string, secondReason: string) {
  return `I feel ${feeling} because ${fragment(reason)}, and also because ${fragment(secondReason)}.`;
}

export function buildWhyP3(firstFeeling: MoodId, laterFeeling: MoodId, reason: string) {
  return `At first I felt ${firstFeeling}, but later I felt ${laterFeeling} because ${fragment(reason)}.`;
}

export function buildWhyP4(firstFeeling: MoodId, secondFeeling: MoodId) {
  return `Part of me feels ${firstFeeling}, but another part feels ${secondFeeling}.`;
}

export function buildWhyP5(feeling: MoodId, mainReason: string) {
  return `The main reason I feel ${feeling} is that ${fragment(mainReason)}.`;
}

export function buildWhyP6(feeling: MoodId, reason: string) {
  return `To be honest, I feel ${feeling} because ${fragment(reason)}.`;
}

export function buildWhyP7(feeling: MoodId, reason: string) {
  return `Looking back, I realize that I felt ${feeling} because ${fragment(reason)}.`;
}

