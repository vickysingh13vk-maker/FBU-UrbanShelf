import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, Phone, MapPin, RefreshCw, ShoppingCart, Wallet, MessageCircle, FileText, Clock, Video, Briefcase } from 'lucide-react';
import { Card } from '../../components/ui';
import TimelineLogForm from '../../components/sales/TimelineLogForm';
import VisitWorkflowModal from '../../components/sales/VisitWorkflowModal';
import { useSalesCRM } from '../../context/SalesCRMContext';
import { useAuth } from '../../context/AuthContext';
import { TimelineEventType, CustomerTimeline } from '../../types';

const TYPE_CONFIG: Record<TimelineEventType, { icon: React.ElementType; color: string; bg: string; label: string; dot: string; activeBg: string; activeText: string }> = {
  Call:        { icon: Phone,        color: 'text-blue-500',    bg: 'bg-blue-50',    label: 'Call',      dot: 'bg-blue-500',    activeBg: 'bg-blue-600',    activeText: 'text-white' },
  Visit:       { icon: MapPin,       color: 'text-indigo-500',  bg: 'bg-indigo-50',  label: 'Visit',     dot: 'bg-indigo-500',  activeBg: 'bg-indigo-600',  activeText: 'text-white' },
  'Follow-Up': { icon: RefreshCw,    color: 'text-amber-500',   bg: 'bg-amber-50',   label: 'Follow-Up', dot: 'bg-amber-500',   activeBg: 'bg-amber-500',   activeText: 'text-white' },
  Meeting:     { icon: Video,        color: 'text-violet-500',  bg: 'bg-violet-50',  label: 'Meeting',   dot: 'bg-violet-500',  activeBg: 'bg-violet-600',  activeText: 'text-white' },
  Order:       { icon: ShoppingCart, color: 'text-emerald-500', bg: 'bg-emerald-50', label: 'Order',     dot: 'bg-emerald-500', activeBg: 'bg-emerald-600', activeText: 'text-white' },
  Payment:     { icon: Wallet,       color: 'text-green-600',   bg: 'bg-green-50',   label: 'Payment',   dot: 'bg-green-600',   activeBg: 'bg-green-600',   activeText: 'text-white' },
  WhatsApp:    { icon: MessageCircle,color: 'text-teal-500',    bg: 'bg-teal-50',    label: 'WhatsApp',  dot: 'bg-teal-500',    activeBg: 'bg-teal-600',    activeText: 'text-white' },
  Note:        { icon: FileText,     color: 'text-slate-500',   bg: 'bg-slate-100',  label: 'Note',      dot: 'bg-slate-400',   activeBg: 'bg-slate-600',   activeText: 'text-white' },
  Admin:       { icon: Briefcase,    color: 'text-rose-500',    bg: 'bg-rose-50',    label: 'Admin',     dot: 'bg-rose-500',    activeBg: 'bg-rose-600',    activeText: 'text-white' },
};

const FILTER_TYPES: (TimelineEventType | 'All')[] = ['All', 'Visit', 'Call', 'Meeting', 'Order', 'Payment', 'Follow-Up', 'WhatsApp', 'Note', 'Admin'];

const RepActivities: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { getRepCustomers, getCustomerTimeline, addTimelineEntry } = useSalesCRM();
  const [typeFilter, setTypeFilter] = useState<TimelineEventType | 'All'>('All');
  const [showLogForm, setShowLogForm] = useState(false);
  const [visitModal, setVisitModal] = useState<{ customerId: string; customerName: string } | null>(null);

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

  const handleLog = (customerId: string, type: TimelineEventType, notes: string, outcome: string, nextAction: string, amount?: number) => {
    addTimelineEntry({
      customerId,
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
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-800">Activities</h1>
          <p className="text-xs text-slate-500 mt-0.5">Today's field activity log</p>
        </div>
        <button onClick={() => setShowLogForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-colors">
          <Plus className="h-4 w-4" /> Log Activity
        </button>
      </div>

      {/* Summary Strip */}
      <div className="grid grid-cols-3 sm:grid-cols-8 gap-2">
        {[
          { label: 'Visits',    value: counts['Visit'] ?? 0,     color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Calls',     value: counts['Call'] ?? 0,      color: 'text-blue-600',   bg: 'bg-blue-50' },
          { label: 'Meetings',  value: counts['Meeting'] ?? 0,   color: 'text-violet-600', bg: 'bg-violet-50' },
          { label: 'Orders',    value: counts['Order'] ?? 0,     color: 'text-emerald-600',bg: 'bg-emerald-50' },
          { label: 'Payments',  value: counts['Payment'] ?? 0,   color: 'text-green-600',  bg: 'bg-green-50' },
          { label: 'F-Ups',     value: counts['Follow-Up'] ?? 0, color: 'text-amber-600',  bg: 'bg-amber-50' },
          { label: 'Notes',     value: counts['Note'] ?? 0,      color: 'text-slate-600',  bg: 'bg-slate-50' },
          { label: 'Admin',     value: counts['Admin'] ?? 0,     color: 'text-rose-600',   bg: 'bg-rose-50' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} border border-slate-100 rounded-xl px-3 py-2.5 text-center`}>
            <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="bg-slate-100 rounded-2xl p-1 flex gap-0.5 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* All tab */}
        <button onClick={() => setTypeFilter('All')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 ${
            typeFilter === 'All'
              ? 'bg-white text-slate-800 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}>
          All
          {todayTimeline.length > 0 && (
            <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full leading-none ${
              typeFilter === 'All' ? 'bg-slate-100 text-slate-600' : 'bg-slate-200 text-slate-500'
            }`}>{todayTimeline.length}</span>
          )}
        </button>

        {FILTER_TYPES.filter(f => f !== 'All').map(f => {
          const cfg = TYPE_CONFIG[f as TimelineEventType];
          const count = counts[f as TimelineEventType] ?? 0;
          const active = typeFilter === f;
          const Icon = cfg.icon;
          return (
            <button key={f} onClick={() => setTypeFilter(f)}
              className={`flex items-center gap-1.5 pl-2 pr-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 ${
                active
                  ? `bg-white shadow-sm ${cfg.color}`
                  : 'text-slate-500 hover:text-slate-700'
              }`}>
              <div className={`h-5 w-5 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                active ? cfg.bg : 'bg-transparent'
              }`}>
                <Icon className={`h-3 w-3 ${active ? cfg.color : 'text-slate-400'}`} />
              </div>
              {cfg.label}
              {count > 0 && (
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full leading-none ${
                  active ? `${cfg.bg} ${cfg.color}` : 'bg-slate-200 text-slate-500'
                }`}>{count}</span>
              )}
            </button>
          );
        })}
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
              const Icon = cfg.icon;
              return (
                <div key={activity.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`h-9 w-9 ${cfg.bg} rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.color}`}>
                      <Icon className="h-4 w-4" />
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
          onClose={() => setShowLogForm(false)}
          customers={myCustomers.map(c => ({ id: c.id, storeName: c.storeName, contactName: c.name }))}
          onLaunchVisit={(customerId, customerName) => {
            setShowLogForm(false);
            if (customerId && customerName) {
              setVisitModal({ customerId, customerName });
            }
          }}
          onLaunchOrder={(customerId, customerName) => {
            setShowLogForm(false);
            navigate('/sales/orders/new', {
              state: { customerId, customerName, repId, returnPath: location.pathname },
            });
          }}
        />
      )}

      {visitModal && (
        <VisitWorkflowModal
          customerId={visitModal.customerId}
          customerName={visitModal.customerName}
          onComplete={() => setVisitModal(null)}
          onClose={() => setVisitModal(null)}
        />
      )}
    </div>
  );
};

export default RepActivities;
