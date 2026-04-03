import {
  CheckCircle,
  CheckCircle2,
  Clock,
  AlertCircle,
  AlertTriangle,
  XCircle,
  Truck,
  Warehouse,
  Activity,
  ShieldCheck,
  Package,
  Lock,
  X,
  Info,
} from 'lucide-react';

type BadgeVariant = 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';

export interface StatusConfig {
  label: string;
  variant: BadgeVariant;
  icon?: any;
}

// ---------------------------------------------------------------------------
// Order statuses (from SupplierOrders.tsx)
// ---------------------------------------------------------------------------
export const ORDER_STATUS_CONFIG: Record<string, StatusConfig> = {
  CREATED: { label: 'Created', variant: 'neutral' },
  CONFIRMED: { label: 'Confirmed', variant: 'info' },
  PICKING: { label: 'Picking', variant: 'warning' },
  PACKED: { label: 'Packed', variant: 'primary' },
  SHIPPED: { label: 'Shipped', variant: 'primary' },
  IN_TRANSIT: { label: 'In Transit', variant: 'info' },
  DELIVERED: { label: 'Delivered', variant: 'success' },
  CLOSED: { label: 'Closed', variant: 'neutral' },
};

// ---------------------------------------------------------------------------
// Shipment / inbound statuses (from SupplierInbound.tsx)
// ---------------------------------------------------------------------------
export const SHIPMENT_STATUS_CONFIG: Record<string, StatusConfig> = {
  DRAFT: { label: 'Draft', variant: 'neutral', icon: Clock },
  IN_TRANSIT: { label: 'In Transit', variant: 'primary', icon: Truck },
  ARRIVED: { label: 'Arrived', variant: 'info', icon: Warehouse },
  RECEIVING: { label: 'Receiving', variant: 'warning', icon: Activity },
  RECEIVED: { label: 'Received', variant: 'success', icon: CheckCircle },
  PARTIALLY_RECEIVED: { label: 'Partially Received', variant: 'warning', icon: AlertCircle },
  QC_DONE: { label: 'QC Done', variant: 'success', icon: ShieldCheck },
  PUTAWAY_DONE: { label: 'Putaway Done', variant: 'success', icon: Package },
  CLOSED: { label: 'Closed', variant: 'neutral', icon: Lock },
  CANCELLED: { label: 'Cancelled', variant: 'danger', icon: X },
};

// ---------------------------------------------------------------------------
// Promotion statuses
// ---------------------------------------------------------------------------
export const PROMOTION_STATUS_CONFIG: Record<string, StatusConfig> = {
  Active: { label: 'Active', variant: 'success' },
  Ended: { label: 'Ended', variant: 'neutral' },
  Scheduled: { label: 'Scheduled', variant: 'info' },
};

// ---------------------------------------------------------------------------
// Transaction statuses
// ---------------------------------------------------------------------------
export const TRANSACTION_STATUS_CONFIG: Record<string, StatusConfig> = {
  Paid: { label: 'Paid', variant: 'success', icon: CheckCircle2 },
  Processing: { label: 'Processing', variant: 'info', icon: Clock },
  Pending: { label: 'Pending', variant: 'warning', icon: AlertCircle },
  Failed: { label: 'Failed', variant: 'danger', icon: XCircle },
};

// ---------------------------------------------------------------------------
// Report statuses
// ---------------------------------------------------------------------------
export const REPORT_STATUS_CONFIG: Record<string, StatusConfig> = {
  Completed: { label: 'Completed', variant: 'success' },
  Processing: { label: 'Processing', variant: 'warning' },
  Failed: { label: 'Failed', variant: 'danger' },
};

// ---------------------------------------------------------------------------
// Inventory stock statuses
// ---------------------------------------------------------------------------
export const INVENTORY_STATUS_CONFIG: Record<string, StatusConfig> = {
  Healthy: { label: 'Healthy', variant: 'success', icon: CheckCircle2 },
  'Low Stock': { label: 'Low Stock', variant: 'warning', icon: AlertTriangle },
  'Out of Stock': { label: 'Out of Stock', variant: 'danger', icon: AlertCircle },
};

// ---------------------------------------------------------------------------
// Helper to derive stock status from an available-units count
// ---------------------------------------------------------------------------
export const getStockStatus = (available: number): StatusConfig => {
  if (available === 0) return INVENTORY_STATUS_CONFIG['Out of Stock'];
  if (available < 20) return INVENTORY_STATUS_CONFIG['Low Stock'];
  return INVENTORY_STATUS_CONFIG['Healthy'];
};
