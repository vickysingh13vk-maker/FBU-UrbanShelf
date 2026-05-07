import React from 'react';
import { AlertSeverity } from '../../types';

const CONFIG: Record<AlertSeverity, { bg: string; text: string }> = {
  'Critical': { bg: 'bg-rose-100',   text: 'text-rose-700'   },
  'Warning':  { bg: 'bg-amber-100',  text: 'text-amber-700'  },
  'Info':     { bg: 'bg-blue-100',   text: 'text-blue-700'   },
};

interface Props { severity: AlertSeverity; }

const AlertSeverityBadge: React.FC<Props> = ({ severity }) => {
  const c = CONFIG[severity];
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${c.bg} ${c.text}`}>
      {severity}
    </span>
  );
};

export default AlertSeverityBadge;
