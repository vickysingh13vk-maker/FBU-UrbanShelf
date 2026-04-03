import React from 'react';
import { PoundSterling, ShoppingCart, Package, TrendingUp, TrendingDown, Wallet, Box, Warehouse } from 'lucide-react';
import { motion } from 'motion/react';

export interface DashboardKPIsProps {
  revenue: string;
  orders: string;
  unitsSold: string;
  pendingPayout: string;
  activeSKUs: string;
  stockValue: string;
  growth: number;
}

const DashboardKPIs: React.FC<DashboardKPIsProps> = ({ revenue, orders, unitsSold, pendingPayout, activeSKUs, stockValue, growth }) => {
  const isPositive = growth >= 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {/* Revenue — gradient hero */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
        className="col-span-2 sm:col-span-1">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-700 p-4 text-white shadow-lg shadow-indigo-500/20 h-full">
          <div className="absolute -right-3 -top-3 opacity-10"><PoundSterling className="h-20 w-20" /></div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-200">Revenue</p>
          <p className="mt-1 text-2xl font-black tracking-tight">{revenue}</p>
          <div className="mt-2 flex items-center gap-1.5">
            <span className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${isPositive ? 'bg-emerald-400/20 text-emerald-200' : 'bg-rose-400/20 text-rose-200'}`}>
              {isPositive ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
              {isPositive ? '+' : ''}{growth.toFixed(1)}%
            </span>
          </div>
        </div>
      </motion.div>

      {/* Secondary KPIs */}
      {[
        { label: 'Pending Payout', value: pendingPayout, icon: Wallet, accent: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Orders', value: orders, icon: ShoppingCart, accent: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Units Sold', value: unitsSold, icon: Package, accent: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Active SKUs', value: activeSKUs, icon: Box, accent: 'text-violet-600', bg: 'bg-violet-50' },
        { label: 'Stock Value', value: stockValue, icon: Warehouse, accent: 'text-slate-600', bg: 'bg-slate-100' },
      ].map((kpi, i) => (
        <motion.div key={kpi.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.04 * (i + 1) }}>
          <div className="rounded-2xl border border-slate-100 bg-white p-4 hover:shadow-md hover:border-slate-200 transition-all h-full">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">{kpi.label}</p>
              <div className={`rounded-lg ${kpi.bg} p-1.5 ${kpi.accent}`}>
                <kpi.icon className="h-3.5 w-3.5" />
              </div>
            </div>
            <p className={`mt-2 text-xl font-black tracking-tight ${kpi.label === 'Pending Payout' ? 'text-amber-600' : 'text-slate-900'}`}>{kpi.value}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardKPIs;
