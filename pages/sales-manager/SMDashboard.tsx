import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, ShoppingCart, Wallet, MapPin, AlertTriangle,
  TrendingUp, ChevronRight, Activity, Bell
} from 'lucide-react';
import { Card } from '../../components/ui';
import { useSalesManager } from '../../context/SalesManagerContext';
import RepStatusCard from '../../components/sales-manager/RepStatusCard';
import CustomerHealthCard from '../../components/sales-manager/CustomerHealthCard';
import AlertCard from '../../components/sales-manager/AlertCard';

const SMDashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    repStatuses, teamAnalytics,
    getAtRiskCustomers, getUnreadAlerts, getCriticalAlerts,
    dismissAlert, markAlertRead,
  } = useSalesManager();

  const atRisk = getAtRiskCustomers().slice(0, 4);
  const unread = getUnreadAlerts();
  const critical = getCriticalAlerts();
  const visibleAlerts = [...critical, ...unread.filter(a => a.severity !== 'Critical')].slice(0, 4);

  const onlineReps = repStatuses.filter(r => r.status !== 'Offline');

  const kpis = [
    { label: 'Reps Online', value: `${teamAnalytics.onlineReps}/${teamAnalytics.totalReps}`, icon: <Users className="h-5 w-5 text-indigo-500" />, bg: 'bg-indigo-50', sub: `${teamAnalytics.idleReps} idle`, onClick: () => navigate('/sales-manager/team') },
    { label: 'Visits Today', value: teamAnalytics.todayVisits, icon: <MapPin className="h-5 w-5 text-blue-500" />, bg: 'bg-blue-50', sub: `${teamAnalytics.activeVisits} active`, onClick: () => navigate('/sales-manager/team') },
    { label: 'Orders Today', value: teamAnalytics.todayOrders, icon: <ShoppingCart className="h-5 w-5 text-violet-500" />, bg: 'bg-violet-50', sub: `£${teamAnalytics.todayRevenue.toLocaleString()}`, onClick: () => navigate('/sales-manager/orders') },
    { label: 'Collections', value: `£${teamAnalytics.todayCollections.toLocaleString()}`, icon: <Wallet className="h-5 w-5 text-emerald-500" />, bg: 'bg-emerald-50', sub: 'Recovered today', onClick: () => navigate('/sales-manager/payments') },
    { label: 'At-Risk Customers', value: teamAnalytics.highRiskCustomers, icon: <AlertTriangle className="h-5 w-5 text-rose-500" />, bg: 'bg-rose-50', sub: 'Need attention', onClick: () => navigate('/sales-manager/customer-health') },
    { label: 'Open Alerts', value: unread.length, icon: <Bell className="h-5 w-5 text-amber-500" />, bg: 'bg-amber-50', sub: `${critical.length} critical`, onClick: () => navigate('/sales-manager/alerts') },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Ops Intelligence</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        {critical.length > 0 && (
          <button onClick={() => navigate('/sales-manager/alerts')}
            className="flex items-center gap-2 bg-rose-50 border border-rose-200 rounded-2xl px-4 py-2 text-sm font-bold text-rose-700 hover:bg-rose-100 transition-colors">
            <AlertTriangle className="h-4 w-4" />
            {critical.length} Critical Alert{critical.length > 1 ? 's' : ''}
          </button>
        )}
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map(k => (
          <Card key={k.label} padding="md" className="cursor-pointer hover:shadow-md transition-all" onClick={k.onClick}>
            <div className={`h-9 w-9 ${k.bg} rounded-xl flex items-center justify-center mb-2`}>
              {k.icon}
            </div>
            <p className="text-xl font-black text-slate-800">{k.value}</p>
            <p className="text-xs font-semibold text-slate-500 mt-0.5 leading-tight">{k.label}</p>
            <p className="text-xs text-slate-400 mt-0.5">{k.sub}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left col — Reps + Alerts */}
        <div className="lg:col-span-2 space-y-5">

          {/* Live Rep Statuses */}
          <Card padding="md">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Activity className="h-4 w-4 text-emerald-500" />
                Live Team Activity
              </h3>
              <button onClick={() => navigate('/sales-manager/team')}
                className="text-xs text-indigo-500 font-semibold hover:text-indigo-700 flex items-center gap-1">
                Full View <ChevronRight className="h-3 w-3" />
              </button>
            </div>
            {onlineReps.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-6">No reps currently online</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {onlineReps.map(r => (
                  <RepStatusCard key={r.repId} rep={r} onClick={() => navigate('/sales-manager/team')} />
                ))}
              </div>
            )}
          </Card>

          {/* Operational Alerts */}
          <Card padding="md">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Bell className="h-4 w-4 text-amber-500" />
                Operational Alerts
                {unread.length > 0 && (
                  <span className="px-1.5 py-0.5 bg-rose-100 text-rose-600 text-xs font-bold rounded-full">{unread.length}</span>
                )}
              </h3>
              <button onClick={() => navigate('/sales-manager/alerts')}
                className="text-xs text-indigo-500 font-semibold hover:text-indigo-700 flex items-center gap-1">
                All <ChevronRight className="h-3 w-3" />
              </button>
            </div>
            {visibleAlerts.length === 0 ? (
              <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl">
                <TrendingUp className="h-4 w-4 text-emerald-500" />
                <p className="text-xs text-emerald-600 font-medium">No active alerts — team running smooth</p>
              </div>
            ) : (
              <div className="space-y-2">
                {visibleAlerts.map(a => (
                  <AlertCard key={a.id} alert={a} onDismiss={dismissAlert} onRead={markAlertRead} />
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right col — At-Risk + Quick Nav */}
        <div className="space-y-5">

          {/* At-Risk Customers */}
          <Card padding="md">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-rose-500" />
                At-Risk Customers
              </h3>
              <button onClick={() => navigate('/sales-manager/customer-health')}
                className="text-xs text-indigo-500 font-semibold hover:text-indigo-700 flex items-center gap-1">
                All <ChevronRight className="h-3 w-3" />
              </button>
            </div>
            {atRisk.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No high-risk customers</p>
            ) : (
              <div className="space-y-2">
                {atRisk.map(c => (
                  <CustomerHealthCard key={c.customerId} health={c} />
                ))}
              </div>
            )}
          </Card>

          {/* Quick Nav */}
          <Card padding="md">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Quick Access</p>
            <div className="space-y-1">
              {[
                { label: 'Team Monitoring', href: '/sales-manager/team' },
                { label: 'Customer Health', href: '/sales-manager/customer-health' },
                { label: 'Leads Pipeline', href: '/sales-manager/leads' },
                { label: 'Territories', href: '/sales-manager/territories' },
                { label: 'Analytics', href: '/sales-manager/analytics' },
                { label: 'Reports', href: '/sales-manager/reports' },
              ].map(item => (
                <button key={item.href} onClick={() => navigate(item.href)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-50 text-sm font-medium text-slate-700 transition-colors">
                  {item.label}
                  <ChevronRight className="h-4 w-4 text-slate-300" />
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SMDashboard;
