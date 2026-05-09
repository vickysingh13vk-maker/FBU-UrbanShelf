import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Card } from '../../components/ui';

const RepOrders: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-black text-slate-800">My Orders</h1>
      <p className="text-sm text-slate-500 mt-1">Orders you have created — track status and manage</p>
    </div>
    <Card padding="lg" className="flex flex-col items-center justify-center py-16 text-center">
      <div className="h-16 w-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
        <ShoppingCart className="h-8 w-8 text-blue-400" />
      </div>
      <h2 className="text-lg font-bold text-slate-700 mb-2">My Orders — Coming Soon</h2>
      <p className="text-sm text-slate-400 max-w-sm">Full list of orders you have created. Create new orders, track fulfillment status, process returns, and view order history per customer.</p>
    </Card>
  </div>
);

export default RepOrders;
