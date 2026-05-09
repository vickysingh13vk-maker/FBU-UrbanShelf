import React from 'react';
import { UserCircle, Mail, Phone, MapPin, Shield, Clock, TrendingUp, Calendar } from 'lucide-react';
import { Card } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { useWorkSession } from '../../context/WorkSessionContext';
import { useSalesExecution } from '../../context/SalesExecutionContext';
import { useSalesCRM } from '../../context/SalesCRMContext';
import { WORK_SESSIONS } from '../../data';

const RepProfile: React.FC = () => {
  const { user } = useAuth();
  const { isOnline, elapsedSeconds, todayStats } = useWorkSession();
  const { getRepVisits } = useSalesExecution();
  const { getRepCustomers, getRepLeads } = useSalesCRM();

  const repId = user?.id ?? '';
  const allVisits = getRepVisits(repId);
  const completedVisits = allVisits.filter(v => v.status === 'completed');
  const myCustomers = getRepCustomers(repId);
  const myLeads = getRepLeads(repId);
  const activeLeads = myLeads.filter(l => l.stage !== 'Converted' && l.stage !== 'Lost');

  // Historical sessions
  const mySessions = WORK_SESSIONS.filter(s => s.repId === repId).slice(0, 5);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-slate-800">My Profile</h1>
        <p className="text-sm text-slate-500 mt-1">Your account details and performance summary</p>
      </div>

      {/* Profile Card */}
      <Card padding="md">
        <div className="flex items-start gap-4">
          <img
            src={user?.image ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name ?? 'Rep')}&background=6366f1&color=fff`}
            alt={user?.name}
            className="h-20 w-20 rounded-2xl object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-black text-slate-800">{user?.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold">
                <Shield className="h-3 w-3" />{user?.roleName}
              </span>
              <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${
                isOnline ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
              }`}>
                <span className={`h-2 w-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            <div className="flex flex-col gap-1.5 mt-3">
              {user?.email && (
                <a href={`mailto:${user.email}`} className="flex items-center gap-2 text-xs text-slate-500 hover:text-indigo-600 transition-colors">
                  <Mail className="h-3.5 w-3.5" />{user.email}
                </a>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Today Summary */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Today's Summary</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Time Online', value: isOnline ? formatTime(elapsedSeconds) : '—', color: 'text-indigo-600', bg: 'bg-indigo-50', icon: <Clock className="h-4 w-4" /> },
            { label: 'Visits', value: todayStats.visits, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: <MapPin className="h-4 w-4" /> },
            { label: 'Orders', value: todayStats.orders, color: 'text-blue-600', bg: 'bg-blue-50', icon: <TrendingUp className="h-4 w-4" /> },
            { label: 'Collected', value: `£${todayStats.collections.toFixed(0)}`, color: 'text-amber-600', bg: 'bg-amber-50', icon: <TrendingUp className="h-4 w-4" /> },
          ].map(kpi => (
            <Card key={kpi.label} padding="md" className="flex items-center gap-3">
              <div className={`h-9 w-9 ${kpi.bg} rounded-xl flex items-center justify-center flex-shrink-0 ${kpi.color}`}>
                {kpi.icon}
              </div>
              <div>
                <p className={`text-xl font-black ${kpi.color}`}>{kpi.value}</p>
                <p className="text-xs text-slate-400">{kpi.label}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* All-time Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card padding="md" className="text-center">
          <p className="text-3xl font-black text-slate-800">{myCustomers.length}</p>
          <p className="text-xs text-slate-400 mt-1 flex items-center justify-center gap-1">
            <UserCircle className="h-3.5 w-3.5" /> My Customers
          </p>
        </Card>
        <Card padding="md" className="text-center">
          <p className="text-3xl font-black text-slate-800">{completedVisits.length}</p>
          <p className="text-xs text-slate-400 mt-1 flex items-center justify-center gap-1">
            <MapPin className="h-3.5 w-3.5" /> Total Visits
          </p>
        </Card>
        <Card padding="md" className="text-center">
          <p className="text-3xl font-black text-slate-800">{activeLeads.length}</p>
          <p className="text-xs text-slate-400 mt-1 flex items-center justify-center gap-1">
            <TrendingUp className="h-3.5 w-3.5" /> Active Leads
          </p>
        </Card>
      </div>

      {/* Session History */}
      {mySessions.length > 0 && (
        <Card padding="md">
          <h3 className="text-sm font-bold text-slate-700 mb-4">Recent Work Sessions</h3>
          <div className="space-y-2">
            {mySessions.map(s => (
              <div key={s.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-700">{new Date(s.startTime).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</p>
                    <p className="text-xs text-slate-400">
                      {new Date(s.startTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                      {s.endTime && ` – ${new Date(s.endTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-700">{s.totalVisits ?? 0} visits</p>
                  <p className="text-xs text-slate-400">{s.totalOrders ?? 0} orders</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Account Info */}
      <Card padding="md">
        <h3 className="text-sm font-bold text-slate-700 mb-3">Account Info</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-xs text-slate-400">User ID</span>
            <span className="text-xs font-mono text-slate-500">{user?.id}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-xs text-slate-400">Role</span>
            <span className="text-xs font-semibold text-slate-700">{user?.roleName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-xs text-slate-400">Account Status</span>
            <span className="text-xs font-semibold text-emerald-600">Active</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RepProfile;
