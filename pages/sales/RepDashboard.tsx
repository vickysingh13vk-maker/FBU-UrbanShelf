import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, Users, Plus, Phone,
  ChevronRight, CheckCircle2, TrendingUp, Route,
  CheckSquare, Banknote, Briefcase, Navigation,
  AlertCircle, X, Search, Clock,
} from 'lucide-react';
import { Card, ViewModeToggle } from '../../components/ui';
import WorkSessionBanner from '../../components/sales/WorkSessionBanner';
import SessionSummaryModal from '../../components/sales/SessionSummaryModal';
import ActiveVisitPanel from '../../components/sales/ActiveVisitPanel';
import ProductivityWidget from '../../components/sales/ProductivityWidget';
import FollowUpCard from '../../components/sales/FollowUpCard';
import TaskCard from '../../components/sales/TaskCard';
import VisitWorkflowModal from '../../components/sales/VisitWorkflowModal';
import { useWorkSession } from '../../context/WorkSessionContext';
import { useSalesCRM } from '../../context/SalesCRMContext';
import { useSalesExecution } from '../../context/SalesExecutionContext';
import { useAuth } from '../../context/AuthContext';
import { WORK_SESSIONS } from '../../data';

type SheetType = 'route' | 'followups' | 'collections' | 'tasks';

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map(n => String(n).padStart(2, '0')).join(':');
}

const KPI_COLOR_MAP: Record<string, string> = {
  indigo: 'text-indigo-600 bg-indigo-50/50',
  violet: 'text-violet-600 bg-violet-50/50',
  blue:   'text-blue-600 bg-blue-50/50',
  emerald:'text-emerald-600 bg-emerald-50/50',
  amber:  'text-amber-600 bg-amber-50/50',
};

interface KpiItem { label: string; value: string | number; trend: string; trendColor: string; }
interface RepKpiCardProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  items: KpiItem[];
  onClick?: () => void;
}

const RepGroupedKpiCard: React.FC<RepKpiCardProps> = ({ title, icon: Icon, color, items, onClick }) => (
  <Card padding="none" className={`overflow-hidden flex flex-col hover:shadow-lg transition-all border-slate-100 group ${onClick ? 'cursor-pointer' : ''}`} onClick={onClick}>
    <div className="p-[12px_18px] border-b border-slate-50 flex items-center justify-between bg-white group-hover:bg-slate-50/30 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${KPI_COLOR_MAP[color]} group-hover:scale-110 transition-transform`}>
          <Icon className="h-4 w-4" />
        </div>
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.1em]">{title}</h3>
      </div>
      <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
    </div>
    <div className="p-[14px_18px] gap-y-3 flex flex-col bg-white flex-1">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center justify-between border-b border-slate-50 last:border-0 pb-2 last:pb-0">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.label}</p>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold ${item.trendColor}`}>{item.trend}</span>
            <span className="text-sm font-bold text-slate-900 tabular-nums leading-tight">{item.value}</span>
          </div>
        </div>
      ))}
    </div>
  </Card>
);

const RepDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isOnline, startSession, endSession, todayStats, elapsedSeconds, lastSummary, clearLastSummary } = useWorkSession();
  const { getRepCustomers, getRepLeads } = useSalesCRM();
  const {
    getActiveVisit, getTodayFollowUps, getOverdueFollowUps, getRepTasks,
    completeFollowUp, dismissFollowUp, getProductivityMetrics, getTodayRoute,
    logCollectionAttempt, completeTask,
  } = useSalesExecution();

  const [dashTab, setDashTab] = useState<'office' | 'field'>('office');
  const [actionTab, setActionTab] = useState<'followups' | 'tasks'>('followups');

  // Field mode state
  const [activeSheet, setActiveSheet] = useState<SheetType | null>(null);
  const [visitModal, setVisitModal] = useState<{ customerId: string; customerName: string } | null>(null);
  const [showVisitPicker, setShowVisitPicker] = useState(false);
  const [pickerTab, setPickerTab] = useState<'route' | 'all'>('route');
  const [pickerSearch, setPickerSearch] = useState('');
  const [collectionAmounts, setCollectionAmounts] = useState<Record<string, string>>({});
  const [collectionLogged, setCollectionLogged] = useState<Set<string>>(new Set());

  const repId = user?.id ?? '';
  const repName = user?.name ?? '';

  const myCustomers = getRepCustomers(repId);
  const myLeads = getRepLeads(repId);
  const activeLeads = myLeads.filter(l => l.stage !== 'Converted' && l.stage !== 'Lost');

  const activeVisit = getActiveVisit(repId);
  const todayFU = getTodayFollowUps(repId);
  const overdueFU = getOverdueFollowUps(repId);
  const activeTasks = getRepTasks(repId).filter(t => t.status !== 'Completed');
  const metrics = getProductivityMetrics(repId);
  const todayRoute = getTodayRoute(repId);
  const routeStop = todayRoute?.stops ?? [];
  const routeVisited = routeStop.filter(s => s.status === 'Visited').length;
  const routePending = routeStop.filter(s => s.status === 'Pending').length;
  const pendingStops = routeStop
    .filter(s => s.status === 'Pending')
    .sort((a, b) => a.suggestedOrder - b.suggestedOrder);

  const overdueCollections = myCustomers.filter(c => c.walletBalance < 0);

  const mySessions = WORK_SESSIONS.filter(s => s.repId === repId).slice(0, 6);
  const weekVisits = mySessions.reduce((a, s) => a + s.totalVisits, 0) + todayStats.visits;
  const weekOrders = mySessions.reduce((a, s) => a + s.totalOrders, 0) + todayStats.orders;
  const weekCollections = mySessions.reduce((a, s) => a + s.totalCollections, 0) + todayStats.collections;

  const handleToggleSession = () => {
    if (isOnline) endSession();
    else startSession(repId, repName);
  };

  const openSheet = (sheet: SheetType) => setActiveSheet(sheet);
  const closeSheet = () => setActiveSheet(null);

  const openVisitPicker = () => {
    setPickerSearch('');
    setPickerTab(pendingStops.length > 0 ? 'route' : 'all');
    setShowVisitPicker(true);
  };

  const startVisitFor = (customerId: string, customerName: string) => {
    setShowVisitPicker(false);
    setPickerSearch('');
    setVisitModal({ customerId, customerName });
  };

  const handleLogCollection = (customerId: string, customerName: string, amountOwed: number) => {
    const amount = parseFloat(collectionAmounts[customerId] || '0');
    if (amount <= 0) return;
    logCollectionAttempt({
      customerId,
      customerName,
      repId,
      attemptDate: new Date().toISOString().split('T')[0],
      amountRequested: amountOwed,
      amountCollected: amount,
      status: 'Collected',
      notes: 'Logged from field dashboard',
    });
    setCollectionAmounts(prev => ({ ...prev, [customerId]: '' }));
    setCollectionLogged(prev => new Set([...prev, customerId]));
    setTimeout(() => setCollectionLogged(prev => { const n = new Set(prev); n.delete(customerId); return n; }), 2500);
  };

  const filteredCustomers = myCustomers.filter(c =>
    !pickerSearch || c.storeName.toLowerCase().includes(pickerSearch.toLowerCase())
  );

  // Field secondary actions (open sheets)
  const fieldSecondaryActions = [
    { label: 'My Route',    icon: Route,       iconColor: 'text-violet-600', iconBg: 'bg-violet-50',  sheet: 'route' as SheetType,       badge: routePending },
    { label: 'Follow-Ups',  icon: Phone,       iconColor: 'text-amber-600',  iconBg: 'bg-amber-50',   sheet: 'followups' as SheetType,    badge: overdueFU.length },
    { label: 'Collections', icon: Banknote,    iconColor: 'text-emerald-600',iconBg: 'bg-emerald-50', sheet: 'collections' as SheetType,  badge: overdueCollections.length },
    { label: 'Tasks',       icon: CheckSquare, iconColor: 'text-blue-600',   iconBg: 'bg-blue-50',    sheet: 'tasks' as SheetType,        badge: activeTasks.length },
  ];

  const sheetTitles: Record<SheetType, { title: string; subtitle: string }> = {
    route:       { title: "Today's Route",  subtitle: `${routePending} pending · ${routeVisited} visited` },
    followups:   { title: 'Follow-Ups',     subtitle: overdueFU.length > 0 ? `${overdueFU.length} overdue · ${todayFU.length} today` : `${todayFU.length} due today` },
    collections: { title: 'Collections',    subtitle: `${overdueCollections.length} customers with balance due` },
    tasks:       { title: 'Tasks',          subtitle: `${activeTasks.length} open` },
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-800">My Dashboard</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        {isOnline && (
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-1.5">
            <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-sm font-mono font-bold text-emerald-700">{formatTime(elapsedSeconds)}</span>
          </div>
        )}
      </div>

      {/* Office / Field Tab Switcher */}
      <div className="flex bg-slate-100 rounded-xl p-1 gap-1 w-fit">
        <button
          onClick={() => setDashTab('office')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
            dashTab === 'office' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}>
          <Briefcase className="h-3.5 w-3.5" /> Office
        </button>
        <button
          onClick={() => setDashTab('field')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
            dashTab === 'field' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}>
          <Navigation className="h-3.5 w-3.5" /> Field
          {routePending > 0 && (
            <span className="ml-0.5 px-1.5 py-0.5 bg-violet-500 text-white text-[10px] font-bold rounded-full leading-none">
              {routePending}
            </span>
          )}
        </button>
      </div>

      {/* ══ OFFICE TAB ══ */}
      {dashTab === 'office' && (
        <div className="space-y-4">
          <ViewModeToggle />
          <WorkSessionBanner onToggle={handleToggleSession} />
          {activeVisit && <ActiveVisitPanel visit={activeVisit} onEnd={() => navigate('/sales/visits')} />}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <RepGroupedKpiCard title="TODAY'S ACTIVITY" icon={MapPin} color="indigo" onClick={() => navigate('/sales/visits')}
              items={[
                { label: 'VISITS',     value: metrics.visitsCompleted, trend: routeStop.length > 0 ? `${routeVisited}/${routeStop.length} stops` : 'no route', trendColor: 'text-slate-400' },
                { label: 'ORDERS',     value: todayStats.orders,       trend: `£${todayStats.revenue.toLocaleString()}`, trendColor: 'text-emerald-500' },
                { label: 'COLLECTED',  value: `£${todayStats.collections.toLocaleString()}`, trend: 'cash in', trendColor: 'text-slate-400' },
                { label: 'FOLLOW-UPS', value: overdueFU.length + todayFU.length, trend: overdueFU.length > 0 ? `${overdueFU.length} overdue` : 'on track', trendColor: overdueFU.length > 0 ? 'text-rose-500' : 'text-emerald-500' },
              ]}
            />
            <RepGroupedKpiCard title="ROUTE STATUS" icon={Route} color="violet" onClick={() => navigate('/sales/route')}
              items={[
                { label: 'TOTAL STOPS', value: routeStop.length || '—', trend: 'planned', trendColor: 'text-slate-400' },
                { label: 'VISITED',     value: routeVisited, trend: routeStop.length > 0 ? `${Math.round(routeVisited / routeStop.length * 100)}%` : '—', trendColor: 'text-emerald-500' },
                { label: 'PENDING',     value: routePending, trend: routePending > 0 ? 'remaining' : 'clear', trendColor: routePending > 0 ? 'text-amber-500' : 'text-emerald-500' },
                { label: 'ALERTS',      value: overdueFU.length, trend: overdueFU.length > 0 ? 'overdue FU' : 'none', trendColor: overdueFU.length > 0 ? 'text-rose-500' : 'text-emerald-500' },
              ]}
            />
            <RepGroupedKpiCard title="MY PIPELINE" icon={Users} color="blue" onClick={() => navigate('/sales/customers')}
              items={[
                { label: 'CUSTOMERS',    value: myCustomers.length, trend: 'assigned', trendColor: 'text-slate-400' },
                { label: 'ACTIVE LEADS', value: activeLeads.length, trend: `${myLeads.length} total`, trendColor: 'text-slate-400' },
                { label: 'OPEN TASKS',   value: activeTasks.length, trend: activeTasks.length > 0 ? 'pending' : 'clear', trendColor: activeTasks.length > 0 ? 'text-amber-500' : 'text-emerald-500' },
                { label: 'FU RATE',      value: myCustomers.length > 0 ? `${Math.round((overdueFU.length + todayFU.length) / myCustomers.length * 100)}%` : '0%', trend: 'of portfolio', trendColor: 'text-slate-400' },
              ]}
            />
            <RepGroupedKpiCard title="THIS WEEK" icon={TrendingUp} color="emerald" onClick={() => navigate('/sales/reporting')}
              items={[
                { label: 'VISITS',         value: weekVisits, trend: `${mySessions.length + 1} sessions`, trendColor: 'text-slate-400' },
                { label: 'ORDERS',         value: weekOrders, trend: weekOrders > 0 ? 'booked' : 'none yet', trendColor: weekOrders > 0 ? 'text-emerald-500' : 'text-slate-400' },
                { label: 'COLLECTED',      value: `£${weekCollections.toLocaleString()}`, trend: 'cash in', trendColor: 'text-slate-400' },
                { label: 'CUSTOMERS HIT',  value: mySessions.length + 1, trend: 'days active', trendColor: 'text-slate-400' },
              ]}
            />
          </div>

          <Card padding="sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2.5">Quick Actions</p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Start Visit', color: 'bg-indigo-600 text-white hover:bg-indigo-700', icon: <MapPin className="h-3.5 w-3.5" />,      path: '/sales/visits' },
                { label: 'My Route',    color: 'bg-violet-600 text-white hover:bg-violet-700', icon: <Route className="h-3.5 w-3.5" />,        path: '/sales/route' },
                { label: 'Follow-Ups',  color: 'bg-amber-500 text-white hover:bg-amber-600',   icon: <Phone className="h-3.5 w-3.5" />,         path: '/sales/follow-ups' },
                { label: 'Tasks',       color: 'bg-blue-600 text-white hover:bg-blue-700',     icon: <CheckSquare className="h-3.5 w-3.5" />,   path: '/sales/tasks' },
                { label: 'Collections', color: 'bg-emerald-600 text-white hover:bg-emerald-700',icon: <Banknote className="h-3.5 w-3.5" />,    path: '/sales/collections' },
                { label: 'Add Lead',    color: 'bg-slate-700 text-white hover:bg-slate-800',   icon: <Plus className="h-3.5 w-3.5" />,          path: '/sales/leads' },
              ].map(action => (
                <button key={action.label} onClick={() => navigate(action.path)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${action.color}`}>
                  {action.icon} {action.label}
                </button>
              ))}
            </div>
          </Card>

          <ProductivityWidget metrics={metrics} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <Card padding="sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex bg-slate-100 rounded-lg p-0.5 gap-0.5">
                    <button onClick={() => setActionTab('followups')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${actionTab === 'followups' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>
                      <Phone className="h-3 w-3" /> Follow-Ups
                      {overdueFU.length > 0 && <span className="ml-0.5 px-1.5 py-0.5 bg-rose-500 text-white text-xs font-bold rounded-full leading-none">{overdueFU.length}</span>}
                    </button>
                    <button onClick={() => setActionTab('tasks')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${actionTab === 'tasks' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>
                      <CheckSquare className="h-3 w-3" /> Tasks ({activeTasks.length})
                    </button>
                  </div>
                  <button onClick={() => navigate(actionTab === 'followups' ? '/sales/follow-ups' : '/sales/tasks')}
                    className="text-xs text-indigo-500 font-semibold hover:text-indigo-700 flex items-center gap-1">
                    All <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
                {actionTab === 'followups' ? (
                  overdueFU.length === 0 && todayFU.length === 0 ? (
                    <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <p className="text-xs text-emerald-600 font-medium">No follow-ups due today</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {[...overdueFU.slice(0, 2), ...todayFU.slice(0, 2)].map(fu => (
                        <FollowUpCard key={fu.id} followUp={fu} compact
                          onComplete={id => completeFollowUp(id, 'Completed from dashboard')}
                          onDismiss={dismissFollowUp} />
                      ))}
                      {overdueFU.length + todayFU.length > 4 && (
                        <button onClick={() => navigate('/sales/follow-ups')}
                          className="w-full text-xs text-indigo-500 font-semibold text-center py-2 hover:text-indigo-700">
                          +{overdueFU.length + todayFU.length - 4} more →
                        </button>
                      )}
                    </div>
                  )
                ) : (
                  activeTasks.length === 0 ? (
                    <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <p className="text-xs text-emerald-600 font-medium">All tasks done!</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {activeTasks.slice(0, 4).map(task => <TaskCard key={task.id} task={task} compact />)}
                      {activeTasks.length > 4 && (
                        <button onClick={() => navigate('/sales/tasks')}
                          className="w-full text-xs text-indigo-500 font-semibold text-center py-2 hover:text-indigo-700">
                          +{activeTasks.length - 4} more tasks →
                        </button>
                      )}
                    </div>
                  )
                )}
              </Card>
            </div>

            <div className="space-y-4">
              <Card padding="sm">
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="text-sm font-bold text-slate-700">Today's Route</h3>
                  <button onClick={() => navigate('/sales/route')}
                    className="text-xs text-indigo-500 font-semibold hover:text-indigo-700 flex items-center gap-1">
                    Open <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
                {routeStop.length === 0 ? (
                  <div className="text-center py-5">
                    <Route className="h-7 w-7 text-slate-200 mx-auto mb-1.5" />
                    <p className="text-xs text-slate-400">No route planned</p>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3 text-xs text-slate-500 mb-1.5">
                      <span className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-emerald-400" />{routeVisited} visited</span>
                      <span className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-indigo-400" />{routePending} pending</span>
                    </div>
                    {routeStop.slice(0, 4).map((s, i) => (
                      <div key={s.customerId} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs ${
                        s.status === 'Visited' ? 'bg-emerald-50 border-emerald-100 text-slate-400' :
                        s.status === 'Skipped' ? 'bg-slate-50 border-slate-100 text-slate-300' :
                        'bg-white border-slate-100 text-slate-700'
                      }`}>
                        <span className={`h-5 w-5 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                          s.status === 'Visited' ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
                        }`}>{i + 1}</span>
                        <span className="truncate font-semibold">{s.customerName}</span>
                        {s.hasOverdueCollection && <span className="ml-auto text-rose-500">£</span>}
                      </div>
                    ))}
                    {routeStop.length > 4 && <p className="text-xs text-slate-400 text-center pt-1">+{routeStop.length - 4} more stops</p>}
                  </div>
                )}
              </Card>

              <Card padding="sm">
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="text-sm font-bold text-slate-700">My Customers</h3>
                  <button onClick={() => navigate('/sales/customers')}
                    className="text-xs text-indigo-500 font-semibold hover:text-indigo-700 flex items-center gap-1">
                    All <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
                <div className="space-y-1">
                  {myCustomers.slice(0, 5).map(c => (
                    <div key={c.id} onClick={() => navigate(`/sales/customers/${c.id}`)}
                      className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                      <img src={c.image ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(c.storeName)}&background=e0e7ff&color=6366f1`}
                        className="h-8 w-8 rounded-lg object-cover flex-shrink-0" alt={c.storeName} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-700 truncate">{c.storeName}</p>
                        <p className={`text-xs ${c.walletBalance < 0 ? 'text-rose-500 font-medium' : 'text-slate-400'}`}>
                          {c.walletBalance < 0 ? `Owes £${Math.abs(c.walletBalance).toFixed(0)}` : `Bal £${c.walletBalance.toFixed(0)}`}
                        </p>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-slate-300 flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* ══ FIELD TAB ══ */}
      {dashTab === 'field' && (
        <div className="space-y-4">
          <WorkSessionBanner onToggle={handleToggleSession} />
          {activeVisit && <ActiveVisitPanel visit={activeVisit} onEnd={() => navigate('/sales/visits')} />}

          {/* Field Action Grid */}
          <div className="space-y-2.5">
            {/* Primary: Start Visit */}
            <button
              onClick={openVisitPicker}
              className="w-full flex items-center gap-4 px-5 py-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-2xl font-bold text-base transition-all shadow-md hover:shadow-lg">
              <div className="p-2 bg-white/20 rounded-xl flex-shrink-0">
                <MapPin className="h-5 w-5" />
              </div>
              <span className="flex-1 text-left">Start Visit</span>
              <ChevronRight className="h-4 w-4 opacity-60 flex-shrink-0" />
            </button>

            {/* Secondary: sheet openers */}
            <div className="grid grid-cols-2 gap-2.5">
              {fieldSecondaryActions.map(action => (
                <button
                  key={action.label}
                  onClick={() => openSheet(action.sheet)}
                  className="relative flex flex-col items-center justify-center gap-2 p-4 bg-white border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/40 rounded-2xl font-semibold text-xs text-slate-700 transition-all shadow-sm hover:shadow-md min-h-[80px]">
                  <div className={`p-2.5 ${action.iconBg} rounded-xl`}>
                    <action.icon className={`h-5 w-5 ${action.iconColor}`} />
                  </div>
                  {action.label}
                  {action.badge > 0 && (
                    <span className="absolute top-2 right-2 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                      {action.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Tertiary: My Customers navigate */}
            <button
              onClick={() => navigate('/sales/customers')}
              className="w-full flex items-center gap-3 px-4 py-3.5 bg-white border border-slate-100 hover:border-slate-200 hover:bg-slate-50 rounded-2xl font-semibold text-sm text-slate-700 transition-all shadow-sm">
              <div className="p-2 bg-slate-100 rounded-xl flex-shrink-0">
                <Users className="h-4 w-4 text-slate-600" />
              </div>
              <span className="flex-1 text-left">My Customers</span>
              <span className="text-xs text-slate-400 font-normal">{myCustomers.length} assigned</span>
              <ChevronRight className="h-4 w-4 text-slate-300 flex-shrink-0" />
            </button>
          </div>

          {/* Compact route preview — tap to open route sheet */}
          <Card padding="sm" className="cursor-pointer hover:shadow-md transition-all" onClick={() => openSheet('route')}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-violet-50 rounded-xl">
                  <Route className="h-4 w-4 text-violet-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-700">Today's Route</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {routeStop.length === 0 ? 'No route planned' : `${routeVisited} visited · ${routePending} pending`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {routePending > 0 && (
                  <span className="px-2 py-0.5 bg-violet-100 text-violet-700 text-xs font-bold rounded-full">{routePending} left</span>
                )}
                {routeStop.length === 0 && (
                  <span className="text-xs text-indigo-500 font-semibold">Plan →</span>
                )}
                <ChevronRight className="h-4 w-4 text-slate-300" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ══ BOTTOM SHEET (mobile) / MODAL (tablet+) ══ */}
      {activeSheet && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex flex-col justify-end sm:items-center sm:justify-center sm:p-6"
          onClick={closeSheet}>
          <div
            className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col w-full sm:max-w-lg sm:w-full"
            style={{ maxHeight: '82vh' }}
            onClick={e => e.stopPropagation()}>

            {/* Drag handle — mobile only */}
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0 sm:hidden">
              <div className="h-1 w-10 bg-slate-200 rounded-full" />
            </div>

            {/* Sheet header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 flex-shrink-0">
              <div>
                <h3 className="text-base font-bold text-slate-800">{sheetTitles[activeSheet].title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{sheetTitles[activeSheet].subtitle}</p>
              </div>
              <button onClick={closeSheet} className="p-1.5 rounded-xl hover:bg-slate-100 transition-colors">
                <X className="h-4 w-4 text-slate-500" />
              </button>
            </div>

            {/* Sheet body */}
            <div className="flex-1 overflow-y-auto px-4 py-4 min-h-0 space-y-2">

              {/* ── Route sheet ── */}
              {activeSheet === 'route' && (
                <>
                  {pendingStops.length === 0 ? (
                    <div className="text-center py-12">
                      <Route className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                      <p className="text-sm text-slate-400 mb-4">No pending stops</p>
                      <button
                        onClick={() => { closeSheet(); navigate('/sales/route'); }}
                        className="px-5 py-2.5 bg-violet-600 text-white text-sm font-bold rounded-xl">
                        Plan Route
                      </button>
                    </div>
                  ) : (
                    <>
                      {pendingStops.map((stop, idx) => (
                        <div key={stop.customerId}
                          className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl">
                          <span className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
                            {idx + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-800 truncate">{stop.customerName}</p>
                            {stop.address && <p className="text-xs text-slate-400 truncate mt-0.5">{stop.address}</p>}
                            <div className="flex gap-2 mt-0.5">
                              {stop.hasOverdueCollection && <span className="text-[10px] font-bold text-rose-500">£ owed</span>}
                              {stop.hasOverdueFollowUp && <span className="text-[10px] font-bold text-amber-500">FU due</span>}
                            </div>
                          </div>
                          {!activeVisit ? (
                            <button
                              onClick={() => { closeSheet(); setVisitModal({ customerId: stop.customerId, customerName: stop.customerName }); }}
                              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg flex-shrink-0 transition-colors">
                              Visit
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-400 flex-shrink-0">Active visit</span>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={() => { closeSheet(); navigate('/sales/route'); }}
                        className="w-full py-3 border border-slate-200 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors mt-1">
                        Edit Full Route →
                      </button>
                    </>
                  )}
                </>
              )}

              {/* ── Follow-Ups sheet ── */}
              {activeSheet === 'followups' && (
                overdueFU.length === 0 && todayFU.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle2 className="h-10 w-10 text-emerald-300 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-slate-400">All caught up!</p>
                    <p className="text-xs text-slate-300 mt-1">No follow-ups due today</p>
                  </div>
                ) : (
                  <>
                    {overdueFU.length > 0 && (
                      <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest pb-1">
                        Overdue ({overdueFU.length})
                      </p>
                    )}
                    {[...overdueFU, ...todayFU].map(fu => (
                      <FollowUpCard key={fu.id} followUp={fu} compact
                        onComplete={id => completeFollowUp(id, 'Completed from field')}
                        onDismiss={dismissFollowUp}
                      />
                    ))}
                  </>
                )
              )}

              {/* ── Collections sheet ── */}
              {activeSheet === 'collections' && (
                overdueCollections.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle2 className="h-10 w-10 text-emerald-300 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-slate-400">No outstanding balances</p>
                  </div>
                ) : (
                  overdueCollections.map(c => (
                    <div key={c.id} className="p-4 bg-white border border-slate-100 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={c.image ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(c.storeName)}&background=ffe4e6&color=e11d48`}
                            className="h-9 w-9 rounded-xl object-cover flex-shrink-0" alt={c.storeName} />
                          <div>
                            <p className="text-sm font-bold text-slate-800">{c.storeName}</p>
                            <p className="text-xs text-rose-500 font-semibold mt-0.5">Owes £{Math.abs(c.walletBalance).toFixed(2)}</p>
                          </div>
                        </div>
                        {collectionLogged.has(c.id) && (
                          <span className="flex items-center gap-1 text-xs text-emerald-600 font-bold">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Logged!
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">£</span>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder={Math.abs(c.walletBalance).toFixed(2)}
                            value={collectionAmounts[c.id] || ''}
                            onChange={e => setCollectionAmounts(prev => ({ ...prev, [c.id]: e.target.value }))}
                            className="w-full pl-7 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400"
                          />
                        </div>
                        <button
                          onClick={() => handleLogCollection(c.id, c.storeName, Math.abs(c.walletBalance))}
                          disabled={!collectionAmounts[c.id] || parseFloat(collectionAmounts[c.id]) <= 0}
                          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-colors flex-shrink-0">
                          Log
                        </button>
                      </div>
                    </div>
                  ))
                )
              )}

              {/* ── Tasks sheet ── */}
              {activeSheet === 'tasks' && (
                activeTasks.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle2 className="h-10 w-10 text-emerald-300 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-slate-400">All tasks done!</p>
                  </div>
                ) : (
                  activeTasks.map(task => (
                    <div key={task.id}
                      className="flex items-center gap-3 p-3.5 bg-white border border-slate-100 hover:border-slate-200 rounded-xl transition-colors">
                      <button
                        onClick={() => completeTask(task.id)}
                        className="h-5 w-5 rounded-md border-2 border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 flex-shrink-0 flex items-center justify-center transition-colors">
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slateetemail-800 truncate">{task.title}</p>
                        {task.dueDate && (
                          <p className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                            <Clock className="h-3 w-3" /> Due {task.dueDate}
                          </p>
                        )}
                      </div>
                      {task.priority === 'High' && (
                        <span className="text-[10px] font-bold text-rose-500 flex-shrink-0 uppercase">High</span>
                      )}
                    </div>
                  ))
                )
              )}

            </div>
          </div>
        </div>
      )}

      {/* ══ VISIT PICKER MODAL (field tab) ══ */}
      {showVisitPicker && !activeVisit && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-slate-100 flex-shrink-0">
              <h3 className="text-base font-bold text-slate-800">Start Visit</h3>
              <button onClick={() => { setShowVisitPicker(false); setPickerSearch(''); }}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex bg-slate-100 rounded-xl p-1 gap-1 mx-4 mt-4 flex-shrink-0">
              <button onClick={() => setPickerTab('route')}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${pickerTab === 'route' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>
                <Route className="h-3.5 w-3.5" /> My Route
                {pendingStops.length > 0 && (
                  <span className="ml-0.5 px-1.5 py-0.5 bg-violet-500 text-white text-[10px] font-bold rounded-full leading-none">
                    {pendingStops.length}
                  </span>
                )}
              </button>
              <button onClick={() => { setPickerTab('all'); setPickerSearch(''); }}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${pickerTab === 'all' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>
                <MapPin className="h-3.5 w-3.5" /> Any Customer
              </button>
            </div>

            {pickerTab === 'route' && (
              <div className="flex-1 overflow-y-auto px-4 py-3 min-h-0">
                {pendingStops.length === 0 ? (
                  <div className="text-center py-10">
                    <Route className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-slate-400 mb-1">No pending route stops</p>
                    <button onClick={() => setPickerTab('all')} className="text-indigo-500 text-sm font-bold">
                      Pick any customer →
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Today's pending stops</p>
                    {pendingStops.map((stop, idx) => (
                      <button key={stop.customerId} onClick={() => startVisitFor(stop.customerId, stop.customerName)}
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all text-left group">
                        <span className="h-8 w-8 rounded-full bg-slate-100 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center font-bold text-sm flex-shrink-0 text-slate-600 transition-colors">
                          {idx + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-800 truncate">{stop.customerName}</p>
                          {stop.address && <p className="text-xs text-slate-400 truncate mt-0.5">{stop.address}</p>}
                          <div className="flex gap-2 mt-0.5">
                            {stop.hasOverdueCollection && <span className="text-[10px] font-bold text-rose-500 flex items-center gap-0.5"><AlertCircle className="h-3 w-3" /> Owes</span>}
                            {stop.hasOverdueFollowUp && <span className="text-[10px] font-bold text-amber-500 flex items-center gap-0.5"><Clock className="h-3 w-3" /> FU due</span>}
                          </div>
                        </div>
                        {stop.priority === 'High' && <span className="px-2 py-0.5 bg-rose-50 text-rose-600 text-[10px] font-bold rounded-full flex-shrink-0">HIGH</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {pickerTab === 'all' && (
              <>
                <div className="px-4 pt-3 pb-2 flex-shrink-0">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <input value={pickerSearch} onChange={e => setPickerSearch(e.target.value)}
                      placeholder="Search customers..." autoFocus
                      className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto px-4 pb-4 min-h-0">
                  {filteredCustomers.length === 0 ? (
                    <p className="text-center text-sm text-slate-400 py-8">No customers found</p>
                  ) : (
                    <div className="space-y-1">
                      {filteredCustomers.map(c => (
                        <button key={c.id} onClick={() => startVisitFor(c.id, c.storeName)}
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

      {/* VisitWorkflowModal */}
      {visitModal && !activeVisit && (
        <VisitWorkflowModal
          customerId={visitModal.customerId}
          customerName={visitModal.customerName}
          onComplete={() => setVisitModal(null)}
          onClose={() => setVisitModal(null)}
        />
      )}

      {lastSummary && <SessionSummaryModal summary={lastSummary} onClose={clearLastSummary} />}
    </div>
  );
};

export default RepDashboard;
