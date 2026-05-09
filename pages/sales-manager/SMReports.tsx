import React from 'react';
import { FileText } from 'lucide-react';
import { Card } from '../../components/ui';

const SMReports: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-black text-slate-800">Reports</h1>
      <p className="text-sm text-slate-500 mt-1">Generate and export team performance reports</p>
    </div>
    <Card padding="lg" className="flex flex-col items-center justify-center py-16 text-center">
      <div className="h-16 w-16 bg-purple-50 rounded-2xl flex items-center justify-center mb-4">
        <FileText className="h-8 w-8 text-purple-400" />
      </div>
      <h2 className="text-lg font-bold text-slate-700 mb-2">Reports — Coming Soon</h2>
      <p className="text-sm text-slate-400 max-w-sm">Scheduled and on-demand reports: rep performance, territory revenue, customer acquisition, commission summaries, and activity logs. Export to PDF and Excel.</p>
    </Card>
  </div>
);

export default SMReports;
