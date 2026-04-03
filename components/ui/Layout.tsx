import React from 'react';

interface SectionProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const Section: React.FC<SectionProps> = ({ title, description, action, children, className = '' }) => (
  <div className={`space-y-6 ${className}`}>
    {(title || action) && (
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          {title && <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>}
          {description && <p className="text-slate-500 mt-1">{description}</p>}
        </div>
        {action && <div className="flex flex-wrap gap-2">{action}</div>}
      </div>
    )}
    {children}
  </div>
);

export const Grid: React.FC<{ children: React.ReactNode; cols?: 1 | 2 | 3 | 4; gap?: number; className?: string }> = ({ 
  children, 
  cols = 4, 
  gap = 6, 
  className = '' 
}) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };
  
  const gridGap = `gap-${gap}`;

  return (
    <div className={`grid ${gridCols[cols]} ${gridGap} ${className}`}>
      {children}
    </div>
  );
};
