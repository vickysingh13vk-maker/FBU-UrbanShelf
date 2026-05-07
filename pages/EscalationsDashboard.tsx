import React, { useState } from 'react'; // p5-touch
import { AlertTriangle, Plus } from 'lucide-react';
import { Card } from '../components/ui';
import { useCRMOps } from '../context/CRMOpsContext';
import { useAuth } from '../context/AuthContext';
import EscalationCard from '../components/crm-ops/EscalationCard';
import { EscalationStatus } from '../types';

type Filter = 'all' | 'open' | EscalationStatus;

const EscalationsDashboard: React.FC = () => {
  const { escalations, getCriticalEscalations } = useCRMOps();
  const { user } = useAuth();
  const [filter, setFilter] = useState<Filter>('all');

  const isRep = user?.roleName === 'Sales Rep';
  const visible = isRep
    ? escalations.filter(e => e.repId === user?.id)
    : escalations;

  const open = visible.filter(e => e.status !== 'Closed' && e.status !== 'Resolved');
  const critical = getCriticalEscalations();

  const statusCounts = (['Created', 'Assigned', 'Reviewed', 'Resolved', 'Closed'] as EscalationStatus[]).reduce(
    (acc, s) => ({ ...acc, [s]: visible.filter(e => e.status === s).length }), {} as Record<EscalationStatus, number>
  );

  const displayed = filter === 'all' ? visible
    : filter === 'open' ? open
    : visible.filter(e => e.status === filter);

  const sorted = [...displayed].sort((a, b) => {
    const rank = { Critical: 0, High: 1, Medium: 2, Low: 3 };
    return rank[a.priority] - rank[b.priority];
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Escalations</h1>
          <p className="text-sm text-slate-500 mt-0.5">{open.length} open · {critical.length} critical</p>
        </div>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {(['Created', 'Assigned', 'Reviewed', 'Resolved', 'Closed'] as EscalationStatus[]).map(s => {
          const colors: Record<EscalationStatus, string> = {
            Created: 'text-rose-700', Assigned: 'text-orange-700',
            Reviewed: 'text-amber-700', Resolved: 'text-emerald-700', Closed: 'text-slate-500'
          };
          return (
            <Card key={s} padding="md" className="cursor-pointer hover:shadow-md transition-all"
              onClick={() => setFilter(s)}>
              <p className={`text-2xl font-black ${colors[s]}`}>{statusCounts[s]}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s}</p>
            </Card>
          );
        })}
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'all' as Filter, label: `All (${visible.length})` },
          { key: 'open' as Filter, label: `Open (${open.length})` },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${filter === f.key ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      {sorted.length === 0 ? (
        <Card padding="lg" className="text-center py-16">
          <AlertTriangle className="h-10 w-10 text-slate-200 mx-auto mb-3" />
          <p className="text-sm text-slate-400">No escalations found</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {sorted.map(e => <EscalationCard key={e.id} escalation={e} />)}
        </div>
      )}
    </div>
  );
};

export default EscalationsDashboard;
