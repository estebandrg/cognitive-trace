import { useState, useCallback, useRef } from 'react';

export function useTestTimer() {
  const [startTime, setStartTime] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const trialStartTimeRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const start = useCallback(() => {
    const now = Date.now();
    setStartTime(now);
    setElapsed(0);

    // Optional: Track elapsed time
    intervalRef.current = setInterval(() => {
      setElapsed(Date.now() - now);
    }, 100);
  }, []);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startTrial = useCallback(() => {
    trialStartTimeRef.current = Date.now();
  }, []);

  const getReactionTime = useCallback(() => {
    return Date.now() - trialStartTimeRef.current;
  }, []);

  const getDuration = useCallback(() => {
    return Date.now() - startTime;
  }, [startTime]);

  const reset = useCallback(() => {
    stop();
    setStartTime(0);
    setElapsed(0);
    trialStartTimeRef.current = 0;
  }, [stop]);

  return {
    startTime,
    elapsed,
    start,
    stop,
    startTrial,
    getReactionTime,
    getDuration,
    reset,
  };
}
