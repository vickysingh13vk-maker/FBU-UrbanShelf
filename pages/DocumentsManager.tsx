import React, { useState } from 'react'; // p5-touch
import { FileText } from 'lucide-react';
import { Card } from '../components/ui';
import { useCRMOps } from '../context/CRMOpsContext';
import DocumentCard from '../components/crm-ops/DocumentCard';
import { DocumentType } from '../types';

type Filter = 'all' | DocumentType;

const TYPE_LABELS: Record<DocumentType, string> = {
  invoice: 'Invoice', receipt: 'Receipt', agreement: 'Agreement',
  license: 'Licence', 'payment-proof': 'Payment Proof',
  'visit-photo': 'Visit Photo', 'customer-document': 'Customer Doc', other: 'Other',
};

const DocumentsManager: React.FC = () => {
  const { documents } = useCRMOps();
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');

  const types = Array.from(new Set(documents.map(d => d.type))) as DocumentType[];

  const filtered = documents.filter(d => {
    const typeMatch = filter === 'all' || d.type === filter;
    const searchMatch = !search ||
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.linkedEntityName.toLowerCase().includes(search.toLowerCase());
    return typeMatch && searchMatch;
  });

  const sorted = [...filtered].sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-slate-800">Documents</h1>
        <p className="text-sm text-slate-500 mt-0.5">{documents.length} files uploaded</p>
      </div>

      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search documents or customers..."
        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      {/* Type filter chips */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${filter === 'all' ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
          All ({documents.length})
        </button>
        {types.map(t => (
          <button key={t} onClick={() => setFilter(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${filter === t ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            {TYPE_LABELS[t]} ({documents.filter(d => d.type === t).length})
          </button>
        ))}
      </div>

      {sorted.length === 0 ? (
        <Card padding="lg" className="text-center py-16">
          <FileText className="h-10 w-10 text-slate-200 mx-auto mb-3" />
          <p className="text-sm text-slate-400">No documents found</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map(d => <DocumentCard key={d.id} document={d} />)}
        </div>
      )}
    </div>
  );
};

export default DocumentsManager;
