import React, { createContext, useContext, useState, useCallback } from 'react';
import { InboundShipment, LedgerEntry, ShipmentItem, PaymentType, ShipmentStatus } from '../types';
import { INBOUND_SHIPMENTS, LEDGER_ENTRIES } from '../data';

let shipSeq = 6;
let ledSeq = 7;
const nextShipId = () => `SHIP-${String(shipSeq++).padStart(3, '0')}`;
const nextLedId  = () => `LED-${String(ledSeq++).padStart(3, '0')}`;
const nextItemId = (shipId: string, idx: number) => `${shipId}-SI-${idx + 1}`;

interface ShipmentContextValue {
  shipments: InboundShipment[];
  ledger: LedgerEntry[];
  getShipment: (id: string) => InboundShipment | undefined;
  getShipmentsBySupplier: (supplierId: string) => InboundShipment[];
  getLedgerForShipment: (shipmentId: string) => LedgerEntry[];
  getSupplierBalance: (supplierId: string) => { credit: number; debit: number; net: number };
  recordShipment: (draft: Omit<InboundShipment, 'id' | 'createdAt' | 'status'>) => string;
  saveDraft: (draft: Omit<InboundShipment, 'id' | 'createdAt' | 'status'>) => string;
  confirmDraft: (id: string) => void;
  cancelShipment: (id: string) => void;
}

const ShipmentContext = createContext<ShipmentContextValue | null>(null);

export const ShipmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [shipments, setShipments] = useState<InboundShipment[]>(INBOUND_SHIPMENTS);
  const [ledger, setLedger] = useState<LedgerEntry[]>(LEDGER_ENTRIES);

  const generateLedger = useCallback((s: InboundShipment): LedgerEntry[] => {
    const base = { shipmentId: s.id, date: s.date, supplierId: s.supplierId, supplierName: s.supplierName, customerId: s.customerId, customerName: s.customerName };
    const entries: LedgerEntry[] = [
      { ...base, id: nextLedId(), type: 'CREDIT', amount: s.totalAmount, description: `Stock received from ${s.supplierName}` },
    ];
    if (s.paymentType === 'Paid') {
      entries.push({ ...base, id: nextLedId(), type: 'DEBIT', amount: s.totalAmount, description: `Payment made to ${s.supplierName}` });
    }
    return entries;
  }, []);

  const getShipment = useCallback((id: string) => shipments.find(s => s.id === id), [shipments]);
  const getShipmentsBySupplier = useCallback((sid: string) => shipments.filter(s => s.supplierId === sid), [shipments]);
  const getLedgerForShipment = useCallback((sid: string) => ledger.filter(l => l.shipmentId === sid), [ledger]);
  const getSupplierBalance = useCallback((sid: string) => {
    const entries = ledger.filter(l => l.supplierId === sid);
    const credit = entries.filter(l => l.type === 'CREDIT').reduce((s, l) => s + l.amount, 0);
    const debit  = entries.filter(l => l.type === 'DEBIT').reduce((s, l) => s + l.amount, 0);
    return { credit, debit, net: credit - debit };
  }, [ledger]);

  const recordShipment = useCallback((draft: Omit<InboundShipment, 'id' | 'createdAt' | 'status'>) => {
    const id = nextShipId();
    const shipment: InboundShipment = { ...draft, id, status: 'Confirmed', createdAt: new Date().toISOString() };
    setShipments(prev => [shipment, ...prev]);
    setLedger(prev => [...prev, ...generateLedger(shipment)]);
    return id;
  }, [generateLedger]);

  const saveDraft = useCallback((draft: Omit<InboundShipment, 'id' | 'createdAt' | 'status'>) => {
    const id = nextShipId();
    const shipment: InboundShipment = { ...draft, id, status: 'Draft', createdAt: new Date().toISOString() };
    setShipments(prev => [shipment, ...prev]);
    return id;
  }, []);

  const confirmDraft = useCallback((id: string) => {
    setShipments(prev => prev.map(s => s.id === id ? { ...s, status: 'Confirmed' } : s));
    const s = shipments.find(sh => sh.id === id);
    if (s) setLedger(prev => [...prev, ...generateLedger({ ...s, status: 'Confirmed' })]);
  }, [shipments, generateLedger]);

  const cancelShipment = useCallback((id: string) => {
    setShipments(prev => prev.map(s => s.id === id ? { ...s, status: 'Cancelled' } : s));
  }, []);

  return (
    <ShipmentContext.Provider value={{ shipments, ledger, getShipment, getShipmentsBySupplier, getLedgerForShipment, getSupplierBalance, recordShipment, saveDraft, confirmDraft, cancelShipment }}>
      {children}
    </ShipmentContext.Provider>
  );
};

export const useShipment = () => {
  const ctx = useContext(ShipmentContext);
  if (!ctx) throw new Error('useShipment must be used inside ShipmentProvider');
  return ctx;
};
