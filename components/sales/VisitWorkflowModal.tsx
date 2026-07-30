import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  X, MapPin, CheckSquare, Square, Clock, ChevronRight,
  ShoppingCart, Package, WifiOff, CheckCircle2,
  CreditCard, Link2, Calendar, Plus,
  Phone, RefreshCw, Handshake, FlaskConical, Wallet,
  ImagePlus, Video, Trash2,
} from 'lucide-react';
import { VisitObjective, VisitObjectiveType, VisitOutcome, FollowUpType, FollowUpPriority, PaymentStatus, PaymentMethod } from '../../types';
import { useSalesExecution } from '../../context/SalesExecutionContext';
import { useAuth } from '../../context/AuthContext';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { useWorkSession } from '../../context/WorkSessionContext';

const OBJECTIVE_TYPES: VisitObjectiveType[] = ['Order', 'Collection', 'Product Demo', 'Relationship', 'Sampling', 'Merchandising'];
const FOLLOW_UP_TYPES: FollowUpType[] = ['Callback', 'Payment Reminder', 'Revisit', 'Product Demo', 'Negotiation', 'Trial Follow-Up', 'Collection Follow-Up'];

const FU_TYPE_META: Record<FollowUpType, { icon: React.ElementType; color: string; activeBg: string; activeBorder: string }> = {
  'Callback':             { icon: Phone,         color: 'text-blue-600',   activeBg: 'bg-blue-600',   activeBorder: 'border-blue-600' },
  'Payment Reminder':     { icon: CreditCard,    color: 'text-rose-600',   activeBg: 'bg-rose-600',   activeBorder: 'border-rose-600' },
  'Revisit':              { icon: MapPin,         color: 'text-indigo-600', activeBg: 'bg-indigo-600', activeBorder: 'border-indigo-600' },
  'Product Demo':         { icon: FlaskConical,  color: 'text-violet-600', activeBg: 'bg-violet-600', activeBorder: 'border-violet-600' },
  'Negotiation':          { icon: Handshake,     color: 'text-amber-600',  activeBg: 'bg-amber-600',  activeBorder: 'border-amber-600' },
  'Trial Follow-Up':      { icon: RefreshCw,     color: 'text-teal-600',   activeBg: 'bg-teal-600',   activeBorder: 'border-teal-600' },
  'Collection Follow-Up': { icon: Wallet,        color: 'text-orange-600', activeBg: 'bg-orange-600', activeBorder: 'border-orange-600' },
};

type Step = 'confirm' | 'objectives' | 'end' | 'summary';
const STEPS: Step[] = ['confirm', 'objectives', 'end', 'summary'];
const STEP_LABELS = ['Confirm', 'In Progress', 'Wrap Up', 'Done'];

interface Props {
  customerId: string;
  customerName: string;
  onComplete: (visitId: string) => void;
  onClose: () => void;
  initialStep?: Step;
  initialVisitId?: string;
  initialLinkedOrderId?: string;
  initialLinkedOrderTotal?: number;
}

const VisitWorkflowModal: React.FC<Props> = ({
  customerId, customerName, onComplete, onClose,
  initialStep, initialVisitId, initialLinkedOrderId, initialLinkedOrderTotal,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isOnline = useOnlineStatus();
  const { isOnline: isSessionActive, recordVisit } = useWorkSession();
  const canAct = isOnline && isSessionActive;
  const { startVisit, updateVisitObjective, endVisit, getActiveVisit, addFollowUp } = useSalesExecution();

  const [step, setStep] = useState<Step>(initialStep ?? 'confirm');
  const [visitId, setVisitId] = useState<string | null>(initialVisitId ?? null);
  const [startTime] = useState(new Date());
  const [elapsed, setElapsed] = useState(0);
  const [linkedOrderId, setLinkedOrderId] = useState<string | null>(initialLinkedOrderId ?? null);
  const [linkedOrderTotal, setLinkedOrderTotal] = useState<number | null>(initialLinkedOrderTotal ?? null);

  // Confirm step
  const [selectedObjectives, setSelectedObjectives] = useState<VisitObjectiveType[]>([]);

  // End-visit form state
  const [collectionAmount, setCollectionAmount] = useState('');
  const [outcomeNotes, setOutcomeNotes] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);

  // Media attachments
  const [mediaFiles, setMediaFiles] = useState<{ file: File; url: string; type: 'image' | 'video' }[]>([]);

  const handleMediaAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const items = files
      .filter(f => f.type.startsWith('image/') || f.type.startsWith('video/'))
      .map(f => ({ file: f, url: URL.createObjectURL(f), type: (f.type.startsWith('video/') ? 'video' : 'image') as 'image' | 'video' }));
    setMediaFiles(prev => [...prev, ...items]);
    e.target.value = '';
  };

  const removeMedia = (idx: number) => {
    setMediaFiles(prev => { URL.revokeObjectURL(prev[idx].url); return prev.filter((_, i) => i !== idx); });
  };

  // Follow-up state
  const [createFollowUp, setCreateFollowUp] = useState(false);
  const [fuType, setFuType] = useState<FollowUpType>('Revisit');
  const [fuPriority, setFuPriority] = useState<FollowUpPriority>('Medium');
  const [fuDate, setFuDate] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() + 7); return d.toISOString().split('T')[0];
  });
  const [fuNotes, setFuNotes] = useState('');

  // Snapshot objectives before endVisit() makes activeVisitData null
  const [snapshotObjectives, setSnapshotObjectives] = useState<VisitObjective[]>([]);

  const stepIndex = STEPS.indexOf(step);
  const activeVisitData = visitId ? (getActiveVisit(user?.id ?? '') ?? null) : null;
  const liveObjectives = activeVisitData?.objectives ?? [];
  const displayObjectives = step === 'summary' ? snapshotObjectives : liveObjectives;

  const hasCollectionObj = displayObjectives.some(o => o.type === 'Collection');
  const completedObjCount = displayObjectives.filter(o => o.completed).length;

  useEffect(() => {
    const start = initialVisitId
      ? (activeVisitData ? new Date(activeVisitData.startTime).getTime() : startTime.getTime())
      : startTime.getTime();
    const interval = setInterval(() => setElapsed(Math.floor((Date.now() - start) / 1000)), 1000);
    return () => clearInterval(interval);
  }, [startTime, initialVisitId, activeVisitData?.startTime]);

  const fmt = (s: number) => {
    const m = Math.floor(s / 60); const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const handleStartVisit = () => {
    const objs = selectedObjectives.map(type => ({ type, description: type, completed: false }));
    const id = startVisit(customerId, customerName, user?.id ?? '', user?.name ?? '', objs);
    setVisitId(id);
    setStep('objectives');
  };

  const handleToggleObjective = (vId: string, objectiveId: string, completed: boolean) => {
    updateVisitObjective(vId, objectiveId, completed);
  };

  const handleEndVisit = () => {
    if (!visitId) return;
    const captured = [...liveObjectives];
    setSnapshotObjectives(captured);
    const hasCol = captured.some(o => o.type === 'Collection');
    const outcome: VisitOutcome = {
      orderId: linkedOrderId ?? undefined,
      orderAmount: linkedOrderTotal ?? undefined,
      collectionAmount: hasCol && collectionAmount ? parseFloat(collectionAmount) : undefined,
      productsDiscussed: [],
      notes: outcomeNotes,
      paymentStatus: paymentStatus ?? undefined,
      paymentMethod: paymentStatus === 'Paid' ? (paymentMethod ?? undefined) : undefined,
    };
    endVisit(visitId, outcome);
    recordVisit();
    if (createFollowUp && fuNotes.trim()) {
      addFollowUp({
        type: fuType, repId: user?.id ?? '', customerId, customerName,
        dueDate: fuDate, status: 'Pending', priority: fuPriority,
        notes: fuNotes, linkedVisitId: visitId,
      });
    }
    setStep('summary');
  };

  const headerTitle =
    step === 'summary' ? 'Visit Complete' :
    step === 'end' ? 'End Visit' :
    customerName;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end sm:items-center sm:justify-center sm:p-6 bg-black/50">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg max-h-[92vh] overflow-y-auto">

        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden flex-shrink-0">
          <div className="h-1 w-10 bg-slate-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 sticky top-0 bg-white rounded-t-2xl z-10">
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-black text-slate-800 truncate">{headerTitle}</h2>
            {step !== 'summary' ? (
              <div className="flex items-center gap-2 mt-1.5">
                <div className="flex items-center gap-1">
                  {STEP_LABELS.map((label, i) => (
                    <span key={label} className={`inline-block h-1.5 rounded-full transition-all duration-200 ${
                      i < stepIndex ? 'bg-indigo-600 w-3' : i === stepIndex ? 'bg-indigo-600 w-5' : 'bg-slate-200 w-3'
                    }`} />
                  ))}
                </div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{STEP_LABELS[stepIndex]}</span>
              </div>
            ) : (
              <p className="text-xs text-slate-400 mt-0.5">Visit recorded successfully</p>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 ml-3">
            {visitId && step !== 'summary' && (
              <div className="flex items-center gap-1 text-xs font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 rounded-xl">
                <Clock className="h-3 w-3" />{fmt(elapsed)}
              </div>
            )}
            <button onClick={onClose} className="h-8 w-8 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="p-5">

          {/* ══ CONFIRM ══ */}
          {step === 'confirm' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3.5 p-4 bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl">
                <div className="h-11 w-11 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm shadow-indigo-200">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-800">{customerName}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Starting visit now</p>
                  <p className="text-xs font-mono text-slate-400">{new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>

              {!isSessionActive && (
                <div className="flex items-center gap-2 px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-xl">
                  <WifiOff className="h-4 w-4 text-amber-500 flex-shrink-0" />
                  <p className="text-xs font-semibold text-amber-700">Start your work session before visiting</p>
                </div>
              )}
              {isSessionActive && !isOnline && (
                <div className="flex items-center gap-2 px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-xl">
                  <WifiOff className="h-4 w-4 text-amber-500 flex-shrink-0" />
                  <p className="text-xs font-semibold text-amber-700">No internet — go online to start a visit</p>
                </div>
              )}

              {/* Take Order CTA */}
              <button
                disabled={!canAct}
                onClick={() => {
                  if (!canAct) return;
                  const objs = [
                    { type: 'Order' as VisitObjectiveType, description: 'Order', completed: false },
                    ...selectedObjectives.filter(t => t !== 'Order').map(type => ({ type, description: type, completed: false })),
                  ];
                  const id = startVisit(customerId, customerName, user?.id ?? '', user?.name ?? '', objs);
                  navigate('/sales/orders/new', {
                    state: { customerId, customerName, visitId: id, repId: user?.id ?? '', returnPath: location.pathname },
                  });
                }}
                className={`w-full flex items-center justify-between px-4 py-4 rounded-2xl transition-colors ${
                  canAct ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}>
                <div className="flex items-center gap-3">
                  <div className={`h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 ${canAct ? 'bg-white/20' : 'bg-slate-300'}`}>
                    {canAct ? <ShoppingCart className="h-5 w-5" /> : <WifiOff className="h-5 w-5" />}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-black">
                      {canAct ? 'Take Order' : !isSessionActive ? 'Session Required' : 'Offline'}
                    </p>
                    <p className={`text-xs ${canAct ? 'text-indigo-200' : 'text-slate-400'}`}>
                      {canAct ? 'Start visit & create order' : !isSessionActive ? 'Go online via dashboard' : 'Internet required'}
                    </p>
                  </div>
                </div>
                <ChevronRight className={`h-5 w-5 ${canAct ? 'text-indigo-300' : 'text-slate-400'}`} />
              </button>

              <div className="flex items-center gap-2">
                <div className="flex-1 h-px bg-slate-100" />
                <span className="text-xs text-slate-400 font-medium">or select objectives</span>
                <div className="flex-1 h-px bg-slate-100" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                {OBJECTIVE_TYPES.filter(t => t !== 'Order').map(type => {
                  const sel = selectedObjectives.includes(type);
                  return (
                    <button key={type}
                      onClick={() => setSelectedObjectives(prev => sel ? prev.filter(t => t !== type) : [...prev, type])}
                      className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all ${
                        sel ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'
                      }`}>
                      {sel
                        ? <CheckSquare className="h-4 w-4 text-indigo-600 flex-shrink-0" />
                        : <Square className="h-4 w-4 text-slate-300 flex-shrink-0" />}
                      <span className="text-xs font-semibold text-slate-700">{type}</span>
                    </button>
                  );
                })}
              </div>

              <button
                disabled={!canAct}
                onClick={() => { if (canAct) handleStartVisit(); }}
                className={`w-full py-3.5 text-sm font-black rounded-2xl transition-all flex items-center justify-center gap-2 ${
                  canAct ? 'bg-slate-800 hover:bg-slate-900 text-white shadow-md shadow-slate-300' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}>
                {canAct ? <MapPin className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
                {canAct ? 'Start Visit' : !isSessionActive ? 'Session Required' : 'No Internet'}
              </button>
            </div>
          )}

          {/* ══ OBJECTIVES (active visit tracking) ══ */}
          {step === 'objectives' && visitId && (
            <div className="space-y-4">
              <p className="text-sm text-slate-500">Visit in progress — track objectives as you go.</p>

              {linkedOrderId ? (
                <div className="flex items-center gap-2 px-3 py-2.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <Package className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-emerald-700">Order placed</p>
                    <p className="text-xs text-emerald-600">#{linkedOrderId}{linkedOrderTotal ? ` · £${linkedOrderTotal.toFixed(2)}` : ''}</p>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => navigate('/sales/orders/new', {
                    state: { customerId, customerName, visitId, repId: user?.id ?? '', returnPath: location.pathname },
                  })}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-colors">
                  <ShoppingCart className="h-4 w-4" /> Create Order for {customerName}
                </button>
              )}

              {activeVisitData && (
                <div className="space-y-1.5">
                  {activeVisitData.objectives.length === 0 && (
                    <p className="text-sm text-slate-400 text-center py-4">No objectives set</p>
                  )}
                  {activeVisitData.objectives.map(obj => (
                    <button key={obj.id}
                      onClick={() => handleToggleObjective(visitId, obj.id, !obj.completed)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                        obj.completed ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}>
                      {obj.completed
                        ? <CheckSquare className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                        : <Square className="h-5 w-5 text-slate-300 flex-shrink-0" />}
                      <span className={`text-sm font-semibold flex-1 ${obj.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                        {obj.type}
                      </span>
                      {obj.completed && <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />}
                    </button>
                  ))}
                </div>
              )}

              <button onClick={() => setStep('end')}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm font-black rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-200">
                <CheckCircle2 className="h-5 w-5" /> End Visit
              </button>
            </div>
          )}

          {/* ══ END VISIT FORM ══ */}
          {step === 'end' && visitId && (
            <div className="space-y-5">

              {/* Objectives summary */}
              {liveObjectives.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Objectives</p>
                    <p className="text-xs font-semibold text-slate-400">{completedObjCount}/{liveObjectives.length} done</p>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {liveObjectives.map(obj => (
                      <button key={obj.id}
                        onClick={() => handleToggleObjective(visitId, obj.id, !obj.completed)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-left transition-all ${
                          obj.completed ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}>
                        {obj.completed
                          ? <CheckSquare className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                          : <Square className="h-3.5 w-3.5 text-slate-300 flex-shrink-0" />}
                        <span className={`text-xs font-semibold truncate ${obj.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                          {obj.type}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Order section ── */}
              {linkedOrderId ? (
                <div className="space-y-3">
                  {/* Order summary card */}
                  <div className="flex items-center gap-3 px-4 py-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl">
                    <div className="h-10 w-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Package className="h-4.5 w-4.5 text-emerald-600" style={{ width: 18, height: 18 }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Order Placed</p>
                      <p className="text-base font-black text-emerald-900">
                        £{linkedOrderTotal?.toFixed(2) ?? '—'}
                        <span className="text-xs font-semibold text-emerald-500 ml-2">#{linkedOrderId}</span>
                      </p>
                    </div>
                  </div>

                  {/* Payment status */}
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Payment Status</label>
                    <div className="grid grid-cols-3 gap-2">
                      {([
                        { value: 'Paid' as PaymentStatus, label: 'Payment\nDone' },
                        { value: 'Pending' as PaymentStatus, label: 'Awaiting\nPayment' },
                        { value: 'On Credit' as PaymentStatus, label: 'On\nCredit' },
                      ]).map(opt => {
                        const active = paymentStatus === opt.value;
                        const activeClass =
                          opt.value === 'Paid' ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm shadow-emerald-200' :
                          opt.value === 'Pending' ? 'bg-amber-500 border-amber-500 text-white shadow-sm shadow-amber-200' :
                          'bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-200';
                        return (
                          <button key={opt.value} onClick={() => { setPaymentStatus(opt.value); if (opt.value !== 'Paid') setPaymentMethod(null); }}
                            className={`py-3 px-2 rounded-2xl border-2 text-xs font-bold text-center transition-all whitespace-pre-line leading-tight ${
                              active ? activeClass : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white'
                            }`}>
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Payment method — only if Paid */}
                  {paymentStatus === 'Paid' && (
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Payment Method</label>
                      <div className="grid grid-cols-2 gap-2">
                        {([
                          { value: 'Link' as PaymentMethod, label: 'Payment Link', Icon: Link2 },
                          { value: 'Card' as PaymentMethod, label: 'Card Swipe', Icon: CreditCard },
                        ]).map(m => (
                          <button key={m.value} onClick={() => setPaymentMethod(m.value)}
                            className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl border-2 transition-all ${
                              paymentMethod === m.value
                                ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100'
                                : 'border-slate-200 text-slate-600 hover:border-indigo-200 bg-white'
                            }`}>
                            <m.Icon className="h-4 w-4 flex-shrink-0" />
                            <span className="text-xs font-bold">{m.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Status notices */}
                  {paymentStatus === 'Pending' && (
                    <div className="flex items-start gap-2 px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-xl">
                      <Clock className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-700 font-medium">Order on hold — will be approved once payment is received.</p>
                    </div>
                  )}
                  {paymentStatus === 'On Credit' && (
                    <div className="flex items-start gap-2 px-3 py-2.5 bg-blue-50 border border-blue-200 rounded-xl">
                      <CreditCard className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-blue-700 font-medium">Order approved on credit. Payment due per agreed terms.</p>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => navigate('/sales/orders/new', {
                    state: { customerId, customerName, visitId, repId: user?.id ?? '', returnPath: location.pathname },
                  })}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-indigo-200 text-indigo-600 text-sm font-semibold rounded-2xl hover:bg-indigo-50 transition-colors">
                  <ShoppingCart className="h-4 w-4" /> Add Order
                </button>
              )}

              {/* Collection — only if Collection objective was set */}
              {hasCollectionObj && (
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Amount Collected</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">£</span>
                    <input type="number" value={collectionAmount} onChange={e => setCollectionAmount(e.target.value)}
                      placeholder="0.00" min="0" step="0.01"
                      className="w-full pl-8 pr-3 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Online transfer received from customer</p>
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">
                  Notes <span className="normal-case font-normal text-slate-400">(optional)</span>
                </label>
                <textarea value={outcomeNotes} onChange={e => setOutcomeNotes(e.target.value)} rows={2}
                  placeholder="How did the visit go?"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none" />
              </div>

              {/* ── Media upload ── */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">
                  Media <span className="normal-case font-normal text-slate-400">(optional)</span>
                </label>
                <div className="space-y-2">
                  {mediaFiles.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {mediaFiles.map((m, idx) => (
                        <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden bg-slate-100">
                          {m.type === 'image' ? (
                            <img src={m.url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                              <Video className="h-6 w-6 text-slate-400" />
                              <span className="text-[10px] text-slate-400 font-medium px-1 text-center truncate w-full px-2">{m.file.name}</span>
                            </div>
                          )}
                          <button
                            onClick={() => removeMedia(idx)}
                            className="absolute top-1 right-1 h-6 w-6 bg-black/60 hover:bg-black/80 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash2 className="h-3 w-3 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <label className="flex items-center gap-3 w-full px-4 py-3 border-2 border-dashed border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 rounded-2xl cursor-pointer transition-colors">
                    <div className="h-8 w-8 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <ImagePlus className="h-4 w-4 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-700">Add photos or videos</p>
                      <p className="text-xs text-slate-400">Tap to choose multiple files</p>
                    </div>
                    <input type="file" accept="image/*,video/*" multiple className="hidden" onChange={handleMediaAdd} />
                  </label>
                </div>
              </div>

              {/* ── Follow-Up section ── */}
              <div className="space-y-3">
                <button
                  onClick={() => setCreateFollowUp(!createFollowUp)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 transition-all text-left ${
                    createFollowUp
                      ? 'border-indigo-400 bg-indigo-50/80'
                      : 'border-dashed border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40'
                  }`}>
                  <div className={`h-8 w-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                    createFollowUp ? 'bg-indigo-600' : 'bg-slate-100'
                  }`}>
                    {createFollowUp
                      ? <CheckCircle2 className="h-4 w-4 text-white" />
                      : <Plus className="h-4 w-4 text-slate-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold ${createFollowUp ? 'text-indigo-700' : 'text-slate-700'}`}>
                      {createFollowUp ? 'Follow-Up Scheduled' : 'Schedule Follow-Up'}
                    </p>
                    <p className={`text-xs mt-0.5 truncate ${createFollowUp ? 'text-indigo-500' : 'text-slate-400'}`}>
                      {createFollowUp
                        ? `${fuType} · Due ${new Date(fuDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`
                        : 'Optional — set a reminder for next action'}
                    </p>
                  </div>
                  <ChevronRight className={`h-4 w-4 flex-shrink-0 transition-transform ${createFollowUp ? 'rotate-90 text-indigo-400' : 'text-slate-300'}`} />
                </button>

                {createFollowUp && (
                  <div className="space-y-3 bg-slate-50/80 rounded-2xl px-4 py-4">
                    {/* Type — dropdown */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Type</label>
                      <div className="relative flex items-center bg-white border-2 border-slate-200 rounded-xl overflow-hidden focus-within:border-indigo-400 transition-colors">
                        {(() => { const Icon = FU_TYPE_META[fuType].icon; return <Icon className={`h-4 w-4 flex-shrink-0 ml-3 ${FU_TYPE_META[fuType].color}`} />; })()}
                        <select
                          value={fuType}
                          onChange={e => setFuType(e.target.value as FollowUpType)}
                          className="flex-1 appearance-none bg-transparent pl-2.5 pr-8 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none cursor-pointer"
                        >
                          {FOLLOW_UP_TYPES.map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                        <ChevronRight className="h-4 w-4 text-slate-400 rotate-90 absolute right-3 pointer-events-none" />
                      </div>
                    </div>

                    {/* Priority pills */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Priority</label>
                      <div className="flex gap-2">
                        {(['High', 'Medium', 'Low'] as FollowUpPriority[]).map(p => (
                          <button key={p} onClick={() => setFuPriority(p)}
                            className={`flex-1 py-2 rounded-xl text-xs font-bold border-2 transition-all ${
                              fuPriority === p
                                ? p === 'High' ? 'bg-rose-500 border-rose-500 text-white'
                                  : p === 'Medium' ? 'bg-amber-400 border-amber-400 text-white'
                                  : 'bg-slate-400 border-slate-400 text-white'
                                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                            }`}>{p}</button>
                        ))}
                      </div>
                    </div>

                    {/* Date */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Due Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                        <input type="date" value={fuDate} onChange={e => setFuDate(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                      </div>
                    </div>

                    {/* Notes */}
                    <textarea value={fuNotes} onChange={e => setFuNotes(e.target.value)} rows={2}
                      placeholder="What needs to happen?"
                      className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none" />
                  </div>
                )}
              </div>

              {/* Complete Visit CTA */}
              <button onClick={handleEndVisit}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm font-black rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 hover:shadow-xl">
                <CheckCircle2 className="h-5 w-5" /> Complete Visit
              </button>
            </div>
          )}

          {/* ══ SUMMARY ══ */}
          {step === 'summary' && (
            <div className="space-y-5 text-center">
              <div className="flex items-center justify-center mx-auto h-24 w-24 rounded-3xl bg-emerald-50">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-200">
                  <CheckCircle2 className="h-9 w-9 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800">Visit Complete!</h3>
                <p className="text-sm text-slate-400 mt-0.5">{customerName}</p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-left">
                {([
                  { label: 'Duration', value: fmt(elapsed) },
                  { label: 'Objectives', value: displayObjectives.length > 0 ? `${completedObjCount}/${displayObjectives.length}` : '—' },
                  { label: 'Order Value', value: linkedOrderTotal ? `£${linkedOrderTotal.toFixed(2)}` : '—' },
                  ...(hasCollectionObj ? [{ label: 'Collected', value: collectionAmount ? `£${parseFloat(collectionAmount).toFixed(2)}` : '—' }] : []),
                ]).map(item => (
                  <div key={item.label} className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</p>
                    <p className="text-base font-black text-slate-800 mt-1">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Payment status */}
              {linkedOrderId && paymentStatus && (
                <div className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl border ${
                  paymentStatus === 'Paid' ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : paymentStatus === 'Pending' ? 'bg-amber-50 border-amber-200 text-amber-700'
                  : 'bg-blue-50 border-blue-200 text-blue-700'
                }`}>
                  {paymentStatus === 'Paid'
                    ? <CheckCircle2 className="h-4 w-4" />
                    : paymentStatus === 'Pending'
                    ? <Clock className="h-4 w-4" />
                    : <CreditCard className="h-4 w-4" />}
                  <span className="text-sm font-bold">
                    {paymentStatus === 'Paid'
                      ? `Payment Done${paymentMethod ? ` · ${paymentMethod === 'Link' ? 'Payment Link' : 'Card Swipe'}` : ''}`
                      : paymentStatus}
                  </span>
                </div>
              )}

              {/* Follow-up chip */}
              {createFollowUp && fuNotes.trim() && (
                <div className="flex items-center gap-3 p-3.5 bg-indigo-50 border border-indigo-100 rounded-2xl text-left">
                  <div className="h-8 w-8 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-indigo-700">Follow-up scheduled</p>
                    <p className="text-xs text-indigo-500 mt-0.5">
                      {fuType} · Due {new Date(fuDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                </div>
              )}

              <button onClick={() => onComplete(visitId!)}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-black rounded-2xl transition-colors shadow-md shadow-indigo-200">
                Done
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default VisitWorkflowModal;
