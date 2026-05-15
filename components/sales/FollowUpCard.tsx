import React from 'react';
import { Phone, MapPin, RefreshCw, CreditCard, Handshake, FlaskConical, AlertCircle, CheckCircle2, Clock, X } from 'lucide-react';
import { FollowUp, FollowUpType } from '../../types';

const TYPE_CONFIG: Record<FollowUpType, { icon: React.ReactNode; color: string; bg: string }> = {
  'Callback':             { icon: <Phone className="h-3.5 w-3.5" />,       color: 'text-blue-600',   bg: 'bg-blue-50' },
  'Payment Reminder':     { icon: <CreditCard className="h-3.5 w-3.5" />,  color: 'text-rose-600',   bg: 'bg-rose-50' },
  'Revisit':              { icon: <MapPin className="h-3.5 w-3.5" />,      color: 'text-indigo-600', bg: 'bg-indigo-50' },
  'Product Demo':         { icon: <FlaskConical className="h-3.5 w-3.5" />,color: 'text-violet-600', bg: 'bg-violet-50' },
  'Negotiation':          { icon: <Handshake className="h-3.5 w-3.5" />,   color: 'text-amber-600',  bg: 'bg-amber-50' },
  'Trial Follow-Up':      { icon: <RefreshCw className="h-3.5 w-3.5" />,   color: 'text-teal-600',   bg: 'bg-teal-50' },
  'Collection Follow-Up': { icon: <CreditCard className="h-3.5 w-3.5" />,  color: 'text-orange-600', bg: 'bg-orange-50' },
};

const PRIORITY_STYLES: Record<string, string> = {
  High:   'bg-rose-100 text-rose-600',
  Medium: 'bg-amber-100 text-amber-600',
  Low:    'bg-slate-100 text-slate-500',
};

interface Props {
  followUp: FollowUp;
  onComplete?: (id: string) => void;
  onDismiss?: (id: string) => void;
  compact?: boolean;
}

function formatDue(dueDate: string): { label: string; overdue: boolean } {
  const today = new Date().toISOString().split('T')[0];
  if (dueDate < today) return { label: `Overdue · ${new Date(dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`, overdue: true };
  if (dueDate === today) return { label: 'Due today', overdue: false };
  return { label: new Date(dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }), overdue: false };
}

const FollowUpCard: React.FC<Props> = ({ followUp, onComplete, onDismiss, compact = false }) => {
  const cfg = TYPE_CONFIG[followUp.type];
  const { label: dueLabel, overdue } = formatDue(followUp.dueDate);
  const customerLabel = followUp.customerName ?? followUp.leadName ?? '—';
  const isDone = followUp.status === 'Completed' || followUp.status === 'Cancelled';

  return (
    <div className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-all ${
      isDone    ? 'border-slate-100 bg-slate-50 opacity-50' :
      overdue   ? 'border-rose-100 bg-rose-50/60' :
                  'border-slate-100 bg-white'
    }`}>
      {/* Type icon */}
      <div className={`h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.bg} ${cfg.color}`}>
        {cfg.icon}
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          <p className="text-xs font-bold text-slate-800 truncate">{followUp.type}</p>
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none ${PRIORITY_STYLES[followUp.priority]}`}>
            {followUp.priority}
          </span>
        </div>
        <p className="text-xs font-medium text-slate-500 truncate">{customerLabel}</p>
        {!compact && followUp.notes && (
          <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{followUp.notes}</p>
        )}
        <div className="flex items-center gap-1 mt-1.5">
          {overdue ? (
            <span className="flex items-center gap-1 text-[11px] font-bold text-rose-600">
              <AlertCircle className="h-3 w-3" />{dueLabel}
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[11px] text-slate-400">
              <Clock className="h-3 w-3" />{dueLabel}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      {!isDone && (
        <div className="flex gap-1 flex-shrink-0">
          {onComplete && (
            <button onClick={() => onComplete(followUp.id)}
              className="h-8 w-8 flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
              title="Mark complete">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </button>
          )}
          {onDismiss && (
            <button onClick={() => onDismiss(followUp.id)}
              className="h-8 w-8 flex items-center justify-center rounded-xl bg-slate-100 text-slate-400 hover:bg-slate-200 transition-colors"
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
