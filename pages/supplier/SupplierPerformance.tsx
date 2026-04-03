import React, { useMemo } from 'react';
import { Activity, TrendingUp, TrendingDown, Clock, CheckCircle, AlertCircle, BarChart3, ShieldCheck, Zap, Target, Truck } from 'lucide-react';
import { 
  Card, Button, Badge, Table, THead, TBody, TR, TH, TD, CardHeader
} from '../../components/ui';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { useSupplier } from '../../context/SupplierContext';

const CHART_DATA = [
  { name: 'Jan', score: 92, fulfillment: 95, accuracy: 98 },
  { name: 'Feb', score: 95, fulfillment: 96, accuracy: 99 },
  { name: 'Mar', score: 94, fulfillment: 94, accuracy: 99 },
  { name: 'Apr', score: 97, fulfillment: 98, accuracy: 99.8 },
];

const SupplierPerformance: React.FC = () => {
  const { products, shipments, orders } = useSupplier();

  const performanceMetrics = useMemo(() => {
    const totalProducts = products.length;
    const lowStockProducts = products.filter(p => p.stock < 100).length;
    const stockHealth = (((totalProducts - lowStockProducts) / totalProducts) * 100).toFixed(1);
    
    const inTransitShipments = shipments.filter(s => s.status === 'IN_TRANSIT').length;
    const deliveredOrders = orders.filter(o => o.status === 'DELIVERED').length;
    const fulfillmentRate = ((deliveredOrders / orders.length) * 100).toFixed(1);

    return [
      { label: 'On-Time Inbound', value: '94.2%', trend: '+2.1%', isPositive: true, description: 'Shipments arriving on or before ETA', icon: Truck, color: 'indigo' },
      { label: 'Inventory Accuracy', value: '99.8%', trend: '+0.1%', isPositive: true, description: 'Stock count match between systems', icon: ShieldCheck, color: 'emerald' },
      { label: 'Order Fulfillment', value: `${fulfillmentRate}%`, trend: '-1.2%', isPositive: false, description: 'Orders successfully fulfilled by FBU', icon: Zap, color: 'amber' },
      { label: 'Stock Health', value: `${stockHealth}%`, trend: '+0.5%', isPositive: true, description: 'Percentage of SKUs in optimal range', icon: Activity, color: 'blue' },
    ];
  }, [products, shipments, orders]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Performance Analytics</h1>
            <p className="text-slate-500 mt-1 font-medium">Monitor your operational efficiency and service levels.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" icon={<BarChart3 className="h-4 w-4" />}>Quarterly Review</Button>
            <Button variant="primary">Download Report</Button>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {performanceMetrics.map((metric, idx) => (
          <Card key={idx} className="hover:shadow-md hover:border-slate-200 transition-all h-full">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{metric.label}</p>
              <div className={`rounded-lg p-1.5 bg-${metric.color}-50 text-${metric.color}-500`}>
                <metric.icon className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <p className="text-xl font-black text-slate-900 tracking-tight">{metric.value}</p>
              <Badge variant={metric.isPositive ? 'success' : 'danger'} className="text-[10px] font-bold">
                {metric.trend}
              </Badge>
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">{metric.description}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Main Chart */}
        <Card className="lg:col-span-8 p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Service Level Trends</h3>
              <p className="text-sm text-slate-500 font-medium">Monthly performance score across all metrics</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-indigo-500" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Fulfillment</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Accuracy</span>
              </div>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CHART_DATA}>
                <defs>
                  <linearGradient id="colorFulfillment" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                  domain={[80, 100]}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="fulfillment" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorFulfillment)"
                />
                <Area 
                  type="monotone" 
                  dataKey="accuracy" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorAccuracy)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Side Panel */}
        <Card className="lg:col-span-4 p-5">
          <div className="mb-5">
            <h3 className="text-sm font-bold text-slate-900">Operational Health</h3>
            <p className="text-sm text-slate-500 font-medium">Current status of your supply chain</p>
          </div>
          <div className="space-y-5">
            <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 group hover:bg-emerald-100/50 transition-colors">
              <div className="p-2.5 bg-white rounded-xl text-emerald-600 shadow-sm group-hover:scale-110 transition-transform">
                <CheckCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-emerald-900">All Systems Normal</p>
                <p className="text-xs text-emerald-700 font-medium">Fulfillment is running at 98% efficiency.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-indigo-50 rounded-2xl border border-indigo-100 group hover:bg-indigo-100/50 transition-colors">
              <div className="p-2.5 bg-white rounded-xl text-indigo-600 shadow-sm group-hover:scale-110 transition-transform">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-indigo-900">Average Lead Time</p>
                <p className="text-xs text-indigo-700 font-medium">Your average inbound processing time is 4.2 hours.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-slate-100 transition-colors">
              <div className="p-2.5 bg-white rounded-xl text-slate-600 shadow-sm group-hover:scale-110 transition-transform">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Stock Health</p>
                <p className="text-xs text-slate-600 font-medium">92% of your SKUs are in optimal stock range.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-2xl border border-amber-100 group hover:bg-amber-100/50 transition-colors">
              <div className="p-2.5 bg-white rounded-xl text-amber-600 shadow-sm group-hover:scale-110 transition-transform">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-amber-900">Market Reach</p>
                <p className="text-xs text-amber-700 font-medium">Your products reached 12 new regions this month.</p>
              </div>
            </div>
          </div>

          <div className="mt-8 p-5 bg-indigo-600 rounded-2xl text-white relative overflow-hidden group cursor-pointer">
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <TrendingUp className="h-32 w-32" />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Performance Tip</p>
            <p className="text-sm font-bold leading-relaxed relative z-10">
              Increasing your buffer stock for "Lost Mary BM600" by 15% could prevent potential stockouts next month.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SupplierPerformance;
