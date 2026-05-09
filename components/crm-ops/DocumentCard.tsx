import React from 'react';
import { CustomerDocument, DocumentType } from '../../types';
import { FileText, Image, File, Download } from 'lucide-react';

const TYPE_LABELS: Record<DocumentType, string> = {
  invoice:            'Invoice',
  receipt:            'Receipt',
  agreement:          'Agreement',
  license:            'Licence',
  'payment-proof':    'Payment Proof',
  'visit-photo':      'Visit Photo',
  'customer-document':'Customer Doc',
  other:              'Other',
};

const TYPE_COLORS: Record<DocumentType, string> = {
  invoice:            'bg-blue-50 text-blue-700',
  receipt:            'bg-emerald-50 text-emerald-700',
  agreement:          'bg-purple-50 text-purple-700',
  license:            'bg-amber-50 text-amber-700',
  'payment-proof':    'bg-teal-50 text-teal-700',
  'visit-photo':      'bg-rose-50 text-rose-700',
  'customer-document':'bg-indigo-50 text-indigo-700',
  other:              'bg-slate-100 text-slate-500',
};

const getIcon = (mimeType: string) => {
  if (mimeType.startsWith('image/')) return <Image className="h-6 w-6 text-rose-400" />;
  if (mimeType === 'application/pdf') return <FileText className="h-6 w-6 text-red-500" />;
  return <File className="h-6 w-6 text-slate-400" />;
};

const fmtSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

interface Props { document: CustomerDocument; }

const DocumentCard: React.FC<Props> = ({ document: d }) => {
  const typeColor = TYPE_COLORS[d.type];
  const uploadDate = new Date(d.uploadedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="p-4 rounded-2xl border border-slate-100 bg-white hover:shadow-sm transition-shadow flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0">
          {getIcon(d.mimeType)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-800 truncate">{d.name}</p>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${typeColor}`}>{TYPE_LABELS[d.type]}</span>
            <span className="text-xs text-slate-400">{fmtSize(d.size)}</span>
          </div>
        </div>
      </div>

      <div className="text-xs text-slate-400 space-y-0.5">
        <p>Linked: <span className="text-indigo-500 font-medium">{d.linkedEntityName}</span></p>
        <p>Uploaded by {d.uploadedByName} · {uploadDate}</p>
        {d.notes && <p className="text-slate-400 italic truncate">"{d.notes}"</p>}
      </div>

      <a
        href={d.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-600 transition-colors"
      >
        <Download className="h-3.5 w-3.5" /> View / Download
      </a>
    </div>
  );
};

export default DocumentCard;
