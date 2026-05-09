import React, { useState } from 'react';
import { Bell, CheckCircle2 } from 'lucide-react';
import { Card } from '../../components/ui';
import { useSalesManager } from '../../context/SalesManagerContext';
import AlertCard from '../../components/sales-manager/AlertCard';
import { AlertSeverity } from '../../types';

type Filter = 'all' | AlertSeverity;

const SMAlerts: React.FC = () => {
  const { alerts, dismissAlert, markAlertRead } = useSalesManager();
  const [filter, setFilter] = useState<Filter>('all');

  const active = alerts.filter(a => !a.dismissed);

  const counts: Record<AlertSeverity, number> = {
    Critical: active.filter(a => a.severity === 'Critical').length,
    Warning: active.filter(a => a.severity === 'Warning').length,
    Info: active.filter(a => a.severity === 'Info').length,
  };

  const unreadCount = active.filter(a => !a.read).length;

  const filtered = filter === 'all' ? active : active.filter(a => a.severity === filter);
  const sorted = [...filtered].sort((a, b) => {
    const rank = { Critical: 0, Warning: 1, Info: 2 };
    return rank[a.severity] - rank[b.severity];
  });

  const FILTERS: { key: Filter; label: string }[] = [
    { key: 'all', label: `All (${active.length})` },
    { key: 'Critical', label: `Critical (${counts.Critical})` },
    { key: 'Warning', label: `Warning (${counts.Warning})` },
    { key: 'Info', label: `Info (${counts.Info})` },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Operational Alerts</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {active.length} active · {unreadCount} unread
          </p>
        </div>
        {unreadCount === 0 && active.length > 0 && (
          <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold">
            <CheckCircle2 className="h-4 w-4" /> All read
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { sev: 'Critical' as AlertSeverity, bg: 'bg-rose-50', text: 'text-rose-700' },
          { sev: 'Warning' as AlertSeverity, bg: 'bg-amber-50', text: 'text-amber-700' },
          { sev: 'Info' as AlertSeverity, bg: 'bg-blue-50', text: 'text-blue-700' },
        ].map(s => (
          <Card key={s.sev} padding="md" className="cursor-pointer hover:shadow-md transition-all"
            onClick={() => setFilter(s.sev)}>
            <p className={`text-2xl font-black ${s.text}`}>{counts[s.sev]}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.sev}</p>
          </Card>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex bg-slate-100 rounded-xl p-1 gap-1 w-fit flex-wrap">
        {FILTERS.map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${filter === f.key ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Alert list */}
      {sorted.length === 0 ? (
        <Card padding="lg" className="text-center py-16">
          <Bell className="h-10 w-10 text-slate-200 mx-auto mb-3" />
          <p className="text-sm text-slate-400">No alerts in this category</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {sorted.map(a => (
            <AlertCard key={a.id} alert={a} onDismiss={dismissAlert} onRead={markAlertRead} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SMAlerts;
