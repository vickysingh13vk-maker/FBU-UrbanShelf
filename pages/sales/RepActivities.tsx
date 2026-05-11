import React, { useState } from 'react';
import { Plus, Phone, MapPin, RefreshCw, ShoppingCart, Wallet, MessageCircle, FileText, Clock, ChevronDown } from 'lucide-react';
import { Card } from '../../components/ui';
import TimelineLogForm from '../../components/sales/TimelineLogForm';
import { useSalesCRM } from '../../context/SalesCRMContext';
import { useAuth } from '../../context/AuthContext';
import { TimelineEventType, CustomerTimeline } from '../../types';

const TYPE_CONFIG: Record<TimelineEventType, { icon: React.ReactNode; color: string; bg: string; label: string }> = {
  Call:        { icon: <Phone className="h-4 w-4" />,        color: 'text-blue-500',    bg: 'bg-blue-50',    label: 'Call' },
  Visit:       { icon: <MapPin className="h-4 w-4" />,       color: 'text-indigo-500',  bg: 'bg-indigo-50',  label: 'Visit' },
  'Follow-Up': { icon: <RefreshCw className="h-4 w-4" />,    color: 'text-amber-500',   bg: 'bg-amber-50',   label: 'Follow-Up' },
  Order:       { icon: <ShoppingCart className="h-4 w-4" />, color: 'text-blue-500',    bg: 'bg-blue-50',    label: 'Order' },
  Payment:     { icon: <Wallet className="h-4 w-4" />,       color: 'text-emerald-500', bg: 'bg-emerald-50', label: 'Payment' },
  WhatsApp:    { icon: <MessageCircle className="h-4 w-4" />,color: 'text-teal-500',    bg: 'bg-teal-50',    label: 'WhatsApp' },
  Note:        { icon: <FileText className="h-4 w-4" />,     color: 'text-slate-500',   bg: 'bg-slate-100',  label: 'Note' },
};

const FILTER_TYPES: (TimelineEventType | 'All')[] = ['All', 'Visit', 'Call', 'Order', 'Payment', 'Follow-Up', 'WhatsApp', 'Note'];

const RepActivities: React.FC = () => {
  const { user } = useAuth();
  const { getRepCustomers, getCustomerTimeline, addTimelineEntry } = useSalesCRM();
  const [typeFilter, setTypeFilter] = useState<TimelineEventType | 'All'>('All');
  const [showLogForm, setShowLogForm] = useState(false);
  const [logForCustomerId, setLogForCustomerId] = useState<string | null>(null);
  const [showCustomerSelect, setShowCustomerSelect] = useState(false);

  const repId = user?.id ?? '';
  const myCustomers = getRepCustomers(repId);

  // All timeline items across all assigned customers, today only
  const today = new Date().toISOString().split('T')[0];
  const allTimeline: (CustomerTimeline & { customerName: string })[] = myCustomers.flatMap(c =>
    getCustomerTimeline(c.id).map(t => ({ ...t, customerName: c.storeName }))
  );
  const todayTimeline = allTimeline
    .filter(t => t.timestamp.startsWith(today))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const filtered = typeFilter === 'All' ? todayTimeline : todayTimeline.filter(t => t.type === typeFilter);

  // Summary counts
  const counts = FILTER_TYPES.filter(f => f !== 'All').reduce((acc, t) => {
    acc[t as TimelineEventType] = todayTimeline.filter(a => a.type === t).length;
    return acc;
  }, {} as Record<TimelineEventType, number>);

  const handleLog = (type: TimelineEventType, notes: string, outcome: string, nextAction: string, amount?: number) => {
    const targetCustomerId = logForCustomerId ?? (myCustomers[0]?.id ?? '');
    addTimelineEntry({
      customerId: targetCustomerId,
      type,
      repId,
      repName: user?.name ?? '',
      timestamp: new Date().toISOString(),
      notes,
      outcome: outcome || undefined,
      nextAction: nextAction || undefined,
      amount,
    });
    setShowLogForm(false);
    setLogForCustomerId(null);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-800">Activities</h1>
          <p className="text-xs text-slate-500 mt-0.5">Today's field activity log</p>
        </div>
        <div className="relative">
          <button onClick={() => setShowCustomerSelect(!showCustomerSelect)}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-colors">
            <Plus className="h-4 w-4" /> Log Activity
            <ChevronDown className="h-3.5 w-3.5 opacity-70" />
          </button>
          {showCustomerSelect && (
            <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden">
              <p className="px-3 py-2 text-xs font-bold text-slate-400 border-b border-slate-100">Log for customer:</p>
              {myCustomers.map(c => (
                <button key={c.id}
                  onClick={() => { setLogForCustomerId(c.id); setShowCustomerSelect(false); setShowLogForm(true); }}
                  className="w-full px-3 py-2.5 text-left text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors">
                  {c.storeName}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Summary Strip */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {[
          { label: 'Visits',   value: counts['Visit'] ?? 0,     color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Calls',    value: counts['Call'] ?? 0,      color: 'text-blue-600',   bg: 'bg-blue-50' },
          { label: 'Orders',   value: counts['Order'] ?? 0,     color: 'text-blue-600',   bg: 'bg-blue-50' },
          { label: 'Payments', value: counts['Payment'] ?? 0,   color: 'text-emerald-600',bg: 'bg-emerald-50' },
          { label: 'F-Ups',    value: counts['Follow-Up'] ?? 0, color: 'text-amber-600',  bg: 'bg-amber-50' },
          { label: 'Notes',    value: counts['Note'] ?? 0,      color: 'text-slate-600',  bg: 'bg-slate-50' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} border border-slate-100 rounded-xl px-3 py-2.5 text-center`}>
            <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto">
        {FILTER_TYPES.map(f => (
          <button key={f} onClick={() => setTypeFilter(f)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              typeFilter === f ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}>
            {f} {f !== 'All' && counts[f as TimelineEventType] > 0 && `(${counts[f as TimelineEventType]})`}
          </button>
        ))}
      </div>

      {/* Activity Timeline */}
      <Card padding="md">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Clock className="h-10 w-10 text-slate-200 mx-auto mb-3" />
            <p className="text-sm text-slate-400">No activities logged today</p>
            <button onClick={() => setShowLogForm(true)} className="mt-3 text-indigo-500 text-sm font-semibold">Log your first activity →</button>
          </div>
        ) : (
          <div className="space-y-0">
            {filtered.map((activity, idx) => {
              const cfg = TYPE_CONFIG[activity.type];
              return (
                <div key={activity.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`h-9 w-9 ${cfg.bg} rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.color}`}>
                      {cfg.icon}
                    </div>
                    {idx < filtered.length - 1 && <div className="w-px flex-1 bg-slate-100 my-1" />}
                  </div>
                  <div className="pb-4 flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-0.5">
                      <div>
                        <span className="text-sm font-bold text-slate-700">{cfg.label}</span>
                        <span className="text-xs text-slate-400 ml-2">@ {activity.customerName}</span>
                        {activity.amount !== undefined && (
                          <span className="ml-2 text-xs font-bold text-emerald-600">£{activity.amount.toLocaleString()}</span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400 flex-shrink-0">
                        {new Date(activity.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">{activity.notes}</p>
                    {activity.outcome && <p className="text-xs text-slate-400 mt-0.5">↳ {activity.outcome}</p>}
                    {activity.nextAction && <p className="text-xs text-indigo-500 mt-0.5">→ {activity.nextAction}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {showLogForm && (
        <TimelineLogForm
          onSave={handleLog}
          onClose={() => { setShowLogForm(false); setLogForCustomerId(null); }}
          customerName={myCustomers.find(c => c.id === (logForCustomerId ?? myCustomers[0]?.id))?.storeName}
        />
      )}
    </div>
  );
};

export default RepActivities;
