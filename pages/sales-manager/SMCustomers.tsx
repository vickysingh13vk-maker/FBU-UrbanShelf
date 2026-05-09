import React from 'react';
import { UsersRound } from 'lucide-react';
import { Card } from '../../components/ui';

const SMCustomers: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-black text-slate-800">Customers</h1>
      <p className="text-sm text-slate-500 mt-1">All customer accounts across the team — assign reps, view balances, manage lifecycle</p>
    </div>
    <Card padding="lg" className="flex flex-col items-center justify-center py-16 text-center">
      <div className="h-16 w-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
        <UsersRound className="h-8 w-8 text-blue-400" />
      </div>
      <h2 className="text-lg font-bold text-slate-700 mb-2">Customer Management — Coming Soon</h2>
      <p className="text-sm text-slate-400 max-w-sm">Full customer list across all reps, rep assignment, lifecycle stage tracking (Lead → Active → At Risk → Archived), and communication history.</p>
    </Card>
  </div>
);

export default SMCustomers;
