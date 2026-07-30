import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { WorkSession, SessionSummary } from '../types';
import { WORK_SESSIONS } from '../data';
import { useAuth } from './AuthContext';

interface TodayStats {
  visits: number;
  orders: number;
  collections: number;
  leadsAdded: number;
  followUpsPending: number;
  revenue: number;
}

interface WorkSessionContextType {
  isOnline: boolean;
  currentSession: WorkSession | null;
  sessionStart: Date | null;
  elapsedSeconds: number;
  startSession: (repId: string, repName: string) => void;
  endSession: () => SessionSummary | null;
  recordVisit: () => void;
  recordOrder: (amount: number) => void;
  recordCollection: (amount: number) => void;
  incrementLeads: () => void;
  sessionHistory: WorkSession[];
  todayStats: TodayStats;
  lastSummary: SessionSummary | null;
  clearLastSummary: () => void;
}

const WorkSessionContext = createContext<WorkSessionContextType | null>(null);

const sessionKeyFor = (repId: string) => `crm_work_session_${repId}`;

function generateId() {
  return 'WS' + Date.now().toString(36).toUpperCase();
}

export const WorkSessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [isOnline, setIsOnline] = useState(false);
  const [currentSession, setCurrentSession] = useState<WorkSession | null>(null);
  const [sessionStart, setSessionStart] = useState<Date | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [sessionHistory, setSessionHistory] = useState<WorkSession[]>(WORK_SESSIONS);
  const [lastSummary, setLastSummary] = useState<SessionSummary | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Restore this rep's own active session from localStorage whenever the logged-in user changes.
  // Scoping the storage key (and re-running on user?.id) prevents one rep's in-progress
  // session from leaking onto another rep's dashboard on a shared device.
  useEffect(() => {
    if (!user?.id) {
      setCurrentSession(null);
      setSessionStart(null);
      setIsOnline(false);
      setElapsedSeconds(0);
      return;
    }
    const stored = localStorage.getItem(sessionKeyFor(user.id));
    if (stored) {
      try {
        const session: WorkSession = JSON.parse(stored);
        if (session.status === 'active' && session.repId === user.id) {
          const start = new Date(session.startTime);
          setCurrentSession(session);
          setSessionStart(start);
          setIsOnline(true);
          setElapsedSeconds(Math.floor((Date.now() - start.getTime()) / 1000));
          return;
        }
      } catch {
        localStorage.removeItem(sessionKeyFor(user.id));
      }
    }
    setCurrentSession(null);
    setSessionStart(null);
    setIsOnline(false);
    setElapsedSeconds(0);
  }, [user?.id]);

  // Timer
  useEffect(() => {
    if (isOnline) {
      intervalRef.current = setInterval(() => {
        setElapsedSeconds(s => s + 1);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isOnline]);

  const persistSession = useCallback((session: WorkSession) => {
    localStorage.setItem(sessionKeyFor(session.repId), JSON.stringify(session));
  }, []);

  const startSession = useCallback((repId: string, repName: string) => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const session: WorkSession = {
      id: generateId(),
      repId,
      repName,
      date: today,
      startTime: now.toISOString(),
      status: 'active',
      totalVisits: 0,
      totalOrders: 0,
      totalCollections: 0,
      totalRevenue: 0,
    };
    setCurrentSession(session);
    setSessionStart(now);
    setElapsedSeconds(0);
    setIsOnline(true);
    persistSession(session);
  }, [persistSession]);

  const endSession = useCallback((): SessionSummary | null => {
    if (!currentSession || !sessionStart) return null;
    const now = new Date();
    const durationMinutes = Math.floor((now.getTime() - sessionStart.getTime()) / 60000);
    const summary: SessionSummary = {
      duration: durationMinutes,
      visits: currentSession.totalVisits,
      orders: currentSession.totalOrders,
      collections: currentSession.totalCollections,
      revenue: currentSession.totalRevenue,
      leadsAdded: 0,
      followUpsCompleted: 0,
    };
    const ended: WorkSession = {
      ...currentSession,
      endTime: now.toISOString(),
      status: 'ended',
      summary,
    };
    setSessionHistory(prev => [ended, ...prev]);
    setCurrentSession(null);
    setSessionStart(null);
    setElapsedSeconds(0);
    setIsOnline(false);
    setLastSummary(summary);
    localStorage.removeItem(sessionKeyFor(currentSession.repId));
    return summary;
  }, [currentSession, sessionStart]);

  const updateSession = useCallback((updater: (s: WorkSession) => WorkSession) => {
    setCurrentSession(prev => {
      if (!prev) return prev;
      const updated = updater(prev);
      persistSession(updated);
      return updated;
    });
  }, [persistSession]);

  const recordVisit = useCallback(() => {
    updateSession(s => ({ ...s, totalVisits: s.totalVisits + 1 }));
  }, [updateSession]);

  const recordOrder = useCallback((amount: number) => {
    updateSession(s => ({ ...s, totalOrders: s.totalOrders + 1, totalRevenue: s.totalRevenue + amount }));
  }, [updateSession]);

  const recordCollection = useCallback((amount: number) => {
    updateSession(s => ({ ...s, totalCollections: s.totalCollections + amount }));
  }, [updateSession]);

  const incrementLeads = useCallback(() => {
    // tracked externally via SalesCRMContext; this is a no-op hook for future use
  }, []);

  const todayStats: TodayStats = {
    visits: currentSession?.totalVisits ?? 0,
    orders: currentSession?.totalOrders ?? 0,
    collections: currentSession?.totalCollections ?? 0,
    leadsAdded: 0,
    followUpsPending: 0,
    revenue: currentSession?.totalRevenue ?? 0,
  };

  const clearLastSummary = useCallback(() => setLastSummary(null), []);

  return (
    <WorkSessionContext.Provider value={{
      isOnline, currentSession, sessionStart, elapsedSeconds,
      startSession, endSession, recordVisit, recordOrder, recordCollection, incrementLeads,
      sessionHistory, todayStats, lastSummary, clearLastSummary,
    }}>
      {children}
    </WorkSessionContext.Provider>
  );
};

export const useWorkSession = (): WorkSessionContextType => {
  const ctx = useContext(WorkSessionContext);
  if (!ctx) throw new Error('useWorkSession must be used within WorkSessionProvider');
  return ctx;
};
