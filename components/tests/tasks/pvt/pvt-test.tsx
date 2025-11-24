'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { PVTResult, Response } from '@/lib/types/tests';
import { TestInstructions } from '../../ui/instructions';
import { TestCountdown } from '../../ui/test-countdown';
import { TestProgress } from '../../ui/test-progress';
import { PVTStimulus } from './pvt-stimulus';
import { pvtInstructions } from './pvt-instructions';
import { pvtConfig, PVT_CONSTANTS } from './pvt-config';

interface PVTTestProps {
  onComplete: (result?: PVTResult) => void;
}

export default function PVTTest({ onComplete }: PVTTestProps) {
  const [phase, setPhase] = useState<'instructions' | 'countdown' | 'test'>('instructions');
  const [countdown, setCountdown] = useState(3);
  const [trialCount, setTrialCount] = useState(0);
  const [responses, setResponses] = useState<Response[]>([]);
  const [startTime, setStartTime] = useState(0);
  const [stimulusStartTime, setStimulusStartTime] = useState(0);
  const [isWaiting, setIsWaiting] = useState(false);
  const [showStimulus, setShowStimulus] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastRT, setLastRT] = useState<number | null>(null);
  const [falseStart, setFalseStart] = useState(false);
  const [showResponseFeedback, setShowResponseFeedback] = useState(false);
  const hasRespondedRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { MIN_WAIT_TIME, MAX_WAIT_TIME, LAPSE_THRESHOLD } = PVT_CONSTANTS;
  const TOTAL_TRIALS = pvtConfig.totalTrials;
  const STIMULUS_TIMEOUT = pvtConfig.stimulusDuration;
  const FEEDBACK_DURATION = pvtConfig.feedbackDuration || 1500;

  const calculateResults = useCallback(() => {
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Valid responses are those with RT > 100ms and < timeout (excluding false starts with RT=0)
    const validResponses = responses.filter(r => r.responseTime < STIMULUS_TIMEOUT && r.responseTime > 100);
    const lapses = validResponses.filter(r => r.responseTime > LAPSE_THRESHOLD).length;
    const falseStarts = responses.filter(r => r.responseTime === 0 && !r.correct).length;
    
    const reactionTimes = validResponses.map(r => r.responseTime);
    const averageRT = reactionTimes.length > 0 
      ? reactionTimes.reduce((sum, rt) => sum + rt, 0) / reactionTimes.length 
      : 0;
    
    const minRT = reactionTimes.length > 0 ? Math.min(...reactionTimes) : 0;
    const maxRT = reactionTimes.length > 0 ? Math.max(...reactionTimes) : 0;
    // Accuracy: correct responses / total trials
    const accuracy = responses.filter(r => r.correct).length / TOTAL_TRIALS;
    
    const finalResult: PVTResult = {
      testType: 'pvt',
      startTime,
      endTime,
      duration,
      accuracy,
      averageReactionTime: averageRT,
      responses,
      lapses,
      minRT,
      maxRT,
      falseStarts
    };
    
    // Call onComplete directly instead of showing intermediate results
    onComplete(finalResult);
  }, [startTime, responses, TOTAL_TRIALS, STIMULUS_TIMEOUT, LAPSE_THRESHOLD, onComplete]);

  const runTrial = useCallback((trialNumber: number) => {
    if (trialNumber > TOTAL_TRIALS) {
      calculateResults();
      return;
    }
    
    // Reset states
    setIsWaiting(true);
    setShowStimulus(false);
    setFalseStart(false);
    hasRespondedRef.current = false;
    setTrialCount(trialNumber);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    const waitTime = MIN_WAIT_TIME + Math.random() * (MAX_WAIT_TIME - MIN_WAIT_TIME);
    
    setTimeout(() => {
      if (hasRespondedRef.current) return;
      
      setShowStimulus(true);
      setStimulusStartTime(Date.now());
      
      timeoutRef.current = setTimeout(() => {
        if (hasRespondedRef.current) return;
        
        hasRespondedRef.current = true;
        const response: Response = {
          stimulus: 'reaction-stimulus',
          responseTime: STIMULUS_TIMEOUT,
          correct: false,
          timestamp: Date.now()
        };
        
        setResponses(prev => [...prev, response]);
        setShowStimulus(false);
        setIsWaiting(false);
        setShowFeedback(true);
        setLastRT(STIMULUS_TIMEOUT);
        
        setTimeout(() => {
          setShowFeedback(false);
          setLastRT(null);
          runTrial(trialNumber + 1);
        }, FEEDBACK_DURATION);
      }, STIMULUS_TIMEOUT);
    }, waitTime);
  }, [calculateResults, TOTAL_TRIALS, MIN_WAIT_TIME, MAX_WAIT_TIME, STIMULUS_TIMEOUT, FEEDBACK_DURATION]);

  const handleClick = useCallback(() => {
    if (phase !== 'test' || hasRespondedRef.current) return;
    
    hasRespondedRef.current = true;
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    if (showStimulus) {
      const responseTime = Date.now() - stimulusStartTime;
      
      const response: Response = {
        stimulus: 'reaction-stimulus',
        responseTime,
        correct: true,
        timestamp: Date.now()
      };
      
      setResponses(prev => [...prev, response]);
      setLastRT(responseTime);
      setShowStimulus(false);
      setIsWaiting(false);
      setShowFeedback(true);
      
      setShowResponseFeedback(true);
      setTimeout(() => setShowResponseFeedback(false), 150);
      
      setTimeout(() => {
        setShowFeedback(false);
        setLastRT(null);
        runTrial(trialCount + 1);
      }, FEEDBACK_DURATION);
    } else if (isWaiting && !showStimulus) {
      // False start - responded before stimulus appeared
      const response: Response = {
        stimulus: 'reaction-stimulus',
        responseTime: 0, // No valid RT for false starts
        correct: false,
        timestamp: Date.now()
      };
      
      setResponses(prev => [...prev, response]);
      setFalseStart(true);
      setShowFeedback(true);
      setIsWaiting(false);
      
      setTimeout(() => {
        setFalseStart(false);
        setShowFeedback(false);
        runTrial(trialCount + 1);
      }, FEEDBACK_DURATION);
    } else {
      hasRespondedRef.current = false;
    }
  }, [phase, stimulusStartTime, runTrial, showStimulus, isWaiting, FEEDBACK_DURATION, trialCount]);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (event.code === 'Space') {
      event.preventDefault();
      handleClick();
    }
  }, [handleClick]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (phase === 'countdown' && countdown > 0) {
      const timer = setTimeout(() => {
        if (countdown === 1) {
          setPhase('test');
          setStartTime(Date.now());
          runTrial(1);
        } else {
          setCountdown(prev => prev - 1);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [phase, countdown, runTrial]);

  const handleStart = () => {
    setPhase('countdown');
    setCountdown(3);
  };

  const handleRetry = () => {
    setPhase('instructions');
    setResponses([]);
    setTrialCount(0);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-orange-500/20 to-purple-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-tr from-red-500/20 to-purple-500/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-gradient-to-br from-purple-500/10 to-orange-500/10 blur-3xl" />
      </div>

      <div className="w-full max-w-4xl container mx-auto px-4">
        {phase === 'instructions' && (
          <TestInstructions
            content={pvtInstructions}
            onStart={handleStart}
          />
        )}

        {phase === 'countdown' && (
          <TestCountdown
            countdown={countdown}
            gradient="orange-purple"
            message="Maintain focus and react as fast as possible"
          />
        )}

        {phase === 'test' && (
          <div className="text-center space-y-8">
            <TestProgress currentTrial={trialCount} totalTrials={pvtConfig.totalTrials} />
            <PVTStimulus
              isWaiting={isWaiting}
              showStimulus={showStimulus}
              showFeedback={showFeedback}
              showResponseFeedback={showResponseFeedback}
              falseStart={falseStart}
              lastRT={lastRT}
              onResponse={handleClick}
            />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Click the button, tap the screen, or press SPACEBAR when it appears
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
