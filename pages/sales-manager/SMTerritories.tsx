import React from 'react';
import { Map } from 'lucide-react';
import { Card } from '../../components/ui';

const SMTerritories: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-black text-slate-800">Territories</h1>
      <p className="text-sm text-slate-500 mt-1">Define and assign geographic territories to sales reps</p>
    </div>
    <Card padding="lg" className="flex flex-col items-center justify-center py-16 text-center">
      <div className="h-16 w-16 bg-teal-50 rounded-2xl flex items-center justify-center mb-4">
        <Map className="h-8 w-8 text-teal-400" />
      </div>
      <h2 className="text-lg font-bold text-slate-700 mb-2">Territory Management — Coming Soon</h2>
      <p className="text-sm text-slate-400 max-w-sm">Interactive map to define territory boundaries, assign reps to regions, view customer density per territory, and balance workload across the sales team.</p>
    </Card>
  </div>
);

export default SMTerritories;
