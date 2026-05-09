import React, { useState, useEffect } from 'react';
import { X, MapPin, CheckSquare, Square, Plus, Clock, Star, ChevronRight } from 'lucide-react';
import { VisitObjective, VisitObjectiveType, VisitOutcome, FollowUpType, FollowUpPriority } from '../../types';
import { useSalesExecution } from '../../context/SalesExecutionContext';
import { useAuth } from '../../context/AuthContext';

const OBJECTIVE_TYPES: VisitObjectiveType[] = ['Order', 'Collection', 'Product Demo', 'Relationship', 'Sampling', 'Merchandising'];
const FOLLOW_UP_TYPES: FollowUpType[] = ['Callback', 'Payment Reminder', 'Revisit', 'Product Demo', 'Negotiation', 'Trial Follow-Up', 'Collection Follow-Up'];

interface Props {
  customerId: string;
  customerName: string;
  onComplete: (visitId: string) => void;
  onClose: () => void;
}

type Step = 'confirm' | 'objectives' | 'outcome' | 'followup' | 'summary';
const STEPS: Step[] = ['confirm', 'objectives', 'outcome', 'followup', 'summary'];
const STEP_LABELS = ['Confirm', 'Objectives', 'Outcome', 'Follow-Up', 'Summary'];

const VisitWorkflowModal: React.FC<Props> = ({ customerId, customerName, onComplete, onClose }) => {
  const { user } = useAuth();
  const { startVisit, updateVisitObjective, endVisit, getActiveVisit, addFollowUp } = useSalesExecution();

  const [step, setStep] = useState<Step>('confirm');
  const [visitId, setVisitId] = useState<string | null>(null);
  const [startTime] = useState(new Date());
  const [elapsed, setElapsed] = useState(0);

  // Objectives step
  const [selectedObjectives, setSelectedObjectives] = useState<VisitObjectiveType[]>([]);

  // Outcome step
  const [orderAmount, setOrderAmount] = useState('');
  const [collectionAmount, setCollectionAmount] = useState('');
  const [productsDiscussed, setProductsDiscussed] = useState('');
  const [outcomeNotes, setOutcomeNotes] = useState('');
  const [satisfaction, setSatisfaction] = useState<1|2|3|4|5>(4);

  // Follow-up step
  const [createFollowUp, setCreateFollowUp] = useState(false);
  const [fuType, setFuType] = useState<FollowUpType>('Revisit');
  const [fuPriority, setFuPriority] = useState<FollowUpPriority>('Medium');
  const [fuDate, setFuDate] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() + 7); return d.toISOString().split('T')[0];
  });
  const [fuNotes, setFuNotes] = useState('');

  const stepIndex = STEPS.indexOf(step);
  const activeVisit = visitId ? getActiveVisit(user?.id ?? '') : null;

  useEffect(() => {
    const interval = setInterval(() => setElapsed(Math.floor((Date.now() - startTime.getTime()) / 1000)), 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const formatElapsed = (s: number) => {
    const m = Math.floor(s / 60); const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const handleStartVisit = () => {
    const objectives = selectedObjectives.map(type => ({
      type, description: type, completed: false,
    }));
    const id = startVisit(customerId, customerName, user?.id ?? '', user?.name ?? '', objectives);
    setVisitId(id);
    setStep('objectives');
  };

  const handleConfirmObjective = (visitId: string, objectiveId: string, completed: boolean) => {
    updateVisitObjective(visitId, objectiveId, completed);
  };

  const handleEndVisit = () => {
    if (!visitId) return;
    const outcome: VisitOutcome = {
      orderAmount: orderAmount ? parseFloat(orderAmount) : undefined,
      collectionAmount: collectionAmount ? parseFloat(collectionAmount) : undefined,
      productsDiscussed: productsDiscussed.split(',').map(p => p.trim()).filter(Boolean),
      notes: outcomeNotes,
      customerSatisfaction: satisfaction,
    };
    endVisit(visitId, outcome);
    if (createFollowUp && fuNotes.trim()) {
      addFollowUp({
        type: fuType, repId: user?.id ?? '', customerId, customerName,
        dueDate: fuDate, status: 'Pending', priority: fuPriority,
        notes: fuNotes, linkedVisitId: visitId,
      });
    }
    setStep('summary');
  };

  const handleDone = () => {
    if (visitId) onComplete(visitId);
  };

  const activeVisitData = visitId ? (getActiveVisit(user?.id ?? '') ?? null) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 sticky top-0 bg-white rounded-t-2xl">
          <div>
            <h2 className="text-base font-black text-slate-800">Visit: {customerName}</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="flex gap-1">
                {STEP_LABELS.map((label, i) => (
                  <div key={label} className={`h-1.5 rounded-full transition-all ${i <= stepIndex ? 'bg-indigo-600' : 'bg-slate-200'}`}
                    style={{ width: i <= stepIndex ? '20px' : '12px' }} />
                ))}
              </div>
              <span className="text-xs text-slate-400">{STEP_LABELS[stepIndex]}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {visitId && step !== 'summary' && (
              <span className="flex items-center gap-1 text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                <Clock className="h-3 w-3" />{formatElapsed(elapsed)}
              </span>
            )}
            <button onClick={onClose} className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"><X className="h-4 w-4" /></button>
          </div>
        </div>

        <div className="p-5">
          {/* Step 1: Confirm */}
          {step === 'confirm' && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-2xl">
                <div className="h-12 w-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{customerName}</p>
                  <p className="text-xs text-slate-500">Starting visit now</p>
                  <p className="text-xs text-slate-400">{new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-3">Select visit objectives</p>
                <div className="grid grid-cols-2 gap-2">
                  {OBJECTIVE_TYPES.map(type => {
                    const selected = selectedObjectives.includes(type);
                    return (
                      <button key={type} onClick={() => setSelectedObjectives(prev =>
                        selected ? prev.filter(t => t !== type) : [...prev, type]
                      )} className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all ${
                        selected ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'
                      }`}>
                        {selected ? <CheckSquare className="h-4 w-4 text-indigo-600 flex-shrink-0" /> : <Square className="h-4 w-4 text-slate-300 flex-shrink-0" />}
                        <span className="text-xs font-semibold text-slate-700">{type}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <button onClick={handleStartVisit}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                <MapPin className="h-4 w-4" /> Start Visit
              </button>
            </div>
          )}

          {/* Step 2: Objectives (track during visit) */}
          {step === 'objectives' && visitId && (
            <div className="space-y-4">
              <p className="text-sm text-slate-500">Visit in progress. Track objectives as you complete them.</p>
              {activeVisitData ? (
                <div className="space-y-2">
                  {activeVisitData.objectives.length === 0 && (
                    <p className="text-sm text-slate-400 text-center py-4">No objectives set</p>
                  )}
                  {activeVisitData.objectives.map(obj => (
                    <button key={obj.id} onClick={() => handleConfirmObjective(visitId, obj.id, !obj.completed)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                        obj.completed ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-white hover:border-indigo-200'
                      }`}>
                      {obj.completed
                        ? <CheckSquare className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                        : <Square className="h-5 w-5 text-slate-300 flex-shrink-0" />}
                      <span className={`text-sm font-semibold ${obj.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>{obj.type}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400 text-center py-4">Loading...</p>
              )}
              <button onClick={() => setStep('outcome')}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                Log Outcome <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Step 3: Outcome */}
          {step === 'outcome' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1 block">Order Amount £</label>
                  <input type="number" value={orderAmount} onChange={e => setOrderAmount(e.target.value)} placeholder="0.00" min="0" step="0.01"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1 block">Collection £</label>
                  <input type="number" value={collectionAmount} onChange={e => setCollectionAmount(e.target.value)} placeholder="0.00" min="0" step="0.01"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Products Discussed</label>
                <input type="text" value={productsDiscussed} onChange={e => setProductsDiscussed(e.target.value)}
                  placeholder="Lost Mary BM6000, Velo 11mg..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Notes</label>
                <textarea value={outcomeNotes} onChange={e => setOutcomeNotes(e.target.value)} rows={3}
                  placeholder="How did the visit go?"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-2 block">Customer Satisfaction</label>
                <div className="flex gap-2">
                  {([1,2,3,4,5] as const).map(s => (
                    <button key={s} onClick={() => setSatisfaction(s)}
                      className={`flex-1 py-2 rounded-xl text-sm font-bold transition-colors ${satisfaction >= s ? 'text-amber-500' : 'text-slate-200'}`}>
                      <Star className="h-5 w-5 mx-auto" fill={satisfaction >= s ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={() => setStep('followup')}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                Follow-Up <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Step 4: Follow-Up */}
          {step === 'followup' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <button onClick={() => setCreateFollowUp(!createFollowUp)}
                  className={`h-6 w-6 rounded-lg border-2 flex items-center justify-center transition-colors ${createFollowUp ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'}`}>
                  {createFollowUp && <CheckSquare className="h-3.5 w-3.5 text-white" />}
                </button>
                <span className="text-sm font-semibold text-slate-700">Create a follow-up for this visit</span>
              </div>
              {createFollowUp && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 mb-2 block">Type</label>
                    <div className="flex flex-wrap gap-2">
                      {FOLLOW_UP_TYPES.map(t => (
                        <button key={t} onClick={() => setFuType(t)}
                          className={`px-2 py-1 rounded-lg text-xs font-semibold border transition-colors ${fuType === t ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-200 text-slate-600'}`}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 mb-1 block">Priority</label>
                      <select value={fuPriority} onChange={e => setFuPriority(e.target.value as FollowUpPriority)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none">
                        <option>High</option><option>Medium</option><option>Low</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 mb-1 block">Due Date</label>
                      <input type="date" value={fuDate} onChange={e => setFuDate(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 mb-1 block">Notes</label>
                    <textarea value={fuNotes} onChange={e => setFuNotes(e.target.value)} rows={2}
                      placeholder="What needs to happen?"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none resize-none" />
                  </div>
                </div>
              )}
              <button onClick={handleEndVisit}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-colors">
                End Visit
              </button>
            </div>
          )}

          {/* Step 5: Summary */}
          {step === 'summary' && (
            <div className="space-y-4 text-center">
              <div className="h-16 w-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto">
                <MapPin className="h-8 w-8 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-800">Visit Complete!</h3>
                <p className="text-sm text-slate-500">{customerName}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-left">
                {[
                  { label: 'Duration', value: formatElapsed(elapsed) },
                  { label: 'Satisfaction', value: `${satisfaction}/5 ⭐` },
                  { label: 'Order', value: orderAmount ? `£${parseFloat(orderAmount).toFixed(2)}` : '—' },
                  { label: 'Collected', value: collectionAmount ? `£${parseFloat(collectionAmount).toFixed(2)}` : '—' },
                ].map(item => (
                  <div key={item.label} className="p-3 bg-slate-50 rounded-xl">
                    <p className="text-xs text-slate-400">{item.label}</p>
                    <p className="text-sm font-bold text-slate-700">{item.value}</p>
                  </div>
                ))}
              </div>
              {createFollowUp && (
                <div className="p-3 bg-indigo-50 rounded-xl text-left">
                  <p className="text-xs font-bold text-indigo-600">Follow-up created: {fuType}</p>
                  <p className="text-xs text-slate-500">Due {new Date(fuDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
                </div>
              )}
              <button onClick={handleDone}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-colors">
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
