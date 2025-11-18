'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TestResult, TestType } from '@/lib/types/tests';
import { useTestSession } from '@/hooks/use-test-session';
import TestDashboard from '@/components/tests/test-dashboard';
import ResultsDashboard from '@/components/tests/results-dashboard';

type PageState = 'dashboard' | 'individual-result';

export default function IndividualTestsPage() {
  const router = useRouter();
  const [pageState, setPageState] = useState<PageState>('dashboard');
  const [lastCompletedResult, setLastCompletedResult] = useState<TestResult | null>(null);
  
  const { 
    handleTestComplete, 
    completedTests, 
    missingTests,
    startNewSession
  } = useTestSession();

  // Initialize individual session on mount
  React.useEffect(() => {
    startNewSession(false);
  }, []);

  const handleIndividualTestComplete = (result: TestResult) => {
    handleTestComplete(result);
    setLastCompletedResult(result);
    setPageState('individual-result');
  };

  const handleBackToSelection = () => {
    router.push('/tests');
  };

  const handleStartTest = (testType: TestType) => {
    // The TestDashboard component handles starting tests internally
    // This function is for the ResultsDashboard when user wants to start another test
    setPageState('dashboard');
  };

  const handleViewHistory = () => {
    // TODO: Implement history view
    console.log('View history clicked');
  };

  const handleReturnHome = () => {
    setPageState('dashboard');
  };

  switch (pageState) {
    case 'dashboard':
      return (
        <TestDashboard 
          onBack={handleBackToSelection}
          onTestComplete={handleIndividualTestComplete}
        />
      );
    
    case 'individual-result':
      return lastCompletedResult ? (
        <ResultsDashboard
          completedResult={lastCompletedResult}
          completedTests={completedTests}
          missingTests={missingTests}
          onStartTest={handleStartTest}
          onViewHistory={handleViewHistory}
          onReturnHome={handleReturnHome}
        />
      ) : (
        <TestDashboard 
          onBack={handleBackToSelection}
          onTestComplete={handleIndividualTestComplete}
        />
      );
    
    default:
      return (
        <TestDashboard 
          onBack={handleBackToSelection}
          onTestComplete={handleIndividualTestComplete}
        />
      );
  }
}
