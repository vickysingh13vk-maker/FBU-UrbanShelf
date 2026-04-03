import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({ children, className = '', padding = 'md', ...props }) => {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm transition-all duration-200 hover:shadow-md ${paddings[padding]} ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ 
  title: string; 
  description?: string; 
  action?: React.ReactNode;
  className?: string;
}> = ({ title, description, action, className = '' }) => (
  <div className={`flex items-center justify-between mb-6 ${className}`}>
    <div className="space-y-1">
      <h3 className="text-base font-bold text-slate-900 tracking-tight">{title}</h3>
      {description && <p className="text-xs text-slate-500 font-medium">{description}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);
