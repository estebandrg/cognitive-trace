'use client';

import { SARTResult } from '@/lib/types/tests';
import { TestRunner } from '../../core/test-runner';
import { sartConfig } from './sart-config';
import { sartLogic } from './sart-logic';
import { sartInstructions } from './sart-instructions';
import { SARTStimulus } from './sart-stimulus';
import { TestResults, ResultsSummary } from '../../ui/results';

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
      renderResults={(result, onRetry, onContinue) => (
        <TestResults
          title="SART Results"
          subtitle="Your sustained attention performance"
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
              label: 'Omissions',
              value: result.omissions,
              color: 'orange',
            },
            {
              label: 'Commissions',
              value: result.commissions,
              color: 'red',
            },
          ]}
          summarySection={
            <ResultsSummary title="Performance Summary">
              <p>• <strong>Omissions:</strong> Missed responses to target numbers</p>
              <p>• <strong>Commissions:</strong> Incorrect responses to number 3</p>
              <p>• <strong>RT Variability:</strong> {result.reactionTimeVariability.toFixed(0)}ms</p>
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
