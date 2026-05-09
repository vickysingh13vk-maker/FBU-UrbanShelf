import React from 'react';
import { ApprovalRequest, ApprovalStatus } from '../../types';
import { CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';
import { useCRMOps } from '../../context/CRMOpsContext';
import { useAuth } from '../../context/AuthContext';

const TYPE_LABELS: Record<string, string> = {
  'discount-approval':     'Discount Approval',
  'credit-extension':      'Credit Extension',
  'price-override':        'Price Override',
  'return-approval':       'Return Approval',
  'write-off-request':     'Write-off Request',
  'special-terms':         'Special Terms',
};

const STATUS_CONFIG: Record<ApprovalStatus, { bg: string; text: string; icon: React.ReactNode }> = {
  Pending:   { bg: 'bg-amber-50 text-amber-700',   text: 'text-amber-600',   icon: <Clock className="h-3.5 w-3.5" /> },
  Approved:  { bg: 'bg-emerald-50 text-emerald-700', text: 'text-emerald-600', icon: <CheckCircle className="h-3.5 w-3.5" /> },
  Rejected:  { bg: 'bg-rose-50 text-rose-700',     text: 'text-rose-600',    icon: <XCircle className="h-3.5 w-3.5" /> },
  Escalated: { bg: 'bg-purple-50 text-purple-700', text: 'text-purple-600',  icon: <AlertCircle className="h-3.5 w-3.5" /> },
};

interface Props { approval: ApprovalRequest; }

const ApprovalCard: React.FC<Props> = ({ approval: a }) => {
  const { reviewApproval } = useCRMOps();
  const { user } = useAuth();
  const isManager = user?.roleName === 'Sales Manager' || user?.roleName === 'Admin';
  const cfg = STATUS_CONFIG[a.status];

  const timeAgo = (ts: string) => {
    const diff = Date.now() - new Date(ts).getTime();
    const h = Math.floor(diff / 3600000);
    if (h < 1) return `${Math.floor(diff / 60000)}m ago`;
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  const fmt = (v: number | undefined) => v != null ? `₹${v.toLocaleString('en-IN')}` : '—';

  return (
    <div className="p-4 rounded-2xl border border-slate-100 bg-white">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-bold text-slate-800">{TYPE_LABELS[a.type] ?? a.type}</p>
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1 ${cfg.bg}`}>
              {cfg.icon} {a.status}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{a.reason}</p>

          <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-500">
            {a.customerName && <span>Customer: <span className="font-medium text-slate-700">{a.customerName}</span></span>}
            <span>Req by: <span className="font-medium text-slate-700">{a.requestedByName}</span></span>
            <span>{timeAgo(a.requestedAt)}</span>
          </div>

          {(a.requestedAmount != null || a.approvedAmount != null) && (
            <div className="mt-2 flex items-center gap-3 text-xs">
              <span className="text-slate-400">Requested: <span className="text-slate-700 font-semibold">{fmt(a.requestedAmount)}</span></span>
              {a.approvedAmount != null && (
                <span className="text-slate-400">Approved: <span className="text-emerald-700 font-semibold">{fmt(a.approvedAmount)}</span></span>
              )}
            </div>
          )}

          {a.reviewNote && (
            <p className="mt-1.5 text-xs text-slate-400 italic">"{a.reviewNote}"</p>
          )}
        </div>

        {isManager && a.status === 'Pending' && (
          <div className="flex gap-2 flex-shrink-0 ml-2">
            <button
              onClick={() => reviewApproval(a.id, 'Approved', 'Approved', user?.id ?? '', user?.name ?? 'Manager')}
              className="px-3 py-1.5 bg-emerald-500 text-white text-xs font-semibold rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-1"
            >
              <CheckCircle className="h-3 w-3" /> Approve
            </button>
            <button
              onClick={() => reviewApproval(a.id, 'Rejected', 'Rejected', user?.id ?? '', user?.name ?? 'Manager')}
              className="px-3 py-1.5 bg-rose-500 text-white text-xs font-semibold rounded-lg hover:bg-rose-600 transition-colors flex items-center gap-1"
            >
              <XCircle className="h-3 w-3" /> Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApprovalCard;
