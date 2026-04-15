import { SalesRep } from '../types';
import { TrendingUp, Wallet, Warehouse, Users, Package } from 'lucide-react';

// --- Mock Data for Dashboard ---

export const ADMIN_KPIS = [
  { label: 'Revenue (month)', value: '£342,800', trend: '▲ +12%', color: 'blue', trendColor: 'text-emerald-500' },
  { label: 'Orders today', value: '42', trend: '▲ 8 from yesterday', color: 'teal', trendColor: 'text-emerald-500' },
  { label: 'Total outstanding', value: '£84,200', trend: '18 customers', color: 'amber', trendColor: 'text-slate-400' },
  { label: 'Overdue', value: '£32,150', trend: '▼ 3 accounts', color: 'rose', trendColor: 'text-rose-500' },
  { label: 'Low stock SKUs', value: '38', trend: '▼ needs reorder', color: 'purple', trendColor: 'text-rose-500' },
  { label: 'Out of stock', value: '21', trend: '▼ urgent', color: 'rose', trendColor: 'text-rose-500' },
];

export const SALES_KPIS = [
  { label: 'Revenue today', value: '£12,450', trend: '+7%', color: 'blue' },
  { label: 'Revenue (month)', value: '£342,800', trend: '+12%', color: 'emerald' },
  { label: 'Orders today', value: '42', trend: '+8', color: 'amber' },
  { label: 'Total customers', value: '842', trend: '+14 new', color: 'indigo' },
  { label: 'Active carts', value: '18', trend: 'pending', color: 'emerald' },
];

export const FINANCE_KPIS = [
  { label: 'Revenue (month)', value: '£342,800', trend: '+12%', color: 'blue' },
  { label: 'Total outstanding', value: '£84,200', trend: '18 accounts', color: 'amber' },
  { label: 'Overdue', value: '£32,150', trend: 'action needed', color: 'rose' },
  { label: 'Paid (month)', value: '£156,000', trend: '+9%', color: 'emerald' },
  { label: 'DSO (days)', value: '28', trend: '-3 days', color: 'indigo' },
];

export const INVENTORY_KPIS = [
  { label: 'Total SKUs', value: '480', trend: '+12', color: 'blue' },
  { label: 'Total units in stock', value: '72,340', trend: 'across all', color: 'emerald' },
  { label: 'Low stock SKUs', value: '38', trend: 'reorder needed', color: 'rose' },
  { label: 'Out of stock', value: '21', trend: 'zero units', color: 'rose' },
];

export const FBU_KPIS = [
  { label: 'FBU Orders (month)', value: '1,240', trend: '▲ +15%', color: 'indigo', trendColor: 'text-emerald-500' },
  { label: 'Avg. Fulfillment Time', value: '4.2 hrs', trend: '▼ -12 min', color: 'emerald', trendColor: 'text-emerald-500' },
  { label: 'Warehouse Accuracy', value: '99.8%', trend: '▲ +0.1%', color: 'blue', trendColor: 'text-emerald-500' },
  { label: 'FBU Revenue', value: '£142,500', trend: '▲ +18%', color: 'teal', trendColor: 'text-emerald-500' },
  { label: 'Processing Orders', value: '84', trend: 'in warehouse', color: 'amber', trendColor: 'text-slate-400' },
];

export const SUPPLIER_DASHBOARD_KPIS = [
  { label: 'Your Supplier Sales', value: '£84,200', trend: '▲ +15%', color: 'blue', trendColor: 'text-emerald-500' },
  { label: 'Units Sold', value: '12,450', trend: '▲ +8%', color: 'emerald', trendColor: 'text-emerald-500' },
  { label: 'Active Retailers', value: '156', trend: '▲ +4', color: 'amber', trendColor: 'text-emerald-500' },
  { label: 'Stock Health', value: '94%', trend: '▲ +2%', color: 'indigo', trendColor: 'text-emerald-500' },
  { label: 'Pending Orders', value: '18', trend: 'Processing', color: 'rose', trendColor: 'text-slate-400' },
];

export const SUPPLIER_SHARE_DATA = [
  { name: 'SKE Crystal', value: 33.4, color: '#6366f1' },
  { name: 'Lost Mary', value: 24.3, color: '#10b981' },
  { name: 'IVG', value: 18.4, color: '#a855f7' },
  { name: 'Hayat', value: 5.6, color: '#ef4444' },
  { name: 'Higo', value: 4.0, color: '#22c55e' },
  { name: 'Pixi', value: 3.8, color: '#fb923c' },
  { name: 'Elf Bar', value: 3.0, color: '#38bdf8' },
  { name: 'Other', value: 7.5, color: '#f59e0b' },
];

export const PURCHASE_SOURCE_DATA = [
  { name: 'Cash & Carry', value: 29, color: '#6366f1' },
  { name: 'Bookers', value: 22.8, color: '#10b981' },
  { name: 'VSL/Vape', value: 14.2, color: '#a855f7' },
  { name: 'United WS', value: 9.9, color: '#f59e0b' },
  { name: 'Southall', value: 5.8, color: '#22c55e' },
  { name: 'Online', value: 5.4, color: '#38bdf8' },
  { name: 'Other', value: 12.9, color: '#ef4444' },
];

export const POUCH_SUPPLIER_DATA = [
  { name: 'Velo', value: 43.6, color: '#6366f1' },
  { name: 'Pablo', value: 15.9, color: '#10b981' },
  { name: 'Zyn', value: 9.7, color: '#f59e0b' },
  { name: 'Killa', value: 7.9, color: '#22c55e' },
  { name: 'Nordic Spirit', value: 7.7, color: '#ef4444' },
  { name: 'Other', value: 15.2, color: '#a855f7' },
];

export const VISIT_TYPE_DATA = [
  { name: 'First Visits', value: 120, color: '#6366f1' },
  { name: 'Revisits', value: 280, color: '#10b981' },
  { name: 'Phone Calls', value: 85, color: '#f59e0b' },
];

export const SURVEY_DM_DATA = [
  { name: 'Yes', value: 266, color: '#10b981' },
  { name: 'No', value: 410, color: '#ef4444' },
];

export const SURVEY_STOCKING_DATA = [
  { name: 'Yes', value: 204, color: '#10b981' },
  { name: 'No', value: 472, color: '#ef4444' },
];

export const REVENUE_COLLECTIONS_DATA = [
  { month: 'Oct', revenue: 220, collected: 198 },
  { month: 'Nov', revenue: 245, collected: 230 },
  { month: 'Dec', revenue: 310, collected: 280 },
  { month: 'Jan', revenue: 280, collected: 260 },
  { month: 'Feb', revenue: 295, collected: 270 },
  { month: 'Mar', revenue: 320, collected: 300 },
  { month: 'Apr', revenue: 342.8, collected: 310 },
];

export const CUSTOMER_BALANCE_RANKING = [
  { name: 'London Vape Hub', outstanding: '£5,200', overdue: '£2,100', status: 'critical' },
  { name: 'Glasgow Distribution', outstanding: '£3,100', overdue: '£450', status: 'warning' },
  { name: 'Manchester Vape Store', outstanding: '£2,900', overdue: '£0', status: 'success' },
  { name: 'Birmingham Wholesale', outstanding: '£1,852', overdue: '£0', status: 'success' },
  { name: 'Leeds Cash & Carry', outstanding: '£1,300', overdue: '£0', status: 'success' },
];

export const OPERATIONAL_ALERTS = [
  { title: 'FBU Stockout', desc: 'Lost Mary BM6000 · Whse A', amount: '12 orders', type: 'critical' },
  { title: 'Delayed Fulfillment', desc: 'Batch #842 · > 6hrs', amount: '84 units', type: 'warning' },
  { title: '21-day overdue', desc: '2 customers · immediate action', amount: '£940', type: 'critical' },
  { title: '14-day overdue', desc: '4 invoices pending', amount: '£1,850', type: 'warning' },
  { title: 'New FBU Supplier', desc: 'Vaporesso · Onboarded', amount: 'Active', type: 'info' },
];

export const WAREHOUSE_OPS_DATA = [
  { id: 'W1', name: 'Warehouse A', status: 'Active', load: 85, picking: 12, packing: 8, shipped: 45 },
  { id: 'W2', name: 'Warehouse B', status: 'Active', load: 42, picking: 5, packing: 3, shipped: 22 },
  { id: 'W3', name: 'Warehouse C', status: 'Maintenance', load: 0, picking: 0, packing: 0, shipped: 0 },
];

export const BATCH_EXPIRY_ALERTS = [
  { batch: 'B-842', product: 'Lost Mary BM600', expiry: '2026-05-15', daysLeft: 45, status: 'warning' },
  { batch: 'B-901', product: 'Elf Bar 600', expiry: '2026-04-10', daysLeft: 9, status: 'critical' },
  { batch: 'B-772', product: 'SKE Crystal', expiry: '2026-08-20', daysLeft: 141, status: 'success' },
];

export const TEAM_TOTALS = [
  { label: 'Visits', value: '676', color: 'indigo' },
  { label: 'App DL', value: '90', color: 'emerald' },
  { label: 'Boxes', value: '229', color: 'amber' },
  { label: 'CDUs', value: '30', color: 'purple' },
  { label: 'Sales', value: '36', color: 'emerald' },
];

export const INVENTORY_STOCK_DATA = [
  {
    product: 'Lost Mary NERA 15K POD',
    total: 12540,
    required: 15000,
    flavours: [
      { name: 'Triple Mango', stock: 2185, health: 'green' },
      { name: 'Watermelon Ice', stock: 1605, health: 'green' },
      { name: 'Strawberry Watermelon', stock: 800, health: 'amber' },
      { name: 'Pink Lemonade', stock: 656, health: 'amber' },
      { name: 'Mango Peach Papaya', stock: 300, health: 'amber' },
      { name: 'Strawberry Raspberry', stock: 5, health: 'red' },
    ]
  },
  {
    product: 'Hawcos Crystal 600 KIT',
    total: 10220,
    required: 15000,
    flavours: [
      { name: 'Blue Razz Lemonade', stock: 3200, health: 'green' },
      { name: 'Strawberry Ice', stock: 2800, health: 'green' },
      { name: 'Watermelon', stock: 1500, health: 'green' },
      { name: 'Mixed Berry', stock: 1220, health: 'green' },
      { name: 'Peach Mango', stock: 900, health: 'amber' },
      { name: 'Grape Ice', stock: 600, health: 'amber' },
    ]
  },
  {
    product: 'Lost Mary BM6000 KIT',
    total: 8430,
    required: 12000,
    flavours: [
      { name: 'Pink Lemonade', stock: 2100, health: 'green' },
      { name: 'Blue Razz Ice', stock: 1800, health: 'green' },
      { name: 'Mango Ice', stock: 1500, health: 'green' },
      { name: 'Cola Ice', stock: 1200, health: 'green' },
      { name: 'Mint', stock: 830, health: 'amber' },
      { name: 'Cherry', stock: 200, health: 'red' },
    ]
  },
  {
    product: 'Lost Mary NERA 30K KIT',
    total: 7300,
    required: 12000,
    flavours: [
      { name: 'Watermelon Ice', stock: 2400, health: 'green' },
      { name: 'Triple Mango', stock: 1900, health: 'green' },
      { name: 'Strawberry Kiwi', stock: 1500, health: 'green' },
      { name: 'Blueberry Pomegranate', stock: 1000, health: 'green' },
      { name: 'Lychee Ice', stock: 500, health: 'amber' },
    ]
  },
  {
    product: 'Lost Mary BM6000 POD',
    total: 6390,
    required: 10000,
    flavours: [
      { name: 'Pink Lemonade', stock: 2000, health: 'green' },
      { name: 'Blue Razz', stock: 1500, health: 'green' },
      { name: 'Cola Ice', stock: 1100, health: 'green' },
      { name: 'Strawberry Banana', stock: 890, health: 'amber' },
      { name: 'Watermelon Bubblegum', stock: 900, health: 'amber' },
    ]
  },
  {
    product: 'Lost Mary OS5000 KIT',
    total: 5400,
    required: 8000,
    flavours: [
      { name: 'Triple Mango', stock: 1800, health: 'green' },
      { name: 'Watermelon Ice', stock: 1400, health: 'green' },
      { name: 'Strawberry Ice Cream', stock: 1100, health: 'green' },
      { name: 'Blueberry Sour Raspberry', stock: 700, health: 'amber' },
      { name: 'Peach', stock: 400, health: 'amber' },
    ]
  },
  {
    product: 'Fummi Vapes 12000 POD',
    total: 4800,
    required: 10000,
    flavours: [
      { name: 'Strawberry Mango', stock: 1600, health: 'green' },
      { name: 'Blue Razz', stock: 1200, health: 'green' },
      { name: 'Watermelon Ice', stock: 1000, health: 'green' },
      { name: 'Grape Ice', stock: 700, health: 'amber' },
      { name: 'Mint', stock: 300, health: 'amber' },
    ]
  },
  {
    product: 'Velo Nicotine Pouch',
    total: 3300,
    required: 10000,
    flavours: [
      { name: 'Ice Cool', stock: 1200, health: 'green' },
      { name: 'Tropic Breeze', stock: 900, health: 'amber' },
      { name: 'Crispy Peppermint', stock: 700, health: 'amber' },
      { name: 'Freeze', stock: 500, health: 'amber' },
    ]
  },
  {
    product: 'Crystal Pro Max 4000',
    total: 2100,
    required: 5000,
    flavours: [
      { name: 'Blue Razz Lemonade', stock: 700, health: 'amber' },
      { name: 'Strawberry Watermelon', stock: 600, health: 'amber' },
      { name: 'Mango Ice', stock: 400, health: 'amber' },
      { name: 'Watermelon', stock: 400, health: 'amber' },
    ]
  },
  {
    product: 'Elux Legend 3500',
    total: 1500,
    required: 6000,
    flavours: [
      { name: 'Strawberry Ice', stock: 600, health: 'amber' },
      { name: 'Blue Razz', stock: 400, health: 'amber' },
      { name: 'Watermelon Ice', stock: 300, health: 'red' },
      { name: 'Mango', stock: 200, health: 'red' },
    ]
  },
].sort((a, b) => b.total - a.total);

export const REVENUE_TREND_DATA = [
  { month: 'Oct', revenue: 220000, target: 250000 },
  { month: 'Nov', revenue: 245000, target: 250000 },
  { month: 'Dec', revenue: 310000, target: 300000 },
  { month: 'Jan', revenue: 280000, target: 300000 },
  { month: 'Feb', revenue: 295000, target: 300000 },
  { month: 'Mar', revenue: 320000, target: 310000 },
  { month: 'Apr', revenue: 342800, target: 320000 },
];

export const RECENT_ORDERS = [
  { id: '#326', customer: 'London C&C', amount: '£1,988', status: 'Pending' },
  { id: '#325', customer: 'Manchester VS', amount: '£840', status: 'Paid' },
  { id: '#324', customer: 'Birmingham WS', amount: '£1,320', status: 'Disputed' },
  { id: '#323', customer: 'Glasgow Dist.', amount: '£490', status: 'Paid' },
  { id: '#322', customer: 'Leeds C&C', amount: '£2,100', status: 'Processing' },
];

export const GROUPED_KPI_DATA = {
  sales: {
    title: 'SALES ACTIVITY',
    icon: TrendingUp,
    color: 'blue',
    items: [
      { label: 'REVENUE TODAY', value: '£12,450', trend: '+12%', trendColor: 'text-emerald-500' },
      { label: 'REVENUE (MONTH)', value: '£284,000', trend: '+8%', trendColor: 'text-emerald-500' },
      { label: 'ORDERS TODAY', value: '42', trend: '+5%', trendColor: 'text-emerald-500' },
      { label: 'ORDERS (MONTH)', value: '1,240', trend: '+15%', trendColor: 'text-emerald-500' },
      { label: 'TOTAL CUSTOMERS', value: '842', trend: '+2%', trendColor: 'text-emerald-500' },
      { label: 'ACTIVE CUSTOMERS', value: '612', trend: '+4%', trendColor: 'text-emerald-500' },
      { label: 'ACTIVE CARTS', value: '18', trend: '+3%', trendColor: 'text-emerald-500' },
      { label: 'DRAFT ORDERS', value: '12', trend: '£3.4k value', trendColor: 'text-slate-400' },
    ]
  },
  finance: {
    title: 'FINANCIAL HEALTH',
    icon: Wallet,
    color: 'amber',
    items: [
      { label: 'TOTAL RECEIVABLE', value: '£142,500', trend: '+5%', trendColor: 'text-emerald-500' },
      { label: 'PENDING PAYMENTS', value: '£28,400', trend: '-2%', trendColor: 'text-rose-500' },
      { label: 'OVERDUE PAYMENTS', value: '£12,750', trend: '+10%', trendColor: 'text-rose-500' },
      { label: 'TOTAL REVENUE', value: '£1.2M', trend: '+15%', trendColor: 'text-emerald-500' },
      { label: 'RECEIVED TODAY', value: '£8,420', trend: '+20%', trendColor: 'text-emerald-500' },
    ]
  },
  inventory: {
    title: 'INVENTORY STATUS',
    icon: Warehouse,
    color: 'emerald',
    items: [
      { label: 'TOTAL SKUS', value: '1,240', trend: 'Stable', trendColor: 'text-slate-400' },
      { label: 'UNITS IN STOCK', value: '84,200', trend: '-5%', trendColor: 'text-rose-500' },
      { label: 'INVENTORY VALUE', value: '£186,420', trend: '+2%', trendColor: 'text-emerald-500' },
      { label: 'LOW STOCK SKUS', value: '38', trend: '+12%', trendColor: 'text-rose-500' },
      { label: 'OUT OF STOCK', value: '12', trend: '-2%', trendColor: 'text-emerald-500' },
      { label: 'OVERSTOCK SKUS', value: '9', trend: 'Tied capital', trendColor: 'text-amber-500' },
    ]
  },
  customers: {
    title: 'CUSTOMER ACTIVITY',
    icon: Users,
    color: 'indigo',
    items: [
      { label: 'TOTAL CUSTOMERS', value: '842', trend: '+2%', trendColor: 'text-emerald-500' },
      { label: 'ACTIVE THIS WEEK', value: '156', trend: '+12%', trendColor: 'text-emerald-500' },
      { label: 'NEW SIGNUPS', value: '24', trend: '+5%', trendColor: 'text-emerald-500' },
      { label: 'RETENTION RATE', value: '92%', trend: '+1%', trendColor: 'text-emerald-500' },
    ]
  },
  fbu: {
    title: 'FBU OPERATIONS',
    icon: Package,
    color: 'purple',
    items: [
      { label: 'FBU ORDERS (MONTH)', value: '1,240', trend: '+15%', trendColor: 'text-emerald-500' },
      { label: 'AVG. FULFILLMENT', value: '4.2 hrs', trend: '-12m', trendColor: 'text-emerald-500' },
      { label: 'WH ACCURACY', value: '99.8%', trend: '+0.1%', trendColor: 'text-emerald-500' },
      { label: 'FBU REVENUE', value: '£142.5k', trend: '+18%', trendColor: 'text-emerald-500' },
      { label: 'PROCESSING', value: '84', trend: 'Active', trendColor: 'text-amber-500' },
    ]
  }
};

export const REP_VISIT_DATA_DASHBOARD = [
  { name: 'Chloe B.', visits: 44, appCount: 0, boxesSold: 0, salesCount: 0 },
  { name: 'Dan S.', visits: 68, appCount: 0, boxesSold: 0, salesCount: 0 },
  { name: 'Serine H.', visits: 88, appCount: 0, boxesSold: 0, salesCount: 0 },
  { name: 'Joanne B.', visits: 150, appCount: 22, boxesSold: 72, salesCount: 13 },
  { name: 'Emma L.', visits: 147, appCount: 27, boxesSold: 90, salesCount: 15 },
  { name: 'Sean D.', visits: 179, appCount: 41, boxesSold: 67, salesCount: 8 },
];

export const TOP_SELLING_DATA = [
  { name: 'Lost Mary BM600', value: 820, color: '#6366f1' },
  { name: 'Autumn Mango', value: 491, color: '#10b981' },
  { name: 'Fummi Vapes', value: 382, color: '#a855f7' },
  { name: 'Lost Mary Threshade', value: 351, color: '#f59e0b' },
  { name: 'Gum Bar', value: 319, color: '#ef4444' },
];

export const TOP_SELLING_PRODUCTS_DATA = [
  { rank: 1, product: 'Lost Mary NERA 15K POD', category: 'Disposable Vape', boxes: 820, units: 4100, trend: 'up' },
  { rank: 2, product: 'Hawcos Crystal 600 KIT', category: 'Kit', boxes: 712, units: 3560, trend: 'up' },
  { rank: 3, product: 'Lost Mary BM6000 KIT', category: 'Kit', boxes: 634, units: 3170, trend: 'up' },
  { rank: 4, product: 'Fummi Vapes 12000 POD', category: 'Disposable Vape', boxes: 591, units: 2955, trend: 'down' },
  { rank: 5, product: 'Lost Mary BM6000 POD', category: 'Pod', boxes: 480, units: 2400, trend: 'up' },
  { rank: 6, product: 'Velo Nicotine Pouch', category: 'Nicotine Pouch', boxes: 445, units: 2225, trend: 'up' },
  { rank: 7, product: 'Lost Mary NERA 30K KIT', category: 'Kit', boxes: 398, units: 1990, trend: 'down' },
  { rank: 8, product: 'Crystal Pro Max 4000', category: 'Disposable Vape', boxes: 361, units: 1805, trend: 'up' },
  { rank: 9, product: 'Lost Mary OS5000 KIT', category: 'Kit', boxes: 290, units: 1450, trend: 'down' },
  { rank: 10, product: 'Elux Legend 3500', category: 'Disposable Vape', boxes: 244, units: 1220, trend: 'up' },
];

export const CUSTOMER_LEDGER_PREVIEW_DATA = [
  { customer: 'London Vape Hub', orders: 42, paid: '£18,400', balance: '£5,200', overdue: '£2,100' },
  { customer: 'Manchester Vape Store', orders: 18, paid: '£12,900', balance: '£2,900', overdue: '£0' },
  { customer: 'Birmingham Wholesale', orders: 15, paid: '£8,490', balance: '£1,852', overdue: '£450' },
  { customer: 'Glasgow Distribution', orders: 11, paid: '£6,200', balance: '£3,100', overdue: '£0' },
  { customer: 'Leeds Cash & Carry', orders: 24, paid: '£15,200', balance: '£1,300', overdue: '£0' },
  { customer: 'Bristol Vape Direct', orders: 9, paid: '£4,800', balance: '£950', overdue: '£200' },
];

export const ACTIVE_CARTS_DATA = [
  { customer: 'Vape World London', items: 12, value: '£420', lastActivity: '2 mins ago' },
  { customer: 'Cloud Nine Manchester', items: 5, value: '£185', lastActivity: '15 mins ago' },
  { customer: 'The Vape Shop Birmingham', items: 8, value: '£310', lastActivity: '45 mins ago' },
  { customer: 'Elite Vapes Glasgow', items: 15, value: '£540', lastActivity: '1 hour ago' },
  { customer: 'Vape Haven Leeds', items: 3, value: '£95', lastActivity: '3 hours ago' },
];

export const CREDIT_RISK_CUSTOMERS_DATA = [
  { name: 'Vape World London', balance: '£5,200', limit: '£5,000', risk: 'High' },
  { name: 'Cloud Nine Manchester', balance: '£2,900', limit: '£10,000', risk: 'Low' },
  { name: 'The Vape Shop Birmingham', balance: '£1,852', limit: '£2,000', risk: 'Medium' },
  { name: 'Elite Vapes Glasgow', balance: '£3,100', limit: '£3,000', risk: 'High' },
  { name: 'Vape Haven Leeds', balance: '£1,300', limit: '£5,000', risk: 'Low' },
];

export const SALES_BY_TERRITORY_DATA = [
  { name: 'London', value: 124500, color: '#6366f1' },
  { name: 'Manchester', value: 84200, color: '#10b981' },
  { name: 'Birmingham', value: 62150, color: '#f59e0b' },
  { name: 'Liverpool', value: 45800, color: '#ef4444' },
  { name: 'Glasgow', value: 38400, color: '#a855f7' },
];

export const DAILY_ORDERS_ACTIVITY_DATA = [
  { day: 'Mon', created: 42, completed: 38, blocked: 4 },
  { day: 'Tue', created: 56, completed: 50, blocked: 6 },
  { day: 'Wed', created: 48, completed: 45, blocked: 3 },
  { day: 'Thu', created: 62, completed: 58, blocked: 4 },
  { day: 'Fri', created: 75, completed: 70, blocked: 5 },
  { day: 'Sat', created: 32, completed: 30, blocked: 2 },
  { day: 'Sun', created: 28, completed: 25, blocked: 3 },
];

export const SALES_REPRESENTATIVES_DATA: SalesRep[] = [
  { id: 'rep-1', name: 'John Smith', photo: 'https://i.pravatar.cc/150?u=rep1', mobile: '+44 7700 900123', email: 'john.smith@demand.com', territory: 'London', status: 'Active', joinedDate: 'Jan 2023', specialization: 'Key Accounts', bio: 'Expert in London wholesale market with 5+ years experience.', metrics: { customers: 124, sales: '£42,500' }, commissionLedger: [
    { id: 'c1', date: '2026-03-01', orderId: 'ORD-1001', customerName: 'London Retailers Ltd', saleAmount: 100000, commissionPercentage: 1, commissionAmount: 1000, paymentReceived: 100000, paymentReceivedDate: '2026-03-05', maturedDate: '2026-03-05', releaseDate: '2026-03-05', status: 'Paid', commissionPaid: 1000, balance: 0 },
    { id: 'c2', date: '2026-03-05', orderId: 'ORD-1005', customerName: 'Metro Mart', saleAmount: 50000, commissionPercentage: 0.5, commissionAmount: 250, paymentReceived: 50000, paymentReceivedDate: '2026-03-10', maturedDate: '2026-03-10', releaseDate: '2026-03-20', status: 'Released', commissionPaid: 0, balance: 250 },
    { id: 'c3', date: '2026-03-10', orderId: 'ORD-1012', customerName: 'City Grocers', saleAmount: 120000, commissionPercentage: 0.8, commissionAmount: 960, paymentReceived: 120000, paymentReceivedDate: '2026-03-25', maturedDate: '2026-03-25', releaseDate: '2026-04-24', status: 'Matured', commissionPaid: 0, balance: 250 },
    { id: 'c4', date: '2026-03-15', orderId: 'ORD-1025', customerName: 'East End Foods', saleAmount: 80000, commissionPercentage: 1, commissionAmount: 800, paymentReceived: 80000, paymentReceivedDate: '2026-03-20', maturedDate: '2026-03-20', releaseDate: '2026-03-20', status: 'Released', commissionPaid: 0, balance: 1050 },
    { id: 'c5', date: '2026-03-20', orderId: 'ORD-1038', customerName: 'West Side Stores', saleAmount: 150000, commissionPercentage: 0.5, commissionAmount: 750, paymentReceived: 0, status: 'Pending', commissionPaid: 0, balance: 1050 },
  ]},
  { id: 'rep-2', name: 'Emma Wilson', photo: 'https://i.pravatar.cc/150?u=rep2', mobile: '+44 7700 900456', email: 'emma.wilson@demand.com', territory: 'Manchester', status: 'Active', joinedDate: 'Mar 2023', specialization: 'New Business', bio: 'Specializes in identifying and onboarding high-growth retailers.', metrics: { customers: 98, sales: '£38,200' }, commissionLedger: [
    { id: 'c6', date: '2026-03-02', orderId: 'ORD-1002', customerName: 'Northern Goods', saleAmount: 80000, commissionPercentage: 1, commissionAmount: 800, paymentReceived: 80000, paymentReceivedDate: '2026-03-05', maturedDate: '2026-03-05', releaseDate: '2026-03-05', status: 'Paid', commissionPaid: 800, balance: 0 },
    { id: 'c7', date: '2026-03-08', orderId: 'ORD-1009', customerName: 'Manchester Mart', saleAmount: 60000, commissionPercentage: 0.5, commissionAmount: 300, paymentReceived: 60000, paymentReceivedDate: '2026-03-15', maturedDate: '2026-03-15', releaseDate: '2026-04-14', status: 'Matured', commissionPaid: 0, balance: 0 },
    { id: 'c8', date: '2026-03-12', orderId: 'ORD-1018', customerName: 'Peak Distro', saleAmount: 100000, commissionPercentage: 0.7, commissionAmount: 700, paymentReceived: 0, status: 'Pending', commissionPaid: 0, balance: 0 },
  ]},
  { id: 'rep-3', name: 'David Brown', photo: 'https://i.pravatar.cc/150?u=rep3', mobile: '+44 7700 900789', email: 'david.brown@demand.com', territory: 'Birmingham', status: 'Active', joinedDate: 'Jun 2023', specialization: 'Customer Retention', bio: 'Focused on building long-term relationships and loyalty.', metrics: { customers: 86, sales: '£31,400' }, commissionLedger: [] },
  { id: 'rep-4', name: 'Sarah Davis', photo: 'https://i.pravatar.cc/150?u=rep4', mobile: '+44 7700 900012', email: 'sarah.davis@demand.com', territory: 'Liverpool', status: 'Inactive', joinedDate: 'Sep 2023', specialization: 'Market Analysis', bio: 'Data-driven approach to sales and territory management.', metrics: { customers: 54, sales: '£18,900' }, commissionLedger: [] },
  { id: 'rep-5', name: 'Michael Chen', photo: 'https://i.pravatar.cc/150?u=rep5', mobile: '+44 7700 900345', email: 'michael.chen@demand.com', territory: 'London', status: 'Active', joinedDate: 'Nov 2022', specialization: 'Enterprise Sales', bio: 'Strategic account manager for large-scale distribution networks.', metrics: { customers: 112, sales: '£45,800' }, commissionLedger: [] },
  { id: 'rep-6', name: 'Sophie Taylor', photo: 'https://i.pravatar.cc/150?u=rep6', mobile: '+44 7700 900678', email: 'sophie.taylor@demand.com', territory: 'Glasgow', status: 'Active', joinedDate: 'Feb 2023', specialization: 'Regional Expansion', bio: 'Driving growth in the Scottish market through local partnerships.', metrics: { customers: 75, sales: '£29,100' }, commissionLedger: [] },
  { id: 'rep-7', name: 'James Wilson', photo: 'https://i.pravatar.cc/150?u=rep7', mobile: '+44 7700 900901', email: 'james.wilson@demand.com', territory: 'Bristol', status: 'Active', joinedDate: 'May 2023', specialization: 'Logistics Optimization', bio: 'Expert in supply chain coordination and delivery efficiency.', metrics: { customers: 62, sales: '£24,500' }, commissionLedger: [] },
  { id: 'rep-8', name: 'Olivia Jones', photo: 'https://i.pravatar.cc/150?u=rep8', mobile: '+44 7700 900234', email: 'olivia.jones@demand.com', territory: 'Leeds', status: 'Active', joinedDate: 'Aug 2023', specialization: 'Product Specialist', bio: 'Deep knowledge of product catalog and technical specifications.', metrics: { customers: 89, sales: '£33,700' }, commissionLedger: [] },
];

export const TOP_CUSTOMERS_DATA = [
  { name: 'London Vape Hub', rep: 'John Smith', revenue: '£18,400', orders: 42 },
  { name: 'Manchester Vape Store', rep: 'Emma Wilson', revenue: '£12,900', orders: 18 },
  { name: 'Birmingham Wholesale', rep: 'David Brown', revenue: '£8,490', orders: 15 },
  { name: 'Glasgow Distribution', rep: 'Sean D.', revenue: '£6,200', orders: 11 },
  { name: 'Leeds Cash & Carry', rep: 'Emma L.', revenue: '£15,200', orders: 24 },
];

export const REP_PERFORMANCE_TREND = [
  { week: 'W1', sales: 8500 },
  { week: 'W2', sales: 12400 },
  { week: 'W3', sales: 9800 },
  { week: 'W4', sales: 11800 },
];

export const REP_CUSTOMERS_DATA = [
  { name: 'Vape City London', balance: '£1,200', orders: 12, lastOrder: '2024-03-20' },
  { name: 'Cloud Hub', balance: '£850', orders: 8, lastOrder: '2024-03-18' },
  { name: 'Vape Direct', balance: '£2,100', orders: 15, lastOrder: '2024-03-22' },
  { name: 'The Vape Shop', balance: '£0', orders: 5, lastOrder: '2024-03-15' },
];

export const SYSTEM_NOTIFICATIONS = [
  { id: 1, type: 'info', message: 'System backup completed successfully', time: '10 mins ago' },
  { id: 2, type: 'warning', message: 'Inventory sync delayed for 5 SKUs', time: '25 mins ago' },
  { id: 3, type: 'critical', message: 'Payment gateway connection timeout', time: '45 mins ago' },
  { id: 4, type: 'success', message: 'New sales rep "John Doe" added to system', time: '2 hours ago' },
];

export const STOCK_MOVEMENT_CHART_DATA = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Stock In',
      data: [4200, 3500, 5100, 4800, 6200, 2100, 1500],
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      fill: true,
      tension: 0.4,
    },
    {
      label: 'Stock Out',
      data: [3800, 4100, 4200, 5300, 5800, 1900, 1200],
      borderColor: '#ef4444',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      fill: true,
      tension: 0.4,
    },
  ],
};

export const DECISION_MAKER_DATA = [
  { name: 'Present', value: 340, color: '#10b981' },
  { name: 'Not Present', value: 145, color: '#ef4444' },
];

export const PAYMENT_STATUS_DATA = [
  { name: 'Paid', value: 450, color: '#10b981' },
  { name: 'Pending', value: 120, color: '#f59e0b' },
  { name: 'Overdue', value: 45, color: '#ef4444' },
];

export const LOW_STOCK_PRODUCTS_DATA = [
  { name: 'Lost Mary BM600', stock: 12, min: 50 },
  { name: 'Crystal Pro Max', stock: 8, min: 40 },
  { name: 'Elux Legend', stock: 15, min: 60 },
  { name: 'Velo Polar Mint', stock: 5, min: 30 },
  { name: 'Lost Mary NERA', stock: 2, min: 20 },
];

export const TOP_VALUE_PRODUCTS_DATA = [
  { name: 'Lost Mary NERA 30K', value: 24500 },
  { name: 'Crystal Pro Max 4K', value: 18200 },
  { name: 'Velo Nicotine Pouches', value: 15400 },
  { name: 'Lost Mary BM6000', value: 12900 },
  { name: 'Elux Legend 3500', value: 9800 },
];

export const CUSTOMER_LOCATIONS = [
  { city: 'London', count: 251, lat: 51.5074, lng: -0.1278 },
  { city: 'Birmingham', count: 72, lat: 52.4862, lng: -1.8904 },
  { city: 'Manchester', count: 145, lat: 53.4808, lng: -2.2426 },
  { city: 'Bristol', count: 49, lat: 51.4545, lng: -2.5879 },
  { city: 'Liverpool', count: 142, lat: 53.4084, lng: -2.9916 },
  { city: 'Glasgow', count: 145, lat: 55.8642, lng: -4.2518 },
  { city: 'Edinburgh', count: 98, lat: 55.9533, lng: -3.1883 },
  { city: 'Cardiff', count: 142, lat: 51.4816, lng: -3.1791 },
  { city: 'Exeter', count: 72, lat: 50.7260, lng: -3.5275 },
  { city: 'Newport', count: 65, lat: 51.5842, lng: -2.9977 },
];

// --- Inventory Analytics Data ---

export const BRAND_SKU_MOVEMENT_DATA = [
  { brand: 'Lost Mary', fast: 82000, slow: 12000, dead: 4500 },
  { brand: 'Elfbar', fast: 73000, slow: 16000, dead: 5300 },
  { brand: 'Hawcos', fast: 48000, slow: 8500, dead: 2800 },
  { brand: 'Velo', fast: 22000, slow: 5400, dead: 1800 },
  { brand: 'Geekvape', fast: 18500, slow: 4200, dead: 1400 },
];

export const TOP_BRAND_BREAKDOWN_DATA = [
  { product: 'Nera 30K Kit', fast: 42000, slow: 5800, dead: 1500 },
  { product: 'Nera 15K Pod', fast: 28000, slow: 4200, dead: 1200 },
  { product: 'BM6000 Kit', fast: 18000, slow: 3200, dead: 900 },
  { product: 'BM6000 Pod', fast: 14000, slow: 2400, dead: 700 },
  { product: 'BM600 Kit', fast: 8000, slow: 3800, dead: 2200 },
];

export const AI_STOCK_INSIGHTS = [
  { text: 'Consider discount on **Cola flavour** across all brands', type: 'action' },
  { text: 'Reduce reorders for Nera 15K PODs', type: 'action' },
  { text: 'Residual stock growing for Crystal Lemon', type: 'warning' },
];

export const WORST_PERFORMING_SKUS = [
  { sku: 'SKUA001', product: 'Lost Mary Nera', brand: 'Lost Mary Nera', type: 'POD', sales: 25, stockGreen: 20, stockOrange: 50, stockRed: 30, stock: 300, status: 'Dead' },
  { sku: 'SKUB002', product: 'HAWCOS Crystal Lemon', brand: 'HAWCOS CRYSTAL', type: 'KIT', sales: 35, stockGreen: 25, stockOrange: 40, stockRed: 35, stock: 250, status: 'At Risk' },
  { sku: 'SKUE789', product: 'ELFBAR Strawberry Kiwi', brand: 'ELFBAR 600', type: 'KIT', sales: 40, stockGreen: 35, stockOrange: 35, stockRed: 30, stock: 175, status: 'Slow' },
  { sku: 'SKUV555', product: 'VELO 17MG', brand: 'VELO', type: 'Pouch', sales: 45, stockGreen: 30, stockOrange: 40, stockRed: 30, stock: 200, status: 'Slow' },
];
