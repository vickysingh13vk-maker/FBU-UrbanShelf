import React from 'react';
import { CartesianGrid, Tooltip } from 'recharts';

// ---------------------------------------------------------------------------
// Reusable CartesianGrid with standard styling
// ---------------------------------------------------------------------------
export const StandardGrid = () => (
  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
);

// ---------------------------------------------------------------------------
// Reusable Tooltip with standard styling
// ---------------------------------------------------------------------------
export const StandardTooltip = (props?: any) => (
  <Tooltip
    contentStyle={{
      borderRadius: '12px',
      border: 'none',
      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    }}
    {...props}
  />
);

// ---------------------------------------------------------------------------
// Standard axis tick styling
// ---------------------------------------------------------------------------
export const AXIS_TICK_STYLE = { fill: '#94a3b8', fontSize: 12, fontWeight: 600 };

// ---------------------------------------------------------------------------
// Standard gradient definitions for area / bar charts
// ---------------------------------------------------------------------------
export const ChartGradient: React.FC<{
  id: string;
  color: string;
  opacity?: [number, number];
}> = ({ id, color, opacity = [0.1, 0] }) => (
  <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
    <stop offset="5%" stopColor={color} stopOpacity={opacity[0]} />
    <stop offset="95%" stopColor={color} stopOpacity={opacity[1]} />
  </linearGradient>
);

// ---------------------------------------------------------------------------
// Common chart colors
// ---------------------------------------------------------------------------
export const CHART_COLORS = {
  indigo: '#6366f1',
  emerald: '#10b981',
  rose: '#f43f5e',
  amber: '#f59e0b',
  blue: '#3b82f6',
  slate: '#94a3b8',
};

// ---------------------------------------------------------------------------
// Formatters
// ---------------------------------------------------------------------------
export const formatCurrency = (value: number) => `£${value.toLocaleString()}`;

export const formatPercent = (value: number) => `${value.toFixed(1)}%`;
