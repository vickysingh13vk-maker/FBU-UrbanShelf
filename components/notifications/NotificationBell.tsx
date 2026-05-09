import React, { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import NotificationCard from './NotificationCard';
import { useNavigate } from 'react-router-dom';
import { NotificationRole } from '../../types';

const NotificationBell: React.FC = () => {
  const { user } = useAuth();
  const { getUnread, getForRole, markAllRead } = useNotifications();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const role: NotificationRole = (user?.roleName as NotificationRole) ?? 'any';
  const repId = role === 'Sales Rep' ? user?.id : undefined;
  const unread = getUnread(role, repId);
  const recent = getForRole(role, repId).slice(0, 5);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="relative h-9 w-9 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors"
      >
        <Bell className="h-5 w-5 text-slate-600" />
        {unread.length > 0 && (
          <span className="absolute top-1 right-1 h-4 min-w-4 px-0.5 bg-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unread.length > 9 ? '9+' : unread.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <p className="text-sm font-bold text-slate-800">Notifications</p>
            {unread.length > 0 && (
              <button onClick={() => markAllRead(role, repId)}
                className="text-xs text-indigo-500 font-semibold hover:text-indigo-700">
                Mark all read
              </button>
            )}
          </div>
          <div className="p-2 space-y-1 max-h-80 overflow-y-auto">
            {recent.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-6">No notifications</p>
            ) : (
              recent.map(n => <NotificationCard key={n.id} notification={n} compact />)
            )}
          </div>
          <button
            onClick={() => { navigate('/notifications'); setOpen(false); }}
            className="w-full py-2.5 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 border-t border-slate-100 transition-colors"
          >
            View all notifications
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
