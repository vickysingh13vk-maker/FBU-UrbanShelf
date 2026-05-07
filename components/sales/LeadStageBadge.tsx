import React from 'react';
import { LeadStage } from '../../types';

const CONFIG: Record<LeadStage, { bg: string; text: string }> = {
  'New Lead':          { bg: 'bg-slate-100',   text: 'text-slate-600' },
  'Contacted':         { bg: 'bg-blue-50',     text: 'text-blue-600' },
  'Interested':        { bg: 'bg-indigo-50',   text: 'text-indigo-700' },
  'Meeting Scheduled': { bg: 'bg-violet-50',   text: 'text-violet-700' },
  'Trial Order':       { bg: 'bg-amber-50',    text: 'text-amber-700' },
  'Converted':         { bg: 'bg-emerald-50',  text: 'text-emerald-700' },
  'Lost':              { bg: 'bg-rose-50',     text: 'text-rose-600' },
};

interface Props {
  stage: LeadStage;
  size?: 'sm' | 'md';
}

const LeadStageBadge: React.FC<Props> = ({ stage, size = 'sm' }) => {
  const c = CONFIG[stage];
  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm';
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${padding} ${c.bg} ${c.text}`}>
      {stage}
    </span>
  );
};

export default LeadStageBadge;
