import type { StateCreator } from 'zustand';
import type { TestResult, TestType } from '@/lib/types/tests';
import { ALL_TEST_TYPES } from '../utils/test-metadata';

export interface TestSession {
  id: string;
  dbSessionId?: string; // ID de la sesión en Supabase
  startTime: number;
  endTime?: number;
  completedTests: TestType[];
  results: TestResult[];
  isSequential: boolean;
}

export interface TestSessionSlice {
  currentSession: TestSession | null;
  
  startSession: (isSequential?: boolean, dbSessionId?: string) => void;
  addTestResult: (result: TestResult) => void;
  completeSession: () => TestSession | undefined;
  clearSession: () => void;
  setDbSessionId: (dbSessionId: string) => void;
  
  getCompletedTests: () => TestType[];
  getMissingTests: () => TestType[];
  hasCompletedTest: (testType: TestType) => boolean;
  getCurrentSessionResults: () => TestResult[];
  getTestResult: (testType: TestType) => TestResult | undefined;
}

export const createTestSessionSlice: StateCreator<
  TestSessionSlice,
  [],
  [],
  TestSessionSlice
> = (set, get) => ({
  currentSession: null,

  startSession: (isSequential = false, dbSessionId?: string) => {
    const newSession: TestSession = {
      id: `session_${Date.now()}`,
      dbSessionId,
      startTime: Date.now(),
      completedTests: [],
      results: [],
      isSequential,
    };
    
    set({ currentSession: newSession });
  },

  setDbSessionId: (dbSessionId: string) => {
    const { currentSession } = get();
    if (!currentSession) return;

    set({
      currentSession: {
        ...currentSession,
        dbSessionId,
      },
    });
  },

  addTestResult: (result: TestResult) => {
    const { currentSession } = get();
    if (!currentSession) return;

    const updatedSession: TestSession = {
      ...currentSession,
      completedTests: [...currentSession.completedTests, result.testType],
      results: [...currentSession.results, result],
    };

    set({ currentSession: updatedSession });
  },

  completeSession: () => {
    const { currentSession } = get();
    if (!currentSession) return undefined;

    const completedSession: TestSession = {
      ...currentSession,
      endTime: Date.now(),
    };

    // This will be handled by the session history slice
    set({ currentSession: null });
    
    return completedSession;
  },

  clearSession: () => {
    set({ currentSession: null });
  },

  getCompletedTests: () => {
    const { currentSession } = get();
    return currentSession?.completedTests || [];
  },

  getMissingTests: () => {
    const completedTests = get().getCompletedTests();
    return ALL_TEST_TYPES.filter(testType => !completedTests.includes(testType));
  },

  hasCompletedTest: (testType: TestType) => {
    const completedTests = get().getCompletedTests();
    return completedTests.includes(testType);
  },

  getCurrentSessionResults: () => {
    const { currentSession } = get();
    return currentSession?.results || [];
  },

  getTestResult: (testType: TestType) => {
    const results = get().getCurrentSessionResults();
    return results.find(result => result.testType === testType);
  },
});
