import React from 'react';
import { ProductivityMetrics } from '../../types';

interface Props {
  metrics: ProductivityMetrics;
}

const ProductivityWidget: React.FC<Props> = ({ metrics }) => {
  const completionPct = metrics.visitsPlanned > 0
    ? Math.round((metrics.visitsCompleted / metrics.visitsPlanned) * 100) : 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {[
        { label: 'Visits Done', value: `${metrics.visitsCompleted}/${metrics.visitsPlanned}`, sub: `${completionPct}% complete`, color: 'text-indigo-600' },
        { label: 'Avg Duration', value: `${metrics.avgVisitDurationMinutes}m`, sub: 'per visit', color: 'text-blue-600' },
        { label: 'Collections', value: `£${metrics.collectionsRecovered.toFixed(0)}`, sub: 'recovered today', color: 'text-emerald-600' },
        { label: 'Follow-Up Rate', value: `${metrics.followUpCompletionRate}%`, sub: 'completed', color: 'text-amber-600' },
      ].map(m => (
        <div key={m.label} className="p-3 bg-white rounded-xl border border-slate-100">
          <p className={`text-xl font-black ${m.color}`}>{m.value}</p>
          <p className="text-xs font-semibold text-slate-600 mt-0.5">{m.label}</p>
          <p className="text-xs text-slate-400">{m.sub}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductivityWidget;
