import type { StateCreator } from 'zustand';
import type { TestSession } from './test-session-slice'

export interface SessionHistorySlice {
  sessions: TestSession[];
  
  addSession: (session: TestSession) => void;
  loadSession: (sessionId: string) => TestSession | undefined;
  deleteSession: (sessionId: string) => void;
  getAllSessions: () => TestSession[];
  getSessionById: (sessionId: string) => TestSession | undefined;
  clearHistory: () => void;
}

export const createSessionHistorySlice: StateCreator<
  SessionHistorySlice,
  [],
  [],
  SessionHistorySlice
> = (set, get) => ({
  sessions: [],

  addSession: (session: TestSession) => {
    set((state) => ({
      sessions: [...state.sessions, session],
    }));
  },

  loadSession: (sessionId: string) => {
    const { sessions } = get();
    return sessions.find(s => s.id === sessionId);
  },

  deleteSession: (sessionId: string) => {
    set((state) => ({
      sessions: state.sessions.filter(s => s.id !== sessionId),
    }));
  },

  getAllSessions: () => {
    return get().sessions;
  },

  getSessionById: (sessionId: string) => {
    const { sessions } = get();
    return sessions.find(s => s.id === sessionId);
  },

  clearHistory: () => {
    set({ sessions: [] });
  },
});
