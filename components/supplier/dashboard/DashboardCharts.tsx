import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  TrendingUp,
  Warehouse,
} from 'lucide-react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { Card } from '../../ui/Card';
import { InventoryHoverTooltip } from '../SupplierComponents';
import { InventoryStockItem } from '../../../mock/supplierDashboard';

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface DashboardChartsProps {
  chartData: ChartDataPoint[];
  inventoryStockData: InventoryStockItem[];
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({ chartData, inventoryStockData }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Sales Trend Chart */}
      <Card padding="none" className="flex flex-col p-5 hover:shadow-lg transition-all duration-300 border-slate-100 bg-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-indigo-500" />
              Sales Trend
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Revenue performance across all categories</p>
          </div>
        </div>
        <div className="flex-1 h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                tickFormatter={(value) => `£${value >= 1000 ? (value/1000).toFixed(1) + 'k' : value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  borderRadius: '16px',
                  border: 'none',
                  boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                  padding: '12px'
                }}
                itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                formatter={(value: number) => [`£${(value || 0).toLocaleString()}`, 'Sales']}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#6366f1"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorSales)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Inventory Stock Overview */}
      <Card padding="none" className="flex flex-col p-5 hover:shadow-lg transition-all duration-300 border-slate-100 bg-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Warehouse className="h-4 w-4 text-indigo-500" />
              Inventory Stock Overview
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Stock levels per product. Hover for breakdown.</p>
          </div>
          <Link to="/supplier/inventory" className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors uppercase tracking-wider">Manage Inventory</Link>
        </div>

        <div className="flex-1 space-y-4">
          {inventoryStockData.map((item) => {
            const ratio = item.total / item.required;
            let barColor = 'bg-emerald-500';
            let glowColor = 'shadow-[0_0_10px_rgba(16,185,129,0.3)]';
            if (ratio <= 0.15) {
              barColor = 'bg-rose-500';
              glowColor = 'shadow-[0_0_10px_rgba(244,63,94,0.3)]';
            } else if (ratio <= 0.35) {
              barColor = 'bg-amber-500';
              glowColor = 'shadow-[0_0_10px_rgba(245,158,11,0.3)]';
            }

            return (
              <div key={item.product} className="flex items-center gap-4 group/row relative">
                <span className="text-xs text-slate-600 font-bold w-48 text-right truncate group-hover/row:text-slate-900 transition-colors" title={item.product}>{item.product}</span>
                <div className="flex-1 h-3 bg-slate-100 rounded-full relative overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, ratio * 100)}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full rounded-full ${barColor} ${glowColor} transition-all duration-500`}
                  />
                </div>
                <span className="text-[11px] font-bold text-slate-400 w-12 text-right tabular-nums">{(item?.total || 0).toLocaleString()}</span>

                {/* Tooltip on hover */}
                <div className="absolute left-48 bottom-full mb-2 hidden group-hover/row:block z-50">
                  <InventoryHoverTooltip data={item} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center">
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Healthy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Low</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Critical</span>
            </div>
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-md">Target: 30% Buffer</span>
        </div>

        {/* STOCK RISK INDICATOR PANEL */}
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-100">
            <p className="text-[10px] font-bold text-rose-600 uppercase tracking-wider mb-1">Critical Stock</p>
            <p className="text-xl font-bold text-rose-700">12 <span className="text-xs font-medium">SKUs</span></p>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-100">
            <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-1">Low Stock</p>
            <p className="text-xl font-bold text-amber-700">38 <span className="text-xs font-medium">SKUs</span></p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1">Overstock</p>
            <p className="text-xl font-bold text-emerald-700">9 <span className="text-xs font-medium">SKUs</span></p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DashboardCharts;
