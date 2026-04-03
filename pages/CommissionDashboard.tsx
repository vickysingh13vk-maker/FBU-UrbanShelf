import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Award, Wallet, Clock, AlertCircle, ChevronRight, 
  ArrowLeft, Search, Filter, Info, CheckCircle2,
  XCircle, DollarSign, TrendingUp, Calendar,
  ArrowUpRight, ArrowDownRight, Target, ShieldCheck
} from 'lucide-react';
import { Card, Button, Badge } from '../components/ui';
import { useNavigate } from 'react-router-dom';

const MOCK_COMMISSIONS = [
  { id: '#326', customer: 'London Vape Hub', amount: 1988, commission: 99.4, status: 'Pending', date: '2026-03-21', reason: 'Awaiting customer payment' },
  { id: '#325', customer: 'Manchester VS', amount: 840, commission: 42.0, status: 'Earned', date: '2026-03-20', reason: 'Payment received' },
  { id: '#324', customer: 'Birmingham WS', amount: 1320, commission: 66.0, status: 'Blocked', date: '2026-03-19', reason: 'Order disputed by customer' },
  { id: '#323', customer: 'Glasgow Dist.', amount: 490, commission: 24.5, status: 'Earned', date: '2026-03-18', reason: 'Payment received' },
  { id: '#322', customer: 'Leeds C&C', amount: 2100, commission: 105.0, status: 'Pending', date: '2026-03-17', reason: 'Awaiting customer payment' },
  { id: '#321', customer: 'Bristol Vape', amount: 1540, commission: 77.0, status: 'Blocked', date: '2026-03-16', reason: 'High return rate on this order' },
];

const CommissionDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'Earned' | 'Pending' | 'Blocked'>('Earned');
  const [selectedCommission, setSelectedCommission] = useState<typeof MOCK_COMMISSIONS[0] | null>(null);

  const filteredCommissions = MOCK_COMMISSIONS.filter(c => c.status === activeTab);

  const totalEarned = MOCK_COMMISSIONS.filter(c => c.status === 'Earned').reduce((acc, curr) => acc + curr.commission, 0);
  const totalPending = MOCK_COMMISSIONS.filter(c => c.status === 'Pending').reduce((acc, curr) => acc + curr.commission, 0);
  const totalBlocked = MOCK_COMMISSIONS.filter(c => c.status === 'Blocked').reduce((acc, curr) => acc + curr.commission, 0);

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 bg-white rounded-xl border border-slate-200 shadow-sm thumb-button"
        >
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </button>
        <div>
          <h1 className="text-xl font-extrabold text-primary tracking-tight">Commission Dashboard</h1>
          <p className="text-xs text-slate-500 font-medium">Track your earnings and targets</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
          <p className="text-[8px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Earned</p>
          <p className="text-sm font-black text-emerald-700">£{totalEarned.toFixed(2)}</p>
        </div>
        <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100 text-center">
          <p className="text-[8px] font-bold text-amber-600 uppercase tracking-widest mb-1">Pending</p>
          <p className="text-sm font-black text-amber-700">£{totalPending.toFixed(2)}</p>
        </div>
        <div className="p-3 bg-rose-50 rounded-2xl border border-rose-100 text-center">
          <p className="text-[8px] font-bold text-rose-600 uppercase tracking-widest mb-1">Blocked</p>
          <p className="text-sm font-black text-rose-700">£{totalBlocked.toFixed(2)}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
        {(['Earned', 'Pending', 'Blocked'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === tab 
                ? 'bg-white text-primary shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Commission List */}
      <div className="space-y-3">
        {filteredCommissions.map((c) => (
          <motion.div 
            key={c.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => setSelectedCommission(c)}
            className="sales-card p-4 flex items-center justify-between cursor-pointer thumb-button"
          >
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                activeTab === 'Earned' ? 'bg-emerald-50 text-emerald-600' :
                activeTab === 'Pending' ? 'bg-amber-50 text-amber-600' :
                'bg-rose-50 text-rose-600'
              }`}>
                {activeTab === 'Earned' ? <CheckCircle2 className="h-5 w-5" /> :
                 activeTab === 'Pending' ? <Clock className="h-5 w-5" /> :
                 <AlertCircle className="h-5 w-5" />}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 leading-tight">{c.customer}</h4>
                <p className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                  Order {c.id} • {new Date(c.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-black text-slate-900">£{c.commission.toFixed(2)}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Commission</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedCommission && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-white w-full max-w-md rounded-t-[32px] p-8 shadow-2xl relative"
            >
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-8"></div>
              
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-black text-slate-900 leading-tight">{selectedCommission.customer}</h3>
                  <p className="text-sm text-slate-500 font-medium">Order {selectedCommission.id}</p>
                </div>
                <Badge 
                  variant={selectedCommission.status === 'Earned' ? 'success' : selectedCommission.status === 'Pending' ? 'warning' : 'danger'}
                  className="px-3 py-1 text-xs uppercase tracking-widest"
                >
                  {selectedCommission.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Order Value</p>
                  <p className="text-lg font-black text-slate-900">£{selectedCommission.amount.toFixed(2)}</p>
                </div>
                <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                  <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Commission</p>
                  <p className="text-lg font-black text-indigo-600">£{selectedCommission.commission.toFixed(2)}</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <Info className="h-5 w-5 text-slate-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-slate-900 mb-0.5">Status Reason</p>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">{selectedCommission.reason}</p>
                  </div>
                </div>
              </div>

              <Button 
                variant="primary" 
                className="w-full py-4 text-sm font-bold bg-primary hover:bg-primary-light border-none shadow-xl shadow-primary/20 rounded-2xl"
                onClick={() => setSelectedCommission(null)}
              >
                Close Details
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommissionDashboard;
