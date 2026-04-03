import React from 'react';
import { motion } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Card } from '../ui';
import { Info } from 'lucide-react';

interface InventoryHoverTooltipProps {
  data: {
    product: string;
    total: number;
    flavours?: { name: string; stock: number; health: string }[];
  } | null;
}

export const InventoryHoverTooltip = ({ data }: InventoryHoverTooltipProps) => {
  if (!data || !data.flavours) return null;

  const COLORS = {
    green: '#10b981',
    amber: '#f59e0b',
    red: '#f43f5e'
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-2xl border border-slate-100 min-w-[320px] z-[100]">
      <div className="space-y-1 mb-4">
        <p className="text-sm font-bold text-slate-900">{data.product}</p>
        <p className="text-[11px] font-medium text-slate-500">
          Total Stock: <span className="text-slate-900 font-bold">{(data?.total || 0).toLocaleString()}</span> units
        </p>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="w-[100px] h-[100px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.flavours}
                cx="50%"
                cy="50%"
                innerRadius={25}
                outerRadius={45}
                paddingAngle={2}
                dataKey="stock"
                stroke="none"
              >
                {data.flavours.map((entry: { name: string; stock: number; health: string }, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.health as keyof typeof COLORS] || '#94a3b8'} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-1.5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-50 pb-1 mb-2">Flavour Breakdown</p>
          {data.flavours.map((f: { name: string; stock: number; health: string }) => (
            <div key={f.name} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className={`h-1.5 w-1.5 rounded-full ${
                  f.health === 'green' ? 'bg-emerald-500' : 
                  f.health === 'amber' ? 'bg-amber-500' : 'bg-rose-500'
                }`} />
                <span className="text-[11px] font-medium text-slate-600 truncate max-w-[120px]">{f.name}</span>
              </div>
              <span className="text-[11px] font-bold text-slate-900 tabular-nums">{(f?.stock || 0).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const KpiBlock = ({ 
  title, 
  icon: Icon, 
  metrics, 
  color = 'indigo',
  tooltip,
  footer
}: { 
  title: string, 
  icon: React.ComponentType<{ className?: string }>,
  metrics: { 
    label: string, 
    value: string, 
    trend?: { value: string, isPositive: boolean } 
  }[],
  color?: string,
  tooltip?: string,
  footer?: React.ReactNode
}) => {
  const colorMap: Record<string, string> = {
    indigo: 'text-indigo-600 bg-indigo-50/50',
    emerald: 'text-emerald-600 bg-emerald-50/50',
    amber: 'text-amber-600 bg-amber-50/50',
    rose: 'text-rose-600 bg-rose-50/50',
    blue: 'text-blue-600 bg-blue-50/50',
    slate: 'text-slate-600 bg-slate-50/50',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="h-full"
    >
      <Card padding="none" className="h-full overflow-hidden flex flex-col hover:shadow-lg transition-all border-slate-100 group bg-white">
        {/* Header */}
        <div className="p-[12px_18px] border-b border-slate-50 flex items-center justify-between bg-white group-hover:bg-slate-50/30 transition-colors">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${colorMap[color]} group-hover:scale-110 transition-transform duration-300`}>
              <Icon className="h-4 w-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 tracking-tight">{title}</h4>
          </div>
          {tooltip && (
            <div className="relative group/tip">
              <Info className="h-3.5 w-3.5 text-slate-300 hover:text-indigo-500 transition-colors cursor-help" />
              <div className="absolute right-0 bottom-full mb-2 hidden group-hover/tip:block z-50">
                <div className="bg-slate-900 text-white text-[10px] font-medium p-2 rounded-lg shadow-xl min-w-[180px] leading-relaxed">
                  {tooltip}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Metrics */}
        <div className="p-[18px] flex-1">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            {metrics.map((metric, idx) => (
              <div key={idx} className="flex flex-col gap-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{metric.label}</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-lg font-black text-slate-900 tracking-tight leading-none">{metric.value}</p>
                  {metric.trend && (
                    <span className={`text-[10px] font-bold ${metric.trend.isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {metric.trend.isPositive ? '▲' : '▼'} {metric.trend.value}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {footer && (
          <div className="p-[12px_18px] bg-slate-50/50 border-t border-slate-50">
            {footer}
          </div>
        )}
      </Card>
    </motion.div>
  );
};
