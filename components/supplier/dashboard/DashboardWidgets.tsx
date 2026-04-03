import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingCart,
  Wallet,
  Truck,
  Warehouse,
  Package,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Zap,
  Plus,
  Sparkles,
  Download,
  ShieldAlert,
  Target,
  TrendingUp,
  TrendingDown,
  Receipt,
  History,
} from 'lucide-react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';

// --- OrdersOverviewWidget ---

export interface OrdersOverviewData {
  today: string;
  pending: number;
  processing: number;
  shipped: number;
  cancelled: number;
}

export interface OrdersOverviewWidgetProps {
  data: OrdersOverviewData;
}

export const OrdersOverviewWidget: React.FC<OrdersOverviewWidgetProps> = ({ data }) => (
  <Card padding="none" className="p-5 hover:shadow-xl transition-all duration-300 border-slate-100 bg-white">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
        <ShoppingCart className="h-4 w-4 text-indigo-500" />
        Orders Overview
      </h3>
      <Link to="/supplier/orders" className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors uppercase tracking-wider">View All</Link>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
      {[
        { label: 'Orders Today', value: data.today, color: 'text-slate-900' },
        { label: 'Pending', value: data.pending, color: 'text-amber-600' },
        { label: 'Processing', value: data.processing, color: 'text-blue-600' },
        { label: 'Shipped', value: data.shipped, color: 'text-emerald-600' },
        { label: 'Cancelled', value: data.cancelled, color: 'text-rose-600' },
      ].map((item) => (
        <div key={item.label} className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100 flex flex-col items-center justify-center text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
          <p className={`text-xl font-bold ${item.color}`}>{item.value}</p>
        </div>
      ))}
    </div>
  </Card>
);

// --- EarningsPayoutsWidget ---

export interface EarningsPayoutsData {
  netEarnings: string;
  pendingPayout: string;
  lastPayout: string;
  nextPayoutDate: string;
  commissionDeducted: string;
}

export interface EarningsPayoutsWidgetProps {
  data: EarningsPayoutsData;
}

export const EarningsPayoutsWidget: React.FC<EarningsPayoutsWidgetProps> = ({ data }) => (
  <Card padding="none" className="p-5 hover:shadow-xl transition-all duration-300 border-slate-100 bg-white h-full">
    <div className="flex items-center gap-2 mb-4">
      <Wallet className="h-4 w-4 text-emerald-500" />
      <h3 className="text-sm font-bold text-slate-900 tracking-tight">Earnings & Payouts</h3>
    </div>
    <div className="space-y-4">
      <div className="flex justify-between items-center p-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
        <span className="text-xs font-bold text-slate-600">Net Earnings</span>
        <span className="text-lg font-bold text-emerald-700">{data.netEarnings}</span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Pending Payout</p>
          <p className="text-sm font-bold text-slate-900">{data.pendingPayout}</p>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Last Payout</p>
          <p className="text-sm font-bold text-slate-900">{data.lastPayout}</p>
        </div>
      </div>
      <div className="flex justify-between items-center text-xs">
        <span className="text-slate-500 font-medium">Next Payout Date</span>
        <span className="font-bold text-slate-900">{data.nextPayoutDate}</span>
      </div>
      <div className="flex justify-between items-center text-xs">
        <span className="text-slate-500 font-medium">Commission Deducted</span>
        <span className="font-bold text-rose-600">{data.commissionDeducted}</span>
      </div>
    </div>
  </Card>
);

// --- FulfillmentStatusWidget ---

export interface FulfillmentStatusData {
  sentToWarehouse: number;
  packed: number;
  inTransit: number;
  delivered: number;
  successRate: string;
}

export interface FulfillmentStatusWidgetProps {
  data: FulfillmentStatusData;
}

export const FulfillmentStatusWidget: React.FC<FulfillmentStatusWidgetProps> = ({ data }) => (
  <Card padding="none" className="p-5 hover:shadow-xl transition-all duration-300 border-slate-100 bg-white h-full">
    <div className="flex items-center gap-2 mb-4">
      <Truck className="h-4 w-4 text-blue-500" />
      <h3 className="text-sm font-bold text-slate-900 tracking-tight">Fulfillment Status</h3>
    </div>
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Success Rate</span>
        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">{data.successRate}</span>
      </div>
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-emerald-500" style={{ width: data.successRate }}></div>
      </div>
      <div className="grid grid-cols-2 gap-y-4 gap-x-6">
        {[
          { label: 'Sent to WH', value: data.sentToWarehouse, icon: Warehouse },
          { label: 'Packed', value: data.packed, icon: Package },
          { label: 'In Transit', value: data.inTransit, icon: Truck },
          { label: 'Delivered', value: data.delivered, icon: CheckCircle2 },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-50 text-slate-400">
              <item.icon className="h-3.5 w-3.5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{item.label}</p>
              <p className="text-sm font-bold text-slate-900">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </Card>
);

// --- OperationalAlertsWidget ---

export interface OperationalAlert {
  type: 'critical' | 'warning' | 'safe';
  message: string;
}

export interface OperationalAlertsWidgetProps {
  alerts: OperationalAlert[];
}

export const OperationalAlertsWidget: React.FC<OperationalAlertsWidgetProps> = ({ alerts }) => (
  <Card padding="none" className="p-5 hover:shadow-xl transition-all duration-300 border-slate-100 bg-white h-full">
    <div className="flex items-center gap-2 mb-4">
      <AlertTriangle className="h-4 w-4 text-amber-500" />
      <h3 className="text-sm font-bold text-slate-900 tracking-tight">Operational Alerts</h3>
    </div>
    <div className="space-y-3">
      {alerts.map((alert, i) => (
        <div key={i} className={`flex items-center justify-between p-3 rounded-xl border ${
          alert.type === 'critical' ? 'bg-rose-50 border-rose-100' :
          alert.type === 'warning' ? 'bg-amber-50 border-amber-100' : 'bg-emerald-50 border-emerald-100'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${
              alert.type === 'critical' ? 'bg-rose-500 animate-pulse' :
              alert.type === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'
            }`} />
            <p className="text-xs font-bold text-slate-900">{alert.message}</p>
          </div>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
        </div>
      ))}
    </div>
  </Card>
);

// --- QuickActionsWidget ---

export const QuickActionsWidget: React.FC = () => (
  <Card padding="none" className="p-5 hover:shadow-xl transition-all duration-300 border-slate-100 bg-white h-full">
    <div className="flex items-center gap-2 mb-4">
      <Zap className="h-4 w-4 text-indigo-500" />
      <h3 className="text-sm font-bold text-slate-900 tracking-tight">Quick Actions</h3>
    </div>
    <div className="grid grid-cols-2 gap-3">
      {[
        { label: 'Add Product', icon: Plus, link: '/supplier/products' },
        { label: 'Update Stock', icon: Warehouse, link: '/supplier/inventory' },
        { label: 'Promotion', icon: Sparkles, link: '/supplier/promotions' },
        { label: 'View Orders', icon: ShoppingCart, link: '/supplier/orders' },
        { label: 'Sales Report', icon: Download, link: '#' },
      ].map((action) => (
        <Link
          key={action.label}
          to={action.link}
          className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-indigo-50 hover:border-indigo-100 hover:text-indigo-600 transition-all group"
        >
          <action.icon className="h-5 w-5 mb-2 text-slate-400 group-hover:text-indigo-500 transition-colors" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-center">{action.label}</span>
        </Link>
      ))}
    </div>
  </Card>
);

// --- InventoryRiskForecastWidget ---

export interface InventoryRiskForecastData {
  daysRemaining: number;
  stockoutSKUs: number;
  overstockedSKUs: number;
}

export interface InventoryRiskForecastWidgetProps {
  data: InventoryRiskForecastData;
}

export const InventoryRiskForecastWidget: React.FC<InventoryRiskForecastWidgetProps> = ({ data }) => (
  <Card padding="none" className="p-5 hover:shadow-xl transition-all duration-300 border-slate-100 bg-white h-full">
    <div className="flex items-center gap-2 mb-4">
      <ShieldAlert className="h-4 w-4 text-rose-500" />
      <h3 className="text-sm font-bold text-slate-900 tracking-tight">Inventory Risk Forecast</h3>
    </div>
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold text-rose-600 uppercase tracking-widest mb-1">Avg. Coverage</p>
          <p className="text-2xl font-bold text-rose-700">{data.daysRemaining} <span className="text-xs font-medium">Days</span></p>
        </div>
        <div className="h-12 w-12 rounded-full border-4 border-rose-200 border-t-rose-500 flex items-center justify-center">
          <span className="text-[10px] font-bold text-rose-700">LOW</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Stockout Risk</p>
          <p className="text-sm font-bold text-rose-600">{data.stockoutSKUs} SKUs</p>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Overstocked</p>
          <p className="text-sm font-bold text-amber-600">{data.overstockedSKUs} SKUs</p>
        </div>
      </div>
      <Button variant="outline" className="w-full text-[10px] font-bold uppercase tracking-widest py-2 border-slate-200 hover:bg-slate-50">
        View Restock Suggestions
      </Button>
    </div>
  </Card>
);

// --- ProductPerformanceInsightsWidget ---

export interface ProductPerformanceData {
  best: string;
  fastest: string;
  lowest: string;
  returns: string;
}

export interface ProductPerformanceInsightsWidgetProps {
  data: ProductPerformanceData;
}

export const ProductPerformanceInsightsWidget: React.FC<ProductPerformanceInsightsWidgetProps> = ({ data }) => (
  <Card padding="none" className="p-5 hover:shadow-xl transition-all duration-300 border-slate-100 bg-white h-full">
    <div className="flex items-center gap-2 mb-4">
      <Target className="h-4 w-4 text-indigo-500" />
      <h3 className="text-sm font-bold text-slate-900 tracking-tight">Product Performance</h3>
    </div>
    <div className="space-y-4">
      {[
        { label: 'Best Performing', value: data.best, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Fastest Growing', value: data.fastest, icon: Zap, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Lowest Performing', value: data.lowest, icon: TrendingDown, color: 'text-rose-600', bg: 'bg-rose-50' },
        { label: 'Highest Returns', value: data.returns, icon: History, color: 'text-amber-600', bg: 'bg-amber-50' },
      ].map((item) => (
        <div key={item.label} className="flex items-center justify-between group/item">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${item.bg} ${item.color}`}>
              <item.icon className="h-3.5 w-3.5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{item.label}</p>
              <p className="text-xs font-bold text-slate-900 truncate max-w-[150px]">{item.value}</p>
            </div>
          </div>
          <ChevronRight className="h-3.5 w-3.5 text-slate-300 group-hover/item:text-indigo-500 transition-colors" />
        </div>
      ))}
    </div>
  </Card>
);

// --- CommissionBreakdownWidget ---

export interface CommissionBreakdownData {
  grossRevenue: string;
  commission: string;
  netPayable: string;
  percentage: string;
}

export interface CommissionBreakdownWidgetProps {
  data: CommissionBreakdownData;
}

export const CommissionBreakdownWidget: React.FC<CommissionBreakdownWidgetProps> = ({ data }) => (
  <Card padding="none" className="p-5 hover:shadow-xl transition-all duration-300 border-slate-100 bg-white h-full">
    <div className="flex items-center gap-2 mb-4">
      <Receipt className="h-4 w-4 text-indigo-500" />
      <h3 className="text-sm font-bold text-slate-900 tracking-tight">Commission Breakdown</h3>
    </div>
    <div className="space-y-4">
      <div className="flex justify-between items-center text-xs">
        <span className="text-slate-500 font-medium">Gross Revenue</span>
        <span className="font-bold text-slate-900">{data.grossRevenue}</span>
      </div>
      <div className="flex justify-between items-center text-xs">
        <span className="text-slate-500 font-medium">Platform Commission ({data.percentage})</span>
        <span className="font-bold text-rose-600">-{data.commission}</span>
      </div>
      <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
        <span className="text-sm font-bold text-slate-900">Net Payable</span>
        <span className="text-lg font-bold text-indigo-600">{data.netPayable}</span>
      </div>
      <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100">
        <p className="text-[10px] font-medium text-indigo-700 leading-relaxed">
          Commission is calculated based on your current <span className="font-bold">Gold Tier</span> status (12%).
        </p>
      </div>
    </div>
  </Card>
);
