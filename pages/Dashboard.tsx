import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { SalesRep, CommissionEntry, CommissionStatus } from '../types';
import { 
  ShoppingCart, Users, Package, Download, Calendar,
  ArrowRight, BarChart3, LayoutGrid, Tag, Globe, FileText,
  TrendingUp, TrendingDown, Wallet, Warehouse, AlertCircle, AlertTriangle, Clock,
  PlusCircle, Printer, FileDown, Search, Bell, User as UserIcon,
  ChevronRight, ChevronLeft, MapPin, MoreHorizontal, Filter, Info, RefreshCw,
  Plus, Minus, RotateCcw, Activity, Phone, Mail, Lock, UserPlus, Upload, ShieldCheck, Check, X,
  CheckCircle2, Zap
} from 'lucide-react';
import { 
  Card, Button, Badge, Table, THead, TBody, TR, TH, TD, CardHeader,
  Modal, ViewModeToggle
} from '../components/ui';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, LineChart, Line, ComposedChart, Area,
  AreaChart
} from 'recharts';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
  Filler
} from 'chart.js';
import { Line as ChartLine } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  ChartLegend,
  Filler
);
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon issues
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

import { useDashboard } from '../context/DashboardContext';
import { useHistoricData } from '../hooks/useHistoricData';
import { parseFormattedValue, formatValue } from '../utils/historicDataUtils';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import SupplierPanel from './supplier/SupplierDashboard';

// --- Mock Data imported from data/dashboardData.ts ---
import {
  ADMIN_KPIS, SALES_KPIS, FINANCE_KPIS, INVENTORY_KPIS, FBU_KPIS,
  SUPPLIER_DASHBOARD_KPIS, SUPPLIER_SHARE_DATA, PURCHASE_SOURCE_DATA,
  POUCH_SUPPLIER_DATA, VISIT_TYPE_DATA, SURVEY_DM_DATA, SURVEY_STOCKING_DATA,
  REVENUE_COLLECTIONS_DATA, CUSTOMER_BALANCE_RANKING, OPERATIONAL_ALERTS,
  WAREHOUSE_OPS_DATA, BATCH_EXPIRY_ALERTS, TEAM_TOTALS, INVENTORY_STOCK_DATA,
  REVENUE_TREND_DATA, RECENT_ORDERS, GROUPED_KPI_DATA, REP_VISIT_DATA_DASHBOARD,
  TOP_SELLING_DATA, TOP_SELLING_PRODUCTS_DATA, CUSTOMER_LEDGER_PREVIEW_DATA,
  ACTIVE_CARTS_DATA, CREDIT_RISK_CUSTOMERS_DATA, SALES_BY_TERRITORY_DATA,
  DAILY_ORDERS_ACTIVITY_DATA, SALES_REPRESENTATIVES_DATA, TOP_CUSTOMERS_DATA,
  REP_PERFORMANCE_TREND, REP_CUSTOMERS_DATA, SYSTEM_NOTIFICATIONS,
  STOCK_MOVEMENT_CHART_DATA, DECISION_MAKER_DATA, PAYMENT_STATUS_DATA,
  LOW_STOCK_PRODUCTS_DATA, TOP_VALUE_PRODUCTS_DATA, CUSTOMER_LOCATIONS,
  BRAND_SKU_MOVEMENT_DATA, TOP_BRAND_BREAKDOWN_DATA, AI_STOCK_INSIGHTS,
  WORST_PERFORMING_SKUS,
} from '../data/dashboardData';

// --- Sub-Components ---

const GroupedKpiCard = ({ title, icon: Icon, color, items, compact }: any) => {
  const colorMap: any = {
    blue: 'text-blue-600 bg-blue-50/50',
    indigo: 'text-indigo-600 bg-indigo-50/50',
    amber: 'text-amber-600 bg-amber-50/50',
    emerald: 'text-emerald-600 bg-emerald-50/50',
    rose: 'text-rose-600 bg-rose-50/50',
  };

  return (
    <Card padding="none" className="overflow-hidden flex flex-col hover:shadow-lg transition-all border-slate-100 group">
      <div className={`${compact ? 'p-[12px_18px]' : 'p-4'} border-b border-slate-50 flex items-center justify-between bg-white group-hover:bg-slate-50/30 transition-colors`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${colorMap[color]} group-hover:scale-110 transition-transform`}>
            <Icon className="h-4 w-4" />
          </div>
          <h3 className={`${compact ? 'text-[10px]' : 'text-[11px]'} font-bold text-slate-500 uppercase tracking-[0.1em]`}>{title}</h3>
        </div>
        <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
      </div>
      <div className={`${compact ? 'p-[14px_18px] gap-y-3' : 'p-5 gap-y-4'} flex flex-col bg-white flex-1`}>
        {items.map((item: any, idx: number) => (
          <div key={idx} className="flex items-center justify-between border-b border-slate-50 last:border-0 pb-2 last:pb-0">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.label}</p>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold ${item.trendColor} flex items-center gap-1`}>
                {item.trend}
              </span>
              <span className="text-sm font-bold text-slate-900 tabular-nums leading-tight">{item.value}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

const AdminKpiCard = ({ label, value, trend, color, trendColor }: any) => {
  const borderColors: any = {
    blue: 'border-l-[#3d7fff]',
    teal: 'border-l-[#10b981]',
    amber: 'border-l-[#f59e0b]',
    rose: 'border-l-[#ef4444]',
    purple: 'border-l-[#a855f7]',
  };

  return (
    <Card className={`border-l-[3px] ${borderColors[color] || 'border-l-slate-200'} p-[20px_24px] hover:shadow-[0_0_0_1px_var(--border2)] transition-shadow duration-200`}>
      <div className="flex flex-col">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.6px] mb-2">{label}</p>
        <p className="text-[26px] font-semibold tabular-nums text-slate-900 leading-none font-mono">{value}</p>
        <p className={`text-[11px] font-medium mt-[6px] ${trendColor}`}>
          {trend}
        </p>
      </div>
    </Card>
  );
};

const KpiCard = ({ label, value, trend, color, icon: Icon }: any) => {
  const colorMap: any = {
    blue: 'border-l-blue-500 text-blue-600',
    emerald: 'border-l-emerald-500 text-emerald-600',
    amber: 'border-l-amber-500 text-amber-600',
    rose: 'border-l-rose-500 text-rose-600',
    indigo: 'border-l-indigo-500 text-indigo-600',
    purple: 'border-l-purple-500 text-purple-600',
  };

  const isUp = trend.includes('+') || trend.includes('▲');
  const isDown = trend.includes('-') || trend.includes('▼');

  return (
    <Card className={`border-l-4 ${colorMap[color]} hover:shadow-md transition-all cursor-pointer group`}>
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
          {Icon && <Icon className="h-3.5 w-3.5 text-slate-300 group-hover:text-indigo-400 transition-colors" />}
        </div>
        <p className={`text-2xl font-bold tabular-nums ${colorMap[color].split(' ')[1]}`}>{value}</p>
        <div className="flex items-center gap-1.5 mt-1">
          <span className={`text-[10px] font-bold ${isUp ? 'text-emerald-500' : isDown ? 'text-rose-500' : 'text-slate-400'}`}>
            {trend}
          </span>
        </div>
      </div>
    </Card>
  );
};

const KpiGroup = ({ title, kpis, icon: Icon, color }: any) => {
  const colorMap: any = {
    blue: 'text-blue-600 bg-blue-50',
    indigo: 'text-indigo-600 bg-indigo-50',
    amber: 'text-amber-600 bg-amber-50',
    emerald: 'text-emerald-600 bg-emerald-50',
    rose: 'text-rose-600 bg-rose-50',
  };

  return (
    <Card padding="none" className="overflow-hidden flex flex-col">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${colorMap[color]}`}>
            <Icon className="h-4 w-4" />
          </div>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">{title}</h3>
        </div>
        <button className="text-slate-400 hover:text-indigo-600 transition-colors">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div className="p-4 grid grid-cols-2 gap-4">
        {kpis.map((kpi: any) => (
          <div key={kpi.label} className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{kpi.label}</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-slate-900">{kpi.value}</span>
              <span className={`text-[9px] font-bold ${kpi.trend.startsWith('+') ? 'text-emerald-500' : kpi.trend.startsWith('-') ? 'text-rose-500' : 'text-slate-400'}`}>
                {kpi.trend}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

const MapControls = () => {
  const map = useMap();

  const handleReset = () => {
    map.setView([54.5, -3], 5);
  };

  return (
    <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
      <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-slate-200 flex flex-col">
        <button 
          onClick={() => map.zoomIn()}
          className="p-2.5 hover:bg-slate-50 border-b border-slate-100 transition-colors text-slate-600 hover:text-indigo-600"
          title="Zoom In"
        >
          <Plus className="h-4 w-4" />
        </button>
        <button 
          onClick={() => map.zoomOut()}
          className="p-2.5 hover:bg-slate-50 transition-colors text-slate-600 hover:text-indigo-600"
          title="Zoom Out"
        >
          <Minus className="h-4 w-4" />
        </button>
      </div>
      <button 
        onClick={handleReset}
        className="bg-white shadow-xl rounded-xl p-2.5 border border-slate-200 hover:bg-slate-50 transition-colors text-slate-600 hover:text-indigo-600"
        title="Reset View"
      >
        <RotateCcw className="h-4 w-4" />
      </button>
    </div>
  );
};

const FieldOpsSection = () => (
  <div className="grid grid-cols-12 gap-5">
    
    {/* Customer Location Map */}
    <Card padding="none" className="col-span-12 lg:col-span-8 overflow-hidden flex flex-col p-6 hover:shadow-xl transition-all duration-300 border-slate-100 group">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <MapPin className="h-4 w-4 text-rose-500" />
            Customer Location Map
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1">Geographic distribution</p>
        </div>
        <button className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-1 rounded-lg hover:bg-slate-200 transition-colors uppercase tracking-wider">Expand</button>
      </div>
      
      <div className="flex-1 relative rounded-2xl overflow-hidden border border-slate-100 shadow-inner min-h-[500px]">
        <MapContainer 
          center={[54.5, -2.5]} 
          zoom={5} 
          className="h-full w-full z-0"
          zoomControl={false}
          scrollWheelZoom={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          <MarkerClusterGroup chunkedLoading>
            {CUSTOMER_LOCATIONS.map((loc, i) => {
              const cityColors: any = {
                'London': '#ef4444',
                'Manchester': '#22c55e',
                'Liverpool': '#22c55e',
                'Birmingham': '#f59e0b',
                'Bristol': '#22c55e',
                'Leeds': '#3d7fff',
                'Glasgow': '#ef4444'
              };
              const cityRadius: any = {
                'London': 12,
                'Manchester': 9,
                'Liverpool': 9,
                'Birmingham': 7,
                'Bristol': 6,
                'Leeds': 6,
                'Glasgow': 6
              };
              
              return (
                <Marker 
                  key={i} 
                  position={[loc.lat, loc.lng]}
                  icon={L.divIcon({
                    className: 'custom-div-icon',
                    html: `<div style="background-color: ${cityColors[loc.city] || '#6366f1'}; width: ${(cityRadius[loc.city] || 6) * 2}px; height: ${(cityRadius[loc.city] || 6) * 2}px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.8); box-shadow: 0 0 10px ${cityColors[loc.city] || '#6366f1'}44; opacity: 0.9;"></div>`,
                    iconSize: [(cityRadius[loc.city] || 6) * 2, (cityRadius[loc.city] || 6) * 2],
                    iconAnchor: [cityRadius[loc.city] || 6, cityRadius[loc.city] || 6]
                  })}
                >
                  <Popup className="custom-popup">
                    <div className="p-2">
                      <p className="font-bold text-slate-900 text-sm">{loc.city}</p>
                      <p className="text-xs text-slate-500 font-medium">{loc.count} Active Customers</p>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MarkerClusterGroup>
          <MapControls />
        </MapContainer>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-3">
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">High</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Growth</span>
          </div>
        </div>
      </div>
    </Card>

    <div className="col-span-12 lg:col-span-4 flex flex-col gap-5">
      {/* Visit Type Distribution */}
      <Card padding="none" className="overflow-hidden p-6 hover:shadow-xl transition-all duration-300 border-slate-100 flex flex-col flex-1">
        <div className="mb-6">
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Activity className="h-4 w-4 text-indigo-500" />
            Visit Type Distribution
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1">Field interactions breakdown</p>
        </div>
        <div className="flex-1 flex items-center gap-4">
          <div className="w-1/2 h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={VISIT_TYPE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={55}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {VISIT_TYPE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-1/2 space-y-2">
            {VISIT_TYPE_DATA.map((item) => (
              <div key={item.name} className="flex items-center justify-between gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider truncate">{item.name}</span>
                </div>
                <span className="text-[10px] font-bold text-slate-900 tabular-nums">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Decision Maker Survey */}
      <Card padding="none" className="overflow-hidden p-6 hover:shadow-xl transition-all duration-300 border-slate-100 flex flex-col flex-1">
        <div className="mb-6">
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="h-4 w-4 text-emerald-500" />
            Decision Maker Survey
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1">Are you speaking with the DM?</p>
        </div>
        <div className="flex-1 flex items-center gap-4">
          <div className="w-1/2 h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={SURVEY_DM_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={55}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {SURVEY_DM_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-1/2 space-y-2">
            {SURVEY_DM_DATA.map((item) => (
              <div key={item.name} className="flex items-center justify-between gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider truncate">{item.name}</span>
                </div>
                <span className="text-[10px] font-bold text-slate-900 tabular-nums">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  </div>
);

const InventoryHoverTooltip = ({ active, payload, data }: any) => {
  const item = data || (active && payload && payload.length ? payload[0].payload : null);
  if (!item) return null;

  const COLORS = {
    green: '#10b981',
    amber: '#f59e0b',
    rose: '#f43f5e'
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-2xl border border-slate-100 min-w-[320px] z-[100]">
      <div className="space-y-1 mb-4">
        <p className="text-sm font-bold text-slate-900">{item.product}</p>
        <p className="text-[11px] font-medium text-slate-500">
          Total Stock: <span className="text-slate-900 font-bold">{item.total.toLocaleString()}</span> units
        </p>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="w-[100px] h-[100px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={item.flavours}
                cx="50%"
                cy="50%"
                innerRadius={25}
                outerRadius={45}
                paddingAngle={2}
                dataKey="stock"
                stroke="none"
              >
                {item.flavours.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.health as keyof typeof COLORS] || '#94a3b8'} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-1.5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-50 pb-1 mb-2">Flavour Breakdown</p>
          {item.flavours.map((f: any) => (
            <div key={f.name} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className={`h-1.5 w-1.5 rounded-full ${
                  f.health === 'green' ? 'bg-emerald-500' : 
                  f.health === 'amber' ? 'bg-amber-500' : 'bg-rose-500'
                }`} />
                <span className="text-[11px] font-medium text-slate-600 truncate max-w-[120px]">{f.name}</span>
              </div>
              <span className="text-[11px] font-bold text-slate-900 tabular-nums">{f.stock.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AdminPanel: React.FC = () => {
  const { products } = useProducts();
  const {
    GROUPED_KPI_DATA, CUSTOMER_BALANCE_RANKING, REVENUE_TREND_DATA,
    WAREHOUSE_OPS_DATA, CUSTOMER_LEDGER_PREVIEW_DATA, TOP_SELLING_PRODUCTS_DATA,
    CUSTOMER_LOCATIONS, RECENT_ORDERS, ACTIVE_CARTS_DATA, TEAM_TOTALS,
    STOCK_MOVEMENT_CHART_DATA, VISIT_TYPE_DATA, SURVEY_DM_DATA,
    SURVEY_STOCKING_DATA, DECISION_MAKER_DATA, REP_VISIT_DATA_DASHBOARD,
    TOP_SELLING_DATA, SUPPLIER_SHARE_DATA, PURCHASE_SOURCE_DATA, POUCH_SUPPLIER_DATA,
  } = useHistoricData();
  const sortedInventoryData = useMemo(() => {
    const grouped = products.reduce((acc: any, p) => {
      if (!acc[p.name]) {
        acc[p.name] = { product: p.name, total: 0, required: 15000, flavours: [] };
      }
      acc[p.name].total += p.stock;
      acc[p.name].flavours.push({ 
        name: p.flavour || 'Standard', 
        stock: p.stock, 
        health: p.stock === 0 ? 'red' : p.stock <= 50 ? 'amber' : 'green' 
      });
      return acc;
    }, {});
    return Object.values(grouped).sort((a: any, b: any) => b.total - a.total);
  }, [products]);

  return (
    <div className="space-y-[20px] pb-20">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Operational Control Center</h1>
          <p className="text-slate-500 font-medium">Wholesale Distribution ERP Dashboard</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary" icon={<PlusCircle className="h-4 w-4" />}>
            New Order
          </Button>
        </div>
      </div>
      <ViewModeToggle />

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <GroupedKpiCard {...GROUPED_KPI_DATA.sales} compact />
        <GroupedKpiCard {...GROUPED_KPI_DATA.customers} compact />
        <GroupedKpiCard {...GROUPED_KPI_DATA.finance} compact />
        <GroupedKpiCard {...GROUPED_KPI_DATA.inventory} compact />
        <GroupedKpiCard {...GROUPED_KPI_DATA.fbu} compact />
      </div>

      {/* MAIN ANALYTICS GRID */}
      <div className="grid grid-cols-12 gap-5 items-stretch">
        
        {/* Inventory Stock Overview */}
        <Card padding="none" className="col-span-12 lg:col-span-8 flex flex-col p-6 hover:shadow-xl transition-all duration-300 border-slate-100 group">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Warehouse className="h-4 w-4 text-indigo-500" />
                Inventory Stock Overview
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">Stock levels per product line. Hover for breakdown.</p>
            </div>
            <Link to="/inventory" className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors uppercase tracking-wider">Manage Inventory</Link>
          </div>
          
          <div className="flex-1 space-y-4">
            {sortedInventoryData.map((item) => {
              const ratio = item.total / item.required;
              let barColor = 'bg-emerald-500';
              let glowColor = 'shadow-[0_0_10px_rgba(16,185,129,0.3)]';
              if (ratio <= 0.15) {
                barColor = 'bg-rose-500';
                glowColor = 'shadow-[0_0_10px_rgba(244,63,94,0.3)]';
              } else if (ratio <= 0.35) {
                barColor = 'bg-amber-500';
                glowColor = 'shadow-[0_0_10px_rgba(245,158,11,0.3)]';
              }

              return (
                <div key={item.product} className="flex items-center gap-4 group/row relative">
                  <span className="text-xs text-slate-600 font-bold w-48 text-right truncate group-hover/row:text-slate-900 transition-colors" title={item.product}>{item.product}</span>
                  <div className="flex-1 h-3 bg-slate-100 rounded-full relative overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, ratio * 100)}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full rounded-full ${barColor} ${glowColor} transition-all duration-500`} 
                    />
                    <div className="absolute top-0 left-[30%] h-full border-l border-dashed border-white/30 z-10" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 w-16 text-right font-mono">{item.total.toLocaleString()}</span>
                  
                  {/* Tooltip on hover */}
                  <div className="absolute left-48 bottom-full mb-2 hidden group-hover/row:block z-50">
                    <InventoryHoverTooltip data={item} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-8 pt-4 border-t border-slate-50 flex justify-between items-center">
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Healthy</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Low</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Critical</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-md">Target: 30% Buffer</span>
          </div>

          {/* STOCK RISK INDICATOR PANEL */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-100">
              <p className="text-[10px] font-bold text-rose-600 uppercase tracking-wider mb-1">Critical Stock</p>
              <p className="text-xl font-bold text-rose-700">12 <span className="text-xs font-medium">SKUs</span></p>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-100">
              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-1">Low Stock</p>
              <p className="text-xl font-bold text-amber-700">38 <span className="text-xs font-medium">SKUs</span></p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1">Overstock</p>
              <p className="text-xl font-bold text-emerald-700">9 <span className="text-xs font-medium">SKUs</span></p>
            </div>
          </div>
        </Card>

        {/* Customer Balance Ranking (Table) */}
        <Card padding="none" className="col-span-12 lg:col-span-4 overflow-hidden flex flex-col p-6 hover:shadow-xl transition-all duration-300 border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Wallet className="h-4 w-4 text-amber-500" />
                Balance Ranking
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">Top accounts by outstanding</p>
            </div>
            <Link to="/customers" className="text-[11px] font-bold text-indigo-600 hover:underline uppercase tracking-widest">View All →</Link>
          </div>
          <div className="overflow-y-auto flex-1 -mx-6 custom-scrollbar">
            <Table className="w-full">
              <THead className="bg-transparent">
                <TR className="hover:bg-transparent">
                  <TH className="text-[10px] uppercase font-bold text-slate-400 px-6 py-3 border-b border-slate-100">Customer</TH>
                  <TH className="text-[10px] uppercase font-bold text-slate-400 px-6 py-3 border-b border-slate-100">Outstanding</TH>
                  <TH align="right" className="text-[10px] uppercase font-bold text-slate-400 px-6 py-3 border-b border-slate-100">Status</TH>
                </TR>
              </THead>
              <TBody className="divide-y-0">
                {CUSTOMER_BALANCE_RANKING.slice(0, 7).map((item, idx) => {
                  const overdueVal = parseInt(item.overdue.replace('£', '').replace(',', ''));
                  let badgeVariant: 'success' | 'warning' | 'danger' = "success";
                  if (overdueVal > 1000) {
                    badgeVariant = "danger";
                  } else if (overdueVal > 0) {
                    badgeVariant = "warning";
                  }

                  return (
                    <TR key={item.name} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                      <TD className="px-6 py-3">
                        <span className="text-xs font-medium text-slate-600 block truncate max-w-[120px]">{item.name}</span>
                      </TD>
                      <TD className="px-6 py-3">
                        <span className="text-xs font-bold text-slate-900">{item.outstanding}</span>
                      </TD>
                      <TD align="right" className="px-6 py-3">
                        <Badge variant={badgeVariant} className="text-[10px] px-2 py-0.5 uppercase tracking-wider">
                          {badgeVariant === 'danger' ? 'critical' : badgeVariant}
                        </Badge>
                      </TD>
                    </TR>
                  );
                })}
              </TBody>
            </Table>
          </div>
          <div className="flex items-center justify-between pt-4 mt-auto border-t border-slate-100 text-[11px] text-slate-400 font-bold uppercase tracking-widest">
            <span>Total: £12,750</span>
            <span className="text-rose-500">Overdue: 20%</span>
          </div>
        </Card>

      </div>

      {/* SECONDARY GRID */}
      <div className="flex flex-col lg:flex-row gap-5">
        
        {/* Operational Alerts */}
        <Card padding="none" className="w-full lg:w-[300px] shrink-0 flex flex-col p-6 hover:shadow-xl transition-all duration-300 border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-rose-500" />
              Operational Alerts
            </h3>
            <span className="px-2 py-1 rounded-lg bg-rose-50 text-rose-600 text-[10px] font-bold uppercase tracking-wider border border-rose-100">5 Actions</span>
          </div>
          <div className="flex-1 space-y-3">
            {/* Alert 1 - Critical */}
            <div className="group/alert bg-white border border-slate-100 rounded-xl p-4 flex items-start justify-between hover:border-rose-200 hover:shadow-sm transition-all cursor-pointer">
              <div className="flex gap-3">
                <div className="h-2 w-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.5)] mt-1.5 animate-pulse" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-900">21-day overdue</p>
                  <p className="text-[11px] text-slate-500 font-medium">2 customers · immediate action</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-sm font-bold text-rose-600 font-mono">£940</span>
                <button className="bg-rose-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-rose-700 transition-colors shadow-sm shadow-rose-200">Chase</button>
              </div>
            </div>
            {/* Alert 2 - Warning */}
            <div className="group/alert bg-white border border-slate-100 rounded-xl p-4 flex items-start justify-between hover:border-amber-200 hover:shadow-sm transition-all cursor-pointer">
              <div className="flex gap-3">
                <div className="h-2 w-2 rounded-full bg-amber-500 mt-1.5" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-900">14-day overdue</p>
                  <p className="text-[11px] text-slate-500 font-medium">4 invoices pending</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-sm font-bold text-amber-600 font-mono">£1,850</span>
                <button className="bg-white border border-slate-200 text-slate-700 text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">Remind</button>
              </div>
            </div>
            {/* Alert 3 - Info */}
            <div className="group/alert bg-white border border-slate-100 rounded-xl p-4 flex items-start justify-between hover:border-indigo-200 hover:shadow-sm transition-all cursor-pointer">
              <div className="flex gap-3">
                <div className="h-2 w-2 rounded-full bg-indigo-500 mt-1.5" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-900">7-day reminder</p>
                  <p className="text-[11px] text-slate-500 font-medium">8 invoices · routine</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-sm font-bold text-slate-400 font-mono">£3,200</span>
              </div>
            </div>

            {/* PAYMENT RISK SUMMARY */}
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Payment Risk Summary</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">High Risk Accounts</span>
                  <span className="text-rose-600 font-bold">4</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Medium Risk Accounts</span>
                  <span className="text-amber-600 font-bold">12</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <div className="flex gap-3">
              <span>18 Drafts</span>
              <span>5 Carts</span>
            </div>
            <Link to="/alerts" className="text-indigo-600 hover:text-indigo-700">View All →</Link>
          </div>
        </Card>

        {/* Revenue Trend (Line) */}
        <Card padding="none" className="flex-1 flex flex-col p-6 hover:shadow-xl transition-all duration-300 border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                  Revenue Trend
                </h3>
                <span className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-100">▲ +12.4%</span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1">Monthly performance vs target</p>
            </div>
            <div className="flex bg-slate-100 p-1 rounded-xl">
              {['M', 'W'].map((t) => (
                <button 
                  key={t}
                  className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${t === 'M' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={REVENUE_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} tickFormatter={(val) => `£${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="none" fillOpacity={1} fill="url(#colorRev)" />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#6366f1" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }} 
                  activeDot={{ r: 6, strokeWidth: 0 }} 
                />
                <Line type="monotone" dataKey="target" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Recent Orders (Table) */}
        <Card padding="none" className="flex-1 overflow-hidden flex flex-col p-6 hover:shadow-xl transition-all duration-300 border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-emerald-500" />
                Recent Orders
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">Latest activity across regions</p>
            </div>
            <Link to="/orders" className="text-[11px] font-bold text-indigo-600 hover:underline uppercase tracking-widest">View All →</Link>
          </div>
          <div className="overflow-x-auto flex-1 -mx-6">
            <Table className="w-full">
              <THead className="bg-transparent">
                <TR className="hover:bg-transparent">
                  <TH className="text-[10px] uppercase font-bold text-slate-400 px-6 py-3 border-b border-slate-100">ID</TH>
                  <TH className="text-[10px] uppercase font-bold text-slate-400 px-6 py-3 border-b border-slate-100">Customer</TH>
                  <TH align="right" className="text-[10px] uppercase font-bold text-slate-400 px-6 py-3 border-b border-slate-100">Status</TH>
                </TR>
              </THead>
              <TBody className="divide-y-0">
                {[
                  { id: '#326', customer: 'London C&C', amount: '£1,988', status: 'Pending', variant: 'warning' },
                  { id: '#325', customer: 'Manchester VS', amount: '£840', status: 'Paid', variant: 'success' },
                  { id: '#324', customer: 'Birmingham WS', amount: '£1,320', status: 'Disputed', variant: 'danger' },
                  { id: '#323', customer: 'Glasgow Dist.', amount: '£490', status: 'Paid', variant: 'success' },
                  { id: '#322', customer: 'Leeds C&C', amount: '£2,100', status: 'Processing', variant: 'accent' },
                ].map((order, idx) => {
                  let badgeVariant: 'success' | 'warning' | 'danger' | 'secondary' = "success";
                  if (order.status === 'Pending') badgeVariant = "warning";
                  else if (order.status === 'Disputed') badgeVariant = "danger";
                  else if (order.status === 'Processing') badgeVariant = "secondary";

                  return (
                    <TR key={order.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                      <TD className="px-6 py-3">
                        <span className="text-xs font-bold text-slate-900">{order.id}</span>
                      </TD>
                      <TD className="px-6 py-3">
                        <span className="text-xs font-medium text-slate-600 truncate max-w-[100px] block">{order.customer}</span>
                      </TD>
                      <TD align="right" className="px-6 py-3">
                        <Badge variant={badgeVariant as any} className="text-[10px] px-2 py-0.5 uppercase tracking-wider">
                          {order.status}
                        </Badge>
                      </TD>
                    </TR>
                  );
                })}
              </TBody>
            </Table>
          </div>
          <div className="mt-auto pt-4 border-t border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
            Last updated: Just now
          </div>
        </Card>

      </div>

      {/* SALES ENGAGEMENT INSIGHTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card padding="none" className="overflow-hidden p-6 hover:shadow-xl transition-all duration-300 border-slate-100 flex flex-col">
          <div className="mb-6">
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Phone className="h-4 w-4 text-indigo-500" />
              Visit Type Distribution
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1">Sales rep engagement activity</p>
          </div>
          <div className="flex-1 flex items-center gap-4">
            <div className="w-1/2 h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={VISIT_TYPE_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={55}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {VISIT_TYPE_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 space-y-2">
              {VISIT_TYPE_DATA.map((item) => (
                <div key={item.name} className="flex items-center justify-between gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider truncate">{item.name}</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-900 tabular-nums">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card padding="none" className="overflow-hidden p-6 hover:shadow-xl transition-all duration-300 border-slate-100 flex flex-col">
          <div className="mb-6">
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Users className="h-4 w-4 text-emerald-500" />
              Decision Maker Survey
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1">Sales visit effectiveness</p>
          </div>
          <div className="flex-1 flex items-center gap-4">
            <div className="w-1/2 h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={DECISION_MAKER_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={55}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {DECISION_MAKER_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 space-y-2">
              {DECISION_MAKER_DATA.map((item) => (
                <div key={item.name} className="flex items-center justify-between gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider truncate">{item.name}</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-900 tabular-nums">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* ACTIVE CARTS & STOCK MOVEMENT */}
      <div className="grid grid-cols-12 gap-5">
        <Card padding="none" className="col-span-12 lg:col-span-5 overflow-hidden flex flex-col p-6 hover:shadow-xl transition-all duration-300 border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-indigo-500" />
                Active Customer Carts
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">Real-time abandoned cart monitoring</p>
            </div>
            <Badge variant="accent" className="text-[10px]">5 Active</Badge>
          </div>
          <div className="overflow-x-auto flex-1">
            <Table className="w-full">
              <THead className="bg-transparent">
                <TR className="hover:bg-transparent">
                  <TH className="text-[10px] uppercase font-bold text-slate-400 px-4 py-2">Customer</TH>
                  <TH className="text-[10px] uppercase font-bold text-slate-400 px-4 py-2">Items</TH>
                  <TH align="right" className="text-[10px] uppercase font-bold text-slate-400 px-4 py-2">Updated</TH>
                </TR>
              </THead>
              <TBody className="divide-y-0">
                {ACTIVE_CARTS_DATA.map((cart, idx) => (
                  <TR key={idx} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                    <TD className="px-4 py-3">
                      <span className="text-xs font-medium text-slate-700 block truncate max-w-[150px]">{cart.customer}</span>
                    </TD>
                    <TD className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-900">{cart.items} items</span>
                        <span className="text-[10px] text-slate-400 font-medium">{cart.value}</span>
                      </div>
                    </TD>
                    <TD align="right" className="px-4 py-3">
                      <span className="text-[10px] font-medium text-slate-500">{cart.lastActivity}</span>
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </div>
          <button className="mt-4 w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-[11px] font-bold rounded-xl transition-colors uppercase tracking-widest">
            Recovery Campaign
          </button>
        </Card>

        <Card padding="none" className="col-span-12 lg:col-span-7 overflow-hidden flex flex-col p-6 hover:shadow-xl transition-all duration-300 border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-emerald-500" />
                Inventory Movement
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">Stock inflow vs outflow (7-day trend)</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-bold text-slate-400 uppercase">In</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-rose-500" />
                <span className="text-[10px] font-bold text-slate-400 uppercase">Out</span>
              </div>
            </div>
          </div>
          <div className="flex-1 min-h-[250px]">
            <ChartLine 
              data={STOCK_MOVEMENT_CHART_DATA} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    backgroundColor: '#1e293b',
                    padding: 12,
                    titleFont: { size: 12, weight: 'bold' },
                    bodyFont: { size: 12 },
                    cornerRadius: 8,
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: { color: '#f1f5f9' },
                    ticks: { font: { size: 10, weight: 600 }, color: '#94a3b8' }
                  },
                  x: {
                    grid: { display: false },
                    ticks: { font: { size: 10, weight: 600 }, color: '#94a3b8' }
                  }
                }
              }} 
            />
          </div>
        </Card>
      </div>

      {/* WAREHOUSE & LOGISTICS SECTION */}
      <div className="grid grid-cols-12 gap-5">
        {/* Warehouse Operations */}
        <Card padding="none" className="col-span-12 lg:col-span-7 overflow-hidden flex flex-col p-6 hover:shadow-xl transition-all duration-300 border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Warehouse className="h-4 w-4 text-purple-500" />
                Warehouse Operations
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">Real-time load and processing status</p>
            </div>
            <Badge variant="neutral" className="text-[10px] uppercase tracking-widest">3 Warehouses</Badge>
          </div>
          <div className="overflow-x-auto flex-1">
            <Table className="w-full">
              <THead className="bg-transparent">
                <TR className="hover:bg-transparent">
                  <TH className="text-[10px] uppercase font-bold text-slate-400 px-4 py-2">Warehouse</TH>
                  <TH className="text-[10px] uppercase font-bold text-slate-400 px-4 py-2">Load</TH>
                  <TH className="text-[10px] uppercase font-bold text-slate-400 px-4 py-2">Picking</TH>
                  <TH className="text-[10px] uppercase font-bold text-slate-400 px-4 py-2">Packing</TH>
                  <TH align="right" className="text-[10px] uppercase font-bold text-slate-400 px-4 py-2">Status</TH>
                </TR>
              </THead>
              <TBody className="divide-y-0">
                {WAREHOUSE_OPS_DATA.map((wh) => (
                  <TR key={wh.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                    <TD className="px-4 py-3">
                      <span className="text-xs font-bold text-slate-900">{wh.name}</span>
                    </TD>
                    <TD className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${wh.load > 80 ? 'bg-rose-500' : wh.load > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                            style={{ width: `${wh.load}%` }} 
                          />
                        </div>
                        <span className="text-[10px] font-bold text-slate-600">{wh.load}%</span>
                      </div>
                    </TD>
                    <TD className="px-4 py-3">
                      <span className="text-xs font-medium text-slate-600">{wh.picking}</span>
                    </TD>
                    <TD className="px-4 py-3">
                      <span className="text-xs font-medium text-slate-600">{wh.packing}</span>
                    </TD>
                    <TD align="right" className="px-4 py-3">
                      <Badge variant={wh.status === 'Active' ? 'success' : 'secondary'} className="text-[10px] px-2 py-0.5 uppercase tracking-wider">
                        {wh.status}
                      </Badge>
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </div>
        </Card>

        {/* Batch Expiry Alerts */}
        <Card padding="none" className="col-span-12 lg:col-span-5 overflow-hidden flex flex-col p-6 hover:shadow-xl transition-all duration-300 border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-500" />
                Batch Expiry Alerts
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">Inventory nearing expiration date</p>
            </div>
            <Link to="/inventory/batches" className="text-[11px] font-bold text-indigo-600 hover:underline uppercase tracking-widest">View All →</Link>
          </div>
          <div className="overflow-x-auto flex-1">
            <Table className="w-full">
              <THead className="bg-transparent">
                <TR className="hover:bg-transparent">
                  <TH className="text-[10px] uppercase font-bold text-slate-400 px-4 py-2">Batch</TH>
                  <TH className="text-[10px] uppercase font-bold text-slate-400 px-4 py-2">Product</TH>
                  <TH align="right" className="text-[10px] uppercase font-bold text-slate-400 px-4 py-2">Days Left</TH>
                </TR>
              </THead>
              <TBody className="divide-y-0">
                {BATCH_EXPIRY_ALERTS.map((batch, idx) => (
                  <TR key={idx} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                    <TD className="px-4 py-3">
                      <span className="text-xs font-bold text-slate-900">{batch.batch}</span>
                    </TD>
                    <TD className="px-4 py-3">
                      <span className="text-xs font-medium text-slate-600 truncate max-w-[150px] block">{batch.product}</span>
                    </TD>
                    <TD align="right" className="px-4 py-3">
                      <Badge variant={batch.status as any} className="text-[10px] px-2 py-0.5 uppercase tracking-wider">
                        {batch.daysLeft} Days
                      </Badge>
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </div>
          <button className="mt-4 w-full py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 text-[11px] font-bold rounded-xl transition-colors uppercase tracking-widest border border-amber-100">
            Initiate Clearance Sale
          </button>
        </Card>
      </div>

      {/* CUSTOMER LEDGER OVERVIEW */}
      <Card padding="none" className="col-span-12 overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 border-slate-100">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <FileText className="h-4 w-4 text-indigo-500" />
              Customer Ledger Overview
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1">Real-time balance and payment tracking</p>
          </div>
          <Button variant="secondary" size="sm" icon={<FileDown className="h-3.5 w-3.5" />}>
            Download Ledger
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table className="w-full">
            <THead className="bg-slate-50/50">
              <TR>
                <TH className="text-[10px] uppercase font-bold text-slate-400 px-6 py-3">Customer</TH>
                <TH className="text-[10px] uppercase font-bold text-slate-400 px-6 py-3">Total Orders</TH>
                <TH className="text-[10px] uppercase font-bold text-slate-400 px-6 py-3">Total Paid</TH>
                <TH className="text-[10px] uppercase font-bold text-slate-400 px-6 py-3">Current Balance</TH>
                <TH className="text-[10px] uppercase font-bold text-slate-400 px-6 py-3">Overdue</TH>
                <TH align="right" className="text-[10px] uppercase font-bold text-slate-400 px-6 py-3">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {CUSTOMER_LEDGER_PREVIEW_DATA.map((item, idx) => (
                <TR key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <TD className="px-6 py-4">
                    <span className="text-xs font-bold text-slate-900">{item.customer}</span>
                  </TD>
                  <TD className="px-6 py-4">
                    <span className="text-xs font-medium text-slate-600">{item.orders}</span>
                  </TD>
                  <TD className="px-6 py-4">
                    <span className="text-xs font-medium text-emerald-600">{item.paid}</span>
                  </TD>
                  <TD className="px-6 py-4">
                    <span className="text-xs font-bold text-slate-900">{item.balance}</span>
                  </TD>
                  <TD className="px-6 py-4">
                    <span className={`text-xs font-bold ${item.overdue !== '£0' ? 'text-rose-600' : 'text-slate-400'}`}>
                      {item.overdue}
                    </span>
                  </TD>
                  <TD align="right" className="px-6 py-4">
                    <button className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-widest">View Statement</button>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </div>
      </Card>

      {/* Top Selling Products Section */}
      <Card padding="none" className="col-span-12 overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 border-slate-100">
        <CardHeader title="Top Selling Products" description="Ranked by boxes sold this month" className="p-6 border-b border-slate-100 mb-0" />
        <div className="overflow-x-auto">
          <Table>
            <THead>
              <TR className="hover:bg-transparent">
                <TH className="text-[10px] uppercase tracking-wider pl-6">Rank</TH>
                <TH className="text-[10px] uppercase tracking-wider">Product</TH>
                <TH className="text-[10px] uppercase tracking-wider">Category</TH>
                <TH className="text-[10px] uppercase tracking-wider">Boxes Sold</TH>
                <TH className="text-[10px] uppercase tracking-wider">Units Sold</TH>
                <TH align="right" className="text-[10px] uppercase tracking-wider pr-6">Trend</TH>
              </TR>
            </THead>
            <TBody>
              {TOP_SELLING_PRODUCTS_DATA.map((item) => {
                let rankBadgeClass = "bg-slate-100 text-slate-500 border-slate-200";
                if (item.rank === 1) rankBadgeClass = "bg-amber-100 text-amber-700 border-amber-200 ring-1 ring-amber-600/10";
                if (item.rank === 2) rankBadgeClass = "bg-slate-200 text-slate-700 border-slate-300 ring-1 ring-slate-600/10";
                if (item.rank === 3) rankBadgeClass = "bg-orange-100 text-orange-700 border-orange-200 ring-1 ring-orange-600/10";

                return (
                  <TR key={item.rank} className="hover:bg-slate-50/50 transition-colors">
                    <TD className="pl-6 py-4">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-md text-[10px] font-bold border ${rankBadgeClass}`}>
                        {item.rank}
                      </span>
                    </TD>
                    <TD className="py-4">
                      <span className="text-sm font-medium text-slate-700">{item.product}</span>
                    </TD>
                    <TD className="py-4">
                      <Badge variant="neutral" className="text-[10px] px-2 py-0.5 font-bold uppercase tracking-wider bg-slate-100 border-slate-200 text-slate-500">
                        {item.category}
                      </Badge>
                    </TD>
                    <TD className="py-4">
                      <span className="text-sm font-bold text-slate-900 font-mono">{item.boxes}</span>
                    </TD>
                    <TD className="py-4">
                      <span className="text-sm font-medium text-slate-400 font-mono">{item.units}</span>
                    </TD>
                    <TD align="right" className="pr-6 py-4">
                      {item.trend === 'up' ? (
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-rose-500" />
                      )}
                    </TD>
                  </TR>
                );
              })}
            </TBody>
          </Table>
        </div>
      </Card>

      {/* SYSTEM NOTIFICATIONS PANEL */}
      <Card padding="none" className="col-span-12 overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 border-slate-100">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-xs font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Bell className="h-3.5 w-3.5 text-indigo-500" />
            System Notifications
          </h3>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recent Events</span>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {SYSTEM_NOTIFICATIONS.map((notif) => (
            <div key={notif.id} className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 hover:border-indigo-100 transition-colors">
              <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${
                notif.type === 'critical' ? 'bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]' :
                notif.type === 'warning' ? 'bg-amber-500' :
                notif.type === 'success' ? 'bg-emerald-500' : 'bg-indigo-500'
              }`} />
              <div className="space-y-1">
                <p className="text-[11px] font-medium text-slate-700 leading-tight">{notif.message}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{notif.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* FIELD OPERATIONS SECTION */}
      <FieldOpsSection />
    </div>
  );
};

const CreateSalesRepModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (rep: SalesRep) => void;
  existingReps: SalesRep[];
}> = ({ isOpen, onClose, onSave, existingReps }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    role: 'Sales Representative',
    territory: 'London',
    region: '',
    commissionRate: 0.5,
    creditLimit: 1000,
    status: 'Active' as 'Active' | 'Inactive',
    username: '',
    password: '',
    confirmPassword: '',
    sendCredentials: true,
    assignedCustomers: [] as string[],
    photoPreview: '' as string
  });

  const [customerSearch, setCustomerSearch] = useState('');
  const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);

  const AVAILABLE_CUSTOMERS = [
    { id: 'cust-1', name: 'London Vape Hub' },
    { id: 'cust-2', name: 'Glasgow Distribution' },
    { id: 'cust-3', name: 'Manchester Vape Store' },
    { id: 'cust-4', name: 'Birmingham Wholesale' },
    { id: 'cust-5', name: 'Leeds Cash & Carry' },
    { id: 'cust-6', name: 'Bristol Retailers' },
    { id: 'cust-7', name: 'Newcastle Vape Co' },
    { id: 'cust-8', name: 'Sheffield Supplies' },
  ];

  const filteredAvailableCustomers = AVAILABLE_CUSTOMERS.filter(c => 
    !formData.assignedCustomers.includes(c.id) && 
    c.name.toLowerCase().includes(customerSearch.toLowerCase())
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Full Name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (existingReps.some(r => r.email === formData.email)) {
      newErrors.email = 'Email must be unique';
    }
    if (!formData.mobile) {
      newErrors.mobile = 'Mobile Number is required';
    } else if (existingReps.some(r => r.mobile === formData.mobile)) {
      newErrors.mobile = 'Mobile Number must be unique';
    }
    if (!formData.territory) newErrors.territory = 'Territory is required';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const newRep: SalesRep = {
        id: `rep-${Date.now()}`,
        name: formData.name,
        photo: formData.photoPreview || `https://i.pravatar.cc/150?u=${formData.name.replace(/\s/g, '')}`,
        mobile: formData.mobile,
        email: formData.email,
        territory: formData.territory,
        status: formData.status,
        joinedDate: new Date().toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }),
        specialization: formData.role,
        bio: `${formData.role} for ${formData.territory} region.`,
        metrics: { customers: 0, sales: '£0' },
        commissionLedger: []
      };
      onSave(newRep);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Sales Representative" size="xl">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECTION 1 — BASIC INFORMATION */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <UserIcon className="h-4 w-4 text-indigo-500" />
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Basic Information</h4>
          </div>

          {/* PHOTO UPLOAD */}
          <div className="flex items-center gap-6 pb-4">
            <div className="relative group">
              <div className="h-24 w-24 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden transition-all group-hover:border-indigo-300">
                {formData.photoPreview ? (
                  <img src={formData.photoPreview} className="h-full w-full object-cover" alt="Preview" />
                ) : (
                  <UserIcon className="h-8 w-8 text-slate-300" />
                )}
              </div>
              <label className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-white shadow-lg border border-slate-100 flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-all">
                <Upload className="h-4 w-4 text-indigo-600" />
                <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setFormData({...formData, photoPreview: reader.result as string});
                    };
                    reader.readAsDataURL(file);
                  }
                }} />
              </label>
            </div>
            <div className="space-y-1">
              <h5 className="text-sm font-bold text-slate-900">Profile Photo</h5>
              <p className="text-[10px] font-medium text-slate-400 max-w-[200px]">Upload a professional photo. Recommended size: 400x400px.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name *</label>
              <input 
                type="text" 
                className={`w-full px-4 py-2.5 bg-white border ${errors.name ? 'border-rose-500' : 'border-slate-200'} rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all`}
                placeholder="Enter full name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              {errors.name && <p className="text-[10px] font-bold text-rose-500">{errors.name}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address *</label>
              <input 
                type="email" 
                className={`w-full px-4 py-2.5 bg-white border ${errors.email ? 'border-rose-500' : 'border-slate-200'} rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all`}
                placeholder="Enter email address"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
              {errors.email && <p className="text-[10px] font-bold text-rose-500">{errors.email}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mobile Number *</label>
              <input 
                type="tel" 
                className={`w-full px-4 py-2.5 bg-white border ${errors.mobile ? 'border-rose-500' : 'border-slate-200'} rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all`}
                placeholder="Enter mobile number"
                value={formData.mobile}
                onChange={(e) => setFormData({...formData, mobile: e.target.value})}
              />
              {errors.mobile && <p className="text-[10px] font-bold text-rose-500">{errors.mobile}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Role</label>
              <select 
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <option>Sales Representative</option>
                <option>Key Account Manager</option>
                <option>Area Sales Manager</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 2 — TERRITORY INFORMATION */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <MapPin className="h-4 w-4 text-indigo-500" />
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Territory Information</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Area / Territory *</label>
              <select 
                className={`w-full px-4 py-2.5 bg-white border ${errors.territory ? 'border-rose-500' : 'border-slate-200'} rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all`}
                value={formData.territory}
                onChange={(e) => setFormData({...formData, territory: e.target.value})}
              >
                <option>London</option>
                <option>Manchester</option>
                <option>Birmingham</option>
                <option>Liverpool</option>
              </select>
              {errors.territory && <p className="text-[10px] font-bold text-rose-500">{errors.territory}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Region (Optional)</label>
              <input 
                type="text" 
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                placeholder="Enter region"
                value={formData.region}
                onChange={(e) => setFormData({...formData, region: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* SECTION 3 — ACCOUNT SETTINGS */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Activity className="h-4 w-4 text-indigo-500" />
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Account Settings</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Commission Rate (%)</label>
              <input 
                type="number" 
                step="0.25"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                placeholder="0.5"
                value={formData.commissionRate}
                onChange={(e) => setFormData({...formData, commissionRate: parseFloat(e.target.value)})}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Credit Approval Limit (£)</label>
              <input 
                type="number" 
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                placeholder="1000"
                value={formData.creditLimit}
                onChange={(e) => setFormData({...formData, creditLimit: parseFloat(e.target.value)})}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status</label>
              <select 
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value as 'Active' | 'Inactive'})}
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 4 — LOGIN ACCESS */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Lock className="h-4 w-4 text-indigo-500" />
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Login Access</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Username</label>
              <input 
                type="text" 
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                placeholder="Enter username"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
              <input 
                type="password" 
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Confirm Password</label>
              <input 
                type="password" 
                className={`w-full px-4 py-2.5 bg-white border ${errors.confirmPassword ? 'border-rose-500' : 'border-slate-200'} rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all`}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              />
              {errors.confirmPassword && <p className="text-[10px] font-bold text-rose-500">{errors.confirmPassword}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <input 
              type="checkbox" 
              id="sendCredentials"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
              checked={formData.sendCredentials}
              onChange={(e) => setFormData({...formData, sendCredentials: e.target.checked})}
            />
            <label htmlFor="sendCredentials" className="text-xs font-bold text-slate-600">Send Login Credentials by Email</label>
          </div>
        </div>

        {/* SECTION 5 — ASSIGNED CUSTOMERS (OPTIONAL) */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Users className="h-4 w-4 text-indigo-500" />
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Assigned Customers (Optional)</h4>
          </div>
          <div className="space-y-1.5 relative">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assign Customers</label>
            
            <div 
              className="min-h-[46px] p-1.5 bg-white border border-slate-200 rounded-xl flex flex-wrap gap-1.5 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all cursor-text"
              onClick={() => setIsCustomerDropdownOpen(true)}
            >
              {formData.assignedCustomers.map(id => {
                const customer = AVAILABLE_CUSTOMERS.find(c => c.id === id);
                return (
                  <div key={id} className="flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold border border-indigo-100">
                    {customer?.name}
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFormData({...formData, assignedCustomers: formData.assignedCustomers.filter(cid => cid !== id)});
                      }}
                      className="hover:text-indigo-900 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                );
              })}
              <input 
                type="text"
                className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-sm px-2 py-1"
                placeholder={formData.assignedCustomers.length === 0 ? "Search and select customers..." : ""}
                value={customerSearch}
                onChange={(e) => {
                  setCustomerSearch(e.target.value);
                  setIsCustomerDropdownOpen(true);
                }}
                onFocus={() => setIsCustomerDropdownOpen(true)}
              />
            </div>

            <AnimatePresence>
              {isCustomerDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => {
                      setIsCustomerDropdownOpen(false);
                      setCustomerSearch('');
                    }} 
                  />
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-20 max-h-[200px] overflow-y-auto py-2"
                  >
                    {filteredAvailableCustomers.length > 0 ? (
                      filteredAvailableCustomers.map(customer => (
                        <button
                          key={customer.id}
                          type="button"
                          className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 transition-colors flex items-center justify-between group"
                          onClick={() => {
                            setFormData({...formData, assignedCustomers: [...formData.assignedCustomers, customer.id]});
                            setCustomerSearch('');
                            // Keep open for more selections if needed, or close
                          }}
                        >
                          <span className="font-medium text-slate-700">{customer.name}</span>
                          <Plus className="h-3.5 w-3.5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-center">
                        <p className="text-xs font-medium text-slate-400">No customers found</p>
                      </div>
                    )}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
            
            <p className="text-[10px] text-slate-400 font-medium italic">Selected customers will be assigned to this representative's portfolio</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
          <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
          <Button variant="primary" type="submit">Create Sales Representative</Button>
        </div>
      </form>
    </Modal>
  );
};

const ScrollContainer: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeft(scrollLeft > 10);
      setShowRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', handleScroll);
      // Initial check
      setTimeout(handleScroll, 100);
      return () => el.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -amount : amount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative group/scroll">
      {showLeft && (
        <button 
          onClick={() => scroll('left')}
          className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-xl border border-slate-100 text-slate-400 hover:text-indigo-600 hover:scale-110 transition-all opacity-0 group-hover/scroll:opacity-100 hidden md:block"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}
      
      <div 
        ref={scrollRef}
        className={`no-scrollbar scroll-smooth ${className}`}
      >
        {children}
      </div>

      {showRight && (
        <button 
          onClick={() => scroll('right')}
          className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-xl border border-slate-100 text-slate-400 hover:text-indigo-600 hover:scale-110 transition-all opacity-0 group-hover/scroll:opacity-100 hidden md:block"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

const SalesPanel: React.FC = () => {
  const {
    GROUPED_KPI_DATA, REVENUE_TREND_DATA, TOP_SELLING_PRODUCTS_DATA,
    SALES_BY_TERRITORY_DATA, DAILY_ORDERS_ACTIVITY_DATA, RECENT_ORDERS,
    TOP_CUSTOMERS_DATA, CREDIT_RISK_CUSTOMERS_DATA, REP_PERFORMANCE_TREND,
    ACTIVE_CARTS_DATA, factor,
  } = useHistoricData();
  const sv = (val: string) => {
    if (factor === 1) return val;
    const p = parseFormattedValue(val);
    return p ? formatValue(p.num * factor, p) : val;
  };
  const [reps, setReps] = useState<SalesRep[]>(SALES_REPRESENTATIVES_DATA);
  const [activeTab, setActiveTab] = useState<'overview' | 'reps'>('overview');
  const [selectedRep, setSelectedRep] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    dateRange: 'This Month',
    rep: 'All Representatives',
    territory: 'All Territories',
    status: 'All Status'
  });

  const filterScrollRef = useRef<HTMLDivElement>(null);
  const repsScrollRef = useRef<HTMLDivElement>(null);

  const scroll = (ref: React.RefObject<HTMLDivElement>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = 300;
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const [ledgerFilters, setLedgerFilters] = useState({
    status: 'All Status',
    customer: 'All Customers',
    orderId: '',
    dateRange: 'All Time'
  });

  const [commissionDelayDays, setCommissionDelayDays] = useState(30);

  const filteredReps = reps.filter(rep => {
    const matchesSearch = rep.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          rep.territory.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filters.status === 'All Status' || rep.status === filters.status;
    const matchesTerritory = filters.territory === 'All Territories' || rep.territory === filters.territory;
    return matchesSearch && matchesStatus && matchesTerritory;
  });

  const activeRepData = selectedRep 
    ? reps.find(r => r.id === selectedRep) || reps[0]
    : reps[0];

  const commissionSummary = useMemo(() => {
    if (!activeRepData || !activeRepData.commissionLedger || activeRepData.commissionLedger.length === 0) {
      return {
        pending: 0,
        matured: 0,
        released: 0,
        totalEarned: 0,
        totalPaid: 0,
        available: 0
      };
    }

    const summary = activeRepData.commissionLedger.reduce((acc, entry) => {
      if (entry.status === 'Pending') acc.pending += entry.commissionAmount;
      if (entry.status === 'Matured') acc.matured += entry.commissionAmount;
      if (entry.status === 'Released') acc.released += entry.commissionAmount;
      acc.totalEarned += entry.commissionAmount;
      acc.totalPaid += entry.commissionPaid;
      return acc;
    }, {
      pending: 0,
      matured: 0,
      released: 0,
      totalEarned: 0,
      totalPaid: 0,
      available: 0
    });

    // Available is basically Released that hasn't been Paid
    summary.available = summary.released;

    return summary;
  }, [activeRepData]);

  const filteredLedger = useMemo(() => {
    if (!activeRepData || !activeRepData.commissionLedger) return [];
    
    return activeRepData.commissionLedger.filter(entry => {
      const matchesStatus = ledgerFilters.status === 'All Status' || entry.status === ledgerFilters.status;
      const matchesCustomer = ledgerFilters.customer === 'All Customers' || entry.customerName === ledgerFilters.customer;
      const matchesOrderId = !ledgerFilters.orderId || entry.orderId.toLowerCase().includes(ledgerFilters.orderId.toLowerCase());
      // Date range filtering would go here
      return matchesStatus && matchesCustomer && matchesOrderId;
    });
  }, [activeRepData, ledgerFilters]);

  // Helper to simulate filtered data for charts/tables
  const getFilteredData = (data: any[]) => {
    if (filters.territory === 'All Territories' && filters.rep === 'All Representatives') return data;
    // Simple simulation: return a subset or slightly modified data
    return data.slice(0, Math.max(2, data.length - 1));
  };

  const isFiltered = filters.dateRange !== 'This Month' || 
                     filters.rep !== 'All Representatives' || 
                     filters.territory !== 'All Territories';

  const resetFilters = () => {
    setFilters({
      dateRange: 'This Month',
      rep: 'All Representatives',
      territory: 'All Territories',
      status: 'All Status'
    });
    setSearchQuery('');
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header & Global Filters */}
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Sales Dashboard</h1>
            <p className="text-slate-500 font-medium">Monitor performance, customers, and representatives</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" icon={<RefreshCw className="h-4 w-4" />}>Refresh Data</Button>
            <Button variant="primary" icon={<FileDown className="h-4 w-4" />}>Export Report</Button>
          </div>
        </div>
        <ViewModeToggle />

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'overview' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('reps')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'reps' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Sales Representatives
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' ? (
          <motion.div
            key="overview"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            className="space-y-8"
          >
            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <KpiCard label="Revenue Today" value={sv(filters.rep !== 'All Representatives' ? "£2,450" : "£12,450")} trend="+7% vs yesterday" color="blue" icon={TrendingUp} />
              <KpiCard label="Revenue This Month" value={sv(filters.rep !== 'All Representatives' ? "£42,800" : "£342,800")} trend="+12% vs last month" color="emerald" icon={BarChart3} />
              <KpiCard label="Orders Today" value={sv(filters.rep !== 'All Representatives' ? "8" : "42")} trend="+8 vs yesterday" color="amber" icon={ShoppingCart} />
              <KpiCard label="Orders This Month" value={sv(filters.rep !== 'All Representatives' ? "240" : "1,240")} trend="+15% vs last month" color="indigo" icon={Package} />
              <KpiCard label="Collection Today" value={sv(filters.rep !== 'All Representatives' ? "£1,420" : "£8,420")} trend="92% of target" color="emerald" icon={Wallet} />
              <KpiCard label="Pending Commission" value={sv(filters.rep !== 'All Representatives' ? "£425" : "£4,250")} trend="12 reps" color="amber" icon={Clock} />
              <KpiCard label="Total Customers" value={sv(filters.rep !== 'All Representatives' ? "124" : "842")} trend="+14 new this week" color="indigo" icon={Users} />
              <KpiCard label="Credit Risk Customers" value={sv(filters.rep !== 'All Representatives' ? "2" : "12")} trend="Action required" color="rose" icon={AlertCircle} />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-12 gap-6">
              <Card padding="none" className="col-span-12 lg:col-span-8 flex flex-col hover:shadow-lg transition-all border-slate-100">
                <CardHeader title="Revenue Trend" description="Monthly sales performance vs target" className="p-6 border-b border-slate-100 mb-0" />
                <div className="p-6 h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={getFilteredData(REVENUE_TREND_DATA)}>
                      <defs>
                        <linearGradient id="colorRevSales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(val) => `£${val/1000}k`} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                      <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRevSales)" />
                      <Line type="monotone" dataKey="target" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card padding="none" className="col-span-12 lg:col-span-4 flex flex-col hover:shadow-lg transition-all border-slate-100">
                <CardHeader title="Top Selling Products" description="Ranked by boxes sold this month" className="p-6 border-b border-slate-100 mb-0" />
                <ScrollContainer className="overflow-x-auto flex-1">
                  <Table noWrapper>
                    <THead>
                      <TR className="hover:bg-transparent">
                        <TH className="text-[10px] uppercase tracking-wider pl-6">Rank</TH>
                        <TH className="text-[10px] uppercase tracking-wider">Product</TH>
                        <TH align="right" className="text-[10px] uppercase tracking-wider pr-6">Revenue</TH>
                      </TR>
                    </THead>
                    <TBody>
                      {getFilteredData(TOP_SELLING_PRODUCTS_DATA).slice(0, 6).map((item: any) => (
                        <TR key={item.rank} className="hover:bg-slate-50/50 transition-colors">
                          <TD className="pl-6 py-3">
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-slate-100 text-[10px] font-bold text-slate-500">
                              {item.rank}
                            </span>
                          </TD>
                          <TD className="py-3">
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-slate-900">{item.product}</span>
                              <span className="text-[10px] text-slate-400 font-medium">{item.boxes} boxes sold</span>
                            </div>
                          </TD>
                          <TD align="right" className="pr-6 py-3 text-xs font-bold text-slate-900">
                            £{(item.boxes * 25).toLocaleString()}
                          </TD>
                        </TR>
                      ))}
                    </TBody>
                  </Table>
                </ScrollContainer>
              </Card>
            </div>

            <div className="grid grid-cols-12 gap-6">
              <Card padding="none" className="col-span-12 lg:col-span-4 flex flex-col hover:shadow-lg transition-all border-slate-100">
                <CardHeader title="Sales by Territory" description="Revenue distribution across regions" className="p-6 border-b border-slate-100 mb-0" />
                <div className="p-6 h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getFilteredData(SALES_BY_TERRITORY_DATA)} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} width={80} />
                      <Tooltip cursor={{ fill: '#f8fafc' }} />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                        {getFilteredData(SALES_BY_TERRITORY_DATA).map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card padding="none" className="col-span-12 lg:col-span-8 flex flex-col hover:shadow-lg transition-all border-slate-100">
                <CardHeader title="Daily Orders Activity" description="Created vs Completed vs Blocked" className="p-6 border-b border-slate-100 mb-0" />
                <div className="p-6 h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getFilteredData(DAILY_ORDERS_ACTIVITY_DATA)}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                      <Tooltip />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', paddingTop: '20px' }} />
                      <Bar dataKey="created" name="Created" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={15} />
                      <Bar dataKey="completed" name="Completed" fill="#10b981" radius={[4, 4, 0, 0]} barSize={15} />
                      <Bar dataKey="blocked" name="Blocked" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={15} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            {/* Tables Section */}
            <div className="grid grid-cols-12 gap-6">
              <Card padding="none" className="col-span-12 lg:col-span-7 flex flex-col hover:shadow-lg transition-all border-slate-100">
                <CardHeader title="Recent Orders" description="Latest transactions across all reps" className="p-6 border-b border-slate-100 mb-0" />
                <ScrollContainer className="overflow-x-auto">
                  <Table noWrapper>
                    <THead>
                      <TR className="hover:bg-transparent">
                        <TH className="text-[10px] uppercase tracking-wider pl-6">Order ID</TH>
                        <TH className="text-[10px] uppercase tracking-wider">Customer</TH>
                        <TH className="text-[10px] uppercase tracking-wider">Rep</TH>
                        <TH className="text-[10px] uppercase tracking-wider">Amount</TH>
                        <TH className="text-[10px] uppercase tracking-wider">Status</TH>
                        <TH align="right" className="text-[10px] uppercase tracking-wider pr-6">Date</TH>
                      </TR>
                    </THead>
                    <TBody>
                      {getFilteredData(RECENT_ORDERS).map((order: any) => (
                        <TR key={order.id}>
                          <TD className="pl-6 py-4 text-xs font-bold text-slate-900">{order.id}</TD>
                          <TD className="py-4 text-xs font-medium text-slate-600">{order.customer}</TD>
                          <TD className="py-4 text-xs font-medium text-slate-500">{filters.rep !== 'All Representatives' ? filters.rep : 'John Smith'}</TD>
                          <TD className="py-4 text-xs font-bold text-slate-900">{order.amount}</TD>
                          <TD className="py-4">
                            <Badge variant={order.status === 'Paid' ? 'success' : order.status === 'Pending' ? 'warning' : 'danger'} className="text-[9px]">
                              {order.status}
                            </Badge>
                          </TD>
                          <TD align="right" className="pr-6 py-4 text-xs text-slate-400 font-medium">Today</TD>
                        </TR>
                      ))}
                    </TBody>
                  </Table>
                </ScrollContainer>
              </Card>

              <Card padding="none" className="col-span-12 lg:col-span-5 flex flex-col hover:shadow-lg transition-all border-slate-100">
                <CardHeader title="Top Customers" description="Highest revenue contributors" className="p-6 border-b border-slate-100 mb-0" />
                <ScrollContainer className="overflow-x-auto">
                  <Table noWrapper>
                    <THead>
                      <TR className="hover:bg-transparent">
                        <TH className="text-[10px] uppercase tracking-wider pl-6">Customer</TH>
                        <TH className="text-[10px] uppercase tracking-wider">Revenue</TH>
                        <TH align="right" className="text-[10px] uppercase tracking-wider pr-6">Rep</TH>
                      </TR>
                    </THead>
                    <TBody>
                      {getFilteredData(TOP_CUSTOMERS_DATA).map((customer: any, idx: number) => (
                        <TR key={idx}>
                          <TD className="pl-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-slate-900">{customer.name}</span>
                              <span className="text-[10px] text-slate-400 font-medium">{customer.orders} orders</span>
                            </div>
                          </TD>
                          <TD className="py-4 text-xs font-bold text-emerald-600">{customer.revenue}</TD>
                          <TD align="right" className="pr-6 py-4 text-xs font-medium text-slate-500">{customer.rep}</TD>
                        </TR>
                      ))}
                    </TBody>
                  </Table>
                </ScrollContainer>
              </Card>
            </div>

            <Card padding="none" className="col-span-12 flex flex-col hover:shadow-lg transition-all border-slate-100">
              <CardHeader title="Credit Risk Customers" description="Accounts exceeding credit limits or with overdue balances" className="p-6 border-b border-slate-100 mb-0" />
              <ScrollContainer className="overflow-x-auto">
                <Table noWrapper>
                  <THead>
                    <TR className="hover:bg-transparent">
                      <TH className="text-[10px] uppercase tracking-wider pl-6">Customer</TH>
                      <TH className="text-[10px] uppercase tracking-wider">Outstanding Balance</TH>
                      <TH className="text-[10px] uppercase tracking-wider">Credit Limit</TH>
                      <TH className="text-[10px] uppercase tracking-wider">Risk Level</TH>
                      <TH align="right" className="text-[10px] uppercase tracking-wider pr-6">Action</TH>
                    </TR>
                  </THead>
                  <TBody>
                    {getFilteredData(CREDIT_RISK_CUSTOMERS_DATA).map((customer: any, idx: number) => (
                      <TR key={idx}>
                        <TD className="pl-6 py-4 text-xs font-bold text-slate-900">{customer.name}</TD>
                        <TD className="py-4 text-xs font-bold text-rose-600">{customer.balance}</TD>
                        <TD className="py-4 text-xs font-medium text-slate-500">{customer.limit}</TD>
                        <TD className="py-4">
                          <Badge variant={customer.risk === 'High' ? 'danger' : customer.risk === 'Medium' ? 'warning' : 'success'} className="text-[9px]">
                            {customer.risk} Risk
                          </Badge>
                        </TD>
                        <TD align="right" className="pr-6 py-4">
                          <button className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-widest">Review Account</button>
                        </TD>
                      </TR>
                    ))}
                  </TBody>
                </Table>
                </ScrollContainer>
              </Card>
            </motion.div>
        ) : (
          <motion.div
            key="reps"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-8"
          >
            {/* Reps Controls */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search representatives..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
                <select 
                  className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                >
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
              <Button 
                variant="primary" 
                icon={<Plus className="h-4 w-4" />}
                onClick={() => setIsCreateModalOpen(true)}
              >
                Add Sales Representative
              </Button>
            </div>

            {/* Reps Slider */}
            <ScrollContainer className="flex pb-6 gap-4 snap-x snap-mandatory">
              {filteredReps.length > 0 ? (
                filteredReps.map((rep) => (
                  <Card 
                    key={rep.id} 
                    className={`p-4 min-w-[200px] w-[200px] snap-start hover:shadow-xl transition-all border-slate-100 group cursor-pointer shrink-0 ${selectedRep === rep.id ? 'ring-2 ring-indigo-500 border-transparent' : ''}`}
                    onClick={() => setSelectedRep(rep.id)}
                  >
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="relative">
                        <img src={rep.photo} alt={rep.name} className="h-16 w-16 rounded-2xl object-cover shadow-md group-hover:scale-105 transition-transform" />
                        <div className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white ${rep.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                      </div>
                      <div className="w-full overflow-hidden">
                        <h3 className="text-sm font-bold text-slate-900 truncate">{rep.name}</h3>
                        <p className="text-[10px] font-medium text-slate-500">{rep.territory}</p>
                        <div className="mt-1.5 space-y-0.5">
                          <p className="text-[10px] font-bold text-indigo-600">{rep.mobile}</p>
                          <p className="text-[9px] font-medium text-slate-400 truncate">{rep.email}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 w-full pt-1">
                        <div className="text-center">
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Clients</p>
                          <p className="text-xs font-bold text-slate-900">{rep.metrics.customers}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Sales</p>
                          <p className="text-xs font-bold text-indigo-600">{rep.metrics.sales}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 w-full pt-1">
                        <Button variant="secondary" size="sm" className="flex-1 h-8 text-[9px]" onClick={(e) => { e.stopPropagation(); setSelectedRep(rep.id); }}>View Profile</Button>
                        <button className="p-1.5 rounded-lg bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all border border-slate-100" title="Contact">
                          <Phone className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="w-full py-20 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 text-slate-400 mb-4">
                    <Search className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">No representatives found</h3>
                  <p className="text-slate-500">Try adjusting your search or filters</p>
                  <Button variant="secondary" className="mt-6" onClick={() => { setSearchQuery(''); setFilters({...filters, status: 'All Status', territory: 'All Territories'}); }}>Clear All Filters</Button>
                </div>
              )}
            </ScrollContainer>

            {/* Dynamic Profile Section */}
            {activeRepData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-6 border-t border-slate-100"
              >
                <Card padding="none" className="overflow-hidden border-slate-200 shadow-xl shadow-slate-200/50">
                  <div className="flex flex-col lg:flex-row">
                    {/* LEFT PANEL: Profile Information */}
                    <div className="lg:w-1/3 p-4 border-r border-slate-100 bg-white">
                      <div className="flex flex-col items-center text-center space-y-4">
                        <div className="relative">
                          <img 
                            src={activeRepData.photo} 
                            alt={activeRepData.name} 
                            className="h-24 w-24 rounded-3xl object-cover border-4 border-slate-50 shadow-xl" 
                          />
                          <div className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-4 border-white ${activeRepData.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                        </div>

                        <div>
                          <h2 className="text-xl font-bold text-slate-900">{activeRepData.name}</h2>
                          <div className="flex items-center justify-center gap-2 mt-0.5">
                            <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-[9px] font-bold uppercase tracking-wider">
                              {activeRepData.specialization}
                            </span>
                            <span className="text-slate-400 text-[10px]">•</span>
                            <span className="text-slate-500 text-[10px] font-medium">{activeRepData.territory}</span>
                          </div>
                        </div>

                        <div className="w-full space-y-3 pt-3 border-t border-slate-50">
                          <div className="flex items-center gap-2.5 text-slate-600">
                            <div className="p-1.5 rounded-lg bg-slate-50 text-slate-400">
                              <Mail className="h-3.5 w-3.5" />
                            </div>
                            <div className="text-left">
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Email</p>
                              <p className="text-[11px] font-semibold text-slate-900">{activeRepData.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2.5 text-slate-600">
                            <div className="p-1.5 rounded-lg bg-slate-50 text-slate-400">
                              <Phone className="h-3.5 w-3.5" />
                            </div>
                            <div className="text-left">
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Phone</p>
                              <p className="text-[11px] font-semibold text-slate-900">{activeRepData.mobile}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2.5 text-slate-600">
                            <div className="p-1.5 rounded-lg bg-slate-50 text-slate-400">
                              <Calendar className="h-3.5 w-3.5" />
                            </div>
                            <div className="text-left">
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Joined</p>
                              <p className="text-[11px] font-semibold text-slate-900">{activeRepData.joinedDate}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 w-full pt-4">
                          <Button variant="primary" className="flex-1 h-9 text-xs shadow-lg shadow-indigo-100">Send Message</Button>
                          <Button variant="secondary" className="px-3 h-9">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT PANEL: Performance Metrics */}
                    <div className="flex-1 p-4 bg-slate-50/30 space-y-4">
                      {/* KPI Cards */}
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Sales (Month)</p>
                            <TrendingUp className="h-3 w-3 text-emerald-500" />
                          </div>
                          <p className="text-lg font-bold text-slate-900">£12,400</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <span className="text-[9px] font-bold text-emerald-500">+8%</span>
                            <span className="text-[9px] text-slate-400 font-medium">vs last month</span>
                          </div>
                        </div>

                        <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Orders (Month)</p>
                            <ShoppingCart className="h-3 w-3 text-indigo-500" />
                          </div>
                          <p className="text-lg font-bold text-slate-900">48</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <span className="text-[9px] font-bold text-emerald-500">+12%</span>
                            <span className="text-[9px] text-slate-400 font-medium">vs last month</span>
                          </div>
                        </div>

                        <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Collection</p>
                            <Wallet className="h-3 w-3 text-amber-500" />
                          </div>
                          <p className="text-lg font-bold text-slate-900">£10,200</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <span className="text-[9px] font-bold text-indigo-600">82%</span>
                            <span className="text-[9px] text-slate-400 font-medium">rate</span>
                          </div>
                        </div>

                        <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Return Rate</p>
                            <Activity className="h-3 w-3 text-rose-500" />
                          </div>
                          <p className="text-lg font-bold text-rose-600">2.4%</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <span className="text-[9px] font-bold text-rose-500">-0.5%</span>
                            <span className="text-[9px] text-slate-400 font-medium">improvement</span>
                          </div>
                        </div>

                        <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Commission</p>
                            <BarChart3 className="h-3 w-3 text-purple-500" />
                          </div>
                          <p className="text-lg font-bold text-indigo-600">£{commissionSummary.available.toLocaleString()}</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <Badge variant="secondary" className="text-[8px] px-1 py-0 bg-indigo-50 text-indigo-600 border-indigo-100">Available</Badge>
                          </div>
                        </div>
                      </div>

                      {/* Commission Summary Cards */}
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pending</p>
                            <Clock className="h-3.5 w-3.5 text-amber-400" />
                          </div>
                          <p className="text-xl font-black text-amber-600">£{commissionSummary.pending.toLocaleString()}</p>
                          <p className="text-[9px] text-slate-400 mt-1 font-medium">Awaiting customer payment</p>
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Matured</p>
                            <Activity className="h-3.5 w-3.5 text-blue-400" />
                          </div>
                          <p className="text-xl font-black text-blue-600">£{commissionSummary.matured.toLocaleString()}</p>
                          <p className="text-[9px] text-slate-400 mt-1 font-medium">Payment received, in delay</p>
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Released</p>
                            <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                          </div>
                          <p className="text-xl font-black text-emerald-600">£{commissionSummary.released.toLocaleString()}</p>
                          <p className="text-[9px] text-slate-400 mt-1 font-medium">Delay period passed</p>
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Paid</p>
                            <Wallet className="h-3.5 w-3.5 text-indigo-400" />
                          </div>
                          <p className="text-xl font-black text-indigo-600">£{commissionSummary.totalPaid.toLocaleString()}</p>
                          <p className="text-[9px] text-slate-400 mt-1 font-medium">Already disbursed</p>
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-lg shadow-indigo-50 hover:shadow-xl transition-all group bg-gradient-to-br from-white to-indigo-50/30">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Available</p>
                            <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                          </div>
                          <p className="text-xl font-black text-slate-900">£{commissionSummary.available.toLocaleString()}</p>
                          <p className="text-[9px] text-indigo-400 mt-1 font-bold">Payable Commission</p>
                        </div>
                      </div>

                      {/* Performance Graph */}
                      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Weekly Sales Trend</h3>
                            <p className="text-[9px] text-slate-400 font-medium">Revenue performance for the current month</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                              <span className="text-[9px] font-bold text-slate-500">Revenue</span>
                            </div>
                          </div>
                        </div>
                        <div className="h-[200px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={REP_PERFORMANCE_TREND}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                              <XAxis 
                                dataKey="week" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 600 }} 
                                dy={8}
                              />
                              <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 600 }} 
                                tickFormatter={(val) => `£${val/1000}k`}
                                dx={-8}
                              />
                              <Tooltip 
                                contentStyle={{ 
                                  borderRadius: '12px', 
                                  border: 'none', 
                                  boxShadow: '0 15px 20px -5px rgb(0 0 0 / 0.1)',
                                  padding: '8px'
                                }} 
                                itemStyle={{ fontSize: '11px', fontWeight: 'bold' }}
                                labelStyle={{ fontSize: '9px', color: '#64748b', marginBottom: '2px', fontWeight: 'bold' }}
                              />
                              <Line 
                                type="monotone" 
                                dataKey="sales" 
                                stroke="#6366f1" 
                                strokeWidth={3} 
                                dot={{ r: 3, fill: '#6366f1', strokeWidth: 1.5, stroke: '#fff' }} 
                                activeDot={{ r: 5, strokeWidth: 0 }} 
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Commission Ledger Section */}
                <div className="mt-8">
                  <Card padding="none" className="overflow-hidden border-slate-200 shadow-xl shadow-slate-200/40 bg-white">
                    <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
                      <div>
                        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                          <Wallet className="h-5 w-5 text-indigo-600" />
                          Commission Ledger
                        </h3>
                        <p className="text-xs text-slate-400 font-medium mt-1">Detailed transaction history and running balance for {activeRepData.name}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-sm">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Delay:</span>
                          <select 
                            className="bg-transparent text-xs font-bold text-indigo-600 outline-none cursor-pointer"
                            value={commissionDelayDays}
                            onChange={(e) => setCommissionDelayDays(Number(e.target.value))}
                          >
                            <option value={0}>0 Days</option>
                            <option value={30}>30 Days</option>
                            <option value={60}>60 Days</option>
                            <option value={90}>90 Days</option>
                          </select>
                        </div>
                        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-sm">
                          <Filter className="h-3.5 w-3.5 text-slate-400" />
                          <select 
                            className="bg-transparent text-xs font-bold text-slate-600 outline-none cursor-pointer"
                            value={ledgerFilters.status}
                            onChange={(e) => setLedgerFilters({...ledgerFilters, status: e.target.value})}
                          >
                            <option>All Status</option>
                            <option>Pending</option>
                            <option>Active</option>
                            <option>Paid</option>
                          </select>
                        </div>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                          <input 
                            type="text"
                            placeholder="Search Order ID..."
                            className="bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-1.5 text-xs font-bold text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all w-48 shadow-sm"
                            value={ledgerFilters.orderId}
                            onChange={(e) => setLedgerFilters({...ledgerFilters, orderId: e.target.value})}
                          />
                        </div>
                        <Button variant="secondary" size="sm" icon={<FileDown className="h-3.5 w-3.5" />} className="shadow-sm">Export Ledger</Button>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <Table className="min-w-full divide-y divide-slate-100">
                        <THead className="bg-slate-50/50">
                          <TR>
                            <TH className="text-[10px] uppercase tracking-widest py-4 pl-6 font-bold text-slate-500">Date</TH>
                            <TH className="text-[10px] uppercase tracking-widest py-4 font-bold text-slate-500">Order ID</TH>
                            <TH className="text-[10px] uppercase tracking-widest py-4 font-bold text-slate-500">Customer</TH>
                            <TH className="text-[10px] uppercase tracking-widest py-4 text-right font-bold text-slate-500">Sale Amount</TH>
                            <TH className="text-[10px] uppercase tracking-widest py-4 text-center font-bold text-slate-500">Rate</TH>
                            <TH className="text-[10px] uppercase tracking-widest py-4 text-right font-bold text-slate-500">Comm. Amount</TH>
                            <TH className="text-[10px] uppercase tracking-widest py-4 text-right font-bold text-slate-500">Recv. Date</TH>
                            <TH className="text-[10px] uppercase tracking-widest py-4 text-right font-bold text-slate-500">Matured</TH>
                            <TH className="text-[10px] uppercase tracking-widest py-4 text-right font-bold text-slate-500">Released</TH>
                            <TH className="text-[10px] uppercase tracking-widest py-4 text-center font-bold text-slate-500">Status</TH>
                            <TH className="text-[10px] uppercase tracking-widest py-4 text-right font-bold text-slate-500">Comm. Paid</TH>
                            <TH className="text-[10px] uppercase tracking-widest py-4 text-right pr-6 font-bold text-slate-900 bg-slate-50/80">Balance</TH>
                          </TR>
                        </THead>
                        <TBody className="bg-white divide-y divide-slate-50">
                          {filteredLedger.length > 0 ? (
                            filteredLedger.map((entry, idx) => (
                              <TR key={idx} className="hover:bg-slate-50/50 transition-colors group">
                                <TD className="text-xs font-medium text-slate-500 py-4 pl-6">{entry.date}</TD>
                                <TD className="text-xs font-bold text-slate-900 py-4">{entry.orderId}</TD>
                                <TD className="text-xs font-medium text-slate-600 py-4">{entry.customerName}</TD>
                                <TD className="text-xs font-bold text-slate-900 py-4 text-right">£{entry.saleAmount.toLocaleString()}</TD>
                                <TD className="text-xs font-medium text-slate-500 py-4 text-center">{entry.commissionPercentage}%</TD>
                                <TD className="text-xs font-bold text-indigo-600 py-4 text-right">£{entry.commissionAmount.toLocaleString()}</TD>
                                <TD className="text-xs font-medium text-slate-500 py-4 text-right">{entry.paymentReceivedDate || '-'}</TD>
                                <TD className="text-xs font-medium text-slate-500 py-4 text-right">{entry.maturedDate || '-'}</TD>
                                <TD className="text-xs font-medium text-slate-500 py-4 text-right">{entry.releaseDate || '-'}</TD>
                                <TD className="py-4 text-center">
                                  <Badge 
                                    variant="secondary" 
                                    className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold border ${
                                      entry.status === 'Paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                      entry.status === 'Released' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                                      entry.status === 'Matured' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                      'bg-amber-50 text-amber-600 border-amber-100'
                                    }`}
                                  >
                                    {entry.status}
                                  </Badge>
                                </TD>
                                <TD className="text-xs font-bold text-slate-900 py-4 text-right">£{entry.commissionPaid.toLocaleString()}</TD>
                                <TD className="text-xs font-bold text-slate-900 py-4 text-right pr-6 bg-slate-50/30">£{entry.balance.toLocaleString()}</TD>
                              </TR>
                            ))
                          ) : (
                            <TR>
                              <TD colSpan={12} className="py-20 text-center text-slate-400 text-sm italic">No ledger entries found for this representative.</TD>
                            </TR>
                          )}
                        </TBody>
                      </Table>
                    </div>
                  </Card>
                </div>

                <div className="grid grid-cols-12 gap-8 mt-8">
                  {/* Activity Metrics */}
                  <div className="col-span-12 lg:col-span-4 space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Activity Metrics</h3>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                            <MapPin className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900">Check-ins This Week</p>
                            <p className="text-[10px] text-slate-500 font-medium">85% of target visits</p>
                          </div>
                        </div>
                        <span className="text-lg font-bold text-slate-900">42</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                            <ShoppingCart className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900">Orders Created</p>
                            <p className="text-[10px] text-slate-500 font-medium">£8,420 total value</p>
                          </div>
                        </div>
                        <span className="text-lg font-bold text-slate-900">18</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                            <Wallet className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900">Collections Made</p>
                            <p className="text-[10px] text-slate-500 font-medium">12 customers paid</p>
                          </div>
                        </div>
                        <span className="text-lg font-bold text-slate-900">£4,250</span>
                      </div>
                    </div>
                  </div>

                  {/* Customer Table */}
                  <Card padding="none" className="col-span-12 lg:col-span-8 flex flex-col border-slate-100">
                    <CardHeader title="Assigned Customers" description="Portfolio management for this representative" className="p-6 border-b border-slate-100 mb-0" />
                    <div className="overflow-x-auto">
                      <Table>
                        <THead>
                          <TR className="hover:bg-transparent">
                            <TH className="text-[10px] uppercase tracking-wider pl-6">Customer</TH>
                            <TH className="text-[10px] uppercase tracking-wider">Balance</TH>
                            <TH className="text-[10px] uppercase tracking-wider">Orders</TH>
                            <TH align="right" className="text-[10px] uppercase tracking-wider pr-6">Last Order</TH>
                          </TR>
                        </THead>
                        <TBody>
                          {REP_CUSTOMERS_DATA.map((customer, idx) => (
                            <TR key={idx}>
                              <TD className="pl-6 py-4 text-xs font-bold text-slate-900">{customer.name}</TD>
                              <TD className="py-4 text-xs font-bold text-rose-600">{customer.balance}</TD>
                              <TD className="py-4 text-xs font-medium text-slate-500">{customer.orders}</TD>
                              <TD align="right" className="pr-6 py-4 text-xs text-slate-400 font-medium">{customer.lastOrder}</TD>
                            </TR>
                          ))}
                        </TBody>
                      </Table>
                    </div>
                  </Card>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <CreateSalesRepModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSave={(newRep) => {
          setReps([...reps, newRep]);
          setSelectedRep(newRep.id);
        }}
        existingReps={reps}
      />
    </div>
  );
};


const FinancePanel: React.FC = () => {
  const {
    GROUPED_KPI_DATA, PAYMENT_STATUS_DATA, CUSTOMER_BALANCE_RANKING,
    REVENUE_COLLECTIONS_DATA, CUSTOMER_LEDGER_PREVIEW_DATA,
  } = useHistoricData();
  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Finance & Accounting</h1>
          <p className="text-slate-500 font-medium">Comprehensive financial oversight and ledger management</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="primary" icon={<FileDown className="h-4 w-4" />}>Generate Report</Button>
        </div>
      </div>
      <ViewModeToggle />

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {GROUPED_KPI_DATA.finance.items.map((kpi, idx) => (
          <AdminKpiCard 
            key={idx}
            label={kpi.label}
            value={kpi.value}
            trend={kpi.trend}
            color="amber"
            trendColor={kpi.trendColor}
          />
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8">
        <Card padding="none" className="col-span-12 lg:col-span-4 flex flex-col">
          <CardHeader title="Payment Status" description="Distribution of receivables" className="p-6 border-b border-slate-100 mb-0" />
          <div className="p-6 h-[350px] flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={PAYMENT_STATUS_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {PAYMENT_STATUS_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-4">
              {PAYMENT_STATUS_DATA.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-medium text-slate-600">{item.name}: {item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card padding="none" className="col-span-12 lg:col-span-8 flex flex-col">
          <CardHeader title="Customer Balance Ranking" description="Top accounts by outstanding balance" className="p-6 border-b border-slate-100 mb-0" />
          <div className="overflow-x-auto flex-1">
            <Table>
              <THead>
                <TR className="hover:bg-transparent">
                  <TH className="text-[10px] uppercase tracking-wider pl-6">Customer</TH>
                  <TH className="text-[10px] uppercase tracking-wider">Outstanding</TH>
                  <TH className="text-[10px] uppercase tracking-wider">Overdue</TH>
                  <TH align="right" className="text-[10px] uppercase tracking-wider pr-6">Status</TH>
                </TR>
              </THead>
              <TBody>
                {CUSTOMER_BALANCE_RANKING.map((item) => (
                  <TR key={item.name}>
                    <TD className="pl-6 py-4 text-xs font-bold text-slate-900">{item.name}</TD>
                    <TD className="py-4 text-xs font-bold text-slate-900">{item.outstanding}</TD>
                    <TD className="py-4 text-xs font-bold text-rose-600">{item.overdue}</TD>
                    <TD align="right" className="pr-6 py-4">
                      <Badge variant={item.status === 'critical' ? 'danger' : item.status === 'warning' ? 'warning' : 'success'} className="text-[9px]">
                        {item.status}
                      </Badge>
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <Card padding="none" className="col-span-12 lg:col-span-5 flex flex-col">
          <CardHeader title="Payment Reminders" description="Pending actions for finance team" className="p-6 border-b border-slate-100 mb-0" />
          <div className="p-6 space-y-4">
            {OPERATIONAL_ALERTS.filter(a => a.type === 'critical' || a.type === 'warning').map((alert, i) => (
              <div key={i} className={`p-4 rounded-xl border border-slate-100 hover:border-indigo-100 transition-all flex items-start justify-between group`}>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${alert.type === 'critical' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                    <p className="text-xs font-bold text-slate-900">{alert.title}</p>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium pl-4">{alert.desc}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`text-xs font-bold ${alert.type === 'critical' ? 'text-rose-600' : 'text-amber-600'}`}>{alert.amount}</span>
                  <button className="text-[9px] font-bold text-indigo-600 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">Send Reminder</button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card padding="none" className="col-span-12 lg:col-span-7 flex flex-col">
          <CardHeader title="Customer Ledger Quick Access" description="Recent ledger entries" className="p-6 border-b border-slate-100 mb-0" />
          <div className="overflow-x-auto flex-1">
            <Table>
              <THead>
                <TR className="hover:bg-transparent">
                  <TH className="text-[10px] uppercase tracking-wider pl-6">Date</TH>
                  <TH className="text-[10px] uppercase tracking-wider">Customer</TH>
                  <TH className="text-[10px] uppercase tracking-wider">Reference</TH>
                  <TH className="text-[10px] uppercase tracking-wider">Type</TH>
                  <TH className="text-[10px] uppercase tracking-wider">Amount</TH>
                  <TH align="right" className="text-[10px] uppercase tracking-wider pr-6">Balance</TH>
                </TR>
              </THead>
              <TBody>
                {[
                  { date: '16 Mar', customer: 'Global Logistics', ref: 'INV-8821', type: 'Invoice', amount: '£4,250', balance: '£12,400' },
                  { date: '16 Mar', customer: 'Tech Solutions', ref: 'PAY-4412', type: 'Payment', amount: '£1,840', balance: '£0' },
                  { date: '15 Mar', customer: 'Prime Retail', ref: 'INV-8819', type: 'Invoice', amount: '£8,900', balance: '£8,900' },
                  { date: '15 Mar', customer: 'Swift Delivery', ref: 'CRN-1102', type: 'Credit', amount: '£240', balance: '£1,120' },
                  { date: '14 Mar', customer: 'Elite Services', ref: 'INV-8815', type: 'Invoice', amount: '£3,150', balance: '£5,600' },
                ].map((entry, i) => (
                  <TR key={i}>
                    <TD className="pl-6 py-4 text-xs text-slate-400 font-medium">{entry.date}</TD>
                    <TD className="py-4 text-xs font-bold text-slate-900">{entry.customer}</TD>
                    <TD className="py-4 text-xs font-mono text-slate-500">{entry.ref}</TD>
                    <TD className="py-4">
                      <Badge variant="neutral" className="text-[9px]">{entry.type}</Badge>
                    </TD>
                    <TD className="py-4 text-xs font-bold text-slate-900">{entry.amount}</TD>
                    <TD align="right" className="pr-6 py-4 text-xs font-bold text-slate-900">{entry.balance}</TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
};

const InventoryPanel: React.FC = () => {
  const {
    GROUPED_KPI_DATA, LOW_STOCK_PRODUCTS_DATA, TOP_VALUE_PRODUCTS_DATA,
    STOCK_MOVEMENT_CHART_DATA, BRAND_SKU_MOVEMENT_DATA, TOP_BRAND_BREAKDOWN_DATA,
    WORST_PERFORMING_SKUS,
  } = useHistoricData();
  const { products } = useProducts();
  const sortedInventoryData = useMemo(() => {
    const grouped = products.reduce((acc: any, p) => {
      if (!acc[p.name]) {
        acc[p.name] = { product: p.name, total: 0, required: 15000, flavours: [] };
      }
      acc[p.name].total += p.stock;
      acc[p.name].flavours.push({ 
        name: p.flavour || 'Standard', 
        stock: p.stock, 
        health: p.stock === 0 ? 'red' : p.stock <= 50 ? 'amber' : 'green' 
      });
      return acc;
    }, {});
    return Object.values(grouped).sort((a: any, b: any) => b.total - a.total);
  }, [products]);

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Inventory Management</h1>
          <p className="text-slate-500 font-medium">Stock level monitoring and warehouse logistics</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="primary" icon={<RefreshCw className="h-4 w-4" />}>Stock Audit</Button>
        </div>
      </div>
      <ViewModeToggle />

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {GROUPED_KPI_DATA.inventory.items.map((kpi, idx) => (
          <AdminKpiCard 
            key={idx}
            label={kpi.label}
            value={kpi.value}
            trend={kpi.trend}
            color="emerald"
            trendColor={kpi.trendColor}
          />
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8">
        <Card padding="none" className="col-span-12 flex flex-col">
          <CardHeader title="Inventory Stock Overview" description="Stock levels per product line" className="p-6 border-b border-slate-100 mb-0" />
          <div className="py-6 h-[500px] pl-[1px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                layout="vertical" 
                data={sortedInventoryData} 
                margin={{ top: 10, right: 80, left: 0, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="product" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }} width={200} />
                <Tooltip cursor={{ fill: '#f8fafc' }} content={<InventoryHoverTooltip />} />
                <Bar 
                  dataKey="total" 
                  fill="#22c55e" 
                  radius={[0, 4, 4, 0]} 
                  barSize={20}
                >
                  {sortedInventoryData.map((entry, index) => {
                    const ratio = entry.total / entry.required;
                    let fill = '#10b981'; // emerald-500
                    if (ratio <= 0.15) fill = '#ef4444'; // rose-500
                    else if (ratio <= 0.35) fill = '#f59e0b'; // amber-500
                    return <Cell key={`cell-${index}`} fill={fill} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <Card padding="none" className="col-span-12 lg:col-span-6 flex flex-col">
          <CardHeader title="Low Stock Products" description="SKUs nearing depletion" className="p-6 border-b border-slate-100 mb-0" />
          <div className="p-6 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={LOW_STOCK_PRODUCTS_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="stock" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card padding="none" className="col-span-12 lg:col-span-6 flex flex-col">
          <CardHeader title="Top Inventory Value Products" description="Highest value stock items" className="p-6 border-b border-slate-100 mb-0" />
          <div className="p-6 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={TOP_VALUE_PRODUCTS_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} tickFormatter={(val) => `£${val/1000}k`} />
                <Tooltip />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card padding="none" className="col-span-12 overflow-hidden flex flex-col">
        <CardHeader title="Product Inventory" description="Detailed stock status per SKU" className="p-6 border-b border-slate-100 mb-0" />
        <div className="overflow-x-auto">
          <Table>
            <THead>
              <TR className="hover:bg-transparent">
                <TH className="text-[10px] uppercase tracking-wider pl-6">Product</TH>
                <TH className="text-[10px] uppercase tracking-wider">Category</TH>
                <TH className="text-[10px] uppercase tracking-wider">Stock Level</TH>
                <TH className="text-[10px] uppercase tracking-wider">Required</TH>
                <TH align="right" className="text-[10px] uppercase tracking-wider pr-6">Status</TH>
              </TR>
            </THead>
            <TBody>
              {sortedInventoryData.map((item: any, i) => {
                const ratio = item.total / item.required;
                let status = 'Healthy';
                let variant: 'success' | 'warning' | 'danger' = 'success';
                if (ratio <= 0.15) { status = 'Critical'; variant = 'danger'; }
                else if (ratio <= 0.35) { status = 'Low'; variant = 'warning'; }

                return (
                  <TR key={i}>
                    <TD className="pl-6 py-4 text-sm font-medium text-slate-700">{item.product}</TD>
                    <TD className="py-4 text-xs text-slate-400 font-medium">Category</TD>
                    <TD className="py-4 text-sm font-bold text-slate-900 font-mono">{item.total}</TD>
                    <TD className="py-4 text-sm font-medium text-slate-400 font-mono">{item.required}</TD>
                    <TD align="right" className="pr-6 py-4">
                      <Badge variant={variant} className="text-[9px]">{status}</Badge>
                    </TD>
                  </TR>
                );
              })}
            </TBody>
          </Table>
        </div>
      </Card>

      {/* Fast vs Slow Moving SKUs by Brand */}
      <div className="grid grid-cols-12 gap-8">
        <Card padding="none" className="col-span-12 flex flex-col">
          <CardHeader title="Fast vs Slow Moving SKUs by Brand" description="Stock movement analysis across brands" className="p-6 border-b border-slate-100 mb-0" action={
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />Fast</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-orange-400" />Slow</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-red-500" />Dead</span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-200">Last 30 Days</span>
            </div>
          } />
          <div className="p-6 h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={BRAND_SKU_MOVEMENT_DATA} barSize={48}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="brand" tick={{ fontSize: 11, fontWeight: 600, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}K`} />
                <Tooltip formatter={(value: number) => value.toLocaleString()} />
                <Bar dataKey="fast" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} name="Fast" />
                <Bar dataKey="slow" stackId="a" fill="#fb923c" radius={[0, 0, 0, 0]} name="Slow" />
                <Bar dataKey="dead" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} name="Dead" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Breakdown + AI Insights */}
      <div className="grid grid-cols-12 gap-8">
        {/* Top Brand Breakdown */}
        <Card padding="none" className="col-span-12 lg:col-span-7 flex flex-col">
          <CardHeader
            title={`${BRAND_SKU_MOVEMENT_DATA[0]?.brand || 'Top Brand'} Breakdown`}
            description="Sub-product stock movement analysis"
            className="p-6 border-b border-slate-100 mb-0"
          />
          <div className="p-6 h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={TOP_BRAND_BREAKDOWN_DATA} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="product" tick={{ fontSize: 10, fontWeight: 600, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}K`} />
                <Tooltip formatter={(value: number) => value.toLocaleString()} />
                <Bar dataKey="fast" stackId="a" fill="#10b981" name="Fast" />
                <Bar dataKey="slow" stackId="a" fill="#fb923c" name="Slow" />
                <Bar dataKey="dead" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} name="Dead" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* AI Stock Insights */}
        <Card padding="none" className="col-span-12 lg:col-span-5 flex flex-col overflow-hidden">
          <div className="bg-gradient-to-r from-slate-800 to-indigo-900 px-6 py-5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">AI Stock Insights</h3>
            </div>
            <p className="text-xs text-slate-300 mt-1">Automated recommendations based on stock velocity</p>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-center space-y-5">
            {AI_STOCK_INSIGHTS.map((insight, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-slate-700 leading-relaxed" dangerouslySetInnerHTML={{
                  __html: insight.text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900">$1</strong>')
                }} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Worst Performing SKUs */}
      <Card padding="none" className="overflow-hidden flex flex-col">
        <CardHeader title="Worst Performing SKUs" description="Products requiring attention based on sales velocity" className="p-6 border-b border-slate-100 mb-0" />
        <div className="overflow-x-auto">
          <Table>
            <THead>
              <TR className="hover:bg-transparent">
                <TH className="text-[10px] uppercase tracking-wider pl-6">SKU/Barcode</TH>
                <TH className="text-[10px] uppercase tracking-wider">Product Name</TH>
                <TH className="text-[10px] uppercase tracking-wider">Brand</TH>
                <TH className="text-[10px] uppercase tracking-wider">Type</TH>
                <TH className="text-[10px] uppercase tracking-wider" align="center">Sales</TH>
                <TH className="text-[10px] uppercase tracking-wider">Stock Level</TH>
                <TH className="text-[10px] uppercase tracking-wider" align="center">Stock</TH>
                <TH className="text-[10px] uppercase tracking-wider pr-6" align="right">Status</TH>
              </TR>
            </THead>
            <TBody>
              {WORST_PERFORMING_SKUS.map((item, i) => (
                <TR key={i}>
                  <TD className="pl-6 py-4 text-xs font-mono font-medium text-slate-500">{item.sku}</TD>
                  <TD className="py-4 text-sm font-medium text-slate-700">{item.product}</TD>
                  <TD className="py-4 text-xs font-medium text-slate-400">{item.brand}</TD>
                  <TD className="py-4 text-xs font-medium text-slate-400">{item.type}</TD>
                  <TD className="py-4 text-sm font-bold text-slate-900 font-mono" align="center">{item.sales}</TD>
                  <TD className="py-4 w-40">
                    <div className="flex h-2 rounded-full overflow-hidden bg-slate-100">
                      <div className="bg-emerald-500" style={{ width: `${item.stockGreen}%` }} />
                      <div className="bg-orange-400" style={{ width: `${item.stockOrange}%` }} />
                      <div className="bg-red-500" style={{ width: `${item.stockRed}%` }} />
                    </div>
                  </TD>
                  <TD className="py-4 text-sm font-bold text-slate-900 font-mono" align="center">{item.stock}</TD>
                  <TD className="py-4 pr-6" align="right">
                    <Badge variant={item.status === 'Dead' ? 'danger' : item.status === 'At Risk' ? 'warning' : 'neutral'} className="text-[9px]">
                      {item.status}
                    </Badge>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { activeRole, setActiveRole } = useDashboard();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      if (user.roleName === 'Sales') setActiveRole('sales');
      else if (user.roleName === 'Finance') setActiveRole('finance');
      else if (user.roleName === 'Inventory') setActiveRole('inventory');
      else if (user.roleName === 'Supplier') setActiveRole('supplier');
      else setActiveRole('admin');
    }
  }, [user, setActiveRole]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeRole}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {activeRole === 'admin' && <AdminPanel />}
        {activeRole === 'sales' && <SalesPanel />}
        {activeRole === 'finance' && <FinancePanel />}
        {activeRole === 'inventory' && <InventoryPanel />}
        {activeRole === 'supplier' && <SupplierPanel />}
      </motion.div>
    </AnimatePresence>
  );
};

export default Dashboard;

