import React, { useState } from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';
import { Card } from '../../components/ui';
import { useSalesManager } from '../../context/SalesManagerContext';
import PerformanceBar from '../../components/sales-manager/PerformanceBar';
import { PeriodType } from '../../types';

const SMAnalytics: React.FC = () => {
  const { repPerformance, teamAnalytics } = useSalesManager();
  const [period, setPeriod] = useState<PeriodType>('daily');

  const periodReps = repPerformance.filter(p => p.period === period);

  const totals = periodReps.reduce((acc, r) => ({
    visits: acc.visits + r.visitsCompleted,
    revenue: acc.revenue + r.revenueGenerated,
    collections: acc.collections + r.collectionsRecovered,
    orders: acc.orders + r.ordersCreated,
  }), { visits: 0, revenue: 0, collections: 0, orders: 0 });

  const PERIODS: { key: PeriodType; label: string }[] = [
    { key: 'daily', label: 'Today' },
    { key: 'weekly', label: 'This Week' },
    { key: 'monthly', label: 'This Month' },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Analytics</h1>
          <p className="text-sm text-slate-500 mt-0.5">Execution performance across the team</p>
        </div>
        <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
          {PERIODS.map(p => (
            <button key={p.key} onClick={() => setPeriod(p.key)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${period === p.key ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Team totals */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Visits', value: totals.visits, icon: <TrendingUp className="h-4 w-4 text-indigo-500" />, bg: 'bg-indigo-50' },
          { label: 'Total Orders', value: totals.orders, icon: <BarChart3 className="h-4 w-4 text-violet-500" />, bg: 'bg-violet-50' },
          { label: 'Total Revenue', value: `£${totals.revenue.toLocaleString()}`, icon: <TrendingUp className="h-4 w-4 text-emerald-500" />, bg: 'bg-emerald-50' },
          { label: 'Collections', value: `£${totals.collections.toFixed(0)}`, icon: <TrendingUp className="h-4 w-4 text-amber-500" />, bg: 'bg-amber-50' },
        ].map(s => (
          <Card key={s.label} padding="md">
            <div className={`h-8 w-8 ${s.bg} rounded-lg flex items-center justify-center mb-2`}>{s.icon}</div>
            <p className="text-xl font-black text-slate-800">{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Per-rep performance */}
      <div className="space-y-4">
        {periodReps.map(rep => (
          <Card key={rep.repId} padding="md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(rep.repName)}&background=e0e7ff&color=6366f1`}
                  className="h-9 w-9 rounded-xl object-cover"
                  alt={rep.repName}
                />
                <div>
                  <p className="text-sm font-bold text-slate-800">{rep.repName}</p>
                  <p className="text-xs text-slate-400">{rep.periodLabel}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-indigo-600">{rep.customersCovered} customers</p>
                <p className="text-xs text-slate-400">{rep.productiveHours.toFixed(1)}h productive</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <PerformanceBar label="Visits" value={rep.visitsCompleted} target={rep.visitsTarget} />
              <PerformanceBar label="Revenue" value={rep.revenueGenerated} target={rep.revenueTarget} prefix="£" colorClass="bg-emerald-500" />
              <PerformanceBar label="Follow-Up Rate" value={Math.round(rep.followUpCompletionRate)} target={100} suffix="%" colorClass="bg-amber-500" />
              <PerformanceBar label="Lead Conversion" value={Math.round(rep.leadConversionRate)} target={100} suffix="%" colorClass="bg-violet-500" />
            </div>
          </Card>
        ))}
      </div>

      {periodReps.length === 0 && (
        <Card padding="lg" className="text-center py-16">
          <BarChart3 className="h-10 w-10 text-slate-200 mx-auto mb-3" />
          <p className="text-sm text-slate-400">No performance data for this period</p>
        </Card>
      )}
    </div>
  );
};

export default SMAnalytics;
