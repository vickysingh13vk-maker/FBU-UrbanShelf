import React, { useState } from 'react';
import { Escalation, EscalationStatus, EscalationPriority } from '../../types';
import { AlertTriangle, ChevronDown, ChevronRight, Clock } from 'lucide-react';
import { useCRMOps } from '../../context/CRMOpsContext';

const PRIORITY_CONFIG: Record<EscalationPriority, { bg: string; text: string; border: string }> = {
  Critical: { bg: 'bg-rose-50',   text: 'text-rose-700',   border: 'border-rose-200'   },
  High:     { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  Medium:   { bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200'  },
  Low:      { bg: 'bg-slate-50',  text: 'text-slate-600',  border: 'border-slate-200'  },
};

const STATUS_COLORS: Record<EscalationStatus, string> = {
  Created:  'bg-rose-100 text-rose-700',
  Assigned: 'bg-orange-100 text-orange-700',
  Reviewed: 'bg-amber-100 text-amber-700',
  Resolved: 'bg-emerald-100 text-emerald-700',
  Closed:   'bg-slate-100 text-slate-500',
};

const FLOW: EscalationStatus[] = ['Created', 'Assigned', 'Reviewed', 'Resolved', 'Closed'];

interface Props { escalation: Escalation; }

const EscalationCard: React.FC<Props> = ({ escalation: e }) => {
  const { updateEscalationStatus } = useCRMOps();
  const [expanded, setExpanded] = useState(false);
  const cfg = PRIORITY_CONFIG[e.priority];

  const isSlaOverdue = e.slaDeadline && new Date(e.slaDeadline) < new Date() && e.status !== 'Closed' && e.status !== 'Resolved';

  const timeAgo = (ts: string) => {
    const diff = Date.now() - new Date(ts).getTime();
    const h = Math.floor(diff / 3600000);
    if (h < 1) return `${Math.floor(diff / 60000)}m ago`;
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  const nextStatus = FLOW[FLOW.indexOf(e.status) + 1];

  return (
    <div className={`p-4 rounded-2xl border ${cfg.border} ${cfg.bg} transition-all`}>
      <div className="flex items-start gap-3">
        <AlertTriangle className={`h-4 w-4 ${cfg.text} mt-0.5 flex-shrink-0`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-bold text-slate-800">{e.title}</p>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${cfg.text} ${cfg.bg}`}>{e.priority}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[e.status]}`}>{e.status}</span>
            {isSlaOverdue && <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-xs font-bold rounded-full flex items-center gap-1"><Clock className="h-3 w-3" /> SLA Overdue</span>}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{e.description}</p>
          <div className="flex items-center gap-3 mt-1 text-xs text-slate-400 flex-wrap">
            {e.customerName && <span>Customer: {e.customerName}</span>}
            {e.assignedToName && <span>Assigned: {e.assignedToName}</span>}
            <span>{timeAgo(e.createdAt)}</span>
          </div>
        </div>
        <button onClick={() => setExpanded(ex => !ex)}
          className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-white/60 flex-shrink-0">
          {expanded ? <ChevronDown className="h-4 w-4 text-slate-500" /> : <ChevronRight className="h-4 w-4 text-slate-500" />}
        </button>
      </div>

      {expanded && (
        <div className="mt-3 ml-7 space-y-3">
          {/* Timeline */}
          <div className="space-y-2">
            {e.timeline.map((ev, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <div className="mt-1.5 h-2 w-2 rounded-full bg-indigo-400 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-slate-700">{ev.status}</span>
                  <span className="text-slate-400"> · {ev.by} · {timeAgo(ev.at)}</span>
                  <p className="text-slate-500 mt-0.5">{ev.note}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Advance button */}
          {nextStatus && e.status !== 'Closed' && (
            <button
              onClick={() => updateEscalationStatus(e.id, nextStatus, `Status advanced to ${nextStatus}`, 'Manager')}
              className="px-3 py-1.5 bg-indigo-500 text-white text-xs font-semibold rounded-lg hover:bg-indigo-600 transition-colors"
            >
              Advance → {nextStatus}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EscalationCard;
