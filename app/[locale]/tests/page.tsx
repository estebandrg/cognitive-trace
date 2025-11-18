'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { TestResult } from '@/lib/types/tests';
import TestModeSelection from '@/components/tests/test-mode-selection';
import TestDashboard from '@/components/tests/test-dashboard';
import SequentialTestRunner from '@/components/tests/sequential-test-runner';
import SequentialResults from '@/components/tests/sequential-results';

type PageState = 'selection' | 'dashboard' | 'sequential' | 'results';

export default function TestsPage() {
  const [pageState, setPageState] = useState<PageState>('selection');
  const [sequentialResults, setSequentialResults] = useState<TestResult[]>([]);

  const handleModeSelect = (mode: 'sequential' | 'dashboard') => {
    if (mode === 'sequential') {
      setPageState('sequential');
    } else {
      setPageState('dashboard');
    }
  };

  const handleSequentialComplete = (results: TestResult[]) => {
    setSequentialResults(results);
    setPageState('results');
  };

  const handleBackToSelection = () => {
    setPageState('selection');
  };

  const handleRetrySequential = () => {
    setSequentialResults([]);
    setPageState('sequential');
  };

  const handleGoHome = () => {
    setPageState('selection');
  };

  switch (pageState) {
    case 'selection':
      return <TestModeSelection onModeSelect={handleModeSelect} />;
    
    case 'dashboard':
      return <TestDashboard onBack={handleBackToSelection} />;
    
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
      return <TestModeSelection onModeSelect={handleModeSelect} />;
  }
}
