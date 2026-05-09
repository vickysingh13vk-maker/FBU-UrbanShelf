import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  RepStatus, RepPerformanceMetrics, PeriodType, CustomerHealth,
  OperationalAlert, TeamAnalytics, Territory, TerritoryPerformance, LeadAnalytics,
} from '../types';
import {
  REP_STATUSES, REP_PERFORMANCE, CUSTOMER_HEALTH, OPERATIONAL_ALERTS,
  TEAM_ANALYTICS, TERRITORIES, TERRITORY_PERFORMANCE, LEAD_ANALYTICS,
} from '../data';

interface SalesManagerContextValue {
  repStatuses: RepStatus[];
  getRepStatus: (repId: string) => RepStatus | undefined;
  teamAnalytics: TeamAnalytics;
  repPerformance: RepPerformanceMetrics[];
  getRepPerformance: (repId: string, period: PeriodType) => RepPerformanceMetrics | undefined;
  customerHealth: CustomerHealth[];
  getCustomerHealth: (customerId: string) => CustomerHealth | undefined;
  getAtRiskCustomers: () => CustomerHealth[];
  alerts: OperationalAlert[];
  dismissAlert: (id: string) => void;
  markAlertRead: (id: string) => void;
  getUnreadAlerts: () => OperationalAlert[];
  getCriticalAlerts: () => OperationalAlert[];
  territories: Territory[];
  territoryPerformance: TerritoryPerformance[];
  leadAnalytics: LeadAnalytics[];
}

const SalesManagerContext = createContext<SalesManagerContextValue | null>(null);

export const SalesManagerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [repStatuses] = useState<RepStatus[]>(REP_STATUSES);
  const [repPerformance] = useState<RepPerformanceMetrics[]>(REP_PERFORMANCE);
  const [customerHealth] = useState<CustomerHealth[]>(CUSTOMER_HEALTH);
  const [alerts, setAlerts] = useState<OperationalAlert[]>(OPERATIONAL_ALERTS);
  const [teamAnalytics] = useState<TeamAnalytics>(TEAM_ANALYTICS);
  const [territories] = useState<Territory[]>(TERRITORIES);
  const [territoryPerformance] = useState<TerritoryPerformance[]>(TERRITORY_PERFORMANCE);
  const [leadAnalytics] = useState<LeadAnalytics[]>(LEAD_ANALYTICS);

  const getRepStatus = useCallback((repId: string) =>
    repStatuses.find(r => r.repId === repId), [repStatuses]);

  const getRepPerformance = useCallback((repId: string, period: PeriodType) =>
    repPerformance.find(r => r.repId === repId && r.period === period), [repPerformance]);

  const getCustomerHealth = useCallback((customerId: string) =>
    customerHealth.find(c => c.customerId === customerId), [customerHealth]);

  const getAtRiskCustomers = useCallback(() =>
    customerHealth.filter(c => c.healthState === 'High Risk' || c.healthState === 'Critical')
      .sort((a, b) => a.healthScore - b.healthScore), [customerHealth]);

  const dismissAlert = useCallback((id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, dismissed: true, read: true } : a));
  }, []);

  const markAlertRead = useCallback((id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
  }, []);

  const getUnreadAlerts = useCallback(() =>
    alerts.filter(a => !a.read && !a.dismissed), [alerts]);

  const getCriticalAlerts = useCallback(() =>
    alerts.filter(a => a.severity === 'Critical' && !a.dismissed), [alerts]);

  return (
    <SalesManagerContext.Provider value={{
      repStatuses, getRepStatus,
      teamAnalytics,
      repPerformance, getRepPerformance,
      customerHealth, getCustomerHealth, getAtRiskCustomers,
      alerts, dismissAlert, markAlertRead, getUnreadAlerts, getCriticalAlerts,
      territories, territoryPerformance,
      leadAnalytics,
    }}>
      {children}
    </SalesManagerContext.Provider>
  );
};

export const useSalesManager = () => {
  const ctx = useContext(SalesManagerContext);
  if (!ctx) throw new Error('useSalesManager must be used inside SalesManagerProvider');
  return ctx;
};
