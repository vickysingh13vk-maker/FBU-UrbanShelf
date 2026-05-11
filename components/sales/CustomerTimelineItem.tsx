import React from 'react';
import { Phone, MapPin, RefreshCw, ShoppingCart, Wallet, MessageCircle, FileText, Video, Briefcase } from 'lucide-react';
import { CustomerTimeline, TimelineEventType } from '../../types';

const TYPE_CONFIG: Record<TimelineEventType, { icon: React.ReactNode; color: string; label: string }> = {
  Call:       { icon: <Phone className="h-3.5 w-3.5" />,        color: 'bg-blue-500',    label: 'Call' },
  Visit:      { icon: <MapPin className="h-3.5 w-3.5" />,       color: 'bg-indigo-500',  label: 'Visit' },
  'Follow-Up':{ icon: <RefreshCw className="h-3.5 w-3.5" />,    color: 'bg-amber-500',   label: 'Follow-Up' },
  Meeting:    { icon: <Video className="h-3.5 w-3.5" />,        color: 'bg-violet-500',  label: 'Meeting' },
  Order:      { icon: <ShoppingCart className="h-3.5 w-3.5" />, color: 'bg-emerald-500', label: 'Order' },
  Payment:    { icon: <Wallet className="h-3.5 w-3.5" />,       color: 'bg-green-600',   label: 'Payment' },
  WhatsApp:   { icon: <MessageCircle className="h-3.5 w-3.5" />,color: 'bg-teal-500',    label: 'WhatsApp' },
  Note:       { icon: <FileText className="h-3.5 w-3.5" />,     color: 'bg-slate-400',   label: 'Note' },
  Admin:      { icon: <Briefcase className="h-3.5 w-3.5" />,    color: 'bg-rose-500',    label: 'Admin' },
};

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

interface Props {
  item: CustomerTimeline;
  isLast?: boolean;
}

const CustomerTimelineItem: React.FC<Props> = ({ item, isLast = false }) => {
  const cfg = TYPE_CONFIG[item.type];
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className={`h-7 w-7 rounded-full ${cfg.color} flex items-center justify-center text-white flex-shrink-0`}>
          {cfg.icon}
        </div>
        {!isLast && <div className="w-px flex-1 bg-slate-100 mt-2" />}
      </div>
      <div className={`pb-4 flex-1 min-w-0 ${isLast ? '' : ''}`}>
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">{cfg.label}</span>
            {item.amount !== undefined && (
              <span className="text-xs font-bold text-emerald-600">£{item.amount.toLocaleString()}</span>
            )}
          </div>
          <span className="text-xs text-slate-400 flex-shrink-0">{formatRelative(item.timestamp)}</span>
        </div>
        <p className="text-sm text-slate-600">{item.notes}</p>
        {item.outcome && (
          <p className="text-xs text-slate-400 mt-0.5">Outcome: {item.outcome}</p>
        )}
        {item.nextAction && (
          <p className="text-xs text-indigo-500 mt-0.5">→ {item.nextAction}</p>
        )}
        <p className="text-xs text-slate-400 mt-1">by {item.repName}</p>
      </div>
    </div>
  );
};

export default CustomerTimelineItem;
