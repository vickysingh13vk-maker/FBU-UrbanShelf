import React from 'react';
import { Target } from 'lucide-react';
import { Card } from '../../components/ui';

const SMLeads: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-black text-slate-800">Leads Pipeline</h1>
      <p className="text-sm text-slate-500 mt-1">Team-wide lead pipeline — assign, track, and convert across all reps</p>
    </div>
    <Card padding="lg" className="flex flex-col items-center justify-center py-16 text-center">
      <div className="h-16 w-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-4">
        <Target className="h-8 w-8 text-amber-400" />
      </div>
      <h2 className="text-lg font-bold text-slate-700 mb-2">Leads Pipeline — Coming Soon</h2>
      <p className="text-sm text-slate-400 max-w-sm">Kanban-style lead pipeline across the team. Assign leads to reps, track conversion rates, set follow-up deadlines, and monitor pipeline value.</p>
    </Card>
  </div>
);

export default SMLeads;
