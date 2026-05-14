import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, Clock, CheckCircle, AlertCircle, Plus, Edit2, X,
  ChevronUp, ChevronDown, Search, ArrowRight, Route, Wallet, Phone,
} from 'lucide-react';
import { Card } from '../../components/ui';
import VisitWorkflowModal from '../../components/sales/VisitWorkflowModal';
import { useSalesExecution } from '../../context/SalesExecutionContext';
import { useSalesCRM } from '../../context/SalesCRMContext';
import { useAuth } from '../../context/AuthContext';

const RepRoute: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    getTodayRoute, markStopVisited, markStopSkipped, getActiveVisit,
    addStopToRoute, removeStopFromRoute, reorderRouteStops,
  } = useSalesExecution();
  const { getRepCustomers } = useSalesCRM();

  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [visitModal, setVisitModal] = useState<{ customerId: string; customerName: string } | null>(null);
  const [showAddPicker, setShowAddPicker] = useState(false);
  const [pickerSearch, setPickerSearch] = useState('');

  const repId = user?.id ?? '';
  const todayRoute = getTodayRoute(repId);
  const activeVisit = getActiveVisit(repId);
  const myCustomers = getRepCustomers(repId);

  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

  const stops = todayRoute?.stops.slice().sort((a, b) => a.suggestedOrder - b.suggestedOrder) ?? [];
  const visited = stops.filter(s => s.status === 'Visited').length;
  const pending = stops.filter(s => s.status === 'Pending').length;
  const skipped = stops.filter(s => s.status === 'Skipped').length;
  const overdueStops = stops.filter(s => s.hasOverdueCollection || s.hasOverdueFollowUp).length;
  const estimatedMin = todayRoute?.estimatedTotalMinutes ?? 0;
  const progressPct = stops.length > 0 ? Math.round(visited / stops.length * 100) : 0;

  // Customers not already on route
  const alreadyOnRoute = new Set(stops.map(s => s.customerId));
  const addableCustomers = myCustomers.filter(c => !alreadyOnRoute.has(c.id));
  const filteredAddable = pickerSearch
    ? addableCustomers.filter(c => c.storeName.toLowerCase().includes(pickerSearch.toLowerCase()) || c.address?.toLowerCase().includes(pickerSearch.toLowerCase()))
    : addableCustomers;

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
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
    [newOrder[idx], newOrder[swapIdx]] = [newOrder[swapIdx], newOrder[idx]];
    // keep visited/skipped in place, only reorder pending
    const allOrdered = [
      ...stops.filter(s => s.status !== 'Pending'),
      ...newOrder,
    ];
    reorderRouteStops(repId, allOrdered.map(s => s.customerId));
  };

  const enterEdit = () => {
    if (activeVisit) return; // guard
    setMode('edit');
  };

  // ─── NO ROUTE STATE ────────────────────────────────────────────────────────
  if (!todayRoute || stops.length === 0) {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-slate-800">Today's Route</h1>
            <p className="text-xs text-slate-500 mt-0.5">{today}</p>
          </div>
        </div>

        <Card padding="none" className="overflow-hidden">
          <div className="p-8 text-center">
            <div className="h-16 w-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Route className="h-8 w-8 text-indigo-400" />
            </div>
            <h3 className="text-base font-bold text-slate-700 mb-1">No route planned today</h3>
            <p className="text-sm text-slate-400 mb-6">Add your customers for today's field visits</p>
            <button
              onClick={() => setShowAddPicker(true)}
              className="inline-flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-colors">
              <Plus className="h-4 w-4" /> Plan Today's Route
            </button>
          </div>
        </Card>

        {/* Add Stop Picker */}
        {showAddPicker && (
          <Card padding="md">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-700">Add customers to route</h3>
              <button onClick={() => { setShowAddPicker(false); setPickerSearch(''); }}
                className="h-7 w-7 rounded-lg hover:bg-slate-100 flex items-center justify-center">
                <X className="h-4 w-4 text-slate-400" />
              </button>
            </div>
            <div className="relative mb-3">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={pickerSearch}
                onChange={e => setPickerSearch(e.target.value)}
                placeholder="Search customers..."
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {filteredAddable.map(c => (
                <button key={c.id}
                  onClick={() => addStopToRoute(repId, c.id, c.storeName, c.address ?? '')}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-indigo-50 transition-colors text-left">
                  <div className="h-8 w-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-4 w-4 text-indigo-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-700 truncate">{c.storeName}</p>
                    <p className="text-xs text-slate-400 truncate">{c.address}</p>
                  </div>
                  <Plus className="h-4 w-4 text-indigo-400 flex-shrink-0" />
                </button>
              ))}
              {filteredAddable.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-4">No customers to add</p>
              )}
            </div>
            {stops.length > 0 && (
              <button onClick={() => { setShowAddPicker(false); setPickerSearch(''); }}
                className="mt-3 w-full py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-colors">
                Done — {stops.length} stops added
              </button>
            )}
          </Card>
        )}
      </div>
    );
  }

  // ─── EDIT MODE ─────────────────────────────────────────────────────────────
  if (mode === 'edit') {
    const pendingStops = stops.filter(s => s.status === 'Pending');
    const doneStops = stops.filter(s => s.status !== 'Pending');

    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-slate-800">Edit Route</h1>
            <p className="text-xs text-slate-500 mt-0.5">{today} · {stops.length} stops</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setMode('view')}
              className="px-4 py-2 border border-slate-200 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button onClick={() => setMode('view')}
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-colors">
              Save
            </button>
          </div>
        </div>

        {/* Pending stops — reorderable */}
        <Card padding="md">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-700">Pending Stops</h3>
            <button onClick={() => setShowAddPicker(true)}
              className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-lg hover:bg-indigo-100 transition-colors">
              <Plus className="h-3.5 w-3.5" /> Add Stop
            </button>
          </div>

          {pendingStops.length === 0 && (
            <p className="text-sm text-slate-400 text-center py-4">No pending stops. Add customers above.</p>
          )}

          <div className="space-y-2">
            {pendingStops.map((stop, i) => (
              <div key={stop.customerId} className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <span className="h-6 w-6 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-700 truncate">{stop.customerName}</p>
                  <p className="text-xs text-slate-400 truncate">{stop.address}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => moveStop(stop.customerId, 'up')} disabled={i === 0}
                    className="h-7 w-7 rounded-lg hover:bg-slate-200 flex items-center justify-center disabled:opacity-30 transition-colors">
                    <ChevronUp className="h-4 w-4 text-slate-500" />
                  </button>
                  <button onClick={() => moveStop(stop.customerId, 'down')} disabled={i === pendingStops.length - 1}
                    className="h-7 w-7 rounded-lg hover:bg-slate-200 flex items-center justify-center disabled:opacity-30 transition-colors">
                    <ChevronDown className="h-4 w-4 text-slate-500" />
                  </button>
                  <button onClick={() => removeStopFromRoute(repId, stop.customerId)}
                    className="h-7 w-7 rounded-lg hover:bg-rose-100 flex items-center justify-center transition-colors ml-1">
                    <X className="h-4 w-4 text-rose-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add picker inline */}
          {showAddPicker && (
            <div className="mt-3 border-t border-slate-100 pt-3">
              <div className="relative mb-2">
                <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={pickerSearch}
                  onChange={e => setPickerSearch(e.target.value)}
                  placeholder="Search customers to add..."
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  autoFocus
                />
              </div>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {filteredAddable.map(c => (
                  <button key={c.id}
                    onClick={() => { addStopToRoute(repId, c.id, c.storeName, c.address ?? ''); setPickerSearch(''); }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-indigo-50 text-left transition-colors">
                    <span className="text-sm font-semibold text-slate-700 truncate flex-1">{c.storeName}</span>
                    <Plus className="h-3.5 w-3.5 text-indigo-400 flex-shrink-0" />
                  </button>
                ))}
                {filteredAddable.length === 0 && <p className="text-xs text-slate-400 text-center py-2">All customers already on route</p>}
              </div>
              <button onClick={() => { setShowAddPicker(false); setPickerSearch(''); }}
                className="mt-2 text-xs text-slate-400 hover:text-slate-600 font-medium">Close</button>
            </div>
          )}
        </Card>

        {/* Visited/Skipped (read-only) */}
        {doneStops.length > 0 && (
          <Card padding="md">
            <h3 className="text-sm font-bold text-slate-500 mb-3">Completed (locked)</h3>
            <div className="space-y-2">
              {doneStops.map(stop => (
                <div key={stop.customerId} className={`flex items-center gap-2 p-3 rounded-xl ${stop.status === 'Visited' ? 'bg-emerald-50' : 'bg-slate-50'}`}>
                  <CheckCircle className={`h-4 w-4 flex-shrink-0 ${stop.status === 'Visited' ? 'text-emerald-500' : 'text-slate-300'}`} />
                  <span className="text-sm font-semibold text-slate-500">{stop.customerName}</span>
                  <span className={`ml-auto text-xs font-semibold ${stop.status === 'Visited' ? 'text-emerald-600' : 'text-slate-400'}`}>{stop.status}</span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    );
  }

  // ─── VIEW / EXECUTE MODE ───────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-800">Today's Route</h1>
          <p className="text-xs text-slate-500 mt-0.5">{today}</p>
        </div>
        <button
          onClick={enterEdit}
          disabled={!!activeVisit}
          title={activeVisit ? 'End current visit before editing' : 'Edit route'}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-xl transition-colors disabled:opacity-40">
          <Edit2 className="h-3.5 w-3.5" /> Edit Route
        </button>
      </div>

      {/* Active visit banner */}
      {activeVisit && (
        <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-emerald-700">Visit Active: {activeVisit.customerName}</p>
            <p className="text-xs text-emerald-600">Complete or end visit before starting next stop</p>
          </div>
          <button onClick={() => navigate('/sales/visits')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 flex-shrink-0">
            Go <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: 'Total',     value: stops.length, color: 'text-slate-800',   icon: <Route className="h-3.5 w-3.5 text-slate-400" /> },
          { label: 'Visited',   value: visited,      color: 'text-emerald-600', icon: <CheckCircle className="h-3.5 w-3.5 text-emerald-400" /> },
          { label: 'Pending',   value: pending,      color: 'text-indigo-600',  icon: <Clock className="h-3.5 w-3.5 text-indigo-400" /> },
          { label: 'Alerts',    value: overdueStops, color: 'text-rose-600',    icon: <AlertCircle className="h-3.5 w-3.5 text-rose-400" /> },
        ].map(s => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 shadow-sm">
            <div className="flex items-center gap-1 mb-1">{s.icon}</div>
            <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-xs text-slate-500 mb-1.5">
          <span>{progressPct}% complete</span>
          {estimatedMin > 0 && (
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {Math.floor(estimatedMin / 60)}h {estimatedMin % 60}m est.</span>
          )}
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
        </div>
        {skipped > 0 && <p className="text-xs text-slate-400 mt-1">{skipped} skipped</p>}
      </div>

      {/* Stop list */}
      <Card padding="md">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-700">Stops ({stops.length})</h3>
          <button onClick={() => { setMode('edit'); setShowAddPicker(true); }}
            disabled={!!activeVisit}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-200 disabled:opacity-40 transition-colors">
            <Plus className="h-3.5 w-3.5" /> Add Stop
          </button>
        </div>

        <div className="space-y-2">
          {stops.map((stop, i) => {
            const isPending = stop.status === 'Pending';
            const isVisited = stop.status === 'Visited';
            const isSkipped = stop.status === 'Skipped';

            return (
              <div key={stop.customerId}
                className={`rounded-xl border transition-all ${
                  isVisited ? 'bg-emerald-50 border-emerald-100' :
                  isSkipped ? 'bg-slate-50 border-slate-100 opacity-50' :
                  'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                }`}>
                <div className="flex items-center gap-3 px-3 py-3">
                  {/* Number / status circle */}
                  <span className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    isVisited ? 'bg-emerald-500 text-white' :
                    isSkipped ? 'bg-slate-200 text-slate-400' :
                    'bg-indigo-100 text-indigo-600'
                  }`}>
                    {isVisited ? '✓' : isSkipped ? '–' : i + 1}
                  </span>

                  {/* Info */}
                  <div className="flex-1 min-w-0 cursor-pointer" onClick={() => navigate(`/sales/customers/${stop.customerId}`)}>
                    <p className={`text-sm font-semibold truncate ${isVisited || isSkipped ? 'text-slate-400' : 'text-slate-800'}`}>
                      {stop.customerName}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {stop.address && <p className="text-xs text-slate-400 truncate">{stop.address}</p>}
                      {stop.hasOverdueCollection && (
                        <span className="flex items-center gap-0.5 text-xs font-bold text-rose-500 flex-shrink-0">
                          <Wallet className="h-3 w-3" /> £ Due
                        </span>
                      )}
                      {stop.hasOverdueFollowUp && (
                        <span className="flex items-center gap-0.5 text-xs font-bold text-amber-500 flex-shrink-0">
                          <Phone className="h-3 w-3" /> FU
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  {isPending && (
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => markStopSkipped(repId, stop.customerId)}
                        className="px-2.5 py-1.5 text-xs font-semibold text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        Skip
                      </button>
                      <button
                        onClick={() => handleStartVisit(stop.customerId, stop.customerName)}
                        disabled={!!activeVisit}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-40">
                        Visit
                      </button>
                    </div>
                  )}
                  {isVisited && (
                    <span className="text-xs font-bold text-emerald-600 flex-shrink-0">Done</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Plan tomorrow link */}
      <div className="text-center py-2">
        <p className="text-xs text-slate-400">
          All done for today?{' '}
          <button className="text-indigo-500 font-semibold hover:text-indigo-700">Plan tomorrow's route →</button>
        </p>
      </div>

      {visitModal && !activeVisit && (
        <VisitWorkflowModal
          customerId={visitModal.customerId}
          customerName={visitModal.customerName}
          onComplete={handleVisitComplete}
          onClose={() => setVisitModal(null)}
        />
      )}
    </div>
  );
};

export default RepRoute;
