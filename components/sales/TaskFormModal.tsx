import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Task, TaskType, TaskPriority } from '../../types';

const TASK_TYPES: TaskType[] = ['Visit', 'Collection', 'Lead Follow-Up', 'Product Push', 'Merchandising', 'Admin'];

interface Props {
  repId: string;
  customerId?: string;
  customerName?: string;
  onSave: (data: Omit<Task, 'id'>) => void;
  onClose: () => void;
}

const TaskFormModal: React.FC<Props> = ({ repId, customerId, customerName, onSave, onClose }) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const [type, setType] = useState<TaskType>('Visit');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [dueDate, setDueDate] = useState(todayStr);

  const handleSave = () => {
    if (!title.trim() || !dueDate) return;
    onSave({ type, title, description: description || undefined, customerId, customerName, repId, priority, dueDate, status: 'Pending' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="text-base font-black text-slate-800">Add Task</h2>
          <button onClick={onClose} className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-2 block">Type</label>
            <div className="flex flex-wrap gap-2">
              {TASK_TYPES.map(t => (
                <button key={t} onClick={() => setType(t)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${type === t ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">Title</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Task title"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Priority</label>
              <select value={priority} onChange={e => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
                <option>High</option><option>Medium</option><option>Low</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Due Date</label>
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">Description (optional)</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2}
              placeholder="Additional details..."
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none" />
          </div>
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <button onClick={onClose} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
          <button onClick={handleSave} disabled={!title.trim()}
            className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-50">
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskFormModal;
