import React from 'react';
import { Phone, MapPin, RefreshCw, CreditCard, Handshake, FlaskConical, AlertCircle, CheckCircle, Clock, X } from 'lucide-react';
import { FollowUp, FollowUpType } from '../../types';

const TYPE_CONFIG: Record<FollowUpType, { icon: React.ReactNode; color: string; bg: string }> = {
  'Callback':            { icon: <Phone className="h-3.5 w-3.5" />,      color: 'text-blue-600',    bg: 'bg-blue-50' },
  'Payment Reminder':    { icon: <CreditCard className="h-3.5 w-3.5" />, color: 'text-rose-600',    bg: 'bg-rose-50' },
  'Revisit':             { icon: <MapPin className="h-3.5 w-3.5" />,     color: 'text-indigo-600',  bg: 'bg-indigo-50' },
  'Product Demo':        { icon: <FlaskConical className="h-3.5 w-3.5" />,color: 'text-violet-600', bg: 'bg-violet-50' },
  'Negotiation':         { icon: <Handshake className="h-3.5 w-3.5" />,  color: 'text-amber-600',   bg: 'bg-amber-50' },
  'Trial Follow-Up':     { icon: <RefreshCw className="h-3.5 w-3.5" />,  color: 'text-teal-600',    bg: 'bg-teal-50' },
  'Collection Follow-Up':{ icon: <CreditCard className="h-3.5 w-3.5" />, color: 'text-orange-600',  bg: 'bg-orange-50' },
};

const PRIORITY_DOT: Record<string, string> = {
  High: 'bg-rose-500', Medium: 'bg-amber-400', Low: 'bg-slate-300',
};

interface Props {
  followUp: FollowUp;
  onComplete?: (id: string) => void;
  onDismiss?: (id: string) => void;
  compact?: boolean;
}

function formatDue(dueDate: string): { label: string; overdue: boolean } {
  const today = new Date().toISOString().split('T')[0];
  if (dueDate < today) return { label: `Overdue (${new Date(dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })})`, overdue: true };
  if (dueDate === today) return { label: 'Due today', overdue: false };
  return { label: new Date(dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }), overdue: false };
}

const FollowUpCard: React.FC<Props> = ({ followUp, onComplete, onDismiss, compact = false }) => {
  const cfg = TYPE_CONFIG[followUp.type];
  const { label: dueLabel, overdue } = formatDue(followUp.dueDate);
  const customerLabel = followUp.customerName ?? followUp.leadName ?? '—';
  const isDone = followUp.status === 'Completed' || followUp.status === 'Cancelled';

  return (
    <div className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
      isDone ? 'border-slate-100 bg-slate-50 opacity-60' :
      overdue ? 'border-rose-100 bg-rose-50' :
      'border-slate-100 bg-white'
    }`}>
      <div className={`h-8 w-8 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.bg} ${cfg.color}`}>
        {cfg.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <div className={`h-2 w-2 rounded-full flex-shrink-0 ${PRIORITY_DOT[followUp.priority]}`} />
          <p className="text-xs font-bold text-slate-700 truncate">{followUp.type}</p>
        </div>
        <p className="text-xs text-slate-500 truncate">{customerLabel}</p>
        {!compact && <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{followUp.notes}</p>}
        <div className="flex items-center gap-1 mt-1">
          {overdue
            ? <span className="flex items-center gap-1 text-xs font-semibold text-rose-600"><AlertCircle className="h-3 w-3" />{dueLabel}</span>
            : <span className="flex items-center gap-1 text-xs text-slate-400"><Clock className="h-3 w-3" />{dueLabel}</span>
          }
        </div>
      </div>
      {!isDone && (
        <div className="flex gap-1 flex-shrink-0">
          {onComplete && (
            <button onClick={() => onComplete(followUp.id)}
              className="h-7 w-7 flex items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
              title="Mark complete">
              <CheckCircle className="h-3.5 w-3.5" />
            </button>
          )}
          {onDismiss && (
            <button onClick={() => onDismiss(followUp.id)}
              className="h-7 w-7 flex items-center justify-center rounded-lg bg-slate-100 text-slate-400 hover:bg-slate-200 transition-colors"
              title="Dismiss">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FollowUpCard;
