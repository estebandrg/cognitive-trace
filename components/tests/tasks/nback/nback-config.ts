import { TestConfig } from '@/lib/types/test-system';

export const nbackConfig: TestConfig = {
  testType: 'nback',
  totalTrials: 30,
  stimulusDuration: 2000,
  feedbackDuration: 150,
  interTrialInterval: 200,
  recordMissesAutomatically: false, // No-response is valid for non-targets
  metadata: {
    title: 'N-Back Task',
    subtitle: '2-Back Working Memory Test',
    description: 'Mide tu capacidad de memoria de trabajo y actualización continua',
    duration: 50,
    icon: 'Brain',
    gradient: 'purple-blue',
  }
};

export const NBACK_CONSTANTS = {
  N_BACK: 2,
  LETTERS: ['A', 'B', 'C', 'D', 'E', 'F'],
  TARGET_FREQUENCY: 0.25,
};
