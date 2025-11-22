'use client';

import { useState, useCallback } from 'react';
import { FlankerResult } from '@/lib/types/tests';
import { TestRunner } from '../../core/test-runner';
import { flankerConfig } from './flanker-config';
import { flankerLogic } from './flanker-logic';
import { flankerInstructions } from './flanker-instructions';
import { FlankerStimulus } from './flanker-stimulus';
import { TestResults, ResultsSummary } from '../../ui/results';

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
      renderResults={(result, onRetry, onContinue) => (
        <TestResults
          title="Flanker Results"
          subtitle="Your cognitive control performance"
          metrics={[
            {
              label: 'Accuracy',
              value: (result.accuracy * 100).toFixed(1),
              suffix: '%',
              color: 'green',
            },
            {
              label: 'Avg Reaction Time',
              value: result.averageReactionTime.toFixed(0),
              suffix: 'ms',
              color: 'blue',
            },
            {
              label: 'Congruent RT',
              value: result.congruentRT.toFixed(0),
              suffix: 'ms',
              color: 'purple',
            },
            {
              label: 'Incongruent RT',
              value: result.incongruentRT.toFixed(0),
              suffix: 'ms',
              color: 'orange',
            },
          ]}
          summarySection={
            <ResultsSummary title="Interference Effect">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">
                  {result.interferenceEffect.toFixed(0)}ms
                </div>
                <p className="text-sm">
                  Diferencia entre tiempos de respuesta incongruentes y congruentes
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Un efecto menor indica mejor control cognitivo
                </p>
              </div>
            </ResultsSummary>
          }
          onRetry={onRetry}
          onContinue={onContinue}
          result={result}
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
