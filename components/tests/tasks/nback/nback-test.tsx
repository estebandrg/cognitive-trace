'use client';

import { useState } from 'react';
import { NBackResult } from '@/lib/types/tests';
import { TestRunner } from '../../core/test-runner';
import { nbackConfig } from './nback-config';
import { nbackLogic } from './nback-logic';
import { nbackInstructions } from './nback-instructions';
import { NBackStimulus } from './nback-stimulus';
import { TestResults, ResultsSummary } from '../../ui/results';

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
      renderResults={(result, onRetry, onContinue) => {
        const sensitivity = result.hits / (result.hits + result.misses) || 0;
        const specificity = result.correctRejections / (result.correctRejections + result.falsePositives) || 0;
        
        return (
          <TestResults
            title="N-Back Results"
            subtitle="Your working memory performance"
            metrics={[
              {
                label: 'Overall Accuracy',
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
                label: 'Hits',
                value: result.hits,
                color: 'purple',
              },
              {
                label: 'False Positives',
                value: result.falsePositives,
                color: 'orange',
              },
            ]}
            summarySection={
              <ResultsSummary title="Signal Detection Theory">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {(sensitivity * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Sensitivity</div>
                    <p className="text-xs mt-1">Ability to detect matches</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {(specificity * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Specificity</div>
                    <p className="text-xs mt-1">Ability to reject non-matches</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm">
                    <strong>Misses:</strong> {result.misses} | <strong>Correct Rejections:</strong> {result.correctRejections}
                  </p>
                </div>
              </ResultsSummary>
            }
            onRetry={onRetry}
            onContinue={onContinue}
            result={result}
          />
        );
      }}
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
