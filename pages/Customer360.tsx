import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Activity, DollarSign, FileText, ClipboardList, AlertTriangle, CheckSquare } from 'lucide-react';
import { useSalesCRM } from '../context/SalesCRMContext';
import { useCRMOps } from '../context/CRMOpsContext';
import { Card } from '../components/ui';
import EscalationCard from '../components/crm-ops/EscalationCard';
import ApprovalCard from '../components/crm-ops/ApprovalCard';
import DocumentCard from '../components/crm-ops/DocumentCard';
import { ORDERS, COLLECTION_ATTEMPTS } from '../data';

type Tab = 'profile' | 'activity' | 'financials' | 'documents' | 'escalations' | 'approvals';

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'profile',     label: 'Profile',     icon: <User className="h-4 w-4" /> },
  { id: 'activity',    label: 'Activity',    icon: <Activity className="h-4 w-4" /> },
  { id: 'financials',  label: 'Financials',  icon: <DollarSign className="h-4 w-4" /> },
  { id: 'documents',   label: 'Documents',   icon: <FileText className="h-4 w-4" /> },
  { id: 'escalations', label: 'Escalations', icon: <AlertTriangle className="h-4 w-4" /> },
  { id: 'approvals',   label: 'Approvals',   icon: <CheckSquare className="h-4 w-4" /> },
];

const HEALTH_COLORS: Record<string, string> = {
  Healthy:   'bg-emerald-50 text-emerald-700 border-emerald-200',
  Warning:   'bg-amber-50 text-amber-700 border-amber-200',
  'High Risk':'bg-orange-50 text-orange-700 border-orange-200',
  Critical:  'bg-rose-50 text-rose-700 border-rose-200',
};

const Customer360: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { customers } = useSalesCRM();
  const { escalations, approvals, getDocumentsForEntity, auditLogs } = useCRMOps();
  const [tab, setTab] = useState<Tab>('profile');

  const customer = customers.find(c => c.id === id);
  if (!customer) {
    return (
      <div className="space-y-5">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-indigo-500 hover:text-indigo-700 font-semibold">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <Card padding="lg" className="text-center py-16">
          <p className="text-slate-400">Customer not found.</p>
        </Card>
      </div>
    );
  }

  const custOrders = ORDERS.filter(o => o.customerId === id);
  const custCollections = COLLECTION_ATTEMPTS.filter(c => c.customerId === id);
  const custEscalations = escalations.filter(e => e.customerId === id);
  const custApprovals = approvals.filter(a => a.customerId === id);
  const custDocs = getDocumentsForEntity('customer', id!);
  const custAudit = auditLogs.filter(l => l.entityId === id).slice(0, 20);

  const totalOrders = custOrders.reduce((s, o) => s + o.total, 0);
  const totalCollected = custCollections.reduce((s, c) => s + c.amountCollected, 0);
  const overdue = custCollections.filter(c => c.status === 'Promised' || c.status === 'Failed').reduce((s, c) => s + (c.amountRequested - c.amountCollected), 0);

  const fmt = (v: number) => `₹${v.toLocaleString('en-IN')}`;
  const lifecycleStage = customer.lifecycleStage ?? 'Active';
  const healthCls = HEALTH_COLORS['Healthy'];

  const timeAgo = (ts: string) => {
    const diff = Date.now() - new Date(ts).getTime();
    const h = Math.floor(diff / 3600000);
    if (h < 1) return `${Math.floor(diff / 60000)}m ago`;
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-indigo-500 hover:text-indigo-700 font-semibold mb-3">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="flex items-start gap-4">
          <div className="h-14 w-14 rounded-2xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
            <span className="text-xl font-black text-indigo-600">{customer.name.charAt(0)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-black text-slate-800">{customer.name}</h1>
              {lifecycleStage && (
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${healthCls}`}>{lifecycleStage}</span>
              )}
            </div>
            <p className="text-sm text-slate-500 mt-0.5">{customer.phone} · {customer.address}</p>
          </div>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-4 gap-3">
        <Card padding="md">
          <p className="text-xs text-slate-400">Orders</p>
          <p className="text-xl font-black text-slate-800 mt-0.5">{custOrders.length}</p>
          <p className="text-xs text-indigo-500">{fmt(totalOrders)}</p>
        </Card>
        <Card padding="md">
          <p className="text-xs text-slate-400">Collected</p>
          <p className="text-xl font-black text-emerald-700 mt-0.5">{fmt(totalCollected)}</p>
        </Card>
        <Card padding="md">
          <p className="text-xs text-slate-400">Overdue</p>
          <p className={`text-xl font-black mt-0.5 ${overdue > 0 ? 'text-rose-600' : 'text-slate-400'}`}>{fmt(overdue)}</p>
        </Card>
        <Card padding="md">
          <p className="text-xs text-slate-400">Escalations</p>
          <p className="text-xl font-black text-slate-800 mt-0.5">{custEscalations.length}</p>
          <p className="text-xs text-amber-500">{custEscalations.filter(e => e.status !== 'Closed').length} open</p>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              tab === t.id ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'profile' && (
        <Card padding="md" className="space-y-3">
          <h2 className="text-sm font-bold text-slate-700">Customer Info</h2>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div><p className="text-slate-400">Name</p><p className="font-semibold text-slate-800">{customer.name}</p></div>
            <div><p className="text-slate-400">Phone</p><p className="font-semibold text-slate-800">{customer.phone}</p></div>
            {customer.email && <div><p className="text-slate-400">Email</p><p className="font-semibold text-slate-800">{customer.email}</p></div>}
            <div><p className="text-slate-400">Address</p><p className="font-semibold text-slate-800">{customer.address}</p></div>
            {customer.assignedRepName && <div><p className="text-slate-400">Assigned Rep</p><p className="font-semibold text-slate-800">{customer.assignedRepName}</p></div>}
            {customer.creditLimit != null && <div><p className="text-slate-400">Credit Limit</p><p className="font-semibold text-slate-800">{fmt(customer.creditLimit)}</p></div>}
            {customer.walletBalance != null && <div><p className="text-slate-400">Wallet Balance</p><p className="font-semibold text-slate-800">{fmt(customer.walletBalance)}</p></div>}
            {customer.lastContactDate && <div><p className="text-slate-400">Last Contact</p><p className="font-semibold text-slate-800">{timeAgo(customer.lastContactDate)}</p></div>}
          </div>
        </Card>
      )}

      {tab === 'activity' && (
        <div className="space-y-2">
          {custAudit.length === 0 ? (
            <Card padding="lg" className="text-center py-10">
              <p className="text-sm text-slate-400">No activity recorded.</p>
            </Card>
          ) : (
            custAudit.map((log, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 bg-white">
                <div className="mt-1.5 h-2 w-2 rounded-full bg-indigo-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-700">{log.action} — {log.entityType}</p>
                  <p className="text-xs text-slate-400">{log.performedByName} · {timeAgo(log.performedAt)}</p>
                  {log.notes && <p className="text-xs text-slate-500 mt-0.5">{log.notes}</p>}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'financials' && (
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-700">Orders</h2>
          {custOrders.length === 0 ? (
            <Card padding="md" className="text-center py-8"><p className="text-sm text-slate-400">No orders.</p></Card>
          ) : (
            custOrders.map(o => (
              <Card key={o.id} padding="md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-800">{o.id}</p>
                    <p className="text-xs text-slate-400">{o.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-800">{fmt(o.total)}</p>
                    <p className="text-xs text-slate-400">{o.status}</p>
                  </div>
                </div>
              </Card>
            ))
          )}
          <h2 className="text-sm font-bold text-slate-700 pt-2">Collection Attempts</h2>
          {custCollections.length === 0 ? (
            <Card padding="md" className="text-center py-8"><p className="text-sm text-slate-400">No collection attempts.</p></Card>
          ) : (
            custCollections.map(c => (
              <Card key={c.id} padding="md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-800">{fmt(c.amountRequested)} requested</p>
                    <p className="text-xs text-slate-400">{c.attemptDate} · collected: {fmt(c.amountCollected)}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    c.status === 'Collected' ? 'bg-emerald-100 text-emerald-700' :
                    c.status === 'Failed' ? 'bg-rose-100 text-rose-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>{c.status}</span>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {tab === 'documents' && (
        <div>
          {custDocs.length === 0 ? (
            <Card padding="lg" className="text-center py-10">
              <p className="text-sm text-slate-400">No documents uploaded.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {custDocs.map(d => <DocumentCard key={d.id} document={d} />)}
            </div>
          )}
        </div>
      )}

      {tab === 'escalations' && (
        <div className="space-y-3">
          {custEscalations.length === 0 ? (
            <Card padding="lg" className="text-center py-10">
              <p className="text-sm text-slate-400">No escalations for this customer.</p>
            </Card>
          ) : (
            custEscalations.map(e => <EscalationCard key={e.id} escalation={e} />)
          )}
        </div>
      )}

      {tab === 'approvals' && (
        <div className="space-y-3">
          {custApprovals.length === 0 ? (
            <Card padding="lg" className="text-center py-10">
              <p className="text-sm text-slate-400">No approval requests for this customer.</p>
            </Card>
          ) : (
            custApprovals.map(a => <ApprovalCard key={a.id} approval={a} />)
          )}
        </div>
      )}
    </div>
  );
};

export default Customer360;
