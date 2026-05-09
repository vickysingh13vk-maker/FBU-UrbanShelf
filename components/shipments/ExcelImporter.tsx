import React, { useRef, useState } from 'react';
import { Upload, X, CheckCircle, AlertTriangle } from 'lucide-react';
import { ShipmentItem } from '../../types';

interface ParsedRow {
  productName: string;
  flavour: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  valid: boolean;
  error?: string;
}

interface Props {
  onImport: (items: ShipmentItem[]) => void;
  onClose: () => void;
}

const parseCSV = (text: string): ParsedRow[] => {
  const lines = text.trim().split('\n');
  const dataLines = lines[0].toLowerCase().includes('product') ? lines.slice(1) : lines;
  return dataLines.filter(l => l.trim()).map((line, i) => {
    const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
    const productName = cols[0] ?? '';
    const flavour = cols[1] ?? '';
    const quantity = parseInt(cols[2]) || 0;
    const unitPrice = parseFloat(cols[3]) || 0;
    const valid = !!productName && quantity > 0 && unitPrice > 0;
    return { productName, flavour, quantity, unitPrice, totalPrice: quantity * unitPrice, valid, error: !valid ? 'Missing product, qty, or price' : undefined };
  });
};

const ExcelImporter: React.FC<Props> = ({ onImport, onClose }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');

  const handleFile = (file: File) => {
    setFileName(file.name);
    setError('');
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['csv', 'xlsx', 'xls'].includes(ext ?? '')) {
      setError('Only .csv, .xlsx, .xls supported');
      return;
    }
    // Read as text (CSV). For xlsx, user should export as CSV from Excel.
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const text = e.target?.result as string;
        setRows(parseCSV(text));
      } catch {
        setError('Failed to parse file. Export as CSV first.');
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const removeRow = (i: number) => setRows(prev => prev.filter((_, idx) => idx !== i));

  const handleConfirm = () => {
    const validRows = rows.filter(r => r.valid);
    const items: ShipmentItem[] = validRows.map((r, i) => ({
      id: `IMPORT-${i}`,
      productId: '',
      productName: r.productName,
      flavour: r.flavour,
      quantity: r.quantity,
      unitPrice: r.unitPrice,
      totalPrice: r.totalPrice,
    }));
    onImport(items);
    onClose();
  };

  const validCount = rows.filter(r => r.valid).length;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <p className="text-sm font-bold text-slate-800">Import from CSV / Excel</p>
          <button onClick={onClose} className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Expected format note */}
          <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100">
            <p className="text-xs font-semibold text-indigo-700 mb-1">Expected CSV columns:</p>
            <code className="text-xs text-indigo-600">Product Name, Flavour, Quantity, Unit Price</code>
            <p className="text-xs text-indigo-500 mt-1">First row can be headers — they'll be skipped automatically.</p>
          </div>

          {/* Drop zone */}
          {rows.length === 0 && (
            <div
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
              onClick={() => inputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 rounded-2xl p-10 flex flex-col items-center gap-3 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-colors"
            >
              <Upload className="h-8 w-8 text-slate-300" />
              <p className="text-sm font-semibold text-slate-500">Drop file here or click to browse</p>
              <p className="text-xs text-slate-400">.csv, .xlsx, .xls</p>
              <input ref={inputRef} type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-100">
              <AlertTriangle className="h-4 w-4 text-rose-500 flex-shrink-0" />
              <p className="text-xs text-rose-600">{error}</p>
            </div>
          )}

          {/* Preview table */}
          {rows.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-slate-600">{fileName} — {rows.length} rows ({validCount} valid)</p>
                <button onClick={() => { setRows([]); setFileName(''); }} className="text-xs text-indigo-500 hover:text-indigo-700 font-semibold">Change file</button>
              </div>
              <div className="overflow-auto max-h-52 rounded-xl border border-slate-100">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50 sticky top-0">
                    <tr>
                      {['Product', 'Flavour', 'Qty', 'Unit Price', 'Total', ''].map(h => (
                        <th key={h} className="text-left px-3 py-2 text-slate-500 font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r, i) => (
                      <tr key={i} className={`border-t border-slate-50 ${!r.valid ? 'bg-rose-50/50' : ''}`}>
                        <td className="px-3 py-1.5 font-medium text-slate-700">{r.productName || <span className="text-rose-400 italic">missing</span>}</td>
                        <td className="px-3 py-1.5 text-slate-500">{r.flavour || '—'}</td>
                        <td className="px-3 py-1.5 text-right">{r.quantity || <span className="text-rose-400">0</span>}</td>
                        <td className="px-3 py-1.5 text-right">£{r.unitPrice.toFixed(2)}</td>
                        <td className="px-3 py-1.5 text-right font-semibold">£{r.totalPrice.toFixed(2)}</td>
                        <td className="px-2 py-1.5">
                          {r.valid
                            ? <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                            : <button onClick={() => removeRow(i)}><X className="h-3.5 w-3.5 text-rose-400 hover:text-rose-600" /></button>
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700 font-semibold">Cancel</button>
          <button
            onClick={handleConfirm}
            disabled={validCount === 0}
            className="px-4 py-2 bg-indigo-500 text-white text-sm font-semibold rounded-xl hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Use {validCount} item{validCount !== 1 ? 's' : ''}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExcelImporter;
