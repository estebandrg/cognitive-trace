'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { TestResult, Response } from '@/lib/types/tests';
import { TestRunnerProps, TestState, InputEvent as TestInputEvent } from '@/lib/types/test-system';
import { useTestPhases, useTestTimer, useTestInput, useTestResults } from '@/lib/hooks/tests';
import { TestInstructions, TestCountdown, TestProgress, TestFeedback } from '../ui';

export function TestRunner<TResult extends TestResult, TTrial = any>({
  config,
  logic,
  instructionsContent,
  onComplete,
  renderStimulus,
  inputConfig,
  gradientTheme = 'blue-indigo',
  renderResults,
  onTrialStart,
  onResponse,
}: TestRunnerProps<TResult, TTrial>) {
  const { phase, countdown, startCountdown, startTest, finishTest, reset, decrementCountdown } = useTestPhases();
  const { startTime, startTrial, getReactionTime, getDuration, start: startTimer, stop: stopTimer, reset: resetTimer } = useTestTimer();
  const { responses, result, addResponse, setResult, reset: resetResponses } = useTestResults<TResult>();

  const [sequence, setSequence] = useState<TTrial[]>([]);
  const [currentTrial, setCurrentTrial] = useState<TTrial | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  
  // Use refs for values that change frequently but don't need to trigger re-renders
  const currentTrialIndexRef = useRef(0);
  const stimulusTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const trialTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const responseGivenRef = useRef(false);
  
  // Display index (for UI only) - synced from ref
  const [displayTrialIndex, setDisplayTrialIndex] = useState(0);
  useEffect(() => {
    if (phase === 'instructions' && sequence.length === 0) {
      const generatedSequence = logic.generateSequence(config);
      setSequence(generatedSequence);
    }
  }, [phase, sequence.length, logic, config]);

  useEffect(() => {
    if (phase === 'countdown' && countdown > 0) {
      const timer = setTimeout(() => {
        if (countdown === 1) {
          startTest();
          startTimer();
          // Start first trial after a brief delay
          setTimeout(() => {
            if (showNextTrialRef.current) showNextTrialRef.current();
          }, 100);
        } else {
          decrementCountdown();
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [phase, countdown, startTest, startTimer, decrementCountdown]);

  const calculateResultsRef = useRef<(() => void) | null>(null);
  const showNextTrialRef = useRef<(() => void) | null>(null);

  // Extract common trial advancement logic
  const advanceToNextTrial = useCallback(() => {
    currentTrialIndexRef.current += 1;
    setDisplayTrialIndex(currentTrialIndexRef.current);
    
    const itiDuration = config.interTrialInterval || 0;
    if (itiDuration > 0) {
      trialTimeoutRef.current = setTimeout(() => {
        if (showNextTrialRef.current) showNextTrialRef.current();
      }, itiDuration);
    } else {
      if (showNextTrialRef.current) showNextTrialRef.current();
    }
  }, [config.interTrialInterval]);

  const showNextTrial = useCallback(() => {
    const trialIndex = currentTrialIndexRef.current;
    
    if (trialIndex >= config.totalTrials) {
      // Test complete
      stopTimer();
      if (calculateResultsRef.current) {
        calculateResultsRef.current();
      }
      return;
    }

    // Clear any existing timeouts
    if (stimulusTimeoutRef.current) {
      clearTimeout(stimulusTimeoutRef.current);
      stimulusTimeoutRef.current = null;
    }
    if (trialTimeoutRef.current) {
      clearTimeout(trialTimeoutRef.current);
      trialTimeoutRef.current = null;
    }

    // Reset response flag
    responseGivenRef.current = false;

    // Show current trial
    const trial = sequence[trialIndex];
    setCurrentTrial(trial);
    setDisplayTrialIndex(trialIndex);
    startTrial();

    // Call onTrialStart callback if provided
    if (onTrialStart) {
      onTrialStart(trial, trialIndex);
    }

    // Set timeout for stimulus duration
    stimulusTimeoutRef.current = setTimeout(() => {
      // No response given, record miss if needed
      if (!responseGivenRef.current && config.recordMissesAutomatically !== false) {
        // Validate no-response using the test logic
        const noResponseEvent: TestInputEvent = {
          type: 'timeout',
          hasResponse: false,
          timestamp: Date.now(),
          responseTime: config.stimulusDuration,
        };
        const correct = logic.validateResponse(trial, noResponseEvent);
        
        const missResponse: Response = {
          stimulus: JSON.stringify(trial),
          responseTime: config.stimulusDuration,
          correct,
          timestamp: Date.now(),
        };
        addResponse(missResponse);
      }

      // Hide stimulus and move to next trial
      setCurrentTrial(null);
      advanceToNextTrial();
    }, config.stimulusDuration);
  }, [config, sequence, addResponse, startTrial, stopTimer, onTrialStart, advanceToNextTrial, logic]);

  const handleInput = useCallback((inputEvent?: Partial<TestInputEvent>) => {
    if (phase !== 'test' || !currentTrial || responseGivenRef.current) return;

    const responseTime = getReactionTime();
    const fullInputEvent: TestInputEvent = {
      type: inputEvent?.type || 'keyboard',
      key: inputEvent?.key,
      hasResponse: true,
      timestamp: Date.now(),
      responseTime,
    };

    const correct = logic.validateResponse(currentTrial, fullInputEvent);

    const response: Response = {
      stimulus: JSON.stringify(currentTrial),
      responseTime,
      correct,
      timestamp: Date.now(),
    };

    addResponse(response);
    responseGivenRef.current = true;

    // Call onResponse callback if provided
    if (onResponse) {
      onResponse(currentTrial, fullInputEvent, correct);
    }

    // Show feedback
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), config.feedbackDuration || 150);

    // Clear all existing timeouts since response was given
    if (stimulusTimeoutRef.current) {
      clearTimeout(stimulusTimeoutRef.current);
      stimulusTimeoutRef.current = null;
    }
    if (trialTimeoutRef.current) {
      clearTimeout(trialTimeoutRef.current);
      trialTimeoutRef.current = null;
    }

    // Move to next trial
    setCurrentTrial(null);
    
    // Delay for feedback before advancing
    const feedbackDelay = config.interTrialInterval || config.feedbackDuration || 150;
    setTimeout(() => advanceToNextTrial(), feedbackDelay);
  }, [phase, currentTrial, getReactionTime, logic, addResponse, config, onResponse, advanceToNextTrial]);

  const { handleTouch } = useTestInput({
    config: inputConfig,
    onInput: (inputEvent) => handleInput(inputEvent),
    enabled: phase === 'test',
  });

  const calculateResults = useCallback(() => {
    const calculatedResult = logic.calculateResults(responses, config, sequence);
    
    // Add duration
    const finalResult = {
      ...calculatedResult,
      startTime,
      endTime: Date.now(),
      duration: getDuration(),
    } as TResult;

    setResult(finalResult);
    
    // Call onComplete directly instead of showing intermediate results
    if (onComplete) {
      onComplete(finalResult);
    } else {
      // Only show results phase if no onComplete handler
      finishTest();
    }
  }, [responses, config, sequence, logic, startTime, getDuration, setResult, finishTest, onComplete]);

  // Update refs whenever functions change
  useEffect(() => {
    calculateResultsRef.current = calculateResults;
  }, [calculateResults]);

  useEffect(() => {
    showNextTrialRef.current = showNextTrial;
  }, [showNextTrial]);

  useEffect(() => {
    return () => {
      if (stimulusTimeoutRef.current) clearTimeout(stimulusTimeoutRef.current);
      if (trialTimeoutRef.current) clearTimeout(trialTimeoutRef.current);
    };
  }, []);

  const handleReset = useCallback(() => {
    reset();
    resetTimer();
    resetResponses();
    currentTrialIndexRef.current = 0;
    setDisplayTrialIndex(0);
    setCurrentTrial(null);
    setShowFeedback(false);
    setSequence([]);
    if (stimulusTimeoutRef.current) clearTimeout(stimulusTimeoutRef.current);
    if (trialTimeoutRef.current) clearTimeout(trialTimeoutRef.current);
  }, [reset, resetTimer, resetResponses]);

  const testState: TestState = {
    phase,
    currentTrial: displayTrialIndex,
    totalTrials: config.totalTrials,
    showFeedback,
    countdown,
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* Background gradients matching landing page */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-tr from-pink-500/20 to-purple-500/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-gradient-to-br from-purple-500/10 to-blue-500/10 blur-3xl" />
      </div>

      <div className="w-full max-w-4xl container mx-auto px-4">
        {/* Instructions Phase */}
        {phase === 'instructions' && (
          <TestInstructions
            content={instructionsContent}
            onStart={startCountdown}
          />
        )}

        {/* Countdown Phase */}
        {phase === 'countdown' && (
          <TestCountdown
            countdown={countdown}
            gradient={gradientTheme}
            message="Remember: Press SPACE or TAP for all numbers except 3"
          />
        )}

        {/* Test Phase */}
        {phase === 'test' && (
          <div
            className={`text-center space-y-8 relative min-h-[80vh] flex flex-col justify-center select-none ${inputConfig.touch?.enabled ? 'cursor-pointer' : ''}`}
            {...(inputConfig.touch?.enabled ? {
              onClick: handleTouch,
              onTouchStart: (e: React.TouchEvent) => {
                e.preventDefault();
                handleTouch();
              }
            } : {})}
          >
            {/* Feedback overlay */}
            <TestFeedback show={showFeedback} gradient={gradientTheme} />

            {/* Progress */}
            <TestProgress
              currentTrial={displayTrialIndex}
              totalTrials={config.totalTrials}
            />

            {/* Stimulus */}
            {renderStimulus(currentTrial, testState, handleInput)}
          </div>
        )}

        {/* Results Phase */}
        {phase === 'results' && result && renderResults && renderResults(result, handleReset, () => onComplete(result))}
      </div>
    </div>
  );
}
