'use client';

import { useState } from 'react';
import { NBackResult } from '@/lib/types/tests';
import { TestRunner } from '../../core/test-runner';
import { nbackConfig } from './nback-config';
import { nbackLogic } from './nback-logic';
import { nbackInstructions } from './nback-instructions';
import { NBackStimulus } from './nback-stimulus';

interface NBackTestProps {
  onComplete: (result?: NBackResult) => void;
}

export default function NBackTest({ onComplete }: NBackTestProps) {
  const [lastResponse, setLastResponse] = useState<{ correct: boolean; isMatch: boolean } | null>(null);
  const [showResponseFeedback, setShowResponseFeedback] = useState(false);

  return (
    <TestRunner
      config={nbackConfig}
      logic={nbackLogic}
      instructionsContent={nbackInstructions}
      onComplete={onComplete}
      onTrialStart={() => {
        // Clear previous feedback on new trial
        setLastResponse(null);
        setShowResponseFeedback(false);
      }}
      onResponse={(trial, input, isCorrect) => {
        setLastResponse({ correct: isCorrect, isMatch: trial.isTarget });
        setShowResponseFeedback(true);
        setTimeout(() => setShowResponseFeedback(false), 150);
      }}
      renderStimulus={(trial, state, onResponse) => (
        <NBackStimulus
          trial={trial}
          showFeedback={state.showFeedback}
          showResponseFeedback={showResponseFeedback}
          lastResponse={lastResponse}
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
      gradientTheme="purple-blue"
    />
  );
}
