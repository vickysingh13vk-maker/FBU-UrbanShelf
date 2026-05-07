import React from 'react';
import { Zap, Play, Pause, Activity } from 'lucide-react';
import { Card } from '../components/ui';
import { useAutomation } from '../context/AutomationContext';
import { AutomationStatus } from '../types';

const STATUS_CONFIG: Record<AutomationStatus, { bg: string; text: string; label: string }> = {
  Active:   { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Active'   },
  Paused:   { bg: 'bg-amber-50',   text: 'text-amber-700',   label: 'Paused'   },
  Disabled: { bg: 'bg-slate-50',   text: 'text-slate-500',   label: 'Disabled' },
};

const TRIGGER_LABELS: Record<string, string> = {
  'no-visit-30d': 'No visit in 30 days',
  'overdue-payment': 'Payment overdue 7+ days',
  'inactive-lead-21d': 'Lead inactive 21 days',
  'missed-follow-up': 'Follow-up missed 2+ days',
  'customer-inactive-45d': 'Customer inactive 45 days',
  'collection-overdue': 'Collection overdue 3+ days',
  'lead-stale-14d': 'Lead stale 14 days',
};

const ACTION_LABELS: Record<string, string> = {
  'create-follow-up': 'Create follow-up',
  'create-task': 'Create task',
  'create-notification': 'Send notification',
  'mark-lead-stale': 'Mark lead stale',
  'create-escalation': 'Create escalation',
  'alert-manager': 'Alert manager',
};

const AutomationRules: React.FC = () => {
  const { rules, toggleRule, getActiveRules } = useAutomation();
  const activeCount = getActiveRules().length;
  const totalFired = rules.reduce((s, r) => s + r.totalFired, 0);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-slate-800">Automation Rules</h1>
        <p className="text-sm text-slate-500 mt-0.5">{activeCount} active · {totalFired} total firings</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card padding="md">
          <p className="text-2xl font-black text-emerald-700">{activeCount}</p>
          <p className="text-xs text-slate-500 mt-0.5">Active Rules</p>
        </Card>
        <Card padding="md">
          <p className="text-2xl font-black text-amber-700">{rules.filter(r => r.status === 'Paused').length}</p>
          <p className="text-xs text-slate-500 mt-0.5">Paused</p>
        </Card>
        <Card padding="md">
          <p className="text-2xl font-black text-slate-800">{totalFired}</p>
          <p className="text-xs text-slate-500 mt-0.5">Total Fired</p>
        </Card>
      </div>

      {/* Rules list */}
      <div className="space-y-3">
        {rules.map(rule => {
          const cfg = STATUS_CONFIG[rule.status];
          return (
            <Card key={rule.id} padding="md">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 ${rule.status === 'Active' ? 'bg-emerald-50' : 'bg-slate-100'}`}>
                    <Zap className={`h-4 w-4 ${rule.status === 'Active' ? 'text-emerald-600' : 'text-slate-400'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold text-slate-800">{rule.name}</p>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>{cfg.label}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{rule.description}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <span className="text-xs px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md font-medium">
                        WHEN: {TRIGGER_LABELS[rule.trigger]}
                      </span>
                      {rule.actions.map(a => (
                        <span key={a} className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">
                          → {ACTION_LABELS[a]}
                        </span>
                      ))}
                    </div>
                    <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><Activity className="h-3 w-3" /> {rule.totalFired} fired</span>
                      {rule.lastRunAt && <span>Last: {new Date(rule.lastRunAt).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>}
                      <span>Applies to: {rule.appliesTo.join(', ')}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => toggleRule(rule.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex-shrink-0 ${
                    rule.status === 'Active'
                      ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  }`}
                >
                  {rule.status === 'Active'
                    ? <><Pause className="h-3 w-3" /> Pause</>
                    : <><Play className="h-3 w-3" /> Activate</>
                  }
                </button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AutomationRules;
