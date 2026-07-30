import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapPin, Clock, CheckCircle, XCircle, Calendar, Plus, Search, X, Route, AlertCircle, WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { useWorkSession } from '../../context/WorkSessionContext';
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

type VisitModalState = {
  customerId: string;
  customerName: string;
  initialStep?: 'confirm' | 'objectives' | 'outcome' | 'followup' | 'summary';
  initialVisitId?: string;
  initialLinkedOrderId?: string;
  initialLinkedOrderTotal?: number;
};

const RepVisits: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { getRepVisits, getActiveVisit, endVisit, getTodayRoute, updateVisitObjective } = useSalesExecution();
  const { getRepCustomers } = useSalesCRM();

  const [tab, setTab] = useState<'today' | 'history'>('today');
  const [visitModal, setVisitModal] = useState<VisitModalState | null>(null);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [showCustomerPicker, setShowCustomerPicker] = useState(false);
  const [pickerSearch, setPickerSearch] = useState('');
  const [pickerTab, setPickerTab] = useState<'route' | 'all'>('route');

  const isOnline = useOnlineStatus();
  const { isOnline: isSessionActive, recordVisit } = useWorkSession();
  const canAct = isOnline && isSessionActive;
  const repId = user?.id ?? '';
  const allVisits = getRepVisits(repId);
  const activeVisit = getActiveVisit(repId);

  // Reopen modal when returning from RepOrderCreate. Depends on location.state (not []) so it
  // re-fires correctly if this component is ever kept mounted across the round trip; clearing
  // the state via replace navigation (rather than a mount-scoped ref) is what actually prevents
  // re-processing on back-navigation.
  useEffect(() => {
    const state = location.state as any;
    if (state?.returnedOrderId) {
      const av = getActiveVisit(repId);
      if (av) {
        // Auto-complete Order objective
        const orderObj = av.objectives.find(o => o.type === 'Order' && !o.completed);
        if (orderObj) updateVisitObjective(av.id, orderObj.id, true);
        // Reopen modal at objectives step
        setVisitModal({
          customerId: av.customerId,
          customerName: av.customerName,
          initialStep: 'objectives',
          initialVisitId: av.id,
          initialLinkedOrderId: state.returnedOrderId,
          initialLinkedOrderTotal: state.returnedOrderTotal,
        });
      }
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.state]);
  const myCustomers = getRepCustomers(repId);
  const todayRoute = getTodayRoute(repId);

  // Pending stops in route order
  const pendingStops = (todayRoute?.stops ?? [])
    .filter(s => s.status === 'Pending')
    .sort((a, b) => a.suggestedOrder - b.suggestedOrder);

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
    recordVisit();
    setShowEndConfirm(false);
  };

  const openPicker = () => {
    setPickerSearch('');
    setPickerTab(pendingStops.length > 0 ? 'route' : 'all');
    setShowCustomerPicker(true);
  };

  const startVisitFor = (customerId: string, customerName: string) => {
    setShowCustomerPicker(false);
    setPickerSearch('');
    setVisitModal({ customerId, customerName });
  };

  const filteredCustomers = myCustomers.filter(
    c => !pickerSearch || c.storeName.toLowerCase().includes(pickerSearch.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Session / network banners */}
      {!isSessionActive && (
        <div className="flex items-center gap-2 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl">
          <WifiOff className="h-4 w-4 text-amber-500 flex-shrink-0" />
          <p className="text-xs font-bold text-amber-700">Start your work session before logging visits</p>
        </div>
      )}
      {isSessionActive && !isOnline && (
        <div className="flex items-center gap-2 px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl">
          <WifiOff className="h-4 w-4 text-rose-500 flex-shrink-0" />
          <p className="text-xs font-bold text-rose-700">You're offline — internet required to start a visit</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-800">Visits</h1>
          <p className="text-xs text-slate-500 mt-0.5">{todayVisits.length} today · {allVisits.filter(v => v.status === 'completed').length} total completed</p>
        </div>
        {!activeVisit && (
          <button
            onClick={canAct ? openPicker : undefined}
            disabled={!canAct}
            title={!isSessionActive ? 'Start your work session first' : !isOnline ? 'No internet connection' : undefined}
            className={`flex items-center gap-2 px-4 py-2.5 text-white text-sm font-bold rounded-xl transition-colors ${
              canAct ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-slate-300 cursor-not-allowed'
            }`}>
            {canAct ? <Plus className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
            {canAct ? 'Start Visit' : !isSessionActive ? 'Offline' : 'No Internet'}
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
        <Card padding="md" className="text-center py-10">
          <MapPin className="h-8 w-8 text-slate-200 mx-auto mb-2" />
          <p className="text-sm text-slate-400">{tab === 'today' ? 'No visits logged today' : 'No visit history'}</p>
          {tab === 'today' && !activeVisit && (
            <button onClick={openPicker}
              className="mt-2 text-indigo-500 text-sm font-semibold">Start your first visit →</button>
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

      {/* ── 2-Tab Customer Picker Modal ── */}
      {showCustomerPicker && !activeVisit && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md flex flex-col max-h-[85vh]">

            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-slate-100 flex-shrink-0">
              <h3 className="text-base font-bold text-slate-800">Start Visit</h3>
              <button onClick={() => { setShowCustomerPicker(false); setPickerSearch(''); }}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Tab switcher */}
            <div className="flex bg-slate-100 rounded-xl p-1 gap-1 mx-4 mt-4 flex-shrink-0">
              <button
                onClick={() => setPickerTab('route')}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                  pickerTab === 'route' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'
                }`}>
                <Route className="h-3.5 w-3.5" />
                My Route
                {pendingStops.length > 0 && (
                  <span className="ml-0.5 px-1.5 py-0.5 bg-violet-500 text-white text-[10px] font-bold rounded-full leading-none">
                    {pendingStops.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => { setPickerTab('all'); setPickerSearch(''); }}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                  pickerTab === 'all' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'
                }`}>
                <MapPin className="h-3.5 w-3.5" />
                Any Customer
              </button>
            </div>

            {/* Tab: My Route */}
            {pickerTab === 'route' && (
              <div className="flex-1 overflow-y-auto px-4 py-3 min-h-0">
                {pendingStops.length === 0 ? (
                  <div className="text-center py-10">
                    <Route className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-slate-400 mb-1">No pending stops on today's route</p>
                    <p className="text-xs text-slate-300 mb-4">All stops visited or no route planned</p>
                    <button
                      onClick={() => { setShowCustomerPicker(false); navigate('/sales/route'); }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-colors mb-3">
                      <Route className="h-4 w-4" /> Plan Today's Route
                    </button>
                    <button
                      onClick={() => setPickerTab('all')}
                      className="text-indigo-500 text-sm font-bold">
                      Pick any customer →
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Today's pending stops</p>
                    {pendingStops.map((stop, idx) => (
                      <button
                        key={stop.customerId}
                        onClick={() => startVisitFor(stop.customerId, stop.customerName)}
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all text-left group">
                        {/* Stop number */}
                        <span className="h-8 w-8 rounded-full bg-slate-100 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center font-bold text-sm flex-shrink-0 text-slate-600 transition-colors">
                          {idx + 1}
                        </span>
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-800 truncate">{stop.customerName}</p>
                          {stop.address && (
                            <p className="text-xs text-slate-400 truncate mt-0.5">{stop.address}</p>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            {stop.hasOverdueCollection && (
                              <span className="flex items-center gap-0.5 text-[10px] font-bold text-rose-500">
                                <AlertCircle className="h-3 w-3" /> Owes payment
                              </span>
                            )}
                            {stop.hasOverdueFollowUp && (
                              <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-500">
                                <Clock className="h-3 w-3" /> Follow-up due
                              </span>
                            )}
                          </div>
                        </div>
                        {/* Priority badge */}
                        {stop.priority === 'High' && (
                          <span className="px-2 py-0.5 bg-rose-50 text-rose-600 text-[10px] font-bold rounded-full flex-shrink-0">
                            HIGH
                          </span>
                        )}
                        {stop.priority === 'Medium' && (
                          <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-[10px] font-bold rounded-full flex-shrink-0">
                            MED
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab: Any Customer */}
            {pickerTab === 'all' && (
              <>
                <div className="px-4 pt-3 pb-2 flex-shrink-0">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <input
                      value={pickerSearch}
                      onChange={e => setPickerSearch(e.target.value)}
                      placeholder="Search customers..."
                      autoFocus
                      className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto px-4 pb-4 min-h-0">
                  {filteredCustomers.length === 0 ? (
                    <p className="text-center text-sm text-slate-400 py-8">No customers found</p>
                  ) : (
                    <div className="space-y-1">
                      {filteredCustomers.map(c => (
                        <button key={c.id}
                          onClick={() => startVisitFor(c.id, c.storeName)}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-indigo-50 transition-colors text-left">
                          <div className="h-9 w-9 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-bold text-indigo-600">{c.storeName.charAt(0)}</span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-800 truncate">{c.storeName}</p>
                            <p className="text-xs text-slate-400">{c.name}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

          </div>
        </div>
      )}

      {visitModal && (
        <VisitWorkflowModal
          customerId={visitModal.customerId}
          customerName={visitModal.customerName}
          initialStep={visitModal.initialStep}
          initialVisitId={visitModal.initialVisitId}
          initialLinkedOrderId={visitModal.initialLinkedOrderId}
          initialLinkedOrderTotal={visitModal.initialLinkedOrderTotal}
          onComplete={() => setVisitModal(null)}
          onClose={() => setVisitModal(null)}
        />
      )}
    </div>
  );
};

export default RepVisits;
