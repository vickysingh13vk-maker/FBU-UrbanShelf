import React from 'react';

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

export const Table: React.FC<TableProps & { noWrapper?: boolean }> = ({ children, className = '', noWrapper }) => {
  const table = (
    <table className={`min-w-full divide-y divide-slate-100 ${className}`}>
      {children}
    </table>
  );
  if (noWrapper) return table;
  return (
    <div className="overflow-x-auto">
      {table}
    </div>
  );
};

export const THead: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <thead className={`bg-slate-50/50 ${className}`}>
    {children}
  </thead>
);

export const TBody: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <tbody className={`bg-white divide-y divide-slate-100 ${className}`}>
    {children}
  </tbody>
);

export const TR: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className = '', onClick }) => (
  <tr 
    className={`hover:bg-slate-50 transition-colors group ${onClick ? 'cursor-pointer' : ''} ${className}`}
    onClick={onClick}
  >
    {children}
  </tr>
);

export const TH: React.FC<{ 
  children: React.ReactNode; 
  className?: string; 
  align?: 'left' | 'center' | 'right';
  onClick?: () => void;
}> = ({ children, className = '', align = 'left', onClick }) => {
  const alignment = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };
  return (
    <th 
      className={`px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider ${alignment[align]} ${onClick ? 'cursor-pointer group select-none' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </th>
  );
};

export const TD: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
  align?: 'left' | 'center' | 'right';
}> = ({ children, className = '', align = 'left' }) => {
  const alignment = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };
  return (
    <td className={`px-6 py-4 whitespace-nowrap text-sm ${alignment[align]} ${className}`}>
      {children}
    </td>
  );
};
