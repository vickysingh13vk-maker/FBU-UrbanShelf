import React, { useState } from 'react';
import { Phone, Plus, Filter } from 'lucide-react';
import { Card } from '../../components/ui';
import FollowUpCard from '../../components/sales/FollowUpCard';
import FollowUpFormModal from '../../components/sales/FollowUpFormModal';
import { useSalesExecution } from '../../context/SalesExecutionContext';
import { useAuth } from '../../context/AuthContext';
import { FollowUp } from '../../types';

type Tab = 'overdue' | 'today' | 'upcoming' | 'completed';

const RepFollowUps: React.FC = () => {
  const { user } = useAuth();
  const { getRepFollowUps, getOverdueFollowUps, getTodayFollowUps, getUpcomingFollowUps, completeFollowUp, dismissFollowUp, addFollowUp } = useSalesExecution();

  const [tab, setTab] = useState<Tab>('today');
  const [showModal, setShowModal] = useState(false);
  const [completeId, setCompleteId] = useState<string | null>(null);
  const [outcomeText, setOutcomeText] = useState('');

  const repId = user?.id ?? '';
  const all = getRepFollowUps(repId);
  const overdue = getOverdueFollowUps(repId);
  const todayList = getTodayFollowUps(repId);
  const upcoming = getUpcomingFollowUps(repId, 7);
  const completed = all.filter(f => f.status === 'Completed' || f.status === 'Cancelled');

  const tabData: Record<Tab, FollowUp[]> = {
    overdue,
    today: todayList,
    upcoming,
    completed,
  };

  const displayList = tabData[tab];

  const tabs: { key: Tab; label: string; count: number; alert?: boolean }[] = [
    { key: 'overdue',  label: 'Overdue',  count: overdue.length,   alert: overdue.length > 0 },
    { key: 'today',    label: 'Today',    count: todayList.length },
    { key: 'upcoming', label: 'Upcoming', count: upcoming.length },
    { key: 'completed',label: 'Done',     count: completed.length },
  ];

  const handleComplete = (id: string) => {
    setCompleteId(id);
    setOutcomeText('');
  };

  const confirmComplete = () => {
    if (!completeId) return;
    completeFollowUp(completeId, outcomeText || 'Completed');
    setCompleteId(null);
    setOutcomeText('');
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Follow-Ups</h1>
          <p className="text-sm text-slate-500 mt-1">
            {overdue.length > 0 ? `${overdue.length} overdue · ` : ''}{todayList.length} today
          </p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-colors">
          <Plus className="h-4 w-4" /> Add
        </button>
      </div>

      {/* Complete outcome modal */}
      {completeId && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3">
          <p className="text-sm font-bold text-emerald-800">Mark as completed</p>
          <input type="text" value={outcomeText} onChange={e => setOutcomeText(e.target.value)}
            placeholder="Outcome notes (optional)"
            className="w-full px-3 py-2 border border-emerald-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-white" />
          <div className="flex gap-2">
            <button onClick={confirmComplete} className="px-4 py-2 bg-emerald-500 text-white text-xs font-bold rounded-lg">Confirm</button>
            <button onClick={() => setCompleteId(null)} className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg">Cancel</button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex-1 px-2 py-2 rounded-lg text-xs font-semibold transition-colors ${tab === t.key ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>
            {t.label}
            {t.count > 0 && (
              <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs font-bold ${
                t.alert ? 'bg-rose-500 text-white' : tab === t.key ? 'bg-slate-100 text-slate-600' : 'bg-slate-200 text-slate-500'
              }`}>{t.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      {displayList.length === 0 ? (
        <Card padding="lg" className="text-center py-16">
          <Phone className="h-10 w-10 text-slate-200 mx-auto mb-3" />
          <p className="text-sm text-slate-400">
            {tab === 'overdue' ? 'No overdue follow-ups' :
             tab === 'today' ? 'Nothing due today' :
             tab === 'upcoming' ? 'Nothing in next 7 days' : 'No completed follow-ups'}
          </p>
        </Card>
      ) : (
        <div className="space-y-2">
          {displayList.map(fu => (
            <FollowUpCard
              key={fu.id}
              followUp={fu}
              onComplete={fu.status !== 'Completed' && fu.status !== 'Cancelled' ? handleComplete : undefined}
              onDismiss={fu.status !== 'Completed' && fu.status !== 'Cancelled' ? dismissFollowUp : undefined}
            />
          ))}
        </div>
      )}

      {showModal && (
        <FollowUpFormModal
          repId={repId}
          onSave={data => { addFollowUp(data); setShowModal(false); }}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default RepFollowUps;
