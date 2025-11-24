'use client';

import { SARTResult } from '@/lib/types/tests';
import { TestRunner } from '../../core/test-runner';
import { sartConfig } from './sart-config';
import { sartLogic } from './sart-logic';
import { sartInstructions } from './sart-instructions';
import { SARTStimulus } from './sart-stimulus';

interface SARTTestProps {
  onComplete: (result?: SARTResult) => void;
}

export default function SARTTest({ onComplete }: SARTTestProps) {
  return (
    <TestRunner
      config={sartConfig}
      logic={sartLogic}
      instructionsContent={sartInstructions}
      onComplete={onComplete}
      renderStimulus={(trial, state, onResponse) => (
        <SARTStimulus 
          trial={trial}
          showFeedback={state.showFeedback}
        />
      )}
      inputConfig={{
        keyboard: {
          enabled: true,
          keys: ['Space'],
        },
        touch: {
          enabled: true,
        },
      }}
      gradientTheme="blue-indigo"
    />
  );
}
