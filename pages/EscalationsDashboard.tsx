import React, { useState } from 'react'; // p5-touch
import { AlertTriangle, Plus } from 'lucide-react';
import { Card, Modal, Button, Input, TextArea } from '../components/ui';
import { useCRMOps } from '../context/CRMOpsContext';
import { useAuth } from '../context/AuthContext';
import EscalationCard from '../components/crm-ops/EscalationCard';
import { EscalationStatus, EscalationType, EscalationPriority } from '../types';

type Filter = 'all' | 'open' | EscalationStatus;

const ESCALATION_TYPES: EscalationType[] = [
  'payment-dispute', 'customer-complaint', 'pricing-request',
  'urgent-stock', 'overdue-collection', 'churn-risk', 'missed-sla',
];
const PRIORITIES: EscalationPriority[] = ['Low', 'Medium', 'High', 'Critical'];

const EscalationsDashboard: React.FC = () => {
  const { escalations, getCriticalEscalations, createEscalation } = useCRMOps();
  const { user } = useAuth();
  const [filter, setFilter] = useState<Filter>('all');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    type: 'customer-complaint' as EscalationType,
    priority: 'Medium' as EscalationPriority,
    title: '',
    description: '',
    customerName: '',
  });

  const isRep = user?.roleName === 'Sales Rep';
  const visible = isRep
    ? escalations.filter(e => e.repId === user?.id)
    : escalations;

  const handleCreate = () => {
    if (!form.title.trim() || !form.description.trim()) return;
    createEscalation({
      type: form.type,
      priority: form.priority,
      title: form.title.trim(),
      description: form.description.trim(),
      createdBy: user?.id ?? '',
      createdByName: user?.name ?? '',
      repId: isRep ? user?.id : undefined,
      repName: isRep ? user?.name : undefined,
      customerName: form.customerName.trim() || undefined,
    });
    setForm({ type: 'customer-complaint', priority: 'Medium', title: '', description: '', customerName: '' });
    setShowCreate(false);
  };

  const open = visible.filter(e => e.status !== 'Closed' && e.status !== 'Resolved');
  const critical = getCriticalEscalations();

  const statusCounts = (['Created', 'Assigned', 'Reviewed', 'Resolved', 'Closed'] as EscalationStatus[]).reduce(
    (acc, s) => ({ ...acc, [s]: visible.filter(e => e.status === s).length }), {} as Record<EscalationStatus, number>
  );

  const displayed = filter === 'all' ? visible
    : filter === 'open' ? open
    : visible.filter(e => e.status === filter);

  const sorted = [...displayed].sort((a, b) => {
    const rank = { Critical: 0, High: 1, Medium: 2, Low: 3 };
    return rank[a.priority] - rank[b.priority];
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Escalations</h1>
          <p className="text-sm text-slate-500 mt-0.5">{open.length} open · {critical.length} critical</p>
        </div>
        <Button variant="primary" size="sm" icon={<Plus className="h-4 w-4" />} onClick={() => setShowCreate(true)}>
          Raise Escalation
        </Button>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {(['Created', 'Assigned', 'Reviewed', 'Resolved', 'Closed'] as EscalationStatus[]).map(s => {
          const colors: Record<EscalationStatus, string> = {
            Created: 'text-rose-700', Assigned: 'text-orange-700',
            Reviewed: 'text-amber-700', Resolved: 'text-emerald-700', Closed: 'text-slate-500'
          };
          return (
            <Card key={s} padding="md" className="cursor-pointer hover:shadow-md transition-all"
              onClick={() => setFilter(s)}>
              <p className={`text-2xl font-black ${colors[s]}`}>{statusCounts[s]}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s}</p>
            </Card>
          );
        })}
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'all' as Filter, label: `All (${visible.length})` },
          { key: 'open' as Filter, label: `Open (${open.length})` },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${filter === f.key ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      {sorted.length === 0 ? (
        <Card padding="lg" className="text-center py-16">
          <AlertTriangle className="h-10 w-10 text-slate-200 mx-auto mb-3" />
          <p className="text-sm text-slate-400">No escalations found</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {sorted.map(e => <EscalationCard key={e.id} escalation={e} />)}
        </div>
      )}

      {/* Raise Escalation Modal */}
      <Modal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        title="Raise Escalation"
        size="md"
        footer={
          <div className="flex gap-2 justify-end w-full">
            <Button variant="outline" size="sm" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={handleCreate}>Raise Escalation</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Type</label>
              <select
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
                value={form.type}
                onChange={e => setForm(f => ({ ...f, type: e.target.value as EscalationType }))}
              >
                {ESCALATION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Priority</label>
              <select
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
                value={form.priority}
                onChange={e => setForm(f => ({ ...f, priority: e.target.value as EscalationPriority }))}
              >
                {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <Input
            label="Title"
            placeholder="Brief summary of the issue"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          />
          <Input
            label="Customer (optional)"
            placeholder="Customer or account name"
            value={form.customerName}
            onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))}
          />
          <TextArea
            label="Description"
            rows={3}
            placeholder="Full details of the escalation"
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          />
        </div>
      </Modal>
    </div>
  );
};

export default EscalationsDashboard;
