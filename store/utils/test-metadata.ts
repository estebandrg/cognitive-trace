import type { TestType } from '@/lib/types/tests';

export interface TestMetadata {
  name: string;
  fullName: string;
  description: string;
  duration: string;
  icon: string;
  color: string;
}

export const getTestMetadata = (testType: TestType): TestMetadata => {
  const metadata: Record<TestType, TestMetadata> = {
    sart: {
      name: 'SART',
      fullName: 'Sustained Attention to Response Task',
      description: 'Measures sustained attention and attention lapses',
      duration: '~45 seconds',
      icon: '👁️',
      color: 'blue',
    },
    flanker: {
      name: 'Flanker',
      fullName: 'Flanker Task',
      description: 'Tests cognitive control and interference resistance',
      duration: '~60 seconds',
      icon: '🎯',
      color: 'green',
    },
    nback: {
      name: 'N-Back',
      fullName: 'N-Back Task (2-Back)',
      description: 'Assesses working memory capacity',
      duration: '~50 seconds',
      icon: '🧠',
      color: 'purple',
    },
    pvt: {
      name: 'PVT',
      fullName: 'Psychomotor Vigilance Task',
      description: 'Tests reaction time and vigilance',
      duration: '~40 seconds',
      icon: '⚡',
      color: 'orange',
    },
  };

  return metadata[testType];
};

export const ALL_TEST_TYPES: TestType[] = ['sart', 'flanker', 'nback', 'pvt'];
