import React from 'react';
import { LeadPriority } from '../../types';

const CONFIG: Record<LeadPriority, { bg: string; text: string; icon: string }> = {
  High:   { bg: 'bg-rose-50',   text: 'text-rose-600',   icon: '↑' },
  Medium: { bg: 'bg-amber-50',  text: 'text-amber-600',  icon: '→' },
  Low:    { bg: 'bg-slate-100', text: 'text-slate-500',  icon: '↓' },
};

interface Props {
  priority: LeadPriority;
}

const PriorityBadge: React.FC<Props> = ({ priority }) => {
  const c = CONFIG[priority];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
      <span>{c.icon}</span>
      {priority}
    </span>
  );
};

export default PriorityBadge;
