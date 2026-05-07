import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  Lead, LeadActivity, LeadStage, CustomerTimeline, TimelineEventType,
  Customer, CustomerLifecycleStage
} from '../types';
import { LEADS, CUSTOMER_TIMELINES, CUSTOMERS } from '../data';

interface SalesCRMContextType {
  // Leads
  leads: Lead[];
  getRepLeads: (repId: string) => Lead[];
  addLead: (lead: Omit<Lead, 'id' | 'activities' | 'createdDate'>) => Lead;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  moveLeadStage: (id: string, stage: LeadStage, note?: string) => void;
  convertLead: (leadId: string, customerId: string) => void;
  addLeadActivity: (leadId: string, activity: Omit<LeadActivity, 'id' | 'leadId'>) => void;

  // Customer Timeline
  timelines: CustomerTimeline[];
  getCustomerTimeline: (customerId: string) => CustomerTimeline[];
  addTimelineEntry: (entry: Omit<CustomerTimeline, 'id'>) => void;

  // Customer Ownership
  customers: Customer[];
  getRepCustomers: (repId: string) => Customer[];
  updateCustomerLifecycle: (customerId: string, stage: CustomerLifecycleStage) => void;

  // Helpers
  getTodayLeadCount: (repId: string) => number;
  getPendingFollowUps: (repId: string) => Lead[];
}

const SalesCRMContext = createContext<SalesCRMContextType | null>(null);

function generateId(prefix: string) {
  return prefix + Date.now().toString(36).toUpperCase();
}

export const SalesCRMProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [leads, setLeads] = useState<Lead[]>(LEADS);
  const [timelines, setTimelines] = useState<CustomerTimeline[]>(CUSTOMER_TIMELINES);
  const [customers, setCustomers] = useState<Customer[]>(CUSTOMERS);

  const getRepLeads = useCallback((repId: string) =>
    leads.filter(l => l.repId === repId), [leads]);

  const addLead = useCallback((lead: Omit<Lead, 'id' | 'activities' | 'createdDate'>): Lead => {
    const newLead: Lead = {
      ...lead,
      id: generateId('L'),
      activities: [],
      createdDate: new Date().toISOString(),
    };
    setLeads(prev => [newLead, ...prev]);
    return newLead;
  }, []);

  const updateLead = useCallback((id: string, updates: Partial<Lead>) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
  }, []);

  const moveLeadStage = useCallback((id: string, stage: LeadStage, note?: string) => {
    setLeads(prev => prev.map(l => {
      if (l.id !== id) return l;
      const activity: LeadActivity = {
        id: generateId('LA'),
        leadId: id,
        type: 'Stage Change',
        repId: l.repId,
        repName: l.repName,
        timestamp: new Date().toISOString(),
        notes: note ?? `Moved to ${stage}`,
        stageFrom: l.stage,
        stageTo: stage,
      };
      return {
        ...l,
        stage,
        lastContactDate: new Date().toISOString(),
        activities: [...l.activities, activity],
      };
    }));
  }, []);

  const convertLead = useCallback((leadId: string, customerId: string) => {
    setLeads(prev => prev.map(l => {
      if (l.id !== leadId) return l;
      const activity: LeadActivity = {
        id: generateId('LA'),
        leadId,
        type: 'Stage Change',
        repId: l.repId,
        repName: l.repName,
        timestamp: new Date().toISOString(),
        notes: 'Lead converted to customer.',
        stageFrom: l.stage,
        stageTo: 'Converted',
      };
      return {
        ...l,
        stage: 'Converted' as LeadStage,
        convertedCustomerId: customerId,
        activities: [...l.activities, activity],
      };
    }));
  }, []);

  const addLeadActivity = useCallback((leadId: string, activity: Omit<LeadActivity, 'id' | 'leadId'>) => {
    const newActivity: LeadActivity = {
      ...activity,
      id: generateId('LA'),
      leadId,
    };
    setLeads(prev => prev.map(l =>
      l.id === leadId
        ? { ...l, activities: [...l.activities, newActivity], lastContactDate: newActivity.timestamp }
        : l
    ));
  }, []);

  const getCustomerTimeline = useCallback((customerId: string): CustomerTimeline[] =>
    timelines
      .filter(t => t.customerId === customerId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    [timelines]);

  const addTimelineEntry = useCallback((entry: Omit<CustomerTimeline, 'id'>) => {
    const newEntry: CustomerTimeline = { ...entry, id: generateId('CT') };
    setTimelines(prev => [newEntry, ...prev]);
    // Update customer's lastContactDate
    setCustomers(prev => prev.map(c =>
      c.id === entry.customerId ? { ...c, lastContactDate: entry.timestamp } : c
    ));
  }, []);

  const getRepCustomers = useCallback((repId: string): Customer[] =>
    customers.filter(c => c.assignedRepId === repId), [customers]);

  const updateCustomerLifecycle = useCallback((customerId: string, stage: CustomerLifecycleStage) => {
    setCustomers(prev => prev.map(c =>
      c.id === customerId ? { ...c, lifecycleStage: stage } : c
    ));
  }, []);

  const getTodayLeadCount = useCallback((repId: string): number => {
    const today = new Date().toISOString().split('T')[0];
    return leads.filter(l => l.repId === repId && l.createdDate.startsWith(today)).length;
  }, [leads]);

  const getPendingFollowUps = useCallback((repId: string): Lead[] => {
    const now = new Date();
    return leads.filter(l =>
      l.repId === repId &&
      l.nextFollowUp &&
      new Date(l.nextFollowUp) <= now &&
      l.stage !== 'Converted' &&
      l.stage !== 'Lost'
    );
  }, [leads]);

  return (
    <SalesCRMContext.Provider value={{
      leads, getRepLeads, addLead, updateLead, moveLeadStage, convertLead, addLeadActivity,
      timelines, getCustomerTimeline, addTimelineEntry,
      customers, getRepCustomers, updateCustomerLifecycle,
      getTodayLeadCount, getPendingFollowUps,
    }}>
      {children}
    </SalesCRMContext.Provider>
  );
};

export const useSalesCRM = (): SalesCRMContextType => {
  const ctx = useContext(SalesCRMContext);
  if (!ctx) throw new Error('useSalesCRM must be used within SalesCRMProvider');
  return ctx;
};
