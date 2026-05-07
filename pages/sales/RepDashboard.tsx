import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, ShoppingCart, Wallet, Users, Plus, Phone, RefreshCw, FileText,
  ChevronRight, Clock, AlertCircle, CheckCircle2, TrendingUp, Route,
  CheckSquare, Banknote, Calendar
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

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map(n => String(n).padStart(2, '0')).join(':');
}

const QuickAction: React.FC<{ icon: React.ReactNode; label: string; color: string; onClick: () => void }> = ({ icon, label, color, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-slate-50 transition-all group"
  >
    <div className={`h-11 w-11 ${color} rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}>
      {icon}
    </div>
    <span className="text-xs font-semibold text-slate-600 text-center leading-tight">{label}</span>
  </button>
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

  const repId = user?.id ?? '';
  const repName = user?.name ?? '';

  const myCustomers = getRepCustomers(repId);
  const myLeads = getRepLeads(repId);
  const activeLeads = myLeads.filter(l => l.stage !== 'Converted' && l.stage !== 'Lost');

  const activeVisit = getActiveVisit(repId);
  const todayFU = getTodayFollowUps(repId);
  const overdueFU = getOverdueFollowUps(repId);
  const activeTasks = getRepTasks(repId).filter(t => t.status !== 'Completed').slice(0, 3);
  const metrics = getProductivityMetrics(repId);
  const todayRoute = getTodayRoute(repId);
  const routeStop = todayRoute?.stops ?? [];
  const routeVisited = routeStop.filter(s => s.status === 'Visited').length;
  const routePending = routeStop.filter(s => s.status === 'Pending').length;

  const handleToggleSession = () => {
    if (isOnline) endSession();
    else startSession(repId, repName);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800">My Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        {isOnline && (
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-2">
            <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-sm font-mono font-bold text-emerald-700">{formatTime(elapsedSeconds)}</span>
          </div>
        )}
      </div>

      {/* Work Session Banner */}
      <WorkSessionBanner onToggle={handleToggleSession} />

      {/* Active Visit — always show if exists */}
      {activeVisit && (
        <ActiveVisitPanel visit={activeVisit} onEnd={() => navigate('/sales/visits')} />
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: 'Visits Today',
            value: metrics.visitsCompleted,
            icon: <MapPin className="h-5 w-5 text-indigo-500" />,
            bg: 'bg-indigo-50',
            sub: `${routeVisited}/${routeStop.length} route stops`,
            onClick: () => navigate('/sales/visits'),
          },
          {
            label: 'Orders Today',
            value: todayStats.orders,
            icon: <ShoppingCart className="h-5 w-5 text-blue-500" />,
            bg: 'bg-blue-50',
            sub: `£${todayStats.revenue.toLocaleString()} revenue`,
            onClick: undefined,
          },
          {
            label: 'Collections',
            value: `£${metrics.collectionsRecovered > 0 ? metrics.collectionsRecovered.toFixed(0) : todayStats.collections.toLocaleString()}`,
            icon: <Wallet className="h-5 w-5 text-emerald-500" />,
            bg: 'bg-emerald-50',
            sub: 'Recovered today',
            onClick: () => navigate('/sales/collections'),
          },
          {
            label: 'Follow-Ups',
            value: overdueFU.length + todayFU.length,
            icon: <Phone className="h-5 w-5 text-amber-500" />,
            bg: 'bg-amber-50',
            sub: overdueFU.length > 0 ? `${overdueFU.length} overdue` : `${todayFU.length} due today`,
            onClick: () => navigate('/sales/follow-ups'),
          },
        ].map(card => (
          <Card key={card.label} padding="md" className={card.onClick ? 'cursor-pointer hover:shadow-md transition-all' : ''}
            onClick={card.onClick}>
            <div className={`h-10 w-10 ${card.bg} rounded-xl flex items-center justify-center mb-3`}>
              {card.icon}
            </div>
            <p className="text-2xl font-black text-slate-800">{card.value}</p>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">{card.label}</p>
            <p className="text-xs text-slate-400 mt-1">{card.sub}</p>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card padding="md">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Quick Actions</p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1">
          <QuickAction icon={<MapPin className="h-5 w-5 text-white" />}       label="Start Visit"   color="bg-indigo-500"  onClick={() => navigate('/sales/visits')} />
          <QuickAction icon={<Route className="h-5 w-5 text-white" />}        label="My Route"      color="bg-violet-500"  onClick={() => navigate('/sales/route')} />
          <QuickAction icon={<Phone className="h-5 w-5 text-white" />}        label="Follow-Ups"    color="bg-amber-500"   onClick={() => navigate('/sales/follow-ups')} />
          <QuickAction icon={<CheckSquare className="h-5 w-5 text-white" />}  label="Tasks"         color="bg-blue-500"    onClick={() => navigate('/sales/tasks')} />
          <QuickAction icon={<Banknote className="h-5 w-5 text-white" />}     label="Collections"   color="bg-emerald-500" onClick={() => navigate('/sales/collections')} />
          <QuickAction icon={<Plus className="h-5 w-5 text-white" />}         label="Add Lead"      color="bg-slate-500"   onClick={() => navigate('/sales/leads')} />
        </div>
      </Card>

      {/* Productivity Metrics */}
      <ProductivityWidget metrics={metrics} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left — Follow-Ups + Tasks */}
        <div className="lg:col-span-2 space-y-5">

          {/* Today's Follow-Ups */}
          <Card padding="md">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-700">
                Today's Follow-Ups
                {overdueFU.length > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 bg-rose-100 text-rose-600 text-xs font-bold rounded-full">{overdueFU.length} overdue</span>
                )}
              </h3>
              <button onClick={() => navigate('/sales/follow-ups')}
                className="text-xs text-indigo-500 font-semibold hover:text-indigo-700 flex items-center gap-1">
                All <ChevronRight className="h-3 w-3" />
              </button>
            </div>
            {overdueFU.length === 0 && todayFU.length === 0 ? (
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
            )}
          </Card>

          {/* Tasks */}
          <Card padding="md">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-700">Active Tasks</h3>
              <button onClick={() => navigate('/sales/tasks')}
                className="text-xs text-indigo-500 font-semibold hover:text-indigo-700 flex items-center gap-1">
                All <ChevronRight className="h-3 w-3" />
              </button>
            </div>
            {activeTasks.length === 0 ? (
              <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <p className="text-xs text-emerald-600 font-medium">All tasks done!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {activeTasks.map(task => (
                  <TaskCard key={task.id} task={task} compact />
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right — Route + Customers */}
        <div className="space-y-5">

          {/* Today's Route */}
          <Card padding="md">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-700">Today's Route</h3>
              <button onClick={() => navigate('/sales/route')}
                className="text-xs text-indigo-500 font-semibold hover:text-indigo-700 flex items-center gap-1">
                Open <ChevronRight className="h-3 w-3" />
              </button>
            </div>
            {routeStop.length === 0 ? (
              <div className="text-center py-6">
                <Route className="h-8 w-8 text-slate-200 mx-auto mb-2" />
                <p className="text-xs text-slate-400">No route planned</p>
                <p className="text-xs text-slate-300 mt-1">Set by your manager</p>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                  <span className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-emerald-400" />{routeVisited} visited</span>
                  <span className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-indigo-400" />{routePending} pending</span>
                </div>
                {routeStop.slice(0, 4).map((s, i) => (
                  <div key={s.customerId} className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs ${
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
          <Card padding="md">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-700">My Customers</h3>
              <button onClick={() => navigate('/sales/customers')}
                className="text-xs text-indigo-500 font-semibold hover:text-indigo-700 flex items-center gap-1">
                All <ChevronRight className="h-3 w-3" />
              </button>
            </div>
            <div className="space-y-2">
              {myCustomers.slice(0, 4).map(c => (
                <div key={c.id} onClick={() => navigate(`/sales/customers/${c.id}`)}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer">
                  <img
                    src={c.image ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(c.storeName)}&background=e0e7ff&color=6366f1`}
                    className="h-9 w-9 rounded-xl object-cover flex-shrink-0"
                    alt={c.storeName}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-700 truncate">{c.storeName}</p>
                    <p className={`text-xs font-medium ${c.walletBalance < 0 ? 'text-rose-500' : 'text-slate-400'}`}>
                      {c.walletBalance < 0 ? `Owes £${Math.abs(c.walletBalance).toFixed(2)}` : `Balance £${c.walletBalance.toFixed(2)}`}
                    </p>
                  </div>
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
