import React from 'react';
import { OperationalAlert } from '../../types';
import AlertSeverityBadge from './AlertSeverityBadge';
import { X, ExternalLink, AlertTriangle, Info, AlertCircle } from 'lucide-react';

const TYPE_ICONS: Record<string, React.ReactNode> = {
  'churn-risk': <AlertTriangle className="h-4 w-4 text-rose-500" />,
  'inactive-customer': <AlertCircle className="h-4 w-4 text-orange-500" />,
  'overdue-collection': <AlertTriangle className="h-4 w-4 text-rose-500" />,
  'overdue-follow-up': <AlertCircle className="h-4 w-4 text-amber-500" />,
  'stalled-lead': <Info className="h-4 w-4 text-blue-500" />,
  'unassigned-lead': <AlertCircle className="h-4 w-4 text-amber-500" />,
  'rep-idle': <AlertCircle className="h-4 w-4 text-amber-500" />,
  'missed-visit': <AlertTriangle className="h-4 w-4 text-orange-500" />,
  'low-productivity': <Info className="h-4 w-4 text-blue-500" />,
};

interface Props {
  alert: OperationalAlert;
  onDismiss: (id: string) => void;
  onRead: (id: string) => void;
}

const AlertCard: React.FC<Props> = ({ alert, onDismiss, onRead }) => {
  React.useEffect(() => {
    if (!alert.read) onRead(alert.id);
  }, [alert.id, alert.read, onRead]);

  const timeAgo = () => {
    const diff = Date.now() - new Date(alert.createdAt).getTime();
    const h = Math.floor(diff / 3600000);
    if (h < 1) return `${Math.floor(diff / 60000)}m ago`;
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  return (
    <div className={`p-4 bg-white border rounded-2xl transition-all ${alert.severity === 'Critical' ? 'border-rose-200' : alert.severity === 'Warning' ? 'border-amber-200' : 'border-slate-100'}`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex-shrink-0">
          {TYPE_ICONS[alert.type] ?? <Info className="h-4 w-4 text-slate-400" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-bold text-slate-800">{alert.title}</p>
            <AlertSeverityBadge severity={alert.severity} />
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{alert.description}</p>
          <div className="flex items-center gap-3 mt-2">
            {alert.repName && <span className="text-xs text-slate-400">Rep: {alert.repName}</span>}
            {alert.customerName && <span className="text-xs text-slate-400">Customer: {alert.customerName}</span>}
            <span className="text-xs text-slate-300">{timeAgo()}</span>
          </div>
        </div>
        <button
          onClick={() => onDismiss(alert.id)}
          className="h-6 w-6 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 flex-shrink-0"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};

export default AlertCard;
