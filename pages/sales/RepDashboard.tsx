import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, Users, Plus, Phone,
  ChevronRight, CheckCircle2, TrendingUp, Route,
  CheckSquare, Banknote, Calendar, Briefcase, Navigation,
  AlertCircle,
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
  } = useSalesExecution();

  const [dashTab, setDashTab] = useState<'office' | 'field'>('office');
  const [actionTab, setActionTab] = useState<'followups' | 'tasks'>('followups');
  const [visitModal, setVisitModal] = useState<{ customerId: string; customerName: string } | null>(null);

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

  // Week context from historical sessions
  const mySessions = WORK_SESSIONS.filter(s => s.repId === repId).slice(0, 6);
  const weekVisits = mySessions.reduce((a, s) => a + s.totalVisits, 0) + todayStats.visits;
  const weekOrders = mySessions.reduce((a, s) => a + s.totalOrders, 0) + todayStats.orders;
  const weekCollections = mySessions.reduce((a, s) => a + s.totalCollections, 0) + todayStats.collections;

  const handleToggleSession = () => {
    if (isOnline) endSession();
    else startSession(repId, repName);
  };

  // Field action grid
  const fieldActions = [
    { label: 'Start Visit',  icon: MapPin,       color: 'bg-indigo-600 hover:bg-indigo-700',   action: () => navigate('/sales/visits') },
    { label: 'My Route',     icon: Route,        color: 'bg-violet-600 hover:bg-violet-700',   action: () => navigate('/sales/route') },
    { label: 'Follow-Ups',   icon: Phone,        color: 'bg-amber-500 hover:bg-amber-600',     action: () => navigate('/sales/follow-ups') },
    { label: 'Collections',  icon: Banknote,     color: 'bg-emerald-600 hover:bg-emerald-700', action: () => navigate('/sales/collections') },
    { label: 'Tasks',        icon: CheckSquare,  color: 'bg-blue-600 hover:bg-blue-700',       action: () => navigate('/sales/tasks') },
    { label: 'My Customers', icon: Users,        color: 'bg-slate-700 hover:bg-slate-800',     action: () => navigate('/sales/customers') },
  ];

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

      {/* ══════════════════════════════════
           OFFICE TAB
         ══════════════════════════════════ */}
      {dashTab === 'office' && (
        <div className="space-y-4">
          {/* Live / Historic toggle */}
          <ViewModeToggle />

          {/* Work Session Banner */}
          <WorkSessionBanner onToggle={handleToggleSession} />

          {/* Active Visit */}
          {activeVisit && (
            <ActiveVisitPanel visit={activeVisit} onEnd={() => navigate('/sales/visits')} />
          )}

          {/* Grouped KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <RepGroupedKpiCard
              title="TODAY'S ACTIVITY"
              icon={MapPin}
              color="indigo"
              onClick={() => navigate('/sales/visits')}
              items={[
                { label: 'VISITS', value: metrics.visitsCompleted, trend: routeStop.length > 0 ? `${routeVisited}/${routeStop.length} stops` : 'no route', trendColor: 'text-slate-400' },
                { label: 'ORDERS', value: todayStats.orders, trend: `£${todayStats.revenue.toLocaleString()}`, trendColor: 'text-emerald-500' },
                { label: 'COLLECTED', value: `£${todayStats.collections.toLocaleString()}`, trend: 'cash in', trendColor: 'text-slate-400' },
                { label: 'FOLLOW-UPS', value: overdueFU.length + todayFU.length, trend: overdueFU.length > 0 ? `${overdueFU.length} overdue` : 'on track', trendColor: overdueFU.length > 0 ? 'text-rose-500' : 'text-emerald-500' },
              ]}
            />
            <RepGroupedKpiCard
              title="ROUTE STATUS"
              icon={Route}
              color="violet"
              onClick={() => navigate('/sales/route')}
              items={[
                { label: 'TOTAL STOPS', value: routeStop.length || '—', trend: 'planned', trendColor: 'text-slate-400' },
                { label: 'VISITED', value: routeVisited, trend: routeStop.length > 0 ? `${Math.round(routeVisited / routeStop.length * 100)}%` : '—', trendColor: 'text-emerald-500' },
                { label: 'PENDING', value: routePending, trend: routePending > 0 ? 'remaining' : 'clear', trendColor: routePending > 0 ? 'text-amber-500' : 'text-emerald-500' },
                { label: 'ALERTS', value: overdueFU.length, trend: overdueFU.length > 0 ? 'overdue FU' : 'none', trendColor: overdueFU.length > 0 ? 'text-rose-500' : 'text-emerald-500' },
              ]}
            />
            <RepGroupedKpiCard
              title="MY PIPELINE"
              icon={Users}
              color="blue"
              onClick={() => navigate('/sales/customers')}
              items={[
                { label: 'CUSTOMERS', value: myCustomers.length, trend: 'assigned', trendColor: 'text-slate-400' },
                { label: 'ACTIVE LEADS', value: activeLeads.length, trend: `${myLeads.length} total`, trendColor: 'text-slate-400' },
                { label: 'OPEN TASKS', value: activeTasks.length, trend: activeTasks.length > 0 ? 'pending' : 'clear', trendColor: activeTasks.length > 0 ? 'text-amber-500' : 'text-emerald-500' },
                { label: 'FU RATE', value: myCustomers.length > 0 ? `${Math.round((overdueFU.length + todayFU.length) / myCustomers.length * 100)}%` : '0%', trend: 'of portfolio', trendColor: 'text-slate-400' },
              ]}
            />
            <RepGroupedKpiCard
              title="THIS WEEK"
              icon={TrendingUp}
              color="emerald"
              onClick={() => navigate('/sales/reporting')}
              items={[
                { label: 'VISITS', value: weekVisits, trend: `${mySessions.length + 1} sessions`, trendColor: 'text-slate-400' },
                { label: 'ORDERS', value: weekOrders, trend: weekOrders > 0 ? 'booked' : 'none yet', trendColor: weekOrders > 0 ? 'text-emerald-500' : 'text-slate-400' },
                { label: 'COLLECTED', value: `£${weekCollections.toLocaleString()}`, trend: 'cash in', trendColor: 'text-slate-400' },
                { label: 'CUSTOMERS HIT', value: mySessions.length + 1, trend: 'days active', trendColor: 'text-slate-400' },
              ]}
            />
          </div>

          {/* Quick Actions */}
          <Card padding="sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2.5">Quick Actions</p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Start Visit',  color: 'bg-indigo-600 text-white hover:bg-indigo-700', icon: <MapPin className="h-3.5 w-3.5" />,     path: '/sales/visits' },
                { label: 'My Route',     color: 'bg-violet-600 text-white hover:bg-violet-700', icon: <Route className="h-3.5 w-3.5" />,       path: '/sales/route' },
                { label: 'Follow-Ups',   color: 'bg-amber-500 text-white hover:bg-amber-600',   icon: <Phone className="h-3.5 w-3.5" />,        path: '/sales/follow-ups' },
                { label: 'Tasks',        color: 'bg-blue-600 text-white hover:bg-blue-700',     icon: <CheckSquare className="h-3.5 w-3.5" />,  path: '/sales/tasks' },
                { label: 'Collections',  color: 'bg-emerald-600 text-white hover:bg-emerald-700',icon: <Banknote className="h-3.5 w-3.5" />,   path: '/sales/collections' },
                { label: 'Add Lead',     color: 'bg-slate-700 text-white hover:bg-slate-800',   icon: <Plus className="h-3.5 w-3.5" />,         path: '/sales/leads' },
              ].map(action => (
                <button key={action.label} onClick={() => navigate(action.path)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${action.color}`}>
                  {action.icon} {action.label}
                </button>
              ))}
            </div>
          </Card>

          {/* Productivity */}
          <ProductivityWidget metrics={metrics} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left — Follow-Ups + Tasks */}
            <div className="lg:col-span-2">
              <Card padding="sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex bg-slate-100 rounded-lg p-0.5 gap-0.5">
                    <button onClick={() => setActionTab('followups')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${actionTab === 'followups' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>
                      <Phone className="h-3 w-3" /> Follow-Ups
                      {overdueFU.length > 0 && (
                        <span className="ml-0.5 px-1.5 py-0.5 bg-rose-500 text-white text-xs font-bold rounded-full leading-none">{overdueFU.length}</span>
                      )}
                    </button>
                    <button onClick={() => setActionTab('tasks')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${actionTab === 'tasks' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>
                      <CheckSquare className="h-3 w-3" /> Tasks ({activeTasks.length})
                    </button>
                  </div>
                  <button
                    onClick={() => navigate(actionTab === 'followups' ? '/sales/follow-ups' : '/sales/tasks')}
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
                          onDismiss={dismissFollowUp}
                        />
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
                      {activeTasks.slice(0, 4).map(task => (
                        <TaskCard key={task.id} task={task} compact />
                      ))}
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

            {/* Right — Route + Customers */}
            <div className="space-y-4">
              {/* Today's Route */}
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
                    <p className="text-xs text-slate-300 mt-0.5">Go to Route to plan</p>
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
                    {routeStop.length > 4 && (
                      <p className="text-xs text-slate-400 text-center pt-1">+{routeStop.length - 4} more stops</p>
                    )}
                  </div>
                )}
              </Card>

              {/* My Customers */}
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
                      <img
                        src={c.image ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(c.storeName)}&background=e0e7ff&color=6366f1`}
                        className="h-8 w-8 rounded-lg object-cover flex-shrink-0"
                        alt={c.storeName}
                      />
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

      {/* ══════════════════════════════════
           FIELD TAB
         ══════════════════════════════════ */}
      {dashTab === 'field' && (
        <div className="space-y-4">
          {/* Work Session Banner — prominent */}
          <WorkSessionBanner onToggle={handleToggleSession} />

          {/* Active Visit — dominant if present */}
          {activeVisit && (
            <ActiveVisitPanel visit={activeVisit} onEnd={() => navigate('/sales/visits')} />
          )}

          {/* Field Action Grid — 2×3 large tap targets */}
          <div className="grid grid-cols-2 gap-3">
            {fieldActions.map(action => (
              <button
                key={action.label}
                onClick={action.action}
                className={`flex flex-col items-center justify-center gap-2.5 p-5 ${action.color} text-white rounded-2xl font-bold text-sm transition-colors min-h-[84px] shadow-sm`}>
                <action.icon className="h-6 w-6" />
                {action.label}
              </button>
            ))}
          </div>

          {/* Today's Route — full list with Visit buttons */}
          <Card padding="sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-700">Today's Route</h3>
                {routeStop.length > 0 && (
                  <p className="text-xs text-slate-400 mt-0.5">{routeVisited} visited · {routePending} pending</p>
                )}
              </div>
              <button onClick={() => navigate('/sales/route')}
                className="text-xs text-indigo-500 font-semibold hover:text-indigo-700 flex items-center gap-1">
                {routeStop.length === 0 ? 'Plan Route' : 'Edit'} <ChevronRight className="h-3 w-3" />
              </button>
            </div>

            {routeStop.length === 0 ? (
              <div className="text-center py-8">
                <Route className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-400 mb-1">No route planned today</p>
                <p className="text-xs text-slate-300 mb-4">Plan your stops before heading out</p>
                <button onClick={() => navigate('/sales/route')}
                  className="px-4 py-2 bg-violet-600 text-white text-xs font-bold rounded-xl">
                  Plan Today's Route
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {routeStop.map((s, i) => (
                  <div
                    key={s.customerId}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                      s.status === 'Visited'
                        ? 'bg-emerald-50 border-emerald-100'
                        : s.status === 'Skipped'
                        ? 'bg-slate-50 border-slate-100 opacity-60'
                        : 'bg-white border-slate-100'
                    }`}>
                    {/* Stop number */}
                    <span className={`h-7 w-7 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                      s.status === 'Visited' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>{i + 1}</span>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate ${s.status !== 'Pending' ? 'text-slate-400' : 'text-slate-800'}`}>
                        {s.customerName}
                      </p>
                      {(s.hasOverdueCollection || s.hasOverdueFollowUp) && s.status === 'Pending' && (
                        <div className="flex items-center gap-2 mt-0.5">
                          {s.hasOverdueCollection && (
                            <span className="flex items-center gap-0.5 text-[10px] font-bold text-rose-500">
                              <AlertCircle className="h-3 w-3" /> Owes payment
                            </span>
                          )}
                          {s.hasOverdueFollowUp && (
                            <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-500">
                              <AlertCircle className="h-3 w-3" /> Follow-up due
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Action / Status */}
                    {s.status === 'Visited' ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                    ) : s.status === 'Pending' && !activeVisit ? (
                      <button
                        onClick={() => setVisitModal({ customerId: s.customerId, customerName: s.customerName })}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg flex-shrink-0 transition-colors">
                        Visit
                      </button>
                    ) : s.status === 'Pending' && activeVisit ? (
                      <span className="text-[10px] text-slate-400 font-semibold flex-shrink-0">Active visit</span>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Urgent Follow-Ups — overdue only, max 3 */}
          {overdueFU.length > 0 && (
            <Card padding="sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-rose-700 flex items-center gap-2">
                  <span className="h-2 w-2 bg-rose-500 rounded-full animate-pulse" />
                  Overdue Follow-Ups
                  <span className="px-1.5 py-0.5 bg-rose-500 text-white text-[10px] font-bold rounded-full leading-none">
                    {overdueFU.length}
                  </span>
                </h3>
                <button onClick={() => navigate('/sales/follow-ups')}
                  className="text-xs text-indigo-500 font-semibold hover:text-indigo-700 flex items-center gap-1">
                  All <ChevronRight className="h-3 w-3" />
                </button>
              </div>
              <div className="space-y-2">
                {overdueFU.slice(0, 3).map(fu => (
                  <FollowUpCard key={fu.id} followUp={fu} compact
                    onComplete={id => completeFollowUp(id, 'Completed from field dashboard')}
                    onDismiss={dismissFollowUp}
                  />
                ))}
                {overdueFU.length > 3 && (
                  <button onClick={() => navigate('/sales/follow-ups')}
                    className="w-full text-xs text-indigo-500 font-semibold text-center py-1.5 hover:text-indigo-700">
                    +{overdueFU.length - 3} more overdue →
                  </button>
                )}
              </div>
            </Card>
          )}

          {/* My Customers — compact */}
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
                  <img
                    src={c.image ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(c.storeName)}&background=e0e7ff&color=6366f1`}
                    className="h-8 w-8 rounded-lg object-cover flex-shrink-0"
                    alt={c.storeName}
                  />
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
      )}

      {/* Visit Workflow Modal — shared between tabs */}
      {visitModal && !activeVisit && (
        <VisitWorkflowModal
          customerId={visitModal.customerId}
          customerName={visitModal.customerName}
          onComplete={() => setVisitModal(null)}
          onClose={() => setVisitModal(null)}
        />
      )}

      {/* Session Summary Modal */}
      {lastSummary && <SessionSummaryModal summary={lastSummary} onClose={clearLastSummary} />}
    </div>
  );
};

export default RepDashboard;
