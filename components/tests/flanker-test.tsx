'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { FlankerResult, Response } from '@/lib/types/tests';
import { Target, RotateCcw, ArrowLeft, ArrowRight } from 'lucide-react';

interface FlankerTestProps {
  onComplete: (result?: FlankerResult) => void;
}

type TrialType = 'congruent' | 'incongruent';
type Direction = 'left' | 'right';

interface Trial {
  arrows: string;
  targetDirection: Direction;
  type: TrialType;
}

export default function FlankerTest({ onComplete }: FlankerTestProps) {
  const [phase, setPhase] = useState<'instructions' | 'countdown' | 'test' | 'results'>('instructions');
  const [currentTrial, setCurrentTrial] = useState<Trial | null>(null);
  const [trialCount, setTrialCount] = useState(0);
  const [responses, setResponses] = useState<Response[]>([]);
  const [startTime, setStartTime] = useState(0);
  const [stimulusStartTime, setStimulusStartTime] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [testResult, setTestResult] = useState<FlankerResult | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastResponse, setLastResponse] = useState<{ correct: boolean; rt: number } | null>(null);

  const TOTAL_TRIALS = 40;
  const STIMULUS_DURATION = 2000; // 2 seconds max response time
  const FEEDBACK_DURATION = 500; // 500ms feedback
  const ITI_DURATION = 800; // Inter-trial interval

  const generateTrials = useCallback(() => {
    const trials: Trial[] = [];
    const congruentTrials = TOTAL_TRIALS / 2;
    
    // Generate congruent trials
    for (let i = 0; i < congruentTrials / 2; i++) {
      trials.push({
        arrows: '← ← ← ← ←',
        targetDirection: 'left',
        type: 'congruent'
      });
      trials.push({
        arrows: '→ → → → →',
        targetDirection: 'right',
        type: 'congruent'
      });
    }
    
    // Generate incongruent trials
    for (let i = 0; i < congruentTrials / 2; i++) {
      trials.push({
        arrows: '→ → ← → →',
        targetDirection: 'left',
        type: 'incongruent'
      });
      trials.push({
        arrows: '← ← → ← ←',
        targetDirection: 'right',
        type: 'incongruent'
      });
    }
    
    // Shuffle trials
    for (let i = trials.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [trials[i], trials[j]] = [trials[j], trials[i]];
    }
    
    return trials;
  }, []);

  const [trials] = useState(() => generateTrials());

  const handleResponse = useCallback((responseDirection: Direction) => {
    if (phase !== 'test' || currentTrial === null || showFeedback) return;
    
    const responseTime = Date.now() - stimulusStartTime;
    const correct = responseDirection === currentTrial.targetDirection;
    
    const response: Response = {
      stimulus: `${currentTrial.type}-${currentTrial.targetDirection}`,
      responseTime,
      correct,
      timestamp: Date.now()
    };
    
    setResponses(prev => [...prev, response]);
    setLastResponse({ correct, rt: responseTime });
    setShowFeedback(true);
    
    // Hide stimulus and show feedback
    setTimeout(() => {
      setShowFeedback(false);
      setCurrentTrial(null);
      setLastResponse(null);
      
      // Continue to next trial after ITI
      setTimeout(() => {
        setTrialCount(currentTrialCount => {
          if (currentTrialCount < TOTAL_TRIALS) {
            setTimeout(showNextTrial, 100);
          } else {
            calculateResults();
          }
          return currentTrialCount;
        });
      }, ITI_DURATION);
    }, FEEDBACK_DURATION);
  }, [phase, currentTrial, stimulusStartTime, showFeedback, trialCount]);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (phase !== 'test' || currentTrial === null || showFeedback) return;
    
    let responseDirection: Direction | null = null;
    
    if (event.code === 'ArrowLeft') {
      responseDirection = 'left';
    } else if (event.code === 'ArrowRight') {
      responseDirection = 'right';
    }
    
    if (responseDirection) {
      event.preventDefault();
      handleResponse(responseDirection);
    }
  }, [phase, currentTrial, showFeedback, handleResponse]);

  const handleTouch = useCallback((direction: Direction) => {
    if (phase !== 'test' || currentTrial === null || showFeedback) return;
    handleResponse(direction);
  }, [phase, currentTrial, showFeedback, handleResponse]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const calculateResults = useCallback(() => {
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    const validResponses = responses.filter(r => r.responseTime < STIMULUS_DURATION && r.responseTime > 100);
    const correctResponses = validResponses.filter(r => r.correct);
    
    const congruentResponses = validResponses.filter(r => String(r.stimulus).includes('congruent') && r.correct);
    const incongruentResponses = validResponses.filter(r => String(r.stimulus).includes('incongruent') && r.correct);
    
    const congruentRT = congruentResponses.length > 0 ? 
      congruentResponses.reduce((sum, r) => sum + r.responseTime, 0) / congruentResponses.length : 0;
    
    const incongruentRT = incongruentResponses.length > 0 ? 
      incongruentResponses.reduce((sum, r) => sum + r.responseTime, 0) / incongruentResponses.length : 0;
    
    const interferenceEffect = incongruentRT - congruentRT;
    
    const averageRT = correctResponses.length > 0 ? 
      correctResponses.reduce((sum, r) => sum + r.responseTime, 0) / correctResponses.length : 0;
    
    const accuracy = correctResponses.length / responses.length;
    
    const result: FlankerResult = {
      testType: 'flanker',
      startTime,
      endTime,
      duration,
      accuracy,
      averageReactionTime: averageRT,
      responses,
      congruentRT,
      incongruentRT,
      interferenceEffect
    };
    
    setTestResult(result);
    setPhase('results');
  }, [startTime, responses]);

  const showNextTrial = useCallback(() => {
    setTrialCount(prevTrialCount => {
      if (prevTrialCount >= TOTAL_TRIALS) {
        calculateResults();
        return prevTrialCount;
      }
      
      const trial = trials[prevTrialCount];
      setCurrentTrial(trial);
      setStimulusStartTime(Date.now());
      
      // Auto-advance if no response
      const timeoutId = setTimeout(() => {
        setShowFeedback(currentShowFeedback => {
          if (!currentShowFeedback) {
            // Record no response
            const response: Response = {
              stimulus: `${trial.type}-${trial.targetDirection}`,
              responseTime: STIMULUS_DURATION,
              correct: false,
              timestamp: Date.now()
            };
            setResponses(prev => [...prev, response]);
            setCurrentTrial(null);
            
            setTimeout(() => {
              if (prevTrialCount + 1 < TOTAL_TRIALS) {
                setTimeout(showNextTrial, 100);
              } else {
                calculateResults();
              }
            }, ITI_DURATION);
          }
          return currentShowFeedback;
        });
      }, STIMULUS_DURATION);
      
      return prevTrialCount + 1;
    });
  }, [trials, calculateResults]);

  const startTest = () => {
    setPhase('countdown');
    setCountdown(3);
    
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setPhase('test');
          setStartTime(Date.now());
          showNextTrial();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const renderInstructions = () => (
    <div className="max-w-2xl mx-auto text-center space-y-6">
      <div className="flex justify-center">
        <div className="p-4 bg-green-100 dark:bg-green-900 rounded-full">
          <Target size={48} className="text-green-600 dark:text-green-400" />
        </div>
      </div>
      
      <h2 className="text-3xl font-bold">Flanker Task</h2>
      <p className="text-lg text-slate-600 dark:text-slate-400">
        Cognitive Conflict & Inhibition Test
      </p>
      
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-xl font-semibold">Instructions</h3>
          <div className="text-left space-y-3">
            <p>• You will see 5 arrows arranged horizontally</p>
            <p>• Focus on the <strong>center arrow</strong> only</p>
            <p>• Press <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded">←</kbd> or <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded">TAP LEFT</kbd> if center arrow points left</p>
            <p>• Press <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded">→</kbd> or <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded">TAP RIGHT</kbd> if center arrow points right</p>
            <p>• Ignore the surrounding arrows - they may point in different directions</p>
            <p>• Respond as quickly and accurately as possible</p>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Examples:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-4">
                <span className="text-2xl">→ → → → →</span>
                <span>Press →</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-2xl">← ← ← ← ←</span>
                <span>Press ←</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-2xl">→ → ← → →</span>
                <span>Press ← (ignore sides)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Button onClick={startTest} size="lg" className="px-8">
        Start Test
      </Button>
    </div>
  );

  const renderCountdown = () => (
    <div className="text-center">
      <h2 className="text-2xl font-semibold mb-8">Get Ready</h2>
      <div className="text-8xl font-bold text-green-600 dark:text-green-400">
        {countdown}
      </div>
      <p className="mt-4 text-slate-600 dark:text-slate-400">
        Focus on the center arrow only
      </p>
    </div>
  );

  const renderTest = () => (
    <div className="text-center space-y-8">
      <div className="flex justify-between items-center max-w-md mx-auto">
        <span className="text-sm text-slate-600 dark:text-slate-400">
          Trial {trialCount} / {TOTAL_TRIALS}
        </span>
        <Progress value={(trialCount / TOTAL_TRIALS) * 100} className="w-32" />
      </div>
      
      <div className="h-64 flex items-center justify-center">
        {showFeedback ? (
          <div className="space-y-4">
            <div className={`text-4xl font-bold ${lastResponse?.correct ? 'text-green-600' : 'text-red-600'}`}>
              {lastResponse?.correct ? '✓' : '✗'}
            </div>
            {lastResponse && (
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {lastResponse.rt}ms
              </div>
            )}
          </div>
        ) : currentTrial ? (
          <div className="space-y-8">
            <div className="text-6xl font-mono tracking-wider">
              {currentTrial.arrows}
            </div>
            
            {/* Touch buttons for mobile */}
            <div className="flex justify-center gap-8">
              <button
                onClick={() => handleTouch('left')}
                onTouchStart={(e) => {
                  e.preventDefault();
                  handleTouch('left');
                }}
                className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-slate-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-150 active:scale-95 active:bg-blue-100 dark:active:bg-blue-900/30 cursor-pointer select-none"
              >
                <ArrowLeft size={24} className="text-slate-600 dark:text-slate-400" />
                <span className="text-sm text-slate-600 dark:text-slate-400">Left</span>
              </button>
              
              <button
                onClick={() => handleTouch('right')}
                onTouchStart={(e) => {
                  e.preventDefault();
                  handleTouch('right');
                }}
                className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-slate-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-150 active:scale-95 active:bg-blue-100 dark:active:bg-blue-900/30 cursor-pointer select-none"
              >
                <ArrowRight size={24} className="text-slate-600 dark:text-slate-400" />
                <span className="text-sm text-slate-600 dark:text-slate-400">Right</span>
              </button>
            </div>
            
            <div className="text-xs text-slate-500 dark:text-slate-500">
              Use arrow keys or tap buttons above
            </div>
          </div>
        ) : (
          <div className="text-4xl text-slate-400">+</div>
        )}
      </div>
    </div>
  );

  const renderResults = () => {
    if (!testResult) return null;
    
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2">Flanker Results</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Your cognitive control performance
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {(testResult.accuracy * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Accuracy</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {testResult.averageReactionTime.toFixed(0)}ms
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Avg Reaction Time</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {testResult.congruentRT.toFixed(0)}ms
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Congruent RT</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {testResult.incongruentRT.toFixed(0)}ms
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Incongruent RT</div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">Interference Effect</h3>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">
                +{testResult.interferenceEffect.toFixed(0)}ms
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Cognitive conflict cost (Incongruent - Congruent RT)
              </p>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex gap-4 justify-center">
          <Button onClick={() => onComplete(testResult)} variant="default">
            Continue
          </Button>
          <Button onClick={() => setPhase('instructions')} variant="outline">
            <RotateCcw size={16} className="mr-2" />
            Retry Test
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* Background gradients matching landing page */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-green-500/20 to-purple-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-tr from-pink-500/20 to-green-500/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-gradient-to-br from-purple-500/10 to-green-500/10 blur-3xl" />
      </div>
      
      <div className="w-full max-w-4xl container mx-auto px-4">
        {phase === 'instructions' && renderInstructions()}
        {phase === 'countdown' && renderCountdown()}
        {phase === 'test' && renderTest()}
        {phase === 'results' && renderResults()}
      </div>
    </div>
  );
}
