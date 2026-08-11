import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import { Card, Modal, Button } from '../../components/ui';
import { useSalesManager } from '../../context/SalesManagerContext';
import { useAuth } from '../../context/AuthContext';
import TerritoryCard from '../../components/sales-manager/TerritoryCard';
import { Territory } from '../../types';

const SMTerritories: React.FC = () => {
  const { territories, territoryPerformance, getRepsForManager, assignTerritory } = useSalesManager();
  const { user } = useAuth();
  const myReps = getRepsForManager(user?.id ?? '');
  const [selected, setSelected] = useState<Territory | null>(null);

  const assigned = territories.filter(t => t.assignedRepId);
  const unassigned = territories.filter(t => !t.assignedRepId);
  const totalRevenue = territories.reduce((s, t) => s + t.monthlyRevenue, 0);

  const liveSelected = selected ? territories.find(t => t.id === selected.id) ?? selected : null;

  const handleAssign = (repId: string) => {
    if (!liveSelected) return;
    const rep = myReps.find(r => r.id === repId);
    if (!rep) return;
    assignTerritory(liveSelected.id, rep.id, rep.name);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-slate-800">Territories</h1>
        <p className="text-sm text-slate-500 mt-0.5">{territories.length} territories · {assigned.length} assigned</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Territories', value: territories.length },
          { label: 'Assigned', value: assigned.length },
          { label: 'Unassigned', value: unassigned.length },
          { label: 'Total Monthly Rev', value: `£${(totalRevenue / 1000).toFixed(0)}k` },
        ].map(s => (
          <Card key={s.label} padding="md">
            <p className="text-2xl font-black text-slate-800">{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Territory Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {territories.map(t => {
          const perf = territoryPerformance.find(p => p.territoryId === t.id);
          return <TerritoryCard key={t.id} territory={t} performance={perf} onClick={() => setSelected(t)} />;
        })}
      </div>

      {territories.length === 0 && (
        <Card padding="lg" className="text-center py-16">
          <MapPin className="h-10 w-10 text-slate-200 mx-auto mb-3" />
          <p className="text-sm text-slate-400">No territories configured</p>
        </Card>
      )}

      {/* Assign Rep Modal */}
      <Modal
        isOpen={!!liveSelected}
        onClose={() => setSelected(null)}
        title={liveSelected?.name ?? 'Territory'}
        size="sm"
        footer={
          <div className="flex justify-end w-full">
            <Button variant="outline" size="sm" onClick={() => setSelected(null)}>Close</Button>
          </div>
        }
      >
        {liveSelected && (
          <div className="space-y-4">
            <p className="text-sm text-slate-500">
              Currently assigned to <span className="font-semibold text-slate-700">{liveSelected.assignedRepName ?? 'no one'}</span>.
            </p>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Assign to Rep</label>
              <select
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
                value={liveSelected.assignedRepId ?? ''}
                onChange={e => handleAssign(e.target.value)}
              >
                <option value="" disabled>Select a rep…</option>
                {myReps.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SMTerritories;
