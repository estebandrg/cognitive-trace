'use client';

import { useStore } from '@/store';
import { TestResult, TestType } from '@/lib/types/tests';

export function useTestSession() {
  const {
    currentSession,
    startSession,
    addTestResult,
    completeSession,
    clearSession,
    getCompletedTests,
    getMissingTests,
    hasCompletedTest,
    getCurrentSessionResults,
    getTestResult,
    sessions,
    addSession
  } = useStore();

  const handleTestComplete = (result: TestResult) => {
    // Add result to current session
    addTestResult(result);
    
    // If this completes all tests in a sequential session, complete the session
    const completedTests = getCompletedTests();
    const missingTests = getMissingTests();
    
    if (currentSession?.isSequential && missingTests.length === 0) {
      const completedSession = completeSession();
      if (completedSession !== undefined) {
        addSession(completedSession);
      }
    }
    
    return {
      completedTests: [...completedTests, result.testType],
      missingTests: missingTests.filter(t => t !== result.testType),
      isSessionComplete: currentSession?.isSequential && missingTests.length === 1 // Will be 0 after this test
    };
  };

  const startNewSession = (isSequential = false) => {
    startSession(isSequential);
  };

  const getSessionProgress = () => {
    const completed = getCompletedTests();
    const missing = getMissingTests();
    const total = completed.length + missing.length;
    
    return {
      completed: completed.length,
      total,
      percentage: total > 0 ? (completed.length / total) * 100 : 0,
      completedTests: completed,
      missingTests: missing
    };
  };

  return {
    // Session state
    currentSession,
    sessions,
    
    // Session actions
    startNewSession,
    handleTestComplete,
    clearSession,
    
    // Test queries
    hasCompletedTest,
    getTestResult,
    getCurrentSessionResults,
    getSessionProgress,
    
    // Computed values
    completedTests: getCompletedTests(),
    missingTests: getMissingTests(),
    sessionResults: getCurrentSessionResults()
  };
}
