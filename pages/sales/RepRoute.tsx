import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  MapPin, Clock, CheckCircle, AlertCircle, Plus, X,
  ChevronUp, ChevronDown, Search, ArrowRight, Route, Wallet, Phone, Check, WifiOff,
} from 'lucide-react';
import { useSalesExecution } from '../../context/SalesExecutionContext';
import { useSalesCRM } from '../../context/SalesCRMContext';
import { useAuth } from '../../context/AuthContext';
import VisitWorkflowModal from '../../components/sales/VisitWorkflowModal';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { useWorkSession } from '../../context/WorkSessionContext';

type VisitModalState = {
  customerId: string;
  customerName: string;
  initialStep?: 'confirm' | 'objectives' | 'outcome' | 'followup' | 'summary';
  initialVisitId?: string;
  initialLinkedOrderId?: string;
  initialLinkedOrderTotal?: number;
};

const RepRoute: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const {
    getTodayRoute, markStopVisited, markStopSkipped, getActiveVisit,
    addStopToRoute, removeStopFromRoute, reorderRouteStops, updateVisitObjective,
  } = useSalesExecution();
  const { getRepCustomers } = useSalesCRM();

  const isOnline = useOnlineStatus();
  const { isOnline: isSessionActive } = useWorkSession();
  const canAct = isOnline && isSessionActive;
  const [search, setSearch] = useState('');
  const [visitModal, setVisitModal] = useState<VisitModalState | null>(null);

  const repId = user?.id ?? '';
  const todayRoute = getTodayRoute(repId);
  const activeVisit = getActiveVisit(repId);
  const myCustomers = getRepCustomers(repId);

  // Reopen modal when returning from RepOrderCreate. Depends on location.state (not []) so it
  // re-fires correctly if this component is ever kept mounted across the round trip; clearing
  // the state via replace navigation (rather than a mount-scoped ref) is what actually prevents
  // re-processing on back-navigation.
  useEffect(() => {
    const state = location.state as any;
    if (state?.returnedOrderId) {
      const av = getActiveVisit(repId);
      if (av) {
        const orderObj = av.objectives.find((o: any) => o.type === 'Order' && !o.completed);
        if (orderObj) updateVisitObjective(av.id, orderObj.id, true);
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

  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

  const stops = useMemo(() =>
    todayRoute?.stops.slice().sort((a, b) => a.suggestedOrder - b.suggestedOrder) ?? [],
    [todayRoute]
  );

  const visited = stops.filter(s => s.status === 'Visited').length;
  const pending = stops.filter(s => s.status === 'Pending').length;
  const overdueStops = stops.filter(s => s.hasOverdueCollection || s.hasOverdueFollowUp).length;
  const progressPct = stops.length > 0 ? Math.round(visited / stops.length * 100) : 0;

  const onRouteIds = useMemo(() => new Set(stops.map(s => s.customerId)), [stops]);

  const filteredCustomers = useMemo(() => {
    const q = search.toLowerCase();
    return myCustomers.filter(c =>
      !q || c.storeName.toLowerCase().includes(q) || (c.address ?? '').toLowerCase().includes(q)
    );
  }, [myCustomers, search]);

  const handleStartVisit = (customerId: string, customerName: string) => {
    if (activeVisit) return;
    setVisitModal({ customerId, customerName });
  };

  const handleVisitComplete = () => {
    if (visitModal) markStopVisited(repId, visitModal.customerId);
    setVisitModal(null);
  };

  const moveStop = (customerId: string, dir: 'up' | 'down') => {
    const ordered = stops.filter(s => s.status === 'Pending');
    const idx = ordered.findIndex(s => s.customerId === customerId);
    if (dir === 'up' && idx === 0) return;
    if (dir === 'down' && idx === ordered.length - 1) return;
    const newOrder = [...ordered];
    [newOrder[idx], newOrder[dir === 'up' ? idx - 1 : idx + 1]] = [newOrder[dir === 'up' ? idx - 1 : idx + 1], newOrder[idx]];
    reorderRouteStops(repId, [
      ...stops.filter(s => s.status !== 'Pending'),
      ...newOrder,
    ].map(s => s.customerId));
  };

  const toggleStop = (customerId: string, storeName: string, address: string) => {
    if (onRouteIds.has(customerId)) {
      removeStopFromRoute(repId, customerId);
    } else {
      addStopToRoute(repId, customerId, storeName, address);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-xl font-black text-slate-800">Today's Route</h1>
        <p className="text-xs text-slate-500 mt-0.5">{today}</p>
      </div>

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

      {/* Active visit banner */}
      {activeVisit && (
        <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-emerald-700">Active: {activeVisit.customerName}</p>
            <p className="text-xs text-emerald-600">End visit before starting next stop</p>
          </div>
          <button onClick={() => navigate('/sales/visits')}
            className="text-xs font-bold text-emerald-700 flex items-center gap-1 flex-shrink-0">
            Go <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Progress strip — only if stops exist */}
      {stops.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              {[
                { label: 'Total', value: stops.length, color: 'text-slate-700' },
                { label: 'Done', value: visited, color: 'text-emerald-600' },
                { label: 'Left', value: pending, color: 'text-indigo-600' },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <p className={`text-lg font-black leading-none ${s.color}`}>{s.value}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{s.label}</p>
                </div>
              ))}
              {overdueStops > 0 && (
                <div className="text-center">
                  <p className="text-lg font-black leading-none text-rose-600">{overdueStops}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Alerts</p>
                </div>
              )}
            </div>
            <span className="text-xs font-bold text-slate-500">{progressPct}%</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
      )}

      {/* ── STOP LIST ── */}
      {stops.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
            Route Stops · {stops.length}
          </p>
          {stops.map((stop, i) => {
            const isPending = stop.status === 'Pending';
            const isVisited = stop.status === 'Visited';
            const pendingStops = stops.filter(s => s.status === 'Pending');
            const pendingIdx = pendingStops.findIndex(s => s.customerId === stop.customerId);

            return (
              <div key={stop.customerId}
                className={`rounded-xl border transition-all ${
                  isVisited ? 'bg-emerald-50 border-emerald-100' :
                  stop.status === 'Skipped' ? 'bg-slate-50 border-slate-100 opacity-50' :
                  'bg-white border-slate-200'
                }`}>
                <div className="flex items-center gap-3 px-3 py-3">
                  {/* Number / status */}
                  <span className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    isVisited ? 'bg-emerald-500 text-white' :
                    stop.status === 'Skipped' ? 'bg-slate-200 text-slate-400' :
                    'bg-indigo-100 text-indigo-600'
                  }`}>
                    {isVisited ? '✓' : stop.status === 'Skipped' ? '–' : i + 1}
                  </span>

                  {/* Info */}
                  <div className="flex-1 min-w-0"
                    onClick={() => navigate(`/sales/customers/${stop.customerId}`)}>
                    <p className={`text-sm font-semibold truncate ${isVisited || stop.status === 'Skipped' ? 'text-slate-400' : 'text-slate-800'}`}>
                      {stop.customerName}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      {stop.address && <p className="text-xs text-slate-400 truncate">{stop.address}</p>}
                      {stop.hasOverdueCollection && (
                        <span className="flex items-center gap-0.5 text-[10px] font-bold text-rose-500 flex-shrink-0">
                          <Wallet className="h-3 w-3" /> £ Due
                        </span>
                      )}
                      {stop.hasOverdueFollowUp && (
                        <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-500 flex-shrink-0">
                          <Phone className="h-3 w-3" /> Follow-up
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  {isPending && (
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {/* Reorder */}
                      {!activeVisit && (
                        <div className="flex flex-col gap-0.5">
                          <button onClick={() => moveStop(stop.customerId, 'up')}
                            disabled={pendingIdx === 0}
                            className="h-5 w-5 rounded flex items-center justify-center hover:bg-slate-100 disabled:opacity-20 transition-colors">
                            <ChevronUp className="h-3.5 w-3.5 text-slate-400" />
                          </button>
                          <button onClick={() => moveStop(stop.customerId, 'down')}
                            disabled={pendingIdx === pendingStops.length - 1}
                            className="h-5 w-5 rounded flex items-center justify-center hover:bg-slate-100 disabled:opacity-20 transition-colors">
                            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                          </button>
                        </div>
                      )}
                      <button onClick={() => markStopSkipped(repId, stop.customerId)}
                        className="px-2 py-1.5 text-xs font-semibold text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        Skip
                      </button>
                      <button
                        onClick={() => handleStartVisit(stop.customerId, stop.customerName)}
                        disabled={!!activeVisit || !canAct}
                        title={!isSessionActive ? 'Start your work session first' : !isOnline ? 'No internet connection' : undefined}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-40">
                        {!canAct ? <WifiOff className="h-3.5 w-3.5" /> : 'Visit'}
                      </button>
                      {!activeVisit && (
                        <button onClick={() => removeStopFromRoute(repId, stop.customerId)}
                          className="h-7 w-7 flex items-center justify-center hover:bg-rose-50 rounded-lg transition-colors">
                          <X className="h-3.5 w-3.5 text-rose-400" />
                        </button>
                      )}
                    </div>
                  )}
                  {isVisited && (
                    <span className="text-xs font-bold text-emerald-600 flex-shrink-0">Done ✓</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── CUSTOMER PICKER (always visible) ── */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
          <Search className="h-4 w-4 text-slate-400 flex-shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search customers to add to route..."
            className="flex-1 text-sm text-slate-700 placeholder-slate-400 focus:outline-none"
          />
          {search && (
            <button onClick={() => setSearch('')}>
              <X className="h-4 w-4 text-slate-400" />
            </button>
          )}
        </div>

        {filteredCustomers.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-slate-400">No customers found</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50 max-h-72 overflow-y-auto">
            {filteredCustomers.map(c => {
              const onRoute = onRouteIds.has(c.id);
              return (
                <button
                  key={c.id}
                  onClick={() => toggleStop(c.id, c.storeName, c.address ?? '')}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                    onRoute ? 'bg-indigo-50 hover:bg-indigo-100' : 'hover:bg-slate-50'
                  }`}>
                  <div className={`h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm transition-colors ${
                    onRoute ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {onRoute ? <Check className="h-4 w-4" /> : c.storeName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${onRoute ? 'text-indigo-700' : 'text-slate-800'}`}>
                      {c.storeName}
                    </p>
                    {c.address && (
                      <p className="text-xs text-slate-400 truncate mt-0.5">{c.address}</p>
                    )}
                  </div>
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                    onRoute ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {onRoute ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {stops.length === 0 && (
          <div className="px-4 py-3 bg-slate-50 border-t border-slate-100">
            <p className="text-xs text-slate-400 text-center">Tap customers above to build your route</p>
          </div>
        )}
      </div>

      {visitModal && (
        <VisitWorkflowModal
          customerId={visitModal.customerId}
          customerName={visitModal.customerName}
          initialStep={visitModal.initialStep}
          initialVisitId={visitModal.initialVisitId}
          initialLinkedOrderId={visitModal.initialLinkedOrderId}
          initialLinkedOrderTotal={visitModal.initialLinkedOrderTotal}
          onComplete={handleVisitComplete}
          onClose={() => setVisitModal(null)}
        />
      )}
    </div>
  );
};

export default RepRoute;
