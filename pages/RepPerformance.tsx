import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Card, CardHeader, Badge } from '../components/ui';
import { Users, ShoppingCart, Package, Download, Calendar, MapPin, Clock, Smartphone, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';

// --- Mock Data ---

const REP_VISIT_DATA = [
  { name: 'Chloe Butler', visits: 44, appCount: 0, boxesSold: 0, cdusSold: 0, salesCount: 0 },
  { name: 'Dan Strainu', visits: 68, appCount: 0, boxesSold: 0, cdusSold: 0, salesCount: 0 },
  { name: 'Serine houadef', visits: 88, appCount: 0, boxesSold: 0, cdusSold: 0, salesCount: 0 },
  { name: 'Joanne Byrne', visits: 150, appCount: 22, boxesSold: 72, cdusSold: 10, salesCount: 13 },
  { name: 'Emma Leah', visits: 147, appCount: 27, boxesSold: 90, cdusSold: 15, salesCount: 15 },
  { name: 'Sean Dodds', visits: 179, appCount: 41, boxesSold: 67, cdusSold: 5, salesCount: 8 },
];

const VISIT_STATUS_DATA = [
  { name: 'First Visit', count: 541, color: '#f59e0b' },
  { name: 'Revisits', count: 114, color: '#10b981' },
  { name: 'Phone Call', count: 21, color: '#60a5fa' },
];

const DECISION_MAKER_DATA = [
  { name: 'Yes', count: 266, color: '#10b981' },
  { name: 'No', count: 410, color: '#ef4444' },
];

const STOCKING_LOST_MARY_DATA = [
  { name: 'Yes', count: 204, color: '#10b981' },
  { name: 'No', count: 472, color: '#ef4444' },
];

const PURCHASING_FROM_DATA = [
  { name: 'Cash & Carry', value: 29.0, color: '#3b82f6' },
  { name: 'Bookers', value: 22.8, color: '#fbbf24' },
  { name: 'VSL/Vape Supplier', value: 14.2, color: '#a855f7' },
  { name: 'United Wholesale', value: 9.9, color: '#ef4444' },
  { name: 'Other', value: 6.4, color: '#10b981' },
  { name: 'Southall (London)', value: 5.8, color: '#06b6d4' },
  { name: 'Online', value: 5.4, color: '#f97316' },
  { name: 'Elite', value: 2.6, color: '#15803d' },
  { name: 'Flawless', value: 1.3, color: '#4338ca' },
  { name: 'Washington Vapes', value: 0.9, color: '#ec4899' },
  { name: 'Dhamecha Cash & C', value: 0.7, color: '#1d4ed8' },
  { name: 'Bestway', value: 0.6, color: '#be123c' },
  { name: 'Unity', value: 0.4, color: '#a16207' },
];

const TOP_VAPE_SUPPLIER_DATA = [
  { name: 'SKE Crystal', value: 33.4, color: '#3b82f6' },
  { name: 'Lost Mary', value: 24.3, color: '#fbbf24' },
  { name: 'IVG', value: 18.4, color: '#a855f7' },
  { name: 'Hayati', value: 5.6, color: '#ef4444' },
  { name: 'Other', value: 4.3, color: '#10b981' },
  { name: 'Higo', value: 4.0, color: '#06b6d4' },
  { name: 'Pixl', value: 3.8, color: '#f97316' },
  { name: 'Elf Bar', value: 3.0, color: '#15803d' },
  { name: 'Pyne Pod', value: 1.3, color: '#4338ca' },
  { name: 'Blu Bar', value: 1.0, color: '#ec4899' },
  { name: 'Hyola', value: 0.7, color: '#1d4ed8' },
  { name: 'Titan', value: 0.2, color: '#be123c' },
];

const TOP_NICOTINE_POUCH_DATA = [
  { name: 'Velo', value: 43.6, color: '#3b82f6' },
  { name: 'Pablo', value: 15.9, color: '#fbbf24' },
  { name: 'Other', value: 11.9, color: '#a855f7' },
  { name: 'Zyn', value: 9.7, color: '#ef4444' },
  { name: 'Killa', value: 7.9, color: '#10b981' },
  { name: 'Nordic Spirit', value: 7.7, color: '#06b6d4' },
  { name: 'Iceberg', value: 1.3, color: '#f97316' },
  { name: 'Clew', value: 0.7, color: '#15803d' },
  { name: 'Snu', value: 0.4, color: '#4338ca' },
  { name: 'IVG', value: 0.4, color: '#ec4899' },
  { name: 'Elux', value: 0.2, color: '#1d4ed8' },
  { name: 'Ubbs', value: 0.2, color: '#be123c' },
];

const WEEKLY_VISITS_DATA = [
  { name: '4 Aug, \'25', count: 108 },
  { name: '11 Aug, \'25', count: 194 },
  { name: '18 Aug, \'25', count: 222 },
  { name: '25 Aug, \'25', count: 152 },
];

// --- Helper Components ---

const GaugeChart = ({ title, value, max, color }: { title: string, value: number, max: number, color: string }) => {
  const data = [
    { value: value, color: color },
    { value: max - value, color: '#e2e8f0' },
  ];

  return (
    <Card className="p-4 flex flex-col items-center">
      <h3 className="text-sm font-bold text-slate-700 mb-4">{title}</h3>
      <div className="h-32 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="100%"
              startAngle={180}
              endAngle={0}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={0}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center">
          <span className="text-xs text-slate-400 font-bold uppercase">Actual</span>
          <span className="text-2xl font-bold text-slate-900">{value}</span>
        </div>
      </div>
      <div className="flex justify-between w-full mt-2 text-[10px] font-bold text-slate-400">
        <span>0</span>
        <span>{max}</span>
      </div>
    </Card>
  );
};

const KPIBox = ({ title, value }: { title: string, value: string | number }) => (
  <Card className="p-6 flex flex-col items-center justify-center text-center h-32">
    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">{title}</h3>
    <span className="text-4xl font-bold text-slate-900">{value}</span>
  </Card>
);

const RepPerformance: React.FC = () => {
  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-primary tracking-tight uppercase">Rep Performance</h1>
          <p className="text-sm text-slate-500 font-medium tracking-tight">Real-time field activity and sales conversion</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-black text-primary">{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
      </div>

      {/* Rep Visit Count Chart */}
      <Card className="sales-card p-6">
        <CardHeader title="Visit & Sales Conversion" />
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={REP_VISIT_DATA} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px' }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ paddingTop: '20px', fontWeight: 600, fontSize: '12px' }} />
              <Bar dataKey="visits" name="Visits" fill="#0B1F3A" radius={[6, 6, 0, 0]} barSize={20} />
              <Bar dataKey="appCount" name="App Downloads" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={20} />
              <Bar dataKey="boxesSold" name="Boxes Sold" fill="#fbbf24" radius={[6, 6, 0, 0]} barSize={20} />
              <Bar dataKey="salesCount" name="Sales Count" fill="#10b981" radius={[6, 6, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <KPIBox title="Visits" value="676" />
        <KPIBox title="App Downloads" value="90" />
        <KPIBox title="Boxes Sold" value="229" />
        <KPIBox title="CDU's Sold" value="30" />
        <KPIBox title="Sales" value="36" />
      </div>

      {/* Visit Status Chart */}
      <Card className="p-6">
        <CardHeader title="Visit Status" />
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={VISIT_STATUS_DATA} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip cursor={{ fill: '#f8fafc' }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={150} label={{ position: 'top', fontSize: 12, fontWeight: 'bold' }}>
                {VISIT_STATUS_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Gauge Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GaugeChart title="App Count" value={90} max={200} color="#fbbf24" />
        <GaugeChart title="Sales Count" value={36} max={100} color="#a855f7" />
        <GaugeChart title="Boxes Sold" value={229} max={400} color="#10b981" />
      </div>

      {/* Horizontal Bar Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <CardHeader title="Decision maker Available?" />
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={DECISION_MAKER_DATA} margin={{ top: 20, right: 40, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={40} label={{ position: 'right', fontSize: 12, fontWeight: 'bold' }}>
                  {DECISION_MAKER_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <CardHeader title="Already stocking Hawcos x Lost Mary?" />
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={STOCKING_LOST_MARY_DATA} margin={{ top: 20, right: 40, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={40} label={{ position: 'right', fontSize: 12, fontWeight: 'bold' }}>
                  {STOCKING_LOST_MARY_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Pie Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <CardHeader title="Where are you currently purchasing from?" />
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="h-[300px] w-full md:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={PURCHASING_FROM_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {PURCHASING_FROM_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-1/2 grid grid-cols-2 gap-x-4 gap-y-2">
              {PURCHASING_FROM_DATA.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-[10px] font-bold text-slate-600 truncate">{item.name}: {item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <CardHeader title="Top Selling Vape Supplier?" />
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="h-[300px] w-full md:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={TOP_VAPE_SUPPLIER_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {TOP_VAPE_SUPPLIER_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-1/2 grid grid-cols-2 gap-x-4 gap-y-2">
              {TOP_VAPE_SUPPLIER_DATA.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-[10px] font-bold text-slate-600 truncate">{item.name}: {item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Pie Chart & Weekly Visits Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <CardHeader title="Top selling Nicotine Pouch?" />
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="h-[300px] w-full md:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={TOP_NICOTINE_POUCH_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {TOP_NICOTINE_POUCH_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-1/2 grid grid-cols-2 gap-x-4 gap-y-2">
              {TOP_NICOTINE_POUCH_DATA.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-[10px] font-bold text-slate-600 truncate">{item.name}: {item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <CardHeader title="Daily/Weekly Visits" />
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEKLY_VISITS_DATA} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={80} label={{ position: 'top', fontSize: 12, fontWeight: 'bold' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Map Section */}
      <Card padding="none" className="overflow-hidden">
        <CardHeader title="Map" className="p-6 border-b border-slate-100" />
        <div className="h-[600px] w-full bg-slate-100 relative">
          {/* Mock Map Background */}
          <div className="absolute inset-0 opacity-40 grayscale">
             <img 
               src="https://picsum.photos/seed/map/1200/800" 
               alt="Map Background" 
               className="w-full h-full object-cover"
               referrerPolicy="no-referrer"
             />
          </div>
          
          {/* Mock Markers */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[20%] left-[45%] flex flex-col items-center">
              <div className="h-10 w-10 bg-rose-500/80 rounded-full flex items-center justify-center text-white text-[10px] font-bold border-2 border-white shadow-lg animate-pulse">145</div>
              <span className="bg-white/90 px-2 py-0.5 rounded text-[10px] font-bold text-slate-900 mt-1 shadow-sm">Glasgow</span>
            </div>
            
            <div className="absolute top-[45%] left-[65%] flex flex-col items-center">
              <div className="h-8 w-8 bg-indigo-500/80 rounded-full flex items-center justify-center text-white text-[10px] font-bold border-2 border-white shadow-lg">Manchester</div>
            </div>

            <div className="absolute top-[55%] left-[60%] flex flex-col items-center">
              <div className="h-12 w-12 bg-amber-500/80 rounded-full flex items-center justify-center text-white text-[10px] font-bold border-2 border-white shadow-lg animate-pulse">49</div>
              <span className="bg-white/90 px-2 py-0.5 rounded text-[10px] font-bold text-slate-900 mt-1 shadow-sm">Birmingham</span>
            </div>

            <div className="absolute top-[75%] left-[80%] flex flex-col items-center">
              <div className="h-14 w-14 bg-rose-600/80 rounded-full flex items-center justify-center text-white text-[10px] font-bold border-2 border-white shadow-lg animate-pulse">251</div>
              <span className="bg-white/90 px-2 py-0.5 rounded text-[10px] font-bold text-slate-900 mt-1 shadow-sm">London</span>
            </div>

            <div className="absolute top-[70%] left-[40%] flex flex-col items-center">
              <div className="h-10 w-10 bg-emerald-500/80 rounded-full flex items-center justify-center text-white text-[10px] font-bold border-2 border-white shadow-lg">142</div>
              <span className="bg-white/90 px-2 py-0.5 rounded text-[10px] font-bold text-slate-900 mt-1 shadow-sm">Cardiff</span>
            </div>
          </div>
          
          <div className="absolute bottom-6 right-6 bg-white p-4 rounded-xl shadow-xl border border-slate-200 max-w-xs">
            <h4 className="text-xs font-bold text-slate-900 mb-2 uppercase tracking-widest">Map Legend</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-rose-500" />
                <span className="text-[10px] font-medium text-slate-600">High Activity (200+)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-amber-500" />
                <span className="text-[10px] font-medium text-slate-600">Medium Activity (50-200)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-medium text-slate-600">Low Activity (0-50)</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RepPerformance;
