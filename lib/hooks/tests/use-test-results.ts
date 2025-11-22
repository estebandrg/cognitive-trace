import { useState, useCallback } from 'react';
import { Response, TestResult } from '@/lib/types/tests';

export function useTestResults<T extends TestResult>() {
  const [responses, setResponses] = useState<Response[]>([]);
  const [result, setResult] = useState<T | null>(null);

  const addResponse = useCallback((response: Response) => {
    setResponses(prev => [...prev, response]);
  }, []);

  const calculateAndSetResult = useCallback((
    calculationFn: (responses: Response[]) => T
  ) => {
    const calculated = calculationFn(responses);
    setResult(calculated);
    return calculated;
  }, [responses]);

  const reset = useCallback(() => {
    setResponses([]);
    setResult(null);
  }, []);

  return {
    responses,
    result,
    addResponse,
    calculateAndSetResult,
    setResult,
    reset,
  };
}
