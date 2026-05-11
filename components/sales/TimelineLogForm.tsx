import React, { useState } from 'react';
import { X, Phone, MapPin, RefreshCw, ShoppingCart, Wallet, MessageCircle, FileText, Video, Briefcase } from 'lucide-react';
import { TimelineEventType } from '../../types';

const TYPE_GROUPS: { label: string; types: { type: TimelineEventType; icon: React.ElementType; hint: string }[] }[] = [
  {
    label: 'Field',
    types: [
      { type: 'Call',      icon: Phone,          hint: 'Phone call with customer' },
      { type: 'Visit',     icon: MapPin,          hint: 'In-person customer visit' },
      { type: 'Note',      icon: FileText,        hint: 'General note or update' },
    ],
  },
  {
    label: 'Remote',
    types: [
      { type: 'Meeting',   icon: Video,           hint: 'Online or telephone meeting' },
      { type: 'Follow-Up', icon: RefreshCw,       hint: 'Follow-up comms, records updated' },
      { type: 'WhatsApp',  icon: MessageCircle,   hint: 'WhatsApp message' },
    ],
  },
  {
    label: 'Commercial',
    types: [
      { type: 'Order',     icon: ShoppingCart,    hint: 'Order placed and logged' },
      { type: 'Payment',   icon: Wallet,          hint: 'Payment or collection logged' },
    ],
  },
  {
    label: 'Admin',
    types: [
      { type: 'Admin',     icon: Briefcase,       hint: 'Journey planning, reporting, customer update, etc.' },
    ],
  },
];

const ALL_TYPE_META = TYPE_GROUPS.flatMap(g => g.types);

const NOTES_PLACEHOLDER: Record<TimelineEventType, string> = {
  Call:        'What was discussed on the call?',
  Visit:       'How did the visit go? Key points discussed?',
  'Follow-Up': 'What was the follow-up about?',
  Meeting:     'Meeting summary — who attended, what was agreed?',
  Order:       'Order details (products, quantities, delivery notes)...',
  Payment:     'Payment details (method, reference, amount received)...',
  WhatsApp:    'Message summary...',
  Note:        'What happened?',
  Admin:       'What admin task was completed? (journey plan, new customer, report...)',
};

const TYPE_COLORS: Record<TimelineEventType, string> = {
  Call:        'bg-blue-600',
  Visit:       'bg-indigo-600',
  'Follow-Up': 'bg-amber-500',
  Meeting:     'bg-violet-600',
  Order:       'bg-emerald-600',
  Payment:     'bg-green-600',
  WhatsApp:    'bg-teal-500',
  Note:        'bg-slate-500',
  Admin:       'bg-rose-500',
};

interface Props {
  onSave: (type: TimelineEventType, notes: string, outcome: string, nextAction: string, amount?: number) => void;
  onClose: () => void;
  defaultType?: TimelineEventType;
  customerName?: string;
}

const TimelineLogForm: React.FC<Props> = ({ onSave, onClose, defaultType = 'Note', customerName }) => {
  const [type, setType] = useState<TimelineEventType>(defaultType);
  const [notes, setNotes] = useState('');
  const [outcome, setOutcome] = useState('');
  const [nextAction, setNextAction] = useState('');
  const [amount, setAmount] = useState('');

  const selectedMeta = ALL_TYPE_META.find(t => t.type === type);
  const showAmount = type === 'Payment' || type === 'Order';
  const showOutcome = type !== 'Admin' && type !== 'Note';
  const showNextAction = type !== 'Admin';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) return;
    onSave(type, notes.trim(), outcome.trim(), nextAction.trim(), amount ? parseFloat(amount) : undefined);
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 sticky top-0 bg-white z-10">
          <div>
            <h3 className="text-base font-bold text-slate-800">Log Activity</h3>
            {customerName
              ? <p className="text-xs text-indigo-500 font-semibold mt-0.5">@ {customerName}</p>
              : <p className="text-xs text-slate-400 mt-0.5">Select customer below</p>
            }
          </div>
          <button onClick={onClose} className="h-7 w-7 rounded-lg hover:bg-slate-100 flex items-center justify-center">
            <X className="h-4 w-4 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">

          {/* Type — grouped */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 block">Activity Type</label>
            <div className="space-y-3">
              {TYPE_GROUPS.map(group => (
                <div key={group.label}>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{group.label}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {group.types.map(({ type: t, icon: Icon }) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setType(t)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                          type === t
                            ? `${TYPE_COLORS[t]} text-white`
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        <Icon className="h-3 w-3" />
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {selectedMeta && (
              <p className="text-xs text-slate-400 mt-2 italic">{selectedMeta.hint}</p>
            )}
          </div>

          {/* Amount — for Order/Payment */}
          {showAmount && (
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Amount (£)</label>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Notes *</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              placeholder={NOTES_PLACEHOLDER[type]}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300"
              required
            />
          </div>

          {/* Outcome */}
          {showOutcome && (
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Outcome</label>
              <input
                value={outcome}
                onChange={e => setOutcome(e.target.value)}
                placeholder="What was the result?"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
          )}

          {/* Next Action */}
          {showNextAction && (
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Next Action</label>
              <input
                value={nextAction}
                onChange={e => setNextAction(e.target.value)}
                placeholder="What should happen next?"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button type="submit"
              className={`flex-1 px-4 py-2.5 ${TYPE_COLORS[type]} hover:opacity-90 text-white rounded-xl text-sm font-bold transition-colors`}>
              Save Activity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TimelineLogForm;
