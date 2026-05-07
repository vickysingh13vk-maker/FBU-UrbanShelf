import React from 'react';
import { CRMNotification } from '../../types';
import { useNotifications } from '../../context/NotificationContext';
import { Bell, AlertTriangle, Info, Clock, X } from 'lucide-react';

const PRIORITY_CONFIG = {
  Critical: { border: 'border-rose-200',  dot: 'bg-rose-500',   badge: 'bg-rose-100 text-rose-700'   },
  Warning:  { border: 'border-amber-200', dot: 'bg-amber-400',  badge: 'bg-amber-100 text-amber-700' },
  Info:     { border: 'border-slate-100', dot: 'bg-blue-400',   badge: 'bg-blue-100 text-blue-700'   },
};

const TYPE_ICONS: Record<string, React.ReactNode> = {
  'overdue-payment':   <AlertTriangle className="h-4 w-4 text-rose-500" />,
  'inactive-customer': <AlertTriangle className="h-4 w-4 text-orange-500" />,
  'missed-visit':      <AlertTriangle className="h-4 w-4 text-amber-500" />,
  'approval-required': <AlertTriangle className="h-4 w-4 text-rose-500" />,
  'task-overdue':      <Clock className="h-4 w-4 text-amber-500" />,
  'collection-due':    <Clock className="h-4 w-4 text-orange-500" />,
  'follow-up-reminder':<Clock className="h-4 w-4 text-blue-500" />,
  'lead-stale':        <Info className="h-4 w-4 text-blue-500" />,
};

interface Props { notification: CRMNotification; compact?: boolean; }

const NotificationCard: React.FC<Props> = ({ notification: n, compact }) => {
  const { markRead, dismiss } = useNotifications();
  const cfg = PRIORITY_CONFIG[n.priority];

  const timeAgo = () => {
    const diff = Date.now() - new Date(n.createdAt).getTime();
    const h = Math.floor(diff / 3600000);
    if (h < 1) return `${Math.floor(diff / 60000)}m ago`;
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  return (
    <div
      onClick={() => !n.read && markRead(n.id)}
      className={`flex items-start gap-3 p-3 rounded-2xl border ${cfg.border} ${!n.read ? 'bg-white' : 'bg-slate-50/50'} transition-all ${!n.read ? 'cursor-pointer hover:shadow-sm' : ''}`}
    >
      <div className="relative flex-shrink-0 mt-0.5">
        {TYPE_ICONS[n.type] ?? <Bell className="h-4 w-4 text-slate-400" />}
        {!n.read && <span className={`absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full ${cfg.dot}`} />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className={`text-sm font-bold ${n.read ? 'text-slate-500' : 'text-slate-800'} truncate`}>{n.title}</p>
          <span className={`px-1.5 py-0.5 rounded-full text-xs font-semibold flex-shrink-0 ${cfg.badge}`}>{n.priority}</span>
        </div>
        {!compact && <p className="text-xs text-slate-500 mt-0.5">{n.body}</p>}
        <div className="flex items-center gap-2 mt-1">
          {n.linkedEntityName && <span className="text-xs text-indigo-500">{n.linkedEntityName}</span>}
          <span className="text-xs text-slate-300">{timeAgo()}</span>
        </div>
      </div>
      <button onClick={e => { e.stopPropagation(); dismiss(n.id); }}
        className="h-6 w-6 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 flex-shrink-0">
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};

export default NotificationCard;
