import React, { useState } from 'react';
import { Banknote, Plus } from 'lucide-react';
import { Card } from '../../components/ui';
import CollectionCard from '../../components/sales/CollectionCard';
import { useSalesExecution } from '../../context/SalesExecutionContext';
import { useAuth } from '../../context/AuthContext';
import { CollectionAttempt, CollectionStatus } from '../../types';

type Tab = 'outstanding' | 'all';

const RepCollections: React.FC = () => {
  const { user } = useAuth();
  const { getRepCollections, updateCollectionStatus, logCollectionAttempt } = useSalesExecution();
  const [tab, setTab] = useState<Tab>('outstanding');

  const repId = user?.id ?? '';
  const all = getRepCollections(repId);

  const outstanding = all.filter(c => c.status !== 'Paid');
  const displayList: CollectionAttempt[] = tab === 'outstanding' ? outstanding : all;

  const totalRequested = outstanding.reduce((s, c) => s + c.amountRequested, 0);
  const totalCollected = outstanding.reduce((s, c) => s + c.amountCollected, 0);
  const totalOutstanding = totalRequested - totalCollected;
  const overdue = outstanding.filter(c => c.status === 'Overdue').length;
  const disputed = outstanding.filter(c => c.status === 'Disputed').length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Collections</h1>
          <p className="text-sm text-slate-500 mt-1">
            {outstanding.length} outstanding · {overdue > 0 ? `${overdue} overdue · ` : ''}{disputed > 0 ? `${disputed} disputed` : ''}
          </p>
        </div>
      </div>

      {/* Summary */}
      {outstanding.length > 0 && (
        <Card padding="md">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-black text-slate-800">£{totalRequested.toFixed(0)}</p>
              <p className="text-xs text-slate-400 mt-0.5">Requested</p>
            </div>
            <div className="text-center border-x border-slate-100">
              <p className="text-2xl font-black text-emerald-600">£{totalCollected.toFixed(0)}</p>
              <p className="text-xs text-slate-400 mt-0.5">Collected</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-rose-600">£{totalOutstanding.toFixed(0)}</p>
              <p className="text-xs text-slate-400 mt-0.5">Outstanding</p>
            </div>
          </div>
          <div className="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all"
              style={{ width: `${totalRequested > 0 ? Math.round((totalCollected / totalRequested) * 100) : 0}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-1 text-right">
            {totalRequested > 0 ? Math.round((totalCollected / totalRequested) * 100) : 0}% recovered
          </p>
        </Card>
      )}

      {/* Status breakdown */}
      {outstanding.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {(['Pending', 'Partially Paid', 'Overdue', 'Disputed'] as CollectionStatus[]).map(s => {
            const count = all.filter(c => c.status === s).length;
            return (
              <div key={s} className="text-center p-3 bg-white border border-slate-100 rounded-xl">
                <p className="text-xl font-black text-slate-800">{count}</p>
                <p className="text-xs text-slate-400 leading-tight mt-0.5">{s}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Tabs */}
      <div className="flex bg-slate-100 rounded-xl p-1 gap-1 w-fit">
        <button onClick={() => setTab('outstanding')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${tab === 'outstanding' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>
          Outstanding ({outstanding.length})
        </button>
        <button onClick={() => setTab('all')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${tab === 'all' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>
          All ({all.length})
        </button>
      </div>

      {/* List */}
      {displayList.length === 0 ? (
        <Card padding="lg" className="text-center py-16">
          <Banknote className="h-10 w-10 text-slate-200 mx-auto mb-3" />
          <p className="text-sm text-slate-400">
            {tab === 'outstanding' ? 'No outstanding collections' : 'No collection records'}
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {displayList.map(attempt => (
            <CollectionCard
              key={attempt.id}
              attempt={attempt}
              onUpdateStatus={updateCollectionStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RepCollections;
