import React, { useState, useMemo } from 'react';
import {
  Search, Eye, Wallet, TrendingDown, Clock, CheckCircle2,
  ChevronLeft, ChevronRight, AlertTriangle, RefreshCw, MapPin,
} from 'lucide-react';
import {
  Card, Table, THead, TBody, TR, TH, TD, Badge, Button, Modal,
} from '../../components/ui';
import { COLLECTION_ATTEMPTS, ORDERS, CUSTOMERS, REP_STATUSES } from '../../data';
import { CollectionAttempt, Order } from '../../types';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getRepName = (repId?: string) =>
  REP_STATUSES.find(r => r.repId === repId)?.repName ?? (repId ?? '—');

const getCollectionVariant = (status: string): any => {
  if (status === 'Paid')          return 'success';
  if (status === 'Partially Paid') return 'warning';
  if (status === 'Pending')        return 'info';
  if (status === 'Overdue')        return 'danger';
  if (status === 'Disputed')       return 'danger';
  return 'secondary';
};

const getPayVariant = (s: string): any =>
  s === 'Paid'     ? 'success' :
  s === 'Refunded' ? 'info'    :
  s === 'Unpaid'   ? 'danger'  : 'warning';

const getOrderStatusVariant = (s: string): any =>
  s === 'Delivered' ? 'success' : s === 'Cancelled' ? 'danger' :
  s === 'Shipped'   ? 'info'    : s === 'Approved'  ? 'info'   :
  s === 'Picking' || s === 'Packed' ? 'secondary' : 'warning';

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const ITEMS_PER_PAGE = 10;

type Tab = 'collections' | 'outstanding';

// ─── Component ────────────────────────────────────────────────────────────────

const SMPayments: React.FC = () => {
  const [tab,             setTab]            = useState<Tab>('collections');
  const [search,          setSearch]         = useState('');
  const [repFilter,       setRepFilter]      = useState('All');
  const [statusFilter,    setStatusFilter]   = useState('All');
  const [page,            setPage]           = useState(1);
  const [selectedCA,      setSelectedCA]     = useState<CollectionAttempt | null>(null);
  const [selectedOrder,   setSelectedOrder]  = useState<Order | null>(null);
  const [showDetail,      setShowDetail]     = useState(false);

  // ── Reps ─────────────────────────────────────────────────────────────────
  const reps = useMemo(() =>
    Array.from(new Map([
      ...COLLECTION_ATTEMPTS.filter(c => c.repId).map(c => [c.repId, getRepName(c.repId)] as [string, string]),
      ...ORDERS.filter(o => o.repId).map(o => [o.repId!, getRepName(o.repId)] as [string, string]),
    ]).entries()),
    [],
  );

  // ── Collection statuses ───────────────────────────────────────────────────
  const collectionStatuses = useMemo(() =>
    Array.from(new Set(COLLECTION_ATTEMPTS.map(c => c.status))),
    [],
  );

  // ── Filtered collections ──────────────────────────────────────────────────
  const filteredCollections = useMemo(() => COLLECTION_ATTEMPTS.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = !search ||
      c.customerName.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q);
    const matchRep    = repFilter    === 'All' || c.repId   === repFilter;
    const matchStatus = statusFilter === 'All' || c.status  === statusFilter;
    return matchSearch && matchRep && matchStatus;
  }), [search, repFilter, statusFilter]);

  // ── Filtered outstanding orders ───────────────────────────────────────────
  const outstandingOrders = useMemo(() =>
    ORDERS.filter(o => o.paymentStatus !== 'Paid' && o.paymentStatus !== 'Refunded'),
    [],
  );

  const filteredOutstanding = useMemo(() => outstandingOrders.filter(o => {
    const q = search.toLowerCase();
    const matchSearch = !search ||
      o.id.toLowerCase().includes(q) ||
      o.customer.toLowerCase().includes(q);
    const matchRep    = repFilter    === 'All' || o.repId          === repFilter;
    const matchStatus = statusFilter === 'All' || o.paymentStatus  === statusFilter;
    return matchSearch && matchRep && matchStatus;
  }), [outstandingOrders, search, repFilter, statusFilter]);

  // ── KPIs ─────────────────────────────────────────────────────────────────
  const totalCollected   = COLLECTION_ATTEMPTS.reduce((s, c) => s + c.amountCollected, 0);
  const totalRequested   = COLLECTION_ATTEMPTS.reduce((s, c) => s + c.amountRequested, 0);
  const outstanding      = outstandingOrders.reduce((s, o) => s + o.total, 0);
  const overdueCount     = COLLECTION_ATTEMPTS.filter(c => c.status === 'Overdue').length;
  const pendingCount     = COLLECTION_ATTEMPTS.filter(c => c.status === 'Pending').length;

  // ── Pagination ────────────────────────────────────────────────────────────
  const activeList   = tab === 'collections' ? filteredCollections : filteredOutstanding;
  const totalPages   = Math.max(1, Math.ceil(activeList.length / ITEMS_PER_PAGE));
  const safePage     = Math.min(page, totalPages);

  const paginatedCollections = filteredCollections.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);
  const paginatedOutstanding = filteredOutstanding.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleTabChange = (t: Tab) => { setTab(t); setPage(1); setStatusFilter('All'); };
  const handleSearch    = (v: string) => { setSearch(v); setPage(1); };
  const handleRep       = (v: string) => { setRepFilter(v); setPage(1); };
  const handleStatus    = (v: string) => { setStatusFilter(v); setPage(1); };

  const openCollection = (c: CollectionAttempt) => { setSelectedCA(c); setSelectedOrder(null); setShowDetail(true); };
  const openOrder      = (o: Order)              => { setSelectedOrder(o); setSelectedCA(null); setShowDetail(true); };
  const closeDetail    = () => { setShowDetail(false); setSelectedCA(null); setSelectedOrder(null); };

  const detailCustomer = useMemo(() => {
    if (selectedCA)    return CUSTOMERS.find(c => c.id === selectedCA.customerId);
    if (selectedOrder) return CUSTOMERS.find(c => c.id === selectedOrder.customerId);
    return undefined;
  }, [selectedCA, selectedOrder]);

  // ── Payment statuses for filter ───────────────────────────────────────────
  const outstandingPayStatuses = useMemo(() =>
    Array.from(new Set(outstandingOrders.map(o => o.paymentStatus))),
    [outstandingOrders],
  );

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-800">Payments</h1>
        <p className="text-sm text-slate-500 mt-1">
          Outstanding balances, collection tracking, and payment status across team
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Collected',
            value: `£${totalCollected.toFixed(2)}`,
            sub: `of £${totalRequested.toFixed(2)} requested`,
            icon: CheckCircle2, bg: 'bg-emerald-50', iconColor: 'text-emerald-500', textColor: 'text-emerald-700',
          },
          {
            label: 'Outstanding Orders',
            value: `£${outstanding.toFixed(2)}`,
            sub: `${outstandingOrders.length} order${outstandingOrders.length !== 1 ? 's' : ''} unpaid`,
            icon: Wallet, bg: 'bg-amber-50', iconColor: 'text-amber-500', textColor: 'text-amber-700',
          },
          {
            label: 'Overdue Collections',
            value: overdueCount,
            sub: 'require follow-up',
            icon: AlertTriangle, bg: 'bg-rose-50', iconColor: 'text-rose-500', textColor: 'text-rose-700',
          },
          {
            label: 'Pending Collections',
            value: pendingCount,
            sub: 'awaiting attempt',
            icon: Clock, bg: 'bg-sky-50', iconColor: 'text-sky-500', textColor: 'text-sky-700',
          },
        ].map(({ label, value, sub, icon: Icon, bg, iconColor, textColor }) => (
          <Card key={label} padding="md">
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <Icon className={`h-5 w-5 ${iconColor}`} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">{label}</p>
                <p className={`text-xl font-black ${textColor}`}>{value}</p>
                {sub && <p className="text-xs text-slate-400">{sub}</p>}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        {([ ['collections', 'Collection Attempts'], ['outstanding', 'Outstanding Payments'] ] as [Tab, string][]).map(([t, label]) => (
          <button
            key={t}
            onClick={() => handleTabChange(t)}
            className={`px-5 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
              tab === t
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {label}
            <span className={`ml-2 px-1.5 py-0.5 text-xs rounded-full font-bold ${
              tab === t ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'
            }`}>
              {t === 'collections' ? filteredCollections.length : filteredOutstanding.length}
            </span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <Card padding="md">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
              placeholder="Search customer, ID…"
              value={search}
              onChange={e => handleSearch(e.target.value)}
            />
          </div>
          <select
            className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
            value={repFilter}
            onChange={e => handleRep(e.target.value)}
          >
            <option value="All">All Reps</option>
            {reps.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
          </select>
          <select
            className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
            value={statusFilter}
            onChange={e => handleStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            {(tab === 'collections' ? collectionStatuses : outstandingPayStatuses).map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Collections Table */}
      {tab === 'collections' && (
        <Card padding="none" className="overflow-hidden">
          <Table>
            <THead>
              <TR>
                <TH>ID</TH>
                <TH>Customer</TH>
                <TH>Rep</TH>
                <TH>Date</TH>
                <TH>Requested</TH>
                <TH>Collected</TH>
                <TH>Status</TH>
                <TH>Actions</TH>
              </TR>
            </THead>
            <TBody>
              {paginatedCollections.length === 0 ? (
                <TR>
                  <TD colSpan={8}>
                    <div className="py-12 text-center text-slate-400 text-sm">No collection attempts match filters.</div>
                  </TD>
                </TR>
              ) : paginatedCollections.map(c => (
                <TR key={c.id} onClick={() => openCollection(c)} className="cursor-pointer hover:bg-slate-50">
                  <TD><span className="text-xs font-mono text-slate-500">{c.id}</span></TD>
                  <TD>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{c.customerName}</p>
                      <p className="text-xs text-slate-400">#{c.customerId}</p>
                    </div>
                  </TD>
                  <TD><span className="text-sm text-slate-700">{getRepName(c.repId)}</span></TD>
                  <TD><span className="text-sm text-slate-500">{formatDate(c.attemptDate)}</span></TD>
                  <TD><span className="text-sm font-medium text-slate-700">£{c.amountRequested.toFixed(2)}</span></TD>
                  <TD>
                    <span className={`text-sm font-bold ${c.amountCollected > 0 ? 'text-emerald-700' : 'text-slate-400'}`}>
                      £{c.amountCollected.toFixed(2)}
                    </span>
                  </TD>
                  <TD>
                    <Badge variant={getCollectionVariant(c.status)} size="sm">{c.status}</Badge>
                  </TD>
                  <TD onClick={e => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" onClick={() => openCollection(c)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && tab === 'collections' && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
              <p className="text-xs text-slate-500">
                {filteredCollections.length} attempt{filteredCollections.length !== 1 ? 's' : ''} &middot; page {safePage} of {totalPages}
              </p>
              <div className="flex items-center gap-1">
                <button
                  className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-40"
                  disabled={safePage === 1}
                  onClick={() => setPage(p => p - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(n => n === 1 || n === totalPages || Math.abs(n - safePage) <= 1)
                  .map((n, idx, arr) => (
                    <React.Fragment key={n}>
                      {idx > 0 && arr[idx - 1] !== n - 1 && (
                        <span className="text-slate-400 px-1 text-xs">…</span>
                      )}
                      <button
                        className={`w-7 h-7 text-xs rounded font-medium ${
                          safePage === n
                            ? 'bg-indigo-600 text-white'
                            : 'hover:bg-slate-100 text-slate-600'
                        }`}
                        onClick={() => setPage(n)}
                      >
                        {n}
                      </button>
                    </React.Fragment>
                  ))}
                <button
                  className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-40"
                  disabled={safePage === totalPages}
                  onClick={() => setPage(p => p + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Outstanding Payments Table */}
      {tab === 'outstanding' && (
        <Card padding="none" className="overflow-hidden">
          <Table>
            <THead>
              <TR>
                <TH>Order #</TH>
                <TH>Customer</TH>
                <TH>Rep</TH>
                <TH>Date</TH>
                <TH>Total</TH>
                <TH>Order Status</TH>
                <TH>Payment</TH>
                <TH>Actions</TH>
              </TR>
            </THead>
            <TBody>
              {paginatedOutstanding.length === 0 ? (
                <TR>
                  <TD colSpan={8}>
                    <div className="py-12 text-center text-slate-400 text-sm">No outstanding orders match filters.</div>
                  </TD>
                </TR>
              ) : paginatedOutstanding.map(o => (
                <TR key={o.id} onClick={() => openOrder(o)} className="cursor-pointer hover:bg-slate-50">
                  <TD>
                    <span className="text-sm font-bold text-indigo-600">#{o.id}</span>
                  </TD>
                  <TD>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{o.customer}</p>
                      <p className="text-xs text-slate-400">#{o.customerId}</p>
                    </div>
                  </TD>
                  <TD><span className="text-sm text-slate-700">{getRepName(o.repId)}</span></TD>
                  <TD><span className="text-sm text-slate-500">{o.date}</span></TD>
                  <TD><span className="text-sm font-bold text-slate-800">£{o.total.toFixed(2)}</span></TD>
                  <TD>
                    <Badge variant={getOrderStatusVariant(o.status)} size="sm">{o.status}</Badge>
                  </TD>
                  <TD>
                    <Badge variant={getPayVariant(o.paymentStatus)} size="sm">{o.paymentStatus}</Badge>
                  </TD>
                  <TD onClick={e => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" onClick={() => openOrder(o)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && tab === 'outstanding' && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
              <p className="text-xs text-slate-500">
                {filteredOutstanding.length} order{filteredOutstanding.length !== 1 ? 's' : ''} &middot; page {safePage} of {totalPages}
              </p>
              <div className="flex items-center gap-1">
                <button
                  className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-40"
                  disabled={safePage === 1}
                  onClick={() => setPage(p => p - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(n => n === 1 || n === totalPages || Math.abs(n - safePage) <= 1)
                  .map((n, idx, arr) => (
                    <React.Fragment key={n}>
                      {idx > 0 && arr[idx - 1] !== n - 1 && (
                        <span className="text-slate-400 px-1 text-xs">…</span>
                      )}
                      <button
                        className={`w-7 h-7 text-xs rounded font-medium ${
                          safePage === n
                            ? 'bg-indigo-600 text-white'
                            : 'hover:bg-slate-100 text-slate-600'
                        }`}
                        onClick={() => setPage(n)}
                      >
                        {n}
                      </button>
                    </React.Fragment>
                  ))}
                <button
                  className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-40"
                  disabled={safePage === totalPages}
                  onClick={() => setPage(p => p + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Detail Modal */}
      <Modal
        isOpen={showDetail}
        onClose={closeDetail}
        title={selectedCA ? 'Collection Attempt Details' : 'Outstanding Order Details'}
        size="md"
        footer={
          <div className="flex justify-end gap-2 w-full">
            <Button variant="outline" size="sm" onClick={closeDetail}>Close</Button>
          </div>
        }
      >
        {/* Collection Attempt Detail */}
        {selectedCA && (
          <div className="space-y-4">
            {/* Customer card */}
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
              {detailCustomer?.image ? (
                <img src={detailCustomer.image} alt={detailCustomer.name} className="h-12 w-12 rounded-full object-cover" />
              ) : (
                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-base font-bold text-indigo-700">{selectedCA.customerName.charAt(0)}</span>
                </div>
              )}
              <div>
                <p className="text-sm font-bold text-slate-800">{selectedCA.customerName}</p>
                <p className="text-xs text-slate-500">{detailCustomer?.address ?? '—'}</p>
              </div>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Attempt ID', value: selectedCA.id },
                { label: 'Rep', value: getRepName(selectedCA.repId) },
                { label: 'Attempt Date', value: formatDate(selectedCA.attemptDate) },
                { label: 'Promised Date', value: selectedCA.promisedDate ? formatDate(selectedCA.promisedDate) : '—' },
              ].map(({ label, value }) => (
                <div key={label} className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">{label}</p>
                  <p className="text-sm font-semibold text-slate-700">{value}</p>
                </div>
              ))}
            </div>

            {/* Amounts */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-amber-50 rounded-lg">
                <p className="text-xs text-amber-600 mb-1">Requested</p>
                <p className="text-base font-black text-amber-800">£{selectedCA.amountRequested.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg">
                <p className="text-xs text-emerald-600 mb-1">Collected</p>
                <p className="text-base font-black text-emerald-800">£{selectedCA.amountCollected.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-rose-50 rounded-lg">
                <p className="text-xs text-rose-600 mb-1">Remaining</p>
                <p className="text-base font-black text-rose-800">
                  £{Math.max(0, selectedCA.amountRequested - selectedCA.amountCollected).toFixed(2)}
                </p>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <span className="text-sm text-slate-500 font-medium">Status</span>
              <Badge variant={getCollectionVariant(selectedCA.status)}>{selectedCA.status}</Badge>
            </div>

            {/* Notes */}
            {selectedCA.notes && (
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Notes</p>
                <p className="text-sm text-slate-700">{selectedCA.notes}</p>
              </div>
            )}

            {/* Visit link */}
            {selectedCA.visitId && (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <RefreshCw className="h-3 w-3" />
                <span>Linked visit: {selectedCA.visitId}</span>
              </div>
            )}
          </div>
        )}

        {/* Order Detail */}
        {selectedOrder && (
          <div className="space-y-4">
            {/* Customer card */}
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
              {detailCustomer?.image ? (
                <img src={detailCustomer.image} alt={detailCustomer.name} className="h-12 w-12 rounded-full object-cover" />
              ) : (
                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-base font-bold text-indigo-700">{selectedOrder.customer.charAt(0)}</span>
                </div>
              )}
              <div>
                <p className="text-sm font-bold text-slate-800">{selectedOrder.customer}</p>
                <p className="text-xs text-slate-500">{detailCustomer?.address ?? '—'}</p>
              </div>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Order ID', value: `#${selectedOrder.id}` },
                { label: 'Rep', value: getRepName(selectedOrder.repId) },
                { label: 'Date', value: selectedOrder.date },
                { label: 'Items', value: String(selectedOrder.items) },
              ].map(({ label, value }) => (
                <div key={label} className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">{label}</p>
                  <p className="text-sm font-semibold text-slate-700">{value}</p>
                </div>
              ))}
            </div>

            {/* Status row */}
            <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Order</span>
                <Badge variant={getOrderStatusVariant(selectedOrder.status)} size="sm">{selectedOrder.status}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Payment</span>
                <Badge variant={getPayVariant(selectedOrder.paymentStatus)} size="sm">{selectedOrder.paymentStatus}</Badge>
              </div>
            </div>

            {/* Delivery address */}
            {detailCustomer?.address && (
              <div className="flex items-start gap-2 p-3 bg-slate-50 rounded-lg">
                <MapPin className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Delivery Address</p>
                  <p className="text-sm text-slate-700">{detailCustomer.address}</p>
                </div>
              </div>
            )}

            {/* Total */}
            <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl">
              <span className="text-sm font-semibold text-amber-700">Amount Outstanding</span>
              <span className="text-xl font-black text-amber-800">£{selectedOrder.total.toFixed(2)}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SMPayments;
