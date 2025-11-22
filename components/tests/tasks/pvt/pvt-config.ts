import { TestConfig } from '@/lib/types/test-system';

export const pvtConfig: TestConfig = {
  testType: 'pvt',
  totalTrials: 8,
  stimulusDuration: 3000,
  feedbackDuration: 1500,
  interTrialInterval: 0,
  metadata: {
    title: 'PVT Task',
    subtitle: 'Psychomotor Vigilance Test',
    description: 'Mide tu tiempo de reacción y estado de vigilancia',
    duration: 40,
    icon: 'Zap',
    gradient: 'orange-purple',
  }
};

export const PVT_CONSTANTS = {
  MIN_WAIT_TIME: 2000,
  MAX_WAIT_TIME: 7000,
  LAPSE_THRESHOLD: 500,
};
