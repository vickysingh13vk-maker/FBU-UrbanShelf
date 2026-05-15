import { Product, Order, Supplier, Category, User, Customer, Cart, Coupon, PricingStrategy, Campaign, Role, Warehouse, InboundShipment, LedgerEntry, Lead, CustomerTimeline, WorkSession, Visit, FollowUp, Task, CollectionAttempt, RoutePlan, Territory, TerritoryPerformance, RepStatus, RepPerformanceMetrics, CustomerHealth, OperationalAlert, TeamAnalytics, LeadAnalytics, CRMNotification, AutomationRule, Escalation, ApprovalRequest, AuditLog, CustomerDocument, CRMRecommendation } from './types';

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

export const INBOUND_SHIPMENTS: InboundShipment[] = [
  {
    id: 'SHIP-001', supplierId: 'SUP-001', supplierName: 'Lost Mary',
    date: '2026-05-05', paymentType: 'Paid', status: 'Confirmed',
    hasLinkedCustomer: false, totalAmount: 18000,
    createdAt: '2026-05-05T10:00:00Z', createdBy: 'Admin',
    notes: 'Regular monthly stock replenishment',
    items: [
      { id: 'SI-001', productId: 'P101', productName: 'LOST MARY BM6000 KIT', flavour: 'Strawberry Lime', quantity: 500, unitPrice: 12, totalPrice: 6000 },
      { id: 'SI-002', productId: 'P102', productName: 'LOST MARY BM6000 KIT', flavour: 'Pineapple Passion Fruit', quantity: 500, unitPrice: 12, totalPrice: 6000 },
      { id: 'SI-003', productId: 'P103', productName: 'LOST MARY BM6000 KIT', flavour: 'Watermelon Kiwi', quantity: 500, unitPrice: 12, totalPrice: 6000 },
    ],
  },
  {
    id: 'SHIP-002', supplierId: 'SUP-002', supplierName: 'Elf Bar',
    date: '2026-05-04', paymentType: 'Credit', status: 'Confirmed',
    hasLinkedCustomer: false, totalAmount: 9500,
    createdAt: '2026-05-04T14:30:00Z', createdBy: 'Admin',
    items: [
      { id: 'SI-004', productId: 'P001', productName: 'ELF BAR 600', flavour: 'Blueberry', quantity: 1000, unitPrice: 5.5, totalPrice: 5500 },
      { id: 'SI-005', productId: 'P001', productName: 'ELF BAR 600', flavour: 'Mango', quantity: 600, unitPrice: 5.5, totalPrice: 3300 },
      { id: 'SI-006', productId: 'P001', productName: 'ELF BAR 600', flavour: 'Watermelon', quantity: 127, unitPrice: 5.5, totalPrice: 700 },
    ],
  },
  {
    id: 'SHIP-003', supplierId: 'SUP-001', supplierName: 'Lost Mary',
    date: '2026-05-01', paymentType: 'Paid', status: 'Confirmed',
    hasLinkedCustomer: true, customerId: 'C001', customerName: 'James Cameron',
    totalAmount: 24000,
    createdAt: '2026-05-01T09:00:00Z', createdBy: 'Admin',
    notes: 'Customer pre-order fulfilled',
    items: [
      { id: 'SI-007', productId: 'P104', productName: 'LOST MARY BM6000 KIT', flavour: 'Red Apple Ice', quantity: 1000, unitPrice: 12, totalPrice: 12000 },
      { id: 'SI-008', productId: 'P105', productName: 'LOST MARY BM6000 KIT', flavour: 'Blue Razz Cherry', quantity: 800, unitPrice: 12, totalPrice: 9600 },
      { id: 'SI-009', productId: 'P106', productName: 'LOST MARY BM6000 KIT', flavour: 'Orange Bruu', quantity: 200, unitPrice: 12, totalPrice: 2400 },
    ],
  },
  {
    id: 'SHIP-004', supplierId: 'SUP-003', supplierName: 'Velo',
    date: '2026-04-28', paymentType: 'Credit', status: 'Confirmed',
    hasLinkedCustomer: false, totalAmount: 6000,
    createdAt: '2026-04-28T11:00:00Z', createdBy: 'Admin',
    items: [
      { id: 'SI-010', productId: 'P201', productName: 'VELO Ice Cool', flavour: 'Mint', quantity: 400, unitPrice: 8, totalPrice: 3200 },
      { id: 'SI-011', productId: 'P202', productName: 'VELO Freeze', flavour: 'Arctic Mint', quantity: 350, unitPrice: 8, totalPrice: 2800 },
    ],
  },
  {
    id: 'SHIP-005', supplierId: 'SUP-002', supplierName: 'Elf Bar',
    date: '2026-04-20', paymentType: 'Paid', status: 'Draft',
    hasLinkedCustomer: false, totalAmount: 3200,
    createdAt: '2026-04-20T16:00:00Z', createdBy: 'Admin',
    items: [
      { id: 'SI-012', productId: 'P001', productName: 'ELF BAR 600', flavour: 'Strawberry Kiwi', quantity: 400, unitPrice: 8, totalPrice: 3200 },
    ],
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
    outcome: { orderAmount: 1186.26, orderId: '326', collectionAmount: 0, productsDiscussed: ['Lost Mary BM6000', 'Elf Bar 600'], notes: 'Owner happy with new range. Placed large order.' },
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
    outcome: { collectionAmount: 45.50, productsDiscussed: ['Velo Nicotine Pouches'], notes: 'Collected balance. Owner interested in Velo 11mg.' },
    notes: 'Quick efficient visit.', sessionId: 'WS001',
  },
  {
    id: 'V003', customerId: 'C001', customerName: 'TechHub London', repId: 'U004', repName: 'John Smith',
    status: 'completed', date: '2026-05-07', startTime: '2026-05-07T09:30:00Z', endTime: '2026-05-07T10:15:00Z', durationMinutes: 45,
    gpsLat: 51.5074, gpsLng: -0.1278,
    objectives: [{ id: 'O005', type: 'Relationship', description: 'Monthly check-in', completed: true }],
    outcome: { productsDiscussed: ['Lost Mary BM6000'], notes: 'Routine check-in. Stock levels reviewed.' },
    notes: 'Good relationship maintained.', sessionId: 'WS001',
  },
  {
    id: 'V004', customerId: 'C002', customerName: 'Cyberdyne Retail', repId: 'U004', repName: 'John Smith',
    status: 'completed', date: '2026-05-06', startTime: '2026-05-06T10:00:00Z', endTime: '2026-05-06T10:25:00Z', durationMinutes: 25,
    gpsLat: 51.5150, gpsLng: -0.1415,
    objectives: [{ id: 'O006', type: 'Collection', description: 'First collection attempt', completed: false }],
    outcome: { productsDiscussed: [], notes: 'Owner not available. Left message.' },
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
    outcome: { productsDiscussed: [], notes: 'Owner agreed to pay 50% now, rest by end of month.' },
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
  {
    id: 'RP003', repId: 'U004', date: '2026-05-10', estimatedTotalMinutes: 105,
    stops: [
      { customerId: 'C002', customerName: 'Cyberdyne Retail', address: '89 Market Lane, London W1B 3HH', priority: 'High', estimatedVisitMinutes: 30, suggestedOrder: 1, hasOverdueCollection: true, hasOverdueFollowUp: true, lastVisitDaysAgo: 3, status: 'Pending' },
      { customerId: 'C003', customerName: 'Nostromo Supplies', address: '44 Warehouse Road, London E14 5AB', priority: 'High', estimatedVisitMinutes: 35, suggestedOrder: 2, hasOverdueCollection: false, hasOverdueFollowUp: true, lastVisitDaysAgo: 45, status: 'Pending' },
      { customerId: 'C004', customerName: 'Rick Deckard Imports', address: '7 Blade Runner Lane, London N1 9GU', priority: 'High', estimatedVisitMinutes: 40, suggestedOrder: 3, hasOverdueCollection: true, hasOverdueFollowUp: false, lastVisitDaysAgo: 60, status: 'Pending' },
    ],
  },
];

export const LEDGER_ENTRIES: LedgerEntry[] = [
  // SHIP-001: Paid → CREDIT + DEBIT
  { id: 'LED-001', shipmentId: 'SHIP-001', date: '2026-05-05', type: 'CREDIT', amount: 18000, description: 'Stock received from Lost Mary', supplierId: 'SUP-001', supplierName: 'Lost Mary' },
  { id: 'LED-002', shipmentId: 'SHIP-001', date: '2026-05-05', type: 'DEBIT',  amount: 18000, description: 'Payment made to Lost Mary',    supplierId: 'SUP-001', supplierName: 'Lost Mary' },
  // SHIP-002: Credit → CREDIT only
  { id: 'LED-003', shipmentId: 'SHIP-002', date: '2026-05-04', type: 'CREDIT', amount: 9500,  description: 'Stock received from Elf Bar',   supplierId: 'SUP-002', supplierName: 'Elf Bar' },
  // SHIP-003: Paid + linked customer → CREDIT + DEBIT
  { id: 'LED-004', shipmentId: 'SHIP-003', date: '2026-05-01', type: 'CREDIT', amount: 24000, description: 'Stock received from Lost Mary', supplierId: 'SUP-001', supplierName: 'Lost Mary', customerId: 'C001', customerName: 'James Cameron' },
  { id: 'LED-005', shipmentId: 'SHIP-003', date: '2026-05-01', type: 'DEBIT',  amount: 24000, description: 'Payment made to Lost Mary',    supplierId: 'SUP-001', supplierName: 'Lost Mary', customerId: 'C001', customerName: 'James Cameron' },
  // SHIP-004: Credit → CREDIT only
  { id: 'LED-006', shipmentId: 'SHIP-004', date: '2026-04-28', type: 'CREDIT', amount: 6000,  description: 'Stock received from Velo',      supplierId: 'SUP-003', supplierName: 'Velo' },
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

// ─── Phase 5: Advanced CRM Operations Mock Data ────────────────────────────

export const NOTIFICATIONS: CRMNotification[] = [
  { id: 'N001', type: 'follow-up-reminder',  priority: 'Warning',  title: 'Follow-up due — Cyberdyne Retail',      body: 'Scheduled follow-up for payment collection is due today.',          read: false, dismissed: false, createdAt: '2026-05-08T08:00:00Z', linkedEntityType: 'customer',   linkedEntityId: 'C002', linkedEntityName: 'Cyberdyne Retail',     visibleToRoles: ['Sales Rep'], repId: 'U004' },
  { id: 'N002', type: 'overdue-payment',     priority: 'Critical', title: 'Overdue payment — X-Files Archive',      body: '£60 overdue. Dispute unresolved for 5 days.',                       read: false, dismissed: false, createdAt: '2026-05-08T07:30:00Z', linkedEntityType: 'customer',   linkedEntityId: 'C005', linkedEntityName: 'X-Files Archive',      visibleToRoles: ['Sales Rep', 'Sales Manager'], repId: 'U004' },
  { id: 'N003', type: 'missed-visit',        priority: 'Warning',  title: 'Missed visit — Nostromo Supplies',       body: 'No visit recorded for 45 days. Account at risk.',                   read: false, dismissed: false, createdAt: '2026-05-08T07:00:00Z', linkedEntityType: 'customer',   linkedEntityId: 'C003', linkedEntityName: 'Nostromo Supplies',    visibleToRoles: ['Sales Rep', 'Sales Manager'], repId: 'U010' },
  { id: 'N004', type: 'inactive-customer',   priority: 'Critical', title: 'Critical — Rick Deckard Imports',        body: 'No visit or order in 60 days. £260 overdue. Churn risk.',           read: false, dismissed: false, createdAt: '2026-05-08T07:00:00Z', linkedEntityType: 'customer',   linkedEntityId: 'C004', linkedEntityName: 'Rick Deckard Imports', visibleToRoles: ['Sales Rep', 'Sales Manager'], repId: 'U010' },
  { id: 'N005', type: 'task-overdue',        priority: 'Warning',  title: 'Task overdue — Demo preparation',        body: 'Task "Prepare product demo for Smoke Signal Co" is 1 day overdue.', read: true,  dismissed: false, createdAt: '2026-05-07T09:00:00Z', linkedEntityType: 'task',       linkedEntityId: 'T003', linkedEntityName: 'Prepare product demo', visibleToRoles: ['Sales Rep'], repId: 'U004' },
  { id: 'N006', type: 'collection-due',      priority: 'Warning',  title: 'Collection due — Cyberdyne Retail',      body: '£45.50 collection due today. 2 previous attempts failed.',           read: false, dismissed: false, createdAt: '2026-05-08T08:00:00Z', linkedEntityType: 'collection', linkedEntityId: 'COL001', linkedEntityName: 'Cyberdyne Retail £45.50', visibleToRoles: ['Sales Rep'], repId: 'U004' },
  { id: 'N007', type: 'lead-stale',          priority: 'Info',     title: 'Stale lead — Smoke Signal Co',           body: 'No activity on this lead for 14 days. Demo stage stalled.',         read: true,  dismissed: false, createdAt: '2026-05-07T10:00:00Z', linkedEntityType: 'lead',       linkedEntityId: 'L001', linkedEntityName: 'Smoke Signal Co',     visibleToRoles: ['Sales Rep'], repId: 'U004' },
  { id: 'N008', type: 'approval-required',   priority: 'Critical', title: 'Approval needed — 15% discount request', body: 'John Smith requests 15% discount for Cyberdyne Retail order.',      read: false, dismissed: false, createdAt: '2026-05-08T09:00:00Z', linkedEntityType: 'approval',   linkedEntityId: 'AP001', linkedEntityName: 'Discount — Cyberdyne Retail', visibleToRoles: ['Sales Manager'] },
  { id: 'N009', type: 'overdue-payment',     priority: 'Critical', title: 'Approval needed — payment write-off',    body: 'Write-off request for £45.50 — Cyberdyne Retail requires review.',  read: false, dismissed: false, createdAt: '2026-05-08T08:30:00Z', linkedEntityType: 'approval',   linkedEntityId: 'AP004', linkedEntityName: 'Write-off — Cyberdyne Retail', visibleToRoles: ['Sales Manager'] },
  { id: 'N010', type: 'missed-visit',        priority: 'Info',     title: 'Team alert — 2 reps have overdue visits', body: 'Emma Clarke has 2 customers with no visit in 30+ days.',           read: false, dismissed: false, createdAt: '2026-05-08T07:00:00Z', linkedEntityType: 'customer',   linkedEntityId: 'C004', linkedEntityName: 'Rick Deckard Imports', visibleToRoles: ['Sales Manager'] },
];

export const AUTOMATION_RULES: AutomationRule[] = [
  { id: 'AR001', name: 'No Visit 30 Days → Follow-Up',     description: 'When a customer has no visit for 30+ days, auto-create a revisit follow-up for the assigned rep.', trigger: 'no-visit-30d',         triggerCondition: { daysThreshold: 30 }, actions: ['create-follow-up', 'create-notification'], actionConfig: { followUpPriority: 'High', followUpTitle: 'Revisit overdue customer', notifPriority: 'Warning' }, status: 'Active',  appliesTo: ['Sales Rep'], lastRunAt: '2026-05-08T06:00:00Z', totalFired: 3,  createdAt: '2026-01-15T00:00:00Z' },
  { id: 'AR002', name: 'Overdue Payment → Alert Manager',  description: 'When a payment is overdue 7+ days, notify sales manager and create collection task.',               trigger: 'overdue-payment',       triggerCondition: { daysThreshold: 7  }, actions: ['create-notification', 'alert-manager'],    actionConfig: { notifPriority: 'Critical', alertTitle: 'Overdue payment requires attention' },                          status: 'Active',  appliesTo: ['Sales Manager'], lastRunAt: '2026-05-08T06:00:00Z', totalFired: 5,  createdAt: '2026-01-15T00:00:00Z' },
  { id: 'AR003', name: 'Inactive Lead 21 Days → Stale',   description: 'When a lead has no activity for 21+ days, mark it as stale and notify the rep.',                    trigger: 'inactive-lead-21d',     triggerCondition: { daysThreshold: 21 }, actions: ['mark-lead-stale', 'create-notification'],  actionConfig: { notifPriority: 'Info', notifTitle: 'Lead marked stale — no activity 21d' },                             status: 'Active',  appliesTo: ['Sales Rep'], lastRunAt: '2026-05-07T06:00:00Z', totalFired: 2,  createdAt: '2026-02-01T00:00:00Z' },
  { id: 'AR004', name: 'Missed Follow-Up → Alert Manager',description: 'When a follow-up is missed by 2+ days, alert the sales manager.',                                    trigger: 'missed-follow-up',      triggerCondition: { daysThreshold: 2  }, actions: ['alert-manager', 'create-notification'],    actionConfig: { alertTitle: 'Rep missed a follow-up', notifPriority: 'Warning' },                                         status: 'Active',  appliesTo: ['Sales Manager'], lastRunAt: '2026-05-08T06:00:00Z', totalFired: 4,  createdAt: '2026-02-01T00:00:00Z' },
  { id: 'AR005', name: 'Customer Inactive 45 Days → Task',description: 'When a customer has no order or visit for 45+ days, create a revisit task for the rep.',             trigger: 'customer-inactive-45d', triggerCondition: { daysThreshold: 45 }, actions: ['create-task', 'create-notification'],      actionConfig: { taskTitle: 'Reactivate inactive customer', taskPriority: 'High', notifPriority: 'Warning' },              status: 'Active',  appliesTo: ['Sales Rep'], lastRunAt: '2026-05-07T06:00:00Z', totalFired: 2,  createdAt: '2026-02-15T00:00:00Z' },
  { id: 'AR006', name: 'Collection Overdue → Task',        description: 'When a collection is overdue 3+ days, auto-create a priority collection task for the rep.',         trigger: 'collection-overdue',    triggerCondition: { daysThreshold: 3  }, actions: ['create-task', 'create-notification'],      actionConfig: { taskTitle: 'Priority collection required', taskPriority: 'High', notifPriority: 'Warning' },              status: 'Active',  appliesTo: ['Sales Rep'], lastRunAt: '2026-05-08T06:00:00Z', totalFired: 7,  createdAt: '2026-03-01T00:00:00Z' },
  { id: 'AR007', name: 'Stale Lead 14 Days → Notify',     description: 'When a lead has been stale for 14 days with no rep action, send an escalation notification.',       trigger: 'lead-stale-14d',        triggerCondition: { daysThreshold: 14 }, actions: ['create-notification'],                     actionConfig: { notifPriority: 'Info', notifTitle: 'Stale lead needs rep action' },                                      status: 'Paused', appliesTo: ['Sales Rep'], lastRunAt: '2026-05-01T06:00:00Z', totalFired: 1,  createdAt: '2026-03-15T00:00:00Z' },
];

export const ESCALATIONS: Escalation[] = [
  {
    id: 'ESC001', type: 'payment-dispute', status: 'Reviewed', priority: 'High',
    title: 'Payment Dispute — Cyberdyne Retail £45.50',
    description: 'Customer disputes the £45.50 charge. Claims delivery was incomplete. Rep has attempted 2 collections.',
    createdBy: 'U004', createdByName: 'John Smith', assignedTo: 'U011', assignedToName: 'David Patel',
    customerId: 'C002', customerName: 'Cyberdyne Retail', repId: 'U004', repName: 'John Smith',
    slaDeadline: '2026-05-10T17:00:00Z',
    timeline: [
      { status: 'Created',  note: 'Dispute raised by customer during visit. Rep escalated for manager review.', by: 'John Smith',   at: '2026-05-05T14:00:00Z' },
      { status: 'Assigned', note: 'Assigned to Sales Manager for review.',                                      by: 'David Patel',  at: '2026-05-05T16:00:00Z' },
      { status: 'Reviewed', note: 'Manager reviewed. Awaiting credit note from finance before resolving.',      by: 'David Patel',  at: '2026-05-07T10:00:00Z' },
    ],
    createdAt: '2026-05-05T14:00:00Z', updatedAt: '2026-05-07T10:00:00Z',
  },
  {
    id: 'ESC002', type: 'churn-risk', status: 'Assigned', priority: 'Critical',
    title: 'Churn Risk — Rick Deckard Imports',
    description: 'Customer has not placed an order or received a visit in 60 days. £260 balance overdue. High churn probability.',
    createdBy: 'U010', createdByName: 'Emma Clarke', assignedTo: 'U011', assignedToName: 'David Patel',
    customerId: 'C004', customerName: 'Rick Deckard Imports', repId: 'U010', repName: 'Emma Clarke',
    slaDeadline: '2026-05-09T17:00:00Z',
    timeline: [
      { status: 'Created',  note: 'Automated churn risk detected. Rep flagged for manager escalation.', by: 'Emma Clarke',  at: '2026-05-07T07:00:00Z' },
      { status: 'Assigned', note: 'Assigned to David Patel. Immediate outreach required.',              by: 'David Patel',  at: '2026-05-07T09:00:00Z' },
    ],
    createdAt: '2026-05-07T07:00:00Z', updatedAt: '2026-05-07T09:00:00Z',
  },
  {
    id: 'ESC003', type: 'overdue-collection', status: 'Created', priority: 'High',
    title: 'Overdue Collection — X-Files Archive £60',
    description: 'Customer disputes partial payment. £60 overdue for 5 days. Rep requests manager support.',
    createdBy: 'U004', createdByName: 'John Smith',
    customerId: 'C005', customerName: 'X-Files Archive', repId: 'U004', repName: 'John Smith',
    slaDeadline: '2026-05-11T17:00:00Z',
    timeline: [
      { status: 'Created', note: 'Rep unable to resolve dispute. Escalating to manager.', by: 'John Smith', at: '2026-05-08T08:00:00Z' },
    ],
    createdAt: '2026-05-08T08:00:00Z', updatedAt: '2026-05-08T08:00:00Z',
  },
  {
    id: 'ESC004', type: 'customer-complaint', status: 'Resolved', priority: 'Medium',
    title: 'Product Quality Complaint — TechHub London',
    description: 'Customer reported 3 damaged units in last delivery. Replacement requested.',
    createdBy: 'U004', createdByName: 'John Smith', assignedTo: 'U011', assignedToName: 'David Patel',
    customerId: 'C001', customerName: 'TechHub London', repId: 'U004', repName: 'John Smith',
    timeline: [
      { status: 'Created',  note: '3 damaged units reported. Rep escalated for replacement approval.',       by: 'John Smith',  at: '2026-04-28T11:00:00Z' },
      { status: 'Assigned', note: 'Assigned to David Patel.',                                                by: 'David Patel', at: '2026-04-28T13:00:00Z' },
      { status: 'Reviewed', note: 'Replacement approved. Warehouse notified.',                               by: 'David Patel', at: '2026-04-29T09:00:00Z' },
      { status: 'Resolved', note: 'Replacement delivered. Customer satisfied. Case resolved.',               by: 'John Smith',  at: '2026-05-02T14:00:00Z' },
    ],
    createdAt: '2026-04-28T11:00:00Z', updatedAt: '2026-05-02T14:00:00Z', resolvedAt: '2026-05-02T14:00:00Z',
  },
  {
    id: 'ESC005', type: 'pricing-request', status: 'Closed', priority: 'Low',
    title: 'Pricing Review Request — Cyberdyne Retail',
    description: 'Customer requested a volume discount review for next quarter ordering.',
    createdBy: 'U004', createdByName: 'John Smith', assignedTo: 'U011', assignedToName: 'David Patel',
    customerId: 'C002', customerName: 'Cyberdyne Retail', repId: 'U004', repName: 'John Smith',
    timeline: [
      { status: 'Created',  note: 'Customer requested volume pricing. Rep escalated for approval.',  by: 'John Smith',  at: '2026-04-20T10:00:00Z' },
      { status: 'Assigned', note: 'Assigned to David Patel for pricing review.',                     by: 'David Patel', at: '2026-04-20T14:00:00Z' },
      { status: 'Reviewed', note: 'Pricing tier reviewed. 5% volume discount approved.',             by: 'David Patel', at: '2026-04-22T09:00:00Z' },
      { status: 'Resolved', note: 'New pricing communicated to customer.',                           by: 'John Smith',  at: '2026-04-23T11:00:00Z' },
      { status: 'Closed',   note: 'Case closed. Customer confirmed new terms.',                      by: 'David Patel', at: '2026-04-24T10:00:00Z' },
    ],
    createdAt: '2026-04-20T10:00:00Z', updatedAt: '2026-04-24T10:00:00Z', resolvedAt: '2026-04-23T11:00:00Z',
  },
];

export const APPROVAL_REQUESTS: ApprovalRequest[] = [
  { id: 'AP001', type: 'discount',            status: 'Pending',  title: '15% Discount — Cyberdyne Retail',        description: 'Customer requesting 15% one-time discount to resolve payment dispute and retain account.', requestedBy: 'U004', requestedByName: 'John Smith',  requestedAt: '2026-05-08T09:00:00Z', customerId: 'C002', customerName: 'Cyberdyne Retail',     amount: 15, currentValue: 0, requestedValue: 15 },
  { id: 'AP002', type: 'credit-increase',     status: 'Approved', title: 'Credit Limit +£500 — TechHub London',    description: 'Customer requests credit increase to support larger seasonal orders.',                     requestedBy: 'U004', requestedByName: 'John Smith',  requestedAt: '2026-04-25T10:00:00Z', reviewedBy: 'U011', reviewedByName: 'David Patel', reviewedAt: '2026-04-26T09:00:00Z', reviewNote: 'Approved. Strong payment history.', customerId: 'C001', customerName: 'TechHub London', currentValue: 1000, requestedValue: 1500 },
  { id: 'AP003', type: 'payment-adjustment',  status: 'Pending',  title: 'Payment Plan — X-Files Archive',         description: 'Customer requests split payment over 3 months for £120.50 outstanding balance.',             requestedBy: 'U004', requestedByName: 'John Smith',  requestedAt: '2026-05-07T14:00:00Z', customerId: 'C005', customerName: 'X-Files Archive',      amount: 120.5 },
  { id: 'AP004', type: 'write-off',           status: 'Rejected', title: 'Write-off £45.50 — Cyberdyne Retail',    description: 'Rep requests write-off of disputed £45.50. Customer refuses to pay.',                       requestedBy: 'U004', requestedByName: 'John Smith',  requestedAt: '2026-05-06T11:00:00Z', reviewedBy: 'U011', reviewedByName: 'David Patel', reviewedAt: '2026-05-07T08:00:00Z', reviewNote: 'Rejected. Escalation path must be followed first.', customerId: 'C002', customerName: 'Cyberdyne Retail', amount: 45.5 },
  { id: 'AP005', type: 'order-override',      status: 'Pending',  title: 'Order Override — Nostromo Supplies',     description: 'Customer requests order despite account being flagged as inactive/high-risk.',               requestedBy: 'U010', requestedByName: 'Emma Clarke', requestedAt: '2026-05-08T10:00:00Z', customerId: 'C003', customerName: 'Nostromo Supplies' },
  { id: 'AP006', type: 'discount',            status: 'Approved', title: '10% Retention Discount — Rick Deckard',  description: '10% discount approved as part of churn-prevention strategy.',                             requestedBy: 'U010', requestedByName: 'Emma Clarke', requestedAt: '2026-05-03T09:00:00Z', reviewedBy: 'U011', reviewedByName: 'David Patel', reviewedAt: '2026-05-04T10:00:00Z', reviewNote: 'Approved. Churn-risk customer — retention discount justified.', customerId: 'C004', customerName: 'Rick Deckard Imports', amount: 10, currentValue: 0, requestedValue: 10 },
];

export const AUDIT_LOGS: AuditLog[] = [
  { id: 'AUD001', action: 'approval.create',          performedBy: 'U004', performedByName: 'John Smith',  entityType: 'approval',  entityId: 'AP001', entityName: 'Discount — Cyberdyne Retail',    newValue: { type: 'discount', status: 'Pending', amount: 15 },                                                             timestamp: '2026-05-08T09:00:00Z' },
  { id: 'AUD002', action: 'escalation.create',        performedBy: 'U004', performedByName: 'John Smith',  entityType: 'escalation', entityId: 'ESC003', entityName: 'X-Files Archive Collection',    newValue: { type: 'overdue-collection', priority: 'High' },                                                                timestamp: '2026-05-08T08:00:00Z' },
  { id: 'AUD003', action: 'collection.update',        performedBy: 'U004', performedByName: 'John Smith',  entityType: 'collection', entityId: 'COL001', entityName: 'Cyberdyne Retail £45.50',       oldValue: { status: 'Pending' }, newValue: { status: 'Disputed', note: 'Customer disputes charge' },                    timestamp: '2026-05-07T15:30:00Z' },
  { id: 'AUD004', action: 'lead.stage-change',        performedBy: 'U004', performedByName: 'John Smith',  entityType: 'lead',       entityId: 'L001',   entityName: 'Smoke Signal Co',               oldValue: { stage: 'Qualified' }, newValue: { stage: 'Demo' },                                                           timestamp: '2026-05-07T11:00:00Z', note: 'Moved to Demo stage after discovery call' },
  { id: 'AUD005', action: 'approval.review',          performedBy: 'U011', performedByName: 'David Patel', entityType: 'approval',   entityId: 'AP004', entityName: 'Write-off — Cyberdyne Retail',   oldValue: { status: 'Pending' }, newValue: { status: 'Rejected', note: 'Escalation path must be followed first.' },   timestamp: '2026-05-07T08:00:00Z' },
  { id: 'AUD006', action: 'escalation.update',        performedBy: 'U011', performedByName: 'David Patel', entityType: 'escalation', entityId: 'ESC001', entityName: 'Cyberdyne Retail Payment Dispute', oldValue: { status: 'Assigned' }, newValue: { status: 'Reviewed', note: 'Awaiting credit note from finance' },       timestamp: '2026-05-07T10:00:00Z' },
  { id: 'AUD007', action: 'customer.lifecycle-change',performedBy: 'U010', performedByName: 'Emma Clarke', entityType: 'customer',   entityId: 'C004', entityName: 'Rick Deckard Imports',             oldValue: { lifecycleStage: 'Active' }, newValue: { lifecycleStage: 'At Risk' },                                         timestamp: '2026-05-07T07:00:00Z', lat: 51.5194, lng: -0.0795 },
  { id: 'AUD008', action: 'payment.record',           performedBy: 'U010', performedByName: 'Emma Clarke', entityType: 'collection', entityId: 'COL004', entityName: 'Nostromo Supplies £540',         oldValue: { amountCollected: 0 }, newValue: { amountCollected: 540, status: 'Paid' },                                   timestamp: '2026-05-07T10:30:00Z', lat: 51.5194, lng: -0.0795 },
  { id: 'AUD009', action: 'approval.review',          performedBy: 'U011', performedByName: 'David Patel', entityType: 'approval',   entityId: 'AP002', entityName: 'Credit Increase — TechHub London', oldValue: { status: 'Pending' }, newValue: { status: 'Approved', note: 'Strong payment history.' },                  timestamp: '2026-04-26T09:00:00Z' },
  { id: 'AUD010', action: 'lead.assign',              performedBy: 'U011', performedByName: 'David Patel', entityType: 'lead',       entityId: 'L002',   entityName: 'Skynet Systems',                 oldValue: { repId: null }, newValue: { repId: 'U004', repName: 'John Smith' },                                         timestamp: '2026-04-24T14:00:00Z', note: 'Assigned to John Smith — territory match' },
  { id: 'AUD011', action: 'document.upload',          performedBy: 'U004', performedByName: 'John Smith',  entityType: 'customer',   entityId: 'C001', entityName: 'TechHub London',                   newValue: { documentId: 'DOC001', type: 'agreement', name: 'Trade Agreement 2026' },                                        timestamp: '2026-04-15T11:00:00Z' },
  { id: 'AUD012', action: 'customer.update',          performedBy: 'U004', performedByName: 'John Smith',  entityType: 'customer',   entityId: 'C002', entityName: 'Cyberdyne Retail',                 oldValue: { phone: '07700 900 111' }, newValue: { phone: '07700 900 222' },                                               timestamp: '2026-05-05T14:30:00Z', note: 'Updated contact number during visit' },
];

export const CUSTOMER_DOCUMENTS: CustomerDocument[] = [
  { id: 'DOC001', type: 'agreement',       name: 'Trade Agreement 2026',           description: 'Annual trade agreement and credit terms.',             fileUrl: 'https://example.com/docs/trade-agreement-2026.pdf',    fileSize: '420 KB', mimeType: 'application/pdf', uploadedBy: 'U004', uploadedByName: 'John Smith',  uploadedAt: '2026-04-15T11:00:00Z', linkedEntityType: 'customer', linkedEntityId: 'C001', linkedEntityName: 'TechHub London',       tags: ['agreement', '2026', 'credit'] },
  { id: 'DOC002', type: 'invoice',         name: 'Invoice INV-2026-0451',          description: 'March 2026 monthly invoice.',                          fileUrl: 'https://example.com/docs/inv-0451.pdf',                fileSize: '85 KB',  mimeType: 'application/pdf', uploadedBy: 'U004', uploadedByName: 'John Smith',  uploadedAt: '2026-04-01T09:00:00Z', linkedEntityType: 'customer', linkedEntityId: 'C001', linkedEntityName: 'TechHub London',       tags: ['invoice', 'march-2026'] },
  { id: 'DOC003', type: 'payment-proof',   name: 'Payment Receipt — April £1,186', description: 'Bank transfer confirmation for April order.',          fileUrl: 'https://example.com/docs/receipt-apr-c001.jpg',        fileSize: '1.2 MB', mimeType: 'image/jpeg',      uploadedBy: 'U004', uploadedByName: 'John Smith',  uploadedAt: '2026-05-07T10:00:00Z', linkedEntityType: 'customer', linkedEntityId: 'C001', linkedEntityName: 'TechHub London',       tags: ['receipt', 'payment', 'april'] },
  { id: 'DOC004', type: 'customer-document', name: 'Business Licence — Cyberdyne', description: 'Customer business registration document.',              fileUrl: 'https://example.com/docs/cyberdyne-licence.pdf',       fileSize: '320 KB', mimeType: 'application/pdf', uploadedBy: 'U004', uploadedByName: 'John Smith',  uploadedAt: '2026-02-10T14:00:00Z', linkedEntityType: 'customer', linkedEntityId: 'C002', linkedEntityName: 'Cyberdyne Retail',     tags: ['licence', 'kyc'] },
  { id: 'DOC005', type: 'visit-photo',     name: 'Visit Photo — Cyberdyne Retail', description: 'Shelf display photo taken during May 7 visit.',         fileUrl: 'https://picsum.photos/400/300?random=500',             fileSize: '2.1 MB', mimeType: 'image/jpeg',      uploadedBy: 'U004', uploadedByName: 'John Smith',  uploadedAt: '2026-05-07T11:30:00Z', linkedEntityType: 'customer', linkedEntityId: 'C002', linkedEntityName: 'Cyberdyne Retail',     tags: ['visit-photo', 'display'] },
  { id: 'DOC006', type: 'receipt',         name: 'Collection Receipt — £120 partial', description: 'Partial payment collected from X-Files Archive.',    fileUrl: 'https://example.com/docs/receipt-xfiles-partial.pdf',  fileSize: '55 KB',  mimeType: 'application/pdf', uploadedBy: 'U004', uploadedByName: 'John Smith',  uploadedAt: '2026-05-03T15:00:00Z', linkedEntityType: 'customer', linkedEntityId: 'C005', linkedEntityName: 'X-Files Archive',      tags: ['receipt', 'partial-payment'] },
  { id: 'DOC007', type: 'agreement',       name: 'Credit Terms — Rick Deckard',    description: 'Revised credit terms post-account review.',             fileUrl: 'https://example.com/docs/credit-terms-c004.pdf',       fileSize: '210 KB', mimeType: 'application/pdf', uploadedBy: 'U011', uploadedByName: 'David Patel', uploadedAt: '2026-03-15T10:00:00Z', linkedEntityType: 'customer', linkedEntityId: 'C004', linkedEntityName: 'Rick Deckard Imports', tags: ['agreement', 'credit-terms'] },
  { id: 'DOC008', type: 'invoice',         name: 'Invoice INV-2026-0388 — Nostromo', description: 'Last invoice before account went inactive.',          fileUrl: 'https://example.com/docs/inv-0388.pdf',                fileSize: '78 KB',  mimeType: 'application/pdf', uploadedBy: 'U010', uploadedByName: 'Emma Clarke', uploadedAt: '2026-03-20T09:00:00Z', linkedEntityType: 'customer', linkedEntityId: 'C003', linkedEntityName: 'Nostromo Supplies',    tags: ['invoice', 'march-2026'] },
];

export const CRM_RECOMMENDATIONS: CRMRecommendation[] = [
  { id: 'REC001', type: 'overdue-visit',       severity: 'Action Required', title: 'Rick Deckard Imports — 60 days no visit',    description: 'No visit or order for 60 days. Account critical. Immediate rep visit required.',          actionLabel: 'View Customer',  actionHref: '#/customers/C004/360', entityType: 'customer', entityId: 'C004', entityName: 'Rick Deckard Imports', repId: 'U010', generatedAt: '2026-05-08T06:00:00Z', dismissed: false },
  { id: 'REC002', type: 'high-risk-account',   severity: 'Action Required', title: 'Nostromo Supplies — inactive 45 days',       description: 'Account has no engagement for 45 days. Risk of permanent churn if not contacted.',         actionLabel: 'View Customer',  actionHref: '#/customers/C003/360', entityType: 'customer', entityId: 'C003', entityName: 'Nostromo Supplies',    repId: 'U010', generatedAt: '2026-05-08T06:00:00Z', dismissed: false },
  { id: 'REC003', type: 'collection-priority', severity: 'Action Required', title: 'Priority collections — 3 overdue accounts', description: '£365.50 total overdue across Cyberdyne, X-Files, Rick Deckard. Prioritise this week.',    actionLabel: 'View Collections', actionHref: '#/sales/collections', entityType: 'collection', generatedAt: '2026-05-08T06:00:00Z', dismissed: false },
  { id: 'REC004', type: 'inactive-lead',       severity: 'Warning',         title: 'Smoke Signal Co lead stalled — 14 days',     description: 'Lead has been in Demo stage for 14 days without activity. Rep action required.',           actionLabel: 'View Lead',      actionHref: '#/sales/leads', entityType: 'lead', entityId: 'L001', entityName: 'Smoke Signal Co',    repId: 'U004', generatedAt: '2026-05-08T06:00:00Z', dismissed: false },
  { id: 'REC005', type: 'high-performing-rep', severity: 'Info',            title: 'John Smith — top performer this week',       description: 'John Smith completed 8 visits and £4,820 revenue this week, 60% of monthly target.',       actionLabel: 'View Analytics', actionHref: '#/sales-manager/analytics', entityType: 'rep', entityId: 'U004', entityName: 'John Smith', generatedAt: '2026-05-08T06:00:00Z', dismissed: false },
  { id: 'REC006', type: 'low-engagement',      severity: 'Warning',         title: 'Emma Clarke — below visit target',           description: 'Emma has completed 6/20 visits this week (30%). Coaching or route review recommended.', actionLabel: 'View Team',      actionHref: '#/sales-manager/team', entityType: 'rep', entityId: 'U010', entityName: 'Emma Clarke', generatedAt: '2026-05-08T06:00:00Z', dismissed: false },
];