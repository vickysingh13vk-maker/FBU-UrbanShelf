import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { CollectionAttempt, CollectionStatus } from '../../types';

const STATUS_CONFIG: Record<CollectionStatus, { icon: React.ReactNode; color: string; bg: string; border: string }> = {
  'Pending':        { icon: <Clock className="h-3.5 w-3.5" />,         color: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-100' },
  'Partially Paid': { icon: <AlertCircle className="h-3.5 w-3.5" />,   color: 'text-orange-600',  bg: 'bg-orange-50',  border: 'border-orange-100' },
  'Paid':           { icon: <CheckCircle className="h-3.5 w-3.5" />,   color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  'Disputed':       { icon: <AlertTriangle className="h-3.5 w-3.5" />, color: 'text-rose-600',    bg: 'bg-rose-50',    border: 'border-rose-100' },
  'Overdue':        { icon: <AlertCircle className="h-3.5 w-3.5" />,   color: 'text-rose-700',    bg: 'bg-rose-100',   border: 'border-rose-200' },
};

interface Props {
  attempt: CollectionAttempt;
  onUpdateStatus?: (id: string, status: CollectionStatus, amount?: number, notes?: string) => void;
  compact?: boolean;
}

const CollectionCard: React.FC<Props> = ({ attempt, onUpdateStatus, compact = false }) => {
  const [showLog, setShowLog] = useState(false);
  const [logAmount, setLogAmount] = useState('');
  const [logNotes, setLogNotes] = useState('');

  const cfg = STATUS_CONFIG[attempt.status];
  const outstanding = attempt.amountRequested - attempt.amountCollected;
  const pct = attempt.amountRequested > 0 ? Math.round((attempt.amountCollected / attempt.amountRequested) * 100) : 0;

  const handleLog = () => {
    const amt = parseFloat(logAmount);
    if (!amt || amt <= 0 || !onUpdateStatus) return;
    const newStatus: CollectionStatus = amt >= outstanding ? 'Paid' : 'Partially Paid';
    onUpdateStatus(attempt.id, newStatus, attempt.amountCollected + amt, logNotes || attempt.notes);
    setShowLog(false);
    setLogAmount('');
    setLogNotes('');
  };

  return (
    <div className={`p-3 rounded-xl border ${cfg.border} ${cfg.bg}`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <p className="text-xs font-bold text-slate-800 truncate">{attempt.customerName}</p>
          <p className="text-xs text-slate-500">{new Date(attempt.attemptDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
        </div>
        <span className={`flex items-center gap-1 text-xs font-bold ${cfg.color}`}>
          {cfg.icon}{attempt.status}
        </span>
      </div>

      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-slate-500">£{attempt.amountCollected.toFixed(2)} / £{attempt.amountRequested.toFixed(2)}</span>
        <span className="text-xs font-bold text-slate-700">{pct}%</span>
      </div>
      <div className="h-1.5 bg-white rounded-full overflow-hidden mb-2">
        <div className={`h-full rounded-full ${pct >= 100 ? 'bg-emerald-500' : 'bg-amber-400'}`} style={{ width: `${pct}%` }} />
      </div>

      {!compact && attempt.status !== 'Paid' && onUpdateStatus && (
        showLog ? (
          <div className="space-y-2 mt-2">
            <input type="number" value={logAmount} onChange={e => setLogAmount(e.target.value)}
              placeholder={`Amount (outstanding: £${outstanding.toFixed(2)})`} min="0" step="0.01"
              className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-300" />
            <input type="text" value={logNotes} onChange={e => setLogNotes(e.target.value)}
              placeholder="Notes (optional)"
              className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-300" />
            <div className="flex gap-2">
              <button onClick={handleLog} className="flex-1 py-1.5 bg-emerald-500 text-white text-xs font-bold rounded-lg">Log Payment</button>
              <button onClick={() => setShowLog(false)} className="px-3 py-1.5 border border-slate-200 text-slate-500 text-xs rounded-lg">Cancel</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowLog(true)}
            className="w-full py-1.5 mt-1 text-xs font-semibold text-emerald-700 bg-white border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors">
            Log Payment
          </button>
        )
      )}
      {attempt.promisedDate && attempt.status !== 'Paid' && (
        <p className="text-xs text-slate-400 mt-1">Promised: {new Date(attempt.promisedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
      )}
    </div>
  );
};

export default CollectionCard;
