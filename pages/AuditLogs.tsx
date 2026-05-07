import React, { useState } from 'react';
import { Shield, ChevronDown, ChevronRight } from 'lucide-react';
import { Card } from '../components/ui';
import { useCRMOps } from '../context/CRMOpsContext';
import { AuditAction } from '../types';

const ACTION_LABELS: Record<AuditAction, string> = {
  'customer.update': 'Customer Updated',
  'lead.stage-change': 'Lead Stage Changed',
  'lead.assign': 'Lead Assigned',
  'payment.record': 'Payment Recorded',
  'approval.create': 'Approval Created',
  'approval.review': 'Approval Reviewed',
  'collection.update': 'Collection Updated',
  'escalation.create': 'Escalation Created',
  'escalation.update': 'Escalation Updated',
  'customer.lifecycle-change': 'Lifecycle Changed',
  'document.upload': 'Document Uploaded',
};

const ACTION_COLORS: Record<string, string> = {
  'customer': 'bg-blue-50 text-blue-700',
  'lead': 'bg-violet-50 text-violet-700',
  'payment': 'bg-emerald-50 text-emerald-700',
  'approval': 'bg-amber-50 text-amber-700',
  'collection': 'bg-rose-50 text-rose-700',
  'escalation': 'bg-orange-50 text-orange-700',
  'document': 'bg-slate-50 text-slate-700',
};

const AuditLogs: React.FC = () => {
  const { getRecentAudit } = useCRMOps();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const logs = getRecentAudit(50);
  const filtered = logs.filter(l =>
    l.entityName.toLowerCase().includes(search.toLowerCase()) ||
    l.performedByName.toLowerCase().includes(search.toLowerCase()) ||
    ACTION_LABELS[l.action]?.toLowerCase().includes(search.toLowerCase())
  );

  const timeAgo = (ts: string) => {
    const diff = Date.now() - new Date(ts).getTime();
    const h = Math.floor(diff / 3600000);
    if (h < 1) return `${Math.floor(diff / 60000)}m ago`;
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  const getColor = (action: AuditAction) => {
    const prefix = action.split('.')[0];
    return ACTION_COLORS[prefix] ?? 'bg-slate-50 text-slate-700';
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-slate-800">Audit Logs</h1>
        <p className="text-sm text-slate-500 mt-0.5">{filtered.length} entries</p>
      </div>

      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search by entity, user, or action..."
        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      {/* Log entries */}
      {filtered.length === 0 ? (
        <Card padding="lg" className="text-center py-16">
          <Shield className="h-10 w-10 text-slate-200 mx-auto mb-3" />
          <p className="text-sm text-slate-400">No audit entries found</p>
        </Card>
      ) : (
        <Card padding="md">
          <div className="divide-y divide-slate-50">
            {filtered.map(log => (
              <div key={log.id}>
                <button
                  onClick={() => setExpanded(expanded === log.id ? null : log.id)}
                  className="w-full flex items-center gap-3 py-3 hover:bg-slate-50 rounded-xl px-2 transition-colors text-left"
                >
                  <div className="flex-shrink-0">
                    {expanded === log.id
                      ? <ChevronDown className="h-4 w-4 text-slate-400" />
                      : <ChevronRight className="h-4 w-4 text-slate-400" />
                    }
                  </div>
                  <span className={`px-2 py-0.5 rounded-md text-xs font-semibold flex-shrink-0 ${getColor(log.action)}`}>
                    {ACTION_LABELS[log.action]}
                  </span>
                  <span className="text-sm font-semibold text-slate-800 truncate flex-1">{log.entityName}</span>
                  <span className="text-xs text-slate-400 flex-shrink-0">{log.performedByName}</span>
                  <span className="text-xs text-slate-300 flex-shrink-0">{timeAgo(log.timestamp)}</span>
                </button>
                {expanded === log.id && (
                  <div className="ml-9 pb-3 px-2 space-y-2 text-xs text-slate-600">
                    {log.note && <p className="italic text-slate-500">"{log.note}"</p>}
                    {log.oldValue && (
                      <div className="bg-rose-50 rounded-lg p-2">
                        <p className="font-semibold text-rose-700 mb-1">Before</p>
                        <pre className="text-xs text-rose-600 overflow-auto">{JSON.stringify(log.oldValue, null, 2)}</pre>
                      </div>
                    )}
                    {log.newValue && (
                      <div className="bg-emerald-50 rounded-lg p-2">
                        <p className="font-semibold text-emerald-700 mb-1">After</p>
                        <pre className="text-xs text-emerald-600 overflow-auto">{JSON.stringify(log.newValue, null, 2)}</pre>
                      </div>
                    )}
                    {(log.lat !== undefined) && (
                      <p className="text-slate-400">GPS: {log.lat?.toFixed(4)}, {log.lng?.toFixed(4)}</p>
                    )}
                    <p className="text-slate-400">{new Date(log.timestamp).toLocaleString('en-GB')}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default AuditLogs;
