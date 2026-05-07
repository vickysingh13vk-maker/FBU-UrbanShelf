import React from 'react';
import { CustomerHealthState } from '../../types';

const CONFIG: Record<CustomerHealthState, { bg: string; text: string; dot: string }> = {
  'Healthy':   { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  'Warning':   { bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-400'   },
  'High Risk': { bg: 'bg-orange-50',  text: 'text-orange-700',  dot: 'bg-orange-500'  },
  'Critical':  { bg: 'bg-rose-50',    text: 'text-rose-700',    dot: 'bg-rose-500'    },
};

interface Props { state: CustomerHealthState; score?: number; }

const CustomerHealthBadge: React.FC<Props> = ({ state, score }) => {
  const c = CONFIG[state];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      {state}{score !== undefined ? ` (${score})` : ''}
    </span>
  );
};

export default CustomerHealthBadge;
