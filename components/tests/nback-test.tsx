'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { NBackResult, Response } from '@/lib/types/tests';
import { Brain, RotateCcw } from 'lucide-react';

interface NBackTestProps {
  onComplete: (result?: NBackResult) => void;
}

export default function NBackTest({ onComplete }: NBackTestProps) {
  const [phase, setPhase] = useState<'instructions' | 'countdown' | 'test' | 'results'>('instructions');
  const [currentLetter, setCurrentLetter] = useState<string | null>(null);
  const [trialCount, setTrialCount] = useState(0);
  const [responses, setResponses] = useState<Response[]>([]);
  const [startTime, setStartTime] = useState(0);
  const [stimulusStartTime, setStimulusStartTime] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [testResult, setTestResult] = useState<NBackResult | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastResponse, setLastResponse] = useState<{ correct: boolean; isMatch: boolean } | null>(null);

  const TOTAL_TRIALS = 30;
  const N_BACK = 2; // 2-back task
  const STIMULUS_DURATION = 2000; // 2 seconds per stimulus
  const FEEDBACK_DURATION = 500; // 500ms feedback
  const ITI_DURATION = 500; // Inter-trial interval
  const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

  const generateSequence = useCallback(() => {
    const sequence: string[] = [];
    const targetFrequency = 0.25; // 25% targets
    
    // First N_BACK trials cannot be targets
    for (let i = 0; i < N_BACK; i++) {
      sequence.push(LETTERS[Math.floor(Math.random() * LETTERS.length)]);
    }
    
    // Generate remaining trials
    for (let i = N_BACK; i < TOTAL_TRIALS; i++) {
      if (Math.random() < targetFrequency) {
        // Make this a target (same as N positions back)
        sequence.push(sequence[i - N_BACK]);
      } else {
        // Make this a non-target (different from N positions back)
        let letter;
        do {
          letter = LETTERS[Math.floor(Math.random() * LETTERS.length)];
        } while (letter === sequence[i - N_BACK]);
        sequence.push(letter);
      }
    }
    
    return sequence;
  }, []);

  const [sequence] = useState(() => generateSequence());
  const [showResponseFeedback, setShowResponseFeedback] = useState(false);

  const handleResponse = useCallback(() => {
    if (phase !== 'test' || currentLetter === null || showFeedback) return;
    
    const responseTime = Date.now() - stimulusStartTime;
    
    // Check if this is actually a match
    const isMatch = trialCount >= N_BACK && sequence[trialCount - 1] === sequence[trialCount - 1 - N_BACK];
    const correct = isMatch; // Response given and it's a match
    
    const response: Response = {
      stimulus: currentLetter,
      responseTime,
      correct,
      timestamp: Date.now()
    };
    
    setResponses(prev => [...prev, response]);
    setLastResponse({ correct, isMatch });
    setShowFeedback(true);
    
    // Show visual feedback
    setShowResponseFeedback(true);
    setTimeout(() => setShowResponseFeedback(false), 150);
    
    // Continue to next trial
    setTimeout(() => {
      setShowFeedback(false);
      setCurrentLetter(null);
      setLastResponse(null);
      
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
  }, [phase, currentLetter, stimulusStartTime, showFeedback, trialCount, sequence]);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (phase !== 'test' || currentLetter === null || showFeedback) return;
    
    if (event.code === 'Space') {
      event.preventDefault();
      handleResponse();
    }
  }, [phase, currentLetter, showFeedback, handleResponse]);

  const handleTouch = useCallback(() => {
    if (phase !== 'test' || currentLetter === null || showFeedback) return;
    handleResponse();
  }, [phase, currentLetter, showFeedback, handleResponse]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const calculateResults = useCallback(() => {
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Calculate signal detection theory metrics
    let hits = 0;
    let misses = 0;
    let falsePositives = 0;
    let correctRejections = 0;
    
    for (let i = 0; i < TOTAL_TRIALS; i++) {
      const isMatch = i >= N_BACK && sequence[i] === sequence[i - N_BACK];
      const response = responses.find(r => String(r.stimulus) === sequence[i]);
      const responded = response !== undefined;
      
      if (isMatch) {
        if (responded && response.correct) {
          hits++;
        } else {
          misses++;
        }
      } else {
        if (responded) {
          falsePositives++;
        } else {
          correctRejections++;
        }
      }
    }
    
    const validResponses = responses.filter(r => r.responseTime < STIMULUS_DURATION && r.responseTime > 100);
    const averageRT = validResponses.length > 0 ? 
      validResponses.reduce((sum, r) => sum + r.responseTime, 0) / validResponses.length : 0;
    
    const accuracy = (hits + correctRejections) / TOTAL_TRIALS;
    
    const result: NBackResult = {
      testType: 'nback',
      startTime,
      endTime,
      duration,
      accuracy,
      averageReactionTime: averageRT,
      responses,
      hits,
      falsePositives,
      misses,
      correctRejections
    };
    
    setTestResult(result);
    setPhase('results');
  }, [startTime, responses, sequence]);

  const showNextTrial = useCallback(() => {
    setTrialCount(prevTrialCount => {
      if (prevTrialCount >= TOTAL_TRIALS) {
        calculateResults();
        return prevTrialCount;
      }
      
      const letter = sequence[prevTrialCount];
      setCurrentLetter(letter);
      setStimulusStartTime(Date.now());
      
      // Auto-advance if no response
      setTimeout(() => {
        setShowFeedback(currentShowFeedback => {
          if (!currentShowFeedback) {
            // Check if this was a miss (should have responded but didn't)
            const isMatch = prevTrialCount >= N_BACK && sequence[prevTrialCount] === sequence[prevTrialCount - N_BACK];
            
            if (isMatch) {
              // This was a miss
              const response: Response = {
                stimulus: letter,
                responseTime: STIMULUS_DURATION,
                correct: false,
                timestamp: Date.now()
              };
              setResponses(prev => [...prev, response]);
            }
            // If not a match, no response is correct (correct rejection)
            
            setCurrentLetter(null);
            
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
  }, [sequence, calculateResults]);

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
        <div className="p-4 bg-purple-100 dark:bg-purple-900 rounded-full">
          <Brain size={48} className="text-purple-600 dark:text-purple-400" />
        </div>
      </div>
      
      <h2 className="text-3xl font-bold">N-Back Task</h2>
      <p className="text-lg text-slate-600 dark:text-slate-400">
        Working Memory Assessment (2-Back)
      </p>
      
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-xl font-semibold">Instructions</h3>
          <div className="text-left space-y-3">
            <p>• Letters will appear on screen one at a time</p>
            <p>• Press <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded">SPACEBAR</kbd> or <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded">TAP SCREEN</kbd> when the current letter matches the letter from <strong>2 positions back</strong></p>
            <p>• Do NOT press anything if the letters don't match</p>
            <p>• Focus and try to remember the sequence</p>
            <p>• The test will show 30 letters total</p>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Example Sequence:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-mono">A → B → A</span>
                <span className="text-green-600">Press SPACE (A matches 2 back)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono">A → B → C</span>
                <span className="text-slate-600">Don't press (C ≠ A)</span>
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
      <div className="text-8xl font-bold text-purple-600 dark:text-purple-400">
        {countdown}
      </div>
      <p className="mt-4 text-slate-600 dark:text-slate-400">
        Remember: Press SPACE when letter matches 2 positions back
      </p>
    </div>
  );

  const renderTest = () => (
    <div className="text-center space-y-8">
      <div className="flex justify-between items-center max-w-md mx-auto">
        <span className="text-sm text-slate-600 dark:text-slate-400">
          Letter {trialCount} / {TOTAL_TRIALS}
        </span>
        <Progress value={(trialCount / TOTAL_TRIALS) * 100} className="w-32" />
      </div>
      
      {/* Touch area with visual feedback */}
      <div 
        className="h-64 flex items-center justify-center relative cursor-pointer select-none"
        onClick={handleTouch}
        onTouchStart={(e) => {
          e.preventDefault();
          handleTouch();
        }}
      >
        {/* Visual feedback overlay */}
        {showResponseFeedback && (
          <div className="absolute inset-0 bg-purple-500/20 rounded-lg animate-ping pointer-events-none" />
        )}
        
        {showFeedback ? (
          <div className="space-y-4">
            <div className={`text-4xl font-bold ${lastResponse?.correct ? 'text-green-600' : 'text-red-600'}`}>
              {lastResponse?.correct ? '✓' : '✗'}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              {lastResponse?.isMatch ? 'Match!' : 'No match'}
            </div>
          </div>
        ) : currentLetter ? (
          <div className={`text-9xl font-bold text-slate-900 dark:text-slate-100 font-mono transition-all duration-150 ${
            showResponseFeedback ? 'scale-110 text-purple-600 dark:text-purple-400' : ''
          }`}>
            {currentLetter}
          </div>
        ) : (
          <div className="text-4xl text-slate-400">+</div>
        )}
      </div>
      
      <div className="text-sm text-slate-600 dark:text-slate-400">
        <p>Press SPACEBAR or TAP SCREEN when letter matches 2 positions back</p>
        {trialCount > N_BACK && (
          <p className="mt-2">
            Current: <span className="font-mono font-bold">{currentLetter}</span> | 
            2-back: <span className="font-mono font-bold">{sequence[trialCount - 1 - N_BACK]}</span>
          </p>
        )}
      </div>
    </div>
  );

  const renderResults = () => {
    if (!testResult) return null;
    
    const sensitivity = testResult.hits / (testResult.hits + testResult.misses) || 0;
    const specificity = testResult.correctRejections / (testResult.correctRejections + testResult.falsePositives) || 0;
    
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2">N-Back Results</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Your working memory performance
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {(testResult.accuracy * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Overall Accuracy</div>
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
                {testResult.hits}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Hits</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {testResult.falsePositives}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">False Positives</div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {(sensitivity * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Sensitivity</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {(specificity * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Specificity</div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">Performance Breakdown</h3>
            <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
              <p>• <strong>Hits:</strong> Correctly identified matches ({testResult.hits})</p>
              <p>• <strong>Misses:</strong> Missed matches ({testResult.misses})</p>
              <p>• <strong>False Positives:</strong> Incorrect match responses ({testResult.falsePositives})</p>
              <p>• <strong>Correct Rejections:</strong> Correctly ignored non-matches ({testResult.correctRejections})</p>
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
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-tr from-pink-500/20 to-purple-500/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-3xl" />
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
