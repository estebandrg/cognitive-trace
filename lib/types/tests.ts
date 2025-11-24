export type TestType = 'sart' | 'flanker' | 'nback' | 'pvt';

export interface TestResult {
  testType: TestType;
  startTime: number;
  endTime: number;
  duration: number;
  accuracy: number;
  averageReactionTime: number;
  responses: Response[];
}

export interface Response {
  stimulus: string | number;
  responseTime: number;
  correct: boolean;
  timestamp: number;
}

export interface SARTResult extends TestResult {
  omissions: number;
  commissions: number;
  reactionTimeVariability: number;
}

export interface FlankerResult extends TestResult {
  congruentRT: number;
  incongruentRT: number;
  interferenceEffect: number;
}

export interface NBackResult extends TestResult {
  hits: number;
  falsePositives: number;
  misses: number;
  correctRejections: number;
}

export interface PVTResult extends TestResult {
  lapses: number; // RT > 500ms
  minRT: number;
  maxRT: number;
  falseStarts: number;
}

export interface TestConfig {
  testType: TestType;
  title: string;
  description: string;
  duration: number; // in seconds
  icon: string;
  color: string;
}
