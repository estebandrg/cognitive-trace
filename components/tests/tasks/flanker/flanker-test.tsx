'use client';

import { useState } from 'react';
import { FlankerResult } from '@/lib/types/tests';
import { TestRunner } from '../../core/test-runner';
import { flankerConfig } from './flanker-config';
import { flankerLogic } from './flanker-logic';
import { flankerInstructions } from './flanker-instructions';
import { FlankerStimulus } from './flanker-stimulus';

interface FlankerTestProps {
  onComplete: (result?: FlankerResult) => void;
}

export default function FlankerTest({ onComplete }: FlankerTestProps) {
  const [lastResponse, setLastResponse] = useState<{ correct: boolean; rt: number } | null>(null);

  return (
    <TestRunner
      config={flankerConfig}
      logic={flankerLogic}
      instructionsContent={flankerInstructions}
      onComplete={onComplete}
      onResponse={(trial, input, isCorrect) => {
        setLastResponse({ correct: isCorrect, rt: input.responseTime || 0 });
      }}
      renderStimulus={(trial, state, onResponse) => (
        <FlankerStimulus
          trial={trial}
          showFeedback={state.showFeedback}
          lastResponse={lastResponse}
          onDirectionSelect={(direction) => {
            onResponse?.({ type: 'touch', key: direction, hasResponse: true, timestamp: Date.now() });
          }}
        />
      )}
      inputConfig={{
        keyboard: {
          enabled: true,
          keys: ['ArrowLeft', 'ArrowRight'],
        },
        touch: {
          enabled: false, // Buttons handle their own touch
        },
      }}
      gradientTheme="green-purple"
    />
  );
}
