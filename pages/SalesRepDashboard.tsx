import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin, ShoppingCart, TrendingUp, DollarSign,
  Wifi, WifiOff, Clock, CheckCircle2, Circle,
  ChevronRight, Plus, Activity, Users, Package,
  AlertTriangle, Star, ArrowUpRight, ArrowDownRight,
  Phone, Building2, CreditCard, RotateCcw
} from 'lucide-react';
import { Card, CardHeader, Badge, Button } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { useCheckIn } from '../context/CheckInContext';
import { useNavigate } from 'react-router-dom';
import { CUSTOMERS, ORDERS } from '../data';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, Area, AreaChart
} from 'recharts';

const TODAY_ACTIVITIES = [
  { id: 1, type: 'Visit', customer: 'TechHub London', time: '09:15', status: 'completed', note: 'Order placed — £340' },
  { id: 2, type: 'Order', customer: 'Cyberdyne Retail', time: '10:30', status: 'completed', note: '£120 order created' },
  { id: 3, type: 'Follow-up', customer: 'RepliCant', time: '12:00', status: 'completed', note: 'Callback scheduled 4pm' },
  { id: 4, type: 'Visit', customer: 'Metro Convenience', time: '14:30', status: 'pending', note: '' },
  { id: 5, type: 'Payment', customer: 'Spark Retail', time: '16:00', status: 'pending', note: '' },
];

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

const ACTIVITY_COLORS: Record<string, string> = {
  Visit: 'bg-blue-100 text-blue-700',
  Order: 'bg-emerald-100 text-emerald-700',
  'Follow-up': 'bg-amber-100 text-amber-700',
  Payment: 'bg-purple-100 text-purple-700',
  Meeting: 'bg-indigo-100 text-indigo-700',
};

const SalesRepDashboard: React.FC = () => {
  const { user } = useAuth();
  const { checkedInCustomer, checkIn, checkOut } = useCheckIn();
  const navigate = useNavigate();

  const [isOnline, setIsOnline] = useState(false);
  const [sessionStart, setSessionStart] = useState<Date | null>(null);
  const [sessionDuration, setSessionDuration] = useState('00:00:00');
  const [checkingInId, setCheckingInId] = useState<string | null>(null);

  useEffect(() => {
    if (!isOnline || !sessionStart) return;
    const interval = setInterval(() => {
      const diff = Date.now() - sessionStart.getTime();
      const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
      const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
      const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
      setSessionDuration(`${h}:${m}:${s}`);
    }, 1000);
    return () => clearInterval(interval);
  }, [isOnline, sessionStart]);

  const handleToggleOnline = () => {
    if (isOnline) {
      setIsOnline(false);
      setSessionStart(null);
      setSessionDuration('00:00:00');
    } else {
      setIsOnline(true);
      setSessionStart(new Date());
    }
  };

  const handleCheckIn = async (customer: typeof CUSTOMERS[0]) => {
    setCheckingInId(customer.id);
    await checkIn(customer);
    setCheckingInId(null);
  };

  const approvedCustomers = CUSTOMERS.filter(c => c.status === 'Approved');
  const activeOrders = ORDERS.filter(o => !['Cancelled', 'Delivered'].includes(o.status));
  const todayRevenue = ORDERS.filter(o => o.status !== 'Cancelled')
    .slice(0, 4).reduce((s, o) => s + o.total, 0);
  const earnedCommission = COMMISSION_ENTRIES
    .filter(e => e.status === 'Earned').reduce((s, e) => s + e.amount, 0);
  const pendingCommission = COMMISSION_ENTRIES
    .filter(e => e.status === 'Pending').reduce((s, e) => s + e.amount, 0);

  const completedActivities = TODAY_ACTIVITIES.filter(a => a.status === 'completed').length;
  const totalActivities = TODAY_ACTIVITIES.length;

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6 pb-24">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'SR')}&background=2666B5&color=fff`}
            alt={user?.name}
            className="h-14 w-14 rounded-2xl shadow-md"
          />
          <div>
            <h1 className="text-2xl font-black text-slate-800">
              {user?.name || 'Sales Rep'}
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant={isOnline ? 'success' : 'neutral'}>
                {isOnline ? 'Online' : 'Offline'}
              </Badge>
              <span className="text-sm text-slate-400">{dateStr}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleToggleOnline}
          className={`flex items-center gap-3 px-5 py-3 rounded-2xl font-bold text-sm transition-all duration-300 shadow-sm ${
            isOnline
              ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-200'
              : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-200'
          }`}
        >
          {isOnline ? <WifiOff className="h-4 w-4" /> : <Wifi className="h-4 w-4" />}
          {isOnline ? 'Go Offline' : 'Go Online'}
        </button>
      </div>

      {/* ── Session Banner ── */}
      <AnimatePresence>
        {isOnline && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-emerald-800 font-semibold text-sm">Work session active</span>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-emerald-700">
                  <Clock className="h-4 w-4" />
                  <span className="font-mono font-bold text-lg">{sessionDuration}</span>
                </div>
                {checkedInCustomer && (
                  <div className="flex items-center gap-2 text-emerald-700 text-sm">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>Checked in: <strong>{checkedInCustomer.storeName}</strong></span>
                    <button
                      onClick={checkOut}
                      className="ml-1 text-xs text-rose-500 hover:text-rose-700 font-semibold underline"
                    >
                      Check out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Today's Visits",
            value: `${completedActivities}/${totalActivities}`,
            sub: `${totalActivities - completedActivities} pending`,
            icon: <MapPin className="h-5 w-5" />,
            color: 'bg-blue-500',
            light: 'bg-blue-50',
            text: 'text-blue-600',
          },
          {
            label: 'Active Orders',
            value: activeOrders.length.toString(),
            sub: `${ORDERS.filter(o => o.status === 'Pending').length} pending approval`,
            icon: <ShoppingCart className="h-5 w-5" />,
            color: 'bg-indigo-500',
            light: 'bg-indigo-50',
            text: 'text-indigo-600',
          },
          {
            label: 'Revenue Today',
            value: `£${todayRevenue.toLocaleString('en-GB', { minimumFractionDigits: 0 })}`,
            sub: '+12% vs yesterday',
            icon: <TrendingUp className="h-5 w-5" />,
            color: 'bg-emerald-500',
            light: 'bg-emerald-50',
            text: 'text-emerald-600',
          },
          {
            label: 'My Commission',
            value: `£${earnedCommission.toFixed(2)}`,
            sub: `£${pendingCommission.toFixed(2)} pending`,
            icon: <DollarSign className="h-5 w-5" />,
            color: 'bg-amber-500',
            light: 'bg-amber-50',
            text: 'text-amber-600',
          },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <Card padding="md" className="h-full">
              <div className="flex items-start justify-between">
                <div className={`p-2.5 rounded-xl ${kpi.light}`}>
                  <div className={kpi.text}>{kpi.icon}</div>
                </div>
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

      {/* ── Quick Actions ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'GPS Check-In', icon: <MapPin className="h-4 w-4" />, action: () => navigate('/check-in'), color: 'bg-blue-500 hover:bg-blue-600 text-white' },
          { label: 'Create Order', icon: <Plus className="h-4 w-4" />, action: () => navigate('/orders'), color: 'bg-slate-800 hover:bg-slate-900 text-white' },
          { label: 'My Customers', icon: <Users className="h-4 w-4" />, action: () => navigate('/customers'), color: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200' },
          { label: 'Commission', icon: <DollarSign className="h-4 w-4" />, action: () => navigate('/commission'), color: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200' },
        ].map(q => (
          <button
            key={q.label}
            onClick={q.action}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 shadow-sm ${q.color}`}
          >
            {q.icon}
            {q.label}
          </button>
        ))}
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT col: Activity Timeline + Weekly Chart */}
        <div className="lg:col-span-2 space-y-6">

          {/* Today's Activity Timeline */}
          <Card padding="none">
            <CardHeader
              title="Today's Activities"
              description={`${completedActivities} of ${totalActivities} completed`}
              action={
                <Badge variant={completedActivities === totalActivities ? 'success' : 'warning'}>
                  {completedActivities === totalActivities ? 'All done' : 'In progress'}
                </Badge>
              }
              className="px-5 pt-5 pb-4"
            />
            {/* Progress bar */}
            <div className="px-5 mb-4">
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${(completedActivities / totalActivities) * 100}%` }}
                />
              </div>
            </div>
            <div className="divide-y divide-slate-100">
              {TODAY_ACTIVITIES.map((activity, i) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="px-5 py-3.5 flex items-center gap-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex-shrink-0 text-slate-300">
                    {activity.status === 'completed'
                      ? <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      : <Circle className="h-5 w-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${ACTIVITY_COLORS[activity.type] || 'bg-slate-100 text-slate-600'}`}>
                        {activity.type}
                      </span>
                      <span className="text-sm font-semibold text-slate-700 truncate">{activity.customer}</span>
                    </div>
                    {activity.note && (
                      <p className="text-xs text-slate-400 mt-0.5 truncate">{activity.note}</p>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 flex-shrink-0 font-mono">{activity.time}</span>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Weekly Performance Chart */}
          <Card padding="none">
            <CardHeader
              title="This Week"
              description="Visits & orders by day"
              className="px-5 pt-5 pb-4"
            />
            <div className="px-4 pb-5" style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={WEEKLY_DATA} margin={{ top: 4, right: 8, left: -20, bottom: 0 }} barGap={4}>
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
            <div className="flex items-center gap-4 px-5 pb-4">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <div className="h-2.5 w-2.5 rounded-full bg-blue-400" />
                Visits
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                Orders
              </div>
            </div>
          </Card>

          {/* Recent Orders */}
          <Card padding="none">
            <CardHeader
              title="Recent Orders"
              description="Your latest created orders"
              action={
                <button
                  onClick={() => navigate('/orders')}
                  className="flex items-center gap-1 text-xs text-blue-600 font-semibold hover:text-blue-800"
                >
                  View all <ChevronRight className="h-3.5 w-3.5" />
                </button>
              }
              className="px-5 pt-5 pb-4"
            />
            <div className="divide-y divide-slate-100">
              {ORDERS.slice(0, 5).map(order => (
                <div
                  key={order.id}
                  className="px-5 py-3.5 flex items-center gap-4 hover:bg-slate-50 cursor-pointer transition-colors"
                  onClick={() => navigate('/orders')}
                >
                  <div className="flex-shrink-0 p-2 bg-slate-100 rounded-xl">
                    <ShoppingCart className="h-4 w-4 text-slate-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-700 truncate">{order.customer}</p>
                    <p className="text-xs text-slate-400"># {order.id} · {order.date} · {order.items} items</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-slate-800">£{order.total.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</p>
                    <Badge
                      variant={
                        order.status === 'Delivered' ? 'success'
                        : order.status === 'Cancelled' ? 'danger'
                        : order.status === 'Pending' ? 'warning'
                        : 'info'
                      }
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* RIGHT col: Check-in status + Customers + Commission */}
        <div className="space-y-6">

          {/* Check-in Status */}
          <Card padding="md">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold text-slate-700">Current Visit</p>
              {checkedInCustomer
                ? <Badge variant="success">Active</Badge>
                : <Badge variant="neutral">No check-in</Badge>}
            </div>

            {checkedInCustomer ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl">
                  <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">{checkedInCustomer.storeName}</p>
                    <p className="text-xs text-slate-500 truncate">{checkedInCustomer.address}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Phone className="h-3.5 w-3.5" />
                    {checkedInCustomer.phone}
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <CreditCard className="h-3.5 w-3.5" />
                    £{checkedInCustomer.creditLimit.toLocaleString()} limit
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/customers/${checkedInCustomer.id}`)}
                    className="flex-1 text-xs font-semibold py-2 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-colors"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => navigate('/orders')}
                    className="flex-1 text-xs font-semibold py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                  >
                    Create Order
                  </button>
                </div>
                <button
                  onClick={checkOut}
                  className="w-full text-xs font-semibold py-2 border border-rose-200 text-rose-500 rounded-xl hover:bg-rose-50 transition-colors flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="h-3 w-3" /> End Visit
                </button>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="h-12 w-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <MapPin className="h-6 w-6 text-slate-400" />
                </div>
                <p className="text-xs text-slate-500 mb-3">No active visit. GPS check-in to start.</p>
                <button
                  onClick={() => navigate('/check-in')}
                  className="w-full text-sm font-semibold py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                >
                  Start Check-In
                </button>
              </div>
            )}
          </Card>

          {/* My Customers */}
          <Card padding="none">
            <CardHeader
              title="My Customers"
              description={`${approvedCustomers.length} active`}
              action={
                <button
                  onClick={() => navigate('/customers')}
                  className="flex items-center gap-1 text-xs text-blue-600 font-semibold hover:text-blue-800"
                >
                  All <ChevronRight className="h-3.5 w-3.5" />
                </button>
              }
              className="px-4 pt-4 pb-3"
            />
            <div className="divide-y divide-slate-100">
              {approvedCustomers.slice(0, 5).map(customer => {
                const outstanding = customer.walletBalance < 0 ? Math.abs(customer.walletBalance) : 0;
                const isCheckedIn = checkedInCustomer?.id === customer.id;
                return (
                  <div
                    key={customer.id}
                    className={`px-4 py-3 flex items-center gap-3 hover:bg-slate-50 cursor-pointer transition-colors ${isCheckedIn ? 'bg-emerald-50' : ''}`}
                    onClick={() => navigate(`/customers/${customer.id}`)}
                  >
                    <img
                      src={customer.image}
                      alt={customer.name}
                      className="h-8 w-8 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-700 truncate">{customer.storeName}</p>
                      {outstanding > 0
                        ? <p className="text-xs text-rose-500 font-semibold">£{outstanding.toFixed(2)} outstanding</p>
                        : <p className="text-xs text-slate-400">£{customer.walletBalance.toFixed(2)} balance</p>}
                    </div>
                    {isCheckedIn
                      ? <div className="h-2 w-2 rounded-full bg-emerald-500 flex-shrink-0" />
                      : (
                        <button
                          onClick={e => { e.stopPropagation(); handleCheckIn(customer); }}
                          disabled={checkingInId === customer.id}
                          className="flex-shrink-0 p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="GPS Check-In"
                        >
                          {checkingInId === customer.id
                            ? <div className="h-3.5 w-3.5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                            : <MapPin className="h-3.5 w-3.5" />}
                        </button>
                      )}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Commission Summary */}
          <Card padding="md">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-bold text-slate-700">Commission</p>
              <button
                onClick={() => navigate('/commission')}
                className="flex items-center gap-1 text-xs text-blue-600 font-semibold hover:text-blue-800"
              >
                Details <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="space-y-2.5">
              {[
                { label: 'Earned', amount: earnedCommission, color: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' },
                { label: 'Pending', amount: pendingCommission, color: 'bg-amber-50 text-amber-700', dot: 'bg-amber-400' },
              ].map(row => (
                <div key={row.label} className={`flex items-center justify-between px-3 py-2.5 rounded-xl ${row.color}`}>
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${row.dot}`} />
                    <span className="text-xs font-semibold">{row.label}</span>
                  </div>
                  <span className="text-sm font-black">£{row.amount.toFixed(2)}</span>
                </div>
              ))}
              <div className="flex items-center justify-between px-3 py-2.5 bg-slate-800 rounded-xl">
                <span className="text-xs font-semibold text-slate-300">Total</span>
                <span className="text-sm font-black text-white">£{(earnedCommission + pendingCommission).toFixed(2)}</span>
              </div>
            </div>

            {/* Mini commission list */}
            <div className="mt-4 space-y-2">
              {COMMISSION_ENTRIES.slice(0, 3).map(e => (
                <div key={e.id} className="flex items-center justify-between text-xs">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-600 truncate">{e.customer}</p>
                    <p className="text-slate-400">#{e.orderId}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-slate-700">£{e.amount.toFixed(2)}</p>
                    <Badge variant={e.status === 'Earned' ? 'success' : 'warning'}>
                      {e.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Monthly Target */}
          <Card padding="none">
            <CardHeader
              title="Monthly Target"
              description="Revenue vs target"
              className="px-4 pt-4 pb-3"
            />
            <div className="px-4 pb-4" style={{ height: 160 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={TARGET_DATA} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                  <defs>
                    <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
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
                  <Area dataKey="actual" name="Actual" stroke="#3b82f6" strokeWidth={2} fill="url(#actualGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default SalesRepDashboard;
