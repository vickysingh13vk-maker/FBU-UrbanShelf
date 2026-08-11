import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Search, Plus, Eye, XCircle, Clock, CheckCircle, Package,
  MapPin, Mail, Printer, FileDown, ShoppingCart, AlertTriangle,
  Box, Truck, ChevronLeft, ChevronRight,
} from 'lucide-react';
import {
  Card, Table, THead, TBody, TR, TH, TD, Badge, Button, Modal,
} from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { useSalesExecution } from '../../context/SalesExecutionContext';
import { useSalesCRM } from '../../context/SalesCRMContext';
import { Order } from '../../types';

// ─── Constants ────────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 10;

const SIMULATED_ORDER_ITEMS = [
  { name: 'LOST MARY BM6000 KIT', qty: 10, price: '3.85', flavour: 'Strawberry Lime' },
  { name: 'LOST MARY BM6000 KIT', qty: 5,  price: '3.85', flavour: 'Pineapple Passion Fruit' },
  { name: 'ELF BAR 600',          qty: 20, price: '3.99', flavour: 'Blueberry' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getStatusVariant = (status: string): 'success' | 'danger' | 'info' | 'warning' | 'secondary' => {
  if (status === 'Delivered') return 'success';
  if (status === 'Cancelled') return 'danger';
  if (status === 'Shipped')   return 'info';
  if (status === 'Approved')  return 'info';
  if (status === 'Picking' || status === 'Packed') return 'secondary';
  return 'warning';
};

const getPaymentVariant = (status: string): 'success' | 'danger' | 'warning' | 'info' | 'secondary' => {
  if (status === 'Paid')     return 'success';
  if (status === 'Refunded') return 'info';
  if (status === 'Unpaid')   return 'danger';
  return 'warning';
};

// ─── Component ────────────────────────────────────────────────────────────────

const RepOrders: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const preselectedCustomerId   = (location.state as any)?.customerId;
  const preselectedCustomerName = (location.state as any)?.customerName;

  const { getRepOrders, updateOrder } = useSalesExecution();
  const { customers } = useSalesCRM();
  const repId = user?.id ?? '';

  const getCustomerDetails = (customerName: string) =>
    customers.find(c => c.name === customerName || c.storeName === customerName) ?? {
      email: 'N/A', address: 'N/A', companyName: 'N/A',
      phone: 'N/A', image: undefined,
    };

  const orders = useMemo(() => getRepOrders(repId), [getRepOrders, repId]);

  // Filters
  const [search,       setSearch]       = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [payFilter,    setPayFilter]    = useState('All');
  const [page,         setPage]         = useState(1);

  // Modals
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [showDetail,      setShowDetail]      = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [orderToCancel,   setOrderToCancel]   = useState<Order | null>(null);

  const selectedOrder = useMemo(() =>
    orders.find(o => o.id === selectedOrderId) ?? null,
    [orders, selectedOrderId],
  );

  // ── Derived ────────────────────────────────────────────────────────────────

  const baseOrders = preselectedCustomerId
    ? orders.filter(o => o.customerId === preselectedCustomerId)
    : orders;

  const filtered = useMemo(() => {
    return baseOrders.filter(o => {
      const matchSearch = !search ||
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.customer.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'All' || o.status === statusFilter;
      const matchPay    = payFilter === 'All'    || o.paymentStatus === payFilter;
      return matchSearch && matchStatus && matchPay;
    });
  }, [baseOrders, search, statusFilter, payFilter]);

  const totalPages    = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated     = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const totalRevenue  = orders.filter(o => o.paymentStatus === 'Paid').reduce((s, o) => s + o.total, 0);
  const pendingPay    = orders.filter(o => o.paymentStatus === 'Pending').reduce((s, o) => s + o.total, 0);
  const deliveredCount = orders.filter(o => o.status === 'Delivered').length;
  const pendingCount  = orders.filter(o => o.status === 'Pending').length;

  const statuses = ['Pending', 'Approved', 'Picking', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];

  // ── Actions ────────────────────────────────────────────────────────────────

  const openDetail = (order: Order) => {
    setSelectedOrderId(order.id);
    setShowDetail(true);
  };

  const handlePrintOrder = () => {
    window.print();
  };

  const handleDownloadInvoice = (order: Order) => {
    const cust = getCustomerDetails(order.customer);
    const lines = [
      `INVOICE — Order #${order.id}`,
      `Date: ${order.date}`,
      '',
      `Bill To: ${order.customer}`,
      `Address: ${cust.address}`,
      `Email: ${cust.email}`,
      '',
      'Items:',
      ...SIMULATED_ORDER_ITEMS.map(i => `  ${i.qty} x ${i.name} (${i.flavour}) @ £${i.price}`),
      '',
      `Status: ${order.status}`,
      `Payment Status: ${order.paymentStatus}`,
      `Total: £${order.total.toFixed(2)}`,
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${order.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const openCancel = (order: Order, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setOrderToCancel(order);
    setShowCancelModal(true);
  };

  const handleCancelConfirm = () => {
    if (!orderToCancel) return;
    updateOrder(orderToCancel.id, { status: 'Cancelled' });
    setShowCancelModal(false);
    setOrderToCancel(null);
  };

  // ── Detail modal content ───────────────────────────────────────────────────

  const renderDetail = () => {
    if (!selectedOrder) return null;
    const cd      = getCustomerDetails(selectedOrder.customer);
    const tax     = selectedOrder.total * 0.2;
    const subtotal = selectedOrder.total - tax;
    const canCancel = selectedOrder.status === 'Pending';

    return (
      <div className="space-y-5">

        {/* Customer + Order Info */}
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 flex flex-col md:flex-row justify-between gap-6">
          <div className="flex gap-4">
            <div className="h-12 w-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 text-lg font-bold shadow-sm overflow-hidden flex-shrink-0">
              {(cd as any).image
                ? <img src={(cd as any).image} alt="" className="h-full w-full object-cover" />
                : selectedOrder.customer.charAt(0)
              }
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wide">Customer</p>
              <h3 className="text-lg font-bold text-slate-900">{selectedOrder.customer}</h3>
              <p className="text-sm text-slate-500 mt-0.5">{cd.email}</p>
              <p className="text-xs text-slate-400 mt-1">{selectedOrder.date}</p>
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
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wide">Payment</p>
              <Badge variant={getPaymentVariant(selectedOrder.paymentStatus)}>{selectedOrder.paymentStatus}</Badge>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wide">Total</p>
              <p className="font-bold text-slate-900">£{selectedOrder.total.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h4 className="text-sm font-bold text-slate-900 mb-2">Delivery Address</h4>
          <div className="flex items-start gap-2 text-sm text-slate-600">
            <MapPin className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
            <span>{cd.address !== 'N/A' ? cd.address : 'No address provided'}</span>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-3 bg-slate-50 border-b border-slate-200">
            <p className="text-sm font-bold text-slate-900">Order Items</p>
            <p className="text-xs text-slate-400 mt-0.5">Sample line items — the order model doesn't yet track per-item detail, only the {selectedOrder.items}-item count and total shown above.</p>
          </div>
          <div className="divide-y divide-slate-100">
            {SIMULATED_ORDER_ITEMS.map((item, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-slate-100 border border-slate-200 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">{item.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.flavour} · Qty: {item.qty} × £{item.price}</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-slate-900">
                  £{(item.qty * parseFloat(item.price)).toFixed(2)}
                </p>
              </div>
            ))}
            {selectedOrder.items > 3 && (
              <div className="p-3 text-center text-xs text-slate-500 bg-slate-50/50">
                + {selectedOrder.items - 3} more items...
              </div>
            )}
          </div>
        </div>

        {/* Financial Breakdown */}
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-2">
          <div className="flex justify-between text-sm text-slate-600">
            <span>Subtotal</span>
            <span className="font-medium">£{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-slate-600">
            <span>VAT (20%)</span>
            <span className="font-medium">£{tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-slate-600">
            <span>Shipping</span>
            <span className="font-medium">£0.00</span>
          </div>
          <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
            <span className="text-base font-bold text-slate-900">Total</span>
            <span className="text-xl font-black text-slate-900">£{selectedOrder.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Cancel notice */}
        {canCancel && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-rose-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-rose-700">Cancellation Available</p>
              <p className="text-xs text-rose-600 mt-0.5">This order is still pending. You can cancel it using the button below.</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ── Main Render ────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">

      {/* Header */}
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
            <p className="text-xs text-slate-500 mt-0.5">{orders.length} total orders</p>
          )}
        </div>
        <button
          onClick={() => navigate('/sales/orders/new', { state: { repId } })}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-colors">
          <Plus className="h-4 w-4" /> New Order
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Orders',     value: orders.length,                icon: <Box className="h-5 w-5" />,           color: 'text-indigo-600', bg: 'bg-indigo-50',  border: 'border-indigo-100' },
          { label: 'Revenue (Paid)',   value: `£${totalRevenue.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: <CheckCircle className="h-5 w-5" />, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
          { label: 'Pending Payment',  value: `£${pendingPay.toLocaleString('en-GB',  { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: <Clock className="h-5 w-5" />,        color: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-100' },
          { label: 'Delivered',        value: deliveredCount,                     icon: <Truck className="h-5 w-5" />,         color: 'text-slate-600',  bg: 'bg-slate-50',   border: 'border-slate-200' },
        ].map(kpi => (
          <div key={kpi.label} className={`bg-white border ${kpi.border} rounded-2xl px-4 py-4 shadow-sm flex items-center gap-3`}>
            <div className={`h-10 w-10 ${kpi.bg} rounded-xl flex items-center justify-center flex-shrink-0 ${kpi.color}`}>
              {kpi.icon}
            </div>
            <div>
              <p className={`text-xl font-black ${kpi.color}`}>{kpi.value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{kpi.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Orders Table */}
      <Card padding="none" className="overflow-hidden">

        {/* Filter Bar */}
        <div className="p-4 border-b border-slate-200 bg-white rounded-t-2xl">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="relative flex-1 min-w-0 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search by order # or customer..."
                className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <select
                value={statusFilter}
                onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300">
                <option value="All">All Statuses</option>
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select
                value={payFilter}
                onChange={e => { setPayFilter(e.target.value); setPage(1); }}
                className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300">
                <option value="All">All Payments</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Unpaid">Unpaid</option>
                <option value="Refunded">Refunded</option>
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
                <TD colSpan={8} className="py-16 text-center">
                  <ShoppingCart className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                  <p className="text-sm text-slate-400">No orders found</p>
                  <button
                    onClick={() => navigate('/sales/orders/new', { state: { repId } })}
                    className="mt-3 text-indigo-500 text-sm font-semibold">
                    Create your first order →
                  </button>
                </TD>
              </TR>
            ) : (
              paginated.map(order => {
                const canCancel = order.status === 'Pending';
                return (
                  <TR
                    key={order.id}
                    className="cursor-pointer transition-all"
                    onClick={() => openDetail(order)}>
                    <TD className="font-mono text-slate-600 font-medium">#{order.id}</TD>
                    <TD>
                      <div className="font-medium text-slate-900">{order.customer}</div>
                      <div className="text-xs text-slate-400">{getCustomerDetails(order.customer).companyName}</div>
                    </TD>
                    <TD className="text-slate-600">{order.items}</TD>
                    <TD className="font-bold text-slate-900">£{order.total.toFixed(2)}</TD>
                    <TD>
                      <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                    </TD>
                    <TD>
                      <Badge variant={getPaymentVariant(order.paymentStatus)}>{order.paymentStatus}</Badge>
                    </TD>
                    <TD className="text-slate-500 text-sm">{order.date}</TD>
                    <TD align="center">
                      <div className="flex justify-center gap-1" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => openDetail(order)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="View Order">
                          <Eye className="h-4 w-4" />
                        </button>
                        {canCancel && (
                          <button
                            onClick={e => openCancel(order, e)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Cancel Order">
                            <XCircle className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </TD>
                  </TR>
                );
              })
            )}
          </TBody>
        </Table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-white rounded-b-2xl">
            <p className="text-xs text-slate-500">
              Showing {Math.min((page - 1) * ITEMS_PER_PAGE + 1, filtered.length)}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} orders
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                  if (idx > 0 && typeof arr[idx - 1] === 'number' && (p as number) - (arr[idx - 1] as number) > 1) acc.push('...');
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, idx) =>
                  p === '...' ? (
                    <span key={`ellipsis-${idx}`} className="px-2 text-slate-400 text-sm">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p as number)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                        page === p
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}>
                      {p}
                    </button>
                  ),
                )}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* ── Order Detail Modal ── */}
      <Modal
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        title={`Order #${selectedOrder?.id}`}
        size="lg"
        footer={
          <div className="flex justify-between w-full">
            <div className="flex gap-2">
              <Button variant="secondary" icon={<Printer className="h-4 w-4" />} onClick={handlePrintOrder}>Print</Button>
              <Button variant="secondary" icon={<FileDown className="h-4 w-4" />} onClick={() => selectedOrder && handleDownloadInvoice(selectedOrder)}>Invoice</Button>
            </div>
            <div className="flex gap-2">
              {selectedOrder?.status === 'Pending' && (
                <Button
                  variant="danger"
                  icon={<XCircle className="h-4 w-4" />}
                  onClick={() => { setShowDetail(false); openCancel(selectedOrder!); }}>
                  Cancel Order
                </Button>
              )}
              <Button variant="secondary" onClick={() => setShowDetail(false)}>Close</Button>
            </div>
          </div>
        }>
        {renderDetail()}
      </Modal>

      {/* ── Cancel Confirmation Modal ── */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Order"
        size="sm"
        footer={
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setShowCancelModal(false)}>Go Back</Button>
            <Button variant="danger" onClick={handleCancelConfirm}>Yes, Cancel Order</Button>
          </div>
        }>
        <div className="py-4 space-y-4">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 bg-rose-100 rounded-2xl flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="h-6 w-6 text-rose-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 mb-1">
                Cancel Order #{orderToCancel?.id}?
              </p>
              <p className="text-sm text-slate-500">
                This order for <span className="font-semibold text-slate-700">{orderToCancel?.customer}</span> will be cancelled.
                This action cannot be undone.
              </p>
            </div>
          </div>
          <div className="bg-rose-50 border border-rose-100 rounded-xl p-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-rose-600 font-medium">Order Total</span>
              <span className="font-bold text-rose-700">£{orderToCancel?.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-rose-500">
              <span>{orderToCancel?.items} items</span>
              <span>{orderToCancel?.date}</span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RepOrders;
