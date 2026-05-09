import React, { useRef, useState } from 'react';
import { Upload, X, CheckCircle, AlertTriangle, Truck } from 'lucide-react';
import { ShipmentItem, PaymentType } from '../../types';
import { SUPPLIERS } from '../../data';

interface ParsedItem {
  productName: string;
  flavour: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  valid: boolean;
}

interface ParsedShipment {
  supplierName: string;
  supplierId: string;
  date: string;
  paymentType: PaymentType;
  notes: string;
  items: ParsedItem[];
  headerWarnings: string[];
}

export interface ShipmentImportPayload {
  supplierId: string;
  supplierName: string;
  date: string;
  paymentType: PaymentType;
  notes: string;
  items: ShipmentItem[];
}

interface Props {
  onImport: (data: ShipmentImportPayload, asDraft: boolean) => void;
  onClose: () => void;
}

const fmt = (n: number) =>
  `£${n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const parseFullCSV = (text: string): ParsedShipment => {
  const lines = text.trim().split('\n').filter(l => l.trim());
  const firstLineLower = lines[0]?.toLowerCase() ?? '';
  const hasHeader =
    firstLineLower.includes('supplier') ||
    firstLineLower.includes('product') ||
    firstLineLower.includes('date');
  const dataLines = hasHeader ? lines.slice(1) : lines;

  const warnings: string[] = [];

  if (dataLines.length === 0) {
    return {
      supplierName: '', supplierId: '', date: '', paymentType: 'Paid',
      notes: '', items: [], headerWarnings: ['No data rows found'],
    };
  }

  // Shipment header from first row cols 0–3
  const firstCols = dataLines[0].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
  const supplierName = firstCols[0] ?? '';
  const date = firstCols[1] ?? new Date().toISOString().split('T')[0];
  const paymentRaw = (firstCols[2] ?? '').trim().toLowerCase();
  const paymentType: PaymentType = paymentRaw === 'credit' ? 'Credit' : 'Paid';
  const notes = firstCols[3] ?? '';

  const matchedSupplier = SUPPLIERS.find(
    s => s.name.toLowerCase() === supplierName.toLowerCase()
  );
  const supplierId = matchedSupplier?.id ?? '';

  if (!supplierName) warnings.push('Missing supplier name in column 1');
  else if (!matchedSupplier)
    warnings.push(`Supplier "${supplierName}" not found — add manually after import`);
  if (!date) warnings.push('Missing date in column 2');

  // Items from all rows, cols 4–7
  const items: ParsedItem[] = dataLines.map(line => {
    const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
    const productName = cols[4] ?? '';
    const flavour = cols[5] ?? '';
    const quantity = parseInt(cols[6]) || 0;
    const unitPrice = parseFloat(cols[7]) || 0;
    const valid = !!productName && quantity > 0 && unitPrice > 0;
    return { productName, flavour, quantity, unitPrice, totalPrice: quantity * unitPrice, valid };
  });

  return { supplierName, supplierId, date, paymentType, notes, items, headerWarnings: warnings };
};

const ShipmentImporter: React.FC<Props> = ({ onImport, onClose }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [parsed, setParsed] = useState<ParsedShipment | null>(null);
  const [fileName, setFileName] = useState('');
  const [fileError, setFileError] = useState('');

  const handleFile = (file: File) => {
    setFileName(file.name);
    setFileError('');
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['csv', 'xlsx', 'xls'].includes(ext ?? '')) {
      setFileError('Only .csv, .xlsx, .xls supported');
      return;
    }
    const reader = new FileReader();
    reader.onload = e => {
      try {
        setParsed(parseFullCSV(e.target?.result as string));
      } catch {
        setFileError('Failed to parse file. Export as CSV first.');
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const validItems = parsed?.items.filter(i => i.valid) ?? [];
  const grandTotal = validItems.reduce((s, i) => s + i.totalPrice, 0);
  const canImport = validItems.length > 0;

  const handleConfirm = (asDraft: boolean) => {
    if (!parsed || !canImport) return;
    const items: ShipmentItem[] = validItems.map((r, i) => ({
      id: `CSV-${Date.now()}-${i}`,
      productId: '',
      productName: r.productName,
      flavour: r.flavour,
      quantity: r.quantity,
      unitPrice: r.unitPrice,
      totalPrice: r.totalPrice,
    }));
    onImport(
      { supplierId: parsed.supplierId, supplierName: parsed.supplierName, date: parsed.date, paymentType: parsed.paymentType, notes: parsed.notes, items },
      asDraft
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-indigo-500" />
            <p className="text-sm font-bold text-slate-800">Import Full Shipment from CSV</p>
          </div>
          <button onClick={onClose} className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Format guide */}
          <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100 space-y-1.5">
            <p className="text-xs font-bold text-indigo-700">CSV format — 8 columns per row:</p>
            <code className="text-xs text-indigo-600 block bg-indigo-100/60 px-2 py-1 rounded-lg">
              Supplier Name, Date (YYYY-MM-DD), Payment Type (Paid/Credit), Notes, Product Name, Flavour, Quantity, Unit Price
            </code>
            <p className="text-xs text-indigo-500">
              Header row optional — auto-skipped. Supplier name must match an existing supplier.
            </p>
            <p className="text-xs text-indigo-500 font-mono">
              Example: Lost Mary,2026-05-10,Paid,Monthly order,BM6000 KIT,Strawberry Lime,500,12.00
            </p>
          </div>

          {/* Drop zone */}
          {!parsed && (
            <div
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
              onClick={() => inputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 rounded-2xl p-10 flex flex-col items-center gap-3 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-colors"
            >
              <Upload className="h-8 w-8 text-slate-300" />
              <p className="text-sm font-semibold text-slate-500">Drop CSV here or click to browse</p>
              <p className="text-xs text-slate-400">.csv, .xlsx, .xls</p>
              <input
                ref={inputRef} type="file" accept=".csv,.xlsx,.xls" className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
              />
            </div>
          )}

          {fileError && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-100">
              <AlertTriangle className="h-4 w-4 text-rose-500 flex-shrink-0" />
              <p className="text-xs text-rose-600">{fileError}</p>
            </div>
          )}

          {parsed && (
            <div className="space-y-4">
              {/* File name + change */}
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-500">{fileName} — {parsed.items.length} rows ({validItems.length} valid)</p>
                <button onClick={() => { setParsed(null); setFileName(''); }} className="text-xs text-indigo-500 hover:text-indigo-700 font-semibold">
                  Change file
                </button>
              </div>

              {/* Shipment header card */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide mb-0.5">Supplier</p>
                  <p className={`text-sm font-bold ${parsed.supplierId ? 'text-slate-800' : 'text-rose-500'}`}>
                    {parsed.supplierName || <span className="italic text-rose-400">missing</span>}
                    {parsed.supplierName && !parsed.supplierId && (
                      <span className="text-amber-500 text-[10px] ml-1">(no match)</span>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide mb-0.5">Date</p>
                  <p className="text-sm font-bold text-slate-800">{parsed.date || '—'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide mb-0.5">Payment</p>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${
                    parsed.paymentType === 'Paid' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                  }`}>
                    {parsed.paymentType}
                  </span>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide mb-0.5">Notes</p>
                  <p className="text-sm text-slate-600 italic truncate">{parsed.notes || '—'}</p>
                </div>
              </div>

              {/* Warnings */}
              {parsed.headerWarnings.length > 0 && (
                <div className="space-y-1">
                  {parsed.headerWarnings.map((w, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-100">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
                      <p className="text-xs text-amber-700">{w}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Items table */}
              <div className="overflow-auto max-h-52 rounded-xl border border-slate-100">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50 sticky top-0">
                    <tr>
                      <th className="text-left px-3 py-2 text-slate-500 font-semibold">Product</th>
                      <th className="text-left px-3 py-2 text-slate-500 font-semibold">Flavour</th>
                      <th className="text-right px-3 py-2 text-slate-500 font-semibold">Qty</th>
                      <th className="text-right px-3 py-2 text-slate-500 font-semibold">Unit Price</th>
                      <th className="text-right px-3 py-2 text-slate-500 font-semibold">Total</th>
                      <th className="px-2 py-2" />
                    </tr>
                  </thead>
                  <tbody>
                    {parsed.items.map((item, i) => (
                      <tr key={i} className={`border-t border-slate-50 ${!item.valid ? 'bg-rose-50/50' : ''}`}>
                        <td className="px-3 py-1.5 font-medium text-slate-700">
                          {item.productName || <span className="italic text-rose-400">missing</span>}
                        </td>
                        <td className="px-3 py-1.5 text-slate-500">{item.flavour || '—'}</td>
                        <td className="px-3 py-1.5 text-right text-slate-700">
                          {item.quantity > 0 ? item.quantity.toLocaleString() : <span className="text-rose-400">0</span>}
                        </td>
                        <td className="px-3 py-1.5 text-right text-slate-700">{fmt(item.unitPrice)}</td>
                        <td className="px-3 py-1.5 text-right font-semibold text-slate-800">{fmt(item.totalPrice)}</td>
                        <td className="px-2 py-1.5 text-center">
                          {item.valid
                            ? <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                            : <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Grand total */}
              <div className="flex justify-end pr-1">
                <p className="text-xs text-slate-500 font-semibold">
                  Grand Total:&nbsp;
                  <span className="text-base font-black text-slate-800">{fmt(grandTotal)}</span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700 font-semibold">
            Cancel
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => handleConfirm(true)}
              disabled={!canImport}
              className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Save as Draft
            </button>
            <button
              onClick={() => handleConfirm(false)}
              disabled={!canImport}
              className="px-5 py-2 bg-indigo-500 text-white text-sm font-semibold rounded-xl hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Import &amp; Record ({validItems.length} item{validItems.length !== 1 ? 's' : ''})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentImporter;
