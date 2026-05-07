import React from 'react';
import { Wifi, WifiOff, Clock, MapPin } from 'lucide-react';
import { useWorkSession } from '../../context/WorkSessionContext';
import { useCheckIn } from '../../context/CheckInContext';

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map(n => String(n).padStart(2, '0')).join(':');
}

interface Props {
  onToggle: () => void;
}

const WorkSessionBanner: React.FC<Props> = ({ onToggle }) => {
  const { isOnline, elapsedSeconds, currentSession } = useWorkSession();
  const { checkedInCustomer } = useCheckIn();

  if (!isOnline) {
    return (
      <div className="flex items-center justify-between bg-slate-100 border border-slate-200 rounded-2xl px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-slate-200 rounded-xl flex items-center justify-center">
            <WifiOff className="h-4 w-4 text-slate-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700">You are offline</p>
            <p className="text-xs text-slate-400">Start your work session to log activities</p>
          </div>
        </div>
        <button
          onClick={onToggle}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-xl transition-colors"
        >
          Go Online
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4">
      <div className="flex items-center gap-4">
        <div className="h-9 w-9 bg-emerald-500 rounded-xl flex items-center justify-center">
          <Wifi className="h-4 w-4 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse" />
            <p className="text-sm font-bold text-emerald-800">Session Active</p>
          </div>
          <p className="text-xs text-emerald-600 mt-0.5">
            {currentSession?.totalVisits ?? 0} visits · {currentSession?.totalOrders ?? 0} orders
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-emerald-200 rounded-xl px-3 py-1.5">
          <Clock className="h-3.5 w-3.5 text-emerald-600" />
          <span className="text-sm font-mono font-bold text-emerald-700">{formatTime(elapsedSeconds)}</span>
        </div>
        {checkedInCustomer && (
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-600">
            <MapPin className="h-3.5 w-3.5" />
            <span className="font-medium">{checkedInCustomer.storeName}</span>
          </div>
        )}
      </div>
      <button
        onClick={onToggle}
        className="px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white text-sm font-bold rounded-xl transition-colors"
      >
        End Session
      </button>
    </div>
  );
};

export default WorkSessionBanner;
