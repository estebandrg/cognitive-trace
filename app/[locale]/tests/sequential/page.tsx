'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TestResult } from '@/lib/types/tests';
import { useTestSession } from '@/hooks/use-test-session';
import SequentialTestRunner from '@/components/tests/orchestration/sequential-test-runner';
import SequentialResults from '@/components/tests/orchestration/sequential-results';

type PageState = 'sequential' | 'results';

export default function SequentialTestsPage() {
  const router = useRouter();
  const [pageState, setPageState] = useState<PageState>('sequential');
  const [sequentialResults, setSequentialResults] = useState<TestResult[]>([]);
  
  const { startNewSession } = useTestSession();

  // Initialize sequential session on mount
  React.useEffect(() => {
    startNewSession(true);
  }, []);

  const handleSequentialComplete = (results: TestResult[]) => {
    setSequentialResults(results);
    setPageState('results');
  };

  const handleBackToSelection = () => {
    router.push('/tests');
  };

  const handleRetrySequential = () => {
    setSequentialResults([]);
    startNewSession(true);
    setPageState('sequential');
  };

  const handleGoHome = () => {
    router.push('/tests');
  };

  switch (pageState) {
    case 'sequential':
      return (
        <SequentialTestRunner 
          onComplete={handleSequentialComplete}
          onBack={handleBackToSelection}
        />
      );
    
    case 'results':
      return (
        <SequentialResults 
          results={sequentialResults}
          onRetry={handleRetrySequential}
          onHome={handleGoHome}
        />
      );
    
    default:
      return (
        <SequentialTestRunner 
          onComplete={handleSequentialComplete}
          onBack={handleBackToSelection}
        />
      );
  }
}
