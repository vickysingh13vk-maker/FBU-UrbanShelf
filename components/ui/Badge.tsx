import React from 'react';

export const Badge: React.FC<{ 
  children: React.ReactNode; 
  variant?: 'success' | 'warning' | 'danger' | 'neutral' | 'info' | 'primary';
  className?: string;
}> = ({ children, variant = 'neutral', className = '' }) => {
  const styles = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-100 ring-1 ring-emerald-600/10',
    warning: 'bg-amber-50 text-amber-700 border-amber-100 ring-1 ring-amber-600/10',
    danger: 'bg-rose-50 text-rose-700 border-rose-100 ring-1 ring-rose-600/10',
    neutral: 'bg-slate-50 text-slate-600 border-slate-100 ring-1 ring-slate-600/10',
    info: 'bg-blue-50 text-blue-700 border-blue-100 ring-1 ring-blue-600/10',
    primary: 'bg-indigo-50 text-indigo-700 border-indigo-100 ring-1 ring-indigo-600/10',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
};

export const Tag: React.FC<{
  children: React.ReactNode;
  onRemove?: () => void;
  icon?: React.ReactNode;
  className?: string;
}> = ({ children, onRemove, icon, className = '' }) => (
  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium bg-slate-100 text-slate-700 border border-slate-200 ${className}`}>
    {icon && <span className="mr-1.5 text-slate-400">{icon}</span>}
    {children}
    {onRemove && (
      <button 
        type="button" 
        onClick={onRemove} 
        className="ml-1.5 text-slate-400 hover:text-rose-50 font-bold hover:bg-rose-500 rounded-full p-0.5 transition-colors"
      >
        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    )}
  </span>
);
