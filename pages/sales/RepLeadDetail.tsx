import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, MapPin, Calendar, ChevronRight, CheckCircle, XCircle } from 'lucide-react';
import { Card } from '../../components/ui';
import LeadStageBadge from '../../components/sales/LeadStageBadge';
import PriorityBadge from '../../components/sales/PriorityBadge';
import LeadFormModal from '../../components/sales/LeadFormModal';
import { useSalesCRM } from '../../context/SalesCRMContext';
import { useAuth } from '../../context/AuthContext';
import { Lead, LeadStage, LeadActivityType } from '../../types';

const STAGES: LeadStage[] = ['New Lead', 'Contacted', 'Interested', 'Meeting Scheduled', 'Trial Order', 'Converted', 'Lost'];

const ACTIVITY_TYPE_CONFIG: Record<LeadActivityType, { color: string; label: string }> = {
  'Call':         { color: 'bg-blue-500',    label: 'Call' },
  'Visit':        { color: 'bg-indigo-500',  label: 'Visit' },
  'Follow-Up':    { color: 'bg-amber-500',   label: 'Follow-Up' },
  'WhatsApp':     { color: 'bg-teal-500',    label: 'WhatsApp' },
  'Note':         { color: 'bg-slate-400',   label: 'Note' },
  'Stage Change': { color: 'bg-violet-500',  label: 'Stage Change' },
};

const ACTIVITY_TYPES: LeadActivityType[] = ['Call', 'Visit', 'Follow-Up', 'WhatsApp', 'Note'];

function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

const RepLeadDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { leads, updateLead, moveLeadStage, addLeadActivity, convertLead, addCustomer } = useSalesCRM();

  const [showEditForm, setShowEditForm] = useState(false);
  const [showStagePicker, setShowStagePicker] = useState(false);
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [showLostForm, setShowLostForm] = useState(false);
  const [activityType, setActivityType] = useState<LeadActivityType>('Call');
  const [activityNote, setActivityNote] = useState('');
  const [activityOutcome, setActivityOutcome] = useState('');
  const [activityNextAction, setActivityNextAction] = useState('');
  const [lostReason, setLostReason] = useState('');

  const lead = leads.find(l => l.id === id);
  if (!lead) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400">Lead not found</p>
        <button onClick={() => navigate('/sales/leads')} className="mt-4 text-indigo-500 text-sm font-semibold">← Back</button>
      </div>
    );
  }

  const stageIndex = STAGES.indexOf(lead.stage);
  const progressStages = STAGES.filter(s => s !== 'Converted' && s !== 'Lost');
  const activeProgressIndex = progressStages.indexOf(lead.stage);

  const handleLogActivity = (e: React.FormEvent) => {
    e.preventDefault();
    addLeadActivity(lead.id, {
      type: activityType,
      repId: user?.id ?? '',
      repName: user?.name ?? '',
      timestamp: new Date().toISOString(),
      notes: activityNote,
      outcome: activityOutcome || undefined,
      nextAction: activityNextAction || undefined,
    });
    setActivityNote('');
    setActivityOutcome('');
    setActivityNextAction('');
    setShowActivityForm(false);
  };

  const handleMarkLost = () => {
    moveLeadStage(lead.id, 'Lost', lostReason || 'Marked as lost');
    updateLead(lead.id, { lostReason });
    setShowLostForm(false);
  };

  const handleConvert = () => {
    const newCustomer = addCustomer({
      name: lead.contactName,
      email: lead.email ?? '',
      phone: lead.phone ?? '',
      companyName: lead.businessName,
      storeName: lead.businessName,
      regNo: '',
      address: lead.address ?? '',
      status: 'Approved',
      walletBalance: 0,
      creditLimit: 1000,
      joinedDate: new Date().toISOString().split('T')[0],
      category: lead.category,
      assignedRepId: lead.repId,
      assignedRepName: lead.repName,
      createdByRepId: lead.repId,
      ownershipStatus: 'Assigned',
      lifecycleStage: 'New',
      lastContactDate: new Date().toISOString(),
    });
    convertLead(lead.id, newCustomer.id);
    navigate(`/sales/customers/${newCustomer.id}`);
  };

  const sortedActivities = [...lead.activities].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="space-y-5">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors group w-fit">
        <div className="p-1.5 bg-slate-100 group-hover:bg-slate-200 rounded-lg transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </div>
        Back
      </button>

      {/* Lead Header */}
      <Card padding="md">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 bg-violet-100 rounded-2xl flex items-center justify-center flex-shrink-0">
              <span className="text-xl font-black text-violet-600">{lead.businessName.charAt(0)}</span>
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800">{lead.businessName}</h1>
              <p className="text-sm text-slate-500">{lead.contactName}</p>
              <div className="flex items-center gap-3 mt-2">
                <LeadStageBadge stage={lead.stage} size="md" />
                <PriorityBadge priority={lead.priority} />
              </div>
            </div>
          </div>
          <button onClick={() => setShowEditForm(true)}
            className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
            Edit
          </button>
        </div>

        {/* Contact Info */}
        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-slate-50">
          {lead.phone && (
            <a href={`tel:${lead.phone}`} className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-indigo-600">
              <Phone className="h-3.5 w-3.5" />{lead.phone}
            </a>
          )}
          {lead.email && (
            <a href={`mailto:${lead.email}`} className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-indigo-600">
              <Mail className="h-3.5 w-3.5" />{lead.email}
            </a>
          )}
          {lead.address && (
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <MapPin className="h-3.5 w-3.5" />{lead.address}
            </span>
          )}
          {lead.nextFollowUp && (
            <span className="flex items-center gap-1.5 text-xs text-amber-600 font-medium">
              <Calendar className="h-3.5 w-3.5" />Follow-up: {new Date(lead.nextFollowUp).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
            </span>
          )}
        </div>

        {lead.notes && (
          <p className="text-sm text-slate-500 mt-3 p-3 bg-slate-50 rounded-xl">{lead.notes}</p>
        )}
      </Card>

      {/* Stage Progress (not shown for converted/lost) */}
      {lead.stage !== 'Converted' && lead.stage !== 'Lost' && (
        <Card padding="md">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-700">Lead Stage</h3>
            <button onClick={() => setShowStagePicker(!showStagePicker)}
              className="text-xs text-indigo-500 font-semibold hover:text-indigo-700">
              Move Stage →
            </button>
          </div>
          {/* Progress Bar */}
          <div className="flex items-center gap-1 mb-3">
            {progressStages.map((s, i) => (
              <React.Fragment key={s}>
                <div className={`flex-1 h-1.5 rounded-full transition-colors ${i <= activeProgressIndex ? 'bg-indigo-500' : 'bg-slate-200'}`} />
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-between">
            {progressStages.map((s, i) => (
              <span key={s} className={`text-xs ${i === activeProgressIndex ? 'text-indigo-600 font-bold' : 'text-slate-400'}`}
                style={{ fontSize: '10px' }}>
                {s.split(' ')[0]}
              </span>
            ))}
          </div>

          {showStagePicker && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-500 mb-2">Move to:</p>
              <div className="flex flex-wrap gap-2">
                {STAGES.filter(s => s !== lead.stage).map(s => (
                  <button key={s} onClick={() => { moveLeadStage(lead.id, s); setShowStagePicker(false); }}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-indigo-100 hover:text-indigo-700 transition-colors">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Convert / Lost actions */}
          <div className="flex gap-3 mt-4 pt-4 border-t border-slate-100">
            <button onClick={handleConvert}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-colors">
              <CheckCircle className="h-3.5 w-3.5" /> Convert to Customer
            </button>
            <button onClick={() => setShowLostForm(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold rounded-xl transition-colors">
              <XCircle className="h-3.5 w-3.5" /> Mark as Lost
            </button>
          </div>
        </Card>
      )}

      {/* Converted / Lost banners */}
      {lead.stage === 'Converted' && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
          <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-bold text-emerald-800">Lead Converted</p>
            <p className="text-xs text-emerald-600">This lead has been converted to a customer account.</p>
          </div>
          {lead.convertedCustomerId && (
            <button onClick={() => navigate(`/sales/customers/${lead.convertedCustomerId}`)}
              className="ml-auto flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900">
              View Customer <ChevronRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      )}
      {lead.stage === 'Lost' && (
        <div className="flex items-start gap-3 p-4 bg-rose-50 border border-rose-200 rounded-2xl">
          <XCircle className="h-5 w-5 text-rose-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-rose-700">Lead Lost</p>
            {lead.lostReason && <p className="text-xs text-rose-500 mt-0.5">{lead.lostReason}</p>}
          </div>
        </div>
      )}

      {/* Activity Log */}
      <Card padding="md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-700">Activity Log</h3>
          {lead.stage !== 'Converted' && lead.stage !== 'Lost' && (
            <button onClick={() => setShowActivityForm(!showActivityForm)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-semibold hover:bg-indigo-100 transition-colors">
              + Log Activity
            </button>
          )}
        </div>

        {/* Activity Form */}
        {showActivityForm && (
          <form onSubmit={handleLogActivity} className="mb-5 p-4 bg-slate-50 rounded-xl space-y-3">
            <div className="flex flex-wrap gap-2 mb-2">
              {ACTIVITY_TYPES.map(t => (
                <button key={t} type="button" onClick={() => setActivityType(t)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${activityType === t ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>
                  {t}
                </button>
              ))}
            </div>
            <textarea value={activityNote} onChange={e => setActivityNote(e.target.value)} required rows={2}
              placeholder="What happened? *"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            <input value={activityOutcome} onChange={e => setActivityOutcome(e.target.value)}
              placeholder="Outcome (optional)"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            <input value={activityNextAction} onChange={e => setActivityNextAction(e.target.value)}
              placeholder="Next action (optional)"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            <div className="flex gap-2">
              <button type="button" onClick={() => setShowActivityForm(false)}
                className="flex-1 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600">Cancel</button>
              <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700">Save</button>
            </div>
          </form>
        )}

        {/* Activity Timeline */}
        {sortedActivities.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">No activities logged yet</p>
        ) : (
          <div className="space-y-0">
            {sortedActivities.map((activity, idx) => {
              const cfg = ACTIVITY_TYPE_CONFIG[activity.type];
              return (
                <div key={activity.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`h-6 w-6 rounded-full ${cfg.color} flex items-center justify-center flex-shrink-0`}>
                      <span className="text-white text-xs font-bold">{cfg.label.charAt(0)}</span>
                    </div>
                    {idx < sortedActivities.length - 1 && <div className="w-px flex-1 bg-slate-100 mt-1" />}
                  </div>
                  <div className="pb-4 flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-bold text-slate-700">{cfg.label}</span>
                      <span className="text-xs text-slate-400">{formatRelative(activity.timestamp)}</span>
                    </div>
                    <p className="text-sm text-slate-600">{activity.notes}</p>
                    {activity.outcome && <p className="text-xs text-slate-400 mt-0.5">Outcome: {activity.outcome}</p>}
                    {activity.nextAction && <p className="text-xs text-indigo-500 mt-0.5">→ {activity.nextAction}</p>}
                    {activity.stageFrom && activity.stageTo && (
                      <p className="text-xs text-violet-500 mt-0.5">{activity.stageFrom} → {activity.stageTo}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Lost Reason Form */}
      {showLostForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="text-base font-bold text-slate-800 mb-3">Mark as Lost</h3>
            <textarea value={lostReason} onChange={e => setLostReason(e.target.value)} rows={3}
              placeholder="Why was this lead lost? (optional)"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-rose-300 mb-4" />
            <div className="flex gap-3">
              <button onClick={() => setShowLostForm(false)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600">Cancel</button>
              <button onClick={handleMarkLost} className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-sm font-bold">Confirm Lost</button>
            </div>
          </div>
        </div>
      )}

      {showEditForm && (
        <LeadFormModal
          onSave={data => { updateLead(lead.id, data); setShowEditForm(false); }}
          onClose={() => setShowEditForm(false)}
          repId={user?.id ?? ''}
          repName={user?.name ?? ''}
          initial={lead}
        />
      )}
    </div>
  );
};

export default RepLeadDetail;
