import React, { useState } from 'react';
import { TrendingUp, Target, Award, Calendar } from 'lucide-react';
import { Card } from '../../components/ui';
import { useSalesCRM } from '../../context/SalesCRMContext';
import { useWorkSession } from '../../context/WorkSessionContext';
import { useAuth } from '../../context/AuthContext';
import { WORK_SESSIONS } from '../../data';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Area, AreaChart,
} from 'recharts';

const WEEKLY_DATA = [
  { day: 'Mon', visits: 8, orders: 3 },
  { day: 'Tue', visits: 12, orders: 5 },
  { day: 'Wed', visits: 7, orders: 2 },
  { day: 'Thu', visits: 10, orders: 4 },
  { day: 'Fri', visits: 9, orders: 3 },
  { day: 'Sat', visits: 5, orders: 2 },
  { day: 'Sun', visits: 0, orders: 0 },
];

const TARGET_DATA = [
  { week: 'W1', actual: 4200, target: 5000 },
  { week: 'W2', actual: 5100, target: 5000 },
  { week: 'W3', actual: 4700, target: 5000 },
  { week: 'W4', actual: 6200, target: 6000 },
];

const COMMISSION_ENTRIES = [
  { id: 'C001', orderId: '326', customer: 'James Cameron', amount: 118.63, status: 'Earned' },
  { id: 'C002', orderId: '325', customer: 'Sarah Connor', amount: 12.00, status: 'Pending' },
  { id: 'C003', orderId: '322', customer: 'James Cameron', amount: 26.50, status: 'Earned' },
  { id: 'C004', orderId: '324', customer: 'Rick Deckard', amount: 26.00, status: 'Pending' },
];

const PERIOD_OPTIONS = ['This Week', 'This Month', 'Last Month'] as const;
type Period = typeof PERIOD_OPTIONS[number];

const RepReporting: React.FC = () => {
  const { user } = useAuth();
  const { todayStats } = useWorkSession();
  const { getRepCustomers, getRepLeads } = useSalesCRM();
  const [period, setPeriod] = useState<Period>('This Week');

  const repId = user?.id ?? '';
  const myCustomers = getRepCustomers(repId);
  const myLeads = getRepLeads(repId);

  const historicalSessions = WORK_SESSIONS.filter(s => s.repId === repId);

  const totalHistVisits = historicalSessions.reduce((s, ws) => s + ws.totalVisits, 0) + todayStats.visits;
  const totalHistOrders = historicalSessions.reduce((s, ws) => s + ws.totalOrders, 0) + todayStats.orders;
  const totalHistCollections = historicalSessions.reduce((s, ws) => s + ws.totalCollections, 0) + todayStats.collections;
  const totalHistRevenue = historicalSessions.reduce((s, ws) => s + ws.totalRevenue, 0);

  const earnedCommission = COMMISSION_ENTRIES.filter(e => e.status === 'Earned').reduce((s, e) => s + e.amount, 0);
  const pendingCommission = COMMISSION_ENTRIES.filter(e => e.status === 'Pending').reduce((s, e) => s + e.amount, 0);

  const activeLeads = myLeads.filter(l => l.stage !== 'Converted' && l.stage !== 'Lost').length;
  const convertedLeads = myLeads.filter(l => l.stage === 'Converted').length;
  const conversionRate = myLeads.length > 0 ? Math.round((convertedLeads / myLeads.length) * 100) : 0;

  const weeklyVisits = WEEKLY_DATA.reduce((s, d) => s + d.visits, 0);
  const weeklyOrders = WEEKLY_DATA.reduce((s, d) => s + d.orders, 0);

  const currentTarget = TARGET_DATA[TARGET_DATA.length - 1];
  const targetPct = Math.min(100, Math.round((currentTarget.actual / currentTarget.target) * 100));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800">My Reporting</h1>
          <p className="text-sm text-slate-500 mt-1">Personal performance metrics</p>
        </div>
        <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
          {PERIOD_OPTIONS.map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${period === p ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Visits', value: totalHistVisits, sub: `${todayStats.visits} today`, color: 'text-blue-600', bg: 'bg-blue-50', icon: <Calendar className="h-5 w-5 text-blue-500" /> },
          { label: 'Total Orders', value: totalHistOrders, sub: `${todayStats.orders} today`, color: 'text-indigo-600', bg: 'bg-indigo-50', icon: <TrendingUp className="h-5 w-5 text-indigo-500" /> },
          { label: 'Collections', value: `£${totalHistCollections.toLocaleString()}`, sub: `£${todayStats.collections} today`, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: <Target className="h-5 w-5 text-emerald-500" /> },
          { label: 'Commission', value: `£${earnedCommission.toFixed(2)}`, sub: `£${pendingCommission.toFixed(2)} pending`, color: 'text-amber-600', bg: 'bg-amber-50', icon: <Award className="h-5 w-5 text-amber-500" /> },
        ].map(kpi => (
          <Card key={kpi.label} padding="md">
            <div className={`h-9 w-9 ${kpi.bg} rounded-xl flex items-center justify-center mb-2`}>
              {kpi.icon}
            </div>
            <p className={`text-2xl font-black ${kpi.color}`}>{kpi.value}</p>
            <p className="text-xs font-semibold text-slate-600 mt-0.5">{kpi.label}</p>
            <p className="text-xs text-slate-400">{kpi.sub}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Weekly Visits & Orders Bar Chart */}
        <Card padding="md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-700">This Week</h3>
              <p className="text-xs text-slate-400">{weeklyVisits} visits · {weeklyOrders} orders</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <div className="h-2.5 w-2.5 rounded-full bg-blue-400" />Visits
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />Orders
              </div>
            </div>
          </div>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEKLY_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: 12, padding: '8px 12px' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="visits" name="Visits" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={32} />
                <Bar dataKey="orders" name="Orders" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Monthly Target Area Chart */}
        <Card padding="md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-700">Monthly Target</h3>
              <p className="text-xs text-slate-400">Revenue vs target — {targetPct}% achieved</p>
            </div>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${targetPct >= 100 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
              {targetPct}%
            </span>
          </div>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TARGET_DATA} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                <defs>
                  <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={v => `£${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: 12, padding: '8px 12px' }}
                  formatter={(val: number) => [`£${val.toLocaleString()}`, '']}
                />
                <Area dataKey="target" name="Target" stroke="#e2e8f0" strokeWidth={2} fill="none" strokeDasharray="5 4" />
                <Area dataKey="actual" name="Actual" stroke="#3b82f6" strokeWidth={2} fill="url(#actualGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Commission Breakdown */}
        <Card padding="md">
          <h3 className="text-sm font-bold text-slate-700 mb-4">Commission Breakdown</h3>
          <div className="space-y-2 mb-4">
            {[
              { label: 'Earned', amount: earnedCommission, bg: 'bg-emerald-50', color: 'text-emerald-700' },
              { label: 'Pending', amount: pendingCommission, bg: 'bg-amber-50', color: 'text-amber-700' },
            ].map(row => (
              <div key={row.label} className={`flex items-center justify-between px-3 py-2.5 rounded-xl ${row.bg}`}>
                <span className={`text-xs font-semibold ${row.color}`}>{row.label}</span>
                <span className={`text-sm font-black ${row.color}`}>£{row.amount.toFixed(2)}</span>
              </div>
            ))}
            <div className="flex items-center justify-between px-3 py-2.5 bg-slate-800 rounded-xl">
              <span className="text-xs font-semibold text-slate-300">Total</span>
              <span className="text-sm font-black text-white">£{(earnedCommission + pendingCommission).toFixed(2)}</span>
            </div>
          </div>
          <div className="space-y-2 border-t border-slate-100 pt-3">
            {COMMISSION_ENTRIES.map(e => (
              <div key={e.id} className="flex items-center justify-between text-xs">
                <div className="min-w-0">
                  <p className="font-semibold text-slate-600 truncate">{e.customer}</p>
                  <p className="text-slate-400">Order #{e.orderId}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-slate-700">£{e.amount.toFixed(2)}</p>
                  <span className={`font-semibold ${e.status === 'Earned' ? 'text-emerald-600' : 'text-amber-600'}`}>{e.status}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Lead Performance */}
        <Card padding="md">
          <h3 className="text-sm font-bold text-slate-700 mb-4">Lead Performance</h3>
          <div className="space-y-3">
            {[
              { label: 'Total Leads', value: myLeads.length, color: 'text-slate-800' },
              { label: 'Active', value: activeLeads, color: 'text-indigo-600' },
              { label: 'Converted', value: convertedLeads, color: 'text-emerald-600' },
              { label: 'Lost', value: myLeads.filter(l => l.stage === 'Lost').length, color: 'text-rose-600' },
            ].map(row => (
              <div key={row.label} className="flex items-center justify-between">
                <span className="text-xs text-slate-500">{row.label}</span>
                <span className={`text-sm font-black ${row.color}`}>{row.value}</span>
              </div>
            ))}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-slate-500">Conversion Rate</span>
                <span className="text-xs font-bold text-slate-700">{conversionRate}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${conversionRate}%` }} />
              </div>
            </div>
          </div>
        </Card>

        {/* Customer Summary */}
        <Card padding="md">
          <h3 className="text-sm font-bold text-slate-700 mb-4">My Customers</h3>
          <div className="space-y-3">
            {[
              { label: 'Assigned', value: myCustomers.length, color: 'text-slate-800' },
              { label: 'Active', value: myCustomers.filter(c => c.lifecycleStage === 'Active').length, color: 'text-emerald-600' },
              { label: 'At Risk', value: myCustomers.filter(c => c.lifecycleStage === 'At Risk').length, color: 'text-rose-600' },
              { label: 'Inactive', value: myCustomers.filter(c => c.lifecycleStage === 'Inactive').length, color: 'text-slate-500' },
            ].map(row => (
              <div key={row.label} className="flex items-center justify-between">
                <span className="text-xs text-slate-500">{row.label}</span>
                <span className={`text-sm font-black ${row.color}`}>{row.value}</span>
              </div>
            ))}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <p className="text-xs text-slate-400 font-semibold">Historical sessions</p>
              {historicalSessions.slice(0, 3).map(ws => (
                <div key={ws.id} className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">{ws.date}</span>
                  <span className="text-slate-700 font-semibold">{ws.totalVisits}v · {ws.totalOrders}o · £{ws.totalCollections}</span>
                </div>
              ))}
              {historicalSessions.length === 0 && (
                <p className="text-xs text-slate-400">No past sessions yet</p>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RepReporting;
