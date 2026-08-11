import React, { useState } from 'react'; // p5-touch
import { CheckSquare, Plus } from 'lucide-react';
import { Card, Modal, Button, Input, TextArea } from '../components/ui';
import { useCRMOps } from '../context/CRMOpsContext';
import { useAuth } from '../context/AuthContext';
import ApprovalCard from '../components/crm-ops/ApprovalCard';
import { ApprovalStatus, ApprovalType } from '../types';

type Filter = 'all' | ApprovalStatus;

const APPROVAL_TYPES: ApprovalType[] = [
  'discount', 'credit-increase', 'order-override',
  'customer-activation', 'payment-adjustment', 'write-off',
];

const ApprovalQueue: React.FC = () => {
  const { approvals, createApproval } = useCRMOps();
  const { user } = useAuth();
  const [filter, setFilter] = useState<Filter>('Pending');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    type: 'discount' as ApprovalType,
    title: '',
    description: '',
    customerName: '',
    amount: '',
  });

  const isRep = user?.roleName === 'Sales Rep';
  const visible = isRep
    ? approvals.filter(a => a.requestedBy === user?.id)
    : approvals;

  const handleCreate = () => {
    if (!form.title.trim() || !form.description.trim()) return;
    createApproval({
      type: form.type,
      title: form.title.trim(),
      description: form.description.trim(),
      requestedBy: user?.id ?? '',
      requestedByName: user?.name ?? '',
      customerName: form.customerName.trim() || undefined,
      amount: form.amount ? parseFloat(form.amount) : undefined,
    });
    setForm({ type: 'discount', title: '', description: '', customerName: '', amount: '' });
    setShowCreate(false);
  };

  const counts: Record<ApprovalStatus, number> = {
    Pending: visible.filter(a => a.status === 'Pending').length,
    Approved: visible.filter(a => a.status === 'Approved').length,
    Rejected: visible.filter(a => a.status === 'Rejected').length,
    Escalated: visible.filter(a => a.status === 'Escalated').length,
  };

  const displayed = filter === 'all' ? visible : visible.filter(a => a.status === filter);
  const sorted = [...displayed].sort((a, b) => b.requestedAt.localeCompare(a.requestedAt));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Approval Queue</h1>
          <p className="text-sm text-slate-500 mt-0.5">{counts.Pending} pending · {visible.length} total</p>
        </div>
        <Button variant="primary" size="sm" icon={<Plus className="h-4 w-4" />} onClick={() => setShowCreate(true)}>
          Request Approval
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {([
          { key: 'Pending'  as ApprovalStatus, text: 'text-amber-700' },
          { key: 'Approved' as ApprovalStatus, text: 'text-emerald-700' },
          { key: 'Rejected' as ApprovalStatus, text: 'text-rose-700' },
          { key: 'Escalated'as ApprovalStatus, text: 'text-orange-700' },
        ]).map(s => (
          <Card key={s.key} padding="md" className="cursor-pointer hover:shadow-md transition-all"
            onClick={() => setFilter(s.key)}>
            <p className={`text-2xl font-black ${s.text}`}>{counts[s.key]}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.key}</p>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 rounded-xl p-1 gap-1 w-fit flex-wrap">
        {([
          { key: 'all' as Filter,       label: `All (${visible.length})` },
          { key: 'Pending' as Filter,   label: `Pending (${counts.Pending})` },
          { key: 'Approved' as Filter,  label: `Approved (${counts.Approved})` },
          { key: 'Rejected' as Filter,  label: `Rejected (${counts.Rejected})` },
        ]).map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${filter === f.key ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {sorted.length === 0 ? (
        <Card padding="lg" className="text-center py-16">
          <CheckSquare className="h-10 w-10 text-slate-200 mx-auto mb-3" />
          <p className="text-sm text-slate-400">No approvals in this category</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {sorted.map(a => <ApprovalCard key={a.id} approval={a} />)}
        </div>
      )}

      {/* Request Approval Modal */}
      <Modal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        title="Request Approval"
        size="md"
        footer={
          <div className="flex gap-2 justify-end w-full">
            <Button variant="outline" size="sm" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={handleCreate}>Submit Request</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Type</label>
            <select
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
              value={form.type}
              onChange={e => setForm(f => ({ ...f, type: e.target.value as ApprovalType }))}
            >
              {APPROVAL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <Input
            label="Title"
            placeholder="Brief summary of the request"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Customer (optional)"
              placeholder="Customer or account name"
              value={form.customerName}
              onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))}
            />
            <Input
              label="Amount / % (optional)"
              type="number"
              placeholder="e.g. 15"
              value={form.amount}
              onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
            />
          </div>
          <TextArea
            label="Description"
            rows={3}
            placeholder="Full details of the request"
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          />
        </div>
      </Modal>
    </div>
  );
};

export default ApprovalQueue;
