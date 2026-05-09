import React from 'react';
import { Wallet } from 'lucide-react';
import { Card } from '../../components/ui';

const SMPayments: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-black text-slate-800">Payments</h1>
      <p className="text-sm text-slate-500 mt-1">Outstanding balances, collection tracking, and commission payouts across team</p>
    </div>
    <Card padding="lg" className="flex flex-col items-center justify-center py-16 text-center">
      <div className="h-16 w-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
        <Wallet className="h-8 w-8 text-emerald-400" />
      </div>
      <h2 className="text-lg font-bold text-slate-700 mb-2">Payment Management — Coming Soon</h2>
      <p className="text-sm text-slate-400 max-w-sm">Outstanding invoice tracker, overdue alerts, rep collection performance, commission approval and payout management across the entire sales team.</p>
    </Card>
  </div>
);

export default SMPayments;
