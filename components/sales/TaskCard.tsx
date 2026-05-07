import React from 'react';
import { MapPin, CreditCard, Users, Package, Wrench, FileText, CheckCircle, Circle } from 'lucide-react';
import { Task, TaskType, TaskStatus } from '../../types';

const TYPE_CONFIG: Record<TaskType, { icon: React.ReactNode; color: string }> = {
  'Visit':          { icon: <MapPin className="h-3.5 w-3.5" />,     color: 'text-indigo-600' },
  'Collection':     { icon: <CreditCard className="h-3.5 w-3.5" />, color: 'text-rose-600' },
  'Lead Follow-Up': { icon: <Users className="h-3.5 w-3.5" />,      color: 'text-violet-600' },
  'Product Push':   { icon: <Package className="h-3.5 w-3.5" />,    color: 'text-blue-600' },
  'Merchandising':  { icon: <Wrench className="h-3.5 w-3.5" />,     color: 'text-amber-600' },
  'Admin':          { icon: <FileText className="h-3.5 w-3.5" />,   color: 'text-slate-500' },
};

const STATUS_BADGE: Record<TaskStatus, string> = {
  'Pending':     'bg-slate-100 text-slate-600',
  'In Progress': 'bg-blue-100 text-blue-700',
  'Completed':   'bg-emerald-100 text-emerald-700',
  'Overdue':     'bg-rose-100 text-rose-700',
};

const PRIORITY_DOT: Record<string, string> = {
  High: 'bg-rose-500', Medium: 'bg-amber-400', Low: 'bg-slate-300',
};

interface Props {
  task: Task;
  onToggle?: (id: string) => void;
  compact?: boolean;
}

const TaskCard: React.FC<Props> = ({ task, onToggle, compact = false }) => {
  const cfg = TYPE_CONFIG[task.type];
  const isDone = task.status === 'Completed';

  return (
    <div className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
      isDone ? 'border-slate-100 bg-slate-50 opacity-60' :
      task.status === 'Overdue' ? 'border-rose-100 bg-rose-50' :
      task.status === 'In Progress' ? 'border-blue-100 bg-blue-50' :
      'border-slate-100 bg-white'
    }`}>
      <button
        onClick={() => onToggle?.(task.id)}
        className={`mt-0.5 flex-shrink-0 transition-colors ${isDone ? 'text-emerald-500' : 'text-slate-300 hover:text-slate-400'}`}>
        {isDone ? <CheckCircle className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-0.5">
          <p className={`text-xs font-bold truncate ${isDone ? 'line-through text-slate-400' : 'text-slate-700'}`}>
            {task.title}
          </p>
          <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-lg flex-shrink-0 ${STATUS_BADGE[task.status]}`}>
            {task.status}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1 ${cfg.color}`}>
            {cfg.icon}
            <span className="text-xs text-slate-400">{task.type}</span>
          </div>
          <div className={`h-1.5 w-1.5 rounded-full ${PRIORITY_DOT[task.priority]}`} />
          <span className="text-xs text-slate-400">{task.priority}</span>
        </div>
        {!compact && task.customerName && (
          <p className="text-xs text-slate-400 mt-0.5 truncate">@ {task.customerName}</p>
        )}
        {!compact && task.description && (
          <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{task.description}</p>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
