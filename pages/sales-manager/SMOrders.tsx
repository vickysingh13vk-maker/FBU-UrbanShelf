import React, { useState, useMemo } from 'react';
import {
  Search, Eye, CheckCircle2, ShoppingCart, Clock, XCircle,
  ChevronLeft, ChevronRight, MapPin, Package, Truck,
} from 'lucide-react';
import {
  Card, Table, THead, TBody, TR, TH, TD, Badge, Button, Modal,
} from '../../components/ui';
import { ORDERS, CUSTOMERS, REP_STATUSES } from '../../data';
import { Order } from '../../types';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getRepName = (repId?: string) =>
  REP_STATUSES.find(r => r.repId === repId)?.repName ?? (repId ?? '—');

const getCustomerDetails = (customerId?: string) =>
  CUSTOMERS.find(c => c.id === customerId);

const getStatusVariant = (s: string): any =>
  s === 'Delivered' ? 'success' : s === 'Cancelled' ? 'danger' :
  s === 'Shipped' ? 'info' : s === 'Approved' ? 'info' :
  s === 'Picking' || s === 'Packed' ? 'secondary' : 'warning';

const getPayVariant = (s: string): any =>
  s === 'Paid' ? 'success' : s === 'Refunded' ? 'info' : s === 'Unpaid' ? 'danger' : 'warning';

const SIMULATED_ITEMS = [
  { name: 'LOST MARY BM6000 KIT', qty: 10, price: '3.85', flavour: 'Strawberry Lime' },
  { name: 'LOST MARY BM6000 KIT', qty: 5,  price: '3.85', flavour: 'Pineapple Passion' },
  { name: 'ELF BAR 600',          qty: 20, price: '3.99', flavour: 'Blueberry' },
];

const ITEMS_PER_PAGE = 10;
const STATUSES = ['Pending', 'Approved', 'Picking', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];

// ─── Component ────────────────────────────────────────────────────────────────

const SMOrders: React.FC = () => {
  const [localOrders, setLocalOrders] = useState<Order[]>(ORDERS);
  const [search,       setSearch]       = useState('');
  const [repFilter,    setRepFilter]    = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [payFilter,    setPayFilter]    = useState('All');
  const [page,         setPage]         = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetail,    setShowDetail]    = useState(false);

  // ── Derived ──────────────────────────────────────────────────────────────
  const reps = useMemo(() =>
    Array.from(new Map(ORDERS.filter(o => o.repId).map(o => [o.repId, getRepName(o.repId)])).entries()),
    [],
  );

  const filtered = useMemo(() => localOrders.filter(o => {
    const q = search.toLowerCase();
    const matchSearch = !search ||
      o.id.toLowerCase().includes(q) ||
      o.customer.toLowerCase().includes(q);
    const matchRep    = repFilter    === 'All' || o.repId    === repFilter;
    const matchStatus = statusFilter === 'All' || o.status   === statusFilter;
    const matchPay    = payFilter    === 'All' || o.paymentStatus === payFilter;
    return matchSearch && matchRep && matchStatus && matchPay;
  }), [localOrders, search, repFilter, statusFilter, payFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated  = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const pendingCount   = localOrders.filter(o => o.status === 'Pending').length;
  const paidRevenue    = localOrders.filter(o => o.paymentStatus === 'Paid').reduce((s, o) => s + o.total, 0);
  const pendingPayment = localOrders.filter(o => o.paymentStatus === 'Pending').reduce((s, o) => s + o.total, 0);
  const deliveredCount = localOrders.filter(o => o.status === 'Delivered').length;

  // ── Actions ───────────────────────────────────────────────────────────────
  const handleApprove = (orderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalOrders(prev =>
      prev.map(o => o.id === orderId ? { ...o, status: 'Approved' as const } : o),
    );
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, status: 'Approved' as const } : prev);
    }
  };

  const openDetail = (order: Order) => { setSelectedOrder(order); setShowDetail(true); };

  // ── Detail modal ──────────────────────────────────────────────────────────
  const renderDetail = () => {
    if (!selectedOrder) return null;
    const cd = getCustomerDetails(selectedOrder.customerId);
    const tax = selectedOrder.total * 0.2;
    const subtotal = selectedOrder.total - tax;
    return (
      <div className="space-y-5">
        {/* Header card */}
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 flex flex-col md:flex-row justify-between gap-5">
          <div className="flex gap-3">
            <div className="h-12 w-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 font-bold text-lg shadow-sm flex-shrink-0 overflow-hidden">
              {cd?.image ? <img src={cd.image} alt="" className="h-full w-full object-cover" /> : selectedOrder.customer.charAt(0)}
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wide">Customer</p>
              <h3 className="text-base font-bold text-slate-900">{selectedOrder.customer}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{cd?.email ?? '—'}</p>
              <p className="text-xs text-slate-400 mt-0.5">{selectedOrder.date}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wide">Order ID</p>
              <p className="font-mono font-medium text-slate-900">#{selectedOrder.id}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wide">Status</p>
              <Badge variant={getStatusVariant(selectedOrder.status)}>{selectedOrder.status}</Badge>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wide">Rep</p>
              <p className="font-medium text-slate-700">{getRepName(selectedOrder.repId)}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wide">Payment</p>
              <Badge variant={getPayVariant(selectedOrder.paymentStatus)}>{selectedOrder.paymentStatus}</Badge>
            </div>
          </div>
        </div>

        {/* Delivery address */}
        {cd && (
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h4 className="text-xs font-bold text-slate-700 mb-2">Delivery Address</h4>
            <div className="flex items-start gap-2 text-sm text-slate-600">
              <MapPin className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
              <span>{cd.address}</span>
            </div>
          </div>
        )}

        {/* Order items */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700">Order Items</div>
          <div className="divide-y divide-slate-100">
            {SIMULATED_ITEMS.map((item, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-slate-100 rounded-lg border border-slate-200 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">{item.name}</p>
                    <p className="text-xs text-slate-500">{item.flavour} · Qty: {item.qty} × £{item.price}</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-slate-900">£{(item.qty * parseFloat(item.price)).toFixed(2)}</p>
              </div>
            ))}
            {selectedOrder.items > 3 && (
              <div className="p-3 text-center text-xs text-slate-400">+ {selectedOrder.items - 3} more items...</div>
            )}
          </div>
        </div>

        {/* Financial */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
          {[['Subtotal', `£${subtotal.toFixed(2)}`], ['VAT (20%)', `£${tax.toFixed(2)}`], ['Shipping', '£0.00']].map(([k, v]) => (
            <div key={k} className="flex justify-between text-sm text-slate-600">
              <span>{k}</span><span className="font-medium">{v}</span>
            </div>
          ))}
          <div className="border-t border-slate-200 pt-2 flex justify-between">
            <span className="font-bold text-slate-900">Total</span>
            <span className="text-lg font-black text-slate-900">£{selectedOrder.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    );
  };

  // ── Main ──────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Team Orders</h1>
          <p className="text-sm text-slate-500 mt-0.5">All orders created by sales reps</p>
        </div>
        {pendingCount > 0 && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 text-sm font-bold text-amber-700">
            <Clock className="h-4 w-4" />
            {pendingCount} Pending Approval
          </div>
        )}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Orders',    value: localOrders.length,                bg: 'bg-indigo-50', icon: <ShoppingCart className="h-5 w-5 text-indigo-500" />, color: 'text-indigo-700' },
          { label: 'Revenue (Paid)',  value: `£${paidRevenue.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, bg: 'bg-emerald-50', icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />, color: 'text-emerald-700' },
          { label: 'Pending Payment', value: `£${pendingPayment.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, bg: 'bg-amber-50',   icon: <Clock className="h-5 w-5 text-amber-500" />,   color: 'text-amber-700' },
          { label: 'Delivered',       value: deliveredCount,                      bg: 'bg-slate-50',  icon: <Truck className="h-5 w-5 text-slate-500" />,       color: 'text-slate-700' },
        ].map(k => (
          <div key={k.label} className={`${k.bg} border border-white rounded-2xl px-4 py-4 flex items-center gap-3 shadow-sm`}>
            <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">{k.icon}</div>
            <div>
              <p className={`text-xl font-black ${k.color}`}>{k.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{k.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table card */}
      <Card padding="none" className="overflow-hidden">
        {/* Filter bar */}
        <div className="p-4 border-b border-slate-200 bg-white rounded-t-2xl">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="relative flex-1 min-w-0 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search by order # or customer..."
                className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <select value={repFilter} onChange={e => { setRepFilter(e.target.value); setPage(1); }}
                className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300">
                <option value="All">All Reps</option>
                {reps.map(([id, name]) => <option key={id} value={id!}>{name}</option>)}
              </select>
              <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300">
                <option value="All">All Statuses</option>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select value={payFilter} onChange={e => { setPayFilter(e.target.value); setPage(1); }}
                className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300">
                <option value="All">All Payments</option>
                {['Paid', 'Pending', 'Unpaid', 'Refunded'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <Table>
          <THead>
            <TR>
              <TH>Order ID</TH>
              <TH>Customer</TH>
              <TH>Rep</TH>
              <TH>Items</TH>
              <TH>Total</TH>
              <TH>Status</TH>
              <TH>Payment</TH>
              <TH>Date</TH>
              <TH align="center">Actions</TH>
            </TR>
          </THead>
          <TBody>
            {paginated.length === 0 ? (
              <TR>
                <TD colSpan={9} className="py-16 text-center">
                  <ShoppingCart className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                  <p className="text-sm text-slate-400">No orders found</p>
                </TD>
              </TR>
            ) : (
              paginated.map(order => (
                <TR key={order.id} className="cursor-pointer" onClick={() => openDetail(order)}>
                  <TD className="font-mono text-slate-600 font-medium">#{order.id}</TD>
                  <TD>
                    <div className="font-medium text-slate-900">{order.customer}</div>
                    <div className="text-xs text-slate-400">{getCustomerDetails(order.customerId)?.storeName ?? '—'}</div>
                  </TD>
                  <TD className="text-sm text-slate-600">{getRepName(order.repId)}</TD>
                  <TD className="text-slate-600">{order.items}</TD>
                  <TD className="font-bold text-slate-900">£{order.total.toFixed(2)}</TD>
                  <TD><Badge variant={getStatusVariant(order.status)}>{order.status}</Badge></TD>
                  <TD><Badge variant={getPayVariant(order.paymentStatus)}>{order.paymentStatus}</Badge></TD>
                  <TD className="text-sm text-slate-500">{order.date}</TD>
                  <TD align="center">
                    <div className="flex justify-center gap-1" onClick={e => e.stopPropagation()}>
                      <button onClick={() => openDetail(order)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="View">
                        <Eye className="h-4 w-4" />
                      </button>
                      {order.status === 'Pending' && (
                        <button onClick={e => handleApprove(order.id, e)}
                          className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Approve">
                          <CheckCircle2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </TD>
                </TR>
              ))
            )}
          </TBody>
        </Table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-white rounded-b-2xl">
            <p className="text-xs text-slate-500">
              {Math.min((page - 1) * ITEMS_PER_PAGE + 1, filtered.length)}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-40 transition-colors">
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${page === p ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
                  {p}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-40 transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* Detail Modal */}
      <Modal
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        title={`Order #${selectedOrder?.id}`}
        size="lg"
        footer={
          <div className="flex justify-between w-full">
            <div>
              {selectedOrder?.status === 'Pending' && (
                <Button
                  variant="primary"
                  icon={<CheckCircle2 className="h-4 w-4" />}
                  onClick={e => { handleApprove(selectedOrder.id, e); setShowDetail(false); }}>
                  Approve Order
                </Button>
              )}
            </div>
            <Button variant="secondary" onClick={() => setShowDetail(false)}>Close</Button>
          </div>
        }>
        {renderDetail()}
      </Modal>
    </div>
  );
};

export default SMOrders;
