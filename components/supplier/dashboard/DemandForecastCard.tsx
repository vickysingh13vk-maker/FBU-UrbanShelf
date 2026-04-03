import React from 'react';
import {
  Activity,
  TrendingUp,
  Zap,
  Lightbulb,
  Target,
  ShieldAlert,
  Users,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import { Card } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { DemandForecastPoint, RevenueDataPoint, CustomerBehaviorPoint } from '../../../mock/supplierDashboard';

export interface DemandForecastCardProps {
  demandForecast: DemandForecastPoint[];
  revenueForecastData: RevenueDataPoint[];
  customerBehavior: CustomerBehaviorPoint[];
}

const DemandForecastCard: React.FC<DemandForecastCardProps> = ({
  demandForecast,
  revenueForecastData,
  customerBehavior,
}) => {
  return (
    <>
      {/* Sales Insights */}
      <Card padding="none" className="lg:col-span-4 flex flex-col p-5 hover:shadow-xl transition-all duration-300 border-slate-100 group">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="h-4 w-4 text-amber-500" />
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Sales Insights</h3>
        </div>
        <div className="space-y-4 flex-1">
          <div className="flex gap-3 group/item">
            <div className="mt-1 p-1 bg-emerald-50 rounded text-emerald-600 group-hover/item:scale-110 transition-transform">
              <TrendingUp className="h-3.5 w-3.5" />
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Revenue increased <span className="font-bold text-slate-900">12%</span> compared to last month.
            </p>
          </div>
          <div className="flex gap-3 group/item">
            <div className="mt-1 p-1 bg-blue-50 rounded text-blue-600 group-hover/item:scale-110 transition-transform">
              <Zap className="h-3.5 w-3.5" />
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              <span className="font-bold text-slate-900">Lost Mary BM600</span> is the fastest growing product this week.
            </p>
          </div>
          <div className="flex gap-3 group/item">
            <div className="mt-1 p-1 bg-indigo-50 rounded text-indigo-600 group-hover/item:scale-110 transition-transform">
              <Target className="h-3.5 w-3.5" />
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              <span className="font-bold text-slate-900">Manchester</span> region generated the highest sales this week.
            </p>
          </div>
          <div className="flex gap-3 group/item">
            <div className="mt-1 p-1 bg-emerald-50 rounded text-emerald-600 group-hover/item:scale-110 transition-transform">
              <TrendingUp className="h-3.5 w-3.5" />
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Average order value increased from <span className="font-bold text-slate-900">£195</span> to <span className="font-bold text-slate-900">£210</span>.
            </p>
          </div>
        </div>
      </Card>

      {/* Demand Forecast */}
      <Card padding="none" className="lg:col-span-4 flex flex-col p-5 hover:shadow-xl transition-all duration-300 border-slate-100 group bg-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Demand Forecast</h3>
          </div>
          <Badge variant="secondary" className="text-[10px] uppercase tracking-wider font-bold">Next 30 Days</Badge>
        </div>
        <div className="h-[180px] w-full mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={demandForecast}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" hide />
              <YAxis hide />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Line type="monotone" dataKey="current" stroke="#94a3b8" strokeWidth={2} dot={false} strokeDasharray="5 5" />
              <Line type="monotone" dataKey="predicted" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-auto">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Lost Mary BM600</p>
            <p className="text-sm font-bold text-slate-900">520 <span className="text-[10px] text-emerald-600 ml-1">+26%</span></p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Elf Bar 600</p>
            <p className="text-sm font-bold text-slate-900">420 <span className="text-[10px] text-emerald-600 ml-1">+16%</span></p>
          </div>
        </div>
      </Card>

      {/* Stock Risk Alerts */}
      <Card padding="none" className="lg:col-span-4 flex flex-col p-5 hover:shadow-xl transition-all duration-300 border-slate-100 group bg-white">
        <div className="flex items-center gap-2 mb-4">
          <ShieldAlert className="h-4 w-4 text-rose-500" />
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Stock Risk Alerts</h3>
        </div>
        <div className="space-y-3 flex-1">
          <div className="flex items-center justify-between p-3 border border-rose-100 bg-rose-50/30 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.5)]"></div>
              <div>
                <p className="text-sm font-bold text-slate-900">Elf Bar 600</p>
                <p className="text-[10px] text-slate-500 font-medium">Out of stock in 9 days</p>
              </div>
            </div>
            <Badge variant="destructive" className="text-[10px] uppercase tracking-wider font-bold">Critical</Badge>
          </div>
          <div className="flex items-center justify-between p-3 border border-amber-100 bg-amber-50/30 rounded-xl hover:bg-amber-50 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              <div>
                <p className="text-sm font-bold text-slate-900">Crystal Bar 600</p>
                <p className="text-[10px] text-slate-500 font-medium">Out of stock in 14 days</p>
              </div>
            </div>
            <Badge variant="warning" className="text-[10px] uppercase tracking-wider font-bold">Warning</Badge>
          </div>
          <div className="flex items-center justify-between p-3 border border-emerald-100 bg-emerald-50/30 rounded-xl hover:bg-emerald-50 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <div>
                <p className="text-sm font-bold text-slate-900">Lost Mary BM600</p>
                <p className="text-[10px] text-slate-500 font-medium">24 days coverage</p>
              </div>
            </div>
            <Badge variant="success" className="text-[10px] uppercase tracking-wider font-bold">Safe</Badge>
          </div>
        </div>
      </Card>

      {/* Revenue Forecast */}
      <Card padding="none" className="lg:col-span-6 flex flex-col p-5 hover:shadow-xl transition-all duration-300 border-slate-100 group bg-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Projected Revenue</h3>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Next Month Forecast</p>
            <p className="text-xl font-bold text-emerald-600">£315,000</p>
          </div>
        </div>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueForecastData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} tickFormatter={(val) => `£${val/1000}k`} />
              <Tooltip
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="revenue" radius={[6, 6, 0, 0]} barSize={60}>
                {revenueForecastData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#94a3b8' : '#10b981'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Buyer Trends */}
      <Card padding="none" className="lg:col-span-3 flex flex-col p-5 hover:shadow-xl transition-all duration-300 border-slate-100 group bg-white">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-4 w-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Buyer Trends</h3>
        </div>
        <div className="h-[200px] w-full flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={customerBehavior} layout="vertical" margin={{ left: -20 }}>
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} width={100} />
              <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <p className="text-xs font-medium text-blue-700 leading-relaxed">
            Repeat purchase rate is <span className="font-bold">15% higher</span> in the North region.
          </p>
        </div>
      </Card>
    </>
  );
};

export default DemandForecastCard;
