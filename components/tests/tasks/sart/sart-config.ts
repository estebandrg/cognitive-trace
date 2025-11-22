import { TestConfig } from '@/lib/types/test-system';

export const sartConfig: TestConfig = {
  testType: 'sart',
  totalTrials: 45,
  stimulusDuration: 1000, // 1 second per stimulus
  feedbackDuration: 150,
  interTrialInterval: 0,
  metadata: {
    title: 'SART Task',
    subtitle: 'Sustained Attention to Response Task',
    description: 'Mide tu capacidad para mantener atención sostenida y resistir respuestas automáticas',
    duration: 45, // in seconds
    icon: 'Eye',
    gradient: 'blue-indigo',
  }
};

export const SART_CONSTANTS = {
  NO_GO_NUMBER: 3,
  NO_GO_FREQUENCY: 0.2, // 20% no-go trials
  VALID_NUMBERS: [0, 1, 2, 4, 5, 6, 7, 8, 9],
};
