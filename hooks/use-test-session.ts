'use client';

import { useStore } from '@/store';
import { TestResult, TestType } from '@/lib/types/tests';
import { saveTestResultWithSync } from '@/lib/helpers/test-session-helpers';
import { completeSession as completeSessionAction } from '@/lib/actions/session-actions';
import { useRouter } from 'next/navigation';

export function useTestSession() {
  const router = useRouter();
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

  const handleTestComplete = async (result: TestResult) => {
    // Save to DB if session exists
    if (currentSession?.dbSessionId) {
      try {
        await saveTestResultWithSync(
          currentSession.dbSessionId,
          result,
          addTestResult
        );
        
        // Revalidate dashboard cache
        router.refresh();
      } catch (error) {
        console.error('Error saving test result:', error);
        // Result is already saved locally via saveTestResultWithSync
      }
    } else {
      // No DB session, save only locally
      addTestResult(result);
    }
    
    // If this completes all tests in a sequential session, complete the session
    const completedTests = getCompletedTests();
    const missingTests = getMissingTests();
    
    if (currentSession?.isSequential && missingTests.length === 0) {
      const completedSession = completeSession();
      if (completedSession !== undefined) {
        addSession(completedSession);
        
        // Complete session in DB
        if (currentSession?.dbSessionId) {
          try {
            await completeSessionAction(currentSession.dbSessionId);
          } catch (error) {
            console.error('Error completing session in DB:', error);
          }
        }
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
