import React from 'react';
import { MapPin } from 'lucide-react';
import { Card } from '../../components/ui';
import { useSalesManager } from '../../context/SalesManagerContext';
import TerritoryCard from '../../components/sales-manager/TerritoryCard';

const SMTerritories: React.FC = () => {
  const { territories, territoryPerformance } = useSalesManager();

  const assigned = territories.filter(t => t.assignedRepId);
  const unassigned = territories.filter(t => !t.assignedRepId);
  const totalRevenue = territories.reduce((s, t) => s + t.monthlyRevenue, 0);

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
          return <TerritoryCard key={t.id} territory={t} performance={perf} />;
        })}
      </div>

      {territories.length === 0 && (
        <Card padding="lg" className="text-center py-16">
          <MapPin className="h-10 w-10 text-slate-200 mx-auto mb-3" />
          <p className="text-sm text-slate-400">No territories configured</p>
        </Card>
      )}
    </div>
  );
};

export default SMTerritories;
