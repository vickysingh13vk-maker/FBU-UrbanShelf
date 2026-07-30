import React, { useState } from 'react';
import { Users, Activity, Clock, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from '../../components/ui';
import { useSalesManager } from '../../context/SalesManagerContext';
import RepStatusCard from '../../components/sales-manager/RepStatusCard';
import PerformanceBar from '../../components/sales-manager/PerformanceBar';

type Filter = 'all' | 'online' | 'offline';

const SMTeam: React.FC = () => {
  const { repStatuses, repPerformance } = useSalesManager();
  const navigate = useNavigate();
  const [filter,        setFilter]  = useState<Filter>('all');
  const [selectedPeriod]            = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const FILTER_LABELS: Record<Filter, string> = {
    all:     `All (${repStatuses.length})`,
    online:  `Online (${repStatuses.filter(r => r.status !== 'Offline').length})`,
    offline: `Offline (${repStatuses.filter(r => r.status === 'Offline').length})`,
  };

  const filtered = repStatuses.filter(r => {
    if (filter === 'online')  return r.status !== 'Offline';
    if (filter === 'offline') return r.status === 'Offline';
    return true;
  });

  const goToProfile = (repId: string) => navigate(`/sales-manager/team/${repId}`);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-slate-800">Team Monitoring</h1>
        <p className="text-sm text-slate-500 mt-0.5">Live field activity and performance · click rep to view full profile</p>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Reps', value: repStatuses.length,                                                icon: <Users    className="h-4 w-4 text-slate-500" />,   bg: 'bg-slate-50' },
          { label: 'Online',     value: repStatuses.filter(r => r.status !== 'Offline').length,            icon: <Activity className="h-4 w-4 text-emerald-500" />, bg: 'bg-emerald-50' },
          { label: 'In Visit',   value: repStatuses.filter(r => r.status === 'Online – In Visit').length,  icon: <Activity className="h-4 w-4 text-blue-500" />,   bg: 'bg-blue-50' },
          { label: 'Idle',       value: repStatuses.filter(r => r.status === 'Online – Idle').length,      icon: <Clock    className="h-4 w-4 text-amber-500" />,   bg: 'bg-amber-50' },
        ].map(s => (
          <Card key={s.label} padding="md">
            <div className={`h-8 w-8 ${s.bg} rounded-lg flex items-center justify-center mb-2`}>{s.icon}</div>
            <p className="text-2xl font-black text-slate-800">{s.value}</p>
            <p className="text-xs text-slate-500">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex bg-slate-100 rounded-xl p-1 gap-1 w-fit">
        {(['all', 'online', 'offline'] as Filter[]).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors capitalize ${filter === f ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>
            {FILTER_LABELS[f]}
          </button>
        ))}
      </div>

      {/* Rep Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(rep => {
          const perf = repPerformance.find(p => p.repId === rep.repId && p.period === selectedPeriod);
          return (
            <div key={rep.repId} className="space-y-3">
              <RepStatusCard rep={rep} onClick={() => goToProfile(rep.repId)} />
              {perf && (
                <Card padding="md">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Today's Targets</p>
                  <div className="space-y-3">
                    <PerformanceBar label="Visits"         value={perf.visitsCompleted}                     target={perf.visitsTarget} />
                    <PerformanceBar label="Revenue"        value={perf.revenueGenerated}                    target={perf.revenueTarget} prefix="£" colorClass="bg-emerald-500" />
                    <PerformanceBar label="Follow-Up Rate" value={Math.round(perf.followUpCompletionRate)}  target={100}               suffix="%" colorClass="bg-amber-500" />
                  </div>
                </Card>
              )}
              <Button variant="outline" size="sm" className="w-full" onClick={() => goToProfile(rep.repId)}>
                <UserCircle className="h-4 w-4 mr-1.5" />
                View Full Profile
              </Button>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <Card padding="lg" className="text-center py-16">
          <Users className="h-10 w-10 text-slate-200 mx-auto mb-3" />
          <p className="text-sm text-slate-400">No reps match this filter</p>
        </Card>
      )}
    </div>
  );
};

export default SMTeam;
