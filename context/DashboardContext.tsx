import React, { createContext, useContext, useState } from 'react';

export type DashboardRole = 'admin' | 'sales' | 'finance' | 'inventory' | 'supplier';

interface DashboardContextType {
  activeRole: DashboardRole;
  setActiveRole: (role: DashboardRole) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeRole, setActiveRole] = useState<DashboardRole>('admin');

  return (
    <DashboardContext.Provider value={{ activeRole, setActiveRole }}>
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
