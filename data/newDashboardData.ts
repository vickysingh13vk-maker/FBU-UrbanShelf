// Exact snapshot of the production dashboard at demanddistro.co.uk
// captured 2026-07-07. Sections and figures below are transcribed verbatim
// from that capture so this page mirrors production exactly.

export const QUICK_LINKS_NEW = [
  { title: 'Sales Overview', desc: 'Open sales records', href: '/orders', color: 'green' },
  { title: 'Inventory Overview', desc: 'Open stock details', href: '/inventory', color: 'indigo' },
];

export const KPI_GROUPS_NEW = {
  sales: {
    title: 'SALES',
    items: [
      { label: 'TOTAL SALES', value: '£7.62M' },
      { label: 'TOTAL ORDERS', value: '414' },
      { label: 'SALES TODAY', value: '£38,740.60' },
      { label: 'ORDERS TODAY', value: '5' },
    ],
  },
  customer: {
    title: 'CUSTOMER',
    items: [
      { label: 'TOTAL CUSTOMERS', value: '100' },
      { label: 'ACTIVE CUSTOMERS', value: '71' },
    ],
  },
  finance: {
    title: 'FINANCE',
    items: [
      { label: 'TOTAL RECEIVABLE', value: '£1.39M' },
      { label: 'OVERDUE PAYMENTS', value: '£0.21M' },
      { label: 'TOTAL REVENUE', value: '£7.43M' },
      { label: 'RECEIVED TODAY', value: '£8,889.75' },
    ],
  },
  inventory: {
    title: 'INVENTORY',
    items: [
      { label: 'TOTAL PRODUCTS', value: '2,084' },
      { label: 'UNITS IN STOCK', value: '1.035M' },
      { label: 'INVENTORY VALUE', value: '£2.35M' },
      { label: 'LOW STOCK', value: '213' },
      { label: 'OUT OF STOCK', value: '1,705' },
      { label: 'OVERSTOCK', value: '47' },
    ],
  },
};

export const PAYMENTS_TODAY_NEW = {
  date: '2026-07-07',
  customers: 2,
  payments: 3,
  totalReceived: '£8.9K',
  rows: [
    { customer: 'CTech Wholesale', avatar: 'CW', totalPaid: '£3.9K', paidPct: 78, payments: 2, phone: '8776878767' },
    { customer: '4K LTD', avatar: '4', totalPaid: '£5.0K', paidPct: 100, payments: 1, phone: '07886648105' },
  ],
};

export const INVENTORY_STOCK_OVERVIEW_NEW: { name: string; stock: number; health: 'healthy' | 'low' | 'critical' }[] = [
  { name: 'ELFBAR 600 KIT', stock: 182281, health: 'healthy' },
  { name: 'ELFBAR 600 POD', stock: 64510, health: 'healthy' },
  { name: 'ELFBAR PLUS12 KIT', stock: 16326, health: 'healthy' },
  { name: 'ELFBAR PLUS50 KIT', stock: 7310, health: 'healthy' },
  { name: 'ELFBAR PLUS50 PACK', stock: 2788, health: 'healthy' },
  { name: 'GEEKBAR HAGIMI PRO MAX KIT', stock: 5980, health: 'healthy' },
  { name: 'GEEKBAR HAGIMI PRO MAX POD', stock: 12000, health: 'healthy' },
  { name: 'HAGIMI PRO MAX CDU', stock: 14100, health: 'healthy' },
  { name: 'HAWCOS CRYSTAL 600 KIT', stock: 300538, health: 'healthy' },
  { name: 'HAWCOS CRYSTAL 600 POD', stock: 264550, health: 'healthy' },
  { name: 'LOST MARY BM600 KIT', stock: 8310, health: 'healthy' },
  { name: 'LOST MARY BM600 POD', stock: 1500, health: 'critical' },
  { name: 'LOST MARY BM6000 KIT', stock: 12729, health: 'healthy' },
  { name: 'LOST MARY BM6000 POD', stock: 2335, health: 'healthy' },
  { name: 'LOST MARY NERA 15K POD', stock: 116684, health: 'healthy' },
  { name: 'LOST MARY NERA 30K KIT', stock: 8243, health: 'healthy' },
  { name: 'LOST MARY NERA15K KIT', stock: 71115, health: 'healthy' },
  { name: 'OXVA NEXLIM CARTRIDGE', stock: 0, health: 'critical' },
  { name: 'OXVA NEXLIM GO KIT', stock: 1216, health: 'critical' },
  { name: 'OXVA NEXLIM KIT', stock: 0, health: 'critical' },
  { name: 'OXVA XLIM GO 2 KIT', stock: 800, health: 'critical' },
  { name: 'OXVA XLIM GO LITE KIT', stock: 2000, health: 'low' },
  { name: 'OXVA XLIM PRO 3 KIT', stock: 940, health: 'critical' },
  { name: 'OXVA XLIM TOP FILL CARTRIDGE', stock: 0, health: 'critical' },
  { name: 'VELO NICOTINE POUCHE 10MG', stock: 11725, health: 'healthy' },
  { name: 'VELO NICOTINE POUCHE 14MG', stock: 3100, health: 'healthy' },
  { name: 'VELO NICOTINE POUCHE 17MG', stock: 4320, health: 'healthy' },
  { name: 'VELO NICOTINE POUCHE 4MG', stock: 0, health: 'critical' },
  { name: 'VELO NICOTINE POUCHE 6MG', stock: 740, health: 'critical' },
  { name: 'VELO NICOTINE POUCHE 8MG', stock: 120, health: 'critical' },
];

export const BALANCE_RANKING_NEW = [
  { name: 'Good one deals u...', outstanding: '£-542875' },
  { name: 'Wholesalers Conn...', outstanding: '£-151799' },
  { name: 'HS VAPES', outstanding: '£-104007' },
  { name: 'Hani Personal', outstanding: '£-94285' },
  { name: 'Washington New ...', outstanding: '£-57246' },
  { name: 'I smoke Smoke', outstanding: '£-56808' },
  { name: 'Unity Cash & Carr...', outstanding: '£-46120' },
  { name: 'CTech Wholesale', outstanding: '£-40385' },
  { name: 'Fair deal Ltd', outstanding: '£-36046' },
  { name: 'Super Optimum Ltd', outstanding: '£-33775' },
];

export const PAYMENT_DUE_28_DAYS_NEW = {
  totalOutstanding: '£212388.88',
  rows: [
    { name: 'Super', email: 'spo@gmail.com', pending: '£33775.24', orders: 3 },
    { name: '4K', email: 'kkdd23@gmail.com', pending: '£33261.50', orders: 2 },
    { name: 'Unity', email: 'unity@453gmail.com', pending: '£23248.00', orders: 1 },
    { name: 'Drinks Wholesale', email: 'hgjahfkjhbkj112@gmail.com', pending: '£21156.00', orders: 1 },
    { name: 'GR8 Vape Ltd', email: 'jgkjdfhkjdg23@gmail.com', pending: '£20664.00', orders: 1 },
    { name: 'JB wholesale', email: 'jags@jb-wholesale.co.uk', pending: '£20068.56', orders: 2 },
    { name: 'Metro Distributor', email: 'metro@2323gmail.com', pending: '£8870.68', orders: 4 },
    { name: 'Crazy', email: 'crazycoud@amil.com', pending: '£8190.00', orders: 3 },
    { name: 'Good one deals', email: 'goodonedealsukltd@gmail.com', pending: '£8190.00', orders: 1 },
    { name: 'Washington', email: 'support@vapeandgo.co.uk', pending: '£8187.20', orders: 1 },
    { name: 'Chill', email: 'dggsdgg2323@gmail.com', pending: '£7156.80', orders: 2 },
    { name: 'S&H CASH & CARRY', email: 'shdbbdah@gmail.com', pending: '£6408.00', orders: 1 },
    { name: 'VIJ', email: 'vij@923gmail.com', pending: '£6044.00', orders: 3 },
    { name: 'Mount', email: 'mountcctest@gmail.com', pending: '£4260.80', orders: 1 },
    { name: 'Urban', email: 'info@urbanshelf.co.uk', pending: '£1514.09', orders: 4 },
    { name: 'Fair deal', email: 'fairdeals@gmail.com', pending: '£1394.00', orders: 1 },
  ],
};

export const SALE_EARNINGS_NEW = [
  { no: 1, person: 'Alex Chawla', earning: '£78.20' },
  { no: 2, person: 'Manjit Singh', earning: '£102.84' },
  { no: 3, person: 'Rishi Arora', earning: '£70.56' },
];

export const TOP_SELLING_NEW = [
  { rank: 1, product: 'LOST MARY NERA 15K POD', category: 'GENERAL', boxes: 36, units: 7200, trend: 'up' },
  { rank: 2, product: 'HAGIMI PRO MAX CDU', category: 'GENERAL', boxes: 113, units: 2250, trend: 'up' },
  { rank: 3, product: 'GEEKBAR HAGIMI PRO MAX POD', category: 'GENERAL', boxes: 10, units: 2000, trend: 'up' },
  { rank: 4, product: 'LOST MARY BM600 KIT', category: 'GENERAL', boxes: 4, units: 1600, trend: 'up' },
  { rank: 5, product: 'LOST MARY NERA15K KIT', category: 'GENERAL', boxes: 14, units: 1400, trend: 'up' },
  { rank: 6, product: 'GEEKBAR HAGIMI PRO MAX KIT', category: 'GENERAL', boxes: 10, units: 1000, trend: 'down' },
  { rank: 7, product: 'LOST MARY BM6000 POD', category: 'GENERAL', boxes: 5, units: 1000, trend: 'down' },
  { rank: 8, product: 'ELFBAR 600 POD', category: 'GENERAL', boxes: 4, units: 800, trend: 'down' },
  { rank: 9, product: 'LOST MARY BM6000 KIT', category: 'GENERAL', boxes: 1, units: 350, trend: 'down' },
  { rank: 10, product: 'ELFBAR PLUS12 KIT', category: 'GENERAL', boxes: 2, units: 300, trend: 'down' },
];

// Approximated from the chart curve (no data labels were present on the source chart)
export const REVENUE_TREND_NEW = [
  { day: 'Sun', revenue: 2000, target: 50000 },
  { day: 'Mon', revenue: 33000, target: 50000 },
  { day: 'Tue', revenue: 47000, target: 50000 },
  { day: 'Wed', revenue: 1000, target: 50000 },
  { day: 'Thu', revenue: 0, target: 50000 },
  { day: 'Fri', revenue: 0, target: 50000 },
  { day: 'Sat', revenue: 0, target: 50000 },
];

export const RECENT_ORDERS_NEW = [
  { id: '1446', customer: 'MJ Toor', status: 'Approved' },
  { id: '1445', customer: 'MJ Toor', status: 'Approved' },
  { id: '1444', customer: 'Washington N...', status: 'Approved' },
  { id: '1443', customer: 'SATNAM ENTER...', status: 'Approved' },
  { id: '1442', customer: 'Washington N...', status: 'Approved' },
];

export const ACTIVE_CARTS_BADGE_NEW = '13 Active';

export const ACTIVE_CARTS_NEW = [
  { name: 'D6', avatar: 'D', items: 1, value: '£0.00' },
  { name: 'Unknown', avatar: 'U', items: 9, value: '£0.00' },
  { name: 'Northampton', avatar: 'N', items: 4, value: '£4200.00' },
  { name: 'Midlands Cash & Carry', avatar: 'M', items: 1, value: '£0.00' },
  { name: 'Kings', avatar: 'K', items: 1, value: '£0.00' },
];

// Approximated bar heights read from the chart (In / mid-series / Out; the source
// legend only labels two of the three series it renders)
export const INVENTORY_MOVEMENT_NEW = [
  { brand: 'Lost Mary', in: 190, mid: 135, out: 35 },
  { brand: 'Elf Bar', in: 55, mid: 35, out: 15 },
  { brand: 'Velo', in: 5, mid: 15, out: 20 },
  { brand: 'Geekbar', in: 2, mid: 20, out: 10 },
  { brand: 'OXVA', in: 0, mid: 0, out: 55 },
];

export const VISIT_TYPE_DISTRIBUTION_NEW = [
  { name: 'First Visits', value: 120, color: '#6366f1' },
  { name: 'Revisits', value: 280, color: '#10b981' },
  { name: 'Phone Calls', value: 85, color: '#f59e0b' },
];

export const DECISION_MAKER_SURVEY_NEW = [
  { name: 'Yes', value: 266, color: '#10b981' },
  { name: 'No', value: 410, color: '#ef4444' },
];

export const SALES_PERFORMANCE_KPI_NEW = {
  totalSales: '£69,314',
  totalOrders: 10,
};

export const SALES_COMMISSION_LEDGER_NEW = [
  { name: 'Rishi Arora', role: 'Sales Rep', earned: '£319.66', paid: '£0.00' },
  { name: 'Alex Chawla', role: 'Sales Rep', earned: '£653.58', paid: '£0.00' },
  { name: 'Manjit Singh', role: 'Sales Rep', earned: '£262.28', paid: '£0.00' },
];

export const FINANCE_PERFORMANCE_KPI_NEW = {
  totalReceivable: '£0',
  overduePayments: '£0',
  totalRevenue: '£69,314',
  receivedToday: '£15,348',
};

export const INVENTORY_PERFORMANCE_KPI_NEW = {
  totalSkus: 614,
  unitsInStock: 1045252,
  inventoryValue: '£2,388,246.56',
  lowStockSkus: 228,
  outOfStock: 225,
  overstockSkus: 50,
};

// Transcribed from the Inventory tab's own capture — a different snapshot from
// INVENTORY_STOCK_OVERVIEW_NEW (used by Admin/Sales/Finance), so kept separate
// rather than overwritten.
export const INVENTORY_TAB_STOCK_NEW: { name: string; stock: number; health: 'healthy' | 'low' | 'critical' }[] = [
  { name: 'VELO NICOTINE POUCHE 4MG', stock: 0, health: 'critical' },
  { name: 'OXVA NEXLIM GO KIT', stock: 2216, health: 'low' },
  { name: 'LOST MARY NERA 30K KIT', stock: 7648, health: 'healthy' },
  { name: 'VELO NICOTINE POUCHE 10MG', stock: 11725, health: 'healthy' },
  { name: 'LOST MARY BM6000 KIT', stock: 8819, health: 'healthy' },
  { name: 'Minecraft Drink', stock: 19002, health: 'healthy' },
  { name: 'ELFBAR PLUS50 PACK', stock: 30118, health: 'healthy' },
  { name: 'ELFBAR PLUS12 KIT', stock: 16326, health: 'healthy' },
  { name: 'LOST MARY NERA 15K POD', stock: 101034, health: 'healthy' },
  { name: 'ELFBAR 600 KIT', stock: 89051, health: 'healthy' },
  { name: 'LOST MARY NERA15K KIT', stock: 65215, health: 'healthy' },
  { name: 'HAWCOS CRYSTAL 600 KIT', stock: 300118, health: 'healthy' },
  { name: 'VELO NICOTINE POUCHE 8MG', stock: 120, health: 'critical' },
  { name: 'VELO NICOTINE POUCHE 17MG', stock: 4320, health: 'healthy' },
  { name: 'VELO NICOTINE POUCHE 14MG', stock: 3100, health: 'healthy' },
  { name: 'ELFBAR 600 POD', stock: 51290, health: 'healthy' },
  { name: 'HAGIMI PRO MAX CDU', stock: 12500, health: 'healthy' },
  { name: 'LOST MARY BM600 KIT', stock: 7440, health: 'healthy' },
  { name: 'LOST MARY BM6000 POD', stock: 2110, health: 'low' },
  { name: 'LOST MARY BM600 POD', stock: 1480, health: 'critical' },
  { name: 'HAWCOS CRYSTAL 600 POD', stock: 264550, health: 'healthy' },
  { name: 'VELO NICOTINE POUCHE 6MG', stock: 740, health: 'critical' },
  { name: 'GEEKBAR HAGIMI PRO MAX POD', stock: 10000, health: 'healthy' },
  { name: 'GEEKBAR HAGIMI PRO MAX KIT', stock: 3980, health: 'healthy' },
  { name: 'ELFBAR PLUS50 KIT', stock: 7310, health: 'healthy' },
  { name: 'OXVA XLIM TOP FILL CARTRIDGE', stock: 9400, health: 'healthy' },
  { name: 'OXVA NEXLIM CARTRIDGE', stock: 5100, health: 'healthy' },
  { name: 'OXVA XLIM PRO 3 KIT', stock: 2640, health: 'low' },
  { name: 'OXVA XLIM GO 2 KIT', stock: 1600, health: 'critical' },
  { name: 'OXVA XLIM GO LITE KIT', stock: 4000, health: 'healthy' },
  { name: 'OXVA NEXLIM KIT', stock: 2300, health: 'low' },
];

export const INVENTORY_AI_INSIGHTS_NEW: { text: string; tag: 'CRITICAL' | 'WARNING' | 'ACTION' }[] = [
  { text: '225 SKUs are out of stock and need immediate restocking.', tag: 'CRITICAL' },
  { text: '228 SKUs are running low (≤1000 units remaining).', tag: 'WARNING' },
  { text: '50 SKUs are overstocked (≥3000 units). Consider running promotions.', tag: 'ACTION' },
  { text: '20 SKUs have zero sales in this period — review for clearance or removal.', tag: 'WARNING' },
  { text: 'Top-selling SKU "ELFBAR 600 KIT" moved 40980 units — ensure adequate stock levels.', tag: 'ACTION' },
];

export const WORST_PERFORMING_SKUS_NEW = [
  { sku: '8008006344939', product: 'LOST MARY BM600 POD', brand: 'Lost Mary', type: 'Lost Mary BM600 Prefilled Pods', sales: 0, stock: 400 },
  { sku: '5000393179500', product: 'VELO NICOTINE POUCHE 10MG', brand: 'Velo', type: 'Velo', sales: 0, stock: 1200 },
  { sku: '5000393179531', product: 'VELO NICOTINE POUCHE 10MG', brand: 'Velo', type: 'Velo', sales: 0, stock: 960 },
  { sku: '5000393190796', product: 'VELO NICOTINE POUCHE 14MG', brand: 'Velo', type: 'Velo', sales: 0, stock: 120 },
  { sku: '5000393190611', product: 'VELO NICOTINE POUCHE 14MG', brand: 'Velo', type: 'Velo', sales: 0, stock: 80 },
  { sku: '5000393021588', product: 'VELO NICOTINE POUCHE 8MG', brand: 'Velo', type: 'Velo', sales: 0, stock: 110 },
  { sku: '5000393184252', product: 'VELO NICOTINE POUCHE 10MG', brand: 'Velo', type: 'Velo', sales: 0, stock: 50 },
  { sku: '5000393191069', product: 'VELO NICOTINE POUCHE 10MG', brand: 'Velo', type: 'Velo', sales: 0, stock: 1200 },
  { sku: '699f2ce5803910e6c52ec5d8', product: 'LOST MARY BM6000 POD', brand: 'Lost Mary', type: 'Lost Mary BM 6000 Prefilled Pods', sales: 0, stock: 400 },
  { sku: '69a6255f33ab25f42e7e6bcc', product: 'LOST MARY BM600 KIT', brand: 'Lost Mary', type: 'Lost Mary BM600 Prefilled Kits', sales: 0, stock: 400 },
  { sku: '8008006337092', product: 'LOST MARY BM600 KIT', brand: 'Lost Mary', type: 'Lost Mary BM600 Prefilled Kits', sales: 0, stock: 400 },
  { sku: '69af32fdf23b451a66fe8d17', product: 'LOST MARY BM6000 POD', brand: 'Lost Mary', type: 'Lost Mary BM 6000 Prefilled Pods', sales: 0, stock: 200 },
  { sku: '69af32f6f23b451a66fe8d16', product: 'LOST MARY BM6000 POD', brand: 'Lost Mary', type: 'Lost Mary BM 6000 Prefilled Pods', sales: 0, stock: 200 },
  { sku: '6a313ee92598aa64f84a9954', product: 'LOST MARY BM6000 KIT', brand: 'Lost Mary', type: 'Lost Mary BM 6000 Prefilled Kits', sales: 0, stock: 200 },
  { sku: '6a400265196f09d7bb0fbcd9', product: 'LOST MARY BM6000 POD', brand: 'Lost Mary', type: 'Lost Mary BM 6000 Prefilled Kits', sales: 0, stock: 200 },
  { sku: '6a400402196f09d7bb1042ed', product: 'LOST MARY BM600 KIT', brand: 'Lost Mary', type: 'LOST MARY BM600 KIT', sales: 0, stock: 400 },
  { sku: '6a400403196f09d7bb1042f7', product: 'LOST MARY BM600 KIT', brand: 'Lost Mary', type: 'LOST MARY BM600 KIT', sales: 0, stock: 400 },
  { sku: '6a400405196f09d7bb104301', product: 'LOST MARY BM600 KIT', brand: 'Lost Mary', type: 'LOST MARY BM600 KIT', sales: 0, stock: 400 },
  { sku: '6a400408196f09d7bb10430b', product: 'LOST MARY BM600 KIT', brand: 'Lost Mary', type: 'LOST MARY BM600 KIT', sales: 0, stock: 400 },
  { sku: '6a4933573859280db358e79a', product: 'OXVA XLIM PRO 3 KIT', brand: 'OXVA', type: 'OXVA XLIM PRO 3 KIT', sales: 0, stock: 300 },
];

export const CUSTOMER_LOCATIONS_NEW = [
  { city: 'Southall, West London', lat: 51.5077, lng: -0.3720, count: 1 },
  { city: 'City of London / Westminster', lat: 51.5074, lng: -0.1278, count: 1 },
];

export interface LedgerRowNew {
  customer: string;
  orders: number;
  paid: number;
  balance: number;
}

export const CUSTOMER_LEDGER_NEW: LedgerRowNew[] = [
  { customer: 'Piperfinn Limited', orders: 2, paid: 59345, balance: -57246 },
  { customer: 'MJ', orders: 2, paid: 5440, balance: -16294 },
  { customer: 'Satnam Enterprise Uk', orders: 2, paid: 50000, balance: 0 },
  { customer: 'Wholesalers Connect Ltd', orders: 1, paid: 30731, balance: -151799 },
  { customer: 'Unity', orders: 1, paid: 0, balance: -46120 },
  { customer: 'Snow Wolf Vaping Unit Limited', orders: 1, paid: 20006, balance: -7452 },
  { customer: 'Blue Dragon', orders: 1, paid: 4505, balance: 0 },
  { customer: 'Demand Distribution ltd', orders: 0, paid: 0, balance: -53 },
  { customer: 'Samsons', orders: 0, paid: 0, balance: -9714 },
  { customer: 'Master Vape Charles', orders: 0, paid: 5760, balance: 0 },
  { customer: 'D6 Global Ltd', orders: 0, paid: 0, balance: 0 },
  { customer: 'N&S CC', orders: 0, paid: 1562, balance: 0 },
  { customer: 'TNS Retail Limited, T/A TNS Wholesale', orders: 0, paid: 35216, balance: -6552 },
  { customer: 'Arrow Wholesale Group Ltd', orders: 0, paid: 74822, balance: 0 },
  { customer: 'Urban Shelf', orders: 0, paid: 0, balance: -1514 },
  { customer: 'Super Optimum Ltd', orders: 0, paid: 60071, balance: -33775 },
  { customer: 'Arcstrading', orders: 0, paid: 1282, balance: 0 },
  { customer: 'JNR', orders: 0, paid: 8280, balance: 0 },
  { customer: 'urban shelf', orders: 0, paid: 0, balance: -168 },
  { customer: 'Sun Plus Cash & Carry', orders: 0, paid: 18823, balance: 0 },
  { customer: 'ANAH LTD', orders: 0, paid: 0, balance: 0 },
  { customer: 'S&H CASH & CARRY LTD', orders: 0, paid: 7860, balance: -19 },
  { customer: '4K', orders: 0, paid: 10000, balance: -33261 },
  { customer: 'RM Vape', orders: 0, paid: 18018, balance: 0 },
  { customer: 'NEW M & J TRADING LIMITED', orders: 0, paid: 0, balance: 0 },
  { customer: 'Fair Deal Trade Limited', orders: 0, paid: 18620, balance: -36046 },
  { customer: 'Demand Samples', orders: 0, paid: 0, balance: 0 },
  { customer: 'AIRTELL UK LTD', orders: 0, paid: 7469, balance: -8190 },
  { customer: 'AM MCR Ltd', orders: 0, paid: 20149, balance: 0 },
  { customer: 'JB wholesale Ltd', orders: 0, paid: 68742, balance: -19791 },
  { customer: 'Revenue User', orders: 0, paid: 0, balance: 0 },
  { customer: 'BKS TRADELINE LIMITED', orders: 0, paid: 68064, balance: -21240 },
  { customer: 'GG Ltd', orders: 0, paid: 41, balance: 0 },
  { customer: 'Good one deals', orders: 0, paid: 20010, balance: -542875 },
  { customer: 'MIDLANDS CASH & CARRY LIMITED', orders: 0, paid: 549, balance: 0 },
  { customer: 'I smoke', orders: 0, paid: 563128, balance: -56808 },
  { customer: 'Manjit', orders: 0, paid: 21034, balance: 0 },
  { customer: 'Budha Ch', orders: 0, paid: 3682, balance: 0 },
  { customer: 'Vape Factory Manchester', orders: 0, paid: 6150, balance: 0 },
  { customer: 'Vape Universe', orders: 0, paid: 0, balance: 0 },
  { customer: 'Vape Mart', orders: 0, paid: 10980, balance: 0 },
  { customer: 'Vape Corner', orders: 0, paid: 475, balance: 0 },
  { customer: 'VIJ Bhm', orders: 0, paid: 13461, balance: -5120 },
  { customer: 'Unique Distribution', orders: 0, paid: 100091, balance: 0 },
  { customer: 'Ubon Ltd', orders: 0, paid: 0, balance: 0 },
  { customer: 'Tip Top', orders: 0, paid: 0, balance: 0 },
  { customer: 'Star Trading', orders: 0, paid: 0, balance: 0 },
  { customer: 'Ekam impex LTD Singh newcastle', orders: 0, paid: 27950, balance: -8372 },
  { customer: 'SHS Vape', orders: 0, paid: 2957, balance: 0 },
  { customer: 'Se7en Wholesale', orders: 0, paid: 0, balance: 0 },
  { customer: 'Puff Stuff', orders: 0, paid: 49041, balance: -3212 },
  { customer: 'Pretty Women-247 BGM', orders: 0, paid: 0, balance: 0 },
  { customer: 'PNS', orders: 0, paid: 37848, balance: -4666 },
  { customer: 'Pltinum vapes', orders: 0, paid: 4486, balance: -1739 },
  { customer: 'Phone & vape', orders: 0, paid: 15326, balance: -6610 },
  { customer: 'Nihal', orders: 0, paid: 2560, balance: 0 },
  { customer: 'Multichannel', orders: 0, paid: 21410, balance: 0 },
  { customer: 'Middlesex cash & Carry', orders: 0, paid: 0, balance: 0 },
  { customer: 'Micromax', orders: 0, paid: 13390, balance: 0 },
  { customer: 'Metro MCR', orders: 0, paid: 14648, balance: 0 },
  { customer: 'Metro Distributor', orders: 0, paid: 14556, balance: -8871 },
  { customer: 'MCR vaping', orders: 0, paid: 2296, balance: 0 },
  { customer: 'M&I WHOLESALERS LIMITED', orders: 0, paid: 6453, balance: 0 },
  { customer: 'London Vape RHR', orders: 0, paid: 14000, balance: -360 },
  { customer: 'Kings cc', orders: 0, paid: 6560, balance: 0 },
  { customer: 'Khushal', orders: 0, paid: 0, balance: 0 },
  { customer: 'Hani Personal', orders: 0, paid: 54000, balance: -94284 },
  { customer: 'Hanco Liverpool', orders: 0, paid: 22731, balance: -1001 },
  { customer: 'Green Line', orders: 0, paid: 14117, balance: 0 },
  { customer: 'GR8 Shop', orders: 0, paid: 0, balance: 0 },
  { customer: 'Good Deals', orders: 0, paid: 0, balance: 0 },
  { customer: 'Guardian', orders: 0, paid: 0, balance: 0 },
  { customer: 'Global MCR', orders: 0, paid: 7817, balance: -1201 },
  { customer: 'Foxergo', orders: 0, paid: 0, balance: 0 },
  { customer: 'Fone Link', orders: 0, paid: 0, balance: 0 },
  { customer: 'Fizzy uk', orders: 0, paid: 7843, balance: 0 },
  { customer: 'Euroclick', orders: 0, paid: 29402, balance: 0 },
  { customer: 'ELbrook', orders: 0, paid: 0, balance: -21156 },
  { customer: 'Dimark', orders: 0, paid: 16181, balance: -2419 },
  { customer: 'Dii cc', orders: 0, paid: 0, balance: -11400 },
  { customer: 'CosmicUK', orders: 0, paid: 25851, balance: -15484 },
  { customer: 'CTech', orders: 0, paid: 21141, balance: -40385 },
  { customer: 'Chill connect', orders: 0, paid: 18170, balance: -6199 },
  { customer: 'Ecig Distribution', orders: 0, paid: 7596, balance: 0 },
  { customer: 'Black Bird', orders: 0, paid: 0, balance: 0 },
  { customer: 'Best Trade', orders: 0, paid: 1000, balance: -3604 },
  { customer: 'Bagga Brent', orders: 0, paid: 0, balance: 0 },
  { customer: 'GR8 Vape Ltd MCR', orders: 0, paid: 12286, balance: -20664 },
  { customer: 'Airtel', orders: 0, paid: 16782, balance: -3912 },
  { customer: 'ADMM Limited', orders: 0, paid: 48512, balance: -639 },
  { customer: 'A2Z Mcr', orders: 0, paid: 0, balance: 0 },
  { customer: 'E Smoking', orders: 0, paid: 48081, balance: 0 },
  { customer: 'Waterloo', orders: 0, paid: 77312, balance: -4418 },
  { customer: 'Balham Food and Wine', orders: 0, paid: 4893, balance: 0 },
  { customer: 'HS VAPES', orders: 0, paid: 44975, balance: -104007 },
  { customer: 'Rajshekhar', orders: 0, paid: 7296, balance: 0 },
  { customer: 'TJ Trade Limited', orders: 0, paid: 0, balance: 0 },
  { customer: 'FMCG Ltd', orders: 0, paid: 34618, balance: -8587 },
  { customer: 'WELCOME VAPE', orders: 0, paid: 10368, balance: -1320 },
  { customer: 'ABVJ', orders: 0, paid: 34810, balance: 0 },
];
