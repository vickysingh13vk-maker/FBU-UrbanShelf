import React from 'react';
import { AlertCircle, Landmark, FileDown } from 'lucide-react';
import { Button, Drawer } from '../ui';
import { TRANSACTION_STATUS_CONFIG } from '../../constants/supplierStatus';
import { SupplierTransaction } from '../../types';

const TransactionDetails: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  transaction: SupplierTransaction | null;
}> = ({ isOpen, onClose, transaction }) => {
  if (!transaction) return null;

  const statusStyleMap: Record<string, { color: string; bg: string }> = {
    Paid: { color: 'text-emerald-500', bg: 'bg-emerald-50' },
    Processing: { color: 'text-indigo-500', bg: 'bg-indigo-50' },
    Pending: { color: 'text-amber-500', bg: 'bg-amber-50' },
    Failed: { color: 'text-rose-500', bg: 'bg-rose-50' },
  };

  const statusEntry = TRANSACTION_STATUS_CONFIG[transaction.status];
  const config = {
    icon: statusEntry?.icon ?? AlertCircle,
    color: statusStyleMap[transaction.status]?.color ?? 'text-slate-500',
    bg: statusStyleMap[transaction.status]?.bg ?? 'bg-slate-50',
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Transaction Details"
      size="md"
    >
      <div className="space-y-5">
        {/* Status Header */}
        <div className={`p-6 rounded-2xl ${config.bg} flex flex-col items-center text-center`}>
          <div className={`p-3 rounded-full bg-white shadow-sm mb-4 ${config.color}`}>
            <config.icon className="h-8 w-8" />
          </div>
          <h4 className={`text-xl font-black ${config.color}`}>{transaction.status}</h4>
          <p className="text-sm font-bold text-slate-500 mt-1">Transaction ID: {transaction.id}</p>
        </div>

        {/* Transaction Info */}
        <div className="space-y-6">
          <h5 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Transaction Information</h5>
          <div className="grid grid-cols-2 gap-y-6">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Order ID</p>
              <p className="text-sm font-black text-slate-900">{transaction.orderId}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Transaction Date</p>
              <p className="text-sm font-black text-slate-900">{transaction.date}</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Product / SKU</p>
              <p className="text-sm font-black text-slate-900">{transaction.product}</p>
              <p className="text-xs font-bold text-slate-500 font-mono mt-0.5">{transaction.sku}</p>
            </div>
          </div>
        </div>

        {/* Financial Breakdown */}
        <div className="space-y-4">
          <h5 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Financial Breakdown</h5>
          <div className="p-4 rounded-xl border border-slate-100 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-slate-500">Gross Revenue</span>
              <span className="text-sm font-black text-slate-900">£{transaction.revenue.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-slate-500">Platform Commission (20%)</span>
              <span className="text-sm font-black text-rose-500">-£{transaction.commission.toFixed(2)}</span>
            </div>
            <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
              <span className="text-base font-black text-slate-900">Net Amount</span>
              <span className="text-base font-black text-emerald-600">£{transaction.netAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="space-y-4">
          <h5 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Payment Information</h5>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center text-slate-600 shadow-sm">
              <Landmark className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-black text-slate-900">{transaction.method}</p>
              <p className="text-xs font-bold text-slate-500">Payout Date: {transaction.date}</p>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <Button variant="outline" className="w-full py-4 font-bold" icon={<FileDown className="h-4 w-4" />}>
            Download Receipt
          </Button>
        </div>
      </div>
    </Drawer>
  );
};

export default TransactionDetails;
