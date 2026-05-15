import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  Visit, VisitObjective, VisitOutcome, VisitStatus,
  FollowUp, FollowUpType, FollowUpPriority,
  Task, TaskType, TaskStatus, TaskPriority,
  CollectionAttempt, CollectionStatus,
  RoutePlan, RoutePlanStop,
  ProductivityMetrics,
  Order,
} from '../types';
import { VISITS, FOLLOW_UPS, TASKS, COLLECTION_ATTEMPTS, ROUTE_PLANS, ORDERS } from '../data';

interface SalesExecutionContextValue {
  // Visit
  visits: Visit[];
  startVisit: (customerId: string, customerName: string, repId: string, repName: string, objectives: Omit<VisitObjective, 'id'>[]) => string;
  updateVisitObjective: (visitId: string, objectiveId: string, completed: boolean) => void;
  endVisit: (visitId: string, outcome: VisitOutcome) => void;
  cancelVisit: (visitId: string) => void;
  getActiveVisit: (repId: string) => Visit | undefined;
  getRepVisits: (repId: string) => Visit[];
  getVisitById: (id: string) => Visit | undefined;

  // Follow-Up
  followUps: FollowUp[];
  addFollowUp: (data: Omit<FollowUp, 'id'>) => string;
  completeFollowUp: (id: string, outcome: string) => void;
  dismissFollowUp: (id: string) => void;
  getTodayFollowUps: (repId: string) => FollowUp[];
  getOverdueFollowUps: (repId: string) => FollowUp[];
  getUpcomingFollowUps: (repId: string, days?: number) => FollowUp[];
  getRepFollowUps: (repId: string) => FollowUp[];

  // Task
  tasks: Task[];
  addTask: (data: Omit<Task, 'id'>) => string;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  completeTask: (id: string) => void;
  getRepTasks: (repId: string, status?: TaskStatus) => Task[];

  // Collection
  collectionAttempts: CollectionAttempt[];
  logCollectionAttempt: (data: Omit<CollectionAttempt, 'id'>) => string;
  updateCollectionStatus: (id: string, status: CollectionStatus, amountCollected?: number, notes?: string) => void;
  getRepCollections: (repId: string) => CollectionAttempt[];
  getCustomerCollections: (customerId: string) => CollectionAttempt[];

  // Route
  routePlans: RoutePlan[];
  getTodayRoute: (repId: string) => RoutePlan | undefined;
  markStopVisited: (repId: string, customerId: string) => void;
  markStopSkipped: (repId: string, customerId: string) => void;
  createOrUpdateRoute: (repId: string, stops: Array<{ customerId: string; customerName: string; address: string; priority: RoutePlanStop['priority']; estimatedVisitMinutes: number }>) => void;
  addStopToRoute: (repId: string, customerId: string, customerName: string, address: string) => void;
  removeStopFromRoute: (repId: string, customerId: string) => void;
  reorderRouteStops: (repId: string, newCustomerIdOrder: string[]) => void;

  // Orders
  orders: Order[];
  createOrder: (data: Omit<Order, 'id'>) => string;
  getRepOrders: (repId: string) => Order[];

  // Productivity
  getProductivityMetrics: (repId: string) => ProductivityMetrics;
}

const SalesExecutionContext = createContext<SalesExecutionContextValue | null>(null);

let _nextId = 1000;
const genId = (prefix: string) => `${prefix}${++_nextId}`;

const today = () => new Date().toISOString().split('T')[0];
const nowIso = () => new Date().toISOString();

function isOverdue(dueDate: string) {
  return dueDate < today();
}

function isToday(dueDate: string) {
  return dueDate === today();
}

export const SalesExecutionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visits, setVisits] = useState<Visit[]>(VISITS);
  const [followUps, setFollowUps] = useState<FollowUp[]>(() =>
    FOLLOW_UPS.map(f => ({
      ...f,
      status: (f.status === 'Pending' && isOverdue(f.dueDate)) ? 'Overdue' : f.status,
    }))
  );
  const [tasks, setTasks] = useState<Task[]>(() =>
    TASKS.map(t => ({
      ...t,
      status: (t.status === 'Pending' && isOverdue(t.dueDate)) ? 'Overdue' : t.status,
    }))
  );
  const [collectionAttempts, setCollectionAttempts] = useState<CollectionAttempt[]>(COLLECTION_ATTEMPTS);
  const [routePlans, setRoutePlans] = useState<RoutePlan[]>(ROUTE_PLANS);
  const [orders, setOrders] = useState<Order[]>(ORDERS);

  // ── Visit ──────────────────────────────────────────────────────────────────

  const startVisit = useCallback((
    customerId: string, customerName: string,
    repId: string, repName: string,
    objectives: Omit<VisitObjective, 'id'>[],
  ): string => {
    const id = genId('V');
    const visit: Visit = {
      id, customerId, customerName, repId, repName,
      status: 'active',
      date: today(),
      startTime: nowIso(),
      objectives: objectives.map((o, i) => ({ ...o, id: `${id}-O${i}` })),
      notes: '',
    };
    setVisits(prev => [visit, ...prev]);
    // Auto-mark matching route stop as Visited
    const todayStr = today();
    setRoutePlans(prev => prev.map(r => {
      if (r.repId !== repId || r.date !== todayStr) return r;
      return { ...r, stops: r.stops.map(s => s.customerId === customerId ? { ...s, status: 'Visited' as RoutePlanStop['status'] } : s) };
    }));
    return id;
  }, []);

  const updateVisitObjective = useCallback((visitId: string, objectiveId: string, completed: boolean) => {
    setVisits(prev => prev.map(v =>
      v.id !== visitId ? v : {
        ...v,
        objectives: v.objectives.map(o => o.id === objectiveId ? { ...o, completed } : o),
      }
    ));
  }, []);

  const endVisit = useCallback((visitId: string, outcome: VisitOutcome) => {
    const endTime = nowIso();
    setVisits(prev => prev.map(v => {
      if (v.id !== visitId) return v;
      const start = new Date(v.startTime).getTime();
      const end = new Date(endTime).getTime();
      const durationMinutes = Math.round((end - start) / 60000);
      return { ...v, status: 'completed' as VisitStatus, endTime, durationMinutes, outcome };
    }));
  }, []);

  const cancelVisit = useCallback((visitId: string) => {
    setVisits(prev => prev.map(v => v.id !== visitId ? v : { ...v, status: 'cancelled' as VisitStatus, endTime: nowIso() }));
  }, []);

  const getActiveVisit = useCallback((repId: string) =>
    visits.find(v => v.repId === repId && v.status === 'active'), [visits]);

  const getRepVisits = useCallback((repId: string) =>
    visits.filter(v => v.repId === repId), [visits]);

  const getVisitById = useCallback((id: string) =>
    visits.find(v => v.id === id), [visits]);

  // ── Follow-Up ──────────────────────────────────────────────────────────────

  const addFollowUp = useCallback((data: Omit<FollowUp, 'id'>): string => {
    const id = genId('FU');
    setFollowUps(prev => [{ ...data, id }, ...prev]);
    return id;
  }, []);

  const completeFollowUp = useCallback((id: string, outcome: string) => {
    setFollowUps(prev => prev.map(f =>
      f.id !== id ? f : { ...f, status: 'Completed', outcome, completedAt: nowIso() }
    ));
  }, []);

  const dismissFollowUp = useCallback((id: string) => {
    setFollowUps(prev => prev.map(f => f.id !== id ? f : { ...f, status: 'Cancelled' }));
  }, []);

  const getRepFollowUps = useCallback((repId: string) =>
    followUps.filter(f => f.repId === repId), [followUps]);

  const getTodayFollowUps = useCallback((repId: string) =>
    followUps.filter(f => f.repId === repId && isToday(f.dueDate) && f.status !== 'Completed' && f.status !== 'Cancelled'),
    [followUps]);

  const getOverdueFollowUps = useCallback((repId: string) =>
    followUps.filter(f => f.repId === repId && (f.status === 'Overdue' || (f.status === 'Pending' && isOverdue(f.dueDate)))),
    [followUps]);

  const getUpcomingFollowUps = useCallback((repId: string, days = 7) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() + days);
    const cutoffStr = cutoff.toISOString().split('T')[0];
    return followUps.filter(f =>
      f.repId === repId &&
      f.status === 'Pending' &&
      f.dueDate > today() &&
      f.dueDate <= cutoffStr
    );
  }, [followUps]);

  // ── Task ───────────────────────────────────────────────────────────────────

  const addTask = useCallback((data: Omit<Task, 'id'>): string => {
    const id = genId('T');
    setTasks(prev => [{ ...data, id }, ...prev]);
    return id;
  }, []);

  const updateTaskStatus = useCallback((id: string, status: TaskStatus) => {
    setTasks(prev => prev.map(t =>
      t.id !== id ? t : { ...t, status, completedAt: status === 'Completed' ? nowIso() : t.completedAt }
    ));
  }, []);

  const completeTask = useCallback((id: string) => {
    setTasks(prev => prev.map(t =>
      t.id !== id ? t : { ...t, status: 'Completed', completedAt: nowIso() }
    ));
  }, []);

  const getRepTasks = useCallback((repId: string, status?: TaskStatus) =>
    tasks.filter(t => t.repId === repId && (status === undefined || t.status === status)),
    [tasks]);

  // ── Collection ─────────────────────────────────────────────────────────────

  const logCollectionAttempt = useCallback((data: Omit<CollectionAttempt, 'id'>): string => {
    const id = genId('CA');
    setCollectionAttempts(prev => [{ ...data, id }, ...prev]);
    return id;
  }, []);

  const updateCollectionStatus = useCallback((id: string, status: CollectionStatus, amountCollected?: number, notes?: string) => {
    setCollectionAttempts(prev => prev.map(c =>
      c.id !== id ? c : {
        ...c, status,
        amountCollected: amountCollected !== undefined ? amountCollected : c.amountCollected,
        notes: notes !== undefined ? notes : c.notes,
      }
    ));
  }, []);

  const getRepCollections = useCallback((repId: string) =>
    collectionAttempts.filter(c => c.repId === repId), [collectionAttempts]);

  const getCustomerCollections = useCallback((customerId: string) =>
    collectionAttempts.filter(c => c.customerId === customerId), [collectionAttempts]);

  // ── Route ──────────────────────────────────────────────────────────────────

  const getTodayRoute = useCallback((repId: string): RoutePlan | undefined => {
    const todayStr = today();
    return routePlans.find(r => r.repId === repId && r.date === todayStr);
  }, [routePlans]);

  const updateStopStatus = (repId: string, customerId: string, status: RoutePlanStop['status']) => {
    const todayStr = today();
    setRoutePlans(prev => prev.map(r => {
      if (r.repId !== repId || r.date !== todayStr) return r;
      return { ...r, stops: r.stops.map(s => s.customerId === customerId ? { ...s, status } : s) };
    }));
  };

  const markStopVisited = useCallback((repId: string, customerId: string) =>
    updateStopStatus(repId, customerId, 'Visited'), []);

  const markStopSkipped = useCallback((repId: string, customerId: string) =>
    updateStopStatus(repId, customerId, 'Skipped'), []);

  const createOrUpdateRoute = useCallback((
    repId: string,
    stops: Array<{ customerId: string; customerName: string; address: string; priority: RoutePlanStop['priority']; estimatedVisitMinutes: number }>,
  ) => {
    const todayStr = today();
    const newStops: RoutePlanStop[] = stops.map((s, i) => ({
      ...s,
      suggestedOrder: i + 1,
      status: 'Pending',
      hasOverdueCollection: false,
      hasOverdueFollowUp: false,
    }));
    setRoutePlans(prev => {
      const exists = prev.find(r => r.repId === repId && r.date === todayStr);
      if (exists) {
        return prev.map(r => r.repId === repId && r.date === todayStr
          ? { ...r, stops: newStops, estimatedTotalMinutes: newStops.reduce((a, s) => a + s.estimatedVisitMinutes, 0) }
          : r
        );
      }
      return [...prev, {
        id: genId('RP'),
        repId,
        date: todayStr,
        stops: newStops,
        estimatedTotalMinutes: newStops.reduce((a, s) => a + s.estimatedVisitMinutes, 0),
      }];
    });
  }, []);

  const addStopToRoute = useCallback((repId: string, customerId: string, customerName: string, address: string) => {
    const todayStr = today();
    setRoutePlans(prev => {
      const existing = prev.find(r => r.repId === repId && r.date === todayStr);
      const alreadyOn = existing?.stops.some(s => s.customerId === customerId);
      if (alreadyOn) return prev;
      const newStop: RoutePlanStop = {
        customerId, customerName, address,
        priority: 'Medium',
        estimatedVisitMinutes: 30,
        suggestedOrder: (existing?.stops.length ?? 0) + 1,
        status: 'Pending',
        hasOverdueCollection: false,
        hasOverdueFollowUp: false,
      };
      if (existing) {
        return prev.map(r => r.repId === repId && r.date === todayStr
          ? { ...r, stops: [...r.stops, newStop], estimatedTotalMinutes: (r.estimatedTotalMinutes ?? 0) + 30 }
          : r
        );
      }
      return [...prev, { id: genId('RP'), repId, date: todayStr, stops: [newStop], estimatedTotalMinutes: 30 }];
    });
  }, []);

  const removeStopFromRoute = useCallback((repId: string, customerId: string) => {
    const todayStr = today();
    setRoutePlans(prev => prev.map(r => {
      if (r.repId !== repId || r.date !== todayStr) return r;
      const filtered = r.stops.filter(s => !(s.customerId === customerId && s.status === 'Pending'));
      return {
        ...r,
        stops: filtered.map((s, i) => ({ ...s, suggestedOrder: i + 1 })),
        estimatedTotalMinutes: filtered.reduce((a, s) => a + s.estimatedVisitMinutes, 0),
      };
    }));
  }, []);

  const reorderRouteStops = useCallback((repId: string, newCustomerIdOrder: string[]) => {
    const todayStr = today();
    setRoutePlans(prev => prev.map(r => {
      if (r.repId !== repId || r.date !== todayStr) return r;
      const reordered = newCustomerIdOrder
        .map((cid, i) => {
          const stop = r.stops.find(s => s.customerId === cid);
          return stop ? { ...stop, suggestedOrder: i + 1 } : null;
        })
        .filter(Boolean) as RoutePlanStop[];
      // keep any stops not in newOrder at the end (shouldn't happen but safe)
      const rest = r.stops.filter(s => !newCustomerIdOrder.includes(s.customerId));
      return { ...r, stops: [...reordered, ...rest] };
    }));
  }, []);

  // ── Orders ─────────────────────────────────────────────────────────────────

  const createOrder = useCallback((data: Omit<Order, 'id'>): string => {
    const id = `ORD-${Date.now()}`;
    setOrders(prev => [{ ...data, id }, ...prev]);
    return id;
  }, []);

  const getRepOrders = useCallback((repId: string) =>
    orders.filter(o => o.repId === repId), [orders]);

  // ── Productivity ───────────────────────────────────────────────────────────

  const getProductivityMetrics = useCallback((repId: string): ProductivityMetrics => {
    const todayStr = today();
    const todayVisits = visits.filter(v => v.repId === repId && v.date === todayStr);
    const completed = todayVisits.filter(v => v.status === 'completed');
    const planned = todayVisits.length;
    const avgDuration = completed.length > 0
      ? completed.reduce((s, v) => s + (v.durationMinutes ?? 0), 0) / completed.length : 0;
    const ordersThisVisit = completed.filter(v => v.outcome?.orderId).length;
    const ordersPerVisit = completed.length > 0 ? ordersThisVisit / completed.length : 0;
    const collectionsRecovered = completed.reduce((s, v) => s + (v.outcome?.collectionAmount ?? 0), 0);

    const repFollowUps = followUps.filter(f => f.repId === repId);
    const completedFU = repFollowUps.filter(f => f.status === 'Completed').length;
    const followUpRate = repFollowUps.length > 0 ? completedFU / repFollowUps.length : 0;

    const totalMinutes = completed.reduce((s, v) => s + (v.durationMinutes ?? 0), 0);
    const productiveHours = Math.round((totalMinutes / 60) * 10) / 10;

    return {
      repId, date: todayStr,
      visitsCompleted: completed.length,
      visitsPlanned: planned,
      avgVisitDurationMinutes: Math.round(avgDuration),
      ordersPerVisit: Math.round(ordersPerVisit * 10) / 10,
      collectionsRecovered,
      followUpCompletionRate: Math.round(followUpRate * 100),
      leadConversionRate: 25,
      productiveHours,
    };
  }, [visits, followUps]);

  const value: SalesExecutionContextValue = {
    visits, startVisit, updateVisitObjective, endVisit, cancelVisit,
    getActiveVisit, getRepVisits, getVisitById,
    followUps, addFollowUp, completeFollowUp, dismissFollowUp,
    getTodayFollowUps, getOverdueFollowUps, getUpcomingFollowUps, getRepFollowUps,
    tasks, addTask, updateTaskStatus, completeTask, getRepTasks,
    collectionAttempts, logCollectionAttempt, updateCollectionStatus,
    getRepCollections, getCustomerCollections,
    routePlans, getTodayRoute, markStopVisited, markStopSkipped,
    createOrUpdateRoute, addStopToRoute, removeStopFromRoute, reorderRouteStops,
    orders, createOrder, getRepOrders,
    getProductivityMetrics,
  };

  return (
    <SalesExecutionContext.Provider value={value}>
      {children}
    </SalesExecutionContext.Provider>
  );
};

export const useSalesExecution = () => {
  const ctx = useContext(SalesExecutionContext);
  if (!ctx) throw new Error('useSalesExecution must be used within SalesExecutionProvider');
  return ctx;
};
