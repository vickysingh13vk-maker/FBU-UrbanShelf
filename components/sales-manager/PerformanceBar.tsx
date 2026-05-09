import React from 'react';

interface Props {
  label: string;
  value: number;
  target: number;
  prefix?: string;
  suffix?: string;
  colorClass?: string;
}

const PerformanceBar: React.FC<Props> = ({ label, value, target, prefix = '', suffix = '', colorClass = 'bg-indigo-500' }) => {
  const pct = target > 0 ? Math.min(100, Math.round((value / target) * 100)) : 0;
  const overTarget = pct >= 100;

  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="text-slate-600 font-medium">{label}</span>
        <span className={`font-bold ${overTarget ? 'text-emerald-600' : 'text-slate-700'}`}>
          {prefix}{typeof value === 'number' && value > 1000 ? value.toLocaleString() : value}{suffix}
          <span className="text-slate-400 font-normal"> / {prefix}{target.toLocaleString()}{suffix}</span>
        </span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${overTarget ? 'bg-emerald-500' : colorClass} rounded-full transition-all`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-slate-400 mt-0.5 text-right">{pct}%</p>
    </div>
  );
};

export default PerformanceBar;
