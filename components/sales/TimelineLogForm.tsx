import React, { useState, useRef, useEffect } from 'react';
import {
  X, Phone, MapPin, RefreshCw, ShoppingCart, Wallet,
  MessageCircle, FileText, Video, Briefcase, ArrowLeft,
  ChevronRight, Users,
} from 'lucide-react';
import { TimelineEventType } from '../../types';

/* ─── Type metadata ──────────────────────────────────────────────────── */
interface TypeMeta {
  icon: React.ElementType;
  tagline: string;
  hint: string;
  launcher: boolean;   // Visit / Order → dedicated flow, not inline form
  color: string;
  bg: string;
  hoverBorder: string;
  activeBorder: string;
}

const TYPE_META: Record<TimelineEventType, TypeMeta> = {
  Call:        { icon: Phone,        tagline: 'Log a phone call',           hint: 'What was discussed?',                               launcher: false, color: 'text-blue-600',    bg: 'bg-blue-100',    hoverBorder: 'hover:border-blue-300',    activeBorder: 'border-blue-300' },
  Visit:       { icon: MapPin,        tagline: 'Start full visit workflow',  hint: 'In-person customer visit',                          launcher: true,  color: 'text-indigo-600',  bg: 'bg-indigo-600',  hoverBorder: 'hover:border-indigo-300',  activeBorder: 'border-indigo-300' },
  Note:        { icon: FileText,      tagline: 'Quick note or update',       hint: 'What happened?',                                    launcher: false, color: 'text-slate-600',   bg: 'bg-slate-100',   hoverBorder: 'hover:border-slate-300',   activeBorder: 'border-slate-300' },
  Meeting:     { icon: Video,         tagline: 'Log a meeting',              hint: 'Who attended, what was agreed?',                    launcher: false, color: 'text-violet-600',  bg: 'bg-violet-100',  hoverBorder: 'hover:border-violet-300',  activeBorder: 'border-violet-300' },
  'Follow-Up': { icon: RefreshCw,     tagline: 'Set a follow-up reminder',   hint: 'What was the follow-up about?',                    launcher: false, color: 'text-amber-600',   bg: 'bg-amber-100',   hoverBorder: 'hover:border-amber-300',   activeBorder: 'border-amber-300' },
  WhatsApp:    { icon: MessageCircle, tagline: 'Log a WhatsApp message',     hint: 'Message summary...',                               launcher: false, color: 'text-emerald-600', bg: 'bg-emerald-100', hoverBorder: 'hover:border-emerald-300', activeBorder: 'border-emerald-300' },
  Order:       { icon: ShoppingCart,  tagline: 'Create a new order',         hint: 'Order placed and logged',                          launcher: true,  color: 'text-teal-600',    bg: 'bg-teal-600',    hoverBorder: 'hover:border-teal-300',    activeBorder: 'border-teal-300' },
  Payment:     { icon: Wallet,        tagline: 'Record a payment',           hint: 'Payment details (method, reference, amount)...',   launcher: false, color: 'text-rose-600',    bg: 'bg-rose-100',    hoverBorder: 'hover:border-rose-300',    activeBorder: 'border-rose-300' },
  Admin:       { icon: Briefcase,     tagline: 'Admin task or journey plan', hint: 'What admin task was completed?',                   launcher: false, color: 'text-slate-700',   bg: 'bg-slate-100',   hoverBorder: 'hover:border-slate-300',   activeBorder: 'border-slate-300' },
};

const NOTES_PLACEHOLDER: Record<TimelineEventType, string> = {
  Call:        'What was discussed on the call?',
  Visit:       'How did the visit go?',
  'Follow-Up': 'What was the follow-up about?',
  Meeting:     'Meeting summary — who attended, what was agreed?',
  Order:       'Order details (products, quantities, delivery notes)...',
  Payment:     'Payment details (method, reference, amount received)...',
  WhatsApp:    'Message summary...',
  Note:        'What happened?',
  Admin:       'What admin task was completed?',
};

const TYPE_GROUPS: { label: string; types: TimelineEventType[] }[] = [
  { label: 'Field',      types: ['Visit', 'Call', 'Note'] },
  { label: 'Remote',     types: ['Meeting', 'Follow-Up', 'WhatsApp'] },
  { label: 'Commercial', types: ['Order', 'Payment'] },
  { label: 'Admin',      types: ['Admin'] },
];

/* ─── Props ──────────────────────────────────────────────────────────── */
interface Customer { id: string; storeName: string; contactName?: string; }

interface Props {
  /** Called for simple activity types after user fills the form */
  onSave: (customerId: string, type: TimelineEventType, notes: string, outcome: string, nextAction: string, amount?: number) => void;
  onClose: () => void;
  /** Pre-selected customer (e.g. opened from a customer page) */
  customerId?: string;
  customerName?: string;
  /** Full customer list for inline search when no customer is pre-selected */
  customers?: Customer[];
  /** Visit launcher — passes selected customer if any, else opens visit picker */
  onLaunchVisit?: (customerId?: string, customerName?: string) => void;
  /** Order launcher */
  onLaunchOrder?: (customerId?: string, customerName?: string) => void;
}

/* ─── Component ──────────────────────────────────────────────────────── */
const TimelineLogForm: React.FC<Props> = ({
  onSave, onClose,
  customerId: preCustomerId, customerName: preCustomerName,
  customers = [],
  onLaunchVisit, onLaunchOrder,
}) => {
  /* Phase */
  const [phase, setPhase]         = useState<'select' | 'log'>('select');
  const [activeType, setActiveType] = useState<TimelineEventType | null>(null);

  /* Customer selection (phase 1) */
  const [selCustomerId,   setSelCustomerId]   = useState(preCustomerId   ?? '');
  const [selCustomerName, setSelCustomerName] = useState(preCustomerName ?? '');
  const [custSearch,      setCustSearch]      = useState('');
  const [showCustList,    setShowCustList]    = useState(false);
  const [custError,       setCustError]       = useState(false);
  const custRef = useRef<HTMLDivElement>(null);

  /* Log form fields */
  const [notes,      setNotes]      = useState('');
  const [outcome,    setOutcome]    = useState('');
  const [nextAction, setNextAction] = useState('');
  const [amount,     setAmount]     = useState('');
  const [duration,   setDuration]   = useState('');

  const hasCustomer = !!selCustomerId;

  /* Close customer dropdown when clicking outside */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (custRef.current && !custRef.current.contains(e.target as Node)) {
        setShowCustList(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filteredCusts = customers.filter(c =>
    !custSearch || c.storeName.toLowerCase().includes(custSearch.toLowerCase())
  );

  const selectCustomer = (c: Customer) => {
    setSelCustomerId(c.id);
    setSelCustomerName(c.storeName);
    setCustSearch('');
    setShowCustList(false);
    setCustError(false);
  };

  const clearCustomer = () => {
    setSelCustomerId('');
    setSelCustomerName('');
  };

  /* Type selection — customer required for ALL types */
  const handleTypeSelect = (t: TimelineEventType) => {
    if (!hasCustomer) {
      setCustError(true);
      setShowCustList(true);
      return;
    }
    if (t === 'Visit') {
      onLaunchVisit?.(selCustomerId, selCustomerName);
      onClose();
      return;
    }
    if (t === 'Order') {
      onLaunchOrder?.(selCustomerId, selCustomerName);
      onClose();
      return;
    }
    setActiveType(t);
    setPhase('log');
  };

  const handleBack = () => {
    setPhase('select');
    setActiveType(null);
    setNotes(''); setOutcome(''); setNextAction(''); setAmount(''); setDuration('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeType || !notes.trim() || !selCustomerId) return;
    onSave(selCustomerId, activeType, notes.trim(), outcome.trim(), nextAction.trim(), amount ? parseFloat(amount) : undefined);
  };

  const meta        = activeType ? TYPE_META[activeType] : null;
  const showAmount   = activeType === 'Payment';
  const showOutcome  = activeType !== null && activeType !== 'Admin' && activeType !== 'Note';
  const showNext     = activeType !== 'Admin';

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex flex-col justify-end sm:items-center sm:justify-center sm:p-6">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg lg:max-w-2xl max-h-[92vh] overflow-y-auto">

        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden flex-shrink-0">
          <div className="h-1 w-12 bg-slate-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            {phase === 'log' && (
              <button onClick={handleBack}
                className="h-8 w-8 rounded-xl hover:bg-slate-100 flex items-center justify-center transition-colors flex-shrink-0">
                <ArrowLeft className="h-4 w-4 text-slate-500" />
              </button>
            )}
            <div>
              <h3 className="text-base font-black text-slate-800">Log Activity</h3>
              {selCustomerName
                ? <p className="text-xs text-indigo-500 font-bold mt-0.5">@ {selCustomerName}</p>
                : <p className="text-xs text-slate-400 mt-0.5">Pick customer &amp; activity below</p>
              }
            </div>
          </div>
          <button onClick={onClose}
            className="h-8 w-8 rounded-xl hover:bg-slate-100 flex items-center justify-center transition-colors">
            <X className="h-4 w-4 text-slate-500" />
          </button>
        </div>

        {/* ══ PHASE 1: Launcher ══ */}
        {phase === 'select' && (
          <div className="p-5 space-y-5">

            {/* Customer selector */}
            {!preCustomerId && (
              <div ref={custRef}>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  Customer
                  {custError && <span className="text-rose-500 normal-case font-normal text-[10px]">— required for this activity</span>}
                </label>

                {hasCustomer ? (
                  <div className="flex items-center gap-3 px-3.5 py-2.5 bg-indigo-50 border-2 border-indigo-200 rounded-2xl">
                    <div className="h-8 w-8 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-indigo-600">{selCustomerName[0]}</span>
                    </div>
                    <p className="text-sm font-bold text-slate-800 flex-1">{selCustomerName}</p>
                    <button onClick={clearCustomer}
                      className="h-6 w-6 rounded-lg hover:bg-indigo-200 flex items-center justify-center transition-colors">
                      <X className="h-3.5 w-3.5 text-indigo-400" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className={`flex items-center gap-0 border-2 rounded-2xl overflow-hidden transition-colors focus-within:ring-2 focus-within:ring-indigo-300 ${
                      custError ? 'border-rose-300 bg-rose-50' : 'border-slate-200 bg-white'
                    }`}>
                      <div className={`flex items-center justify-center h-10 w-10 flex-shrink-0 ${custError ? 'bg-rose-100' : 'bg-indigo-50'}`}>
                        <Users className={`h-4 w-4 ${custError ? 'text-rose-400' : 'text-indigo-400'}`} />
                      </div>
                      <div className={`w-px h-5 flex-shrink-0 ${custError ? 'bg-rose-200' : 'bg-slate-200'}`} />
                      <input
                        value={custSearch}
                        onChange={e => { setCustSearch(e.target.value); setCustError(false); setShowCustList(true); }}
                        onFocus={() => setShowCustList(true)}
                        placeholder="Search customers..."
                        className={`flex-1 pl-3 pr-3 py-2.5 text-sm focus:outline-none bg-transparent ${
                          custError ? 'placeholder-rose-300' : ''
                        }`}
                      />
                    </div>
                    {showCustList && (filteredCusts.length > 0) && (
                      <div className="mt-1 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-md">
                        {filteredCusts.map(c => (
                          <button key={c.id} onClick={() => selectCustomer(c)}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 text-left border-b border-slate-100 last:border-0 transition-colors group">
                            <div className="h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-indigo-100 group-hover:bg-indigo-200 transition-colors">
                              <span className="text-sm font-black text-indigo-600">{c.storeName[0]}</span>
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-slate-800 truncate">{c.storeName}</p>
                              {c.contactName && <p className="text-xs text-slate-400 truncate">{c.contactName}</p>}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Activity type grid */}
            <div className={`space-y-3 transition-opacity duration-200 ${!hasCustomer ? 'opacity-40 pointer-events-none select-none' : ''}`}>
              {TYPE_GROUPS.map(group => (
                <div key={group.label}>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{group.label}</p>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                    {group.types.map(t => {
                      const m = TYPE_META[t];
                      const Icon = m.icon;
                      return (
                        <button key={t} onClick={() => handleTypeSelect(t)}
                          className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 border-slate-100 bg-white text-left transition-all ${m.hoverBorder} hover:shadow-sm`}>
                          <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${m.bg}`}>
                            <Icon className={`h-5 w-5 ${m.launcher ? 'text-white' : m.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1">
                              <p className="text-sm font-bold text-slate-800 leading-tight">{t}</p>
                              {m.launcher && <ChevronRight className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />}
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">{m.tagline}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Pick customer hint — shown below grid when no customer */}
            {!hasCustomer && (
              <p className="text-center text-xs text-slate-400 -mt-1">
                Select a customer above to unlock activities
              </p>
            )}

          </div>
        )}

        {/* ══ PHASE 2: Log form ══ */}
        {phase === 'log' && activeType && meta && (
          <form onSubmit={handleSubmit} className="p-5 space-y-5">

            {/* Type badge */}
            <div className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 ${meta.activeBorder} bg-slate-50`}>
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${meta.bg}`}>
                <meta.icon className={`h-5 w-5 ${meta.color}`} />
              </div>
              <div>
                <p className="text-sm font-black text-slate-800">{activeType}</p>
                <p className="text-xs text-slate-400 italic mt-0.5">{meta.hint}</p>
              </div>
            </div>

            {/* Duration — Call only */}
            {activeType === 'Call' && (
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Duration (mins)</label>
                <div className="relative">
                  <input type="number" value={duration} onChange={e => setDuration(e.target.value)}
                    placeholder="e.g. 15" min="1" step="1"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none">min</span>
                </div>
              </div>
            )}

            {/* Amount — Payment only */}
            {showAmount && (
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Amount (£)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">£</span>
                  <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                    placeholder="0.00" min="0" step="0.01"
                    className="w-full pl-8 pr-3 py-2.5 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                </div>
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">
                Notes <span className="normal-case font-normal text-slate-400">*</span>
              </label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
                placeholder={NOTES_PLACEHOLDER[activeType]}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-2xl text-sm text-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300"
                required autoFocus />
            </div>

            {/* Outcome + Next Action */}
            {(showOutcome || showNext) && (
              <div className={`grid grid-cols-1 ${showOutcome && showNext ? 'lg:grid-cols-2' : ''} gap-4`}>
                {showOutcome && (
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Outcome</label>
                    <input value={outcome} onChange={e => setOutcome(e.target.value)}
                      placeholder="What was the result?"
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                  </div>
                )}

                {showNext && (
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Next Action</label>
                    <input value={nextAction} onChange={e => setNextAction(e.target.value)}
                      placeholder="What should happen next?"
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-2.5 pt-1">
              <button type="button" onClick={handleBack}
                className="flex-1 px-4 py-3 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                Back
              </button>
              <button type="submit"
                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-sm font-black transition-colors shadow-md shadow-blue-200">
                Save Activity
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

export default TimelineLogForm;
