import React from 'react';
import { CustomerLifecycleStage } from '../../types';

const CONFIG: Record<CustomerLifecycleStage, { bg: string; text: string; dot: string }> = {
  Lead:              { bg: 'bg-slate-100',   text: 'text-slate-600',   dot: 'bg-slate-400' },
  Prospect:          { bg: 'bg-blue-50',     text: 'text-blue-600',    dot: 'bg-blue-400' },
  Qualified:         { bg: 'bg-indigo-50',   text: 'text-indigo-600',  dot: 'bg-indigo-400' },
  Active:            { bg: 'bg-emerald-50',  text: 'text-emerald-700', dot: 'bg-emerald-500' },
  'At Risk':         { bg: 'bg-amber-50',    text: 'text-amber-700',   dot: 'bg-amber-400' },
  Inactive:          { bg: 'bg-slate-100',   text: 'text-slate-500',   dot: 'bg-slate-300' },
  Lost:              { bg: 'bg-rose-50',     text: 'text-rose-600',    dot: 'bg-rose-400' },
  Archived:          { bg: 'bg-neutral-100', text: 'text-neutral-500', dot: 'bg-neutral-300' },
};

interface Props {
  stage: CustomerLifecycleStage;
  size?: 'sm' | 'md';
}

const LifecycleBadge: React.FC<Props> = ({ stage, size = 'sm' }) => {
  const c = CONFIG[stage];
  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${padding} ${c.bg} ${c.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      {stage}
    </span>
  );
};

export default LifecycleBadge;
