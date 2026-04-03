import React from 'react';
import { TrendingUp, Receipt, Clock } from 'lucide-react';
import { Card, Button } from '../ui';
import {
  AreaChart, Area, XAxis, YAxis,
  ResponsiveContainer
} from 'recharts';
import { StandardGrid, StandardTooltip, ChartGradient, CHART_COLORS, AXIS_TICK_STYLE, formatCurrency } from '../../utils/chartHelpers';

const FinanceCharts: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
      <Card className="lg:col-span-2 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Financial Overview</h3>
            <p className="text-xs text-slate-400">Revenue and commission trends over time.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-indigo-500" />
              <span className="text-xs font-bold text-slate-500">Revenue</span>
            </div>
            <div className="flex items-center gap-1.5 ml-4">
              <div className="h-3 w-3 rounded-full bg-rose-400" />
              <span className="text-xs font-bold text-slate-500">Commission</span>
            </div>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <ChartGradient id="colorRevenue" color={CHART_COLORS.indigo} />
                <ChartGradient id="colorCommission" color={CHART_COLORS.rose} />
              </defs>
              <StandardGrid />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={AXIS_TICK_STYLE}
                dy={10}
                tickFormatter={(str) => {
                  const date = new Date(str);
                  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
                }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={AXIS_TICK_STYLE}
                tickFormatter={(val) => formatCurrency(val)}
              />
              <StandardTooltip
                formatter={(value: number) => [formatCurrency(value), '']}
              />
              <Area type="monotone" dataKey="revenue" stroke={CHART_COLORS.indigo} strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              <Area type="monotone" dataKey="commission" stroke={CHART_COLORS.rose} strokeWidth={3} fillOpacity={1} fill="url(#colorCommission)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Payout Summary</h3>
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Net Payable</p>
            <p className="text-3xl font-black text-slate-900">£284,000.00</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <span className="text-sm font-bold text-slate-600">Total Earnings</span>
              </div>
              <span className="text-sm font-black text-slate-900">£342,800.00</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
                  <Receipt className="h-4 w-4" />
                </div>
                <span className="text-sm font-bold text-slate-600">Commission Deducted</span>
              </div>
              <span className="text-sm font-black text-rose-600">-£58,800.00</span>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                  <Clock className="h-4 w-4" />
                </div>
                <span className="text-sm font-bold text-slate-600">Pending Payout</span>
              </div>
              <span className="text-sm font-black text-amber-600">£12,450.00</span>
            </div>
          </div>

          <Button variant="primary" className="w-full py-4 text-sm font-bold">Request Payout</Button>
        </div>
      </Card>
    </div>
  );
};

export default FinanceCharts;
