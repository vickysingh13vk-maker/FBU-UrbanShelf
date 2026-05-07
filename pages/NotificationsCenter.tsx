import React, { useState } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { Card } from '../components/ui';
import { useNotifications } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import NotificationCard from '../components/notifications/NotificationCard';
import { NotificationPriority, NotificationRole } from '../types';

type Filter = 'all' | NotificationPriority;

const NotificationsCenter: React.FC = () => {
  const { user } = useAuth();
  const { getForRole, getUnread, markAllRead, notifications } = useNotifications();
  const [filter, setFilter] = useState<Filter>('all');

  const role: NotificationRole = (user?.roleName as NotificationRole) ?? 'any';
  const repId = role === 'Sales Rep' ? user?.id : undefined;

  const all = getForRole(role, repId);
  const unread = getUnread(role, repId);

  const counts = {
    Critical: all.filter(n => n.priority === 'Critical').length,
    Warning: all.filter(n => n.priority === 'Warning').length,
    Info: all.filter(n => n.priority === 'Info').length,
  };

  const displayed = filter === 'all' ? all : all.filter(n => n.priority === filter);
  const sorted = [...displayed].sort((a, b) => {
    const rank = { Critical: 0, Warning: 1, Info: 2 };
    if (rank[a.priority] !== rank[b.priority]) return rank[a.priority] - rank[b.priority];
    return b.createdAt.localeCompare(a.createdAt);
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Notifications</h1>
          <p className="text-sm text-slate-500 mt-0.5">{all.length} total · {unread.length} unread</p>
        </div>
        {unread.length > 0 && (
          <button onClick={() => markAllRead(role, repId)}
            className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800">
            <CheckCheck className="h-4 w-4" /> Mark all read
          </button>
        )}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { key: 'Critical' as NotificationPriority, label: 'Critical', bg: 'bg-rose-50', text: 'text-rose-700' },
          { key: 'Warning'  as NotificationPriority, label: 'Warning',  bg: 'bg-amber-50', text: 'text-amber-700' },
          { key: 'Info'     as NotificationPriority, label: 'Info',     bg: 'bg-blue-50',  text: 'text-blue-700'  },
        ].map(s => (
          <Card key={s.key} padding="md" className="cursor-pointer hover:shadow-md transition-all"
            onClick={() => setFilter(s.key)}>
            <p className={`text-2xl font-black ${s.text}`}>{counts[s.key]}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex bg-slate-100 rounded-xl p-1 gap-1 w-fit">
        {([
          { key: 'all' as Filter, label: `All (${all.length})` },
          { key: 'Critical' as Filter, label: `Critical (${counts.Critical})` },
          { key: 'Warning'  as Filter, label: `Warning (${counts.Warning})` },
          { key: 'Info'     as Filter, label: `Info (${counts.Info})` },
        ]).map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${filter === f.key ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      {sorted.length === 0 ? (
        <Card padding="lg" className="text-center py-16">
          <Bell className="h-10 w-10 text-slate-200 mx-auto mb-3" />
          <p className="text-sm text-slate-400">No notifications</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {sorted.map(n => <NotificationCard key={n.id} notification={n} />)}
        </div>
      )}
    </div>
  );
};

export default NotificationsCenter;
