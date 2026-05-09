import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Card } from '../../components/ui';

const SMOrders: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-black text-slate-800">Orders</h1>
      <p className="text-sm text-slate-500 mt-1">All orders created by the sales team — approve, monitor, and resolve</p>
    </div>
    <Card padding="lg" className="flex flex-col items-center justify-center py-16 text-center">
      <div className="h-16 w-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
        <ShoppingCart className="h-8 w-8 text-blue-400" />
      </div>
      <h2 className="text-lg font-bold text-slate-700 mb-2">Team Orders — Coming Soon</h2>
      <p className="text-sm text-slate-400 max-w-sm">Aggregated view of all orders created by reps. Filter by rep, status, date range. Approve pending orders, resolve disputes, and track fulfillment across the team.</p>
    </Card>
  </div>
);

export default SMOrders;
