import React, { useState, useMemo } from 'react';
import { Card, Button, Select } from '../components/ui';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Legend, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { ModernAreaChart, ModernBarChart, ModernDonutChart, MODERN_COLORS } from '../components/ModernCharts';
import { Download, Calendar, Filter, RotateCcw, ChevronDown, Layers, Users, ShoppingCart, Tag } from 'lucide-react';
import { ORDERS, PRODUCTS, USERS, CATEGORIES } from '../data';
import { useAuth } from '../context/AuthContext';

// --- Types & Interfaces ---
interface ChartData {
  name: string;
  [key: string]: string | number;
}

// --- Helper Components ---
const SectionHeader: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <div className="mb-6">
    <h3 className="text-lg font-bold text-slate-900">{title}</h3>
    {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
  </div>
);

const EmptyState: React.FC<{ title: string; message: string; icon: any }> = ({ title, message, icon: Icon }) => (
  <div className="flex flex-col items-center justify-center h-64 text-center p-6 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
    <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
      <Icon className="h-6 w-6 text-slate-300" />
    </div>
    <h4 className="text-sm font-bold text-slate-900">{title}</h4>
    <p className="text-xs text-slate-500 mt-1 max-w-xs">{message}</p>
  </div>
);

// --- Main Page Component ---
const AnalyticsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState('Last 7 Days');
  const [statusFilter, setStatusFilter] = useState('All');
  const { hasPermission } = useAuth();

  // --- Data Processing (Memoized) ---
  
  // 1. Orders Over Time (Line Chart)
  const ordersOverTimeData = useMemo(() => {
    const grouped: { [key: string]: any } = {};
    // Sort orders by date for the chart
    const sortedOrders = [...ORDERS].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    sortedOrders.forEach(order => {
      const date = new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!grouped[date]) {
        grouped[date] = { name: date, total: 0, completed: 0, pending: 0, cancelled: 0 };
      }
      grouped[date].total += 1;
      if (order.status === 'Delivered') grouped[date].completed += 1;
      else if (order.status === 'Cancelled') grouped[date].cancelled += 1;
      else grouped[date].pending += 1; // Processing + Pending
    });
    return Object.values(grouped);
  }, []);

  // 2. Order Status Breakdown (Donut)
  const orderStatusData = useMemo(() => {
    const counts: { [key: string]: number } = { Delivered: 0, Pending: 0, Processing: 0, Cancelled: 0 };
    ORDERS.forEach(o => {
      const status = o.status === 'Delivered' ? 'Delivered' : 
                     o.status === 'Pending' ? 'Pending' :
                     o.status === 'Cancelled' ? 'Cancelled' : 'Processing';
      counts[status]++;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, []);

  // 3. Product Availability (Bar)
  const productStockData = useMemo(() => {
    let inStock = 0;
    let lowStock = 0;
    let outOfStock = 0;
    PRODUCTS.forEach(p => {
      if (p.stock === 0) outOfStock++;
      else if (p.stock < 20) lowStock++;
      else inStock++;
    });
    return [
      { name: 'In Stock', value: inStock, color: '#10b981' }, // Emerald
      { name: 'Low Stock', value: lowStock, color: '#f59e0b' }, // Amber
      { name: 'Out of Stock', value: outOfStock, color: '#ef4444' } // Rose
    ];
  }, []);

  // 4. Products by Category (Donut/Bar)
  const categoryData = useMemo(() => {
    const counts: { [key: string]: number } = {};
    PRODUCTS.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, []);

  // 5. Top 10 Selling Products (Mock Data Simulation)
  const topSellingProductsData = useMemo(() => {
    // augment PRODUCTS with random sales data for visualization
    const productSales = PRODUCTS.map(p => ({
        name: p.name,
        sales: Math.floor(Math.random() * 800) + 150,
    }));
    
    // Add extra mock items to ensure we have a nice top 10 list
    const extraMockProducts = [
        { name: 'Desk Lamp Pro', sales: 920 },
        { name: 'Mechanical Keyboard', sales: 850 },
        { name: '4K Monitor Stand', sales: 640 },
        { name: 'USB-C Docking Station', sales: 430 },
        { name: 'Webcam 1080p', sales: 310 }
    ];

    return [...productSales, ...extraMockProducts]
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 10);
  }, []);

  // Color Palette
  const COLORS = {
    primary: '#2666B5', // Primary Blue
    success: '#10b981', // Emerald 500
    warning: '#f59e0b', // Amber 500
    danger: '#ef4444',  // Rose 500
    neutral: '#94a3b8', // Slate 400
    info: '#3b82f6',    // Blue 500
  };

  const PIE_COLORS = [COLORS.success, COLORS.info, COLORS.warning, COLORS.danger];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      
      {/* SECTION 1: GLOBAL FILTER BAR (Sticky) */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm -mx-4 sm:-mx-8 px-4 sm:px-8 py-4 mb-8">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Analytics</h1>
            <span className="text-slate-300 mx-2">|</span>
            <span className="text-sm font-medium text-slate-500">Overview</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Date Selector */}
            <div className="w-40">
              <Select 
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="!py-2"
              >
                <option>Today</option>
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>This Quarter</option>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="w-40">
              <Select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="!py-2"
              >
                <option value="All">All Orders</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
              </Select>
            </div>

            <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>

            <Button variant="ghost" size="sm" icon={<RotateCcw className="h-3 w-3" />}>Reset</Button>
            {hasPermission('Analytics', 'view') && (
              <Button variant="primary" size="sm" icon={<Download className="h-3 w-3" />}>Export</Button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-8 max-w-[1400px] mx-auto pb-12">

        {/* SECTION 2: KEY ANALYTICS SNAPSHOT */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCard title="Total Orders" value={ORDERS.length} color="blue" />
          <SummaryCard title="Pending Orders" value={ORDERS.filter(o => o.status === 'Pending').length} color="amber" />
          <SummaryCard title="Active Products" value={PRODUCTS.filter(p => p.status === 'Active').length} color="emerald" />
          <SummaryCard title="Total Users" value={USERS.length} color="indigo" />
        </div>

        {/* SECTION 3: ORDERS ANALYTICS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Orders Over Time */}
          <Card className="lg:col-span-2 p-6 bg-[#0f172a] border-slate-800 shadow-2xl">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-white">Orders Performance</h3>
              <p className="text-sm text-slate-400 mt-1">Daily order volume over the selected period</p>
            </div>
            <div className="h-80 w-full">
              <ModernAreaChart 
                data={ordersOverTimeData} 
                dataKey="total" 
                name="Total Orders" 
                color={MODERN_COLORS.primary} 
              />
            </div>
          </Card>

          {/* Right: Order Status Distribution */}
          <Card className="p-6 bg-[#0f172a] border-slate-800 shadow-2xl">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-white">Status Breakdown</h3>
              <p className="text-sm text-slate-400 mt-1">Current status of all orders</p>
            </div>
            <div className="h-64 relative">
              <ModernDonutChart 
                data={orderStatusData.map(d => ({
                  ...d,
                  color: d.name === 'Delivered' ? MODERN_COLORS.success : 
                         d.name === 'Pending' ? MODERN_COLORS.warning :
                         d.name === 'Processing' ? MODERN_COLORS.secondary : MODERN_COLORS.danger
                }))} 
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                <span className="text-3xl font-extrabold text-white">{ORDERS.length}</span>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Total</span>
              </div>
            </div>
          </Card>
        </div>

        {/* SECTION 4: PRODUCT & INVENTORY INSIGHTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 bg-[#0f172a] border-slate-800 shadow-2xl">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-white">Inventory Health</h3>
              <p className="text-sm text-slate-400 mt-1">Stock levels across catalog</p>
            </div>
            <div className="h-64">
              <ModernBarChart 
                data={productStockData} 
                dataKey="value" 
                name="Products" 
                layout="vertical"
                color={MODERN_COLORS.secondary}
              />
            </div>
          </Card>

          <Card className="p-6 bg-[#0f172a] border-slate-800 shadow-2xl">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-white">Products by Category</h3>
              <p className="text-sm text-slate-400 mt-1">Catalog distribution</p>
            </div>
            <div className="h-64">
              <ModernBarChart 
                data={categoryData} 
                dataKey="value" 
                name="Products" 
                color={MODERN_COLORS.primary}
              />
            </div>
          </Card>
        </div>

        {/* SECTION 4.5: TOP SELLING PRODUCTS */}
        <Card className="p-6 bg-[#0f172a] border-slate-800 shadow-2xl">
           <div className="mb-6">
              <h3 className="text-lg font-bold text-white">Top 10 Selling Products</h3>
              <p className="text-sm text-slate-400 mt-1">Highest performing items by units sold</p>
           </div>
           <div className="h-96 w-full">
              <ModernBarChart 
                data={topSellingProductsData} 
                dataKey="sales" 
                name="Sales" 
                layout="vertical"
                color={MODERN_COLORS.success}
              />
           </div>
        </Card>

        {/* SECTION 5: USER & ACTIVITY ANALYTICS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 bg-[#0f172a] border-slate-800 shadow-2xl">
             <div className="mb-6">
                <h3 className="text-lg font-bold text-white">User Growth</h3>
                <p className="text-sm text-slate-400 mt-1">New registrations trend</p>
             </div>
             <div className="h-64 w-full">
                <ModernAreaChart 
                  data={[{name: 'Week 1', users: 2}, {name: 'Week 2', users: 5}, {name: 'Week 3', users: 8}, {name: 'Week 4', users: 12}]} 
                  dataKey="users" 
                  name="Users" 
                  color={MODERN_COLORS.secondary}
                />
             </div>
          </Card>

          <Card className="p-6">
             <SectionHeader title="User Activity Snapshot" subtitle="Current engagement metrics" />
             <div className="grid grid-cols-2 gap-4 h-full pb-4">
                <div className="bg-slate-50 rounded-xl p-5 flex flex-col justify-center items-center text-center border border-slate-100">
                    <Users className="h-8 w-8 text-indigo-500 mb-3" />
                    <span className="text-3xl font-bold text-slate-900">{USERS.length}</span>
                    <span className="text-xs text-slate-500 font-medium uppercase mt-1">Total Users</span>
                </div>
                <div className="bg-emerald-50 rounded-xl p-5 flex flex-col justify-center items-center text-center border border-emerald-100">
                    <div className="relative">
                       <span className="absolute -top-1 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                       </span>
                       <Users className="h-8 w-8 text-emerald-600 mb-3" />
                    </div>
                    <span className="text-3xl font-bold text-emerald-700">{USERS.filter(u => u.status === 'Active').length}</span>
                    <span className="text-xs text-emerald-600 font-medium uppercase mt-1">Active Now</span>
                </div>
             </div>
          </Card>
        </div>

        {/* SECTION 6: MARKETING & PROMOTIONS (Empty State Handling) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <Card className="p-6">
              <SectionHeader title="Email Campaigns" subtitle="Sent vs Draft status" />
              <EmptyState title="No Campaign Data" message="Launch your first email campaign to see performance metrics here." icon={Layers} />
           </Card>
           
           <Card className="p-6">
              <SectionHeader title="Coupons & Pricing" subtitle="Active promotions" />
              <div className="grid grid-cols-2 gap-4">
                  <div className="border border-slate-200 rounded-xl p-5 flex items-center gap-4">
                     <div className="p-3 bg-violet-50 rounded-lg">
                        <Tag className="h-6 w-6 text-violet-600" />
                     </div>
                     <div>
                        <div className="text-2xl font-bold text-slate-900">0</div>
                        <div className="text-xs text-slate-500 font-bold uppercase">Active Coupons</div>
                     </div>
                  </div>
                  <div className="border border-slate-200 rounded-xl p-5 flex items-center gap-4">
                     <div className="p-3 bg-pink-50 rounded-lg">
                        <ShoppingCart className="h-6 w-6 text-pink-600" />
                     </div>
                     <div>
                        <div className="text-2xl font-bold text-slate-900">0</div>
                        <div className="text-xs text-slate-500 font-bold uppercase">Pricing Tiers</div>
                     </div>
                  </div>
              </div>
           </Card>
        </div>

        {/* SECTION 7: LOYALTY ANALYTICS (Empty State) */}
        <Card className="p-6">
           <SectionHeader title="Loyalty Program" subtitle="Member tier distribution" />
           <div className="flex flex-col items-center justify-center py-12 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
               <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                  <div className="h-8 w-8 text-slate-300">👑</div>
               </div>
               <h3 className="text-lg font-bold text-slate-900">Loyalty Program Not Active</h3>
               <p className="text-slate-500 max-w-md text-center mt-2 text-sm">
                  Configure your loyalty tiers and rewards to start tracking member progress and retention.
               </p>
               <div className="mt-6">
                 <Button variant="secondary" size="sm">Configure Loyalty</Button>
               </div>
           </div>
        </Card>

      </div>
    </div>
  );
};

// --- Sub-Components ---

const SummaryCard = ({ title, value, color }: { title: string, value: number, color: string }) => {
  const colorStyles: any = {
    blue: 'border-l-blue-500',
    amber: 'border-l-amber-500',
    emerald: 'border-l-emerald-500',
    indigo: 'border-l-indigo-500',
  };
  
  return (
    <Card className={`p-5 border-l-4 ${colorStyles[color]} flex flex-col justify-center h-24 shadow-sm hover:shadow-md transition-shadow`}>
       <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">{title}</span>
       <span className="text-3xl font-extrabold text-slate-900 mt-1">{value}</span>
    </Card>
  );
};

export default AnalyticsPage;