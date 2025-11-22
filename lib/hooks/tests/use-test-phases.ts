import { useState, useCallback } from 'react';
import { TestPhase } from '@/lib/types/test-system';
import { DEFAULT_COUNTDOWN } from '@/components/tests/shared/constants';

export function useTestPhases(initialPhase: TestPhase = 'instructions') {
  const [phase, setPhase] = useState<TestPhase>(initialPhase);
  const [countdown, setCountdown] = useState(DEFAULT_COUNTDOWN);

  const startCountdown = useCallback(() => {
    setPhase('countdown');
    setCountdown(DEFAULT_COUNTDOWN);
  }, []);

  const startTest = useCallback(() => {
    setPhase('test');
  }, []);

  const finishTest = useCallback(() => {
    setPhase('results');
  }, []);

  const reset = useCallback(() => {
    setPhase('instructions');
    setCountdown(DEFAULT_COUNTDOWN);
  }, []);

  const decrementCountdown = useCallback(() => {
    setCountdown(prev => prev - 1);
  }, []);

  return {
    phase,
    countdown,
    setCountdown,
    startCountdown,
    startTest,
    finishTest,
    reset,
    decrementCountdown,
  };
}
