import React, { useState } from 'react'; // p5-touch
import { CheckSquare } from 'lucide-react';
import { Card } from '../components/ui';
import { useCRMOps } from '../context/CRMOpsContext';
import { useAuth } from '../context/AuthContext';
import ApprovalCard from '../components/crm-ops/ApprovalCard';
import { ApprovalStatus } from '../types';

type Filter = 'all' | ApprovalStatus;

const ApprovalQueue: React.FC = () => {
  const { approvals } = useCRMOps();
  const { user } = useAuth();
  const [filter, setFilter] = useState<Filter>('Pending');

  const isRep = user?.roleName === 'Sales Rep';
  const visible = isRep
    ? approvals.filter(a => a.requestedBy === user?.id)
    : approvals;

  const counts: Record<ApprovalStatus, number> = {
    Pending: visible.filter(a => a.status === 'Pending').length,
    Approved: visible.filter(a => a.status === 'Approved').length,
    Rejected: visible.filter(a => a.status === 'Rejected').length,
    Escalated: visible.filter(a => a.status === 'Escalated').length,
  };

  const displayed = filter === 'all' ? visible : visible.filter(a => a.status === filter);
  const sorted = [...displayed].sort((a, b) => b.requestedAt.localeCompare(a.requestedAt));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-slate-800">Approval Queue</h1>
        <p className="text-sm text-slate-500 mt-0.5">{counts.Pending} pending · {visible.length} total</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {([
          { key: 'Pending'  as ApprovalStatus, text: 'text-amber-700' },
          { key: 'Approved' as ApprovalStatus, text: 'text-emerald-700' },
          { key: 'Rejected' as ApprovalStatus, text: 'text-rose-700' },
          { key: 'Escalated'as ApprovalStatus, text: 'text-orange-700' },
        ]).map(s => (
          <Card key={s.key} padding="md" className="cursor-pointer hover:shadow-md transition-all"
            onClick={() => setFilter(s.key)}>
            <p className={`text-2xl font-black ${s.text}`}>{counts[s.key]}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.key}</p>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 rounded-xl p-1 gap-1 w-fit flex-wrap">
        {([
          { key: 'all' as Filter,       label: `All (${visible.length})` },
          { key: 'Pending' as Filter,   label: `Pending (${counts.Pending})` },
          { key: 'Approved' as Filter,  label: `Approved (${counts.Approved})` },
          { key: 'Rejected' as Filter,  label: `Rejected (${counts.Rejected})` },
        ]).map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${filter === f.key ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {sorted.length === 0 ? (
        <Card padding="lg" className="text-center py-16">
          <CheckSquare className="h-10 w-10 text-slate-200 mx-auto mb-3" />
          <p className="text-sm text-slate-400">No approvals in this category</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {sorted.map(a => <ApprovalCard key={a.id} approval={a} />)}
        </div>
      )}
    </div>
  );
};

export default ApprovalQueue;
