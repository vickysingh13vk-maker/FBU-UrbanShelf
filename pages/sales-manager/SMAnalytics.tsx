import React from 'react';
import { BarChart3 } from 'lucide-react';
import { Card } from '../../components/ui';

const SMAnalytics: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-black text-slate-800">Analytics</h1>
      <p className="text-sm text-slate-500 mt-1">Deep performance analytics — rep KPIs, trends, conversion funnels</p>
    </div>
    <Card padding="lg" className="flex flex-col items-center justify-center py-16 text-center">
      <div className="h-16 w-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
        <BarChart3 className="h-8 w-8 text-blue-400" />
      </div>
      <h2 className="text-lg font-bold text-slate-700 mb-2">Sales Analytics — Coming Soon</h2>
      <p className="text-sm text-slate-400 max-w-sm">Advanced analytics: rep performance trends, visit-to-order conversion, revenue by territory, customer LTV, seasonal patterns, and predictive target tracking.</p>
    </Card>
  </div>
);

export default SMAnalytics;
