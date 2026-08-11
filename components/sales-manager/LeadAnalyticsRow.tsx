import React from 'react';
import { LeadAnalytics } from '../../types';

interface Props { data: LeadAnalytics; onClick?: () => void; }

const LeadAnalyticsRow: React.FC<Props> = ({ data, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors ${onClick ? 'cursor-pointer' : ''}`}
  >
    <img
      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(data.repName)}&background=e0e7ff&color=6366f1`}
      className="h-9 w-9 rounded-xl object-cover flex-shrink-0"
      alt={data.repName}
    />
    <div className="flex-1 min-w-0">
      <p className="text-sm font-bold text-slate-800 truncate">{data.repName}</p>
      <p className="text-xs text-slate-400">{data.activeLeads} active · {data.stalledLeads} stalled</p>
    </div>
    <div className="text-right flex-shrink-0">
      <p className="text-sm font-black text-slate-800">{data.conversionRate}%</p>
      <p className="text-xs text-slate-400">conversion</p>
    </div>
    <div className="text-right flex-shrink-0">
      <p className="text-sm font-black text-indigo-600">£{(data.pipelineValue / 1000).toFixed(1)}k</p>
      <p className="text-xs text-slate-400">pipeline</p>
    </div>
  </div>
);

export default LeadAnalyticsRow;
