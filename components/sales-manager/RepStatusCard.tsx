import React from 'react';
import { MapPin, ShoppingCart, Wallet, Route } from 'lucide-react';
import { RepStatus } from '../../types';

const STATUS_COLORS: Record<string, string> = {
  'Online – In Visit': 'bg-emerald-500',
  'Online – Travelling': 'bg-blue-500',
  'Online – Idle': 'bg-amber-400',
  'Offline': 'bg-slate-300',
};

const STATUS_TEXT: Record<string, string> = {
  'Online – In Visit': 'text-emerald-700',
  'Online – Travelling': 'text-blue-700',
  'Online – Idle': 'text-amber-700',
  'Offline': 'text-slate-500',
};

const STATUS_BG: Record<string, string> = {
  'Online – In Visit': 'bg-emerald-50 border-emerald-200',
  'Online – Travelling': 'bg-blue-50 border-blue-200',
  'Online – Idle': 'bg-amber-50 border-amber-200',
  'Offline': 'bg-slate-50 border-slate-200',
};

interface Props {
  rep: RepStatus;
  onClick?: () => void;
}

const RepStatusCard: React.FC<Props> = ({ rep, onClick }) => {
  const routePct = rep.routeProgress.total > 0
    ? Math.round((rep.routeProgress.visited / rep.routeProgress.total) * 100)
    : 0;

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-2xl border ${STATUS_BG[rep.status]} ${onClick ? 'cursor-pointer hover:shadow-md' : ''} transition-all`}
    >
      <div className="flex items-start gap-3">
        <img
          src={rep.repImage ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(rep.repName)}&background=e0e7ff&color=6366f1`}
          className="h-10 w-10 rounded-xl object-cover flex-shrink-0"
          alt={rep.repName}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-bold text-slate-800 truncate">{rep.repName}</p>
            <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_TEXT[rep.status]}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${STATUS_COLORS[rep.status]}`} />
              {rep.status}
            </span>
          </div>
          {rep.activeVisitCustomer && (
            <p className="text-xs text-slate-500 mt-0.5 truncate flex items-center gap-1">
              <MapPin className="h-3 w-3 flex-shrink-0" /> {rep.activeVisitCustomer}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-3">
        <div className="text-center">
          <p className="text-lg font-black text-slate-800">{rep.todayVisits}</p>
          <p className="text-xs text-slate-400">Visits</p>
        </div>
        <div className="text-center border-x border-white/60">
          <p className="text-lg font-black text-slate-800">{rep.todayOrders}</p>
          <p className="text-xs text-slate-400">Orders</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-black text-slate-800">£{rep.todayCollections > 0 ? rep.todayCollections.toFixed(0) : '0'}</p>
          <p className="text-xs text-slate-400">Collected</p>
        </div>
      </div>

      {rep.routeProgress.total > 0 && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="flex items-center gap-1"><Route className="h-3 w-3" /> Route</span>
            <span>{rep.routeProgress.visited}/{rep.routeProgress.total} stops</span>
          </div>
          <div className="h-1.5 bg-white/60 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${routePct}%` }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default RepStatusCard;
