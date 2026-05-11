import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, ShoppingCart, Wallet, Users, Plus, Phone,
  ChevronRight, CheckCircle2, TrendingUp, Route,
  CheckSquare, Banknote, Calendar,
} from 'lucide-react';
import { Card } from '../../components/ui';
import WorkSessionBanner from '../../components/sales/WorkSessionBanner';
import SessionSummaryModal from '../../components/sales/SessionSummaryModal';
import ActiveVisitPanel from '../../components/sales/ActiveVisitPanel';
import ProductivityWidget from '../../components/sales/ProductivityWidget';
import FollowUpCard from '../../components/sales/FollowUpCard';
import TaskCard from '../../components/sales/TaskCard';
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

const RepDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isOnline, startSession, endSession, todayStats, elapsedSeconds, lastSummary, clearLastSummary } = useWorkSession();
  const { getRepCustomers, getRepLeads } = useSalesCRM();
  const {
    getActiveVisit, getTodayFollowUps, getOverdueFollowUps, getRepTasks,
    completeFollowUp, dismissFollowUp, getProductivityMetrics, getTodayRoute,
  } = useSalesExecution();

  const [actionTab, setActionTab] = useState<'followups' | 'tasks'>('followups');

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

      {/* Work Session Banner */}
      <WorkSessionBanner onToggle={handleToggleSession} />

      {/* Active Visit */}
      {activeVisit && (
        <ActiveVisitPanel visit={activeVisit} onEnd={() => navigate('/sales/visits')} />
      )}

      {/* Today KPIs — horizontal compact cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: 'Visits Today',
            value: metrics.visitsCompleted,
            icon: <MapPin className="h-4 w-4 text-indigo-500" />,
            bg: 'bg-indigo-50',
            sub: routeStop.length > 0 ? `${routeVisited}/${routeStop.length} route` : 'No route',
            onClick: () => navigate('/sales/visits'),
          },
          {
            label: 'Orders Today',
            value: todayStats.orders,
            icon: <ShoppingCart className="h-4 w-4 text-blue-500" />,
            bg: 'bg-blue-50',
            sub: `£${todayStats.revenue.toLocaleString()} revenue`,
            onClick: undefined,
          },
          {
            label: 'Collections',
            value: `£${todayStats.collections.toLocaleString()}`,
            icon: <Wallet className="h-4 w-4 text-emerald-500" />,
            bg: 'bg-emerald-50',
            sub: 'Recovered today',
            onClick: () => navigate('/sales/collections'),
          },
          {
            label: 'Follow-Ups',
            value: overdueFU.length + todayFU.length,
            icon: <Phone className="h-4 w-4 text-amber-500" />,
            bg: 'bg-amber-50',
            sub: overdueFU.length > 0 ? `${overdueFU.length} overdue` : `${todayFU.length} due today`,
            onClick: () => navigate('/sales/follow-ups'),
          },
        ].map(card => (
          <Card key={card.label} padding="sm"
            className={`${card.onClick ? 'cursor-pointer hover:shadow-md' : ''} transition-all`}
            onClick={card.onClick}>
            <div className="flex items-center gap-3">
              <div className={`h-9 w-9 ${card.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                {card.icon}
              </div>
              <div className="min-w-0">
                <p className="text-xl font-black text-slate-800 leading-tight">{card.value}</p>
                <p className="text-xs font-semibold text-slate-600 truncate">{card.label}</p>
                <p className="text-xs text-slate-400 truncate">{card.sub}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Week Context Strip */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {[
          { label: 'Week Visits',      value: weekVisits,            color: 'text-indigo-600', icon: <MapPin className="h-3.5 w-3.5" /> },
          { label: 'Week Orders',      value: weekOrders,            color: 'text-blue-600',   icon: <ShoppingCart className="h-3.5 w-3.5" /> },
          { label: 'Collections',      value: `£${weekCollections}`, color: 'text-emerald-600',icon: <Wallet className="h-3.5 w-3.5" /> },
          { label: 'Customers',        value: myCustomers.length,    color: 'text-slate-700',  icon: <Users className="h-3.5 w-3.5" /> },
          { label: 'Active Leads',     value: activeLeads.length,    color: 'text-violet-600', icon: <TrendingUp className="h-3.5 w-3.5" /> },
          { label: 'Open Tasks',       value: activeTasks.length,    color: 'text-amber-600',  icon: <CheckSquare className="h-3.5 w-3.5" /> },
        ].map(s => (
          <div key={s.label} className="bg-white border border-slate-100 rounded-xl px-3 py-2.5 flex items-center gap-2.5 shadow-sm">
            <span className={`${s.color} flex-shrink-0`}>{s.icon}</span>
            <div className="min-w-0">
              <p className={`text-sm font-black ${s.color} leading-tight`}>{s.value}</p>
              <p className="text-xs text-slate-400 truncate leading-tight">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions — compact pill buttons */}
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
        {/* Left — Follow-Ups + Tasks (tabbed, saves one full card height) */}
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
                <p className="text-xs text-slate-300 mt-0.5">Set by your manager</p>
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

      {/* Session Summary Modal */}
      {lastSummary && <SessionSummaryModal summary={lastSummary} onClose={clearLastSummary} />}
    </div>
  );
};

export default RepDashboard;
