import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card } from './Card';

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: 'blue' | 'amber' | 'emerald' | 'indigo' | 'rose' | 'violet' | 'slate';
  trend?: {
    value: string;
    isPositive: boolean;
  };
  onClick?: () => void;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  icon: Icon,
  color = 'indigo',
  trend,
  onClick
}) => {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-500',
    amber: 'bg-amber-50 text-amber-500',
    emerald: 'bg-emerald-50 text-emerald-500',
    indigo: 'bg-indigo-50 text-indigo-500',
    rose: 'bg-rose-50 text-rose-500',
    violet: 'bg-violet-50 text-violet-500',
    slate: 'bg-slate-100 text-slate-500',
  };

  return (
    <Card
      className={`group hover:shadow-md hover:border-slate-200 transition-all h-full ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{title}</p>
        <div className={`rounded-lg p-1.5 ${colorMap[color]}`}>
          <Icon className="h-3.5 w-3.5" />
        </div>
      </div>
      <div className="flex items-baseline gap-2 mt-2">
        <p className="text-xl font-black text-slate-900 tracking-tight">{value}</p>
        {trend && (
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${trend.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
            {trend.isPositive ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>
    </Card>
  );
};

interface StatBoxProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  color?: 'slate' | 'emerald' | 'amber' | 'indigo' | 'violet' | 'rose';
}

export const StatBox: React.FC<StatBoxProps> = ({ label, value, icon: Icon, color = 'slate' }) => {
  const styles = {
    slate: 'bg-slate-50 border-slate-200 text-slate-900',
    emerald: 'bg-emerald-50 border-emerald-100 text-emerald-700',
    amber: 'bg-amber-50 border-amber-100 text-amber-700',
    indigo: 'bg-indigo-50 border-indigo-100 text-indigo-700',
    violet: 'bg-violet-50 border-violet-100 text-violet-700',
    rose: 'bg-rose-50 border-rose-100 text-rose-700',
  };

  return (
    <div className={`p-4 rounded-xl border transition-all hover:shadow-sm ${styles[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xl font-black tracking-tight">{value}</div>
          <div className="text-[11px] font-bold uppercase tracking-widest opacity-70 mt-1">{label}</div>
        </div>
        {Icon && (
          <div className="p-1.5 rounded-lg bg-white/50">
            <Icon className="h-3.5 w-3.5" />
          </div>
        )}
      </div>
    </div>
  );
};
