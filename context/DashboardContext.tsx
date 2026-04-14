import React, { createContext, useContext, useState, useCallback } from 'react';

export type DashboardRole = 'admin' | 'sales' | 'finance' | 'inventory' | 'supplier';
export type ViewMode = 'live' | 'historic';
export type HistoricPreset = 'today' | 'yesterday' | 'last_week' | 'last_month' | 'custom';

interface HistoricDateRange {
  from: string;
  to: string;
}

interface DashboardContextType {
  activeRole: DashboardRole;
  setActiveRole: (role: DashboardRole) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  historicPreset: HistoricPreset;
  setHistoricPreset: (preset: HistoricPreset) => void;
  historicDateRange: HistoricDateRange;
  setHistoricDateRange: (range: HistoricDateRange) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

function getDefaultDateRange(): HistoricDateRange {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const todayStr = `${yyyy}-${mm}-${dd}`;
  return { from: todayStr, to: todayStr };
}

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeRole, setActiveRole] = useState<DashboardRole>('admin');
  const [viewMode, setViewModeState] = useState<ViewMode>('live');
  const [historicPreset, setHistoricPreset] = useState<HistoricPreset>('today');
  const [historicDateRange, setHistoricDateRange] = useState<HistoricDateRange>(getDefaultDateRange);

  const setViewMode = useCallback((mode: ViewMode) => {
    setViewModeState(mode);
    if (mode === 'live') {
      setHistoricPreset('today');
      setHistoricDateRange(getDefaultDateRange());
    }
  }, []);

  return (
    <DashboardContext.Provider value={{
      activeRole, setActiveRole,
      viewMode, setViewMode,
      historicPreset, setHistoricPreset,
      historicDateRange, setHistoricDateRange,
    }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
