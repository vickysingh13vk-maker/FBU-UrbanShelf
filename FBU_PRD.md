# FBU Admin — Product Requirements Document (PRD)
**Version:** 1.0 | **Date:** May 2026 | **Status:** In Development

---

## CONTEXT FOR AI ASSISTANT

This document describes the FBU Admin platform — a wholesale distribution management system built in React + TypeScript. Use this PRD to:
- Plan next modules and features
- Write implementation prompts
- Understand what is already built vs what is missing
- Suggest architecture decisions

The codebase uses **mock data only** (no backend yet). All data lives in `data.ts`. Auth is simulated. The goal is to eventually connect to a real backend API.

---

## 1. Product Vision

**FBU (Fulfillment by Urbanshelf)** is a B2B wholesale distribution platform for vape and nicotine product distribution in the UK. It is an all-in-one operations system covering:

- Field sales rep management and tracking
- Customer relationship management (CRM)
- Order creation and fulfillment
- Inventory and warehouse management
- Supplier portal and onboarding
- Payment tracking and commission engine
- Business intelligence and analytics

**Target Users:**
- Wholesale distribution companies
- Field sales teams managing retail store accounts
- Suppliers distributing through FBU
- Operations managers overseeing the business

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build Tool | Vite 6 |
| Routing | React Router v7 (HashRouter — uses `#` URLs) |
| Styling | Tailwind CSS 3 |
| Charts | Recharts + Chart.js |
| Animations | Framer Motion (imported as `motion/react`) |
| Icons | Lucide React |
| Maps | Leaflet + React Leaflet |
| State Management | React Context API (5 contexts) |
| Data | Mock arrays in `data.ts` — NO backend yet |
| Auth | Simulated login matching email+password in mock array |

**Context Providers (wrap entire app):**
1. `AuthProvider` — authentication, user, role, permissions
2. `DashboardProvider` — dashboard state
3. `ProductProvider` — product operations
4. `SupplierProvider` — supplier features
5. `CheckInProvider` — GPS check-in state

**Dev URL:** `http://localhost:5005`

---

## 3. User Roles

### Role Definitions

| Role ID | Role Name | Description |
|---|---|---|
| R001 | Admin | Full system access, all permissions |
| R002 | Manager | All modules except Users and Administration |
| R006 | Sales Manager | Manages sales team, sees analytics + rep performance |
| R003 | Sales Rep | Field rep — own customers, orders, GPS check-in, commission |
| R004 | Viewer | Read-only access to all modules |
| R005 | Supplier | Access to supplier portal only |

### Test Credentials

| Role | Email | Password | Login Redirects To |
|---|---|---|---|
| Admin | admin@urbanshelf.com | admin123 | Main Dashboard |
| Admin | vikram.aimshala@gmail.com | password123 | Main Dashboard |
| Manager | manager@urbanshelf.com | manager123 | Main Dashboard |
| Sales Manager | david.patel@demand.com | manager123 | Main Dashboard |
| Sales Rep | john.smith@demand.com | sales123 | Sales Rep Dashboard |
| Sales Rep | emma.clarke@demand.com | salesrep123 | Sales Rep Dashboard |
| Viewer | viewer@urbanshelf.com | password123 | Main Dashboard (Suspended) |
| Supplier | supplier@demo.com | 123456 | Supplier Portal |
| Supplier | partner@fbu.com | partner123 | Supplier Onboarding |

### Permission Matrix

| Module | Admin | Manager | Sales Manager | Sales Rep | Viewer | Supplier |
|---|---|---|---|---|---|---|
| Dashboard | Full | Full | View | View | View | View |
| Analytics | Full | Full | View | ❌ | View | View |
| Orders | Full | Create/Edit | Create/Edit | Create/Edit | View | View |
| Products | Full | Create/Edit | View | View | View | View |
| Customers | Full | Create/Edit | Create/Edit | Create/Edit | View | ❌ |
| Suppliers | Full | Create/Edit | View | ❌ | View | View |
| Inventory | Full | Create/Edit | ❌ | ❌ | View | View |
| Users | Full | ❌ | ❌ | ❌ | View | ❌ |
| Administration | Full | ❌ | ❌ | ❌ | View | ❌ |
| Categories | Full | Create/Edit | View | ❌ | View | ❌ |
| Marketing | Full | Create/Edit | ❌ | ❌ | View | ❌ |
| Coupons | Full | Create/Edit | ❌ | ❌ | View | ❌ |
| Pricing Tiers | Full | Create/Edit | ❌ | ❌ | View | ❌ |
| Loyalty Program | Full | Create/Edit | ❌ | ❌ | View | ❌ |

---

## 4. Application Architecture

### Route Structure

```
/login                          — Login page (public)
/supplier/login                 — Supplier login (public)
/supplier/onboarding            — Supplier onboarding (public, post-login)

/ (protected, wrapped in Layout)
├── /                           → Main Dashboard
├── /sales-rep-dashboard        → Sales Rep Dashboard
├── /analytics                  → Analytics
├── /rep-performance            → Rep Performance
├── /orders                     → Orders management
├── /products                   → Products list
├── /inventory                  → Inventory
├── /stock-reversal-ledger      → Stock reversals
├── /customers                  → Customers list
├── /customers/:id              → Customer detail (view)
├── /customers/:id/edit         → Customer detail (edit)
├── /check-in                   → GPS Check-In
├── /commission                 → Commission Dashboard
├── /coupons                    → Coupons
├── /pricing                    → Pricing Tiers
├── /marketing                  → Marketing campaigns
├── /active-carts               → Active shopping carts
├── /suppliers                  → Suppliers
├── /categories                 → Categories
├── /users                      → User management
├── /roles                      → Roles & permissions
├── /admin                      → Administration
├── /loyalty                    → Loyalty program (placeholder)
└── /supplier/*                 → Supplier portal (14 sub-routes)
```

### Navigation Logic

- **Supplier role** → sees supplier-specific nav only
- **All other roles** → `allNavigation` filtered by `hasPermission(module, 'view')`
- **Sales Rep login** → auto-redirected to `/sales-rep-dashboard`
- **Supplier login** → redirected to `/supplier/dashboard` or `/supplier/onboarding`

---

## 5. Modules — Fully Built

### 5.1 Authentication (`/login`)
- Email + password login against mock USERS array
- Role-based redirect on success
- Error state display
- Remember me checkbox (UI only)
- Forgot password button (UI only)
- Auth persisted in localStorage as `auth_user`

### 5.2 Main Dashboard (`/`)
**Visible to:** Admin, Manager, Sales Manager, Viewer

Tabs: Overview | Sales Representatives | Customer Ledger

**Overview tab:**
- 5 KPI panels: Sales Activity, Customer Activity, Financial Health, Inventory Status, FBU Operations
- Each panel has multiple sub-metrics with trend indicators
- Live / Historic / Real-time data toggle
- Inventory Stock Overview (horizontal bar chart, per product line)
- Balance Ranking table (customers ranked by outstanding debt, risk color coding: Critical/Warning/Good)
- All KPIs calculated from ORDERS, CUSTOMERS, PRODUCTS mock data

**Sales Representatives tab:**
- Rep performance table with visit counts, sales, conversion

**Customer Ledger tab:**
- Customer financial ledger view

### 5.3 Sales Rep Dashboard (`/sales-rep-dashboard`)
**Visible to:** All roles (Sales Rep lands here on login)

- **Header:** Rep avatar (initials), name, role badge, date, Go Online / Go Offline button
- **Session Banner:** appears when Online — live HH:MM:SS timer, current check-in location, End Visit button
- **4 KPI cards:** Today's Visits (X/Y), Active Orders (count), Revenue Today (£), My Commission (£ earned + pending)
- **Quick Actions row:** GPS Check-In | Create Order | My Customers | Commission
- **Today's Activities timeline:** 5 mock activities with type badge (Visit/Order/Follow-up/Payment), completion checkmark, time, outcome note, progress bar showing % complete
- **This Week chart:** Recharts BarChart — visits vs orders per day of week
- **Recent Orders:** 5 most recent orders — customer name, order ID, date, item count, total, status badge
- **Current Visit card (right column):**
  - If checked in: store name, address, phone, credit limit, "View Profile" + "Create Order" + "End Visit" buttons
  - If not checked in: empty state with "Start Check-In" CTA
- **My Customers list:** Top 5 approved customers — avatar, store name, wallet balance (red if outstanding), inline GPS check-in icon button per row
- **Commission widget:** Earned / Pending / Total rows + 3 recent commission entries with Earned/Pending badges
- **Monthly Target area chart:** actual revenue vs target per week

### 5.4 Orders (`/orders`)
**Visible to:** All except Supplier (Supplier has own order page)

**List View:**
- Search by order ID or customer name
- Filter by status (Pending/Approved/Picking/Packed/Shipped/Delivered/Cancelled)
- Filter by payment status (Paid/Unpaid/Pending/Refunded)
- Sort by multiple fields with direction toggle
- Pagination with configurable items-per-page
- Delete order (with confirmation)
- Stock reversal from approved orders

**Create Order (3-step wizard):**
- Step 1 — Customer Selection: search, filter by status/credit/balance, tabs (All/Recent/Favorites/Frequent), credit info display, add to favorites
- Step 2 — Product Selection: search, category filter, flavor picker modal, stock health indicators, add/remove with quantity controls
- Step 3 — Configuration: coupon code, delivery notes, use-credit toggle, full cart summary with subtotal/discount/total

**Order Detail Modal:**
- Customer info, order meta, all line items with quantities
- Financial summary (subtotal, 20% tax, total)
- Delivery address
- Action buttons: Print, Invoice, Update Status, Edit Price, Reverse Stock

**Status Update Modal:** change status with validation

**Price Edit Modal:**
- Per-item price editing with quantity adjustment
- Coupon code application
- Warning: editing price reverts approved orders to Pending

**Stock Reversal Modal:**
- Select product + quantity
- Type: Add Stock Back / Remove Extra Stock
- Reason: Customer Return / Dispatch Error / Warehouse Adjustment / Damaged Stock / Other
- Notes field

### 5.5 Customers (`/customers`)
**Visible to:** Admin, Manager, Sales Manager, Sales Rep, Viewer

- List with search (name/email/company), filter (category, supplier), sort (name, company, status, credit, wallet, joined date), paginate
- View toggle: table / grid
- Stats: Total / Approved / Pending / Blocked
- Add customer form:
  - Personal: first name, last name, email, phone, mobile
  - Business: company name, trading name, reg number
  - Address: full address
  - Financial: credit limit (default £5,000), opening balance
- Edit customer inline
- Permission-gated add/edit buttons

### 5.6 Customer Details (`/customers/:id`)
**3 tabs:**

**Profile tab:**
- Avatar, name, company, status badge, joined date
- Full contact info (email, phone, mobile)
- Full business info (company, trading name, reg no)
- Full address
- Edit mode toggle with form validation

**Credit & Financials tab:**
- Credit limit (editable in edit mode)
- Outstanding balance (absolute value of negative wallet)
- Total paid (sum of Delivered + Processing orders)
- Available credit (limit − outstanding)
- Color-coded cards

**Orders tab:**
- All orders for this customer
- Filtered list with status badges
- 4 modals: Order Detail, Status Update, Price Edit, Stock Reversal
- Price edit warning if order was approved
- Stock reversal tracks product, qty, type, reason, notes

### 5.7 GPS Check-In (`/check-in`)
**Visible to:** Sales Rep (primarily)

- Search customers by store name or customer name
- Customer list with store image, store name, address, status, outstanding balance, credit limit
- "GPS Check-In" button per customer
- Uses `navigator.geolocation` API — high accuracy mode, 5s timeout
- Distance threshold: 0.002 degrees (~200m) via Haversine formula
- Demo fallback: allows check-in if GPS unavailable
- On success: sets `checkedInCustomer` in global CheckInContext
- "Checked In" state shown in button and visible across all pages

### 5.8 Commission Dashboard (`/commission`)
**Visible to:** Sales Rep, Admin

- Summary cards: Earned (£308.50) / Pending (£131.50) / Blocked (£143.00)
- Tab filter: Earned | Pending | Blocked
- Commission entry list: order ID, customer, order value, commission amount, status
- Detail modal (bottom sheet): commission amount, order value, status reason
  - Earned: "Payment received"
  - Pending: "Awaiting customer payment"
  - Blocked: "Order disputed" / "High return rate"

### 5.9 Analytics (`/analytics`)
**Visible to:** Admin, Manager, Sales Manager, Viewer

- Sticky global filter: date range + status + reset + export
- Summary cards: Total Orders, Pending Orders, Active Products, Total Users (real calculations)
- Orders performance area chart (by date, by status)
- Status donut chart with center label
- Inventory health bar chart (In Stock / Low Stock / Out of Stock)
- Products by category bar chart
- Top 10 selling products horizontal bar
- User growth area chart
- User activity snapshot with pulsing "active now" indicator
- Marketing section (email campaigns, coupons count)
- Loyalty program empty state

### 5.10 Rep Performance (`/rep-performance`)
**Visible to:** Admin, Manager, Sales Manager

- 6 sales reps with real visit/sales mock data
- KPI bar: Total visits 676, App downloads 90, Boxes sold 229, CDUs 30, Sales 36
- Visit & Sales Conversion bar chart (visits vs downloads vs boxes vs sales per rep)
- Visit status pie: First visits (541) / Revisits (114) / Phone calls (21)
- Decision maker availability pie (Yes 266 / No 410)
- Stocking Lost Mary pie (Yes 204 / No 472)
- Where purchasing from pie (13 suppliers: Cash & Carry 29%, Bookers 22.8%, etc.)
- Top vape suppliers pie: SKE Crystal 33.4%, Lost Mary 24.3%, IVG 18.4%
- Top nicotine pouches pie: Velo 43.6%, Pablo 15.9%
- Weekly visits trend line chart (4 weeks)
- Geographic heatmap: London 251, Glasgow 145, Cardiff 142, Birmingham 49, Manchester

### 5.11 Users (`/users`)
**Visible to:** Admin only

- List: search name/email, filter by role, filter by status
- Stats: Total / Active / Inactive
- Create user modal: name, email, password, confirm password, role, status
- Edit user modal (same fields, no password)
- Deactivate / Delete buttons
- Dynamic role dropdown from ROLES array

### 5.12 Roles & Permissions (`/roles`)
**Visible to:** Admin only

- All 6 roles listed
- Per-module permission grid (view/create/edit/delete checkboxes)

### 5.13 Products (`/products`)
- Product list: search, category filter, supplier filter
- Grid / list view toggle
- Fields: name, SKU, barcode, category, supplier, flavour, price (wholesale), MRP (retail), stock, reserved, damaged, status, unitsPerCarton, warehouseLocation, batchNumber, expiryDate

### 5.14 Inventory (`/inventory`)
- Stock levels overview
- Reserved stock, damaged stock
- Warehouse location per product

### 5.15 Stock Reversal Ledger (`/stock-reversal-ledger`)
- Full history of all stock reversal events
- Columns: date, order ID, customer, product, flavour, original qty, reversal qty, type, reason, admin user

### 5.16 Coupons (`/coupons`)
- 5 coupons: code, type (% or fixed), value, min order, max uses, status
- Statuses: Active / Expired / Upcoming
- Category-specific applicability

### 5.17 Pricing Tiers (`/pricing`)
- 3 strategies: Standard Wholesale, Volume Breakers, VIP Discount
- Tiered discount tables with quantity breakpoints

### 5.18 Marketing (`/marketing`)
- 5 email campaigns: title, subject, status (DRAFT/SENT/FAILED/SENDING)
- Recipient count, delivery stats, timestamps

### 5.19 Suppliers (`/suppliers`)
- 3 suppliers: name, logo, product count, status, GST, contact, bank, verification

### 5.20 Categories (`/categories`)
- 5 categories: Vaping, Deals, Pre-filled Vape Kits, Nicotine Pouches, Open Devices
- Product count per category

### 5.21 Active Carts (`/active-carts`)
- 6 abandoned/active carts
- Customer, email, item count, total qty, product names, last updated

---

## 6. Supplier Portal (`/supplier/*`)

Entirely separate navigation and UI for supplier users.

| Page | Route | What It Does |
|---|---|---|
| Onboarding | /supplier/onboarding | Multi-step setup flow for new suppliers — must complete before portal access |
| Dashboard | /supplier/dashboard | KPIs, recent orders, top products, demand forecast card, inventory insights card |
| Products | /supplier/products | Supplier's product list with stock levels |
| Product Detail | /supplier/products/:id | Full product detail, variants, analytics |
| Inbound Shipments | /supplier/inbound | Carton-based storage estimate, shipment creation flow |
| Orders | /supplier/orders | Supplier's orders from FBU |
| Order Detail | /supplier/orders/:id | Full order breakdown |
| Performance | /supplier/performance | Sales metrics, fulfillment rate, returns rate |
| Sales Analytics | /supplier/analytics | Revenue trends, product performance charts |
| Market Insights | /supplier/market-insights | Regional demand, competitor data |
| Pricing | /supplier/pricing | Set and manage product pricing |
| Promotions | /supplier/promotions | Create promotions and deals |
| Inventory | /supplier/inventory | Stock levels, filter, update stock modal |
| Finance | /supplier/finance | Transactions, revenue, KPI cards, finance charts |
| Reports | /supplier/reports | Report templates, generate and view history |
| Account Manager | /supplier/account-manager | Communication channel with FBU account manager |
| Settings | /supplier/settings | Supplier account settings |

---

## 7. Data Models (Current Mock)

### Products (13 items)
```
id, name, sku, barcode, category, supplier, flavour,
price (wholesale), mrp (retail), stock, reservedStock, damagedStock,
status (Active | Low Stock | Draft),
image, unitsPerCarton, weight, warehouseLocation, batchNumber, expiryDate
```

### Orders (9 items)
```
id, customer (name string), date, total (£), items (count),
status (Pending|Approved|Picking|Packed|Shipped|Delivered|Cancelled),
paymentStatus (Paid|Unpaid|Pending|Refunded)
```

### Customers (6 items)
```
id, name, email, phone, mobile, companyName, storeName, regNo,
address, status (Approved|Pending|Blocked),
walletBalance (negative = outstanding debt), creditLimit,
joinedDate, image, category, supplier
```

### Users (11 items)
```
id, name, email, password, roleId, roleName, status, createdDate,
image?, onboardingCompleted? (Supplier only)
```

### Roles (6 items)
```
id (R001-R006), name, description,
permissions: [{ module, view, create, edit, delete }]
```

### Coupons (5 items)
```
id, code, type (percentage|fixed), value, minOrder,
maxUses, usedCount, status, applicableCategories
```

### TypeScript Interfaces (47 total in types.ts)
Core: Product, Order, Customer, Cart, Supplier, User, Role, Permission, Coupon, PricingStrategy, Campaign, StockReversal, CommissionEntry, SalesRep, Warehouse, Category

Supplier-specific: SupplierOrder, SupplierInventoryItem, SupplierShipment, SupplierFinanceData, SupplierTransaction, SupplierAnalyticsData, MarketRegion, Promotion, ReportTemplate, ReportHistoryItem

---

## 8. What Is NOT Built Yet (Backlog)

### High Priority — Core CRM Gaps

| Feature | Description | Complexity |
|---|---|---|
| Work Session Management | Go Online/Offline with real persistence, session timer, attendance log | Medium |
| Activity Logging | Log visits, meetings, follow-ups, calls with full timeline per rep | High |
| Customer → Rep Assignment | Assign specific customers to specific reps, rep can only see own | Medium |
| Customer Lifecycle Stages | Lead → Engaged → Active → At Risk → Inactive → Archived | Medium |
| Communication/Chat History | Per-customer chat/note history between rep and customer | Medium |
| GPS Route Tracking | Record rep movement throughout day, visualize on map | High |

### Medium Priority — Sales & Finance

| Feature | Description | Complexity |
|---|---|---|
| Real Commission Engine | Calculate commission from orders, payments, targets, product types | High |
| Invoice Generation | Generate and download PDF invoices from orders | Medium |
| Payment Collection Tracking | Log payments received by rep, update outstanding balance | Medium |
| Payment Reminders | Auto alerts for overdue invoices | Low |
| Credit Scoring | Auto risk score customers based on payment history | High |

### Infrastructure (Required for Production)

| Feature | Description |
|---|---|
| Backend API | REST or GraphQL API to replace all mock data |
| Real Database | PostgreSQL or equivalent with proper schema |
| Real Authentication | JWT or session-based, role-based middleware |
| Data Persistence | Nothing persists on page refresh currently |
| Offline Mode | Local storage sync for field reps with no signal |
| File Uploads | Product images, documents, receipts |

### Future / Roadmap

| Feature | Description |
|---|---|
| AI Route Planning | Optimize daily rep routes using AI |
| Gamification | Leaderboards, rep challenges, rewards |
| WhatsApp Integration | Order updates, payment reminders via WhatsApp |
| Customer App/Portal | Customer-facing app to place orders directly |
| Fake Activity Detection | Flag short visits, no-movement check-ins |
| Idle Alerts | Notify manager if rep inactive too long |

---

## 9. UI Design System

**Component Library (custom, in `/components/ui/`):**
- `Card` + `CardHeader` — base container, padding variants: none/sm/md/lg
- `Badge` — variants: success/warning/danger/neutral/info/primary
- `Button` — variants: primary/secondary/outline/ghost/danger; sizes: xs/sm/md/lg
- `Input` — labeled input with icon support
- `Table`, `THead`, `TBody`, `TR`, `TH`, `TD`
- `Modal` — dialog component
- `Drawer` — slide-out panel
- `Tabs` — tab navigation
- `Pagination`
- `Toast` — notifications
- `KpiCard`
- `Breadcrumbs`
- `ViewModeToggle`
- `Sidebar`, `Navbar`

**Color Palette (Tailwind):**
- Primary: `#0B1F3A` (dark navy)
- Accent: `#2666B5` (blue)
- Success: emerald-500
- Warning: amber-400
- Danger: rose-500
- Neutral backgrounds: slate-50, slate-100

**Animation Pattern:**
```tsx
import { motion, AnimatePresence } from 'motion/react';
initial={{ opacity: 0, y: 10 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0 }}
```

**Chart Pattern (Recharts):**
```tsx
<ResponsiveContainer width="100%" height={220}>
  <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
    <XAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
    <YAxis axisLine={false} tickLine={false} />
    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
    <Bar radius={[6, 6, 0, 0]} maxBarSize={32} />
  </BarChart>
</ResponsiveContainer>
```

---

## 10. File Structure

```
/
├── App.tsx                     — Routes, context providers
├── data.ts                     — All mock data (PRODUCTS, ORDERS, CUSTOMERS, USERS, ROLES, etc.)
├── types.ts                    — 47 TypeScript interfaces
├── index.tsx                   — Entry point
├── components/
│   ├── Layout.tsx              — Sidebar + Navbar wrapper, nav arrays, auth check
│   ├── ModernCharts.tsx
│   ├── ui/                     — Design system components
│   └── supplier/               — Supplier-specific components
├── pages/
│   ├── Dashboard.tsx           — Main admin dashboard (205KB — largest file)
│   ├── SalesRepDashboard.tsx   — Sales rep specific dashboard
│   ├── Orders.tsx              — Full order management (106KB)
│   ├── CustomerDetails.tsx     — Customer profile + orders (50KB)
│   ├── Customers.tsx           — Customer list (31KB)
│   ├── Analytics.tsx
│   ├── RepPerformance.tsx
│   ├── CommissionDashboard.tsx
│   ├── CheckIn.tsx
│   ├── Users.tsx
│   ├── RolesPermissions.tsx
│   ├── Products.tsx
│   ├── Inventory.tsx
│   ├── StockReversalLedger.tsx
│   ├── Marketing.tsx
│   ├── Coupons.tsx
│   ├── PricingTiers.tsx
│   ├── Suppliers.tsx
│   ├── Categories.tsx
│   ├── ActiveCarts.tsx
│   ├── Login.tsx
│   ├── SupplierLogin.tsx
│   ├── GenericPage.tsx
│   └── supplier/               — 14 supplier portal pages
├── context/
│   ├── AuthContext.tsx          — login(), logout(), hasPermission(), user, role
│   ├── CheckInContext.tsx       — checkIn(), checkOut(), checkedInCustomer, GPS logic
│   ├── DashboardContext.tsx
│   ├── ProductContext.tsx
│   └── SupplierContext.tsx
├── hooks/
│   └── useHistoricData.ts
├── mock/                       — Supplier-specific mock data
├── data/
│   └── dashboardData.ts
├── utils/
│   └── chartHelpers.tsx
└── constants/
    └── supplierStatus.ts
```

---

## 11. How to Use This PRD With AI

**To plan next module, use this prompt format:**

```
I am building a feature for FBU Admin — a React + TypeScript wholesale distribution CRM.

Context:
- No backend yet (all mock data in data.ts)
- Uses React Context for state
- Uses Recharts for charts, Framer Motion for animation, Lucide for icons, Tailwind for styling
- Components from custom UI library: Card, CardHeader, Badge, Button, Input, Modal, Table
- Routes use HashRouter (#/ prefix)
- Auth via useAuth() hook — user.roleName and hasPermission(module, action) available

What's already built: [paste relevant section from this PRD]

What I want to build next: [describe feature]

Please provide:
1. Complete implementation plan
2. Data model / TypeScript interfaces needed
3. Step-by-step build order
4. Full code for the main page component
5. Any changes needed to data.ts, types.ts, App.tsx, Layout.tsx
```
