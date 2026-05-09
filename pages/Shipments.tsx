import React, { useState, useCallback } from 'react';
import {
  Truck, Plus, ChevronDown, ChevronRight, CheckCircle, Clock, XCircle,
  Upload, BookOpen, Package, AlertTriangle, FileText, Download
} from 'lucide-react';
import { useShipment } from '../context/ShipmentContext';
import { SUPPLIERS, PRODUCTS } from '../data';
import { InboundShipment, ShipmentItem, PaymentType, LedgerEntryType } from '../types';
import LineItemRow from '../components/shipments/LineItemRow';
import ExcelImporter from '../components/shipments/ExcelImporter';
import ShipmentImporter, { ShipmentImportPayload } from '../components/shipments/ShipmentImporter';

// ── Helpers ───────────────────────────────────────────────────────────────────
type Tab = 'history' | 'record' | 'ledger';

const fmt = (n: number) => `£${n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const STATUS_CFG = {
  Confirmed: { bg: 'bg-emerald-100 text-emerald-700', icon: <CheckCircle className="h-3 w-3" /> },
  Draft:     { bg: 'bg-amber-100 text-amber-700',   icon: <Clock className="h-3 w-3" /> },
  Cancelled: { bg: 'bg-slate-100 text-slate-500',   icon: <XCircle className="h-3 w-3" /> },
};

const PAYMENT_CFG = {
  Paid:   'bg-blue-100 text-blue-700',
  Credit: 'bg-purple-100 text-purple-700',
};

const LEDGER_CFG: Record<LedgerEntryType, string> = {
  CREDIT: 'bg-emerald-100 text-emerald-700',
  DEBIT:  'bg-rose-100 text-rose-700',
};

const emptyItem = (): ShipmentItem => ({
  id: `new-${Date.now()}-${Math.random()}`,
  productId: '', productName: '', flavour: '', quantity: 0, unitPrice: 0, totalPrice: 0,
});

// ── Main Page ─────────────────────────────────────────────────────────────────
const ShipmentsPage: React.FC = () => {
  const { shipments, ledger, recordShipment, saveDraft, confirmDraft, cancelShipment } = useShipment();
  const [tab, setTab] = useState<Tab>('history');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // ── History filters
  const [filterSupplier, setFilterSupplier] = useState('');
  const [filterStatus, setFilterStatus]   = useState('');
  const [filterPayment, setFilterPayment] = useState('');
  const [search, setSearch] = useState('');

  // ── Record form
  const [supplierId, setSupplierId]     = useState('');
  const [date, setDate]                 = useState(new Date().toISOString().split('T')[0]);
  const [paymentType, setPaymentType]   = useState<PaymentType>('Paid');
  const [hasCustomer, setHasCustomer]   = useState(false);
  const [notes, setNotes]               = useState('');
  const [rows, setRows]                 = useState<ShipmentItem[]>([emptyItem()]);
  const [showImporter, setShowImporter] = useState(false);
  const [showShipmentImporter, setShowShipmentImporter] = useState(false);
  const [formError, setFormError]       = useState('');
  const [successMsg, setSuccessMsg]     = useState('');

  // ── Ledger filters
  const [ledgerSupplier, setLedgerSupplier] = useState('');
  const [ledgerType, setLedgerType]         = useState('');

  // ── Row helpers
  const addRow    = () => setRows(prev => [...prev, emptyItem()]);
  const removeRow = (id: string) => setRows(prev => prev.filter(r => r.id !== id));
  const updateRow = useCallback((id: string, field: keyof ShipmentItem, value: string | number) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  }, []);
  const handleImport = (items: ShipmentItem[]) => setRows(prev => [...prev.filter(r => r.productId || r.productName), ...items]);

  const grandTotal = rows.reduce((s, r) => s + r.totalPrice, 0);
  const supplier   = SUPPLIERS.find(s => s.id === supplierId);

  // ── Submit
  const buildDraft = (status: 'Confirmed' | 'Draft') => {
    if (!supplierId) { setFormError('Select a supplier'); return null; }
    if (!date)       { setFormError('Select a date'); return null; }
    const validRows = rows.filter(r => r.productName && r.quantity > 0 && r.unitPrice > 0);
    if (validRows.length === 0) { setFormError('Add at least one valid line item'); return null; }
    setFormError('');
    return {
      supplierId, supplierName: supplier?.name ?? '',
      date, paymentType, status,
      hasLinkedCustomer: hasCustomer,
      items: validRows,
      totalAmount: validRows.reduce((s, r) => s + r.totalPrice, 0),
      notes, createdBy: 'Admin',
    } as Omit<InboundShipment, 'id' | 'createdAt' | 'status'>;
  };

  const handleRecord = () => {
    const draft = buildDraft('Confirmed');
    if (!draft) return;
    const id = recordShipment(draft);
    setSuccessMsg(`Shipment ${id} recorded!`);
    resetForm();
    setTab('history');
  };

  const handleSaveDraft = () => {
    const draft = buildDraft('Draft');
    if (!draft) return;
    const id = saveDraft(draft);
    setSuccessMsg(`Draft ${id} saved.`);
    resetForm();
    setTab('history');
  };

  const resetForm = () => {
    setSupplierId(''); setDate(new Date().toISOString().split('T')[0]);
    setPaymentType('Paid'); setHasCustomer(false); setNotes('');
    setRows([emptyItem()]); setFormError('');
  };

  const handleFullShipmentImport = (data: ShipmentImportPayload, asDraft: boolean) => {
    const payload = {
      supplierId: data.supplierId,
      supplierName: data.supplierName,
      date: data.date,
      paymentType: data.paymentType,
      hasLinkedCustomer: false,
      items: data.items,
      totalAmount: data.items.reduce((s, r) => s + r.totalPrice, 0),
      notes: data.notes,
      createdBy: 'Admin',
    } as Omit<InboundShipment, 'id' | 'createdAt' | 'status'>;
    if (asDraft) {
      const id = saveDraft(payload);
      setSuccessMsg(`Draft ${id} saved from CSV import.`);
    } else {
      const id = recordShipment(payload);
      setSuccessMsg(`Shipment ${id} recorded from CSV import!`);
    }
    setTab('history');
  };

  // ── Filtered data
  const filteredShipments = shipments.filter(s => {
    if (filterSupplier && s.supplierId !== filterSupplier) return false;
    if (filterStatus  && s.status !== filterStatus)       return false;
    if (filterPayment && s.paymentType !== filterPayment) return false;
    if (search && !s.supplierName.toLowerCase().includes(search.toLowerCase()) && !s.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const filteredLedger = ledger.filter(l => {
    if (ledgerSupplier && l.supplierId !== ledgerSupplier) return false;
    if (ledgerType     && l.type !== ledgerType)           return false;
    return true;
  });

  const totalCredit = filteredLedger.filter(l => l.type === 'CREDIT').reduce((s, l) => s + l.amount, 0);
  const totalDebit  = filteredLedger.filter(l => l.type === 'DEBIT').reduce((s, l) => s + l.amount, 0);

  // ── Summary stats
  const confirmed = shipments.filter(s => s.status === 'Confirmed').length;
  const drafts    = shipments.filter(s => s.status === 'Draft').length;
  const totalVal  = shipments.filter(s => s.status === 'Confirmed').reduce((s, sh) => s + sh.totalAmount, 0);

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Shipments</h1>
          <p className="text-sm text-slate-500 mt-0.5">{shipments.length} total · {confirmed} confirmed · {fmt(totalVal)} value</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowShipmentImporter(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors"
          >
            <Download className="h-4 w-4 text-indigo-400" /> Import CSV
          </button>
          <button
            onClick={() => { resetForm(); setTab('record'); }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white text-sm font-semibold rounded-xl hover:bg-indigo-600 transition-colors"
          >
            <Plus className="h-4 w-4" /> Record Shipment
          </button>
        </div>
      </div>

      {/* Success banner */}
      {successMsg && (
        <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
          <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
          <p className="text-sm font-semibold text-emerald-700">{successMsg}</p>
          <button onClick={() => setSuccessMsg('')} className="ml-auto text-emerald-400 hover:text-emerald-600 text-xs">✕</button>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Shipments', value: shipments.length, color: 'text-slate-800' },
          { label: 'Confirmed',       value: confirmed,         color: 'text-emerald-700' },
          { label: 'Drafts',          value: drafts,            color: 'text-amber-600' },
          { label: 'Total Value',     value: fmt(totalVal),     color: 'text-indigo-700' },
        ].map(c => (
          <div key={c.label} className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
            <p className={`text-2xl font-black ${c.color}`}>{c.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {([['history','History', <Package className="h-3.5 w-3.5"/>], ['record','Record New', <Plus className="h-3.5 w-3.5"/>], ['ledger','Ledger', <BookOpen className="h-3.5 w-3.5"/>]] as [Tab, string, React.ReactNode][]).map(([id, label, icon]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${tab === id ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {icon} {label}
          </button>
        ))}
      </div>

      {/* ── TAB: History ────────────────────────────────────────────────────── */}
      {tab === 'history' && (
        <div className="space-y-3">
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search ID or supplier..."
              className="flex-1 min-w-48 px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <select value={filterSupplier} onChange={e => setFilterSupplier(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
              <option value="">All Suppliers</option>
              {SUPPLIERS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
              <option value="">All Status</option>
              <option>Confirmed</option><option>Draft</option><option>Cancelled</option>
            </select>
            <select value={filterPayment} onChange={e => setFilterPayment(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
              <option value="">All Payments</option>
              <option>Paid</option><option>Credit</option>
            </select>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left   px-4 py-3 text-xs font-semibold text-slate-500 w-28">ID</th>
                  <th className="text-left   px-4 py-3 text-xs font-semibold text-slate-500">Supplier</th>
                  <th className="text-left   px-4 py-3 text-xs font-semibold text-slate-500 w-28">Date</th>
                  <th className="text-right  px-4 py-3 text-xs font-semibold text-slate-500 w-16">Items</th>
                  <th className="text-right  px-4 py-3 text-xs font-semibold text-slate-500 w-32">Total</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 w-24">Payment</th>
                  <th className="text-left   px-4 py-3 text-xs font-semibold text-slate-500 w-32">Status</th>
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody>
                {filteredShipments.length === 0 ? (
                  <tr><td colSpan={8} className="px-4 py-12 text-center text-sm text-slate-400">No shipments found</td></tr>
                ) : (
                  filteredShipments.map(s => {
                    const sStatus = STATUS_CFG[s.status];
                    const isExpanded = expandedId === s.id;
                    const shipLedger = ledger.filter(l => l.shipmentId === s.id);
                    return (
                      <React.Fragment key={s.id}>
                        <tr
                          className={`border-b cursor-pointer transition-all select-none ${
                            isExpanded
                              ? 'bg-indigo-50 border-l-4 border-l-indigo-400 border-b-indigo-100'
                              : 'border-l-4 border-l-transparent border-b-slate-100 hover:bg-slate-50 hover:border-l-slate-200'
                          }`}
                          onClick={() => setExpandedId(isExpanded ? null : s.id)}
                        >
                          <td className="px-4 py-3 text-xs font-bold font-mono text-indigo-600">{s.id}</td>
                          <td className="px-4 py-3 text-xs text-slate-700 font-semibold">{s.supplierName}</td>
                          <td className="px-4 py-3 text-xs text-slate-500">{s.date}</td>
                          <td className="px-4 py-3 text-xs text-slate-600 text-right font-medium">{s.items.length}</td>
                          <td className="px-4 py-3 text-xs font-bold text-slate-800 text-right">{fmt(s.totalAmount)}</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${PAYMENT_CFG[s.paymentType]}`}>{s.paymentType}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${sStatus.bg}`}>
                              {sStatus.icon} {s.status}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-center">
                            {isExpanded
                              ? <ChevronDown className="h-4 w-4 text-indigo-400" />
                              : <ChevronRight className="h-4 w-4 text-slate-300" />}
                          </td>
                        </tr>

                        {/* Expanded detail */}
                        {isExpanded && (
                          <tr className="bg-indigo-50/40 border-b border-indigo-100 border-l-4 border-l-indigo-400">
                            <td colSpan={8} className="px-6 py-5">
                              <div className="space-y-4">
                                {/* Meta */}
                                <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-slate-500">
                                  <span>Created by <span className="font-semibold text-slate-700">{s.createdBy}</span></span>
                                  {s.hasLinkedCustomer && s.customerName && (
                                    <span>Customer: <span className="font-semibold text-indigo-600">{s.customerName}</span></span>
                                  )}
                                  {s.notes && (
                                    <span>Note: <span className="italic text-slate-600">"{s.notes}"</span></span>
                                  )}
                                </div>

                                {/* Items table */}
                                <div>
                                  <p className="text-xs font-bold text-slate-600 mb-2">Line Items</p>
                                  <table className="w-full text-xs bg-white rounded-xl overflow-hidden border border-slate-100">
                                    <thead className="bg-slate-100">
                                      <tr>
                                        <th className="text-left   px-3 py-2 text-slate-500 font-semibold w-8">#</th>
                                        <th className="text-left   px-3 py-2 text-slate-500 font-semibold">Product</th>
                                        <th className="text-left   px-3 py-2 text-slate-500 font-semibold">Flavour</th>
                                        <th className="text-right  px-3 py-2 text-slate-500 font-semibold w-20">Qty</th>
                                        <th className="text-right  px-3 py-2 text-slate-500 font-semibold w-24">Unit Price</th>
                                        <th className="text-right  px-3 py-2 text-slate-500 font-semibold w-24">Total</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {s.items.map((item, i) => (
                                        <tr key={item.id} className="border-t border-slate-50 hover:bg-slate-50/60">
                                          <td className="px-3 py-2 text-slate-400">{i + 1}</td>
                                          <td className="px-3 py-2 font-semibold text-slate-700">{item.productName}</td>
                                          <td className="px-3 py-2 text-indigo-500 font-medium">{item.flavour || '—'}</td>
                                          <td className="px-3 py-2 text-right text-slate-700 font-medium">{item.quantity.toLocaleString()}</td>
                                          <td className="px-3 py-2 text-right text-slate-700">{fmt(item.unitPrice)}</td>
                                          <td className="px-3 py-2 text-right font-bold text-slate-800">{fmt(item.totalPrice)}</td>
                                        </tr>
                                      ))}
                                      <tr className="border-t-2 border-slate-200 bg-slate-50/80">
                                        <td colSpan={5} className="px-3 py-2.5 text-right text-xs font-bold text-slate-500 uppercase tracking-wide">Grand Total</td>
                                        <td className="px-3 py-2.5 text-right text-sm font-black text-slate-800">{fmt(s.totalAmount)}</td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>

                                {/* Ledger entries */}
                                {shipLedger.length > 0 && (
                                  <div>
                                    <p className="text-xs font-bold text-slate-600 mb-2">Ledger Entries</p>
                                    <div className="flex flex-wrap gap-2">
                                      {shipLedger.map(l => (
                                        <div key={l.id} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold ${LEDGER_CFG[l.type]}`}>
                                          {l.type} {fmt(l.amount)} — {l.description}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-2">
                                  {s.status === 'Draft' && (
                                    <button onClick={() => confirmDraft(s.id)}
                                      className="px-3 py-1.5 bg-emerald-500 text-white text-xs font-semibold rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-1">
                                      <CheckCircle className="h-3 w-3" /> Confirm Draft
                                    </button>
                                  )}
                                  {s.status !== 'Cancelled' && (
                                    <button onClick={() => { if (window.confirm('Cancel this shipment?')) cancelShipment(s.id); }}
                                      className="px-3 py-1.5 bg-rose-50 text-rose-600 text-xs font-semibold rounded-lg hover:bg-rose-100 transition-colors flex items-center gap-1">
                                      <XCircle className="h-3 w-3" /> Cancel
                                    </button>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB: Record New ─────────────────────────────────────────────────── */}
      {tab === 'record' && (
        <div className="space-y-5">
          {/* Section 1: Shipment info */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4">
            <p className="text-sm font-bold text-slate-700 flex items-center gap-2"><Truck className="h-4 w-4 text-indigo-400" /> Shipment Info</p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Supplier *</label>
                <select value={supplierId} onChange={e => setSupplierId(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                  <option value="">Select supplier...</option>
                  {SUPPLIERS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Date *</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Payment Type</label>
                <div className="flex gap-2">
                  {(['Paid', 'Credit'] as PaymentType[]).map(pt => (
                    <button key={pt} onClick={() => setPaymentType(pt)}
                      className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-colors ${paymentType === pt ? (pt === 'Paid' ? 'bg-blue-500 text-white border-blue-500' : 'bg-purple-500 text-white border-purple-500') : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}>
                      {pt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Notes</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Optional notes..."
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
            </div>

            {/* Payment type info */}
            <div className={`p-3 rounded-xl text-xs ${paymentType === 'Paid' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'}`}>
              {paymentType === 'Paid'
                ? '→ Will generate CREDIT (stock in) + DEBIT (cash out) ledger entries'
                : '→ Will generate CREDIT (stock in) only — payment pending'}
            </div>
          </div>

          {/* Section 2: Line items */}
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <p className="text-sm font-bold text-slate-700 flex items-center gap-2"><Package className="h-4 w-4 text-indigo-400" /> Products</p>
              <button onClick={() => setShowImporter(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
                <Upload className="h-3.5 w-3.5" /> Import CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    {['#', 'Product', 'Flavour', 'Qty', 'Unit Price', 'Total', ''].map(h => (
                      <th key={h} className="text-left px-3 py-2.5 text-xs font-semibold text-slate-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <LineItemRow key={row.id} item={row} index={i} onChange={updateRow} onRemove={removeRow} canRemove={rows.length > 1} />
                  ))}
                </tbody>
                <tfoot className="border-t-2 border-slate-200 bg-slate-50">
                  <tr>
                    <td colSpan={5} className="px-3 py-3 text-right text-sm font-bold text-slate-600">Grand Total</td>
                    <td className="px-3 py-3 text-right text-lg font-black text-slate-800">{fmt(grandTotal)}</td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
            <div className="px-5 py-3 border-t border-slate-100">
              <button onClick={addRow}
                className="flex items-center gap-1.5 text-xs font-semibold text-indigo-500 hover:text-indigo-700 transition-colors">
                <Plus className="h-3.5 w-3.5" /> Add Row
              </button>
            </div>
          </div>

          {/* Error */}
          {formError && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl">
              <AlertTriangle className="h-4 w-4 text-rose-500 flex-shrink-0" />
              <p className="text-sm text-rose-600 font-medium">{formError}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button onClick={resetForm} className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700 font-semibold">Reset</button>
            <div className="flex gap-3">
              <button onClick={handleSaveDraft}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-200 transition-colors flex items-center gap-1.5">
                <FileText className="h-4 w-4" /> Save Draft
              </button>
              <button onClick={handleRecord}
                className="px-6 py-2 bg-indigo-500 text-white text-sm font-semibold rounded-xl hover:bg-indigo-600 transition-colors flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4" /> Confirm & Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: Ledger ─────────────────────────────────────────────────────── */}
      {tab === 'ledger' && (
        <div className="space-y-4">
          {/* Ledger summary */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
              <p className="text-xl font-black text-emerald-700">{fmt(totalCredit)}</p>
              <p className="text-xs text-emerald-600 mt-0.5">Total CREDIT (stock in)</p>
            </div>
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100">
              <p className="text-xl font-black text-rose-700">{fmt(totalDebit)}</p>
              <p className="text-xs text-rose-600 mt-0.5">Total DEBIT (cash out)</p>
            </div>
            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
              <p className="text-xl font-black text-indigo-700">{fmt(totalCredit - totalDebit)}</p>
              <p className="text-xs text-indigo-600 mt-0.5">Net Balance</p>
            </div>
          </div>

          {/* Ledger filters */}
          <div className="flex gap-2">
            <select value={ledgerSupplier} onChange={e => setLedgerSupplier(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
              <option value="">All Suppliers</option>
              {SUPPLIERS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <select value={ledgerType} onChange={e => setLedgerType(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
              <option value="">CREDIT + DEBIT</option>
              <option value="CREDIT">CREDIT only</option>
              <option value="DEBIT">DEBIT only</option>
            </select>
          </div>

          {/* Ledger table */}
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {['ID', 'Shipment', 'Supplier', 'Type', 'Amount', 'Description', 'Date'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredLedger.length === 0 ? (
                  <tr><td colSpan={7} className="px-4 py-10 text-center text-sm text-slate-400">No entries found</td></tr>
                ) : (
                  filteredLedger.map(l => (
                    <tr key={l.id} className="border-b border-slate-50 hover:bg-slate-50/60">
                      <td className="px-4 py-3 text-xs font-mono text-slate-500">{l.id}</td>
                      <td className="px-4 py-3 text-xs font-bold text-indigo-600">{l.shipmentId}</td>
                      <td className="px-4 py-3 text-xs text-slate-700">{l.supplierName}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${LEDGER_CFG[l.type]}`}>{l.type}</span>
                      </td>
                      <td className="px-4 py-3 text-xs font-bold text-slate-800">{fmt(l.amount)}</td>
                      <td className="px-4 py-3 text-xs text-slate-500">{l.description}</td>
                      <td className="px-4 py-3 text-xs text-slate-400">{l.date}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Line items importer */}
      {showImporter && <ExcelImporter onImport={handleImport} onClose={() => setShowImporter(false)} />}

      {/* Full shipment importer */}
      {showShipmentImporter && (
        <ShipmentImporter
          onImport={handleFullShipmentImport}
          onClose={() => setShowShipmentImporter(false)}
        />
      )}
    </div>
  );
};

export default ShipmentsPage;
