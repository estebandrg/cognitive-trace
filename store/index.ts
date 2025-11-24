import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createSessionHistorySlice, SessionHistorySlice } from './slices/session-history-slice';
import { createTestSessionSlice, TestSessionSlice } from './slices/test-session-slice';

export type StoreState = TestSessionSlice & SessionHistorySlice;

export const useStore = create<StoreState>()(
  persist(
    (...a) => ({
      ...createTestSessionSlice(...a),
      ...createSessionHistorySlice(...a),
    }),
    {
      name: 'cognitive-trace-storage',
      partialize: (state) => ({
        sessions: state.sessions,
        // Don't persist currentSession to avoid stale sessions on reload
      }),
    }
  )
);

