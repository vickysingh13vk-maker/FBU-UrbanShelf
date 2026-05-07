import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, CheckCircle, XCircle, Calendar, Plus } from 'lucide-react';
import { Card } from '../../components/ui';
import VisitWorkflowModal from '../../components/sales/VisitWorkflowModal';
import ActiveVisitPanel from '../../components/sales/ActiveVisitPanel';
import { useSalesExecution } from '../../context/SalesExecutionContext';
import { useSalesCRM } from '../../context/SalesCRMContext';
import { useAuth } from '../../context/AuthContext';
import { Visit, VisitStatus } from '../../types';

const STATUS_CONFIG: Record<VisitStatus, { icon: React.ReactNode; color: string; bg: string; label: string }> = {
  planned:   { icon: <Calendar className="h-3.5 w-3.5" />,    color: 'text-blue-600',    bg: 'bg-blue-50',    label: 'Planned' },
  active:    { icon: <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />, color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'Active' },
  completed: { icon: <CheckCircle className="h-3.5 w-3.5" />,  color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'Completed' },
  cancelled: { icon: <XCircle className="h-3.5 w-3.5" />,     color: 'text-slate-400',   bg: 'bg-slate-50',   label: 'Cancelled' },
};

const RepVisits: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getRepVisits, getActiveVisit, endVisit } = useSalesExecution();
  const { getRepCustomers } = useSalesCRM();

  const [tab, setTab] = useState<'today' | 'history'>('today');
  const [visitModal, setVisitModal] = useState<{ customerId: string; customerName: string } | null>(null);
  const [showEndConfirm, setShowEndConfirm] = useState(false);

  const repId = user?.id ?? '';
  const allVisits = getRepVisits(repId);
  const activeVisit = getActiveVisit(repId);
  const myCustomers = getRepCustomers(repId);

  const today = new Date().toISOString().split('T')[0];
  const todayVisits = allVisits.filter(v => v.date === today);
  const historyVisits = allVisits.filter(v => v.date < today);

  const displayVisits = tab === 'today' ? todayVisits : historyVisits;

  const formatDuration = (min?: number) => {
    if (!min) return '—';
    return min >= 60 ? `${Math.floor(min / 60)}h ${min % 60}m` : `${min}m`;
  };

  const handleEndActive = (outcome: any) => {
    if (!activeVisit) return;
    endVisit(activeVisit.id, { productsDiscussed: [], notes: 'Ended from visits page.', ...outcome });
    setShowEndConfirm(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Visits</h1>
          <p className="text-sm text-slate-500 mt-1">{todayVisits.length} today · {allVisits.filter(v => v.status === 'completed').length} total</p>
        </div>
        {!activeVisit && (
          <button onClick={() => setVisitModal({ customerId: myCustomers[0]?.id ?? '', customerName: myCustomers[0]?.storeName ?? '' })}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-colors">
            <Plus className="h-4 w-4" /> Start Visit
          </button>
        )}
      </div>

      {/* Active visit panel */}
      {activeVisit && (
        <ActiveVisitPanel visit={activeVisit} onEnd={() => setShowEndConfirm(true)} />
      )}

      {showEndConfirm && activeVisit && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-sm font-bold text-amber-800 mb-3">End visit with no outcome logged?</p>
          <div className="flex gap-2">
            <button onClick={() => handleEndActive({})} className="px-4 py-2 bg-amber-500 text-white text-xs font-bold rounded-lg">End Visit</button>
            <button onClick={() => setShowEndConfirm(false)} className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg">Cancel</button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex bg-slate-100 rounded-xl p-1 gap-1 w-fit">
        <button onClick={() => setTab('today')} className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${tab === 'today' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>
          Today ({todayVisits.length})
        </button>
        <button onClick={() => setTab('history')} className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${tab === 'history' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>
          History ({historyVisits.length})
        </button>
      </div>

      {/* Visit list */}
      {displayVisits.length === 0 ? (
        <Card padding="lg" className="text-center py-16">
          <MapPin className="h-10 w-10 text-slate-200 mx-auto mb-3" />
          <p className="text-sm text-slate-400">{tab === 'today' ? 'No visits logged today' : 'No visit history'}</p>
          {tab === 'today' && !activeVisit && (
            <button onClick={() => setVisitModal({ customerId: myCustomers[0]?.id ?? '', customerName: myCustomers[0]?.storeName ?? '' })}
              className="mt-3 text-indigo-500 text-sm font-semibold">Start your first visit →</button>
          )}
        </Card>
      ) : (
        <div className="space-y-3">
          {displayVisits.map(visit => {
            const cfg = STATUS_CONFIG[visit.status];
            const completedObj = visit.objectives.filter(o => o.completed).length;
            return (
              <Card key={visit.id} padding="md" className={`cursor-pointer hover:shadow-md transition-all ${visit.status === 'active' ? 'ring-2 ring-emerald-300' : ''}`}
                onClick={() => navigate(`/sales/visits/${visit.id}`)}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`h-10 w-10 ${cfg.bg} rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.color}`}>
                      {cfg.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">{visit.customerName}</p>
                      <p className="text-xs text-slate-400">{visit.date} · {new Date(visit.startTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`text-xs font-bold ${cfg.color}`}>{cfg.label}</span>
                    <p className="text-xs text-slate-400 mt-0.5">{formatDuration(visit.durationMinutes)}</p>
                  </div>
                </div>
                {visit.objectives.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-slate-50 flex items-center gap-4">
                    <span className="text-xs text-slate-500">{completedObj}/{visit.objectives.length} objectives</span>
                    {visit.outcome?.orderAmount && <span className="text-xs font-semibold text-emerald-600">Order £{visit.outcome.orderAmount.toFixed(2)}</span>}
                    {visit.outcome?.collectionAmount && visit.outcome.collectionAmount > 0 && <span className="text-xs font-semibold text-blue-600">Collected £{visit.outcome.collectionAmount.toFixed(2)}</span>}
                    {visit.outcome?.customerSatisfaction && (
                      <span className="text-xs text-amber-500">{'⭐'.repeat(visit.outcome.customerSatisfaction)}</span>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {visitModal && !activeVisit && (
        <VisitWorkflowModal
          customerId={visitModal.customerId}
          customerName={visitModal.customerName}
          onComplete={() => setVisitModal(null)}
          onClose={() => setVisitModal(null)}
        />
      )}
    </div>
  );
};

export default RepVisits;
