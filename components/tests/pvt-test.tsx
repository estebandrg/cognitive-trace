'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PVTResult, Response } from '@/lib/types/tests';
import { Zap, RotateCcw } from 'lucide-react';

interface PVTTestProps {
  onComplete: (result?: PVTResult) => void;
}

export default function PVTTest({ onComplete }: PVTTestProps) {
  const [phase, setPhase] = useState<'instructions' | 'countdown' | 'test' | 'results'>('instructions');
  const [trialCount, setTrialCount] = useState(0);
  const [responses, setResponses] = useState<Response[]>([]);
  const [startTime, setStartTime] = useState(0);
  const [stimulusStartTime, setStimulusStartTime] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [testResult, setTestResult] = useState<PVTResult | null>(null);
  const [isWaiting, setIsWaiting] = useState(false);
  const [showStimulus, setShowStimulus] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastRT, setLastRT] = useState<number | null>(null);
  const [falseStart, setFalseStart] = useState(false);
  const [showResponseFeedback, setShowResponseFeedback] = useState(false);
  const hasRespondedRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const TOTAL_TRIALS = 8;
  const MIN_WAIT_TIME = 2000; // 2 seconds minimum
  const MAX_WAIT_TIME = 7000; // 7 seconds maximum
  const STIMULUS_TIMEOUT = 3000; // 3 seconds to respond
  const FEEDBACK_DURATION = 1500; // 1.5 seconds feedback
  const LAPSE_THRESHOLD = 500; // RT > 500ms is considered a lapse

  const calculateResults = useCallback(() => {
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    const validResponses = responses.filter(r => r.responseTime < STIMULUS_TIMEOUT && r.responseTime > 100);
    const lapses = validResponses.filter(r => r.responseTime > LAPSE_THRESHOLD).length;
    const falseStarts = responses.length - validResponses.length; // Responses that were too fast or timeouts
    
    const reactionTimes = validResponses.map(r => r.responseTime);
    const averageRT = reactionTimes.length > 0 ? 
      reactionTimes.reduce((sum, rt) => sum + rt, 0) / reactionTimes.length : 0;
    
    const minRT = reactionTimes.length > 0 ? Math.min(...reactionTimes) : 0;
    const maxRT = reactionTimes.length > 0 ? Math.max(...reactionTimes) : 0;
    
    const accuracy = validResponses.filter(r => r.correct).length / TOTAL_TRIALS;
    
    const result: PVTResult = {
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
    
    setTestResult(result);
    setPhase('results');
  }, [startTime, responses]);

  const runTrial = useCallback((currentTrial: number) => {
    if (currentTrial > TOTAL_TRIALS) {
      calculateResults();
      return;
    }
    
    setTrialCount(currentTrial);
    setIsWaiting(true);
    setShowStimulus(false);
    setFalseStart(false);
    hasRespondedRef.current = false;
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Random wait time
    const waitTime = MIN_WAIT_TIME + Math.random() * (MAX_WAIT_TIME - MIN_WAIT_TIME);
    
    setTimeout(() => {
      if (hasRespondedRef.current) return; // User already responded (false start)
      
      setShowStimulus(true);
      setStimulusStartTime(Date.now());
      
      // Auto timeout if no response
      timeoutRef.current = setTimeout(() => {
        if (hasRespondedRef.current) return; // User already responded
        
        // Record timeout only if user hasn't responded
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
          runTrial(currentTrial + 1);
        }, FEEDBACK_DURATION);
      }, STIMULUS_TIMEOUT);
    }, waitTime);
  }, [calculateResults]);

  const startNextTrial = useCallback(() => {
    setTrialCount(prev => {
      runTrial(prev + 1);
      return prev;
    });
  }, [runTrial]);

  const handleClick = useCallback(() => {
    if (phase !== 'test' || hasRespondedRef.current) return;
    
    // Mark that user has responded
    hasRespondedRef.current = true;
    
    // Clear the timeout since user responded
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    // Check current states directly
    if (showStimulus) {
      // Valid response - stimulus is showing
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
      
      // Show visual feedback
      setShowResponseFeedback(true);
      setTimeout(() => setShowResponseFeedback(false), 150);
      
      setTimeout(() => {
        setShowFeedback(false);
        setLastRT(null);
        setTrialCount(currentTrialCount => {
          runTrial(currentTrialCount + 1);
          return currentTrialCount;
        });
      }, FEEDBACK_DURATION);
    } else if (isWaiting && !showStimulus) {
      // False start - clicked while waiting
      setFalseStart(true);
      setShowFeedback(true);
      setIsWaiting(false);
      
      setTimeout(() => {
        setFalseStart(false);
        setShowFeedback(false);
        setTrialCount(currentTrialCount => {
          runTrial(currentTrialCount + 1);
          return currentTrialCount;
        });
      }, FEEDBACK_DURATION);
    } else {
      // Reset the flag if it was an invalid click
      hasRespondedRef.current = false;
    }
  }, [phase, stimulusStartTime, runTrial, showStimulus, isWaiting]);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (event.code === 'Space') {
      event.preventDefault();
      handleClick();
    }
  }, [handleClick]);

  const handleTouch = useCallback(() => {
    handleClick();
  }, [handleClick]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const startTest = () => {
    setPhase('countdown');
    setCountdown(3);
    
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setPhase('test');
          setStartTime(Date.now());
          runTrial(1);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };


  const renderInstructions = () => (
    <div className="max-w-2xl mx-auto text-center space-y-6">
      <div className="flex justify-center">
        <div className="p-4 bg-orange-100 dark:bg-orange-900 rounded-full">
          <Zap size={48} className="text-orange-600 dark:text-orange-400" />
        </div>
      </div>
      
      <h2 className="text-3xl font-bold">PVT Task</h2>
      <p className="text-lg text-slate-600 dark:text-slate-400">
        Psychomotor Vigilance Test
      </p>
      
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-xl font-semibold">Instructions</h3>
          <div className="text-left space-y-3">
            <p>• The screen will show a waiting state</p>
            <p>• After a random delay (2-7 seconds), a stimulus will appear</p>
            <p>• <strong>Click the button, tap the screen, or press SPACEBAR as quickly as possible</strong> when you see the stimulus</p>
            <p>• <strong>DO NOT respond before the stimulus appears</strong> (false start)</p>
            <p>• You will complete 8 trials</p>
            <p>• Focus on being as fast and accurate as possible</p>
          </div>
          
          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
            <h4 className="font-medium mb-2 text-orange-800 dark:text-orange-200">Important:</h4>
            <p className="text-sm text-orange-700 dark:text-orange-300">
              This test measures your alertness and reaction time. Stay focused and respond only when you see the stimulus.
            </p>
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
      <div className="text-8xl font-bold text-orange-600 dark:text-orange-400">
        {countdown}
      </div>
      <p className="mt-4 text-slate-600 dark:text-slate-400">
        Respond only when you see the stimulus
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
      
      <div className="h-96 flex items-center justify-center">
        {showFeedback ? (
          <div className="space-y-4">
            {falseStart ? (
              <div className="text-center">
                <div className="text-4xl font-bold text-red-600 mb-2">
                  False Start!
                </div>
                <p className="text-slate-600 dark:text-slate-400">
                  Wait for the stimulus to appear
                </p>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {lastRT}ms
                </div>
                <p className="text-slate-600 dark:text-slate-400">
                  {lastRT && lastRT < 300 ? 'Excellent!' : 
                   lastRT && lastRT < 400 ? 'Good!' : 
                   lastRT && lastRT < 500 ? 'Fair' : 'Slow'}
                </p>
              </div>
            )}
          </div>
        ) : showStimulus ? (
          <div className="relative">
            {/* Visual feedback overlay */}
            {showResponseFeedback && (
              <div className="absolute inset-0 bg-orange-500/30 rounded-full animate-ping pointer-events-none z-10" />
            )}
            <Button
              onClick={handleTouch}
              onTouchStart={(e) => {
                e.preventDefault();
                handleTouch();
              }}
              size="lg"
              className={`w-64 h-64 text-4xl font-bold bg-red-500 hover:bg-red-600 text-white rounded-full animate-pulse transition-all duration-150 ${
                showResponseFeedback ? 'scale-110 bg-orange-500' : ''
              }`}
            >
              CLICK!
            </Button>
          </div>
        ) : isWaiting ? (
          <div 
            className="text-center cursor-pointer select-none"
            onClick={handleTouch}
            onTouchStart={(e) => {
              e.preventDefault();
              handleTouch();
            }}
          >
            <div className="w-64 h-64 border-4 border-slate-300 dark:border-slate-600 rounded-full flex items-center justify-center hover:border-slate-400 dark:hover:border-slate-500 transition-colors">
              <div className="text-2xl text-slate-500 dark:text-slate-400">
                Wait...
              </div>
            </div>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              Get ready to respond
            </p>
          </div>
        ) : (
          <div className="text-4xl text-slate-400">Preparing...</div>
        )}
      </div>
      
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Click the button, tap the screen, or press SPACEBAR when it appears
      </p>
    </div>
  );

  const renderResults = () => {
    if (!testResult) return null;
    
    const performanceLevel = testResult.averageReactionTime < 300 ? 'Excellent' :
                           testResult.averageReactionTime < 400 ? 'Good' :
                           testResult.averageReactionTime < 500 ? 'Fair' : 'Needs Improvement';
    
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2">PVT Results</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Your vigilance and reaction time performance
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {testResult.averageReactionTime.toFixed(0)}ms
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Average RT</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {testResult.minRT.toFixed(0)}ms
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Fastest RT</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {testResult.lapses}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Lapses (&gt;500ms)</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {testResult.falseStarts}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">False Starts</div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="font-semibold mb-2">Performance Level</h3>
            <div className={`text-2xl font-bold mb-2 ${
              performanceLevel === 'Excellent' ? 'text-green-600' :
              performanceLevel === 'Good' ? 'text-blue-600' :
              performanceLevel === 'Fair' ? 'text-orange-600' : 'text-red-600'
            }`}>
              {performanceLevel}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
              <p>• <strong>Range:</strong> {testResult.minRT.toFixed(0)}ms - {testResult.maxRT.toFixed(0)}ms</p>
              <p>• <strong>Consistency:</strong> {testResult.lapses === 0 ? 'Very consistent' : 
                testResult.lapses === 1 ? 'Mostly consistent' : 'Variable performance'}</p>
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
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-orange-500/20 to-purple-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-tr from-pink-500/20 to-orange-500/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-gradient-to-br from-purple-500/10 to-orange-500/10 blur-3xl" />
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
