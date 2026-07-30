import React from 'react';
import { CheckCircle, MapPin, ShoppingCart, Wallet, Users, Clock } from 'lucide-react';
import { SessionSummary } from '../../types';

function fmtDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
}

interface Props {
  summary: SessionSummary;
  onClose: () => void;
}

const SessionSummaryModal: React.FC<Props> = ({ summary, onClose }) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
      <div className="p-6 text-center border-b border-slate-100">
        <div className="h-14 w-14 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <CheckCircle className="h-7 w-7 text-emerald-600" />
        </div>
        <h3 className="text-lg font-black text-slate-800">Session Complete</h3>
        <p className="text-sm text-slate-400 mt-1">Great work today!</p>
      </div>
      <div className="p-6 grid grid-cols-2 gap-3">
        {[
          { icon: <Clock className="h-4 w-4 text-slate-400" />,       label: 'Duration',    value: fmtDuration(summary.duration) },
          { icon: <MapPin className="h-4 w-4 text-indigo-400" />,     label: 'Visits',      value: summary.visits },
          { icon: <ShoppingCart className="h-4 w-4 text-blue-400" />, label: 'Orders',      value: summary.orders },
          { icon: <Wallet className="h-4 w-4 text-emerald-400" />,    label: 'Collections', value: `£${summary.collections.toLocaleString()}` },
          { icon: <Wallet className="h-4 w-4 text-green-500" />,      label: 'Revenue',     value: `£${summary.revenue.toFixed(2)}` },
          { icon: <Users className="h-4 w-4 text-violet-400" />,      label: 'Leads Added', value: summary.leadsAdded },
        ].map(item => (
          <div key={item.label} className="bg-slate-50 rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-1">{item.icon}<span className="text-xs text-slate-500">{item.label}</span></div>
            <p className="text-lg font-black text-slate-800">{item.value}</p>
          </div>
        ))}
      </div>
      <div className="px-6 pb-6">
        <button
          onClick={onClose}
          className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  </div>
);

export default SessionSummaryModal;
