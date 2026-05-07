import React from 'react';
import { motion } from 'motion/react';
import {
  Users, ShoppingCart, TrendingUp, AlertTriangle,
  Wifi, MapPin, DollarSign, ChevronRight,
  Activity, Target, BarChart3
} from 'lucide-react';
import { Card, CardHeader, Badge } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { CUSTOMERS, ORDERS, USERS } from '../../data';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area
} from 'recharts';

const TEAM_REPS = [
  { id: 'U004', name: 'John Smith',   status: 'online',  visits: 3, orders: 2, revenue: 1446.26, target: 5000 },
  { id: 'U010', name: 'Emma Clarke',  status: 'offline', visits: 0, orders: 0, revenue: 0,       target: 5000 },
  { id: 'R_A',  name: 'Chloe Butler', status: 'online',  visits: 5, orders: 1, revenue: 327.90,  target: 4000 },
  { id: 'R_B',  name: 'Dan Strainu',  status: 'online',  visits: 4, orders: 3, revenue: 820.00,  target: 4500 },
];

const WEEKLY_TEAM = [
  { day: 'Mon', revenue: 4200, orders: 14 },
  { day: 'Tue', revenue: 5800, orders: 19 },
  { day: 'Wed', revenue: 3900, orders: 12 },
  { day: 'Thu', revenue: 6200, orders: 21 },
  { day: 'Fri', revenue: 5100, orders: 17 },
  { day: 'Sat', revenue: 2400, orders: 8  },
  { day: 'Sun', revenue: 800,  orders: 3  },
];

const TARGET_TREND = [
  { week: 'W1', actual: 18400, target: 20000 },
  { week: 'W2', actual: 22100, target: 20000 },
  { week: 'W3', actual: 19700, target: 20000 },
  { week: 'W4', actual: 24600, target: 22000 },
];

const SMDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const onlineReps   = TEAM_REPS.filter(r => r.status === 'online').length;
  const teamRevenue  = TEAM_REPS.reduce((s, r) => s + r.revenue, 0);
  const teamOrders   = TEAM_REPS.reduce((s, r) => s + r.orders, 0);
  const atRiskCustomers = CUSTOMERS.filter(c => c.walletBalance < 0);
  const pendingOrders   = ORDERS.filter(o => o.status === 'Pending').length;

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6 pb-24">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'SM')}&background=0B1F3A&color=fff`}
            alt={user?.name}
            className="h-14 w-14 rounded-2xl shadow-md"
          />
          <div>
            <h1 className="text-2xl font-black text-slate-800">{user?.name || 'Sales Manager'}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant="info">Sales Manager</Badge>
              <span className="text-sm text-slate-400">{dateStr}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 border border-emerald-200 rounded-xl">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-bold text-emerald-700">{onlineReps} reps online</span>
          </div>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Team Revenue Today',
            value: `£${teamRevenue.toLocaleString('en-GB', { minimumFractionDigits: 0 })}`,
            sub: '+18% vs yesterday',
            icon: <TrendingUp className="h-5 w-5" />,
            light: 'bg-emerald-50', text: 'text-emerald-600',
          },
          {
            label: 'Orders Today',
            value: teamOrders.toString(),
            sub: `${pendingOrders} pending approval`,
            icon: <ShoppingCart className="h-5 w-5" />,
            light: 'bg-blue-50', text: 'text-blue-600',
          },
          {
            label: 'Reps Online',
            value: `${onlineReps}/${TEAM_REPS.length}`,
            sub: `${TEAM_REPS.length - onlineReps} offline today`,
            icon: <Wifi className="h-5 w-5" />,
            light: 'bg-indigo-50', text: 'text-indigo-600',
          },
          {
            label: 'At-Risk Accounts',
            value: atRiskCustomers.length.toString(),
            sub: 'Outstanding balance',
            icon: <AlertTriangle className="h-5 w-5" />,
            light: 'bg-rose-50', text: 'text-rose-600',
          },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <Card padding="md" className="h-full">
              <div className={`p-2.5 rounded-xl ${kpi.light} w-fit`}>
                <div className={kpi.text}>{kpi.icon}</div>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-black text-slate-800">{kpi.value}</p>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">{kpi.label}</p>
                <p className="text-xs text-slate-400 mt-1">{kpi.sub}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ── Quick Nav ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Team',        icon: <Users className="h-4 w-4" />,     path: '/sales-manager/team',       color: 'bg-slate-800 text-white hover:bg-slate-700' },
          { label: 'Orders',      icon: <ShoppingCart className="h-4 w-4" />, path: '/sales-manager/orders',  color: 'bg-blue-500 text-white hover:bg-blue-600' },
          { label: 'Analytics',   icon: <BarChart3 className="h-4 w-4" />, path: '/sales-manager/analytics',  color: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50' },
          { label: 'Reports',     icon: <Activity className="h-4 w-4" />,  path: '/sales-manager/reports',    color: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50' },
        ].map(q => (
          <button
            key={q.label}
            onClick={() => navigate(q.path)}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 shadow-sm ${q.color}`}
          >
            {q.icon}{q.label}
          </button>
        ))}
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT: Team Status + Revenue Chart */}
        <div className="lg:col-span-2 space-y-6">

          {/* Team Rep Status */}
          <Card padding="none">
            <CardHeader
              title="Team Status"
              description="Live rep activity today"
              action={
                <button onClick={() => navigate('/sales-manager/team')}
                  className="flex items-center gap-1 text-xs text-blue-600 font-semibold hover:text-blue-800">
                  Manage <ChevronRight className="h-3.5 w-3.5" />
                </button>
              }
              className="px-5 pt-5 pb-4"
            />
            <div className="divide-y divide-slate-100">
              {TEAM_REPS.map((rep, i) => {
                const pct = Math.min(100, Math.round((rep.revenue / rep.target) * 100));
                return (
                  <motion.div
                    key={rep.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="px-5 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(rep.name)}&background=2666B5&color=fff&size=36`}
                        className="h-9 w-9 rounded-xl"
                        alt={rep.name}
                      />
                      <div className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white ${rep.status === 'online' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-slate-700">{rep.name}</p>
                        <Badge variant={rep.status === 'online' ? 'success' : 'neutral'}>
                          {rep.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${pct >= 100 ? 'bg-emerald-500' : pct >= 60 ? 'bg-blue-500' : 'bg-amber-400'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-400 flex-shrink-0">{pct}% target</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 space-y-0.5">
                      <p className="text-sm font-bold text-slate-800">£{rep.revenue.toLocaleString('en-GB', { minimumFractionDigits: 0 })}</p>
                      <p className="text-xs text-slate-400">{rep.visits} visits · {rep.orders} orders</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </Card>

          {/* Team Revenue Chart */}
          <Card padding="none">
            <CardHeader
              title="Team Revenue — This Week"
              description="All reps combined"
              className="px-5 pt-5 pb-4"
            />
            <div className="px-4 pb-5" style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={WEEKLY_TEAM} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={v => `£${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: 12, padding: '8px 12px' }}
                    cursor={{ fill: '#f8fafc' }}
                    formatter={(v: number) => [`£${v.toLocaleString()}`, '']}
                  />
                  <Bar dataKey="revenue" name="Revenue" fill="#0B1F3A" radius={[6, 6, 0, 0]} maxBarSize={36} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Recent Team Orders */}
          <Card padding="none">
            <CardHeader
              title="Recent Orders"
              description="Across all reps"
              action={
                <button onClick={() => navigate('/sales-manager/orders')}
                  className="flex items-center gap-1 text-xs text-blue-600 font-semibold hover:text-blue-800">
                  View all <ChevronRight className="h-3.5 w-3.5" />
                </button>
              }
              className="px-5 pt-5 pb-4"
            />
            <div className="divide-y divide-slate-100">
              {ORDERS.slice(0, 5).map(order => (
                <div key={order.id} className="px-5 py-3.5 flex items-center gap-4 hover:bg-slate-50 cursor-pointer transition-colors">
                  <div className="flex-shrink-0 p-2 bg-slate-100 rounded-xl">
                    <ShoppingCart className="h-4 w-4 text-slate-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-700 truncate">{order.customer}</p>
                    <p className="text-xs text-slate-400">#{order.id} · {order.date} · {order.items} items</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-slate-800">£{order.total.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</p>
                    <Badge variant={
                      order.status === 'Delivered' ? 'success'
                      : order.status === 'Cancelled' ? 'danger'
                      : order.status === 'Pending' ? 'warning' : 'info'
                    }>{order.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* RIGHT: Monthly target + At-risk customers */}
        <div className="space-y-6">

          {/* Monthly Target */}
          <Card padding="none">
            <CardHeader
              title="Monthly Target"
              description="Team revenue vs target"
              className="px-4 pt-4 pb-3"
            />
            <div className="px-4 pb-4" style={{ height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={TARGET_TREND} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                  <defs>
                    <linearGradient id="smActualGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0B1F3A" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#0B1F3A" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} tickFormatter={v => `£${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: 11, padding: '6px 10px' }}
                    formatter={(val: number) => [`£${val.toLocaleString()}`, '']}
                  />
                  <Area dataKey="target" name="Target" stroke="#e2e8f0" strokeWidth={2} fill="none" strokeDasharray="5 4" />
                  <Area dataKey="actual" name="Actual" stroke="#0B1F3A" strokeWidth={2} fill="url(#smActualGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="px-4 pb-4 grid grid-cols-2 gap-2">
              <div className="bg-slate-50 rounded-xl p-3 text-center">
                <p className="text-xs text-slate-400">Month Total</p>
                <p className="text-base font-black text-slate-800">£84,800</p>
              </div>
              <div className="bg-emerald-50 rounded-xl p-3 text-center">
                <p className="text-xs text-emerald-600">vs Target</p>
                <p className="text-base font-black text-emerald-700">+12%</p>
              </div>
            </div>
          </Card>

          {/* At-Risk Customers */}
          <Card padding="none">
            <CardHeader
              title="At-Risk Accounts"
              description="High outstanding balance"
              action={
                <button onClick={() => navigate('/sales-manager/customers')}
                  className="flex items-center gap-1 text-xs text-blue-600 font-semibold hover:text-blue-800">
                  All <ChevronRight className="h-3.5 w-3.5" />
                </button>
              }
              className="px-4 pt-4 pb-3"
            />
            {atRiskCustomers.length === 0 ? (
              <div className="px-4 pb-4 text-center text-sm text-slate-400 py-8">No at-risk accounts</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {atRiskCustomers.map(c => (
                  <div key={c.id} className="px-4 py-3 flex items-center gap-3 hover:bg-slate-50 cursor-pointer transition-colors">
                    <img src={c.image} alt={c.name} className="h-8 w-8 rounded-xl object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-700 truncate">{c.storeName}</p>
                      <p className="text-xs text-rose-500 font-semibold">£{Math.abs(c.walletBalance).toFixed(2)} outstanding</p>
                    </div>
                    <Badge variant="danger">Risk</Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Commission Payable */}
          <Card padding="md">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-bold text-slate-700">Commission Payable</p>
              <button onClick={() => navigate('/sales-manager/payments')}
                className="flex items-center gap-1 text-xs text-blue-600 font-semibold hover:text-blue-800">
                Details <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="space-y-2.5">
              {[
                { label: 'Earned (to pay)', amount: 440.26, color: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' },
                { label: 'Pending (held)', amount: 169.50, color: 'bg-amber-50 text-amber-700', dot: 'bg-amber-400' },
                { label: 'Blocked',        amount: 143.00, color: 'bg-rose-50 text-rose-700',    dot: 'bg-rose-400' },
              ].map(row => (
                <div key={row.label} className={`flex items-center justify-between px-3 py-2.5 rounded-xl ${row.color}`}>
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${row.dot}`} />
                    <span className="text-xs font-semibold">{row.label}</span>
                  </div>
                  <span className="text-sm font-black">£{row.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SMDashboard;
