export const TEST_PHASES = {
  INSTRUCTIONS: 'instructions',
  COUNTDOWN: 'countdown',
  TEST: 'test',
  RESULTS: 'results',
} as const;

export const DEFAULT_COUNTDOWN = 3;

export const TIMING = {
  FEEDBACK_DURATION: 150,
  COUNTDOWN_INTERVAL: 1000,
  MIN_REACTION_TIME: 100,
  MAX_REACTION_TIME: 3000,
} as const;

export const GRADIENTS = {
  'blue-indigo': 'from-blue-500 to-indigo-500',
  'green-purple': 'from-green-500 to-purple-500',
  'purple-blue': 'from-purple-500 to-blue-500',
  'orange-purple': 'from-orange-500 to-purple-500',
} as const;

export const GRADIENT_BACKGROUNDS = {
  'blue-indigo': 'from-blue-500/20 to-indigo-500/20',
  'green-purple': 'from-green-500/20 to-purple-500/20',
  'purple-blue': 'from-purple-500/20 to-blue-500/20',
  'orange-purple': 'from-orange-500/20 to-purple-500/20',
} as const;
