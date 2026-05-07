import { Product, Order, Supplier, Category, User, Customer, Cart, Coupon, PricingStrategy, Campaign, Role, Warehouse, Lead, CustomerTimeline, WorkSession, Visit, FollowUp, Task, CollectionAttempt, RoutePlan, Territory, TerritoryPerformance, RepStatus, RepPerformanceMetrics, CustomerHealth, OperationalAlert, TeamAnalytics, LeadAnalytics } from './types';

export const PRODUCTS: Product[] = [
  { id: 'P101', name: 'LOST MARY BM6000 KIT', sku: '69af31c9f23b451a66fe8d05', barcode: '506090000101', category: 'Pre-filled Vape Kits + Pods', supplier: 'Lost Mary', flavour: 'Strawberry Lime', price: 3.85, mrp: 5.99, stock: 1200, reservedStock: 150, damagedStock: 5, status: 'Active', image: 'https://picsum.photos/40/40?random=101', unitsPerCarton: 200, weight: '150g', warehouseLocation: 'Rack A-01', batchNumber: 'B-2024-001', expiryDate: '2025-12-31' },
  { id: 'P102', name: 'LOST MARY BM6000 KIT', sku: '69af31a1f23b451a66fe8d01', barcode: '506090000102', category: 'Pre-filled Vape Kits + Pods', supplier: 'Lost Mary', flavour: 'Pineapple Passion Fruit', price: 3.85, mrp: 5.99, stock: 850, reservedStock: 40, damagedStock: 2, status: 'Active', image: 'https://picsum.photos/40/40?random=102', unitsPerCarton: 200, weight: '150g', warehouseLocation: 'Rack A-02', batchNumber: 'B-2024-002', expiryDate: '2025-11-30' },
  { id: 'P103', name: 'LOST MARY BM6000 KIT', sku: '69af315df23b451a66fe8cfd', barcode: '506090000103', category: 'Pre-filled Vape Kits + Pods', supplier: 'Lost Mary', flavour: 'Watermelon Kiwi', price: 3.85, mrp: 5.99, stock: 450, reservedStock: 0, damagedStock: 0, status: 'Active', image: 'https://picsum.photos/40/40?random=103', unitsPerCarton: 200, weight: '150g', warehouseLocation: 'Rack A-03', batchNumber: 'B-2024-003', expiryDate: '2025-10-15' },
  { id: 'P104', name: 'LOST MARY BM6000 KIT', sku: '69af3131f23b451a66fe8cf9', barcode: '506090000104', category: 'Pre-filled Vape Kits + Pods', supplier: 'Lost Mary', flavour: 'Red Apple Ice', price: 3.85, mrp: 5.99, stock: 300, reservedStock: 20, damagedStock: 1, status: 'Active', image: 'https://picsum.photos/40/40?random=104', unitsPerCarton: 200, weight: '150g', warehouseLocation: 'Rack B-01', batchNumber: 'B-2024-004', expiryDate: '2025-09-20' },
  { id: 'P105', name: 'LOST MARY BM6000 KIT', sku: '69af30b2f23b451a66fe8cf5', barcode: '506090000105', category: 'Pre-filled Vape Kits + Pods', supplier: 'Lost Mary', flavour: 'Blue Razz Cherry', price: 3.85, mrp: 5.99, stock: 200, reservedStock: 10, damagedStock: 0, status: 'Active', image: 'https://picsum.photos/40/40?random=105', unitsPerCarton: 200, weight: '150g', warehouseLocation: 'Rack B-02', batchNumber: 'B-2024-005', expiryDate: '2025-08-10' },
  { id: 'P106', name: 'LOST MARY BM6000 KIT', sku: '69af3071f23b451a66fe8cf1', barcode: '506090000106', category: 'Pre-filled Vape Kits + Pods', supplier: 'Lost Mary', flavour: 'Orange Bruu', price: 3.85, mrp: 5.99, stock: 15, reservedStock: 0, damagedStock: 0, status: 'Low Stock', image: 'https://picsum.photos/40/40?random=106', unitsPerCarton: 200, weight: '150g', warehouseLocation: 'Rack B-03', batchNumber: 'B-2024-006', expiryDate: '2025-07-05' },
  { id: 'P107', name: 'LOST MARY BM600 KIT', sku: '69a6258e33ab25f42e7e6c20', barcode: '506090000107', category: 'Pre-filled Vape Kits + Pods', supplier: 'Lost Mary', flavour: 'Cherry Peach Lemonade', price: 1.79, mrp: 2.99, stock: 400, reservedStock: 0, damagedStock: 0, status: 'Active', image: 'https://picsum.photos/40/40?random=107', unitsPerCarton: 400, weight: '50g', warehouseLocation: 'Rack C-01', batchNumber: 'B-2024-007', expiryDate: '2026-01-01' },
  { id: 'P108', name: 'LOST MARY BM600 KIT', sku: '69a6258d33ab25f42e7e6c1d', barcode: '506090000108', category: 'Pre-filled Vape Kits + Pods', supplier: 'Lost Mary', flavour: 'Blackcurrant Apple', price: 1.79, mrp: 2.99, stock: 400, reservedStock: 0, damagedStock: 0, status: 'Active', image: 'https://picsum.photos/40/40?random=108', unitsPerCarton: 400, weight: '50g', warehouseLocation: 'Rack C-02', batchNumber: 'B-2024-008', expiryDate: '2026-02-15' },
  { id: 'P001', name: 'ELF BAR 600', sku: 'ELF-600', barcode: '506090000001', category: 'Vaping', supplier: 'Elf Bar', flavour: 'Blueberry', price: 3.99, mrp: 5.99, stock: 45, reservedStock: 5, damagedStock: 0, status: 'Low Stock', image: 'https://picsum.photos/40/40?random=1', unitsPerCarton: 10, weight: '45g', warehouseLocation: 'Rack D-01', batchNumber: 'B-2024-009', expiryDate: '2025-06-30' },
];

export const ORDERS: Order[] = [
  { id: '326', customer: 'James Cameron', customerId: 'C001', date: '02/02/2026', total: 1186.26, items: 5, status: 'Approved', paymentStatus: 'Paid', repId: 'U004' },
  { id: '325', customer: 'Sarah Connor', customerId: 'C002', date: '30/01/2026', total: 120.00, items: 2, status: 'Picking', paymentStatus: 'Paid', repId: 'U004' },
  { id: '324', customer: 'Rick Deckard', customerId: 'C004', date: '30/01/2026', total: 260.00, items: 12, status: 'Pending', paymentStatus: 'Pending', repId: 'U010' },
  { id: '322', customer: 'James Cameron', customerId: 'C001', date: '29/01/2026', total: 265.00, items: 1, status: 'Delivered', paymentStatus: 'Paid', repId: 'U004' },
  { id: '321', customer: 'Marty McFly', customerId: 'C006', date: '22/01/2026', total: 327.90, items: 25, status: 'Shipped', paymentStatus: 'Paid', repId: 'U010' },
  { id: '318', customer: 'Ellen Ripley', customerId: 'C003', date: '15/01/2026', total: 284.94, items: 3, status: 'Packed', paymentStatus: 'Paid', repId: 'U010' },
  { id: '317', customer: 'Sarah Connor', customerId: 'C002', date: '13/01/2026', total: 263.08, items: 1, status: 'Delivered', paymentStatus: 'Paid', repId: 'U004' },
  { id: '315', customer: 'James Cameron', customerId: 'C001', date: '10/01/2026', total: 1500.00, items: 8, status: 'Approved', paymentStatus: 'Paid', repId: 'U004' },
  { id: '314', customer: 'Rick Deckard', customerId: 'C004', date: '08/01/2026', total: 45.99, items: 1, status: 'Cancelled', paymentStatus: 'Refunded', repId: 'U010' },
];

export const ACTIVE_CARTS: Cart[] = [
  { id: 'CRT-9001', userEmail: 'james@techhub.com', userName: 'James Cameron', totalItems: 3, totalQty: 15, items: ['LOST MARY BM6000 KIT', 'ELF BAR 600'], lastUpdated: '10 mins ago', created: 'Oct 25, 2023' },
  { id: 'CRT-9002', userEmail: 'sarah@skynet.net', userName: 'Sarah Connor', totalItems: 1, totalQty: 50, items: ['VELO Ice Cool'], lastUpdated: '1 hour ago', created: 'Oct 25, 2023' },
  { id: 'CRT-9003', userEmail: 'rick@tyrell.com', userName: 'Rick Deckard', totalItems: 5, totalQty: 12, items: ['LOST MARY BM6000 KIT', 'VELO Freeze'], lastUpdated: '3 hours ago', created: 'Oct 24, 2023' },
  { id: 'CRT-9004', userEmail: 'marty@hillvalley.com', userName: 'Marty McFly', totalItems: 2, totalQty: 2, items: ['ELF BAR 600'], lastUpdated: '1 day ago', created: 'Oct 23, 2023' },
  { id: 'CRT-9005', userEmail: 'ripley@weyland.com', userName: 'Ellen Ripley', totalItems: 8, totalQty: 100, items: ['VELO Ice Cool', 'ELF BAR 600'], lastUpdated: '2 days ago', created: 'Oct 22, 2023' },
  { id: 'CRT-9006', userEmail: 'walter@white.com', userName: 'Walter White', totalItems: 1, totalQty: 5, items: ['LOST MARY BM6000 KIT'], lastUpdated: '5 days ago', created: 'Oct 20, 2023' },
];

export const CUSTOMERS: Customer[] = [
  {
    id: 'C001', name: 'James Cameron', email: 'james@techhub.com', phone: '+44 7700 900077', mobile: '+44 7800 123456',
    companyName: 'TechHub Ltd', storeName: 'TechHub London', regNo: 'GB12345678',
    address: '123 Tech Street, London, EC1A 1BB', status: 'Approved', walletBalance: 150.00, creditLimit: 5000,
    joinedDate: 'Oct 15, 2023', image: 'https://i.pravatar.cc/150?u=C001',
    category: 'Vaping', supplier: 'Lost Mary',
    assignedRepId: 'U004', assignedRepName: 'John Smith', ownershipStatus: 'assigned',
    lifecycleStage: 'Active', lastContactDate: '2026-05-08T09:15:00Z', nextFollowUp: '2026-05-22T10:00:00Z'
  },
  {
    id: 'C002', name: 'Sarah Connor', email: 'sarah@skynet.net', phone: '+44 7700 900088', mobile: '+44 7800 654321',
    companyName: 'Cyberdyne Systems', storeName: 'Cyberdyne Retail', regNo: 'GB87654321',
    address: '456 Future Rd, Manchester, M1 2AB', status: 'Approved', walletBalance: 45.50, creditLimit: 2500,
    joinedDate: 'Sep 20, 2023', image: 'https://i.pravatar.cc/150?u=C002',
    category: 'Nicotine Pouch', supplier: 'Velo',
    assignedRepId: 'U004', assignedRepName: 'John Smith', ownershipStatus: 'assigned',
    lifecycleStage: 'Active', lastContactDate: '2026-05-07T14:00:00Z', nextFollowUp: '2026-05-09T10:00:00Z'
  },
  {
    id: 'C003', name: 'Ellen Ripley', email: 'ripley@weyland.com', phone: '+44 7700 900099',
    companyName: 'Weyland-Yutani', storeName: 'Nostromo Supplies', regNo: 'GB99887766',
    address: '789 Space Blvd, Liverpool, L3 4CD', status: 'Pending', walletBalance: 0.00, creditLimit: 1000,
    joinedDate: 'Nov 01, 2023',
    category: 'Vaping', supplier: 'Elf Bar',
    assignedRepId: 'U010', assignedRepName: 'Emma Clarke', ownershipStatus: 'assigned',
    lifecycleStage: 'Prospect', lastContactDate: '2026-05-05T11:00:00Z', nextFollowUp: '2026-05-12T11:00:00Z'
  },
  {
    id: 'C004', name: 'Rick Deckard', email: 'rick@tyrell.com', phone: '+44 7700 900100',
    companyName: 'Tyrell Corp', storeName: 'RepliCant', regNo: 'GB55443322',
    address: '2049 Blade Runner St, Los Angeles, LA', status: 'Approved', walletBalance: 500.00, creditLimit: 10000,
    joinedDate: 'Aug 10, 2023', image: 'https://i.pravatar.cc/150?u=C004',
    category: 'Open Devices', supplier: 'Lost Mary',
    assignedRepId: 'U010', assignedRepName: 'Emma Clarke', ownershipStatus: 'assigned',
    lifecycleStage: 'Active', lastContactDate: '2026-05-06T15:30:00Z', nextFollowUp: '2026-05-20T10:00:00Z'
  },
  {
    id: 'C005', name: 'Dana Scully', email: 'dana@fbi.gov', phone: '+44 7700 900101',
    companyName: 'FBI', storeName: 'X-Files Archive', regNo: 'GB11223344',
    address: '1013 Truth Rd, Washington, DC', status: 'Blocked', walletBalance: 120.50, creditLimit: 0,
    joinedDate: 'Jan 12, 2023', image: 'https://i.pravatar.cc/150?u=C005',
    category: 'Deals and Offers', supplier: 'Elf Bar',
    assignedRepId: 'U004', assignedRepName: 'John Smith', ownershipStatus: 'assigned',
    lifecycleStage: 'At Risk', lastContactDate: '2026-04-20T10:00:00Z', nextFollowUp: '2026-05-09T09:00:00Z'
  },
  {
    id: 'C006', name: 'Marty McFly', email: 'marty@hillvalley.com', phone: '+44 7700 900102',
    companyName: 'Doc Brown Ent', storeName: 'Time Travel Emporium', regNo: 'GB99880011',
    address: '88 MPH Lane, Hill Valley, CA', status: 'Approved', walletBalance: 19.85, creditLimit: 1500,
    joinedDate: 'Oct 21, 2023', image: 'https://i.pravatar.cc/150?u=C006',
    category: 'Vaping', supplier: 'Velo',
    assignedRepId: 'U010', assignedRepName: 'Emma Clarke', ownershipStatus: 'assigned',
    lifecycleStage: 'Inactive', lastContactDate: '2026-03-15T13:00:00Z'
  },
];

export const COUPONS: Coupon[] = [
  { id: 'CPN-001', code: 'WELCOME20', type: 'Percentage', value: 20, minOrder: 50, maxDiscount: 100, usageLimit: 1000, usedCount: 450, validFrom: '2023-01-01', validUntil: '2024-12-31', status: 'Active', categories: ['Vaping', 'Nicotine Pouch'] },
  { id: 'CPN-002', code: 'SUMMER10', type: 'Fixed Amount', value: 10, minOrder: 100, maxDiscount: 10, usageLimit: 500, usedCount: 500, validFrom: '2023-06-01', validUntil: '2023-08-31', status: 'Expired', categories: ['Open Devices'] },
  { id: 'CPN-003', code: 'BFCM50', type: 'Percentage', value: 50, minOrder: 200, maxDiscount: 500, usageLimit: 100, usedCount: 0, validFrom: '2024-11-24', validUntil: '2024-11-27', status: 'Upcoming', categories: ['All'] },
  { id: 'CPN-004', code: 'FLASH25', type: 'Percentage', value: 25, minOrder: 0, maxDiscount: 50, usageLimit: 50, usedCount: 12, validFrom: '2023-10-25', validUntil: '2024-10-30', status: 'Active', categories: ['Vaping'] },
  { id: 'CPN-005', code: 'SHIPFREE', type: 'Fixed Amount', value: 15, minOrder: 75, maxDiscount: 15, usageLimit: 2000, usedCount: 1205, validFrom: '2023-01-01', validUntil: '2024-12-31', status: 'Active', categories: ['All'] },
];

export const SUPPLIERS: Supplier[] = [
  { 
    id: 'SUP-001', name: 'Lost Mary', logo: 'https://picsum.photos/32/32?random=10', products: 120, status: 'Active',
    gstNumber: 'GST22AAAAA0000A1Z5',
    contactInfo: { email: 'contact@lostmary.com', phone: '+44 20 7123 4567', address: 'London, UK' },
    bankDetails: { accountName: 'Lost Mary Ltd', accountNumber: '12345678', ifscCode: 'BARC00001', bankName: 'Barclays' },
    isVerified: true
  },
  { 
    id: 'SUP-002', name: 'Elf Bar', logo: 'https://picsum.photos/32/32?random=11', products: 85, status: 'Active',
    gstNumber: 'GST22BBBBB1111B1Z5',
    contactInfo: { email: 'support@elfbar.com', phone: '+44 20 7987 6543', address: 'Manchester, UK' },
    bankDetails: { accountName: 'Elf Bar Distribution', accountNumber: '87654321', ifscCode: 'HSBC00002', bankName: 'HSBC' },
    isVerified: true
  },
  { 
    id: 'SUP-003', name: 'Velo', logo: 'https://picsum.photos/32/32?random=12', products: 45, status: 'Active',
    gstNumber: 'GST22CCCCC2222C1Z5',
    contactInfo: { email: 'info@velo.com', phone: '+44 20 7555 0199', address: 'Bristol, UK' },
    bankDetails: { accountName: 'Velo Global', accountNumber: '11223344', ifscCode: 'LLOY00003', bankName: 'Lloyds' },
    isVerified: false
  },
];

export const WAREHOUSES: Warehouse[] = [
  { id: 'W001', name: 'London Central Hub', location: 'London, UK', capacity: 50000, manager: 'John Smith', status: 'Active' },
  { id: 'W002', name: 'Manchester North', location: 'Manchester, UK', capacity: 30000, manager: 'Emma Wilson', status: 'Active' },
  { id: 'W003', name: 'Birmingham Logistics', location: 'Birmingham, UK', capacity: 25000, manager: 'David Brown', status: 'Inactive' },
];

export const CATEGORIES: Category[] = [
  { id: 'C001', name: 'Vaping', description: 'Vaping products and accessories', products: 450, status: 'Active' },
  { id: 'C002', name: 'Deals and Offers', description: 'Special deals and limited offers', products: 120, status: 'Active' },
  { id: 'C003', name: 'Pre-filled Vape Kits + Pods', description: 'Ready to use vape kits and pods', products: 300, status: 'Active' },
  { id: 'C004', name: 'Nicotine Pouch', description: 'Various nicotine pouches', products: 85, status: 'Active' },
  { id: 'C005', name: 'Open Devices', description: 'Refillable and open vape devices', products: 50, status: 'Active' },
];

export const MODULES = [
  'Dashboard',
  'Analytics',
  'Orders',
  'Products',
  'Suppliers',
  'Categories',
  'Customers',
  'Coupons',
  'Pricing Tiers',
  'Marketing',
  'Loyalty Program',
  'Users',
  'Administration'
];

export const ROLES: Role[] = [
  {
    id: 'R001',
    name: 'Admin',
    description: 'Full system access with all permissions.',
    permissions: MODULES.map(m => ({ module: m, view: true, create: true, edit: true, delete: true }))
  },
  {
    id: 'R002',
    name: 'Manager',
    description: 'Can manage most modules but cannot manage users or administration.',
    permissions: MODULES.map(m => ({ 
      module: m, 
      view: true, 
      create: !['Users', 'Administration'].includes(m), 
      edit: !['Users', 'Administration'].includes(m), 
      delete: false 
    }))
  },
  {
    id: 'R003',
    name: 'Sales Rep',
    description: 'Field sales rep. Manages own customers, creates orders, GPS check-in, views own commission.',
    permissions: MODULES.map(m => ({
      module: m,
      view: ['Dashboard', 'Products', 'Orders', 'Customers'].includes(m),
      create: ['Orders', 'Customers'].includes(m),
      edit: ['Orders', 'Customers'].includes(m),
      delete: false
    }))
  },
  {
    id: 'R006',
    name: 'Sales Manager',
    description: 'Manages sales team. Views rep performance, analytics, commissions, and all customer/order data.',
    permissions: MODULES.map(m => ({
      module: m,
      view: ['Dashboard', 'Analytics', 'Products', 'Orders', 'Customers', 'Suppliers', 'Categories'].includes(m),
      create: ['Orders', 'Customers'].includes(m),
      edit: ['Orders', 'Customers'].includes(m),
      delete: false
    }))
  },
  {
    id: 'R004',
    name: 'Viewer',
    description: 'Read-only access to the system.',
    permissions: MODULES.map(m => ({ module: m, view: true, create: false, edit: false, delete: false }))
  },
  {
    id: 'R005',
    name: 'Supplier',
    description: 'Access for Suppliers to manage their products, orders, and view performance analytics.',
    permissions: MODULES.map(m => ({ 
      module: m, 
      view: ['Dashboard', 'Analytics', 'Products', 'Orders', 'Inventory', 'Suppliers'].includes(m), 
      create: false, 
      edit: false, 
      delete: false 
    }))
  }
];

export const USERS: User[] = [
  { 
    id: 'U001', 
    name: 'John Doe', 
    email: 'admin@urbanshelf.com', 
    password: 'admin123',
    roleId: 'R001', 
    roleName: 'Admin',
    status: 'Active',
    createdDate: '2023-01-01'
  },
  { 
    id: 'U002', 
    name: 'Jane Smith', 
    email: 'manager@urbanshelf.com', 
    password: 'manager123',
    roleId: 'R002', 
    roleName: 'Manager',
    status: 'Active',
    createdDate: '2023-02-15'
  },
  { 
    id: 'U003', 
    name: 'Bob Johnson', 
    email: 'viewer@urbanshelf.com', 
    password: 'password123',
    roleId: 'R004', 
    roleName: 'Viewer',
    status: 'Suspended',
    createdDate: '2023-03-10'
  },
  {
    id: 'U004',
    name: 'John Smith',
    email: 'john.smith@demand.com',
    password: 'sales123',
    roleId: 'R003',
    roleName: 'Sales Rep',
    status: 'Active',
    createdDate: '2023-04-20'
  },
  {
    id: 'U010',
    name: 'Emma Clarke',
    email: 'emma.clarke@demand.com',
    password: 'salesrep123',
    roleId: 'R003',
    roleName: 'Sales Rep',
    status: 'Active',
    createdDate: '2024-01-10'
  },
  {
    id: 'U011',
    name: 'David Patel',
    email: 'david.patel@demand.com',
    password: 'manager123',
    roleId: 'R006',
    roleName: 'Sales Manager',
    status: 'Active',
    createdDate: '2023-06-01'
  },
  { 
    id: 'U005', 
    name: 'Vikram', 
    email: 'vikram.aimshala@gmail.com', 
    password: 'password123',
    roleId: 'R001', 
    roleName: 'Admin',
    status: 'Active',
    createdDate: '2024-03-30'
  },
  {
    id: 'U006',
    name: 'FBU Supplier',
    email: 'supplier@demo.com',
    password: '123456',
    roleId: 'R005',
    roleName: 'Supplier',
    status: 'Active',
    createdDate: '2026-04-01',
    onboardingCompleted: false
  },
  {
    id: 'U007',
    name: 'FBU Supplier',
    email: 'partner@fbu.com',
    password: 'partner123',
    roleId: 'R005',
    roleName: 'Supplier',
    status: 'Active',
    createdDate: '2026-04-01',
    onboardingCompleted: false
  },
  {
    id: 'U008',
    name: 'Demo Supplier',
    email: 'demo@supplier.com',
    password: '123456',
    roleId: 'R005',
    roleName: 'Supplier',
    status: 'Active',
    createdDate: '2026-04-01',
    onboardingCompleted: true
  },
  {
    id: 'U009',
    name: 'Velo UK',
    email: 'velo@supplier.com',
    password: 'velo123',
    roleId: 'R005',
    roleName: 'Supplier',
    status: 'Active',
    createdDate: '2026-04-06',
    onboardingCompleted: false
  },
  {
    id: 'U010',
    name: 'Elf Bar UK',
    email: 'elfbar@supplier.com',
    password: 'elfbar123',
    roleId: 'R005',
    roleName: 'Supplier',
    status: 'Active',
    createdDate: '2026-04-06',
    onboardingCompleted: false
  }
];

export const PRICING_STRATEGIES: PricingStrategy[] = [
  {
    id: 'PS-001',
    name: 'Standard Wholesale',
    description: 'Default tiered pricing for bulk buyers',
    type: 'Global',
    status: 'Active',
    isDefault: true,
    tiers: [
      { name: 'Small Bulk', minQty: 10, maxQty: 49, discount: 5 },
      { name: 'Large Bulk', minQty: 50, maxQty: null, discount: 10 }
    ]
  },
  {
    id: 'PS-002',
    name: 'Volume Breakers',
    description: 'Aggressive discounts for high volume movers',
    type: 'Global',
    status: 'Active',
    isDefault: false,
    tiers: [
      { name: 'Starter', minQty: 5, maxQty: 9, discount: 2 },
      { name: 'Mover', minQty: 10, maxQty: 19, discount: 5 },
      { name: 'Power', minQty: 20, maxQty: null, discount: 8 }
    ]
  },
  {
    id: 'PS-003',
    name: 'VIP Discount',
    description: 'Special pricing for VIP account holders',
    type: 'Global',
    status: 'Inactive',
    isDefault: false,
    tiers: [
      { name: 'All Orders', minQty: 1, maxQty: null, discount: 15 }
    ]
  }
];

export const CAMPAIGNS: Campaign[] = [
  { 
    id: 'CAM-001', 
    title: 'VELO Deal Alert: Buy 10 Sleeves, Get 1 FREE!', 
    subject: 'Special offer just for you!', 
    status: 'DRAFT', 
    audience: 'Approved Users', 
    recipients: 201, 
    delivered: 0, 
    failed: 0, 
    date: 'Oct 26, 2023', 
    sentAt: '' 
  },
  { 
    id: 'CAM-002', 
    title: 'New Product Launch: 4K Monitors', 
    subject: 'Upgrade your workspace today', 
    status: 'SENT', 
    audience: 'All Users', 
    recipients: 1500, 
    delivered: 1480, 
    failed: 20, 
    date: 'Oct 20, 2023', 
    sentAt: 'Oct 20, 2023 10:00 AM' 
  },
  { 
    id: 'CAM-003', 
    title: 'Weekly Newsletter - October #4', 
    subject: 'Industry insights and top picks', 
    status: 'SENT', 
    audience: 'All Users', 
    recipients: 1200, 
    delivered: 1195, 
    failed: 5, 
    date: 'Oct 15, 2023', 
    sentAt: 'Oct 15, 2023 09:30 AM' 
  },
  { 
    id: 'CAM-004', 
    title: 'Flash Sale: 24 Hours Only', 
    subject: 'Don\'t miss out on these deals', 
    status: 'FAILED', 
    audience: 'Approved Users', 
    recipients: 50, 
    delivered: 10, 
    failed: 40, 
    date: 'Oct 10, 2023', 
    sentAt: 'Oct 10, 2023 02:00 PM' 
  },
  {
    id: 'CAM-005',
    title: 'Q4 Wholesale Pricing Update',
    subject: 'Important update regarding your account',
    status: 'SENDING',
    audience: 'Approved Users',
    recipients: 300,
    delivered: 150,
    failed: 0,
    date: 'Oct 27, 2023',
    sentAt: 'Sending now...'
  },
];

// ─── PHASE 2: SALES REP CRM MOCK DATA ────────────────────────────────────────

export const LEADS: Lead[] = [
  {
    id: 'L001', repId: 'U004', repName: 'John Smith',
    businessName: 'Smoke Signal Ltd', contactName: 'Mark Reyes',
    phone: '+44 7700 901001', email: 'mark@smokesignal.com',
    address: '12 Vape Street, London, E1 6RF', category: 'Vaping',
    stage: 'Interested', priority: 'High',
    createdDate: '2026-04-10T09:00:00Z',
    lastContactDate: '2026-05-01T11:30:00Z',
    nextFollowUp: '2026-05-10T10:00:00Z',
    notes: 'Owner interested in Lost Mary range. Has 2 shops in East London.',
    activities: [
      { id: 'LA001', leadId: 'L001', type: 'Call', repId: 'U004', repName: 'John Smith', timestamp: '2026-04-10T09:00:00Z', notes: 'Initial cold call. Owner answered, interested in pricing.', outcome: 'Requested product list', nextAction: 'Send catalogue' },
      { id: 'LA002', leadId: 'L001', type: 'WhatsApp', repId: 'U004', repName: 'John Smith', timestamp: '2026-04-12T14:00:00Z', notes: 'Sent product catalogue via WhatsApp.', outcome: 'Delivered and read' },
      { id: 'LA003', leadId: 'L001', type: 'Stage Change', repId: 'U004', repName: 'John Smith', timestamp: '2026-05-01T11:30:00Z', notes: 'Owner said they are interested, reviewing pricing.', stageFrom: 'Contacted', stageTo: 'Interested' },
    ]
  },
  {
    id: 'L002', repId: 'U004', repName: 'John Smith',
    businessName: 'CloudPuff Retail', contactName: 'Priya Sharma',
    phone: '+44 7700 901002', email: 'priya@cloudpuff.co.uk',
    address: '88 High Road, Birmingham, B4 7SL', category: 'Nicotine Pouch',
    stage: 'Contacted', priority: 'Medium',
    createdDate: '2026-04-20T10:00:00Z',
    lastContactDate: '2026-04-25T09:00:00Z',
    nextFollowUp: '2026-05-08T14:00:00Z',
    notes: 'Small independent shop. Looking to diversify from tobacco.',
    activities: [
      { id: 'LA004', leadId: 'L002', type: 'Visit', repId: 'U004', repName: 'John Smith', timestamp: '2026-04-20T10:00:00Z', notes: 'Walk-in visit. Met owner briefly. Left brochure.', outcome: 'Requested callback next week' },
      { id: 'LA005', leadId: 'L002', type: 'Call', repId: 'U004', repName: 'John Smith', timestamp: '2026-04-25T09:00:00Z', notes: 'Follow-up call. Owner is considering Velo range.', outcome: 'Sending samples', nextAction: 'Call back Friday' },
    ]
  },
  {
    id: 'L003', repId: 'U004', repName: 'John Smith',
    businessName: 'Metro Express News', contactName: 'Dave Okafor',
    phone: '+44 7700 901003',
    address: '5 Station Approach, Leeds, LS1 4DY', category: 'Vaping',
    stage: 'Meeting Scheduled', priority: 'High',
    createdDate: '2026-04-28T08:30:00Z',
    lastContactDate: '2026-05-06T16:00:00Z',
    nextFollowUp: '2026-05-09T11:00:00Z',
    notes: 'Newsagent with 3 branches. Currently buying from competitor at higher price.',
    activities: [
      { id: 'LA006', leadId: 'L003', type: 'Call', repId: 'U004', repName: 'John Smith', timestamp: '2026-04-28T08:30:00Z', notes: 'Cold call. Very interested — competitor prices too high.', outcome: 'Booked meeting' },
      { id: 'LA007', leadId: 'L003', type: 'Stage Change', repId: 'U004', repName: 'John Smith', timestamp: '2026-05-06T16:00:00Z', notes: 'Meeting confirmed for May 9.', stageFrom: 'Contacted', stageTo: 'Meeting Scheduled' },
    ]
  },
  {
    id: 'L004', repId: 'U010', repName: 'Emma Clarke',
    businessName: 'VapeZone UK', contactName: 'Lily Chen',
    phone: '+44 7700 901004', email: 'lily@vapezone.co.uk',
    address: '200 Oxford Street, London, W1D 1NU', category: 'Vaping',
    stage: 'New Lead', priority: 'Medium',
    createdDate: '2026-05-07T15:00:00Z',
    notes: 'Spotted new vape shop during area visit. Manager was friendly.',
    activities: [
      { id: 'LA008', leadId: 'L004', type: 'Note', repId: 'U010', repName: 'Emma Clarke', timestamp: '2026-05-07T15:00:00Z', notes: 'New shop, about 3 months old. Selling generic brands. Good footfall.' },
    ]
  },
  {
    id: 'L005', repId: 'U010', repName: 'Emma Clarke',
    businessName: 'Spark Convenience', contactName: 'Ahmed Hussain',
    phone: '+44 7700 901005',
    address: '14 Spark Lane, Nottingham, NG1 2AB', category: 'Deals and Offers',
    stage: 'Interested', priority: 'High',
    createdDate: '2026-04-15T09:00:00Z',
    lastContactDate: '2026-05-03T12:00:00Z',
    nextFollowUp: '2026-05-09T09:30:00Z',
    notes: 'Convenience store. Very interested in our bundle deals. Price-sensitive buyer.',
    activities: [
      { id: 'LA009', leadId: 'L005', type: 'Call', repId: 'U010', repName: 'Emma Clarke', timestamp: '2026-04-15T09:00:00Z', notes: 'Initial contact. Interested in deal packs.', outcome: 'Requested pricing sheet' },
      { id: 'LA010', leadId: 'L005', type: 'Follow-Up', repId: 'U010', repName: 'Emma Clarke', timestamp: '2026-05-03T12:00:00Z', notes: 'Sent updated pricing. Owner reviewed and wants to discuss further.', outcome: 'Interested', nextAction: 'Call Friday morning' },
    ]
  },
  {
    id: 'L006', repId: 'U010', repName: 'Emma Clarke',
    businessName: 'Daily Stop Ltd', contactName: 'Sara Osei',
    phone: '+44 7700 901006', email: 'sara@dailystop.co.uk',
    address: '33 Park Road, Bristol, BS1 5NF', category: 'Vaping',
    stage: 'Trial Order', priority: 'High',
    createdDate: '2026-04-01T08:00:00Z',
    lastContactDate: '2026-05-05T10:00:00Z',
    nextFollowUp: '2026-05-12T10:00:00Z',
    notes: 'Agreed to trial order of LM BM6000. Needs to see margin before committing.',
    activities: [
      { id: 'LA011', leadId: 'L006', type: 'Visit', repId: 'U010', repName: 'Emma Clarke', timestamp: '2026-04-01T08:00:00Z', notes: 'First visit. Owner runs 2 shops. Very open to switching supplier.' },
      { id: 'LA012', leadId: 'L006', type: 'Stage Change', repId: 'U010', repName: 'Emma Clarke', timestamp: '2026-05-05T10:00:00Z', notes: 'Trial order agreed. £120 initial order placed.', stageFrom: 'Interested', stageTo: 'Trial Order' },
    ]
  },
  {
    id: 'L007', repId: 'U004', repName: 'John Smith',
    businessName: 'TechHub London', contactName: 'James Cameron',
    phone: '+44 7700 900077', email: 'james@techhub.com',
    address: '123 Tech Street, London, EC1A 1BB', category: 'Vaping',
    stage: 'Converted', priority: 'High',
    createdDate: '2023-10-01T10:00:00Z',
    lastContactDate: '2023-10-15T14:00:00Z',
    notes: 'Originally a lead. Converted to full customer after first order.',
    convertedCustomerId: 'C001',
    activities: [
      { id: 'LA013', leadId: 'L007', type: 'Stage Change', repId: 'U004', repName: 'John Smith', timestamp: '2023-10-15T14:00:00Z', notes: 'Customer account created. First order placed.', stageFrom: 'Trial Order', stageTo: 'Converted' },
    ]
  },
  {
    id: 'L008', repId: 'U010', repName: 'Emma Clarke',
    businessName: 'NightOwl Stores', contactName: 'Tom Bradley',
    phone: '+44 7700 901008',
    address: '7 Owl Lane, Sheffield, S1 2DW', category: 'Vaping',
    stage: 'Lost', priority: 'Low',
    createdDate: '2026-03-10T09:00:00Z',
    lastContactDate: '2026-04-01T11:00:00Z',
    notes: 'Was interested but went with competitor offering better credit terms.',
    lostReason: 'Competitor offered 60-day credit; we only offer 30.',
    activities: [
      { id: 'LA014', leadId: 'L008', type: 'Call', repId: 'U010', repName: 'Emma Clarke', timestamp: '2026-03-10T09:00:00Z', notes: 'Initial contact. Seemed interested.' },
      { id: 'LA015', leadId: 'L008', type: 'Stage Change', repId: 'U010', repName: 'Emma Clarke', timestamp: '2026-04-01T11:00:00Z', notes: 'Owner chose competitor due to credit terms.', stageFrom: 'Interested', stageTo: 'Lost' },
    ]
  },
];

export const CUSTOMER_TIMELINES: CustomerTimeline[] = [
  { id: 'CT001', customerId: 'C001', type: 'Visit', repId: 'U004', repName: 'John Smith', timestamp: '2026-05-08T09:15:00Z', notes: 'Visited store. Reviewed new LM range with owner.', outcome: 'Order placed £1,186', nextAction: 'Follow up in 2 weeks' },
  { id: 'CT002', customerId: 'C001', type: 'Order', repId: 'U004', repName: 'John Smith', timestamp: '2026-05-08T09:30:00Z', notes: 'Order #326 placed during visit.', orderId: '326', amount: 1186.26 },
  { id: 'CT003', customerId: 'C001', type: 'Call', repId: 'U004', repName: 'John Smith', timestamp: '2026-04-22T10:00:00Z', notes: 'Monthly check-in call. Stock levels low on BM6000.', outcome: 'Placed restock reminder', nextAction: 'Visit next week' },
  { id: 'CT004', customerId: 'C001', type: 'Payment', repId: 'U004', repName: 'John Smith', timestamp: '2026-04-15T11:00:00Z', notes: 'Cash collection on delivery of order #315.', amount: 1500.00 },
  { id: 'CT005', customerId: 'C002', type: 'Call', repId: 'U004', repName: 'John Smith', timestamp: '2026-05-07T14:00:00Z', notes: 'Called about overdue balance of £45.50.', outcome: 'Owner promised payment by Friday', nextAction: 'Chase Friday if not received' },
  { id: 'CT006', customerId: 'C002', type: 'Visit', repId: 'U004', repName: 'John Smith', timestamp: '2026-04-30T09:30:00Z', notes: 'Regular store visit. Checked stock. Owner happy with Velo range.', outcome: 'No new order today', nextAction: 'Return next month' },
  { id: 'CT007', customerId: 'C003', type: 'Visit', repId: 'U010', repName: 'Emma Clarke', timestamp: '2026-05-05T11:00:00Z', notes: 'First visit to Nostromo Supplies. Account still pending approval.', outcome: 'Owner completed KYC form', nextAction: 'Chase approval with admin' },
  { id: 'CT008', customerId: 'C003', type: 'Follow-Up', repId: 'U010', repName: 'Emma Clarke', timestamp: '2026-04-25T10:00:00Z', notes: 'Chased account approval status.', outcome: 'Admin said 5 more days', nextAction: 'Visit again when approved' },
  { id: 'CT009', customerId: 'C004', type: 'Visit', repId: 'U010', repName: 'Emma Clarke', timestamp: '2026-05-06T15:30:00Z', notes: 'Routine visit. Took order #324.', outcome: 'Order placed £260', nextAction: 'Deliver Friday' },
  { id: 'CT010', customerId: 'C004', type: 'Order', repId: 'U010', repName: 'Emma Clarke', timestamp: '2026-05-06T15:45:00Z', notes: 'Order #324 placed.', orderId: '324', amount: 260.00 },
  { id: 'CT011', customerId: 'C005', type: 'Call', repId: 'U004', repName: 'John Smith', timestamp: '2026-04-20T10:00:00Z', notes: 'Account blocked due to non-payment. Called to discuss.', outcome: 'Owner disputing invoice. Escalated to manager.', nextAction: 'Manager to call back' },
  { id: 'CT012', customerId: 'C006', type: 'Note', repId: 'U010', repName: 'Emma Clarke', timestamp: '2026-03-15T13:00:00Z', notes: 'Store has been quiet. Owner mentioned possible closure.', nextAction: 'Check in again in 6 weeks' },
];

export const WORK_SESSIONS: WorkSession[] = [
  {
    id: 'WS001', repId: 'U004', repName: 'John Smith',
    date: '2026-05-07', startTime: '2026-05-07T08:30:00Z', endTime: '2026-05-07T17:45:00Z',
    status: 'ended', totalVisits: 6, totalOrders: 3, totalCollections: 480.00, totalRevenue: 1846.26,
    summary: { duration: 555, visits: 6, orders: 3, collections: 480, revenue: 1846.26, leadsAdded: 1, followUpsCompleted: 2 }
  },
  {
    id: 'WS002', repId: 'U004', repName: 'John Smith',
    date: '2026-05-06', startTime: '2026-05-06T08:00:00Z', endTime: '2026-05-06T16:30:00Z',
    status: 'ended', totalVisits: 5, totalOrders: 2, totalCollections: 265.00, totalRevenue: 1451.26,
    summary: { duration: 510, visits: 5, orders: 2, collections: 265, revenue: 1451.26, leadsAdded: 0, followUpsCompleted: 1 }
  },
  {
    id: 'WS003', repId: 'U010', repName: 'Emma Clarke',
    date: '2026-05-07', startTime: '2026-05-07T09:00:00Z', endTime: '2026-05-07T17:00:00Z',
    status: 'ended', totalVisits: 4, totalOrders: 2, totalCollections: 120.00, totalRevenue: 587.90,
    summary: { duration: 480, visits: 4, orders: 2, collections: 120, revenue: 587.90, leadsAdded: 1, followUpsCompleted: 0 }
  },
];

export const VISITS: Visit[] = [
  {
    id: 'V001', customerId: 'C001', customerName: 'TechHub London', repId: 'U004', repName: 'John Smith',
    status: 'completed', date: '2026-05-08', startTime: '2026-05-08T09:00:00Z', endTime: '2026-05-08T09:45:00Z', durationMinutes: 45,
    gpsLat: 51.5074, gpsLng: -0.1278,
    objectives: [
      { id: 'O001', type: 'Order', description: 'Take monthly restock order', completed: true },
      { id: 'O002', type: 'Collection', description: 'Collect outstanding £150', completed: false },
    ],
    outcome: { orderAmount: 1186.26, orderId: '326', collectionAmount: 0, productsDiscussed: ['Lost Mary BM6000', 'Elf Bar 600'], notes: 'Owner happy with new range. Placed large order.', customerSatisfaction: 5 },
    notes: 'Great visit. Owner very receptive to new LM range.', sessionId: 'WS001',
  },
  {
    id: 'V002', customerId: 'C002', customerName: 'Cyberdyne Retail', repId: 'U004', repName: 'John Smith',
    status: 'completed', date: '2026-05-08', startTime: '2026-05-08T11:00:00Z', endTime: '2026-05-08T11:30:00Z', durationMinutes: 30,
    gpsLat: 51.5150, gpsLng: -0.1415,
    objectives: [
      { id: 'O003', type: 'Collection', description: 'Collect overdue balance £45.50', completed: true },
      { id: 'O004', type: 'Order', description: 'Discuss new Velo range', completed: true },
    ],
    outcome: { collectionAmount: 45.50, productsDiscussed: ['Velo Nicotine Pouches'], notes: 'Collected balance. Owner interested in Velo 11mg.', customerSatisfaction: 4 },
    notes: 'Quick efficient visit.', sessionId: 'WS001',
  },
  {
    id: 'V003', customerId: 'C001', customerName: 'TechHub London', repId: 'U004', repName: 'John Smith',
    status: 'completed', date: '2026-05-07', startTime: '2026-05-07T09:30:00Z', endTime: '2026-05-07T10:15:00Z', durationMinutes: 45,
    gpsLat: 51.5074, gpsLng: -0.1278,
    objectives: [{ id: 'O005', type: 'Relationship', description: 'Monthly check-in', completed: true }],
    outcome: { productsDiscussed: ['Lost Mary BM6000'], notes: 'Routine check-in. Stock levels reviewed.', customerSatisfaction: 4 },
    notes: 'Good relationship maintained.', sessionId: 'WS001',
  },
  {
    id: 'V004', customerId: 'C002', customerName: 'Cyberdyne Retail', repId: 'U004', repName: 'John Smith',
    status: 'completed', date: '2026-05-06', startTime: '2026-05-06T10:00:00Z', endTime: '2026-05-06T10:25:00Z', durationMinutes: 25,
    gpsLat: 51.5150, gpsLng: -0.1415,
    objectives: [{ id: 'O006', type: 'Collection', description: 'First collection attempt', completed: false }],
    outcome: { productsDiscussed: [], notes: 'Owner not available. Left message.', customerSatisfaction: 2 },
    notes: 'Unsuccessful collection — owner absent.', sessionId: 'WS002',
  },
  {
    id: 'V005', customerId: 'C005', customerName: 'X-Files Archive', repId: 'U004', repName: 'John Smith',
    status: 'completed', date: '2026-05-06', startTime: '2026-05-06T14:00:00Z', endTime: '2026-05-06T14:40:00Z', durationMinutes: 40,
    gpsLat: 51.4900, gpsLng: -0.1900,
    objectives: [
      { id: 'O007', type: 'Collection', description: 'Discuss disputed invoice', completed: true },
      { id: 'O008', type: 'Relationship', description: 'Repair relationship', completed: true },
    ],
    outcome: { productsDiscussed: [], notes: 'Owner agreed to pay 50% now, rest by end of month.', customerSatisfaction: 3 },
    notes: 'Sensitive visit. Managed well.', sessionId: 'WS002',
  },
  {
    id: 'V006', customerId: 'C002', customerName: 'Cyberdyne Retail', repId: 'U004', repName: 'John Smith',
    status: 'planned', date: '2026-05-09', startTime: '2026-05-09T10:00:00Z',
    gpsLat: 51.5150, gpsLng: -0.1415,
    objectives: [
      { id: 'O009', type: 'Collection', description: 'Collect promised balance', completed: false },
      { id: 'O010', type: 'Order', description: 'New Velo order', completed: false },
    ],
    notes: 'Owner promised to have cash ready.',
  },
];

export const FOLLOW_UPS: FollowUp[] = [
  { id: 'FU001', type: 'Payment Reminder', repId: 'U004', customerId: 'C002', customerName: 'Cyberdyne Retail', dueDate: '2026-05-07', status: 'Overdue', priority: 'High', notes: 'Overdue balance £45.50 — chase immediately.' },
  { id: 'FU002', type: 'Collection Follow-Up', repId: 'U004', customerId: 'C005', customerName: 'X-Files Archive', dueDate: '2026-05-08', status: 'Overdue', priority: 'High', notes: 'Second half of disputed invoice due.', linkedVisitId: 'V005' },
  { id: 'FU003', type: 'Callback', repId: 'U004', leadId: 'L002', leadName: 'CloudPuff Retail', dueDate: '2026-05-08', status: 'Pending', priority: 'Medium', notes: 'Owner asked for callback this afternoon re: pricing.' },
  { id: 'FU004', type: 'Revisit', repId: 'U004', customerId: 'C001', customerName: 'TechHub London', dueDate: '2026-05-22', status: 'Pending', priority: 'Medium', notes: 'Monthly revisit — check BM6000 stock levels.', linkedVisitId: 'V001' },
  { id: 'FU005', type: 'Trial Follow-Up', repId: 'U004', leadId: 'L001', leadName: 'Smoke Signal Ltd', dueDate: '2026-05-10', status: 'Pending', priority: 'High', notes: 'Trial order placed — follow up on satisfaction.' },
  { id: 'FU006', type: 'Product Demo', repId: 'U004', customerId: 'C002', customerName: 'Cyberdyne Retail', dueDate: '2026-05-15', status: 'Pending', priority: 'Low', notes: 'Demo Velo 11mg pouches on next visit.' },
  { id: 'FU007', type: 'Negotiation', repId: 'U004', leadId: 'L003', leadName: 'Metro Express News', dueDate: '2026-05-09', status: 'Pending', priority: 'High', notes: 'Meeting scheduled — bring pricing deck.' },
  { id: 'FU008', type: 'Callback', repId: 'U004', customerId: 'C001', customerName: 'TechHub London', dueDate: '2026-04-30', status: 'Completed', priority: 'Medium', notes: 'Called to confirm delivery window.', outcome: 'Confirmed delivery for 2 May.', completedAt: '2026-04-30T11:00:00Z' },
  { id: 'FU009', type: 'Payment Reminder', repId: 'U010', customerId: 'C004', customerName: 'Rick Deckard Imports', dueDate: '2026-05-08', status: 'Pending', priority: 'High', notes: 'Order #324 payment outstanding.' },
  { id: 'FU010', type: 'Revisit', repId: 'U010', customerId: 'C003', customerName: 'Nostromo Supplies', dueDate: '2026-05-12', status: 'Pending', priority: 'Medium', notes: 'Visit once account is approved.' },
];

export const TASKS: Task[] = [
  { id: 'T001', type: 'Collection', title: 'Collect balance from Cyberdyne Retail', customerId: 'C002', customerName: 'Cyberdyne Retail', repId: 'U004', priority: 'High', dueDate: '2026-05-08', status: 'Overdue', linkedFollowUpId: 'FU001' },
  { id: 'T002', type: 'Visit', title: 'Morning route — TechHub London', customerId: 'C001', customerName: 'TechHub London', repId: 'U004', priority: 'High', dueDate: '2026-05-08', status: 'Completed', completedAt: '2026-05-08T09:45:00Z', linkedVisitId: 'V001' },
  { id: 'T003', type: 'Lead Follow-Up', title: 'Call Metro Express News re: meeting', repId: 'U004', priority: 'High', dueDate: '2026-05-09', status: 'Pending', linkedFollowUpId: 'FU007' },
  { id: 'T004', type: 'Product Push', title: 'Push Velo 11mg to 3 stores this week', repId: 'U004', priority: 'Medium', dueDate: '2026-05-09', status: 'In Progress', description: 'Target: TechHub, Cyberdyne, Smoke Signal' },
  { id: 'T005', type: 'Collection', title: 'Chase X-Files Archive 2nd payment', customerId: 'C005', customerName: 'X-Files Archive', repId: 'U004', priority: 'High', dueDate: '2026-05-08', status: 'Overdue', linkedFollowUpId: 'FU002' },
  { id: 'T006', type: 'Admin', title: 'Submit weekly visit report', repId: 'U004', priority: 'Low', dueDate: '2026-05-09', status: 'Pending', description: 'Summary of this week visits for manager review' },
  { id: 'T007', type: 'Merchandising', title: 'Update shelf displays at TechHub London', customerId: 'C001', customerName: 'TechHub London', repId: 'U004', priority: 'Medium', dueDate: '2026-05-15', status: 'Pending' },
  { id: 'T008', type: 'Visit', title: 'Planned visit — Cyberdyne Retail', customerId: 'C002', customerName: 'Cyberdyne Retail', repId: 'U004', priority: 'High', dueDate: '2026-05-09', status: 'Pending', linkedVisitId: 'V006' },
];

export const COLLECTION_ATTEMPTS: CollectionAttempt[] = [
  { id: 'CA001', customerId: 'C002', customerName: 'Cyberdyne Retail', repId: 'U004', attemptDate: '2026-05-08T11:00:00Z', amountRequested: 45.50, amountCollected: 45.50, status: 'Paid', notes: 'Full balance collected on visit.', visitId: 'V002' },
  { id: 'CA002', customerId: 'C002', customerName: 'Cyberdyne Retail', repId: 'U004', attemptDate: '2026-05-06T10:00:00Z', amountRequested: 45.50, amountCollected: 0, status: 'Pending', notes: 'Owner absent. Will retry Friday.', promisedDate: '2026-05-09', visitId: 'V004' },
  { id: 'CA003', customerId: 'C005', customerName: 'X-Files Archive', repId: 'U004', attemptDate: '2026-05-06T14:00:00Z', amountRequested: 120.50, amountCollected: 60.00, status: 'Partially Paid', notes: 'Owner paid half. Promised rest by end of month.', promisedDate: '2026-05-31', visitId: 'V005' },
  { id: 'CA004', customerId: 'C005', customerName: 'X-Files Archive', repId: 'U004', attemptDate: '2026-04-20T10:00:00Z', amountRequested: 120.50, amountCollected: 0, status: 'Disputed', notes: 'Owner disputes invoice total. Escalated to manager.' },
  { id: 'CA005', customerId: 'C004', customerName: 'Rick Deckard Imports', repId: 'U010', attemptDate: '2026-05-07T16:00:00Z', amountRequested: 260.00, amountCollected: 0, status: 'Overdue', notes: 'Order #324 still unpaid. Due date passed.', promisedDate: '2026-05-08' },
];

export const ROUTE_PLANS: RoutePlan[] = [
  {
    id: 'RP001', repId: 'U004', date: '2026-05-07', estimatedTotalMinutes: 120,
    stops: [
      { customerId: 'C001', customerName: 'TechHub London', address: '12 Tech Street, London EC2A 1AA', priority: 'High', estimatedVisitMinutes: 45, suggestedOrder: 1, hasOverdueCollection: false, hasOverdueFollowUp: false, lastVisitDaysAgo: 7, status: 'Visited' },
      { customerId: 'C002', customerName: 'Cyberdyne Retail', address: '89 Market Lane, London W1B 3HH', priority: 'High', estimatedVisitMinutes: 30, suggestedOrder: 2, hasOverdueCollection: true, hasOverdueFollowUp: true, lastVisitDaysAgo: 2, status: 'Visited' },
      { customerId: 'C005', customerName: 'X-Files Archive', address: '22 Basement Row, London SW1A 0AA', priority: 'Medium', estimatedVisitMinutes: 40, suggestedOrder: 3, hasOverdueCollection: true, hasOverdueFollowUp: true, lastVisitDaysAgo: 2, status: 'Pending' },
    ],
  },
  {
    id: 'RP002', repId: 'U004', date: '2026-05-09', estimatedTotalMinutes: 90,
    stops: [
      { customerId: 'C002', customerName: 'Cyberdyne Retail', address: '89 Market Lane, London W1B 3HH', priority: 'High', estimatedVisitMinutes: 30, suggestedOrder: 1, hasOverdueCollection: true, hasOverdueFollowUp: false, lastVisitDaysAgo: 1, status: 'Pending' },
      { customerId: 'C001', customerName: 'TechHub London', address: '12 Tech Street, London EC2A 1AA', priority: 'Medium', estimatedVisitMinutes: 30, suggestedOrder: 2, hasOverdueCollection: false, hasOverdueFollowUp: false, lastVisitDaysAgo: 1, status: 'Pending' },
      { customerId: 'C005', customerName: 'X-Files Archive', address: '22 Basement Row, London SW1A 0AA', priority: 'High', estimatedVisitMinutes: 40, suggestedOrder: 3, hasOverdueCollection: true, hasOverdueFollowUp: true, lastVisitDaysAgo: 3, status: 'Pending' },
    ],
  },
];

// ─── Phase 4: Sales Manager Intelligence Mock Data ─────────────────────────

export const TERRITORIES: Territory[] = [
  { id: 'TR001', name: 'North London',  level: 'Area',   parentId: 'TR003', assignedRepId: 'U004', assignedRepName: 'John Smith',  customerCount: 8, activeCustomers: 6, monthlyRevenue: 12400 },
  { id: 'TR002', name: 'East London',   level: 'Area',   parentId: 'TR003', assignedRepId: 'U010', assignedRepName: 'Emma Clarke', customerCount: 5, activeCustomers: 4, monthlyRevenue: 8750 },
  { id: 'TR003', name: 'London Zone',   level: 'Zone',   parentId: 'TR004', customerCount: 13, activeCustomers: 10, monthlyRevenue: 21150 },
  { id: 'TR004', name: 'South East',    level: 'Region', customerCount: 13, activeCustomers: 10, monthlyRevenue: 21150 },
];

export const TERRITORY_PERFORMANCE: TerritoryPerformance[] = [
  { territoryId: 'TR001', territoryName: 'North London', repId: 'U004', repName: 'John Smith',  visitsThisMonth: 22, ordersThisMonth: 18, revenueThisMonth: 16400, collectionsThisMonth: 580, activeLeads: 3, overdueCollections: 1 },
  { territoryId: 'TR002', territoryName: 'East London',  repId: 'U010', repName: 'Emma Clarke', visitsThisMonth: 18, ordersThisMonth: 14, revenueThisMonth: 11200, collectionsThisMonth: 890, activeLeads: 2, overdueCollections: 2 },
];

export const REP_STATUSES: RepStatus[] = [
  {
    repId: 'U004', repName: 'John Smith',
    status: 'Online – In Visit',
    sessionStart: '2026-05-07T08:30:00Z',
    activeVisitCustomer: 'TechHub London',
    activeVisitStart: '2026-05-07T09:00:00Z',
    currentLat: 51.5074, currentLng: -0.1278,
    todayVisits: 2, todayOrders: 1, todayRevenue: 1186, todayCollections: 0,
    routeProgress: { visited: 2, total: 3 },
    lastActivityAt: '2026-05-07T09:00:00Z',
  },
  {
    repId: 'U010', repName: 'Emma Clarke',
    status: 'Online – Travelling',
    sessionStart: '2026-05-07T09:00:00Z',
    currentLat: 51.5194, currentLng: -0.0795,
    todayVisits: 1, todayOrders: 1, todayRevenue: 540, todayCollections: 120,
    routeProgress: { visited: 1, total: 3 },
    lastActivityAt: '2026-05-07T10:15:00Z',
  },
];

export const REP_PERFORMANCE: RepPerformanceMetrics[] = [
  { repId: 'U004', repName: 'John Smith',  period: 'daily',   periodLabel: 'Today',      visitsCompleted: 2,  visitsTarget: 5,  ordersCreated: 1,  revenueGenerated: 1186,  revenueTarget: 2000,  collectionsRecovered: 0,   followUpCompletionRate: 67, leadConversionRate: 25, productiveHours: 3.5, idleHours: 0.5, avgVisitDuration: 38, customersCovered: 2 },
  { repId: 'U004', repName: 'John Smith',  period: 'weekly',  periodLabel: 'This Week',  visitsCompleted: 8,  visitsTarget: 20, ordersCreated: 5,  revenueGenerated: 4820,  revenueTarget: 8000,  collectionsRecovered: 160, followUpCompletionRate: 72, leadConversionRate: 25, productiveHours: 18,  idleHours: 2,   avgVisitDuration: 42, customersCovered: 6 },
  { repId: 'U004', repName: 'John Smith',  period: 'monthly', periodLabel: 'This Month', visitsCompleted: 22, visitsTarget: 80, ordersCreated: 18, revenueGenerated: 16400, revenueTarget: 32000, collectionsRecovered: 580, followUpCompletionRate: 78, leadConversionRate: 25, productiveHours: 72,  idleHours: 8,   avgVisitDuration: 40, customersCovered: 8 },
  { repId: 'U010', repName: 'Emma Clarke', period: 'daily',   periodLabel: 'Today',      visitsCompleted: 1,  visitsTarget: 5,  ordersCreated: 1,  revenueGenerated: 540,   revenueTarget: 2000,  collectionsRecovered: 120, followUpCompletionRate: 50, leadConversionRate: 33, productiveHours: 2,   idleHours: 1,   avgVisitDuration: 55, customersCovered: 1 },
  { repId: 'U010', repName: 'Emma Clarke', period: 'weekly',  periodLabel: 'This Week',  visitsCompleted: 6,  visitsTarget: 20, ordersCreated: 4,  revenueGenerated: 3100,  revenueTarget: 8000,  collectionsRecovered: 340, followUpCompletionRate: 60, leadConversionRate: 33, productiveHours: 15,  idleHours: 3,   avgVisitDuration: 48, customersCovered: 4 },
  { repId: 'U010', repName: 'Emma Clarke', period: 'monthly', periodLabel: 'This Month', visitsCompleted: 18, visitsTarget: 80, ordersCreated: 14, revenueGenerated: 11200, revenueTarget: 32000, collectionsRecovered: 890, followUpCompletionRate: 65, leadConversionRate: 33, productiveHours: 60,  idleHours: 12,  avgVisitDuration: 45, customersCovered: 5 },
];

export const CUSTOMER_HEALTH: CustomerHealth[] = [
  { customerId: 'C001', customerName: 'TechHub London',       assignedRepId: 'U004', assignedRepName: 'John Smith',  healthState: 'Healthy',   healthScore: 82, lastVisitDaysAgo: 0,  daysSinceLastOrder: 0,  outstandingBalance: 1186,  overdueAmount: 0,    openFollowUps: 1, missedVisits: 0, flags: [] },
  { customerId: 'C002', customerName: 'Cyberdyne Retail',     assignedRepId: 'U004', assignedRepName: 'John Smith',  healthState: 'Warning',   healthScore: 54, lastVisitDaysAgo: 2,  daysSinceLastOrder: 14, outstandingBalance: 45.5,  overdueAmount: 45.5, openFollowUps: 2, missedVisits: 1, flags: ['Balance overdue', 'Missed follow-up'] },
  { customerId: 'C003', customerName: 'Nostromo Supplies',    assignedRepId: 'U010', assignedRepName: 'Emma Clarke', healthState: 'High Risk', healthScore: 31, lastVisitDaysAgo: 45, daysSinceLastOrder: 45, outstandingBalance: 0,     overdueAmount: 0,    openFollowUps: 0, missedVisits: 3, flags: ['No visit 45d', 'No orders 45d', 'Inactive'] },
  { customerId: 'C004', customerName: 'Rick Deckard Imports', assignedRepId: 'U010', assignedRepName: 'Emma Clarke', healthState: 'Critical',  healthScore: 12, lastVisitDaysAgo: 60, daysSinceLastOrder: 60, outstandingBalance: 260,   overdueAmount: 260,  openFollowUps: 1, missedVisits: 4, flags: ['Overdue £260', 'No visit 60d', 'Churn risk'] },
  { customerId: 'C005', customerName: 'X-Files Archive',      assignedRepId: 'U004', assignedRepName: 'John Smith',  healthState: 'Warning',   healthScore: 48, lastVisitDaysAgo: 2,  daysSinceLastOrder: 20, outstandingBalance: 120.5, overdueAmount: 60,   openFollowUps: 2, missedVisits: 0, flags: ['Partial payment dispute', 'Follow-up overdue'] },
];

export const OPERATIONAL_ALERTS: OperationalAlert[] = [
  { id: 'AL001', type: 'churn-risk',         severity: 'Critical', title: 'Churn Risk — Rick Deckard Imports',    description: 'No visit or order in 60 days. £260 overdue.', repId: 'U010', repName: 'Emma Clarke', customerId: 'C004', customerName: 'Rick Deckard Imports', createdAt: '2026-05-07T07:00:00Z', read: false, dismissed: false },
  { id: 'AL002', type: 'inactive-customer',  severity: 'Warning',  title: 'Inactive — Nostromo Supplies 45 days', description: 'No visit or order in 45 days. At-risk account.',  repId: 'U010', repName: 'Emma Clarke', customerId: 'C003', customerName: 'Nostromo Supplies',    createdAt: '2026-05-07T07:00:00Z', read: false, dismissed: false },
  { id: 'AL003', type: 'overdue-collection', severity: 'Critical', title: 'Overdue Collection — Cyberdyne Retail', description: '£45.50 overdue. 2 failed attempts.',              repId: 'U004', repName: 'John Smith',  customerId: 'C002', customerName: 'Cyberdyne Retail',     createdAt: '2026-05-07T08:00:00Z', read: false, dismissed: false },
  { id: 'AL004', type: 'overdue-follow-up',  severity: 'Warning',  title: 'Overdue Follow-Up — X-Files Archive',  description: 'Collection follow-up 2 days overdue.',           repId: 'U004', repName: 'John Smith',  customerId: 'C005', customerName: 'X-Files Archive',      createdAt: '2026-05-07T08:00:00Z', read: true,  dismissed: false },
  { id: 'AL005', type: 'stalled-lead',       severity: 'Info',     title: 'Stalled Lead — Smoke Signal Co',       description: 'No activity for 14 days. Stage: Demo.',          repId: 'U004', repName: 'John Smith',  leadId: 'L001',                                               createdAt: '2026-05-06T10:00:00Z', read: false, dismissed: false },
  { id: 'AL006', type: 'unassigned-lead',    severity: 'Warning',  title: '2 leads unassigned',                   description: 'Leads without rep assignment need action.',                                                                                                          createdAt: '2026-05-07T07:00:00Z', read: false, dismissed: false },
];

export const TEAM_ANALYTICS: TeamAnalytics = {
  date: '2026-05-07',
  totalReps: 2, onlineReps: 2, activeVisits: 1,
  todayVisits: 3, todayOrders: 2, todayRevenue: 1726, todayCollections: 120,
  pendingFollowUps: 4, overdueTasks: 2, idleReps: 0, highRiskCustomers: 2,
};

export const LEAD_ANALYTICS: LeadAnalytics[] = [
  { repId: 'U004', repName: 'John Smith',  totalLeads: 4, activeLeads: 3, stalledLeads: 1, convertedThisMonth: 1, lostThisMonth: 0, conversionRate: 25, avgDaysToConvert: 45, pipelineValue: 14200 },
  { repId: 'U010', repName: 'Emma Clarke', totalLeads: 3, activeLeads: 2, stalledLeads: 1, convertedThisMonth: 1, lostThisMonth: 1, conversionRate: 33, avgDaysToConvert: 38, pipelineValue: 9800 },
];