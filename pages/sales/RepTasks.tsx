import React, { useState } from 'react';
import { CheckSquare, Plus } from 'lucide-react';
import { Card } from '../../components/ui';
import TaskCard from '../../components/sales/TaskCard';
import TaskFormModal from '../../components/sales/TaskFormModal';
import { useSalesExecution } from '../../context/SalesExecutionContext';
import { useAuth } from '../../context/AuthContext';
import { Task, TaskStatus } from '../../types';

type Tab = 'active' | 'completed';

const RepTasks: React.FC = () => {
  const { user } = useAuth();
  const { getRepTasks, completeTask, addTask } = useSalesExecution();

  const [tab, setTab] = useState<Tab>('active');
  const [showModal, setShowModal] = useState(false);

  const repId = user?.id ?? '';
  const allTasks = getRepTasks(repId);

  const active = allTasks.filter(t => t.status !== 'Completed');
  const completed = allTasks.filter(t => t.status === 'Completed');

  const overdue = active.filter(t => t.status === 'Overdue').length;
  const inProgress = active.filter(t => t.status === 'In Progress').length;

  const sortedActive = [...active].sort((a, b) => {
    const order: Record<TaskStatus, number> = { Overdue: 0, 'In Progress': 1, Pending: 2, Completed: 3 };
    return (order[a.status] ?? 3) - (order[b.status] ?? 3) || a.dueDate.localeCompare(b.dueDate);
  });

  const displayList: Task[] = tab === 'active' ? sortedActive : completed;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Tasks</h1>
          <p className="text-sm text-slate-500 mt-1">
            {overdue > 0 ? `${overdue} overdue · ` : ''}{inProgress > 0 ? `${inProgress} in progress · ` : ''}{active.length} total active
          </p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-colors">
          <Plus className="h-4 w-4" /> Add Task
        </button>
      </div>

      {/* Summary strip */}
      {active.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total Active', value: active.length, color: 'text-slate-800' },
            { label: 'Overdue',      value: overdue,       color: overdue > 0 ? 'text-rose-600' : 'text-slate-400' },
            { label: 'In Progress',  value: inProgress,    color: inProgress > 0 ? 'text-blue-600' : 'text-slate-400' },
          ].map(s => (
            <Card key={s.label} padding="md">
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
            </Card>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex bg-slate-100 rounded-xl p-1 gap-1 w-fit">
        <button onClick={() => setTab('active')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${tab === 'active' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>
          Active ({active.length})
        </button>
        <button onClick={() => setTab('completed')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${tab === 'completed' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>
          Done ({completed.length})
        </button>
      </div>

      {/* List */}
      {displayList.length === 0 ? (
        <Card padding="lg" className="text-center py-16">
          <CheckSquare className="h-10 w-10 text-slate-200 mx-auto mb-3" />
          <p className="text-sm text-slate-400">{tab === 'active' ? 'No active tasks' : 'No completed tasks yet'}</p>
          {tab === 'active' && (
            <button onClick={() => setShowModal(true)} className="mt-3 text-indigo-500 text-sm font-semibold">
              Add your first task →
            </button>
          )}
        </Card>
      ) : (
        <div className="space-y-2">
          {displayList.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={task.status !== 'Completed' ? completeTask : undefined}
            />
          ))}
        </div>
      )}

      {showModal && (
        <TaskFormModal
          repId={repId}
          onSave={data => { addTask(data); setShowModal(false); }}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default RepTasks;
