import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui';
import { useSalesManager } from '../../context/SalesManagerContext';
import CustomerHealthCard from '../../components/sales-manager/CustomerHealthCard';
import { CustomerHealthState } from '../../types';

type Filter = 'all' | CustomerHealthState;

const SMCustomerHealth: React.FC = () => {
  const { customerHealth } = useSalesManager();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>('all');

  const counts: Record<CustomerHealthState, number> = {
    Healthy: customerHealth.filter(c => c.healthState === 'Healthy').length,
    Warning: customerHealth.filter(c => c.healthState === 'Warning').length,
    'High Risk': customerHealth.filter(c => c.healthState === 'High Risk').length,
    Critical: customerHealth.filter(c => c.healthState === 'Critical').length,
  };

  const filtered = filter === 'all'
    ? [...customerHealth].sort((a, b) => a.healthScore - b.healthScore)
    : customerHealth.filter(c => c.healthState === filter).sort((a, b) => a.healthScore - b.healthScore);

  const FILTERS: { key: Filter; label: string; color: string }[] = [
    { key: 'all', label: `All (${customerHealth.length})`, color: '' },
    { key: 'Critical', label: `Critical (${counts.Critical})`, color: 'text-rose-600' },
    { key: 'High Risk', label: `High Risk (${counts['High Risk']})`, color: 'text-orange-600' },
    { key: 'Warning', label: `Warning (${counts.Warning})`, color: 'text-amber-600' },
    { key: 'Healthy', label: `Healthy (${counts.Healthy})`, color: 'text-emerald-600' },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-slate-800">Customer Health</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          {counts.Critical + counts['High Risk']} at-risk · {counts.Healthy} healthy
        </p>
      </div>

      {/* Health summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {([
          { state: 'Healthy' as CustomerHealthState, bg: 'bg-emerald-50', text: 'text-emerald-700' },
          { state: 'Warning' as CustomerHealthState, bg: 'bg-amber-50', text: 'text-amber-700' },
          { state: 'High Risk' as CustomerHealthState, bg: 'bg-orange-50', text: 'text-orange-700' },
          { state: 'Critical' as CustomerHealthState, bg: 'bg-rose-50', text: 'text-rose-700' },
        ]).map(s => (
          <Card key={s.state} padding="md" className="cursor-pointer hover:shadow-md transition-all"
            onClick={() => setFilter(s.state)}>
            <p className={`text-2xl font-black ${s.text}`}>{counts[s.state]}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.state}</p>
          </Card>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === f.key ? 'bg-indigo-500 text-white' : `bg-slate-100 ${f.color || 'text-slate-600'} hover:bg-slate-200`
            }`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(c => (
          <CustomerHealthCard key={c.customerId} health={c} onClick={() => navigate(`/customers/${c.customerId}/360`)} />
        ))}
      </div>

      {filtered.length === 0 && (
        <Card padding="lg" className="text-center py-16">
          <AlertTriangle className="h-10 w-10 text-slate-200 mx-auto mb-3" />
          <p className="text-sm text-slate-400">No customers in this state</p>
        </Card>
      )}
    </div>
  );
};

export default SMCustomerHealth;
