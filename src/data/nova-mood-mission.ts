import type { GameDefinition, MoodId, SituationDefinition, StageDefinition } from '@/src/domain/learning';

export const MOODS: readonly { id: MoodId; label: string; symbol: string; color: string }[] = [
  { id: 'happy', label: 'Happy', symbol: '●', color: '#ffd465' },
  { id: 'sad', label: 'Sad', symbol: '⌢', color: '#91bdf2' },
  { id: 'excited', label: 'Excited', symbol: '✦', color: '#7fddd0' },
  { id: 'nervous', label: 'Nervous', symbol: '〰', color: '#f5b85d' },
  { id: 'proud', label: 'Proud', symbol: '★', color: '#c9f56b' },
  { id: 'scared', label: 'Scared', symbol: '!', color: '#dca0ec' },
  { id: 'unsure', label: 'Unsure', symbol: '?', color: '#b8c1f5' },
];

export const THINK_SITUATIONS: readonly SituationDefinition[] = [
  { id: 'won-game', category: 'positive', text: 'You won a game.', prompt: 'How might you feel in this moment?' },
  { id: 'lost-game', category: 'difficult', text: 'You lost a game.', prompt: 'How might you feel in this moment?' },
  { id: 'spoke-class', category: 'mixed', text: 'You spoke in front of the class.', prompt: 'Could you feel two things at once?' },
];

export const SITUATION_OPTIONS = ['I answer a question in class', 'I try something new', 'I play with my friends', 'I make a mistake'] as const;
export const REASON_OPTIONS = ['I want to do well', 'I might make a mistake', 'someone noticed my effort', 'it is fun to learn something new'] as const;
export const PERSONAL_OPTIONS = ['spending time with my family', 'helping others', 'playing games', 'learning something new'] as const;
export const INTENSITY_OPTIONS = ['a little', 'really', 'sometimes', 'very'] as const;

export const MISSION_STAGES: readonly StageDefinition[] = [
  { id: 'welcome', module: 'welcome', label: 'Meet Nova', title: 'Find the words for how you feel', instruction: 'We feel different things in different moments. Let’s find the words together.' },
  { id: 'think', module: 'think', label: 'Let’s Think', title: 'What mood fits the moment?', instruction: 'Read each situation and choose how you might feel. More than one feeling can fit.' },
  { id: 'speak-p1', module: 'speak', label: 'Feeling', title: 'Say your feeling', instruction: 'Start with a clear feeling: I feel blank.' },
  { id: 'speak-p2', module: 'speak', label: 'When', title: 'Add when it happens', instruction: 'Grow your sentence by adding when the feeling happens.' },
  { id: 'speak-p3', module: 'speak', label: 'Because', title: 'Add your reason', instruction: 'Add because so another person can understand your reason.' },
  { id: 'speak-p4', module: 'speak', label: 'Natural voice', title: 'Speak naturally', instruction: 'Add a natural opening and practise the complete sentence.' },
  { id: 'speak-p5', module: 'speak', label: 'Your life', title: 'Make it personal', instruction: 'Think of one real thing that brings you a feeling.' },
  { id: 'talk-feeling', module: 'talk', label: 'Talk: feeling', title: 'Talk with Nova', instruction: 'Answer Nova in your own way. You can speak, type, or choose a suggestion.' },
  { id: 'talk-reason', module: 'talk', label: 'Talk: reason', title: 'Tell Nova why', instruction: 'A reason helps Nova understand your thought.' },
  { id: 'talk-life', module: 'talk', label: 'Talk: your life', title: 'Share one example', instruction: 'Choose a safe example from your life or use a suggestion.' },
  { id: 'results', module: 'results', label: 'Mission complete', title: 'You made your idea clear', instruction: 'Look at the skills you practised today.' },
];

export const NOVA_MOOD_MISSION: GameDefinition = {
  id: 'nova-mood-mission',
  slug: 'nova-mood-mission',
  topicId: 'self-awareness',
  title: "Nova's Mood Mission",
  summary: 'Explore everyday moments, build a complete feeling sentence, and talk it through with Nova.',
  estimatedMinutes: 10,
  skills: ['feelingRecognition', 'situationConnection', 'reasonBuilding', 'speakingPractice'],
  stages: [...MISSION_STAGES],
};
