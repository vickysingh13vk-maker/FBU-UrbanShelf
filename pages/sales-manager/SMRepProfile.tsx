import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Mail, Shield, MapPin, ShoppingCart, Wallet,
  TrendingUp, Users, Calendar, Clock, AlertTriangle,
  Activity, Target, Repeat, Filter,
} from 'lucide-react';
import { Card, Badge, Button, Table, THead, TBody, TR, TH, TD } from '../../components/ui';
import { useSalesManager } from '../../context/SalesManagerContext';
import PerformanceBar from '../../components/sales-manager/PerformanceBar';
import {
  USERS, WORK_SESSIONS, ORDERS, CUSTOMERS,
  VISITS, COLLECTION_ATTEMPTS, FOLLOW_UPS, TASKS, LEADS,
} from '../../data';

// ─── Types ────────────────────────────────────────────────────────────────────

type ActivityType = 'All' | 'Visit' | 'Order' | 'Collection' | 'Follow-Up' | 'Task' | 'Lead' | 'Session';

interface ActivityEvent {
  id:       string;
  type:     Exclude<ActivityType, 'All'>;
  date:     Date;
  title:    string;
  subtitle: string;
  status?:  string;
  amount?:  number;
}

type Tab = 'overview' | 'orders' | 'visits' | 'collections' | 'leads' | 'tasks' | 'activity';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  `£${n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const fmtDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const fmtDateTime = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) +
    ' ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
};

const lcVariant = (stage?: string): any => {
  if (stage === 'Active')   return 'success';
  if (stage === 'New' || stage === 'Prospect') return 'info';
  if (stage === 'Inactive') return 'secondary';
  if (stage === 'At Risk')  return 'warning';
  if (stage === 'Churned')  return 'danger';
  return 'secondary';
};

const statusVariant = (s?: string): any => {
  if (!s) return 'secondary';
  const sl = s.toLowerCase();
  if (sl === 'completed' || sl === 'paid' || sl === 'delivered' || sl === 'active') return 'success';
  if (sl === 'overdue' || sl === 'disputed' || sl === 'cancelled') return 'danger';
  if (sl === 'in progress' || sl === 'partially paid') return 'warning';
  if (sl === 'pending' || sl === 'new lead' || sl === 'contacted') return 'info';
  return 'secondary';
};

const ACTIVITY_COLORS: Record<Exclude<ActivityType, 'All'>, string> = {
  Visit:      'bg-blue-50 text-blue-600',
  Order:      'bg-indigo-50 text-indigo-600',
  Collection: 'bg-amber-50 text-amber-600',
  'Follow-Up':'bg-purple-50 text-purple-600',
  Task:       'bg-rose-50 text-rose-600',
  Lead:       'bg-emerald-50 text-emerald-600',
  Session:    'bg-slate-100 text-slate-600',
};

const ACTIVITY_ICONS: Record<Exclude<ActivityType, 'All'>, React.FC<any>> = {
  Visit:      MapPin,
  Order:      ShoppingCart,
  Collection: Wallet,
  'Follow-Up':Repeat,
  Task:       Target,
  Lead:       Users,
  Session:    Clock,
};

// ─── Component ────────────────────────────────────────────────────────────────

const SMRepProfile: React.FC = () => {
  const { repId } = useParams<{ repId: string }>();
  const navigate  = useNavigate();
  const { repStatuses, repPerformance } = useSalesManager();

  const [activeTab,     setActiveTab]    = useState<Tab>('overview');
  const [activityType,  setActivityType] = useState<ActivityType>('All');
  const [dateFrom,      setDateFrom]     = useState('');
  const [dateTo,        setDateTo]       = useState('');

  // ── Rep data ──────────────────────────────────────────────────────────────
  const repUser      = USERS.find(u => u.id === repId);
  const repStatus    = repStatuses.find(r => r.repId === repId);
  const repPerf      = repPerformance.find(p => p.repId === repId && p.period === 'daily');

  const customers    = useMemo(() => CUSTOMERS.filter(c => c.assignedRepId === repId), [repId]);
  const orders       = useMemo(() => ORDERS.filter(o => o.repId === repId), [repId]);
  const visits       = useMemo(() => VISITS.filter(v => v.repId === repId), [repId]);
  const collections  = useMemo(() => COLLECTION_ATTEMPTS.filter(c => c.repId === repId), [repId]);
  const leads        = useMemo(() => LEADS.filter(l => l.repId === repId), [repId]);
  const tasks        = useMemo(() => TASKS.filter(t => t.repId === repId), [repId]);
  const followUps    = useMemo(() => FOLLOW_UPS.filter(f => f.repId === repId), [repId]);
  const sessions     = useMemo(() => WORK_SESSIONS.filter(s => s.repId === repId), [repId]);

  // ── Derived stats ─────────────────────────────────────────────────────────
  const totalRevenue      = orders.filter(o => o.paymentStatus === 'Paid').reduce((s, o) => s + o.total, 0);
  const totalCollected    = collections.reduce((s, c) => s + c.amountCollected, 0);
  const overdueFollowUps  = followUps.filter(f => f.status === 'Overdue').length;
  const overdueTasks      = tasks.filter(t => t.status === 'Overdue').length;
  const activeLeads       = leads.filter(l => l.stage !== 'Converted' && l.stage !== 'Lost').length;
  const completedVisits   = visits.filter(v => v.status === 'completed').length;

  // ── Activity log synthesis ────────────────────────────────────────────────
  const allEvents = useMemo((): ActivityEvent[] => {
    const events: ActivityEvent[] = [];

    visits.forEach(v => events.push({
      id: v.id, type: 'Visit',
      date: new Date(v.startTime ?? v.date),
      title: `Visit — ${v.customerName}`,
      subtitle: `${v.durationMinutes ?? 0} min · ${v.objectives?.filter(o => o.completed).length ?? 0}/${v.objectives?.length ?? 0} objectives`,
      status: v.status,
    }));

    orders.forEach(o => {
      const [dd, mm, yyyy] = o.date.split('/');
      events.push({
        id: o.id, type: 'Order',
        date: new Date(`${yyyy}-${mm}-${dd}`),
        title: `Order #${o.id} — ${o.customer}`,
        subtitle: `${o.items} items`,
        status: o.status,
        amount: o.total,
      });
    });

    collections.forEach(c => events.push({
      id: c.id, type: 'Collection',
      date: new Date(c.attemptDate),
      title: `Collection — ${c.customerName}`,
      subtitle: `Requested ${fmt(c.amountRequested)}`,
      status: c.status,
      amount: c.amountCollected,
    }));

    followUps.forEach(f => events.push({
      id: f.id, type: 'Follow-Up',
      date: new Date(f.completedAt ?? f.dueDate),
      title: `${f.type} — ${f.customerName ?? f.leadName ?? '—'}`,
      subtitle: f.notes,
      status: f.status,
    }));

    tasks.forEach(t => events.push({
      id: t.id, type: 'Task',
      date: new Date(t.completedAt ?? t.dueDate),
      title: t.title,
      subtitle: t.description ?? t.customerName ?? '',
      status: t.status,
    }));

    leads.forEach(l => events.push({
      id: l.id, type: 'Lead',
      date: new Date(l.createdDate),
      title: `Lead — ${l.businessName}`,
      subtitle: l.contactName ?? '',
      status: l.stage,
    }));

    sessions.forEach(s => events.push({
      id: s.id, type: 'Session',
      date: new Date(s.startTime),
      title: `Work Session`,
      subtitle: `${s.totalVisits}v · ${s.totalOrders}o · ${fmt(s.totalCollections ?? 0)} collected`,
      status: s.status,
    }));

    return events.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [visits, orders, collections, followUps, tasks, leads, sessions]);

  // ── Activity counts per type ──────────────────────────────────────────────
  const activityCounts: Record<ActivityType, number> = useMemo(() => ({
    All:          allEvents.length,
    Visit:        allEvents.filter(e => e.type === 'Visit').length,
    Order:        allEvents.filter(e => e.type === 'Order').length,
    Collection:   allEvents.filter(e => e.type === 'Collection').length,
    'Follow-Up':  allEvents.filter(e => e.type === 'Follow-Up').length,
    Task:         allEvents.filter(e => e.type === 'Task').length,
    Lead:         allEvents.filter(e => e.type === 'Lead').length,
    Session:      allEvents.filter(e => e.type === 'Session').length,
  }), [allEvents]);

  // ── Activity filtered ─────────────────────────────────────────────────────
  const filteredActivity = useMemo(() => allEvents.filter(e => {
    const matchType = activityType === 'All' || e.type === activityType;
    const matchFrom = !dateFrom || e.date >= new Date(dateFrom);
    const matchTo   = !dateTo   || e.date <= new Date(dateTo + 'T23:59:59');
    return matchType && matchFrom && matchTo;
  }), [allEvents, activityType, dateFrom, dateTo]);

  // ── 404 guard ─────────────────────────────────────────────────────────────
  if (!repUser && !repStatus) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Users className="h-12 w-12 text-slate-200 mb-4" />
        <p className="text-slate-500 font-semibold">Rep not found</p>
        <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate('/sales-manager/team')}>
          Back to Team
        </Button>
      </div>
    );
  }

  const repName  = repStatus?.repName ?? repUser?.name ?? 'Unknown Rep';
  const repImage = repStatus?.repImage ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(repName)}&background=e0e7ff&color=6366f1`;

  const STATUS_BG: Record<string, string> = {
    'Online – In Visit':   'bg-emerald-100 text-emerald-700',
    'Online – Travelling': 'bg-blue-100 text-blue-700',
    'Online – Idle':       'bg-amber-100 text-amber-700',
    'Offline':             'bg-slate-100 text-slate-500',
  };
  const liveStatus = repStatus?.status ?? 'Offline';

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* Back */}
      <button
        onClick={() => navigate('/sales-manager/team')}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Team
      </button>

      {/* ── Identity card ──────────────────────────────────────────────────── */}
      <Card padding="md">
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <img src={repImage} alt={repName} className="h-20 w-20 rounded-2xl object-cover flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <h1 className="text-2xl font-black text-slate-800">{repName}</h1>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold">
                    <Shield className="h-3.5 w-3.5" /> {repUser?.roleName ?? 'Sales Rep'}
                  </span>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${STATUS_BG[liveStatus] ?? 'bg-slate-100 text-slate-500'}`}>
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-current mr-1.5 align-middle" />
                    {liveStatus}
                  </span>
                  <Badge variant={repUser?.status === 'Active' ? 'success' : 'danger'} size="sm">
                    {repUser?.status ?? 'Active'}
                  </Badge>
                </div>
              </div>
              <div className="text-right text-xs text-slate-400 space-y-0.5">
                <p className="font-mono">{repId}</p>
                <p>Since {repUser?.createdDate ?? '—'}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-3 flex-wrap">
              {repUser?.email && (
                <a href={`mailto:${repUser.email}`} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 transition-colors">
                  <Mail className="h-4 w-4" /> {repUser.email}
                </a>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* ── KPI strips ────────────────────────────────────────────────────── */}
      {/* Today live */}
      {repStatus && (
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Today (Live)</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Visits',    value: repStatus.todayVisits,                                   icon: MapPin,       color: 'text-blue-700',   bg: 'bg-blue-50' },
              { label: 'Orders',    value: repStatus.todayOrders,                                   icon: ShoppingCart, color: 'text-indigo-700', bg: 'bg-indigo-50' },
              { label: 'Collected', value: fmt(repStatus.todayCollections),                         icon: Wallet,       color: 'text-amber-700',  bg: 'bg-amber-50' },
              { label: 'Route',     value: `${repStatus.routeProgress.visited}/${repStatus.routeProgress.total}`, icon: MapPin, color: 'text-slate-700', bg: 'bg-slate-50' },
            ].map(({ label, value, icon: Icon, color, bg }) => (
              <Card key={label} padding="md">
                <div className="flex items-center gap-3">
                  <div className={`h-9 w-9 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`h-4 w-4 ${color}`} />
                  </div>
                  <div>
                    <p className={`text-xl font-black ${color}`}>{value}</p>
                    <p className="text-xs text-slate-500">{label}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* All-time */}
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">All-Time</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { label: 'Customers',     value: customers.length,             color: 'text-slate-800' },
            { label: 'Total Orders',  value: orders.length,                color: 'text-slate-800' },
            { label: 'Revenue Paid',  value: fmt(totalRevenue),            color: 'text-emerald-700' },
            { label: 'Visits Done',   value: completedVisits,              color: 'text-blue-700' },
            { label: 'Collected',     value: fmt(totalCollected),          color: 'text-amber-700' },
            { label: 'Active Leads',  value: activeLeads,                  color: 'text-indigo-700' },
            { label: 'Overdue',       value: overdueFollowUps + overdueTasks, color: overdueTasks + overdueFollowUps > 0 ? 'text-rose-700' : 'text-slate-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 shadow-sm">
              <p className={`text-base font-black ${color} leading-tight`}>{value}</p>
              <p className="text-xs text-slate-400 truncate leading-tight mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Performance targets ───────────────────────────────────────────── */}
      {repPerf && (
        <Card padding="md">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Today's Targets</p>
          <div className="space-y-3">
            <PerformanceBar label="Visits"         value={repPerf.visitsCompleted}                    target={repPerf.visitsTarget} />
            <PerformanceBar label="Revenue"        value={repPerf.revenueGenerated}                   target={repPerf.revenueTarget} prefix="£" colorClass="bg-emerald-500" />
            <PerformanceBar label="Follow-Up Rate" value={Math.round(repPerf.followUpCompletionRate)} target={100}                  suffix="%" colorClass="bg-amber-500" />
          </div>
        </Card>
      )}

      {/* ── Tabs ──────────────────────────────────────────────────────────── */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-0">
        {([
          ['overview',    'Overview',     customers.length],
          ['orders',      'Orders',       orders.length],
          ['visits',      'Visits',       visits.length],
          ['collections', 'Collections',  collections.length],
          ['leads',       'Leads',        leads.length],
          ['tasks',       'Tasks & Follow-Ups', tasks.length + followUps.length],
          ['activity',    'Activity Log', allEvents.length],
        ] as [Tab, string, number][]).map(([t, label, count]) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === t
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {label}
            <span className={`ml-1.5 px-1.5 py-0.5 text-xs rounded-full font-bold ${
              activeTab === t ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'
            }`}>{count}</span>
          </button>
        ))}
      </div>

      {/* ── Overview ─────────────────────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <Card padding="none" className="overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-700">Assigned Customers ({customers.length})</h2>
          </div>
          <Table>
            <THead>
              <TR>
                <TH>Customer</TH>
                <TH>Lifecycle</TH>
                <TH>Status</TH>
                <TH>Wallet</TH>
                <TH>Last Contact</TH>
                <TH>Next Follow-Up</TH>
              </TR>
            </THead>
            <TBody>
              {customers.length === 0 ? (
                <TR><TD colSpan={6}><div className="py-10 text-center text-slate-400 text-sm">No customers assigned.</div></TD></TR>
              ) : customers.map(c => (
                <TR key={c.id}>
                  <TD>
                    <div className="flex items-center gap-2">
                      {c.image
                        ? <img src={c.image} alt={c.name} className="h-8 w-8 rounded-full object-cover" />
                        : <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700">{c.name.charAt(0)}</div>
                      }
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{c.name}</p>
                        <p className="text-xs text-slate-400">{c.storeName ?? c.companyName}</p>
                      </div>
                    </div>
                  </TD>
                  <TD><Badge variant={lcVariant(c.lifecycleStage)} size="sm">{c.lifecycleStage}</Badge></TD>
                  <TD><Badge variant={c.status === 'Approved' ? 'success' : c.status === 'Pending' ? 'warning' : 'danger'} size="sm">{c.status}</Badge></TD>
                  <TD><span className="text-sm font-medium text-slate-700">{fmt(c.walletBalance ?? 0)}</span></TD>
                  <TD><span className="text-xs text-slate-500">{c.lastContactDate ? fmtDate(c.lastContactDate) : '—'}</span></TD>
                  <TD><span className="text-xs text-slate-500">{c.nextFollowUp ? fmtDate(c.nextFollowUp) : '—'}</span></TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </Card>
      )}

      {/* ── Orders ───────────────────────────────────────────────────────── */}
      {activeTab === 'orders' && (
        <Card padding="none" className="overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-700">Orders ({orders.length})</h2>
            <div className="flex gap-4 text-xs text-slate-500">
              <span>Revenue paid: <span className="font-bold text-emerald-700">{fmt(totalRevenue)}</span></span>
              <span>Orders delivered: <span className="font-bold text-slate-800">{orders.filter(o => o.status === 'Delivered').length}</span></span>
            </div>
          </div>
          <Table>
            <THead>
              <TR><TH>Order #</TH><TH>Customer</TH><TH>Date</TH><TH>Items</TH><TH>Total</TH><TH>Status</TH><TH>Payment</TH></TR>
            </THead>
            <TBody>
              {orders.length === 0 ? (
                <TR><TD colSpan={7}><div className="py-10 text-center text-slate-400 text-sm">No orders.</div></TD></TR>
              ) : orders.map(o => (
                <TR key={o.id}>
                  <TD><span className="text-sm font-bold text-indigo-600">#{o.id}</span></TD>
                  <TD><span className="text-sm text-slate-700">{o.customer}</span></TD>
                  <TD><span className="text-xs text-slate-500">{o.date}</span></TD>
                  <TD><span className="text-sm text-slate-700">{o.items}</span></TD>
                  <TD><span className="text-sm font-bold text-slate-800">{fmt(o.total)}</span></TD>
                  <TD><Badge variant={statusVariant(o.status)} size="sm">{o.status}</Badge></TD>
                  <TD><Badge variant={o.paymentStatus === 'Paid' ? 'success' : o.paymentStatus === 'Refunded' ? 'info' : 'warning'} size="sm">{o.paymentStatus}</Badge></TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </Card>
      )}

      {/* ── Visits ───────────────────────────────────────────────────────── */}
      {activeTab === 'visits' && (
        <Card padding="none" className="overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-700">Visits ({visits.length})</h2>
            <span className="text-xs text-slate-500">Completed: <span className="font-bold text-emerald-700">{completedVisits}</span></span>
          </div>
          <Table>
            <THead>
              <TR><TH>Visit ID</TH><TH>Customer</TH><TH>Date</TH><TH>Duration</TH><TH>Objectives</TH><TH>Order</TH><TH>Status</TH></TR>
            </THead>
            <TBody>
              {visits.length === 0 ? (
                <TR><TD colSpan={7}><div className="py-10 text-center text-slate-400 text-sm">No visits.</div></TD></TR>
              ) : visits.map(v => (
                <TR key={v.id}>
                  <TD><span className="text-xs font-mono text-slate-500">{v.id}</span></TD>
                  <TD>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{v.customerName}</p>
                    </div>
                  </TD>
                  <TD><span className="text-xs text-slate-500">{v.date}</span></TD>
                  <TD><span className="text-sm text-slate-700">{v.durationMinutes ?? '—'} min</span></TD>
                  <TD>
                    <span className="text-sm text-slate-700">
                      {v.objectives?.filter(o => o.completed).length ?? 0}/{v.objectives?.length ?? 0}
                    </span>
                  </TD>
                  <TD>
                    {v.outcome?.orderId
                      ? <span className="text-sm font-medium text-indigo-600">#{v.outcome.orderId}</span>
                      : <span className="text-sm text-slate-400">—</span>
                    }
                  </TD>
                  <TD><Badge variant={statusVariant(v.status)} size="sm">{v.status}</Badge></TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </Card>
      )}

      {/* ── Collections ──────────────────────────────────────────────────── */}
      {activeTab === 'collections' && (
        <Card padding="none" className="overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-700">Collection Attempts ({collections.length})</h2>
            <div className="flex gap-4 text-xs text-slate-500">
              <span>Collected: <span className="font-bold text-emerald-700">{fmt(totalCollected)}</span></span>
              <span>Overdue: <span className="font-bold text-rose-700">{collections.filter(c => c.status === 'Overdue').length}</span></span>
            </div>
          </div>
          <Table>
            <THead>
              <TR><TH>ID</TH><TH>Customer</TH><TH>Date</TH><TH>Requested</TH><TH>Collected</TH><TH>Remaining</TH><TH>Status</TH></TR>
            </THead>
            <TBody>
              {collections.length === 0 ? (
                <TR><TD colSpan={7}><div className="py-10 text-center text-slate-400 text-sm">No collection attempts.</div></TD></TR>
              ) : collections.map(c => (
                <TR key={c.id}>
                  <TD><span className="text-xs font-mono text-slate-500">{c.id}</span></TD>
                  <TD><span className="text-sm font-semibold text-slate-800">{c.customerName}</span></TD>
                  <TD><span className="text-xs text-slate-500">{fmtDate(c.attemptDate)}</span></TD>
                  <TD><span className="text-sm text-slate-700">{fmt(c.amountRequested)}</span></TD>
                  <TD><span className={`text-sm font-bold ${c.amountCollected > 0 ? 'text-emerald-700' : 'text-slate-400'}`}>{fmt(c.amountCollected)}</span></TD>
                  <TD><span className="text-sm text-rose-700 font-medium">{fmt(Math.max(0, c.amountRequested - c.amountCollected))}</span></TD>
                  <TD><Badge variant={statusVariant(c.status)} size="sm">{c.status}</Badge></TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </Card>
      )}

      {/* ── Leads ────────────────────────────────────────────────────────── */}
      {activeTab === 'leads' && (
        <Card padding="none" className="overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-700">Leads ({leads.length})</h2>
            <span className="text-xs text-slate-500">Active: <span className="font-bold text-indigo-700">{activeLeads}</span></span>
          </div>
          <Table>
            <THead>
              <TR><TH>Business</TH><TH>Contact</TH><TH>Category</TH><TH>Stage</TH><TH>Priority</TH><TH>Created</TH><TH>Next Follow-Up</TH></TR>
            </THead>
            <TBody>
              {leads.length === 0 ? (
                <TR><TD colSpan={7}><div className="py-10 text-center text-slate-400 text-sm">No leads.</div></TD></TR>
              ) : leads.map(l => (
                <TR key={l.id}>
                  <TD>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{l.businessName}</p>
                      {l.address && <p className="text-xs text-slate-400 truncate max-w-[160px]">{l.address}</p>}
                    </div>
                  </TD>
                  <TD>
                    <div>
                      <p className="text-sm text-slate-700">{l.contactName ?? '—'}</p>
                      {l.phone && <p className="text-xs text-slate-400">{l.phone}</p>}
                    </div>
                  </TD>
                  <TD><span className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">{l.category}</span></TD>
                  <TD><Badge variant={statusVariant(l.stage)} size="sm">{l.stage}</Badge></TD>
                  <TD>
                    <Badge variant={l.priority === 'High' ? 'danger' : l.priority === 'Medium' ? 'warning' : 'secondary'} size="sm">
                      {l.priority}
                    </Badge>
                  </TD>
                  <TD><span className="text-xs text-slate-500">{fmtDate(l.createdDate)}</span></TD>
                  <TD><span className="text-xs text-slate-500">{l.nextFollowUp ? fmtDate(l.nextFollowUp) : '—'}</span></TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </Card>
      )}

      {/* ── Tasks & Follow-Ups ───────────────────────────────────────────── */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          {/* Tasks */}
          <Card padding="none" className="overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-700">Tasks ({tasks.length})</h2>
              <div className="flex gap-3 text-xs text-slate-500">
                <span>Overdue: <span className="font-bold text-rose-700">{overdueTasks}</span></span>
                <span>Completed: <span className="font-bold text-emerald-700">{tasks.filter(t => t.status === 'Completed').length}</span></span>
              </div>
            </div>
            <Table>
              <THead>
                <TR><TH>Task</TH><TH>Type</TH><TH>Customer</TH><TH>Priority</TH><TH>Due</TH><TH>Status</TH></TR>
              </THead>
              <TBody>
                {tasks.length === 0 ? (
                  <TR><TD colSpan={6}><div className="py-8 text-center text-slate-400 text-sm">No tasks.</div></TD></TR>
                ) : tasks.map(t => (
                  <TR key={t.id}>
                    <TD>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{t.title}</p>
                        {t.description && <p className="text-xs text-slate-400 truncate max-w-[200px]">{t.description}</p>}
                      </div>
                    </TD>
                    <TD><span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{t.type}</span></TD>
                    <TD><span className="text-sm text-slate-600">{t.customerName ?? '—'}</span></TD>
                    <TD><Badge variant={t.priority === 'High' ? 'danger' : t.priority === 'Medium' ? 'warning' : 'secondary'} size="sm">{t.priority}</Badge></TD>
                    <TD><span className="text-xs text-slate-500">{t.dueDate}</span></TD>
                    <TD><Badge variant={statusVariant(t.status)} size="sm">{t.status}</Badge></TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </Card>

          {/* Follow-Ups */}
          <Card padding="none" className="overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-700">Follow-Ups ({followUps.length})</h2>
              <div className="flex gap-3 text-xs text-slate-500">
                <span>Overdue: <span className="font-bold text-rose-700">{overdueFollowUps}</span></span>
                <span>Completed: <span className="font-bold text-emerald-700">{followUps.filter(f => f.status === 'Completed').length}</span></span>
              </div>
            </div>
            <Table>
              <THead>
                <TR><TH>Type</TH><TH>Customer / Lead</TH><TH>Priority</TH><TH>Due</TH><TH>Status</TH><TH>Notes</TH></TR>
              </THead>
              <TBody>
                {followUps.length === 0 ? (
                  <TR><TD colSpan={6}><div className="py-8 text-center text-slate-400 text-sm">No follow-ups.</div></TD></TR>
                ) : followUps.map(f => (
                  <TR key={f.id}>
                    <TD><span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-medium">{f.type}</span></TD>
                    <TD><span className="text-sm text-slate-700">{f.customerName ?? f.leadName ?? '—'}</span></TD>
                    <TD><Badge variant={f.priority === 'High' ? 'danger' : f.priority === 'Medium' ? 'warning' : 'secondary'} size="sm">{f.priority}</Badge></TD>
                    <TD><span className="text-xs text-slate-500">{f.dueDate}</span></TD>
                    <TD><Badge variant={statusVariant(f.status)} size="sm">{f.status}</Badge></TD>
                    <TD><span className="text-xs text-slate-500 line-clamp-1 max-w-[180px]">{f.notes ?? '—'}</span></TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </Card>
        </div>
      )}

      {/* ── Activity Log ─────────────────────────────────────────────────── */}
      {activeTab === 'activity' && (
        <div className="space-y-4">
          {/* Filters */}
          <Card padding="md">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <div className="flex items-center gap-1.5">
                <Filter className="h-4 w-4 text-slate-400" />
                <span className="text-sm font-semibold text-slate-600">Filter:</span>
              </div>
              {/* Type filter chips */}
              <div className="flex flex-wrap gap-1.5 flex-1">
                {(['All', 'Visit', 'Order', 'Collection', 'Follow-Up', 'Task', 'Lead', 'Session'] as ActivityType[]).map(t => (
                  <button
                    key={t}
                    onClick={() => setActivityType(t)}
                    className={`px-2.5 py-1 rounded-full text-xs font-bold transition-colors ${
                      activityType === t
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {t}
                    <span className={`ml-1 ${activityType === t ? 'text-indigo-200' : 'text-slate-400'}`}>
                      {activityCounts[t]}
                    </span>
                  </button>
                ))}
              </div>
              {/* Date range */}
              <div className="flex items-center gap-2 text-sm">
                <input
                  type="date"
                  value={dateFrom}
                  onChange={e => setDateFrom(e.target.value)}
                  className="border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  placeholder="From"
                />
                <span className="text-slate-400">—</span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={e => setDateTo(e.target.value)}
                  className="border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  placeholder="To"
                />
                {(dateFrom || dateTo) && (
                  <button
                    onClick={() => { setDateFrom(''); setDateTo(''); }}
                    className="text-xs text-rose-500 hover:text-rose-700 font-medium"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </Card>

          {/* Count summary */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-700">{filteredActivity.length}</span>
            <span className="text-sm text-slate-500">
              event{filteredActivity.length !== 1 ? 's' : ''}
              {activityType !== 'All' ? ` · ${activityType}` : ''}
              {(dateFrom || dateTo) ? ` · ${dateFrom || '…'} → ${dateTo || '…'}` : ''}
            </span>
          </div>

          {/* Timeline */}
          {filteredActivity.length === 0 ? (
            <Card padding="lg" className="text-center py-12">
              <Activity className="h-10 w-10 text-slate-200 mx-auto mb-3" />
              <p className="text-sm text-slate-400">No activity matches these filters.</p>
            </Card>
          ) : (() => {
            // Group by calendar date
            const dateKey = (d: Date) => d.toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' });
            const groups = filteredActivity.reduce<Record<string, ActivityEvent[]>>((acc, e) => {
              const k = dateKey(e.date);
              if (!acc[k]) acc[k] = [];
              acc[k].push(e);
              return acc;
            }, {});
            const sortedDates = Object.keys(groups).sort((a, b) => {
              const [da, ma, ya] = a.split('/');
              const [db, mb, yb] = b.split('/');
              return new Date(`${yb}-${mb}-${db}`).getTime() - new Date(`${ya}-${ma}-${da}`).getTime();
            });

            const isToday = (k: string) => {
              const [d, m, y] = k.split('/');
              const t = new Date();
              return parseInt(y) === t.getFullYear() && parseInt(m) === t.getMonth() + 1 && parseInt(d) === t.getDate();
            };
            const isYesterday = (k: string) => {
              const [d, m, y] = k.split('/');
              const t = new Date(); t.setDate(t.getDate() - 1);
              return parseInt(y) === t.getFullYear() && parseInt(m) === t.getMonth() + 1 && parseInt(d) === t.getDate();
            };
            const fmtGroupLabel = (k: string) => {
              if (isToday(k))     return 'Today';
              if (isYesterday(k)) return 'Yesterday';
              const [d, m, y] = k.split('/');
              return new Date(`${y}-${m}-${d}`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
            };

            return (
              <div className="space-y-6">
                {sortedDates.map(dateGroup => (
                  <div key={dateGroup}>
                    {/* Date header */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 text-white rounded-full">
                        <Calendar className="h-3.5 w-3.5 text-slate-300" />
                        <span className="text-xs font-bold">{fmtGroupLabel(dateGroup)}</span>
                      </div>
                      <span className="text-xs text-slate-400">{groups[dateGroup].length} event{groups[dateGroup].length !== 1 ? 's' : ''}</span>
                      <div className="flex-1 h-px bg-slate-100" />
                    </div>

                    {/* Events for this date */}
                    <div className="relative">
                      <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-slate-100 z-0" />
                      <div className="space-y-3">
                        {groups[dateGroup].map(event => {
                          const Icon = ACTIVITY_ICONS[event.type];
                          const colorCls = ACTIVITY_COLORS[event.type];
                          return (
                            <div key={`${event.type}-${event.id}`} className="relative flex items-start gap-3 pl-1">
                              <div className={`relative z-10 h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 ${colorCls}`}>
                                <Icon className="h-4 w-4" />
                              </div>
                              <div className="flex-1 bg-white border border-slate-100 rounded-xl px-4 py-3 shadow-sm min-w-0">
                                <div className="flex items-start justify-between gap-2 flex-wrap">
                                  <div className="min-w-0">
                                    <p className="text-sm font-bold text-slate-800">{event.title}</p>
                                    {event.subtitle && (
                                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{event.subtitle}</p>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    {event.amount !== undefined && event.amount > 0 && (
                                      <span className="text-xs font-bold text-emerald-700">{fmt(event.amount)}</span>
                                    )}
                                    {event.status && (
                                      <Badge variant={statusVariant(event.status)} size="sm">{event.status}</Badge>
                                    )}
                                  </div>
                                </div>
                                <p className="text-xs text-slate-400 mt-1.5">
                                  {event.date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default SMRepProfile;
