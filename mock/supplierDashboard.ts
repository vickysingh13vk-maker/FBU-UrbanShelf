export interface Flavour {
  name: string;
  stock: number;
  health: 'green' | 'amber' | 'red';
}

export interface TopProduct {
  rank: number;
  name: string;
  category: string;
  boxesSold: number;
  units: number;
  revenue: number;
  trend: 'up' | 'down';
  flavours: Flavour[];
}

export interface RevenueDataPoint {
  month: string;
  revenue: number;
}

export interface StockDataPoint {
  name: string;
  value: number;
  color: string;
}

export interface RecentOrder {
  id: string;
  buyer: string;
  product: string;
  qty: number;
  status: string;
  earnings: string;
}

export interface DemandForecastPoint {
  day: string;
  current: number;
  predicted: number;
}

export interface CustomerBehaviorPoint {
  name: string;
  value: number;
}

export interface InventoryCoverageItem {
  name: string;
  stock: number;
  daily: number;
  coverage: number;
}

export interface InventoryStockItem {
  product: string;
  total: number;
  required: number;
  flavours: Flavour[];
}

export const TOP_PRODUCTS: TopProduct[] = [
  {
    rank: 1,
    name: 'Lost Mary NERA 15K POD',
    category: 'DISPOSABLE VAPE',
    boxesSold: 820,
    units: 4100,
    revenue: 32800,
    trend: 'up',
    flavours: [
      { name: 'Triple Mango', stock: 1200, health: 'green' },
      { name: 'Watermelon Ice', stock: 950, health: 'green' },
      { name: 'Pink Lemonade', stock: 800, health: 'green' },
      { name: 'Blue Razz', stock: 700, health: 'amber' },
      { name: 'Cola Ice', stock: 450, health: 'amber' },
    ]
  },
  {
    rank: 2,
    name: 'Hawcos Crystal 600 KIT',
    category: 'KIT',
    boxesSold: 712,
    units: 3560,
    revenue: 27400,
    trend: 'up',
    flavours: [
      { name: 'Blueberry', stock: 1100, health: 'green' },
      { name: 'Grape', stock: 820, health: 'green' },
      { name: 'Strawberry Ice', stock: 600, health: 'amber' },
      { name: 'Mango', stock: 400, health: 'amber' },
      { name: 'Apple', stock: 640, health: 'green' },
    ]
  },
  {
    rank: 3,
    name: 'Lost Mary BM6000 KIT',
    category: 'KIT',
    boxesSold: 634,
    units: 3170,
    revenue: 21000,
    trend: 'up',
    flavours: [
      { name: 'Lemon Lime', stock: 900, health: 'green' },
      { name: 'Cherry Ice', stock: 750, health: 'green' },
      { name: 'Fizzy Cherry', stock: 600, health: 'green' },
      { name: 'Banana Ice', stock: 400, health: 'amber' },
      { name: 'Sour Apple', stock: 150, health: 'red' },
    ]
  },
  {
    rank: 4,
    name: 'Fummi Vapes 12000 POD',
    category: 'DISPOSABLE VAPE',
    boxesSold: 591,
    units: 2955,
    revenue: 15600,
    trend: 'down',
    flavours: [
      { name: 'Berry Ice', stock: 800, health: 'green' },
      { name: 'Menthol', stock: 500, health: 'green' },
      { name: 'Tobacco', stock: 400, health: 'amber' },
      { name: 'Peach Ice', stock: 250, health: 'amber' },
    ]
  },
  {
    rank: 5,
    name: 'Lost Mary BM6000 POD',
    category: 'POD',
    boxesSold: 480,
    units: 2400,
    revenue: 12000,
    trend: 'up',
    flavours: [
      { name: 'Triple Mango', stock: 1200, health: 'green' },
      { name: 'Watermelon Ice', stock: 950, health: 'green' },
    ]
  },
  {
    rank: 6,
    name: 'Velo Nicotine Pouch',
    category: 'NICOTINE POUCH',
    boxesSold: 445,
    units: 2225,
    revenue: 11000,
    trend: 'up',
    flavours: [
      { name: 'Mint', stock: 1200, health: 'green' },
      { name: 'Berry', stock: 950, health: 'green' },
    ]
  },
  {
    rank: 7,
    name: 'Lost Mary NERA 30K KIT',
    category: 'KIT',
    boxesSold: 398,
    units: 1990,
    revenue: 10000,
    trend: 'down',
    flavours: [
      { name: 'Triple Mango', stock: 1200, health: 'green' },
      { name: 'Watermelon Ice', stock: 950, health: 'green' },
    ]
  },
  {
    rank: 8,
    name: 'Crystal Pro Max 4000',
    category: 'DISPOSABLE VAPE',
    boxesSold: 361,
    units: 1805,
    revenue: 9000,
    trend: 'up',
    flavours: [
      { name: 'Triple Mango', stock: 1200, health: 'green' },
      { name: 'Watermelon Ice', stock: 950, health: 'green' },
    ]
  },
  {
    rank: 9,
    name: 'Lost Mary OS5000 KIT',
    category: 'KIT',
    boxesSold: 290,
    units: 1450,
    revenue: 7000,
    trend: 'down',
    flavours: [
      { name: 'Triple Mango', stock: 1200, health: 'green' },
      { name: 'Watermelon Ice', stock: 950, health: 'green' },
    ]
  },
  {
    rank: 10,
    name: 'Elux Legend 3500',
    category: 'DISPOSABLE VAPE',
    boxesSold: 244,
    units: 1220,
    revenue: 6000,
    trend: 'up',
    flavours: [
      { name: 'Triple Mango', stock: 1200, health: 'green' },
      { name: 'Watermelon Ice', stock: 950, health: 'green' },
    ]
  },
];

export const REVENUE_DATA: RevenueDataPoint[] = [
  { month: 'Jan', revenue: 240000 },
  { month: 'Feb', revenue: 280000 },
  { month: 'Mar', revenue: 310000 },
  { month: 'Apr', revenue: 295000 },
  { month: 'May', revenue: 340000 },
  { month: 'Jun', revenue: 380000 },
  { month: 'Jul', revenue: 420000 },
];

export const STOCK_DATA: StockDataPoint[] = [
  { name: 'Healthy', value: 85, color: '#10b981' },
  { name: 'Low Stock', value: 12, color: '#f59e0b' },
  { name: 'Out of Stock', value: 3, color: '#ef4444' },
];

export const RECENT_ORDERS: RecentOrder[] = [
  { id: '#ORD1021', buyer: 'London Vape Hub', product: 'Lost Mary BM600', qty: 20, status: 'SHIPPED', earnings: '£180' },
  { id: '#ORD1022', buyer: 'Manchester Vape Store', product: 'Elf Bar 600', qty: 15, status: 'PACKED', earnings: '£140' },
  { id: '#ORD1023', buyer: 'Birmingham Vapes', product: 'Crystal Bar 600', qty: 50, status: 'PROCESSING', earnings: '£450' },
  { id: '#ORD1024', buyer: 'Leeds Vape Co', product: 'Lost Mary BM600', qty: 10, status: 'DELIVERED', earnings: '£90' },
];

export const DEMAND_FORECAST_DATA: DemandForecastPoint[] = [
  { day: 'W1', current: 410, predicted: 420 },
  { day: 'W2', current: 415, predicted: 450 },
  { day: 'W3', current: 405, predicted: 480 },
  { day: 'W4', current: 410, predicted: 520 },
];

export const REVENUE_FORECAST_DATA: RevenueDataPoint[] = [
  { month: 'Current', revenue: 284000 },
  { month: 'Next Month (Proj)', revenue: 315000 },
];

export const CUSTOMER_BEHAVIOR_DATA: CustomerBehaviorPoint[] = [
  { name: 'Repeat Purchase', value: 42 },
  { name: 'New Customers', value: 58 },
  { name: 'AOV Growth', value: 15 },
];

export const INVENTORY_COVERAGE: InventoryCoverageItem[] = [
  { name: 'Lost Mary BM600', stock: 5000, daily: 210, coverage: 24 },
  { name: 'Elf Bar 600', stock: 1200, daily: 130, coverage: 9 },
  { name: 'Crystal Bar 600', stock: 2800, daily: 200, coverage: 14 },
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
].sort((a, b) => b.total - a.total);
