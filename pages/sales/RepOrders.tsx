import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, ChevronRight, Package, Clock, CheckCircle, XCircle, TruckIcon } from 'lucide-react';
import { Card } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { ORDERS } from '../../data';

const STATUS_CONFIG: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  Pending:   { icon: <Clock className="h-3.5 w-3.5" />,       color: 'text-amber-600',   bg: 'bg-amber-50' },
  Processing:{ icon: <Package className="h-3.5 w-3.5" />,     color: 'text-blue-600',    bg: 'bg-blue-50' },
  Picking:   { icon: <Package className="h-3.5 w-3.5" />,     color: 'text-indigo-600',  bg: 'bg-indigo-50' },
  Packed:    { icon: <Package className="h-3.5 w-3.5" />,     color: 'text-violet-600',  bg: 'bg-violet-50' },
  Shipped:   { icon: <TruckIcon className="h-3.5 w-3.5" />,   color: 'text-blue-600',    bg: 'bg-blue-50' },
  Delivered: { icon: <CheckCircle className="h-3.5 w-3.5" />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  Cancelled: { icon: <XCircle className="h-3.5 w-3.5" />,     color: 'text-slate-400',   bg: 'bg-slate-50' },
};

const PAY_COLOR: Record<string, string> = {
  Paid: 'text-emerald-600',
  Pending: 'text-amber-600',
  Overdue: 'text-rose-600',
  Partial: 'text-blue-600',
};

const RepOrders: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const preselectedCustomerId = (location.state as any)?.customerId;
  const preselectedCustomerName = (location.state as any)?.customerName;

  const repId = user?.id ?? '';
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [payFilter, setPayFilter] = useState<string>('All');

  const allRepOrders = ORDERS.filter(o => o.repId === repId);
  const customerOrders = preselectedCustomerId
    ? allRepOrders.filter(o => o.customerId === preselectedCustomerId)
    : allRepOrders;

  const filtered = customerOrders.filter(o => {
    const matchSearch = !search ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || o.status === statusFilter;
    const matchPay = payFilter === 'All' || o.paymentStatus === payFilter;
    return matchSearch && matchStatus && matchPay;
  });

  const totalRevenue = allRepOrders.filter(o => o.paymentStatus === 'Paid').reduce((s, o) => s + o.total, 0);
  const pendingPay = allRepOrders.filter(o => o.paymentStatus === 'Pending').reduce((s, o) => s + o.total, 0);
  const statuses = Array.from(new Set(allRepOrders.map(o => o.status)));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-800">My Orders</h1>
          {preselectedCustomerId ? (
            <p className="text-xs text-indigo-500 font-semibold mt-0.5">
              Filtered: {preselectedCustomerName} ·{' '}
              <button onClick={() => navigate('/sales/orders')} className="underline hover:text-indigo-700">
                Show all
              </button>
            </p>
          ) : (
            <p className="text-xs text-slate-500 mt-0.5">{allRepOrders.length} total orders</p>
          )}
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { label: 'Total Orders', value: allRepOrders.length, color: 'text-slate-800' },
          { label: 'Revenue (Paid)', value: `£${totalRevenue.toLocaleString()}`, color: 'text-emerald-600' },
          { label: 'Pending Payment', value: `£${pendingPay.toLocaleString()}`, color: 'text-amber-600' },
          { label: 'Delivered', value: allRepOrders.filter(o => o.status === 'Delivered').length, color: 'text-slate-800' },
        ].map(kpi => (
          <div key={kpi.label} className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
            <p className={`text-xl font-black ${kpi.color}`}>{kpi.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap items-center">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by order # or customer..."
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300">
          <option value="All">All Status</option>
          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={payFilter} onChange={e => setPayFilter(e.target.value)}
          className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300">
          <option value="All">All Payments</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Overdue">Overdue</option>
        </select>
      </div>

      {/* Order List */}
      {filtered.length === 0 ? (
        <Card padding="md" className="flex flex-col items-center justify-center py-10 text-center">
          <ShoppingCart className="h-8 w-8 text-slate-200 mx-auto mb-2" />
          <p className="text-sm text-slate-400">No orders found</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map(order => {
            const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG['Pending'];
            return (
              <Card key={order.id} padding="md" className="cursor-pointer hover:shadow-md transition-all"
                onClick={() => navigate('/sales/customers/' + order.customerId)}>
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 ${cfg.bg} rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.color}`}>
                    {cfg.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-bold text-slate-800">#{order.id}</p>
                        <p className="text-xs text-slate-400">{order.customer} · {order.date} · {order.items} items</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-black text-slate-800">£{order.total.toLocaleString()}</p>
                        <p className={`text-xs font-semibold ${PAY_COLOR[order.paymentStatus] ?? 'text-slate-500'}`}>
                          {order.paymentStatus}
                        </p>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-300 flex-shrink-0" />
                </div>
                <div className="mt-2 pt-2 border-t border-slate-50 flex items-center gap-2">
                  <span className={`flex items-center gap-1 text-xs font-semibold ${cfg.color}`}>
                    {cfg.icon} {order.status}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RepOrders;
