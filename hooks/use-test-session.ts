'use client';

import { useCallback } from 'react';
import { useStore } from '@/store';
import { TestResult, TestType } from '@/lib/types/tests';
import { saveTestResultWithSync, startTestSession } from '@/lib/helpers/test-session-helpers';
import { completeSession as completeSessionAction } from '@/lib/actions/session-actions';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

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
        const saveResult = await saveTestResultWithSync(
          currentSession.dbSessionId,
          result,
          addTestResult
        );
        
        if (saveResult.success && !saveResult.error) {
          toast.success('Test results saved to database', {
            description: `${result.testType.toUpperCase()} test completed successfully`,
          });
        } else if (saveResult.error) {
          toast.warning('Saved locally only', {
            description: saveResult.error,
          });
        }
        
        // Revalidate dashboard cache
        router.refresh();
      } catch (error) {
        console.error('Error saving test result:', error);
        toast.error('Failed to save to database', {
          description: 'Results saved locally. You can sync later.',
        });
        // Result is already saved locally via saveTestResultWithSync
      }
    } else {
      // No DB session, save only locally
      addTestResult(result);
      toast.info('Test saved locally', {
        description: 'Sign in to sync your results to the cloud',
      });
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
            toast.success('🎉 Sequential assessment completed!', {
              description: 'All 4 tests finished. Great job!',
              duration: 5000,
            });
          } catch (error) {
            console.error('Error completing session in DB:', error);
            toast.warning('Session completed locally', {
              description: 'Could not sync completion status to database',
            });
          }
        } else {
          toast.success('🎉 Sequential assessment completed!', {
            description: 'All tests finished locally',
          });
        }
      }
    }
    
    return {
      completedTests: [...completedTests, result.testType],
      missingTests: missingTests.filter(t => t !== result.testType),
      isSessionComplete: currentSession?.isSequential && missingTests.length === 1 // Will be 0 after this test
    };
  };

  const startNewSession = useCallback(async (isSequential = false) => {
    // User info is checked inside startTestSession
    // No need to check here to avoid duplicate auth calls
    const result = await startTestSession(isSequential, startSession);
    
    if (!result.success && result.error && !result.error.includes('Local mode')) {
      console.error('Failed to create DB session:', result.error);
      toast.error('Could not create database session', {
        description: 'Tests will be saved locally only',
      });
    } else if (result.sessionId) {
      console.log('DB session created:', result.sessionId);
      toast.success('Session started', {
        description: isSequential 
          ? 'Ready to begin sequential assessment' 
          : 'Ready to begin individual tests',
      });
    } else if (result.error?.includes('Local mode')) {
      // User not authenticated - silent, no need to spam with toasts
      console.log('Local mode:', result.error);
    }
  }, [startSession]);

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
