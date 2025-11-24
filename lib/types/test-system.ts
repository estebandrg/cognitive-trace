import { LucideIcon } from 'lucide-react';
import { TestResult, Response, TestType } from './tests';
import { ReactNode } from 'react';

export type TestPhase = 'instructions' | 'countdown' | 'test' | 'results';

export interface TestConfig {
  testType: TestType;
  totalTrials: number;
  stimulusDuration: number;
  feedbackDuration?: number;
  interTrialInterval?: number;
  metadata: TestMetadata;
  recordMissesAutomatically?: boolean; // Default true, false for tests where no-response is valid (e.g., N-Back)
}

export interface TestMetadata {
  title: string;
  subtitle: string;
  description: string;
  duration: number; // in seconds
  icon: string;
  gradient: GradientTheme;
}

export type GradientTheme = 'blue-indigo' | 'green-purple' | 'purple-blue' | 'orange-purple';

export interface TestLogic<TResult extends TestResult, TTrial = any> {
  generateSequence: (config: TestConfig) => TTrial[];
  validateResponse: (trial: TTrial, input: InputEvent) => boolean;
  calculateResults: (
    responses: Response[],
    config: TestConfig,
    sequence: TTrial[]
  ) => TResult;
}

export interface InputEvent {
  type: 'keyboard' | 'touch' | 'click' | 'timeout';
  key?: string;
  timestamp: number;
  responseTime?: number;
  hasResponse: boolean;
}

export interface InputConfig {
  keyboard?: {
    enabled: boolean;
    keys?: string[];
  };
  touch?: {
    enabled: boolean;
  };
  click?: {
    enabled: boolean;
  };
}

export interface DemoCard {
  title: string;
  description: string;
  visual: ReactNode;
  color: string;
  action: 'respond' | 'withhold' | 'info';
}

export interface InstructionsContent {
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  gradient: GradientTheme;
  demoCards: DemoCard[];
  doList: string[];
  dontList: string[];
}

export interface TestState {
  phase: TestPhase;
  currentTrial: number;
  totalTrials: number;
  showFeedback: boolean;
  countdown: number;
}

export interface TestRunnerProps<TResult extends TestResult, TTrial = any> {
  config: TestConfig;
  logic: TestLogic<TResult, TTrial>;
  instructionsContent: InstructionsContent;
  onComplete: (result?: TResult) => void;
  renderStimulus: (trial: TTrial | null, state: TestState, onResponse?: (input: InputEvent) => void) => ReactNode;
  renderResults?: (result: TResult, onRetry: () => void, onContinue: () => void) => ReactNode;
  inputConfig: InputConfig;
  gradientTheme?: GradientTheme;
  onTrialStart?: (trial: TTrial, trialIndex: number) => void;
  onResponse?: (trial: TTrial, input: InputEvent, isCorrect: boolean) => void;
}
