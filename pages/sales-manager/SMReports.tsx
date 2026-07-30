import React, { useState, useMemo } from 'react';
import {
  FileText, Download, TrendingUp, Users, ShoppingCart, Wallet,
  BarChart3, Calendar, ChevronDown,
} from 'lucide-react';
import { Card, Badge, Button, Table, THead, TBody, TR, TH, TD } from '../../components/ui';
import { ORDERS, CUSTOMERS, COLLECTION_ATTEMPTS, REP_STATUSES } from '../../data';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmt = (n: number) => `£${n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

type Period = 'all' | 'thisMonth' | 'lastMonth';

const inPeriod = (dateStr: string, period: Period): boolean => {
  if (period === 'all') return true;
  // dateStr formats: "02/02/2026" (orders) or ISO (collections)
  let d: Date;
  if (dateStr.includes('T')) {
    d = new Date(dateStr);
  } else {
    const [dd, mm, yyyy] = dateStr.split('/');
    d = new Date(`${yyyy}-${mm}-${dd}`);
  }
  const now = new Date();
  if (period === 'thisMonth') {
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }
  const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  return d.getFullYear() === prev.getFullYear() && d.getMonth() === prev.getMonth();
};

// ─── Component ────────────────────────────────────────────────────────────────

const SMReports: React.FC = () => {
  const [period, setPeriod] = useState<Period>('all');
  const [expandedRep, setExpandedRep] = useState<string | null>(null);

  // ── Period-filtered data ──────────────────────────────────────────────────
  const filteredOrders = useMemo(() =>
    ORDERS.filter(o => inPeriod(o.date, period)),
    [period],
  );

  const filteredCollections = useMemo(() =>
    COLLECTION_ATTEMPTS.filter(c => inPeriod(c.attemptDate, period)),
    [period],
  );

  // ── Summary KPIs ──────────────────────────────────────────────────────────
  const totalRevenue      = filteredOrders.filter(o => o.paymentStatus === 'Paid').reduce((s, o) => s + o.total, 0);
  const totalOrders       = filteredOrders.length;
  const totalCollected    = filteredCollections.reduce((s, c) => s + c.amountCollected, 0);
  const activeCustomers   = CUSTOMERS.filter(c => c.lifecycleStage === 'Active').length;

  // ── Per-rep stats ─────────────────────────────────────────────────────────
  const repStats = useMemo(() => REP_STATUSES.map(rep => {
    const orders       = filteredOrders.filter(o => o.repId === rep.repId);
    const revenue      = orders.filter(o => o.paymentStatus === 'Paid').reduce((s, o) => s + o.total, 0);
    const pending      = orders.filter(o => o.status === 'Pending').length;
    const delivered    = orders.filter(o => o.status === 'Delivered').length;
    const customers    = CUSTOMERS.filter(c => c.assignedRepId === rep.repId).length;
    const collections  = filteredCollections.filter(c => c.repId === rep.repId);
    const collected    = collections.reduce((s, c) => s + c.amountCollected, 0);
    const overdue      = collections.filter(c => c.status === 'Overdue').length;
    return { ...rep, orders: orders.length, revenue, pending, delivered, customers, collected, overdue };
  }), [filteredOrders, filteredCollections]);

  // ── Customer breakdown ────────────────────────────────────────────────────
  const lifecycleCounts = useMemo(() => {
    const stages = ['New', 'Prospect', 'Active', 'Inactive', 'At Risk', 'Churned'];
    return stages.map(stage => ({
      stage,
      count: CUSTOMERS.filter(c => c.lifecycleStage === stage).length,
    })).filter(s => s.count > 0);
  }, []);

  const lifecycleVariant = (stage: string): any => {
    if (stage === 'Active')   return 'success';
    if (stage === 'New' || stage === 'Prospect') return 'info';
    if (stage === 'Inactive') return 'secondary';
    if (stage === 'At Risk')  return 'warning';
    if (stage === 'Churned')  return 'danger';
    return 'secondary';
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Reports</h1>
          <p className="text-sm text-slate-500 mt-1">Team performance snapshot across orders, revenue, and collections</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Period selector */}
          <div className="flex rounded-lg border border-slate-200 overflow-hidden bg-white text-sm">
            {([['all', 'All Time'], ['thisMonth', 'This Month'], ['lastMonth', 'Last Month']] as [Period, string][]).map(([v, label]) => (
              <button
                key={v}
                onClick={() => setPeriod(v)}
                className={`px-3 py-1.5 font-medium transition-colors ${
                  period === v ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1.5" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Revenue (Paid)',      value: fmt(totalRevenue),    icon: TrendingUp,   bg: 'bg-emerald-50', iconColor: 'text-emerald-500', textColor: 'text-emerald-700' },
          { label: 'Total Orders',        value: totalOrders,          icon: ShoppingCart, bg: 'bg-indigo-50',  iconColor: 'text-indigo-500',  textColor: 'text-indigo-700' },
          { label: 'Collections Received',value: fmt(totalCollected),  icon: Wallet,       bg: 'bg-amber-50',   iconColor: 'text-amber-500',   textColor: 'text-amber-700' },
          { label: 'Active Customers',    value: activeCustomers,      icon: Users,        bg: 'bg-sky-50',     iconColor: 'text-sky-500',     textColor: 'text-sky-700' },
        ].map(({ label, value, icon: Icon, bg, iconColor, textColor }) => (
          <Card key={label} padding="md">
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <Icon className={`h-5 w-5 ${iconColor}`} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">{label}</p>
                <p className={`text-xl font-black ${textColor}`}>{value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Rep Performance Table */}
      <Card padding="none" className="overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-indigo-500" />
          <h2 className="text-sm font-bold text-slate-700">Rep Performance Breakdown</h2>
        </div>
        <Table>
          <THead>
            <TR>
              <TH>Rep</TH>
              <TH>Customers</TH>
              <TH>Orders</TH>
              <TH>Delivered</TH>
              <TH>Pending</TH>
              <TH>Revenue (Paid)</TH>
              <TH>Collected</TH>
              <TH>Overdue</TH>
            </TR>
          </THead>
          <TBody>
            {repStats.map(rep => (
              <React.Fragment key={rep.repId}>
                <TR
                  onClick={() => setExpandedRep(expandedRep === rep.repId ? null : rep.repId)}
                  className="cursor-pointer hover:bg-slate-50"
                >
                  <TD>
                    <div className="flex items-center gap-2">
                      <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${expandedRep === rep.repId ? 'rotate-180' : ''}`} />
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700">
                        {rep.repName.charAt(0)}
                      </div>
                      <span className="text-sm font-semibold text-slate-800">{rep.repName}</span>
                    </div>
                  </TD>
                  <TD><span className="text-sm text-slate-700">{rep.customers}</span></TD>
                  <TD><span className="text-sm font-semibold text-slate-800">{rep.orders}</span></TD>
                  <TD><span className="text-sm text-emerald-700 font-medium">{rep.delivered}</span></TD>
                  <TD>
                    {rep.pending > 0
                      ? <Badge variant="warning" size="sm">{rep.pending}</Badge>
                      : <span className="text-sm text-slate-400">0</span>
                    }
                  </TD>
                  <TD><span className="text-sm font-bold text-slate-800">{fmt(rep.revenue)}</span></TD>
                  <TD><span className="text-sm font-bold text-emerald-700">{fmt(rep.collected)}</span></TD>
                  <TD>
                    {rep.overdue > 0
                      ? <Badge variant="danger" size="sm">{rep.overdue}</Badge>
                      : <span className="text-sm text-slate-400">0</span>
                    }
                  </TD>
                </TR>

                {/* Expanded: per-rep orders */}
                {expandedRep === rep.repId && (
                  <TR>
                    <TD colSpan={8} className="p-0">
                      <div className="bg-slate-50 border-t border-slate-100 px-6 py-4">
                        <p className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wide">Orders for {rep.repName}</p>
                        {filteredOrders.filter(o => o.repId === rep.repId).length === 0 ? (
                          <p className="text-xs text-slate-400">No orders in this period.</p>
                        ) : (
                          <div className="space-y-2">
                            {filteredOrders.filter(o => o.repId === rep.repId).map(o => (
                              <div key={o.id} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-slate-100">
                                <div className="flex items-center gap-3">
                                  <span className="text-xs font-mono text-indigo-600 font-bold">#{o.id}</span>
                                  <span className="text-xs text-slate-700">{o.customer}</span>
                                  <span className="text-xs text-slate-400">{o.date}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-xs font-bold text-slate-800">{fmt(o.total)}</span>
                                  <Badge variant={
                                    o.status === 'Delivered' ? 'success' : o.status === 'Cancelled' ? 'danger' :
                                    o.status === 'Shipped' || o.status === 'Approved' ? 'info' : 'warning'
                                  } size="sm">{o.status}</Badge>
                                  <Badge variant={
                                    o.paymentStatus === 'Paid' ? 'success' : o.paymentStatus === 'Refunded' ? 'info' : 'warning'
                                  } size="sm">{o.paymentStatus}</Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </TD>
                  </TR>
                )}
              </React.Fragment>
            ))}
          </TBody>
        </Table>
      </Card>

      {/* Customer Lifecycle Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card padding="md">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-4 w-4 text-indigo-500" />
            <h2 className="text-sm font-bold text-slate-700">Customer Lifecycle</h2>
            <span className="text-xs text-slate-400 ml-auto">{CUSTOMERS.length} total</span>
          </div>
          <div className="space-y-3">
            {lifecycleCounts.map(({ stage, count }) => {
              const pct = Math.round((count / CUSTOMERS.length) * 100);
              return (
                <div key={stage}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={lifecycleVariant(stage)} size="sm">{stage}</Badge>
                    </div>
                    <span className="text-xs font-bold text-slate-700">{count} <span className="font-normal text-slate-400">({pct}%)</span></span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        stage === 'Active'   ? 'bg-emerald-400' :
                        stage === 'New' || stage === 'Prospect' ? 'bg-sky-400' :
                        stage === 'Inactive' ? 'bg-slate-300' :
                        stage === 'At Risk'  ? 'bg-amber-400' : 'bg-rose-400'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Collection Summary */}
        <Card padding="md">
          <div className="flex items-center gap-2 mb-4">
            <Wallet className="h-4 w-4 text-amber-500" />
            <h2 className="text-sm font-bold text-slate-700">Collection Summary</h2>
          </div>
          <div className="space-y-3">
            {['Paid', 'Partially Paid', 'Pending', 'Overdue', 'Disputed'].map(status => {
              const items = filteredCollections.filter(c => c.status === status);
              const total = items.reduce((s, c) => s + c.amountRequested, 0);
              const collected = items.reduce((s, c) => s + c.amountCollected, 0);
              if (items.length === 0) return null;
              return (
                <div key={status} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      status === 'Paid' ? 'success' :
                      status === 'Partially Paid' ? 'warning' :
                      status === 'Pending' ? 'info' : 'danger'
                    } size="sm">{status}</Badge>
                    <span className="text-xs text-slate-500">{items.length} attempt{items.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-700">{fmt(collected)} collected</p>
                    <p className="text-xs text-slate-400">of {fmt(total)} requested</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Export section */}
      <Card padding="md">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="h-4 w-4 text-purple-500" />
          <h2 className="text-sm font-bold text-slate-700">Export Reports</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Rep Performance', icon: BarChart3 },
            { label: 'Order Summary',   icon: ShoppingCart },
            { label: 'Collections',     icon: Wallet },
            { label: 'Customer Health', icon: Users },
          ].map(({ label, icon: Icon }) => (
            <button
              key={label}
              className="flex flex-col items-center gap-2 p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors text-center"
            >
              <Icon className="h-5 w-5 text-slate-500" />
              <span className="text-xs font-medium text-slate-600">{label}</span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Download className="h-3 w-3" /> PDF / CSV
              </span>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default SMReports;
