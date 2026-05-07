import React from 'react';
import { Target } from 'lucide-react';
import { Card } from '../../components/ui';
import { useSalesManager } from '../../context/SalesManagerContext';
import LeadAnalyticsRow from '../../components/sales-manager/LeadAnalyticsRow';

const SMLeads: React.FC = () => {
  const { leadAnalytics } = useSalesManager();

  const totalActive = leadAnalytics.reduce((s, r) => s + r.activeLeads, 0);
  const totalStalled = leadAnalytics.reduce((s, r) => s + r.stalledLeads, 0);
  const totalPipeline = leadAnalytics.reduce((s, r) => s + r.pipelineValue, 0);
  const totalConverted = leadAnalytics.reduce((s, r) => s + r.convertedThisMonth, 0);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-slate-800">Leads Pipeline</h1>
        <p className="text-sm text-slate-500 mt-0.5">Team-wide lead tracking and conversion analytics</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Active Leads', value: totalActive, color: 'text-indigo-600' },
          { label: 'Stalled', value: totalStalled, color: 'text-amber-600' },
          { label: 'Converted (month)', value: totalConverted, color: 'text-emerald-600' },
          { label: 'Pipeline Value', value: `£${(totalPipeline / 1000).toFixed(1)}k`, color: 'text-slate-800' },
        ].map(s => (
          <Card key={s.label} padding="md">
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Per-rep analytics */}
      <Card padding="md">
        <h3 className="text-sm font-bold text-slate-700 mb-3">Rep Lead Performance</h3>
        <div className="divide-y divide-slate-50">
          {leadAnalytics.map(d => <LeadAnalyticsRow key={d.repId} data={d} />)}
        </div>
        {leadAnalytics.length === 0 && (
          <div className="text-center py-10">
            <Target className="h-8 w-8 text-slate-200 mx-auto mb-2" />
            <p className="text-sm text-slate-400">No lead data available</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default SMLeads;
