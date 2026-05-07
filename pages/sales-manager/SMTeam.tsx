import React from 'react';
import { Users } from 'lucide-react';
import { Card } from '../../components/ui';

const SMTeam: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-black text-slate-800">Team Monitoring</h1>
      <p className="text-sm text-slate-500 mt-1">Live rep status, activity tracking, and performance oversight</p>
    </div>
    <Card padding="lg" className="flex flex-col items-center justify-center py-16 text-center">
      <div className="h-16 w-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
        <Users className="h-8 w-8 text-indigo-400" />
      </div>
      <h2 className="text-lg font-bold text-slate-700 mb-2">Team Monitoring — Coming Soon</h2>
      <p className="text-sm text-slate-400 max-w-sm">Live GPS tracking, online/offline status per rep, daily activity feed, visit verification, and idle alerts across your entire sales team.</p>
    </Card>
  </div>
);

export default SMTeam;
