# FBU Admin — Complete Application Flowchart

> Render this file in any Mermaid-compatible viewer:
> - GitHub / GitLab (paste into .md file)
> - https://mermaid.live (paste diagram code)
> - VS Code with Mermaid Preview extension
> - Notion (paste as code block, select Mermaid)

---

## 1. Authentication & Role Routing

```mermaid
flowchart TD
    START([User visits app]) --> HASH{Hash route?}
    HASH -->|/#/login| LOGIN[Login Page]
    HASH -->|/#/supplier/login| SLOGIN[Supplier Login Page]
    HASH -->|Any other route| AUTHCHECK{Authenticated?}
    AUTHCHECK -->|No| LOGIN
    AUTHCHECK -->|Yes| ROLECHECK

    LOGIN --> CREDS[Enter email + password]
    CREDS --> VALIDATE{Match in USERS array?}
    VALIDATE -->|No| ERR[Show: Invalid email or password]
    ERR --> CREDS
    VALIDATE -->|Yes| STATUSCHECK{Account status?}
    STATUSCHECK -->|Suspended| SERR[Show: Account suspended]
    STATUSCHECK -->|Active| ROLECHECK

    SLOGIN --> SCREDS[Enter supplier credentials]
    SCREDS --> SVALIDATE{Valid supplier?}
    SVALIDATE -->|No| SERR2[Show error]
    SVALIDATE -->|Yes| ROLECHECK

    ROLECHECK{Check roleName}
    ROLECHECK -->|Supplier + onboarding incomplete| ONBOARD[/supplier/onboarding]
    ROLECHECK -->|Supplier + onboarding complete| SDASH[/supplier/dashboard]
    ROLECHECK -->|Sales Rep| REPDASH[/sales-rep-dashboard]
    ROLECHECK -->|Admin / Manager / Sales Manager / Viewer| MAINDASH[/ Main Dashboard]
```

---

## 2. Admin / Manager Flow

```mermaid
flowchart TD
    MAINDASH[Main Dashboard\nOperational Control Center] --> ADMINNAV{Navigation}

    ADMINNAV --> ANALYTICS[/analytics\nAnalytics]
    ADMINNAV --> REPPERF[/rep-performance\nRep Performance]
    ADMINNAV --> ORDERS[/orders\nOrders]
    ADMINNAV --> PRODUCTS[/products\nProducts]
    ADMINNAV --> SUPPLIERS[/suppliers\nSuppliers]
    ADMINNAV --> CATEGORIES[/categories\nCategories]
    ADMINNAV --> CUSTOMERS[/customers\nCustomers]
    ADMINNAV --> MARKETING[/marketing\nMarketing]
    ADMINNAV --> COUPONS[/coupons\nCoupons]
    ADMINNAV --> LOYALTY[/loyalty\nLoyalty Program]
    ADMINNAV --> PRICING[/pricing\nPricing Tiers]
    ADMINNAV --> INVENTORY[/inventory\nInventory]
    ADMINNAV --> STOCKREV[/stock-reversal-ledger\nStock Reversals]
    ADMINNAV --> USERS[/users\nUsers]
    ADMINNAV --> ROLES[/roles\nRoles & Permissions]
    ADMINNAV --> ADMIN[/admin\nAdministration]
    ADMINNAV --> CARTS[/active-carts\nActive Carts]

    MAINDASH --> DASHTABS{Dashboard Tabs}
    DASHTABS --> OVERVIEW[Overview\nKPIs + Charts]
    DASHTABS --> SALESREPS[Sales Representatives\nRep table]
    DASHTABS --> LEDGER[Customer Ledger\nBalance ranking]
```

---

## 3. Orders Flow

```mermaid
flowchart TD
    ORDERS[Orders Page] --> ORDERVIEW{View}
    ORDERVIEW --> ORDERLIST[Order List\nSearch + Filter + Sort]
    ORDERVIEW --> CREATEORDER[Create New Order\n3-Step Wizard]

    ORDERLIST --> ORDERACTIONS{Order Actions}
    ORDERACTIONS --> VIEWDETAIL[View Detail Modal\nItems + Pricing + Address]
    ORDERACTIONS --> UPDATESTATUS[Update Status Modal\nPending→Approved→Picking→Packed→Shipped→Delivered]
    ORDERACTIONS --> EDITPRICE[Edit Price Modal\nPer-item + Coupon\nWarning: reverts to Pending]
    ORDERACTIONS --> STOCKREV2[Stock Reversal Modal\nAdd Back / Damaged]
    ORDERACTIONS --> DELETEORDER[Delete Order\nConfirmation required]

    CREATEORDER --> STEP1[Step 1: Select Customer\nSearch + Filter + Favorites\nShows credit info]
    STEP1 --> STEP2[Step 2: Select Products\nSearch + Category filter\nFlavour picker + Stock indicator]
    STEP2 --> STEP3[Step 3: Configure Order\nCoupon code\nDelivery notes\nUse credit toggle\nCart summary]
    STEP3 --> CONFIRM[Confirm Order\nSubtotal + Tax 20% + Discount = Total]
```

---

## 4. Customer Management Flow

```mermaid
flowchart TD
    CUSTOMERS[Customers List\nSearch + Filter + Sort] --> CUSTACTIONS{Actions}

    CUSTACTIONS --> ADDCUST[Add Customer Form\nPersonal + Business + Address + Financial]
    CUSTACTIONS --> VIEWCUST[Customer Detail Page\n/customers/:id]

    VIEWCUST --> CUSTTABS{3 Tabs}
    CUSTTABS --> PROFILE[Profile Tab\nContact + Business info\nEdit mode]
    CUSTTABS --> FINANCE[Credit & Financials Tab\nCredit limit\nOutstanding balance\nTotal paid\nAvailable credit]
    CUSTTABS --> CUSTORDERS[Orders Tab\nCustomer order history]

    CUSTORDERS --> ORDERMODALS{Order Modals}
    ORDERMODALS --> DETAIL[Order Detail Modal]
    ORDERMODALS --> STATUS[Status Update Modal]
    ORDERMODALS --> PRICE[Price Edit Modal]
    ORDERMODALS --> REVERSAL[Stock Reversal Modal]
```

---

## 5. Sales Rep Flow

```mermaid
flowchart TD
    LOGIN_REP([Sales Rep Login]) --> REPDASH[Sales Rep Dashboard\n/sales-rep-dashboard]

    REPDASH --> SESSION{Work Session}
    SESSION -->|Click Go Online| ONLINE[Session Active\nLive timer starts\nGPS enabled]
    ONLINE -->|Click Go Offline| OFFLINE[Session Ended\nTimer stops]

    REPDASH --> REPACTIONS{Quick Actions}
    REPACTIONS --> CHECKIN_BTN[GPS Check-In\n/check-in]
    REPACTIONS --> CREATE_ORDER[Create Order\n/orders]
    REPACTIONS --> MY_CUSTOMERS[My Customers\n/customers]
    REPACTIONS --> COMMISSION_BTN[Commission\n/commission]

    CHECKIN_BTN --> CHECKIN_FLOW[Check-In Page\nSearch customers]
    CHECKIN_FLOW --> GPS{GPS Proximity Check\nnav.geolocation API\nThreshold: ~200m}
    GPS -->|Within range| CHECKED[Checked In ✓\nGlobal state set\nVisible on dashboard]
    GPS -->|Too far| GPSERR[Error: Too far from customer]
    GPS -->|GPS unavailable| FALLBACK[Demo fallback\nAllow check-in]
    CHECKED --> VISIT[Active Visit\nShow in dashboard\nView Profile + Create Order + End Visit]
    VISIT -->|End Visit| CHECKOUT[Check Out\nClear global state]

    REPDASH --> REPDASH_SECTIONS{Dashboard Sections}
    REPDASH_SECTIONS --> KPIS[4 KPI Cards\nVisits + Orders + Revenue + Commission]
    REPDASH_SECTIONS --> ACTIVITIES[Today's Activities Timeline\n5 activities with progress bar]
    REPDASH_SECTIONS --> WEEKLY[This Week Bar Chart\nVisits vs Orders]
    REPDASH_SECTIONS --> RECENT_ORDERS[Recent Orders List]
    REPDASH_SECTIONS --> CURRENT_VISIT[Current Visit Card]
    REPDASH_SECTIONS --> MYCUSTOMERS[My Customers List\nInline check-in button]
    REPDASH_SECTIONS --> COMMISSION_WIDGET[Commission Widget\nEarned + Pending + Total]
    REPDASH_SECTIONS --> TARGET[Monthly Target Chart\nActual vs Target]
```

---

## 6. Supplier Portal Flow

```mermaid
flowchart TD
    SNEW([New Supplier Login]) --> ONBOARD_CHECK{Onboarding complete?}
    ONBOARD_CHECK -->|No| ONBOARD[Supplier Onboarding\n/supplier/onboarding\nMulti-step setup]
    ONBOARD --> ONBOARD_DONE[Mark complete\nonboardingCompleted = true]
    ONBOARD_DONE --> SDASH

    SEXIST([Existing Supplier Login]) --> SDASH[Supplier Dashboard\n/supplier/dashboard]

    SDASH --> SUPNAV{Supplier Navigation}

    SUPNAV --> SP[Products\n/supplier/products]
    SP --> SPD[Product Detail\n/supplier/products/:id]

    SUPNAV --> SINBOUND[Inbound Shipments\n/supplier/inbound\nCarton-based storage estimate]

    SUPNAV --> SORDERS[Orders\n/supplier/orders]
    SORDERS --> SORDERDETAIL[Order Detail\n/supplier/orders/:id]

    SUPNAV --> SPERF[Performance\n/supplier/performance]
    SUPNAV --> SANALYTICS[Sales Analytics\n/supplier/analytics]
    SUPNAV --> SMARKET[Market Insights\n/supplier/market-insights]
    SUPNAV --> SPRICING[Pricing\n/supplier/pricing]
    SUPNAV --> SPROMO[Promotions\n/supplier/promotions]
    SUPNAV --> SINV[Inventory\n/supplier/inventory]
    SUPNAV --> SFIN[Finance\n/supplier/finance]
    SUPNAV --> SREPORTS[Reports\n/supplier/reports]
    SUPNAV --> SACCT[Account Manager\n/supplier/account-manager]
    SUPNAV --> SSETTINGS[Settings\n/supplier/settings]
```

---

## 7. Permission-Based Navigation

```mermaid
flowchart TD
    NAV_LOGIC[Layout.tsx\nBuilds navigation] --> ISSUPPLIER{user.roleName\n=== Supplier?}
    ISSUPPLIER -->|Yes| SUPNAV2[supplierNavigation\n14 supplier routes]
    ISSUPPLIER -->|No| FILTER[allNavigation.filter\nhasPermission module view]

    FILTER --> ADMIN_NAV[Admin sees ALL\n20+ nav items]
    FILTER --> MANAGER_NAV[Manager sees\nAll except Users + Admin modules]
    FILTER --> SMANAGER_NAV[Sales Manager sees\nDashboard + Analytics + Orders\n+ Products + Customers + Suppliers + Categories]
    FILTER --> SREP_NAV[Sales Rep sees\nSales Rep Dashboard + Orders + Customers only]
    FILTER --> VIEWER_NAV[Viewer sees\nAll pages read-only]
```

---

## 8. Data Flow (Current — Mock Only)

```mermaid
flowchart LR
    DATA[data.ts\nMock Arrays] --> CONTEXTS[React Contexts\nAuthContext\nCheckInContext\nProductContext\nDashboardContext\nSupplierContext]
    CONTEXTS --> PAGES[Page Components\nuseAuth\nuseCheckIn\nuseDashboard]
    PAGES --> UI[UI Render]
    UI -->|User action| LOCALSTATE[Local useState\nin component]
    LOCALSTATE --> UI

    AUTH[localStorage\nauth_user] <-->|persist| CONTEXTS

    note1[NO backend\nNO database\nData lost on hard refresh\nexcept auth token]
```

---

## 9. Complete Route Map

```mermaid
flowchart TD
    ROOT([App Root]) --> PUBLIC[Public Routes]
    ROOT --> PROTECTED[Protected Routes\nwrapped in Layout + Auth]

    PUBLIC --> PL[/#/login]
    PUBLIC --> PSL[/#/supplier/login]
    PUBLIC --> PSO[/#/supplier/onboarding]

    PROTECTED --> MAIN[Main]
    PROTECTED --> ANALYTICS2[Analytics]
    PROTECTED --> SALES[Sales]
    PROTECTED --> CATALOG[Catalog]
    PROTECTED --> CRM[CRM]
    PROTECTED --> COMMERCE[Commerce]
    PROTECTED --> ADMINGRP[Admin]
    PROTECTED --> SUPPLIERGRP[Supplier Portal]

    MAIN --> R1[/#/\nMain Dashboard]
    MAIN --> R2[/#/sales-rep-dashboard\nSales Rep Dashboard]

    ANALYTICS2 --> R3[/#/analytics]
    ANALYTICS2 --> R4[/#/rep-performance]

    SALES --> R5[/#/orders]
    SALES --> R6[/#/active-carts]
    SALES --> R7[/#/check-in]
    SALES --> R8[/#/commission]
    SALES --> R9[/#/stock-reversal-ledger]

    CATALOG --> R10[/#/products]
    CATALOG --> R11[/#/inventory]
    CATALOG --> R12[/#/suppliers]
    CATALOG --> R13[/#/categories]

    CRM --> R14[/#/customers]
    CRM --> R15[/#/customers/:id]
    CRM --> R16[/#/customers/:id/edit]

    COMMERCE --> R17[/#/coupons]
    COMMERCE --> R18[/#/pricing]
    COMMERCE --> R19[/#/marketing]
    COMMERCE --> R20[/#/loyalty]

    ADMINGRP --> R21[/#/users]
    ADMINGRP --> R22[/#/roles]
    ADMINGRP --> R23[/#/admin]

    SUPPLIERGRP --> RS1[/#/supplier/dashboard]
    SUPPLIERGRP --> RS2[/#/supplier/products]
    SUPPLIERGRP --> RS3[/#/supplier/products/:id]
    SUPPLIERGRP --> RS4[/#/supplier/inbound]
    SUPPLIERGRP --> RS5[/#/supplier/inventory]
    SUPPLIERGRP --> RS6[/#/supplier/orders]
    SUPPLIERGRP --> RS7[/#/supplier/orders/:id]
    SUPPLIERGRP --> RS8[/#/supplier/finance]
    SUPPLIERGRP --> RS9[/#/supplier/performance]
    SUPPLIERGRP --> RS10[/#/supplier/analytics]
    SUPPLIERGRP --> RS11[/#/supplier/market-insights]
    SUPPLIERGRP --> RS12[/#/supplier/pricing]
    SUPPLIERGRP --> RS13[/#/supplier/promotions]
    SUPPLIERGRP --> RS14[/#/supplier/reports]
    SUPPLIERGRP --> RS15[/#/supplier/account-manager]
    SUPPLIERGRP --> RS16[/#/supplier/settings]
```
