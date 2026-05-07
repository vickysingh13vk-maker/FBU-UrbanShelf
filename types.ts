import React from 'react';

export interface StatCardProps {
  title: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  icon: React.ReactNode;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode?: string;
  category: string;
  flavour?: string;
  supplier?: string;
  price: number; // Wholesale Price
  mrp?: number;
  stock: number;
  reservedStock?: number;
  damagedStock?: number;
  status: 'Active' | 'Draft' | 'Low Stock';
  image: string;
  unitsPerCarton?: number;
  cbmPerCarton?: number;
  units_per_carton?: number;
  cbm_per_carton?: number;
  weight?: string;
  warehouseLocation?: string; // e.g., "Rack A-12"
  batchNumber?: string;
  expiryDate?: string;
  dimensions?: string;
  reorderLevel?: number;
  nicotineStrength?: string;
  createdDate?: string;
  unitsSold?: number;
  revenue?: number;
  trend?: 'up' | 'down';
  flavours?: { name: string; stock: number; health: 'green' | 'amber' | 'red' }[];
  description?: string;
}

export interface Order {
  id: string;
  customer: string;
  customerId?: string;
  date: string;
  total: number;
  items: number;
  status: 'Pending' | 'Approved' | 'Picking' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentStatus: 'Paid' | 'Unpaid' | 'Pending' | 'Refunded';
  repId?: string;
  collectionAmount?: number;
}

export interface StockReversal {
  id: string;
  date: string;
  orderId: string;
  customer: string;
  product: string;
  flavour: string;
  originalQuantity: number;
  reversalQuantity: number;
  reversalType: 'Add Stock Back' | 'Remove Extra Stock';
  reason: 'Customer Return' | 'Dispatch Error' | 'Warehouse Adjustment' | 'Damaged Stock' | 'Other';
  adminUser: string;
  notes?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  mobile?: string;
  companyName: string;
  storeName: string;
  regNo: string;
  address: string;
  status: 'Approved' | 'Pending' | 'Blocked';
  walletBalance: number;
  creditLimit: number;
  joinedDate: string;
  image?: string;
  category?: string;
  supplier?: string;
  lat?: number;
  lng?: number;
  // CRM ownership
  assignedRepId?: string;
  assignedRepName?: string;
  createdByRepId?: string;
  ownershipStatus?: CustomerOwnershipStatus;
  lifecycleStage?: CustomerLifecycleStage;
  lastContactDate?: string;
  nextFollowUp?: string;
}

export interface Cart {
  id: string;
  userEmail: string;
  userName: string;
  totalItems: number;
  totalQty: number;
  items: string[];
  lastUpdated: string;
  created: string;
}

export interface Supplier {
  id: string;
  name: string;
  logo: string;
  products: number;
  status: 'Active' | 'Inactive';
  gstNumber?: string;
  contactInfo?: {
    email: string;
    phone: string;
    address: string;
  };
  bankDetails?: {
    accountName: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  };
  isVerified?: boolean;
}

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  capacity: number;
  manager: string;
  status: 'Active' | 'Inactive';
}

export interface Category {
  id: string;
  name: string;
  description: string;
  products: number;
  status: 'Active' | 'Hidden';
}

export interface Permission {
  module: string;
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // For mock auth
  roleId: string;
  roleName?: string; // Helper for UI
  status: 'Active' | 'Inactive' | 'Suspended';
  createdDate: string;
  image?: string;
  onboardingCompleted?: boolean;
  supplierId?: string;
}

export interface SupplierOnboardingData {
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string;
  vatNumber: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  businessType: 'Manufacturer' | 'Distributor' | 'Brand Owner';
}

export type CommissionStatus = 'Pending' | 'Matured' | 'Released' | 'Paid';

export interface CommissionEntry {
  id: string;
  date: string;
  orderId: string;
  customerName: string;
  saleAmount: number;
  commissionPercentage: number;
  commissionAmount: number;
  paymentReceived: number;
  paymentReceivedDate?: string;
  maturedDate?: string;
  releaseDate?: string;
  status: CommissionStatus;
  commissionPaid: number;
  balance: number;
}

export interface SalesRep {
  id: string;
  name: string;
  photo: string;
  mobile: string;
  email: string;
  territory: string;
  status: 'Active' | 'Inactive';
  joinedDate: string;
  specialization: string;
  bio: string;
  metrics: {
    customers: number;
    sales: string;
  };
  commissionLedger: CommissionEntry[];
}

export interface Coupon {
  id: string;
  code: string;
  type: 'Fixed Amount' | 'Percentage';
  value: number;
  minOrder: number;
  maxDiscount: number;
  usageLimit: number;
  usedCount: number;
  validFrom: string;
  validUntil: string;
  status: 'Active' | 'Expired' | 'Upcoming';
  categories: string[];
}

export interface PricingTierItem {
  name: string;
  minQty: number;
  maxQty: number | null; // null represents "+" (infinity)
  discount: number;
}

export interface PricingStrategy {
  id: string;
  name: string;
  description: string;
  type: 'Global' | 'Category' | 'Product';
  status: 'Active' | 'Inactive';
  isDefault: boolean;
  tiers: PricingTierItem[];
}

export interface Campaign {
  id: string;
  title: string;
  subject: string;
  status: 'DRAFT' | 'SENT' | 'FAILED' | 'SENDING';
  audience: string;
  recipients: number;
  delivered: number;
  failed: number;
  date: string;
  sentAt?: string;
  content?: string;
  attachments?: string[]; // Array of filenames
}

export type TableColumn<T> = {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
};

// --- Supplier Module Types ---

export interface SupplierOrder {
  id: string;
  buyer: string;
  product: string;
  quantity: number;
  amount: number;
  status: string;
  date: string;
  commission: number;
  netEarnings: number;
  customerType: 'NEW' | 'REPEAT';
}

export interface SupplierInventoryItem {
  id: string;
  product: string;
  sku: string;
  warehouse: string;
  available: number;
  reserved: number;
  damaged: number;
  reorderLevel: number;
  dailySales: number;
  incoming?: number;
  flavours: Array<{ name: string; stock: number; health: 'green' | 'amber' | 'red' }>;
}

export interface EnrichedInventoryItem extends SupplierInventoryItem {
  category: string;
  image: string;
  unitPrice: number;
  inventoryValue: number;
  sellThroughRate: string;
  daysOfInventoryLeft: number;
  estimatedStockOutDate: string;
  recommendedProductionQty: number;
}

export interface SupplierShipment {
  id: string;
  warehouse: string;
  productsCount: number;
  totalUnits: number;
  eta: string;
  status: string;
  createdDate: string;
  carrier?: string;
  trackingNumber?: string;
  productIds?: string[];
  quantities?: Record<string, number>;
  totalCbm?: number;
  monthlyStorageEstimate?: number;
  receivedUnits?: number;
  receivedDate?: string;
}

export interface SupplierFinanceData {
  kpis: {
    totalRevenue: number;
    netEarnings: number;
    pendingPayout: number;
    totalCommissionPaid: number;
    lastPayoutAmount: number;
    nextPayoutDate: string;
    storageFees: number;
  };
  trends: Array<{
    date: string;
    revenue: number;
    commission: number;
    payout: number;
  }>;
  transactions: SupplierTransaction[];
}

export interface SupplierTransaction {
  id: string;
  orderId: string;
  product: string;
  sku: string;
  revenue: number;
  commission: number;
  netAmount: number;
  status: 'Pending' | 'Processing' | 'Paid' | 'Failed';
  date: string;
  method: string;
  invoiceType: 'Sales' | 'Service Fee' | 'Storage';
}

export interface SupplierAnalyticsData {
  salesBySku: Array<{
    sku: string;
    product: string;
    unitsSold: number;
    revenue: number;
    growth: number;
    avgOrderSize: number;
    conversionRate: number;
    salesVelocity: number;
  }>;
  salesByRegion: Array<{
    region: string;
    unitsSold: number;
    revenue: number;
    growthRate: number;
    orders: number;
  }>;
  salesByTime: Array<{
    month: string;
    unitsSold: number;
    revenue: number;
    orders: number;
  }>;
  insights: {
    winningSKUs: Array<{ sku: string; product: string; growth: number }>;
    decliningSKUs: Array<{ sku: string; product: string; decline: number }>;
  };
}

export interface MarketRegion {
  id: string;
  name: string;
  lat: number;
  lng: number;
  unitsSold: number;
  revenue: number;
  growthRate: number;
  retailers: number;
}

export interface SupplierMarketInsightsData {
  regions: MarketRegion[];
  kpis: {
    totalRegions: number;
    highestGrowthRegion: string;
    totalMarketRevenue: number;
    avgRegionalRevenue: number;
  };
}

export interface Promotion {
  id: string;
  campaignName: string;
  sku: string;
  product: string;
  unitsSold: number;
  revenue: number;
  discountPercent: number;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Ended' | 'Scheduled';
  roi: number;
  totalDiscountGiven: number;
}

export interface ReportTemplate {
  id: string;
  name: string;
  type: 'Sales' | 'Inventory' | 'Forecast';
  description: string;
  formats: string[];
  lastGenerated: string | null;
  frequency: string;
}

export interface ReportHistoryItem {
  id: string;
  reportName: string;
  type: 'Sales' | 'Inventory' | 'Forecast';
  generatedDate: string;
  format: string;
  fileSize: string;
  status: 'Completed' | 'Processing' | 'Failed';
}

export interface SupplierReportsData {
  templates: ReportTemplate[];
  history: ReportHistoryItem[];
}

// ─── PHASE 2: SALES REP CRM ──────────────────────────────────────────────────

export type WorkSessionStatus = 'active' | 'ended';

export interface SessionSummary {
  duration: number;
  visits: number;
  orders: number;
  collections: number;
  revenue: number;
  leadsAdded: number;
  followUpsCompleted: number;
}

export interface WorkSession {
  id: string;
  repId: string;
  repName: string;
  date: string;
  startTime: string;
  endTime?: string;
  status: WorkSessionStatus;
  totalVisits: number;
  totalOrders: number;
  totalCollections: number;
  totalRevenue: number;
  summary?: SessionSummary;
}

export type LeadStage =
  | 'New Lead'
  | 'Contacted'
  | 'Interested'
  | 'Meeting Scheduled'
  | 'Trial Order'
  | 'Converted'
  | 'Lost';

export type LeadPriority = 'High' | 'Medium' | 'Low';

export type LeadActivityType =
  | 'Call'
  | 'Visit'
  | 'Follow-Up'
  | 'WhatsApp'
  | 'Note'
  | 'Stage Change';

export interface LeadActivity {
  id: string;
  leadId: string;
  type: LeadActivityType;
  repId: string;
  repName: string;
  timestamp: string;
  notes: string;
  outcome?: string;
  nextAction?: string;
  stageFrom?: LeadStage;
  stageTo?: LeadStage;
}

export interface Lead {
  id: string;
  repId: string;
  repName: string;
  businessName: string;
  contactName: string;
  phone: string;
  email?: string;
  address?: string;
  category?: string;
  stage: LeadStage;
  priority: LeadPriority;
  createdDate: string;
  lastContactDate?: string;
  nextFollowUp?: string;
  notes: string;
  activities: LeadActivity[];
  convertedCustomerId?: string;
  lostReason?: string;
}

export type TimelineEventType =
  | 'Call'
  | 'Visit'
  | 'Follow-Up'
  | 'Order'
  | 'Payment'
  | 'WhatsApp'
  | 'Note';

export interface CustomerTimeline {
  id: string;
  customerId: string;
  type: TimelineEventType;
  repId: string;
  repName: string;
  timestamp: string;
  notes: string;
  outcome?: string;
  nextAction?: string;
  orderId?: string;
  amount?: number;
}

export type CustomerLifecycleStage =
  | 'Lead'
  | 'Prospect'
  | 'Qualified'
  | 'Active'
  | 'At Risk'
  | 'Inactive'
  | 'Lost'
  | 'Archived';

export type CustomerOwnershipStatus = 'assigned' | 'self-created' | 'converted';

// ─── Phase 3: Sales Execution Engine ────────────────────────────────────────

// Visit
export type VisitStatus = 'planned' | 'active' | 'completed' | 'cancelled';
export type VisitObjectiveType = 'Order' | 'Collection' | 'Product Demo' | 'Relationship' | 'Sampling' | 'Merchandising';

export interface VisitObjective {
  id: string;
  type: VisitObjectiveType;
  description: string;
  completed: boolean;
}

export interface VisitOutcome {
  orderId?: string;
  orderAmount?: number;
  collectionAmount?: number;
  productsDiscussed: string[];
  notes: string;
  customerSatisfaction?: 1 | 2 | 3 | 4 | 5;
}

export interface Visit {
  id: string;
  customerId: string;
  customerName: string;
  repId: string;
  repName: string;
  status: VisitStatus;
  date: string;
  startTime: string;
  endTime?: string;
  durationMinutes?: number;
  gpsLat?: number;
  gpsLng?: number;
  objectives: VisitObjective[];
  outcome?: VisitOutcome;
  notes: string;
  followUpId?: string;
  sessionId?: string;
}

// Follow-Up
export type FollowUpType =
  | 'Callback'
  | 'Payment Reminder'
  | 'Revisit'
  | 'Product Demo'
  | 'Negotiation'
  | 'Trial Follow-Up'
  | 'Collection Follow-Up';

export type FollowUpStatus = 'Pending' | 'Completed' | 'Overdue' | 'Cancelled';
export type FollowUpPriority = 'High' | 'Medium' | 'Low';

export interface FollowUp {
  id: string;
  type: FollowUpType;
  repId: string;
  customerId?: string;
  customerName?: string;
  leadId?: string;
  leadName?: string;
  dueDate: string;
  status: FollowUpStatus;
  priority: FollowUpPriority;
  notes: string;
  outcome?: string;
  linkedVisitId?: string;
  recurring?: boolean;
  recurringIntervalDays?: number;
  completedAt?: string;
}

// Task
export type TaskType =
  | 'Visit'
  | 'Collection'
  | 'Lead Follow-Up'
  | 'Product Push'
  | 'Merchandising'
  | 'Admin';

export type TaskStatus = 'Pending' | 'In Progress' | 'Completed' | 'Overdue';
export type TaskPriority = 'High' | 'Medium' | 'Low';

export interface Task {
  id: string;
  type: TaskType;
  title: string;
  description?: string;
  customerId?: string;
  customerName?: string;
  repId: string;
  priority: TaskPriority;
  dueDate: string;
  status: TaskStatus;
  completedAt?: string;
  linkedFollowUpId?: string;
  linkedVisitId?: string;
}

// Collection
export type CollectionStatus = 'Pending' | 'Partially Paid' | 'Paid' | 'Disputed' | 'Overdue';

export interface CollectionAttempt {
  id: string;
  customerId: string;
  customerName: string;
  repId: string;
  attemptDate: string;
  amountRequested: number;
  amountCollected: number;
  status: CollectionStatus;
  notes: string;
  promisedDate?: string;
  visitId?: string;
}

// Route Planning
export interface RoutePlanStop {
  customerId: string;
  customerName: string;
  address: string;
  priority: 'High' | 'Medium' | 'Low';
  estimatedVisitMinutes: number;
  suggestedOrder: number;
  hasOverdueCollection: boolean;
  hasOverdueFollowUp: boolean;
  lastVisitDaysAgo?: number;
  status: 'Pending' | 'Visited' | 'Skipped';
}

export interface RoutePlan {
  id: string;
  repId: string;
  date: string;
  stops: RoutePlanStop[];
  estimatedTotalMinutes?: number;
}

// Productivity
export interface ProductivityMetrics {
  repId: string;
  date: string;
  visitsCompleted: number;
  visitsPlanned: number;
  avgVisitDurationMinutes: number;
  ordersPerVisit: number;
  collectionsRecovered: number;
  followUpCompletionRate: number;
  leadConversionRate: number;
  productiveHours: number;
}
