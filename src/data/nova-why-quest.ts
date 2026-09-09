import type { GameDefinition, MoodId, SituationDefinition, StageDefinition } from '@/src/domain/learning';

export const WHY_MOODS: readonly { id: MoodId; label: string; symbol: string; color: string }[] = [
  { id: 'happy', label: 'Happy', symbol: '●', color: '#ffd465' },
  { id: 'sad', label: 'Sad', symbol: '⌢', color: '#91bdf2' },
  { id: 'nervous', label: 'Nervous', symbol: '〰', color: '#f5b85d' },
  { id: 'proud', label: 'Proud', symbol: '★', color: '#c9f56b' },
  { id: 'scared', label: 'Scared', symbol: '!', color: '#dca0ec' },
  { id: 'disappointed', label: 'Disappointed', symbol: '↓', color: '#a9c4df' },
  { id: 'confused', label: 'Confused', symbol: '?', color: '#c9b5ef' },
  { id: 'frustrated', label: 'Frustrated', symbol: '≈', color: '#f3a88e' },
  { id: 'comfortable', label: 'Comfortable', symbol: '○', color: '#9ed8b5' },
  { id: 'unsure', label: 'Unsure', symbol: '…', color: '#b8c1f5' },
];

export const WHY_THINK_SITUATIONS: readonly SituationDefinition[] = [
  { id: 'worked-hard', category: 'difficult', text: 'You worked very hard but still did not get good marks.', prompt: 'How do you feel, and why?' },
  { id: 'friend-helped', category: 'positive', text: 'Your friend helped you when you really needed support.', prompt: 'How do you feel, and what makes that feeling strong?' },
  { id: 'spoke-class', category: 'mixed', text: 'You spoke in front of the class. At first you were scared, but later you did well.', prompt: 'How did your feelings change, and why?' },
  { id: 'mistake-noticed', category: 'difficult', text: 'You made a mistake and everyone noticed it.', prompt: 'What did you feel then, and what do you feel now?' },
  { id: 'helped-unnoticed', category: 'mixed', text: 'You helped someone, but no one noticed it.', prompt: 'How do you feel, and does helping still feel meaningful?' },
];

export const WHY_REASON_OPTIONS = ['I worked hard', 'someone supported me', 'I was not fully prepared', 'I achieved something important', 'things did not go as expected'] as const;
export const WHY_SECOND_REASON_OPTIONS = ['I was afraid of making mistakes', 'other people noticed it', 'my effort mattered to me', 'I enjoy a challenge'] as const;
export const WHY_MAIN_REASON_OPTIONS = ['I helped someone sincerely', 'I achieved my goal', 'I learned from the experience', 'I wanted to do my best'] as const;
export const WHY_REFLECTION_OPTIONS = ['I was not prepared', 'the experience was meaningful', 'I expected too much', 'I understood the situation better later'] as const;

export const WHY_QUEST_STAGES: readonly StageDefinition[] = [
  { id: 'why-welcome', module: 'welcome', label: 'Meet Nova', title: 'Find the reason behind a feeling', instruction: 'A clear reason helps another person understand what you feel. Let’s practise one step at a time.' },
  { id: 'why-think', module: 'think', label: 'Let’s Think', title: 'What could be behind this feeling?', instruction: 'Read each situation, choose the feeling or feelings that fit, and add a short reason.' },
  { id: 'why-speak-p1', module: 'speak', label: 'P1 · Clear reason', title: 'Connect a feeling to one reason', instruction: 'Use because to connect what you feel with why you feel it.' },
  { id: 'why-speak-p2', module: 'speak', label: 'P2 · Multiple reasons', title: 'Add another reason', instruction: 'One feeling can have more than one reason. Add a second reason to make your thought clearer.' },
  { id: 'why-speak-p3', module: 'speak', label: 'P3 · Change', title: 'Show how a feeling changed', instruction: 'Compare how you felt at first with how you felt later, then explain the change.' },
  { id: 'why-speak-p4', module: 'speak', label: 'P4 · Mixed feelings', title: 'Name two feelings at once', instruction: 'Two feelings can be true together. Give each one a place in your sentence.' },
  { id: 'why-speak-p5', module: 'speak', label: 'P5 · Main reason', title: 'Choose the reason that matters most', instruction: 'Think about all your reasons and say which one feels most important.' },
  { id: 'why-speak-p6', module: 'speak', label: 'P6 · Honest expression', title: 'Say it honestly', instruction: 'Use a natural opening, then practise your complete thought aloud.' },
  { id: 'why-speak-p7', module: 'speak', label: 'P7 · Reflection', title: 'Look back with a clearer view', instruction: 'Looking back can help you understand an earlier feeling. Build and practise a reflective sentence.' },
  { id: 'why-talk-direct', module: 'talk', label: 'Talk · Direct', title: 'Explain a familiar feeling', instruction: 'Answer Nova with a feeling and a reason. Speak, type, or use a suggestion.' },
  { id: 'why-talk-reflect', module: 'talk', label: 'Talk · Reflection', title: 'Connect it to your experience', instruction: 'Choose a safe example from your life and explain why you felt that way.' },
  { id: 'why-talk-advanced', module: 'talk', label: 'Talk · Advanced', title: 'Think about mixed feelings', instruction: 'There is no single correct answer. Tell Nova what makes sense to you.' },
  { id: 'why-results', module: 'results', label: 'Quest complete', title: 'Your reasons made your ideas clearer', instruction: 'Look at the reasoning and speaking skills you practised.' },
];

export const NOVA_WHY_QUEST: GameDefinition = {
  id: 'nova-why-quest',
  slug: 'nova-why-quest',
  curriculumCode: '1.2',
  topicId: 'self-awareness',
  title: "Nova's Why Quest",
  summary: 'Connect feelings to reasons, explore mixed emotions, and explain your thinking with Nova.',
  estimatedMinutes: 15,
  skills: ['feelingRecognition', 'situationConnection', 'reasonBuilding', 'speakingPractice'],
  stages: [...WHY_QUEST_STAGES],
};
