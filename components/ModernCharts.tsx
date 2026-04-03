import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';

export const MODERN_COLORS = {
  primary: '#2666B5',
  secondary: '#6366f1',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
  neutral: '#94a3b8',
};

interface ChartProps {
  data: any[];
  dataKey?: string;
  name?: string;
  color?: string;
  height?: number | string;
  layout?: 'horizontal' | 'vertical';
}

export const ModernAreaChart: React.FC<ChartProps> = ({ 
  data, 
  dataKey = 'value', 
  name, 
  color = MODERN_COLORS.primary,
  height = '100%' 
}) => (
  <ResponsiveContainer width="100%" height={height}>
    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
      <defs>
        <linearGradient id={`color${dataKey}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
          <stop offset="95%" stopColor={color} stopOpacity={0}/>
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
      <XAxis 
        dataKey="name" 
        axisLine={false} 
        tickLine={false} 
        tick={{ fill: '#94a3b8', fontSize: 12 }}
        dy={10}
      />
      <YAxis 
        axisLine={false} 
        tickLine={false} 
        tick={{ fill: '#94a3b8', fontSize: 12 }}
      />
      <Tooltip 
        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
        itemStyle={{ color: '#fff' }}
      />
      <Area 
        type="monotone" 
        dataKey={dataKey} 
        name={name} 
        stroke={color} 
        fillOpacity={1} 
        fill={`url(#color${dataKey})`} 
        strokeWidth={3}
      />
    </AreaChart>
  </ResponsiveContainer>
);

export const ModernBarChart: React.FC<ChartProps> = ({ 
  data, 
  dataKey = 'value', 
  name, 
  color = MODERN_COLORS.primary,
  height = '100%',
  layout = 'horizontal'
}) => (
  <ResponsiveContainer width="100%" height={height}>
    <BarChart 
      data={data} 
      layout={layout as 'horizontal' | 'vertical'}
      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
    >
      <CartesianGrid strokeDasharray="3 3" vertical={layout === 'vertical'} horizontal={layout === 'horizontal'} stroke="#1e293b" />
      {layout === 'horizontal' ? (
        <>
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
        </>
      ) : (
        <>
          <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} width={100} />
        </>
      )}
      <Tooltip 
        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
        itemStyle={{ color: '#fff' }}
      />
      <Bar 
        dataKey={dataKey} 
        name={name} 
        fill={color} 
        radius={layout === 'horizontal' ? [4, 4, 0, 0] : [0, 4, 4, 0]} 
        barSize={20}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color || color} />
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
);

export const ModernDonutChart: React.FC<{ data: any[], height?: number | string }> = ({ 
  data, 
  height = '100%' 
}) => (
  <ResponsiveContainer width="100%" height={height}>
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        innerRadius={60}
        outerRadius={80}
        paddingAngle={5}
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color || MODERN_COLORS.primary} />
        ))}
      </Pie>
      <Tooltip 
        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
        itemStyle={{ color: '#fff' }}
      />
      <Legend 
        verticalAlign="bottom" 
        align="center"
        iconType="circle"
        formatter={(value) => <span className="text-xs text-slate-400 font-medium">{value}</span>}
      />
    </PieChart>
  </ResponsiveContainer>
);
