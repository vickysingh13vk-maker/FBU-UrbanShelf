import React from 'react';
import { Territory, TerritoryPerformance } from '../../types';
import { MapPin, TrendingUp } from 'lucide-react';

interface Props {
  territory: Territory;
  performance?: TerritoryPerformance;
  onClick?: () => void;
}

const TerritoryCard: React.FC<Props> = ({ territory, performance, onClick }) => (
  <div
    onClick={onClick}
    className={`p-4 bg-white border border-slate-100 rounded-2xl ${onClick ? 'cursor-pointer hover:shadow-md' : ''} transition-all`}
  >
    <div className="flex items-start gap-3">
      <div className="h-10 w-10 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
        <MapPin className="h-5 w-5 text-indigo-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-slate-800 truncate">{territory.name}</p>
        <p className="text-xs text-slate-400">{territory.level} · {territory.assignedRepName ?? 'Unassigned'}</p>
      </div>
    </div>

    <div className="grid grid-cols-3 gap-2 mt-3">
      <div className="text-center">
        <p className="text-base font-black text-slate-800">{territory.customerCount}</p>
        <p className="text-xs text-slate-400">Customers</p>
      </div>
      <div className="text-center border-x border-slate-100">
        <p className="text-base font-black text-slate-800">{territory.activeCustomers}</p>
        <p className="text-xs text-slate-400">Active</p>
      </div>
      <div className="text-center">
        <p className="text-base font-black text-slate-800">£{(territory.monthlyRevenue / 1000).toFixed(1)}k</p>
        <p className="text-xs text-slate-400">Revenue</p>
      </div>
    </div>

    {performance && (
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-emerald-600">
        <TrendingUp className="h-3 w-3" />
        <span>{performance.visitsThisMonth} visits · {performance.ordersThisMonth} orders this month</span>
      </div>
    )}
  </div>
);

export default TerritoryCard;
