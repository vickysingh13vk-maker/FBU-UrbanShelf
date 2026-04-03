import React from 'react';

interface TabsProps {
  tabs: {
    id: string;
    label: string;
    icon?: React.ReactNode;
  }[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange, className = '' }) => (
  <div className={`flex items-center gap-1 p-1 bg-slate-100 rounded-xl w-fit ${className}`}>
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => onChange(tab.id)}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200
          ${activeTab === tab.id 
            ? 'bg-white text-indigo-600 shadow-sm' 
            : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'}
        `}
      >
        {tab.icon && <span className="h-4 w-4">{tab.icon}</span>}
        {tab.label}
      </button>
    ))}
  </div>
);

export const UnderlineTabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange, className = '' }) => (
  <div className={`flex items-center border-b border-slate-200 ${className}`}>
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => onChange(tab.id)}
        className={`
          flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-all relative
          ${activeTab === tab.id 
            ? 'text-indigo-600' 
            : 'text-slate-500 hover:text-slate-700'}
        `}
      >
        {tab.icon && <span className="h-4 w-4">{tab.icon}</span>}
        {tab.label}
        {activeTab === tab.id && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full" />
        )}
      </button>
    ))}
  </div>
);
