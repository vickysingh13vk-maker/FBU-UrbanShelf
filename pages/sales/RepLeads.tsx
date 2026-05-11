import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Phone, Calendar, ChevronRight, List, Columns } from 'lucide-react';
import { Card } from '../../components/ui';
import LeadStageBadge from '../../components/sales/LeadStageBadge';
import PriorityBadge from '../../components/sales/PriorityBadge';
import LeadFormModal from '../../components/sales/LeadFormModal';
import { useSalesCRM } from '../../context/SalesCRMContext';
import { useAuth } from '../../context/AuthContext';
import { Lead, LeadStage } from '../../types';

const STAGES: LeadStage[] = ['New Lead', 'Contacted', 'Interested', 'Meeting Scheduled', 'Trial Order', 'Converted', 'Lost'];

const STAGE_COLORS: Record<LeadStage, string> = {
  'New Lead':          'border-slate-200 bg-slate-50',
  'Contacted':         'border-blue-200 bg-blue-50',
  'Interested':        'border-indigo-200 bg-indigo-50',
  'Meeting Scheduled': 'border-violet-200 bg-violet-50',
  'Trial Order':       'border-amber-200 bg-amber-50',
  'Converted':         'border-emerald-200 bg-emerald-50',
  'Lost':              'border-rose-200 bg-rose-50',
};

function formatDate(iso?: string) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

const LeadCard: React.FC<{ lead: Lead; onClick: () => void }> = ({ lead, onClick }) => (
  <div onClick={onClick} className="bg-white border border-slate-100 rounded-xl p-3 cursor-pointer hover:shadow-sm hover:border-indigo-200 transition-all">
    <div className="flex items-start justify-between gap-2 mb-2">
      <div className="min-w-0">
        <p className="text-sm font-bold text-slate-800 truncate">{lead.businessName}</p>
        <p className="text-xs text-slate-400">{lead.contactName}</p>
      </div>
      <PriorityBadge priority={lead.priority} />
    </div>
    <div className="flex items-center gap-2 flex-wrap">
      {lead.phone && (
        <span className="flex items-center gap-1 text-xs text-slate-400">
          <Phone className="h-3 w-3" />{lead.phone}
        </span>
      )}
      {lead.nextFollowUp && (
        <span className="flex items-center gap-1 text-xs text-amber-500 font-medium">
          <Calendar className="h-3 w-3" />{formatDate(lead.nextFollowUp)}
        </span>
      )}
    </div>
    {lead.notes && <p className="text-xs text-slate-400 mt-2 truncate">{lead.notes}</p>}
  </div>
);

const RepLeads: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getRepLeads, addLead } = useSalesCRM();

  const [view, setView] = useState<'list' | 'pipeline'>('list');
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<LeadStage | 'All'>('All');
  const [showAddForm, setShowAddForm] = useState(false);

  const repId = user?.id ?? '';
  const repName = user?.name ?? '';
  const leads = getRepLeads(repId);

  const filtered = leads.filter(l => {
    const matchSearch = !search ||
      l.businessName.toLowerCase().includes(search.toLowerCase()) ||
      l.contactName.toLowerCase().includes(search.toLowerCase());
    const matchStage = stageFilter === 'All' || l.stage === stageFilter;
    return matchSearch && matchStage;
  });

  const handleAddLead = (leadData: Omit<Lead, 'id' | 'activities' | 'createdDate'>) => {
    addLead(leadData);
    setShowAddForm(false);
  };

  // Stage counts for pipeline header
  const stageCounts = STAGES.reduce((acc, s) => {
    acc[s] = leads.filter(l => l.stage === s).length;
    return acc;
  }, {} as Record<LeadStage, number>);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-800">My Leads</h1>
          <p className="text-xs text-slate-500 mt-0.5">{leads.filter(l => l.stage !== 'Converted' && l.stage !== 'Lost').length} active · {leads.filter(l => l.stage === 'Converted').length} converted</p>
        </div>
        <button onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm">
          <Plus className="h-4 w-4" /> Add Lead
        </button>
      </div>

      {/* Controls */}
      <div className="flex gap-3 flex-wrap items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search leads..."
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
        <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
          <button onClick={() => setView('list')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${view === 'list' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>
            <List className="h-3.5 w-3.5" /> List
          </button>
          <button onClick={() => setView('pipeline')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${view === 'pipeline' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>
            <Columns className="h-3.5 w-3.5" /> Pipeline
          </button>
        </div>
      </div>

      {/* List View */}
      {view === 'list' && (
        <>
          {/* Stage filter pills */}
          <div className="flex gap-2 overflow-x-auto">
            {(['All', ...STAGES] as (LeadStage | 'All')[]).map(s => (
              <button key={s} onClick={() => setStageFilter(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  stageFilter === s ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}>
                {s} {s !== 'All' && <span className="opacity-60">({stageCounts[s]})</span>}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <Card padding="md" className="text-center py-10">
              <p className="text-sm text-slate-400">No leads found</p>
              <button onClick={() => setShowAddForm(true)} className="mt-2 text-indigo-500 text-sm font-semibold">Add your first lead →</button>
            </Card>
          ) : (
            <div className="space-y-3">
              {filtered.map(lead => (
                <Card key={lead.id} padding="md" className="cursor-pointer hover:shadow-md transition-all" onClick={() => navigate(`/sales/leads/${lead.id}`)}>
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 bg-violet-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-black text-violet-600">{lead.businessName.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <p className="text-sm font-bold text-slate-800">{lead.businessName}</p>
                          <p className="text-xs text-slate-400">{lead.contactName} · {lead.phone}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <PriorityBadge priority={lead.priority} />
                          <LeadStageBadge stage={lead.stage} />
                        </div>
                      </div>
                      {lead.notes && <p className="text-xs text-slate-400 truncate mt-1">{lead.notes}</p>}
                      <div className="flex items-center gap-4 mt-2">
                        {lead.lastContactDate && (
                          <span className="text-xs text-slate-400">Last contact: {formatDate(lead.lastContactDate)}</span>
                        )}
                        {lead.nextFollowUp && (
                          <span className="text-xs text-amber-500 font-medium flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> {formatDate(lead.nextFollowUp)}
                          </span>
                        )}
                        <span className="text-xs text-slate-300">{lead.activities.length} activities</span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-300 flex-shrink-0 mt-1" />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Pipeline View */}
      {view === 'pipeline' && (
        <div className="overflow-x-auto">
          <div className="flex gap-4 min-w-max pb-4">
            {STAGES.map(stage => {
              const stageLeads = filtered.filter(l => l.stage === stage);
              return (
                <div key={stage} className={`w-64 rounded-2xl border-2 ${STAGE_COLORS[stage]} p-3`}>
                  <div className="flex items-center justify-between mb-3">
                    <LeadStageBadge stage={stage} size="md" />
                    <span className="text-xs font-bold text-slate-500 bg-white rounded-lg px-2 py-0.5">{stageLeads.length}</span>
                  </div>
                  <div className="space-y-2">
                    {stageLeads.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-4">No leads</p>
                    ) : (
                      stageLeads.map(l => (
                        <LeadCard key={l.id} lead={l} onClick={() => navigate(`/sales/leads/${l.id}`)} />
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showAddForm && (
        <LeadFormModal
          onSave={handleAddLead}
          onClose={() => setShowAddForm(false)}
          repId={repId}
          repName={repName}
        />
      )}
    </div>
  );
};

export default RepLeads;
