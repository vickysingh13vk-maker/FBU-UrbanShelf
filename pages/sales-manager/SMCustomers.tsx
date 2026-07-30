import React, { useState, useMemo } from 'react';
import {
  Search, Eye, Users, TrendingUp, AlertTriangle, UserPlus,
  ChevronLeft, ChevronRight, MapPin, Phone, Mail, Building2, Wallet,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Card, Table, THead, TBody, TR, TH, TD, Badge, Button, Modal,
} from '../../components/ui';
import { CUSTOMERS, ORDERS, REP_STATUSES } from '../../data';
import { Customer } from '../../types';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getRepName = (repId?: string) =>
  REP_STATUSES.find(r => r.repId === repId)?.repName ?? (repId ?? 'Unassigned');

const getLifecycleVariant = (stage?: string): any => {
  if (!stage) return 'secondary';
  if (stage === 'Active')   return 'success';
  if (stage === 'New')      return 'info';
  if (stage === 'Prospect') return 'info';
  if (stage === 'Inactive') return 'secondary';
  if (stage === 'At Risk')  return 'warning';
  if (stage === 'Churned')  return 'danger';
  return 'secondary';
};

const getStatusVariant = (status: string): any =>
  status === 'Approved' ? 'success' :
  status === 'Pending'  ? 'warning' : 'danger';

const formatDate = (iso?: string) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const daysAgo = (iso?: string) => {
  if (!iso) return null;
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
};

const ITEMS_PER_PAGE = 10;
const LIFECYCLE_STAGES = ['New', 'Prospect', 'Active', 'Inactive', 'At Risk', 'Churned'];
const STATUSES = ['Approved', 'Pending', 'Blocked'];

// ─── Component ────────────────────────────────────────────────────────────────

const SMCustomers: React.FC = () => {
  const navigate = useNavigate();
  const [search,          setSearch]          = useState('');
  const [repFilter,       setRepFilter]       = useState('All');
  const [lifecycleFilter, setLifecycleFilter] = useState('All');
  const [statusFilter,    setStatusFilter]    = useState('All');
  const [page,            setPage]            = useState(1);
  const [selected,        setSelected]        = useState<Customer | null>(null);
  const [showDetail,      setShowDetail]      = useState(false);

  // ── Derived ──────────────────────────────────────────────────────────────
  const reps = useMemo(() =>
    Array.from(new Map(
      CUSTOMERS.filter(c => c.assignedRepId)
        .map(c => [c.assignedRepId!, getRepName(c.assignedRepId)])
    ).entries()),
    [],
  );

  const filtered = useMemo(() => CUSTOMERS.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = !search ||
      c.name.toLowerCase().includes(q) ||
      (c.storeName ?? '').toLowerCase().includes(q) ||
      (c.companyName ?? '').toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q);
    const matchRep       = repFilter       === 'All' || c.assignedRepId === repFilter;
    const matchLifecycle = lifecycleFilter === 'All' || c.lifecycleStage === lifecycleFilter;
    const matchStatus    = statusFilter    === 'All' || c.status         === statusFilter;
    return matchSearch && matchRep && matchLifecycle && matchStatus;
  }), [search, repFilter, lifecycleFilter, statusFilter]);

  const totalPages  = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage    = Math.min(page, totalPages);
  const paginated   = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  // ── KPIs ─────────────────────────────────────────────────────────────────
  const totalCustomers = CUSTOMERS.length;
  const activeCount    = CUSTOMERS.filter(c => c.lifecycleStage === 'Active').length;
  const atRiskCount    = CUSTOMERS.filter(c => c.lifecycleStage === 'At Risk' || c.lifecycleStage === 'Churned').length;
  const newCount       = CUSTOMERS.filter(c => c.lifecycleStage === 'New' || c.lifecycleStage === 'Prospect').length;

  // ── Customer orders ───────────────────────────────────────────────────────
  const customerOrders = useMemo(() =>
    selected ? ORDERS.filter(o => o.customerId === selected.id) : [],
    [selected],
  );

  const handleOpen = (c: Customer) => { setSelected(c); setShowDetail(true); };
  const handleClose = () => { setShowDetail(false); setSelected(null); };

  const handleView360 = () => {
    if (!selected) return;
    navigate(`/customers/${selected.id}/360`);
  };

  // ── Page change reset ─────────────────────────────────────────────────────
  const handleSearch = (v: string) => { setSearch(v); setPage(1); };
  const handleRep    = (v: string) => { setRepFilter(v); setPage(1); };
  const handleLC     = (v: string) => { setLifecycleFilter(v); setPage(1); };
  const handleSt     = (v: string) => { setStatusFilter(v); setPage(1); };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-800">Customers</h1>
        <p className="text-sm text-slate-500 mt-1">
          All customer accounts across the team — assign reps, view balances, manage lifecycle
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Customers', value: totalCustomers,  icon: Users,         bg: 'bg-indigo-50',  iconColor: 'text-indigo-500',  textColor: 'text-indigo-700' },
          { label: 'Active',          value: activeCount,     icon: TrendingUp,    bg: 'bg-emerald-50', iconColor: 'text-emerald-500', textColor: 'text-emerald-700' },
          { label: 'At Risk / Churned', value: atRiskCount,  icon: AlertTriangle, bg: 'bg-rose-50',    iconColor: 'text-rose-500',    textColor: 'text-rose-700' },
          { label: 'New / Prospect',  value: newCount,        icon: UserPlus,      bg: 'bg-sky-50',     iconColor: 'text-sky-500',     textColor: 'text-sky-700' },
        ].map(({ label, value, icon: Icon, bg, iconColor, textColor }) => (
          <Card key={label} padding="md">
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <Icon className={`h-5 w-5 ${iconColor}`} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">{label}</p>
                <p className={`text-2xl font-black ${textColor}`}>{value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card padding="md">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
              placeholder="Search customers, store, email…"
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
            value={lifecycleFilter}
            onChange={e => handleLC(e.target.value)}
          >
            <option value="All">All Stages</option>
            {LIFECYCLE_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
            value={statusFilter}
            onChange={e => handleSt(e.target.value)}
          >
            <option value="All">All Statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </Card>

      {/* Table */}
      <Card padding="none" className="overflow-hidden">
        <Table>
          <THead>
            <TR>
              <TH>Customer</TH>
              <TH>Assigned Rep</TH>
              <TH>Lifecycle</TH>
              <TH>Status</TH>
              <TH>Wallet Balance</TH>
              <TH>Last Contact</TH>
              <TH>Actions</TH>
            </TR>
          </THead>
          <TBody>
            {paginated.length === 0 ? (
              <TR>
                <TD colSpan={7}>
                  <div className="py-12 text-center text-slate-400 text-sm">No customers match filters.</div>
                </TD>
              </TR>
            ) : paginated.map(c => (
              <TR key={c.id} onClick={() => handleOpen(c)} className="cursor-pointer hover:bg-slate-50">
                <TD>
                  <div className="flex items-center gap-3">
                    {c.image ? (
                      <img src={c.image} alt={c.name} className="h-9 w-9 rounded-full object-cover flex-shrink-0" />
                    ) : (
                      <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-indigo-700">{c.name.charAt(0)}</span>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{c.name}</p>
                      <p className="text-xs text-slate-400">{c.storeName ?? c.companyName}</p>
                    </div>
                  </div>
                </TD>
                <TD>
                  <span className="text-sm text-slate-700">{getRepName(c.assignedRepId)}</span>
                </TD>
                <TD>
                  <Badge variant={getLifecycleVariant(c.lifecycleStage)} size="sm">
                    {c.lifecycleStage ?? 'Unknown'}
                  </Badge>
                </TD>
                <TD>
                  <Badge variant={getStatusVariant(c.status)} size="sm">{c.status}</Badge>
                </TD>
                <TD>
                  <span className="text-sm font-medium text-slate-700">
                    £{(c.walletBalance ?? 0).toFixed(2)}
                  </span>
                </TD>
                <TD>
                  <span className="text-sm text-slate-500">{daysAgo(c.lastContactDate) ?? '—'}</span>
                </TD>
                <TD onClick={e => e.stopPropagation()}>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpen(c)}
                      title="View customer"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              {filtered.length} customer{filtered.length !== 1 ? 's' : ''} &middot; page {safePage} of {totalPages}
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

      {/* Detail Modal */}
      <Modal
        isOpen={showDetail}
        onClose={handleClose}
        title="Customer Profile"
        size="lg"
        footer={
          <div className="flex gap-2 justify-end w-full">
            <Button variant="outline" size="sm" onClick={handleClose}>Close</Button>
            <Button variant="primary" size="sm" onClick={handleView360}>
              View 360° Profile
            </Button>
          </div>
        }
      >
        {selected && (
          <div className="space-y-5">
            {/* Customer card */}
            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
              {selected.image ? (
                <img src={selected.image} alt={selected.name} className="h-16 w-16 rounded-full object-cover flex-shrink-0" />
              ) : (
                <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold text-indigo-700">{selected.name.charAt(0)}</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <h3 className="text-base font-bold text-slate-800">{selected.name}</h3>
                    <p className="text-sm text-slate-500">{selected.storeName ?? selected.companyName}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={getLifecycleVariant(selected.lifecycleStage)} size="sm">
                      {selected.lifecycleStage}
                    </Badge>
                    <Badge variant={getStatusVariant(selected.status)} size="sm">
                      {selected.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="text-sm font-medium text-slate-700 break-all">{selected.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Phone</p>
                  <p className="text-sm font-medium text-slate-700">{selected.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Address</p>
                  <p className="text-sm font-medium text-slate-700">{selected.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Building2 className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Company / Reg</p>
                  <p className="text-sm font-medium text-slate-700">{selected.companyName}</p>
                  <p className="text-xs text-slate-400">{selected.regNo ?? '—'}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Wallet className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Wallet Balance</p>
                  <p className="text-sm font-bold text-emerald-700">£{(selected.walletBalance ?? 0).toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Users className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Assigned Rep</p>
                  <p className="text-sm font-medium text-slate-700">{getRepName(selected.assignedRepId)}</p>
                </div>
              </div>
            </div>

            {/* Timeline info */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Joined', value: selected.joinedDate ?? '—' },
                { label: 'Last Contact', value: formatDate(selected.lastContactDate) },
                { label: 'Next Follow-Up', value: formatDate(selected.nextFollowUp) },
              ].map(({ label, value }) => (
                <div key={label} className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">{label}</p>
                  <p className="text-sm font-semibold text-slate-700">{value}</p>
                </div>
              ))}
            </div>

            {/* Financial summary */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Credit Limit</p>
                <p className="text-sm font-bold text-slate-700">£{(selected.creditLimit ?? 0).toLocaleString()}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Total Orders</p>
                <p className="text-sm font-bold text-slate-700">{customerOrders.length}</p>
              </div>
            </div>

            {/* Recent orders */}
            {customerOrders.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-slate-700 mb-2">Recent Orders</h4>
                <div className="space-y-2">
                  {customerOrders.slice(0, 4).map(o => (
                    <div key={o.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="text-sm font-semibold text-slate-700">#{o.id}</p>
                        <p className="text-xs text-slate-400">{o.date} &middot; {o.items} items</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-700">£{o.total.toFixed(2)}</span>
                        <Badge variant={
                          o.status === 'Delivered' ? 'success' : o.status === 'Cancelled' ? 'danger' :
                          o.status === 'Shipped' || o.status === 'Approved' ? 'info' : 'warning'
                        } size="sm">{o.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SMCustomers;
