import React from 'react';
import { UserCircle } from 'lucide-react';
import { Card } from '../../components/ui';

const RepProfile: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-black text-slate-800">My Profile</h1>
      <p className="text-sm text-slate-500 mt-1">Your account details, territory, and settings</p>
    </div>
    <Card padding="lg" className="flex flex-col items-center justify-center py-16 text-center">
      <div className="h-16 w-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
        <UserCircle className="h-8 w-8 text-slate-400" />
      </div>
      <h2 className="text-lg font-bold text-slate-700 mb-2">Profile & Settings — Coming Soon</h2>
      <p className="text-sm text-slate-400 max-w-sm">Your personal profile, territory assignment, notification preferences, work session history, and account settings.</p>
    </Card>
  </div>
);

export default RepProfile;
