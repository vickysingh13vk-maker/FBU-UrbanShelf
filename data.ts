import { Product, Order, Supplier, Category, User, Customer, Cart, Coupon, PricingStrategy, Campaign, Role, Warehouse } from './types';

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
  { id: '326', customer: 'James Cameron', date: '02/02/2026', total: 1186.26, items: 5, status: 'Approved', paymentStatus: 'Paid' },
  { id: '325', customer: 'Sarah Connor', date: '30/01/2026', total: 120.00, items: 2, status: 'Picking', paymentStatus: 'Paid' },
  { id: '324', customer: 'Rick Deckard', date: '30/01/2026', total: 260.00, items: 12, status: 'Pending', paymentStatus: 'Pending' },
  { id: '322', customer: 'James Cameron', date: '29/01/2026', total: 265.00, items: 1, status: 'Delivered', paymentStatus: 'Paid' },
  { id: '321', customer: 'Marty McFly', date: '22/01/2026', total: 327.90, items: 25, status: 'Shipped', paymentStatus: 'Paid' },
  { id: '318', customer: 'Ellen Ripley', date: '15/01/2026', total: 284.94, items: 3, status: 'Packed', paymentStatus: 'Paid' },
  { id: '317', customer: 'Sarah Connor', date: '13/01/2026', total: 263.08, items: 1, status: 'Delivered', paymentStatus: 'Paid' },
  { id: '315', customer: 'James Cameron', date: '10/01/2026', total: 1500.00, items: 8, status: 'Approved', paymentStatus: 'Paid' },
  { id: '314', customer: 'Rick Deckard', date: '08/01/2026', total: 45.99, items: 1, status: 'Cancelled', paymentStatus: 'Refunded' },
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
    category: 'Vaping', supplier: 'Lost Mary'
  },
  { 
    id: 'C002', name: 'Sarah Connor', email: 'sarah@skynet.net', phone: '+44 7700 900088', mobile: '+44 7800 654321', 
    companyName: 'Cyberdyne Systems', storeName: 'Cyberdyne Retail', regNo: 'GB87654321', 
    address: '456 Future Rd, Manchester, M1 2AB', status: 'Approved', walletBalance: 45.50, creditLimit: 2500,
    joinedDate: 'Sep 20, 2023', image: 'https://i.pravatar.cc/150?u=C002',
    category: 'Nicotine Pouch', supplier: 'Velo'
  },
  { 
    id: 'C003', name: 'Ellen Ripley', email: 'ripley@weyland.com', phone: '+44 7700 900099', 
    companyName: 'Weyland-Yutani', storeName: 'Nostromo Supplies', regNo: 'GB99887766', 
    address: '789 Space Blvd, Liverpool, L3 4CD', status: 'Pending', walletBalance: 0.00, creditLimit: 1000,
    joinedDate: 'Nov 01, 2023',
    category: 'Vaping', supplier: 'Elf Bar'
  },
  { 
    id: 'C004', name: 'Rick Deckard', email: 'rick@tyrell.com', phone: '+44 7700 900100', 
    companyName: 'Tyrell Corp', storeName: 'RepliCant', regNo: 'GB55443322', 
    address: '2049 Blade Runner St, Los Angeles, LA', status: 'Approved', walletBalance: 500.00, creditLimit: 10000,
    joinedDate: 'Aug 10, 2023', image: 'https://i.pravatar.cc/150?u=C004',
    category: 'Open Devices', supplier: 'Lost Mary'
  },
  { 
    id: 'C005', name: 'Dana Scully', email: 'dana@fbi.gov', phone: '+44 7700 900101', 
    companyName: 'FBI', storeName: 'X-Files Archive', regNo: 'GB11223344', 
    address: '1013 Truth Rd, Washington, DC', status: 'Blocked', walletBalance: 120.50, creditLimit: 0,
    joinedDate: 'Jan 12, 2023', image: 'https://i.pravatar.cc/150?u=C005',
    category: 'Deals and Offers', supplier: 'Elf Bar'
  },
  { 
    id: 'C006', name: 'Marty McFly', email: 'marty@hillvalley.com', phone: '+44 7700 900102', 
    companyName: 'Doc Brown Ent', storeName: 'Time Travel Emporium', regNo: 'GB99880011', 
    address: '88 MPH Lane, Hill Valley, CA', status: 'Approved', walletBalance: 19.85, creditLimit: 1500,
    joinedDate: 'Oct 21, 2023', image: 'https://i.pravatar.cc/150?u=C006',
    category: 'Vaping', supplier: 'Velo'
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
    name: 'Sales',
    description: 'Can view products and manage orders and customers.',
    permissions: MODULES.map(m => ({ 
      module: m, 
      view: ['Dashboard', 'Products', 'Orders', 'Customers'].includes(m), 
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
    name: 'Alice Williams', 
    email: 'sales@urbanshelf.com', 
    password: 'sales123',
    roleId: 'R003', 
    roleName: 'Sales',
    status: 'Active',
    createdDate: '2023-04-20'
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