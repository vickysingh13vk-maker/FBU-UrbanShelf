import React, { createContext, useContext, useState, useCallback } from 'react';
import { AutomationRule, AutomationStatus } from '../types';
import { AUTOMATION_RULES } from '../data';

interface AutomationContextValue {
  rules: AutomationRule[];
  toggleRule: (id: string) => void;
  getActiveRules: () => AutomationRule[];
  getRulesByTrigger: (trigger: AutomationRule['trigger']) => AutomationRule[];
  totalFiredToday: () => number;
}

const AutomationContext = createContext<AutomationContextValue | null>(null);

export const AutomationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rules, setRules] = useState<AutomationRule[]>(AUTOMATION_RULES);

  const toggleRule = useCallback((id: string) => {
    setRules(prev => prev.map(r => {
      if (r.id !== id) return r;
      const next: AutomationStatus = r.status === 'Active' ? 'Paused' : 'Active';
      return { ...r, status: next };
    }));
  }, []);

  const getActiveRules = useCallback(() =>
    rules.filter(r => r.status === 'Active'), [rules]);

  const getRulesByTrigger = useCallback((trigger: AutomationRule['trigger']) =>
    rules.filter(r => r.trigger === trigger), [rules]);

  const totalFiredToday = useCallback(() =>
    rules.filter(r => {
      if (!r.lastRunAt) return false;
      const today = new Date().toISOString().split('T')[0];
      return r.lastRunAt.startsWith(today);
    }).reduce((sum, r) => sum + r.totalFired, 0), [rules]);

  return (
    <AutomationContext.Provider value={{ rules, toggleRule, getActiveRules, getRulesByTrigger, totalFiredToday }}>
      {children}
    </AutomationContext.Provider>
  );
};

export const useAutomation = () => {
  const ctx = useContext(AutomationContext);
  if (!ctx) throw new Error('useAutomation must be used inside AutomationProvider');
  return ctx;
};
