import React, { useState, useMemo } from 'react';
import {
  Calendar, ChevronDown, Download, Brain, Plus, Truck,
  Activity, Zap, ShoppingCart, Warehouse,
  AlertTriangle, CheckCircle2, Clock, Package,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { useSupplier } from '../../context/SupplierContext';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { ORDER_STATUS_CONFIG } from '../../constants/supplierStatus';
import { INVENTORY_STOCK_DATA, TOP_PRODUCTS, REVENUE_FORECAST_DATA } from '../../mock/supplierDashboard';
import DashboardKPIs from '../../components/supplier/dashboard/DashboardKPIs';
import { InventoryHoverTooltip } from '../../components/supplier/SupplierComponents';
import TopProductsCard from '../../components/supplier/dashboard/TopProductsCard';
import DemandForecastCard from '../../components/supplier/dashboard/DemandForecastCard';
import InventoryInsightsCard from '../../components/supplier/dashboard/InventoryInsightsCard';
import {
  InventoryRiskForecastWidget, ProductPerformanceInsightsWidget, CommissionBreakdownWidget,
} from '../../components/supplier/dashboard/DashboardWidgets';

// ── Date helper ──
const isDateInRange = (dateStr: string, range: string, cs?: string, ce?: string) => {
  const now = new Date('2026-04-02'); now.setHours(0,0,0,0);
  const d = new Date(dateStr); d.setHours(0,0,0,0);
  switch (range) {
    case 'Today': return d.getTime() === now.getTime();
    case 'This Week': { const s = new Date(now); s.setDate(now.getDate()-now.getDay()+(now.getDay()===0?-6:1)); s.setHours(0,0,0,0); return d>=s&&d<=now; }
    case 'This Month': return d>=new Date(now.getFullYear(),now.getMonth(),1)&&d<=now;
    case 'Last 30 Days': { const a=new Date(now); a.setDate(now.getDate()-30); return d>=a&&d<=now; }
    case 'Last 90 Days': { const a=new Date(now); a.setDate(now.getDate()-90); return d>=a&&d<=now; }
    case 'Custom Date Range': return (!cs||!ce)?true:d>=new Date(cs)&&d<=new Date(ce);
    default: return true;
  }
};

const SupplierDashboard: React.FC = () => {
  const { orders, products, inventory, promotions } = useSupplier();
  const [dateFilter, setDateFilter] = useState('This Month');
  const [isCustomDateModalOpen, setIsCustomDateModalOpen] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [appliedRange, setAppliedRange] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const filteredOrders = useMemo(() => orders.filter(o => isDateInRange(o.date, dateFilter, customStartDate, customEndDate)), [orders, dateFilter, customStartDate, customEndDate]);

  // ── Stats ──
  const stats = useMemo(() => {
    const revenue = filteredOrders.reduce((s,o)=>s+o.amount,0);
    const count = filteredOrders.length;
    const units = filteredOrders.reduce((s,o)=>s+o.quantity,0);
    const avg = count>0?Math.round(revenue/count):0;
    const commission = filteredOrders.reduce((s,o)=>s+o.commission,0);
    const net = filteredOrders.reduce((s,o)=>s+o.netEarnings,0);
    const activeSKUs = products.filter(p=>p.status==='Active').length;
    const stockValue = products.reduce((s,p)=>s+(p.stock||0)*p.price,0);
    const lowStock = products.filter(p=>(p.stock||0)>0&&(p.stock||0)<100).length;
    const outOfStock = products.filter(p=>(p.stock||0)===0).length;
    const activePromos = promotions.filter(p=>p.status==='Active').length;
    const promoRevenue = promotions.filter(p=>p.status!=='Scheduled').reduce((s,p)=>s+p.revenue,0);
    const sc = (statuses: string[]) => filteredOrders.filter(o=>statuses.includes(o.status)).length;
    return { revenue, count, units, avg, commission, net, activeSKUs, stockValue, lowStock, outOfStock, activePromos, promoRevenue, sc };
  }, [filteredOrders, products, promotions]);

  const chartData = useMemo(() => {
    if (dateFilter==='Today') return [{label:'8am',value:1200},{label:'10am',value:2400},{label:'12pm',value:3800},{label:'2pm',value:2100},{label:'4pm',value:4500},{label:'6pm',value:3200}];
    if (dateFilter==='This Week') return [{label:'Mon',value:12000},{label:'Tue',value:15000},{label:'Wed',value:18000},{label:'Thu',value:stats.revenue}];
    if (dateFilter==='Last 90 Days') return [{label:'Jan',value:185000},{label:'Feb',value:210000},{label:'Mar',value:stats.revenue}];
    return [{label:'Week 1',value:45000},{label:'Week 2',value:52000},{label:'Week 3',value:48000},{label:'Week 4',value:stats.revenue}];
  }, [dateFilter, stats.revenue]);

  const topProducts = useMemo(() => {
    const map: Record<string,{units:number;revenue:number}> = {};
    filteredOrders.forEach(o=>{if(!map[o.product])map[o.product]={units:0,revenue:0};map[o.product].units+=o.quantity;map[o.product].revenue+=o.amount;});
    return Object.entries(map).map(([name,data])=>{
      const s=TOP_PRODUCTS.find(p=>p.name.includes(name)||name.includes(p.name));
      return {name,...data,flavours:s?.flavours||[],total:s?.units||data.units,category:s?.category,boxesSold:s?.boxesSold,trend:s?.trend};
    }).sort((a,b)=>b.revenue-a.revenue).slice(0,5).map((p,i)=>({rank:i+1,...p}));
  }, [filteredOrders]);

  const pendingCount = stats.sc(['CREATED','CONFIRMED']);
  const processingCount = stats.sc(['PICKING','PACKED']);
  const shippedCount = stats.sc(['SHIPPED','IN_TRANSIT']);
  const lowStockInv = inventory.filter(i=>i.available>0&&i.available<20).length;

  const demandForecast = useMemo(() => {
    const v=Math.max(filteredOrders.length,4);
    return [{day:'W1',current:Math.round(v*0.8),predicted:Math.round(v*0.9)},{day:'W2',current:Math.round(v*0.9),predicted:Math.round(v*1.1)},{day:'W3',current:v,predicted:Math.round(v*1.3)},{day:'W4',current:Math.round(v*1.1),predicted:Math.round(v*1.5)}];
  }, [filteredOrders]);
  const customerBehavior = useMemo(() => {
    const r=filteredOrders.filter(o=>o.customerType==='REPEAT').length;
    const n=filteredOrders.filter(o=>o.customerType==='NEW').length;
    const t=r+n;
    return [{name:'Repeat Purchase',value:t>0?Math.round((r/t)*100):42},{name:'New Customers',value:t>0?Math.round((n/t)*100):58},{name:'AOV Growth',value:15}];
  }, [filteredOrders]);
  const inventoryCoverage = useMemo(() => products.slice(0,3).map(item=>{
    const daily=Math.floor(Math.random()*50)+20; const stock=item.stock||0;
    return {name:item.name,stock,daily,coverage:daily>0?Math.floor(stock/daily):0};
  }), [products]);

  const earningsData = useMemo(() => ({
    netEarnings: `£${(stats.net||42840).toLocaleString()}`,
    commissionDeducted: `£${(stats.commission||5140).toLocaleString()}`,
  }), [stats]);

  const handleDateFilterChange = (value: string) => {
    if (value==='Custom Date Range'){setIsCustomDateModalOpen(true);return;}
    setDateFilter(value);setAppliedRange(null);setIsLoading(true);setTimeout(()=>setIsLoading(false),400);
  };
  const applyCustomDateRange = () => {
    if(!customStartDate||!customEndDate)return;
    setAppliedRange(`${customStartDate} to ${customEndDate}`);setDateFilter('Custom Date Range');setIsCustomDateModalOpen(false);setIsLoading(true);setTimeout(()=>setIsLoading(false),400);
  };

  return (
    <div className={`space-y-5 transition-opacity duration-300 ${isLoading?'opacity-40 pointer-events-none':''}`}>

      {/* ═══ HEADER ═══ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-sm text-slate-500">{appliedRange||dateFilter}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            <select value={dateFilter} onChange={e=>handleDateFilterChange(e.target.value)}
              className="pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer">
              <option>Today</option><option>This Week</option><option>This Month</option><option>Last 30 Days</option><option>Last 90 Days</option><option>Custom Date Range</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          </div>
          <Link to="/supplier/products"><Button variant="secondary" size="sm" icon={<Plus className="h-3.5 w-3.5" />}>Add Product</Button></Link>
          <Link to="/supplier/inbound"><Button variant="secondary" size="sm" icon={<Truck className="h-3.5 w-3.5" />}>Shipment</Button></Link>
          <Button variant="primary" size="sm" icon={<Download className="h-3.5 w-3.5" />}>Export</Button>
        </div>
      </div>

      {/* ═══ KPIs ═══ */}
      <DashboardKPIs
        revenue={`£${stats.revenue.toLocaleString(undefined,{maximumFractionDigits:0})}`}
        orders={stats.count.toString()}
        unitsSold={stats.units.toLocaleString()}
        pendingPayout="£12,450"
        activeSKUs={stats.activeSKUs.toString()}
        stockValue={`£${(stats.stockValue/1000).toFixed(1)}k`}
        growth={12.4}
      />

      {/* ═══ CHART + ORDERS ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Sales Chart */}
        <Card padding="none" className="lg:col-span-8 p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Sales Trend</h3>
              <p className="text-xs text-slate-400">Revenue over selected period</p>
            </div>
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{top:5,right:10,left:-15,bottom:0}}>
                <defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6366f1" stopOpacity={0.15}/><stop offset="100%" stopColor="#6366f1" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fill:'#94a3b8',fontSize:11,fontWeight:600}} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{fill:'#94a3b8',fontSize:11,fontWeight:600}} tickFormatter={v=>v>=1000?`£${(v/1000).toFixed(0)}k`:`£${v}`} />
                <Tooltip contentStyle={{borderRadius:12,border:'none',boxShadow:'0 10px 25px -5px rgb(0 0 0/0.1)'}} formatter={(v:number)=>[`£${v.toLocaleString()}`,'Revenue']} />
                <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2.5} fill="url(#sg)" dot={{r:3,fill:'#6366f1',strokeWidth:2,stroke:'#fff'}} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Orders Panel */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          <Card padding="none" className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5"><ShoppingCart className="h-4 w-4 text-indigo-500" />Orders</h3>
              <Link to="/supplier/orders" className="text-[11px] font-bold text-indigo-600 hover:underline">View All</Link>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[{label:'Pending',value:pendingCount,color:'amber'},{label:'Processing',value:processingCount,color:'blue'},{label:'Shipped',value:shippedCount,color:'indigo'}].map(s=>(
                <div key={s.label} className={`text-center p-2.5 rounded-xl bg-${s.color}-50`}>
                  <p className={`text-lg font-black text-${s.color}-600`}>{s.value}</p>
                  <p className="text-[11px] font-semibold text-slate-500 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card padding="none" className="p-4 flex-1">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Recent Orders</h3>
            <div className="space-y-1">
              {(filteredOrders.length>0?filteredOrders.slice(0,5):orders.slice(0,5)).map(o=>(
                <div key={o.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-800 truncate">{o.buyer}</p>
                    <p className="text-xs text-slate-400 truncate">{o.id} · {o.product}</p>
                  </div>
                  <div className="text-right ml-3 flex-shrink-0">
                    <p className="text-sm font-bold text-emerald-600">£{o.netEarnings.toFixed(2)}</p>
                    <Badge variant={ORDER_STATUS_CONFIG[o.status]?.variant||'neutral'} className="text-[9px] font-bold mt-0.5">
                      {ORDER_STATUS_CONFIG[o.status]?.label||o.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* ═══ INVENTORY + OPS ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Inventory bars */}
        <Card padding="none" className="lg:col-span-4 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5"><Warehouse className="h-4 w-4 text-indigo-500" />Inventory</h3>
            <Link to="/supplier/inventory" className="text-[11px] font-bold text-indigo-600 hover:underline">Manage</Link>
          </div>
          <div className="space-y-3">
            {INVENTORY_STOCK_DATA.slice(0,5).map(item=>{
              const ratio=item.total/(item.required||15000);
              const barColor=ratio<=0.15?'bg-rose-500':ratio<=0.35?'bg-amber-500':'bg-emerald-500';
              return (
                <div key={item.product} className="group/bar relative">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-slate-700 truncate max-w-[160px]">{item.product}</span>
                    <span className="text-xs font-bold text-slate-400 tabular-nums">{item.total.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div initial={{width:0}} animate={{width:`${Math.min(100,ratio*100)}%`}} transition={{duration:0.8}} className={`h-full rounded-full ${barColor}`} />
                  </div>
                  <div className="absolute left-0 bottom-full mb-1 hidden group-hover/bar:block z-50"><InventoryHoverTooltip data={item} /></div>
                </div>
              );
            })}
          </div>
          <div className="flex gap-3 mt-3 pt-2 border-t border-slate-50">
            {[{l:'Healthy',c:'bg-emerald-500'},{l:'Low',c:'bg-amber-500'},{l:'Critical',c:'bg-rose-500'}].map(x=>(
              <div key={x.l} className="flex items-center gap-1"><div className={`h-2 w-2 rounded-full ${x.c}`}/><span className="text-[10px] font-bold text-slate-400 uppercase">{x.l}</span></div>
            ))}
          </div>
        </Card>

        {/* Earnings */}
        <Card padding="none" className="lg:col-span-3 p-4">
          <h3 className="text-sm font-bold text-slate-900 mb-3">Earnings & Payouts</h3>
          <div className="space-y-3">
            <div className="p-3 bg-emerald-50 rounded-xl">
              <p className="text-xs text-emerald-700 font-semibold">Net Earnings</p>
              <p className="text-xl font-black text-emerald-600">£{stats.net.toLocaleString(undefined,{maximumFractionDigits:0})}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 bg-slate-50 rounded-xl"><p className="text-[11px] text-slate-500 font-semibold">Commission</p><p className="text-sm font-bold text-rose-500">£{stats.commission.toLocaleString(undefined,{maximumFractionDigits:0})}</p></div>
              <div className="p-2.5 bg-slate-50 rounded-xl"><p className="text-[11px] text-slate-500 font-semibold">Payout Date</p><p className="text-sm font-bold text-slate-900">Apr 15</p></div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 bg-slate-50 rounded-xl"><p className="text-[11px] text-slate-500 font-semibold">Pending</p><p className="text-sm font-bold text-amber-600">£12,450</p></div>
              <div className="p-2.5 bg-slate-50 rounded-xl"><p className="text-[11px] text-slate-500 font-semibold">Last Payout</p><p className="text-sm font-bold text-slate-900">£38,200</p></div>
            </div>
          </div>
        </Card>

        {/* Fulfillment */}
        <Card padding="none" className="lg:col-span-2 p-4">
          <h3 className="text-sm font-bold text-slate-900 mb-3">Fulfillment</h3>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full" style={{width:'98.4%'}}/></div>
            <span className="text-sm font-black text-emerald-600">98%</span>
          </div>
          <div className="space-y-2">
            {[{label:'Packed',value:1180,icon:Package},{label:'In Transit',value:850,icon:Truck},{label:'Delivered',value:720,icon:CheckCircle2}].map(f=>(
              <div key={f.label} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                <f.icon className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-xs font-bold text-slate-900">{f.value.toLocaleString()}</span>
                <span className="text-[11px] text-slate-400">{f.label}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Alerts */}
        <Card padding="none" className="lg:col-span-3 p-4">
          <h3 className="text-sm font-bold text-slate-900 mb-3">Alerts</h3>
          <div className="space-y-2">
            {pendingCount>0&&<div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-50 border border-rose-100"><AlertTriangle className="h-4 w-4 text-rose-500 flex-shrink-0 mt-0.5" /><p className="text-xs font-semibold text-rose-700">{pendingCount} {pendingCount===1?'order':'orders'} awaiting confirmation</p></div>}
            {lowStockInv>0&&<div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-100"><Clock className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" /><p className="text-xs font-semibold text-amber-700">{lowStockInv} {lowStockInv===1?'SKU':'SKUs'} running low</p></div>}
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-100"><CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" /><p className="text-xs font-semibold text-emerald-700">All shipments on track</p></div>
          </div>
        </Card>
      </div>

      {/* ═══ TOP PRODUCTS + PROMOTIONS ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <TopProductsCard topProducts={topProducts} />
        <Card padding="none" className="lg:col-span-6 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5"><Zap className="h-4 w-4 text-rose-500"/>Active Promotions</h3>
            <Link to="/supplier/promotions" className="text-[11px] font-bold text-indigo-600 hover:underline">View All</Link>
          </div>
          <div className="space-y-2">
            {[{name:'Easter Flash Sale',status:'Active',lift:'+24%',revenue:'£2,840'},{name:'New Product Launch',status:'Active',lift:'+18%',revenue:'£4,120'},{name:'Weekend Bundle',status:'Scheduled',lift:'--',revenue:'--'}].map(p=>(
              <div key={p.name} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-indigo-100 transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg ${p.status==='Active'?'bg-emerald-50 text-emerald-500':'bg-slate-50 text-slate-400'}`}><Activity className="h-3.5 w-3.5"/></div>
                  <div><p className="text-sm font-bold text-slate-900">{p.name}</p><p className="text-xs text-slate-400">{p.status}</p></div>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <div><p className="text-[10px] text-slate-400 font-bold uppercase">Lift</p><p className={`text-sm font-bold ${p.lift.startsWith('+')?'text-emerald-500':'text-slate-400'}`}>{p.lift}</p></div>
                  <div><p className="text-[10px] text-slate-400 font-bold uppercase">Revenue</p><p className="text-sm font-bold text-slate-900">{p.revenue}</p></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ═══ INTELLIGENCE ═══ */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-indigo-600" />
          <h2 className="text-lg font-bold text-slate-900">Supplier Intelligence</h2>
          <span className="text-xs text-slate-400 ml-1">AI-powered insights</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <DemandForecastCard demandForecast={demandForecast} revenueForecastData={REVENUE_FORECAST_DATA} customerBehavior={customerBehavior} />
          <InventoryInsightsCard inventoryCoverage={inventoryCoverage} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <InventoryRiskForecastWidget data={{daysRemaining:14,stockoutSKUs:8,overstockedSKUs:5}} />
          <ProductPerformanceInsightsWidget data={{best:'Lost Mary NERA 15K',fastest:'Lost Mary BM6000',lowest:'Velo Nicotine Pouch',returns:'Crystal Pro Max 4000'}} />
          <CommissionBreakdownWidget data={{grossRevenue:`£${stats.revenue.toLocaleString()}`,commission:earningsData.commissionDeducted,netPayable:earningsData.netEarnings,percentage:'12%'}} />
        </div>
      </div>

      {/* Custom Date Modal */}
      <Modal isOpen={isCustomDateModalOpen} onClose={()=>setIsCustomDateModalOpen(false)} title="Select Date Range"
        footer={<div className="flex gap-3"><Button variant="outline" onClick={()=>setIsCustomDateModalOpen(false)}>Cancel</Button><Button onClick={applyCustomDateRange} disabled={!customStartDate||!customEndDate}>Apply</Button></div>}>
        <div className="grid grid-cols-2 gap-6">
          <Input label="Start Date" type="date" value={customStartDate} onChange={e=>setCustomStartDate(e.target.value)} />
          <Input label="End Date" type="date" value={customEndDate} onChange={e=>setCustomEndDate(e.target.value)} />
        </div>
      </Modal>
    </div>
  );
};

export default SupplierDashboard;
