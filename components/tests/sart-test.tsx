'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { SARTResult, Response } from '@/lib/types/tests';
import { Eye, RotateCcw } from 'lucide-react';

interface SARTTestProps {
  onComplete: (result?: SARTResult) => void;
}

export default function SARTTest({ onComplete }: SARTTestProps) {
  const [phase, setPhase] = useState<'instructions' | 'countdown' | 'test' | 'results'>('instructions');
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [trialCount, setTrialCount] = useState(0);
  const [responses, setResponses] = useState<Response[]>([]);
  const [startTime, setStartTime] = useState(0);
  const [stimulusStartTime, setStimulusStartTime] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [testResult, setTestResult] = useState<SARTResult | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const TOTAL_TRIALS = 45;
  const NO_GO_NUMBER = 3;
  const STIMULUS_DURATION = 1000; // 1 second per stimulus

  const generateSequence = useCallback(() => {
    const sequence = [];
    const noGoFrequency = 0.2; // 20% no-go trials
    
    for (let i = 0; i < TOTAL_TRIALS; i++) {
      if (Math.random() < noGoFrequency) {
        sequence.push(NO_GO_NUMBER);
      } else {
        // Random number 0-9 except NO_GO_NUMBER
        const numbers = [0, 1, 2, 4, 5, 6, 7, 8, 9];
        sequence.push(numbers[Math.floor(Math.random() * numbers.length)]);
      }
    }
    return sequence;
  }, []);

  const [sequence] = useState(() => generateSequence());

  const handleResponse = useCallback(() => {
    if (phase !== 'test' || currentNumber === null) return;
    
    const responseTime = Date.now() - stimulusStartTime;
    const correct = currentNumber !== NO_GO_NUMBER;
    
    const response: Response = {
      stimulus: currentNumber,
      responseTime,
      correct,
      timestamp: Date.now()
    };
    
    setResponses(prev => [...prev, response]);
    
    // Show visual feedback
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 150);
  }, [phase, currentNumber, stimulusStartTime]);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (phase !== 'test' || currentNumber === null) return;
    
    if (event.code === 'Space') {
      event.preventDefault();
      handleResponse();
    }
  }, [phase, currentNumber, handleResponse]);

  const handleTouch = useCallback(() => {
    if (phase !== 'test' || currentNumber === null) return;
    handleResponse();
  }, [phase, currentNumber, handleResponse]);

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
          runTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const runTest = () => {
    let currentTrial = 0;
    
    const showNextStimulus = () => {
      if (currentTrial >= TOTAL_TRIALS) {
        calculateResults();
        return;
      }
      
      const number = sequence[currentTrial];
      setCurrentNumber(number);
      setStimulusStartTime(Date.now());
      setTrialCount(currentTrial + 1);
      
      setTimeout(() => {
        // Check if no response was given for a go trial
        const responseGiven = responses.some(r => 
          r.timestamp > stimulusStartTime && r.timestamp < Date.now()
        );
        
        if (!responseGiven && number !== NO_GO_NUMBER) {
          // Record omission
          const response: Response = {
            stimulus: number,
            responseTime: STIMULUS_DURATION,
            correct: false,
            timestamp: Date.now()
          };
          setResponses(prev => [...prev, response]);
        }
        
        setCurrentNumber(null);
        currentTrial++;
        
        setTimeout(showNextStimulus, 200); // Brief pause between stimuli
      }, STIMULUS_DURATION);
    };
    
    showNextStimulus();
  };

  const calculateResults = () => {
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    const goTrials = responses.filter(r => r.stimulus !== NO_GO_NUMBER);
    const noGoTrials = responses.filter(r => r.stimulus === NO_GO_NUMBER);
    
    const hits = goTrials.filter(r => r.correct).length;
    const omissions = goTrials.filter(r => !r.correct).length;
    const commissions = noGoTrials.length; // Any response to no-go is a commission
    
    const validRTs = goTrials.filter(r => r.correct && r.responseTime > 100).map(r => r.responseTime);
    const averageRT = validRTs.length > 0 ? validRTs.reduce((a, b) => a + b, 0) / validRTs.length : 0;
    
    // Calculate RT variability (standard deviation)
    const rtVariability = validRTs.length > 1 ? 
      Math.sqrt(validRTs.reduce((sum, rt) => sum + Math.pow(rt - averageRT, 2), 0) / (validRTs.length - 1)) : 0;
    
    const accuracy = hits / (hits + omissions);
    
    const result: SARTResult = {
      testType: 'sart',
      startTime,
      endTime,
      duration,
      accuracy,
      averageReactionTime: averageRT,
      responses,
      omissions,
      commissions,
      reactionTimeVariability: rtVariability
    };
    
    setTestResult(result);
    setPhase('results');
  };

  const renderInstructions = () => (
    <div className="max-w-2xl mx-auto text-center space-y-6">
      <div className="flex justify-center">
        <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-full">
          <Eye size={48} className="text-blue-600 dark:text-blue-400" />
        </div>
      </div>
      
      <h2 className="text-3xl font-bold">SART Task</h2>
      <p className="text-lg text-slate-600 dark:text-slate-400">
        Sustained Attention to Response Task
      </p>
      
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-xl font-semibold">Instructions</h3>
          <div className="text-left space-y-3">
            <p>• Numbers from 0-9 will appear on screen, one at a time</p>
            <p>• Press <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded">SPACEBAR</kbd> or <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded">TAP ANYWHERE</kbd> for all numbers</p>
            <p>• <strong>DO NOT respond when you see the number 3</strong></p>
            <p>• Respond as quickly and accurately as possible</p>
            <p>• The test will take about 45 seconds</p>
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
      <div className="text-8xl font-bold text-blue-600 dark:text-blue-400">
        {countdown}
      </div>
      <p className="mt-4 text-slate-600 dark:text-slate-400">
        Remember: Press SPACE or TAP for all numbers except 3
      </p>
    </div>
  );

  const renderTest = () => (
    <div 
      className="text-center space-y-8 relative min-h-[80vh] flex flex-col justify-center cursor-pointer select-none"
      onClick={handleTouch}
      onTouchStart={(e) => {
        e.preventDefault();
        handleTouch();
      }}
    >
      {/* Visual feedback overlay for entire screen */}
      {showFeedback && (
        <div className="absolute inset-0 bg-blue-500/10 rounded-lg animate-ping pointer-events-none" />
      )}
      
      <div className="flex justify-between items-center max-w-md mx-auto">
        <span className="text-sm text-slate-600 dark:text-slate-400">
          Trial {trialCount} / {TOTAL_TRIALS}
        </span>
        <Progress value={(trialCount / TOTAL_TRIALS) * 100} className="w-32" />
      </div>
      
      {/* Number display area */}
      <div className="h-64 flex items-center justify-center relative">
        {currentNumber !== null ? (
          <div className={`text-9xl font-bold text-slate-900 dark:text-slate-100 transition-all duration-150 ${
            showFeedback ? 'scale-110 text-blue-600 dark:text-blue-400' : 'animate-pulse'
          }`}>
            {currentNumber}
          </div>
        ) : (
          <div className="text-4xl text-slate-400">+</div>
        )}
      </div>
      
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Press SPACEBAR or TAP ANYWHERE for all numbers except 3
      </p>
    </div>
  );

  const renderResults = () => {
    if (!testResult) return null;
    
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2">SART Results</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Your sustained attention performance
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
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {testResult.omissions}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Omissions</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {testResult.commissions}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Commissions</div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">Performance Summary</h3>
            <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
              <p>• <strong>Omissions:</strong> Missed responses to target numbers</p>
              <p>• <strong>Commissions:</strong> Incorrect responses to number 3</p>
              <p>• <strong>RT Variability:</strong> {testResult.reactionTimeVariability.toFixed(0)}ms</p>
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
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-tr from-pink-500/20 to-purple-500/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-gradient-to-br from-purple-500/10 to-blue-500/10 blur-3xl" />
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
