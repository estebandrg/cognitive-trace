import { TestConfig } from '@/lib/types/test-system';

export const flankerConfig: TestConfig = {
  testType: 'flanker',
  totalTrials: 40,
  stimulusDuration: 2000,
  feedbackDuration: 500,
  interTrialInterval: 800,
  metadata: {
    title: 'Flanker Task',
    subtitle: 'Cognitive Control Test',
    description: 'Mide tu capacidad de control cognitivo y resistencia a la interferencia',
    duration: 60,
    icon: 'Target',
    gradient: 'green-purple',
  }
};
