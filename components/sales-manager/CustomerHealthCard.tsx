import React from 'react';
import { CustomerHealth } from '../../types';
import CustomerHealthBadge from './CustomerHealthBadge';
import { AlertCircle, Clock, Wallet } from 'lucide-react';

interface Props {
  health: CustomerHealth;
  onClick?: () => void;
}

const CustomerHealthCard: React.FC<Props> = ({ health, onClick }) => {
  const scoreColor = health.healthScore >= 70 ? 'text-emerald-600' :
    health.healthScore >= 50 ? 'text-amber-600' :
    health.healthScore >= 30 ? 'text-orange-600' : 'text-rose-600';

  const scoreBg = health.healthScore >= 70 ? 'bg-emerald-50' :
    health.healthScore >= 50 ? 'bg-amber-50' :
    health.healthScore >= 30 ? 'bg-orange-50' : 'bg-rose-50';

  return (
    <div
      onClick={onClick}
      className={`p-4 bg-white border border-slate-100 rounded-2xl ${onClick ? 'cursor-pointer hover:shadow-md' : ''} transition-all`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-800 truncate">{health.customerName}</p>
          <p className="text-xs text-slate-400 mt-0.5">Rep: {health.assignedRepName}</p>
        </div>
        <div className={`h-12 w-12 ${scoreBg} rounded-xl flex flex-col items-center justify-center flex-shrink-0`}>
          <p className={`text-sm font-black ${scoreColor}`}>{health.healthScore}</p>
          <p className="text-xs text-slate-400">score</p>
        </div>
      </div>

      <div className="mt-3">
        <CustomerHealthBadge state={health.healthState} />
      </div>

      <div className="grid grid-cols-3 gap-2 mt-3">
        {health.lastVisitDaysAgo !== undefined && (
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Clock className="h-3 w-3 flex-shrink-0" />
            <span>{health.lastVisitDaysAgo}d visit</span>
          </div>
        )}
        {health.overdueAmount > 0 && (
          <div className="flex items-center gap-1 text-xs text-rose-500">
            <Wallet className="h-3 w-3 flex-shrink-0" />
            <span>£{health.overdueAmount.toFixed(0)} overdue</span>
          </div>
        )}
        {health.openFollowUps > 0 && (
          <div className="flex items-center gap-1 text-xs text-amber-600">
            <AlertCircle className="h-3 w-3 flex-shrink-0" />
            <span>{health.openFollowUps} FU</span>
          </div>
        )}
      </div>

      {health.flags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {health.flags.slice(0, 3).map(f => (
            <span key={f} className="text-xs px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded-md">{f}</span>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerHealthCard;
