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
  paymentStatus: 'Paid' | 'Unpaid' | 'Pending' | 'Refunded' | 'On Credit';
  paymentMethod?: 'Link' | 'Card';
  notes?: string;
  repId?: string;
  collectionAmount?: number;
  visitId?: string;
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

// ── Shipment Recording ────────────────────────────────────────────────────────
export type PaymentType = 'Paid' | 'Credit';
export type ShipmentStatus = 'Draft' | 'Confirmed' | 'Cancelled';
export type LedgerEntryType = 'CREDIT' | 'DEBIT';

export interface ShipmentItem {
  id: string;
  productId: string;
  productName: string;
  flavour?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface InboundShipment {
  id: string;
  supplierId: string;
  supplierName: string;
  date: string;
  paymentType: PaymentType;
  status: ShipmentStatus;
  hasLinkedCustomer: boolean;
  customerId?: string;
  customerName?: string;
  items: ShipmentItem[];
  totalAmount: number;
  notes?: string;
  createdAt: string;
  createdBy: string;
}

export interface LedgerEntry {
  id: string;
  shipmentId: string;
  date: string;
  type: LedgerEntryType;
  amount: number;
  description: string;
  supplierId: string;
  supplierName: string;
  customerId?: string;
  customerName?: string;
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
  | 'Meeting'
  | 'Order'
  | 'Payment'
  | 'WhatsApp'
  | 'Note'
  | 'Admin';

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

export type PaymentStatus = 'Paid' | 'Pending' | 'On Credit';
export type PaymentMethod = 'Link' | 'Card';

export interface VisitOutcome {
  orderId?: string;
  orderAmount?: number;
  collectionAmount?: number;
  productsDiscussed: string[];
  notes: string;
  paymentStatus?: PaymentStatus;
  paymentMethod?: PaymentMethod;
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

// ─── Phase 4: Sales Manager Intelligence ───────────────────────────────────

export type TerritoryLevel = 'Region' | 'Zone' | 'Area';

export interface Territory {
  id: string;
  name: string;
  level: TerritoryLevel;
  parentId?: string;
  assignedRepId?: string;
  assignedRepName?: string;
  customerCount: number;
  activeCustomers: number;
  monthlyRevenue: number;
}

export interface TerritoryPerformance {
  territoryId: string;
  territoryName: string;
  repId: string;
  repName: string;
  visitsThisMonth: number;
  ordersThisMonth: number;
  revenueThisMonth: number;
  collectionsThisMonth: number;
  activeLeads: number;
  overdueCollections: number;
}

export type RepActivityStatus =
  | 'Online – In Visit'
  | 'Online – Travelling'
  | 'Online – Idle'
  | 'Offline';

export interface RepStatus {
  repId: string;
  repName: string;
  repImage?: string;
  status: RepActivityStatus;
  sessionStart?: string;
  activeVisitCustomer?: string;
  activeVisitStart?: string;
  currentLat?: number;
  currentLng?: number;
  todayVisits: number;
  todayOrders: number;
  todayRevenue: number;
  todayCollections: number;
  routeProgress: { visited: number; total: number };
  lastActivityAt?: string;
}

export type PeriodType = 'daily' | 'weekly' | 'monthly';

export interface RepPerformanceMetrics {
  repId: string;
  repName: string;
  period: PeriodType;
  periodLabel: string;
  visitsCompleted: number;
  visitsTarget: number;
  ordersCreated: number;
  revenueGenerated: number;
  revenueTarget: number;
  collectionsRecovered: number;
  followUpCompletionRate: number;
  leadConversionRate: number;
  productiveHours: number;
  idleHours: number;
  avgVisitDuration: number;
  customersCovered: number;
}

export type CustomerHealthState = 'Healthy' | 'Warning' | 'High Risk' | 'Critical';

export interface CustomerHealth {
  customerId: string;
  customerName: string;
  assignedRepId: string;
  assignedRepName: string;
  healthState: CustomerHealthState;
  healthScore: number;
  lastVisitDaysAgo?: number;
  daysSinceLastOrder?: number;
  outstandingBalance: number;
  overdueAmount: number;
  openFollowUps: number;
  missedVisits: number;
  flags: string[];
}

export type AlertType =
  | 'rep-idle'
  | 'overdue-collection'
  | 'inactive-customer'
  | 'missed-visit'
  | 'overdue-follow-up'
  | 'low-productivity'
  | 'churn-risk'
  | 'unassigned-lead'
  | 'stalled-lead';

export type AlertSeverity = 'Info' | 'Warning' | 'Critical';

export interface OperationalAlert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  description: string;
  repId?: string;
  repName?: string;
  customerId?: string;
  customerName?: string;
  leadId?: string;
  createdAt: string;
  read: boolean;
  dismissed: boolean;
  actionUrl?: string;
}

export interface TeamAnalytics {
  date: string;
  totalReps: number;
  onlineReps: number;
  activeVisits: number;
  todayVisits: number;
  todayOrders: number;
  todayRevenue: number;
  todayCollections: number;
  pendingFollowUps: number;
  overdueTasks: number;
  idleReps: number;
  highRiskCustomers: number;
}

export interface LeadAnalytics {
  repId: string;
  repName: string;
  totalLeads: number;
  activeLeads: number;
  stalledLeads: number;
  convertedThisMonth: number;
  lostThisMonth: number;
  conversionRate: number;
  avgDaysToConvert: number;
  pipelineValue: number;
}

// ─── Phase 5: Advanced CRM Operations ──────────────────────────────────────

export type NotificationPriority = 'Info' | 'Warning' | 'Critical';
export type NotificationType =
  | 'follow-up-reminder' | 'overdue-payment' | 'missed-visit'
  | 'inactive-customer' | 'task-overdue' | 'collection-due'
  | 'lead-stale' | 'approval-required';
export type NotificationRole = 'Sales Rep' | 'Sales Manager' | 'Admin' | 'any';

export interface CRMNotification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  body: string;
  read: boolean;
  dismissed: boolean;
  createdAt: string;
  linkedEntityType?: 'customer' | 'lead' | 'order' | 'collection' | 'follow-up' | 'task' | 'approval' | 'escalation';
  linkedEntityId?: string;
  linkedEntityName?: string;
  visibleToRoles: NotificationRole[];
  repId?: string;
}

export type AutomationTrigger =
  | 'no-visit-30d' | 'overdue-payment' | 'inactive-lead-21d'
  | 'missed-follow-up' | 'customer-inactive-45d' | 'collection-overdue'
  | 'lead-stale-14d';
export type AutomationActionType =
  | 'create-follow-up' | 'create-task' | 'create-notification'
  | 'mark-lead-stale' | 'create-escalation' | 'alert-manager';
export type AutomationStatus = 'Active' | 'Paused' | 'Disabled';

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: AutomationTrigger;
  triggerCondition: Record<string, unknown>;
  actions: AutomationActionType[];
  actionConfig: Record<string, unknown>;
  status: AutomationStatus;
  appliesTo: NotificationRole[];
  lastRunAt?: string;
  totalFired: number;
  createdAt: string;
}

export type EscalationType =
  | 'payment-dispute' | 'customer-complaint' | 'pricing-request'
  | 'urgent-stock' | 'overdue-collection' | 'churn-risk' | 'missed-sla';
export type EscalationStatus = 'Created' | 'Assigned' | 'Reviewed' | 'Resolved' | 'Closed';
export type EscalationPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface EscalationEvent {
  status: EscalationStatus;
  note: string;
  by: string;
  at: string;
}

export interface Escalation {
  id: string;
  type: EscalationType;
  status: EscalationStatus;
  priority: EscalationPriority;
  title: string;
  description: string;
  createdBy: string;
  createdByName: string;
  assignedTo?: string;
  assignedToName?: string;
  customerId?: string;
  customerName?: string;
  repId?: string;
  repName?: string;
  timeline: EscalationEvent[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  slaDeadline?: string;
}

export type ApprovalType =
  | 'discount' | 'credit-increase' | 'order-override'
  | 'customer-activation' | 'payment-adjustment' | 'write-off';
export type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected' | 'Escalated';

export interface ApprovalRequest {
  id: string;
  type: ApprovalType;
  status: ApprovalStatus;
  title: string;
  description: string;
  requestedBy: string;
  requestedByName: string;
  requestedAt: string;
  reviewedBy?: string;
  reviewedByName?: string;
  reviewedAt?: string;
  reviewNote?: string;
  customerId?: string;
  customerName?: string;
  orderId?: string;
  amount?: number;
  currentValue?: number;
  requestedValue?: number;
}

export type AuditAction =
  | 'customer.update' | 'lead.stage-change' | 'lead.assign'
  | 'payment.record' | 'approval.create' | 'approval.review'
  | 'collection.update' | 'escalation.create' | 'escalation.update'
  | 'customer.lifecycle-change' | 'document.upload';

export interface AuditLog {
  id: string;
  action: AuditAction;
  performedBy: string;
  performedByName: string;
  entityType: string;
  entityId: string;
  entityName: string;
  oldValue?: Record<string, unknown>;
  newValue?: Record<string, unknown>;
  note?: string;
  lat?: number;
  lng?: number;
  timestamp: string;
}

export type DocumentType =
  | 'invoice' | 'receipt' | 'agreement' | 'license'
  | 'payment-proof' | 'visit-photo' | 'customer-document' | 'other';

export interface CustomerDocument {
  id: string;
  type: DocumentType;
  name: string;
  description?: string;
  fileUrl: string;
  fileSize: string;
  mimeType: string;
  uploadedBy: string;
  uploadedByName: string;
  uploadedAt: string;
  linkedEntityType: 'customer' | 'lead' | 'order' | 'escalation' | 'approval';
  linkedEntityId: string;
  linkedEntityName: string;
  tags: string[];
}

export type RecommendationType =
  | 'overdue-visit' | 'high-risk-account' | 'inactive-lead'
  | 'collection-priority' | 'high-performing-rep' | 'low-engagement';
export type RecommendationSeverity = 'Info' | 'Warning' | 'Action Required';

export interface CRMRecommendation {
  id: string;
  type: RecommendationType;
  severity: RecommendationSeverity;
  title: string;
  description: string;
  actionLabel: string;
  actionHref?: string;
  entityType?: string;
  entityId?: string;
  entityName?: string;
  repId?: string;
  generatedAt: string;
  dismissed: boolean;
}

export interface Customer360Timeline {
  id: string;
  type: 'visit' | 'order' | 'payment' | 'follow-up' | 'note' | 'escalation' | 'approval' | 'document';
  title: string;
  description: string;
  by: string;
  at: string;
  linkedId?: string;
}

export interface Customer360 {
  customerId: string;
  timeline: Customer360Timeline[];
  openEscalations: number;
  pendingApprovals: number;
  documentCount: number;
  lastAuditAt?: string;
}
