import React, { useState, useMemo } from 'react';
import { Card, Button, Badge, Table, THead, TBody, TR, TH, TD, Pagination } from '../../components/ui';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Cell } from 'recharts';
import { useSupplier } from '../../context/SupplierContext';
import { TrendingUp, TrendingDown, Package, PoundSterling, BarChart3, ShoppingCart, Target, Zap, Search } from 'lucide-react';
import { StandardGrid, StandardTooltip, ChartGradient, CHART_COLORS, AXIS_TICK_STYLE, formatCurrency } from '../../utils/chartHelpers';
import type { SupplierAnalyticsData } from '../../types';

const ITEMS_PER_PAGE = 10;

const SupplierAnalytics: React.FC = () => {
  const { analytics } = useSupplier();
  const [activeTab, setActiveTab] = useState<'sku' | 'region' | 'time'>('sku');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const kpis = useMemo(() => {
    const data = analytics?.salesBySku || [];
    const totalUnits = data.reduce((sum, s) => sum + s.unitsSold, 0);
    const totalRevenue = data.reduce((sum, s) => sum + s.revenue, 0);
    const avgGrowth = data.length ? data.reduce((sum, s) => sum + s.growth, 0) / data.length : 0;
    const avgOrderSize = data.length ? data.reduce((sum, s) => sum + s.avgOrderSize, 0) / data.length : 0;
    const avgConversion = data.length ? data.reduce((sum, s) => sum + s.conversionRate, 0) / data.length : 0;
    const avgVelocity = data.length ? data.reduce((sum, s) => sum + s.salesVelocity, 0) / data.length : 0;
    return { totalUnits, totalRevenue, avgGrowth, avgOrderSize, avgConversion, avgVelocity };
  }, [analytics]);

  const filteredSkuData = useMemo(() => {
    const data = analytics?.salesBySku || [];
    if (!searchQuery) return data;
    const q = searchQuery.toLowerCase();
    return data.filter(s => s.product.toLowerCase().includes(q) || s.sku.toLowerCase().includes(q));
  }, [analytics, searchQuery]);

  const filteredRegionData = useMemo(() => {
    const data = analytics?.salesByRegion || [];
    if (!searchQuery) return data;
    const q = searchQuery.toLowerCase();
    return data.filter(r => r.region.toLowerCase().includes(q));
  }, [analytics, searchQuery]);

  const filteredTimeData = useMemo(() => {
    const data = analytics?.salesByTime || [];
    if (!searchQuery) return data;
    const q = searchQuery.toLowerCase();
    return data.filter(t => t.month.toLowerCase().includes(q));
  }, [analytics, searchQuery]);

  const getCurrentData = () => {
    if (activeTab === 'sku') return filteredSkuData;
    if (activeTab === 'region') return filteredRegionData;
    return filteredTimeData;
  };

  const currentData = getCurrentData();

  const paginatedData = currentData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleTabChange = (tab: 'sku' | 'region' | 'time') => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSearchQuery('');
  };

  const barColors = [CHART_COLORS.indigo, '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff', '#4f46e5', '#4338ca', '#3730a3'];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Sales Analytics</h1>
        <p className="text-slate-500 mt-1 font-medium">Analyse sales performance across SKUs, regions and time periods</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
        <Card className="hover:shadow-md hover:border-slate-200 transition-all h-full">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Total Units Sold</p>
            <div className="rounded-lg p-1.5 bg-indigo-50 text-indigo-500">
              <Package className="h-3.5 w-3.5" />
            </div>
          </div>
          <p className="text-xl font-black text-slate-900 tracking-tight mt-2">{kpis.totalUnits.toLocaleString()}</p>
        </Card>
        <Card className="hover:shadow-md hover:border-slate-200 transition-all h-full">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Total Revenue</p>
            <div className="rounded-lg p-1.5 bg-emerald-50 text-emerald-500">
              <PoundSterling className="h-3.5 w-3.5" />
            </div>
          </div>
          <p className="text-xl font-black text-slate-900 tracking-tight mt-2">{formatCurrency(kpis.totalRevenue)}</p>
        </Card>
        <Card className="hover:shadow-md hover:border-slate-200 transition-all h-full">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Avg Growth</p>
            <div className="rounded-lg p-1.5 bg-blue-50 text-blue-500">
              <TrendingUp className="h-3.5 w-3.5" />
            </div>
          </div>
          <p className="text-xl font-black text-slate-900 tracking-tight mt-2">{kpis.avgGrowth.toFixed(1)}%</p>
        </Card>
        <Card className="hover:shadow-md hover:border-slate-200 transition-all h-full">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Avg Order Size</p>
            <div className="rounded-lg p-1.5 bg-amber-50 text-amber-500">
              <ShoppingCart className="h-3.5 w-3.5" />
            </div>
          </div>
          <p className="text-xl font-black text-slate-900 tracking-tight mt-2">£{kpis.avgOrderSize.toFixed(2)}</p>
        </Card>
        <Card className="hover:shadow-md hover:border-slate-200 transition-all h-full">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Avg Conversion Rate</p>
            <div className="rounded-lg p-1.5 bg-violet-50 text-violet-500">
              <Target className="h-3.5 w-3.5" />
            </div>
          </div>
          <p className="text-xl font-black text-slate-900 tracking-tight mt-2">{kpis.avgConversion.toFixed(1)}%</p>
        </Card>
        <Card className="hover:shadow-md hover:border-slate-200 transition-all h-full">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Avg Sales Velocity</p>
            <div className="rounded-lg p-1.5 bg-rose-50 text-rose-500">
              <Zap className="h-3.5 w-3.5" />
            </div>
          </div>
          <p className="text-xl font-black text-slate-900 tracking-tight mt-2">{kpis.avgVelocity.toFixed(1)}</p>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3">
        <button
          className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'sku' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}
          onClick={() => handleTabChange('sku')}
        >
          By SKU
        </button>
        <button
          className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'region' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}
          onClick={() => handleTabChange('region')}
        >
          By Region
        </button>
        <button
          className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'time' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}
          onClick={() => handleTabChange('time')}
        >
          By Time
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
          className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Tab Content: By SKU */}
      {activeTab === 'sku' && (
        <div className="space-y-6">
          <Card className="p-5">
            <h2 className="text-sm font-bold text-slate-900 mb-4">Revenue by Product</h2>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={filteredSkuData}>
                <defs>
                  <ChartGradient id="barGradient" color={CHART_COLORS.indigo} opacity={[1, 0.6]} />
                </defs>
                <StandardGrid />
                <XAxis dataKey="product" tick={AXIS_TICK_STYLE} />
                <YAxis tick={AXIS_TICK_STYLE} />
                <StandardTooltip formatter={(value: number) => [formatCurrency(value), 'Revenue']} />
                <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                  {filteredSkuData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card padding="none">
            <Table>
              <THead>
                <TR>
                  <TH>Product</TH>
                  <TH>SKU</TH>
                  <TH>Units Sold</TH>
                  <TH>Revenue</TH>
                  <TH>Growth %</TH>
                  <TH>Velocity</TH>
                </TR>
              </THead>
              <TBody>
                {(paginatedData as SupplierAnalyticsData['salesBySku']).map((row, i) => (
                  <TR key={i} className="group hover:bg-slate-50/50 transition-colors">
                    <TD className="font-medium text-slate-900">{row.product}</TD>
                    <TD className="text-slate-500 font-mono text-sm">{row.sku}</TD>
                    <TD>{row.unitsSold.toLocaleString()}</TD>
                    <TD className="font-semibold">{formatCurrency(row.revenue)}</TD>
                    <TD>
                      <Badge variant={row.growth >= 0 ? 'success' : 'danger'}>
                        {row.growth >= 0 ? '+' : ''}{row.growth.toFixed(1)}%
                      </Badge>
                    </TD>
                    <TD>{row.salesVelocity.toFixed(1)}</TD>
                  </TR>
                ))}
              </TBody>
            </Table>
            <div className="p-4 border-t border-slate-100">
              <Pagination currentPage={currentPage} totalItems={currentData.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setCurrentPage} entityName="records" />
            </div>
          </Card>
        </div>
      )}

      {/* Tab Content: By Region */}
      {activeTab === 'region' && (
        <Card padding="none">
          <Table>
            <THead>
              <TR>
                <TH>Region</TH>
                <TH>Units Sold</TH>
                <TH>Revenue</TH>
                <TH>Growth Rate</TH>
                <TH>Orders</TH>
              </TR>
            </THead>
            <TBody>
              {(paginatedData as SupplierAnalyticsData['salesByRegion']).map((row, i) => (
                <TR key={i} className="group hover:bg-slate-50/50 transition-colors">
                  <TD className="font-medium text-slate-900">{row.region}</TD>
                  <TD>{row.unitsSold.toLocaleString()}</TD>
                  <TD className="font-semibold">{formatCurrency(row.revenue)}</TD>
                  <TD>
                    <Badge variant={row.growthRate >= 0 ? 'success' : 'danger'}>
                      {row.growthRate >= 0 ? '+' : ''}{row.growthRate.toFixed(1)}%
                    </Badge>
                  </TD>
                  <TD>{row.orders.toLocaleString()}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
          <div className="p-4 border-t border-slate-100">
            <Pagination currentPage={currentPage} totalItems={currentData.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setCurrentPage} entityName="records" />
          </div>
        </Card>
      )}

      {/* Tab Content: By Time */}
      {activeTab === 'time' && (
        <div className="space-y-6">
          <Card className="p-5">
            <h2 className="text-sm font-bold text-slate-900 mb-4">Revenue Over Time</h2>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={filteredTimeData}>
                <defs>
                  <ChartGradient id="areaGradient" color={CHART_COLORS.indigo} opacity={[0.3, 0]} />
                </defs>
                <StandardGrid />
                <XAxis dataKey="month" tick={AXIS_TICK_STYLE} />
                <YAxis tick={AXIS_TICK_STYLE} />
                <StandardTooltip formatter={(value: number) => [formatCurrency(value), 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke={CHART_COLORS.indigo} strokeWidth={2.5} fill="url(#areaGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          <Card padding="none">
            <Table>
              <THead>
                <TR>
                  <TH>Month</TH>
                  <TH>Units Sold</TH>
                  <TH>Revenue</TH>
                  <TH>Orders</TH>
                </TR>
              </THead>
              <TBody>
                {(paginatedData as SupplierAnalyticsData['salesByTime']).map((row, i) => (
                  <TR key={i} className="group hover:bg-slate-50/50 transition-colors">
                    <TD className="font-medium text-slate-900">{row.month}</TD>
                    <TD>{row.unitsSold.toLocaleString()}</TD>
                    <TD className="font-semibold">{formatCurrency(row.revenue)}</TD>
                    <TD>{row.orders.toLocaleString()}</TD>
                  </TR>
                ))}
              </TBody>
            </Table>
            <div className="p-4 border-t border-slate-100">
              <Pagination currentPage={currentPage} totalItems={currentData.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setCurrentPage} entityName="records" />
            </div>
          </Card>
        </div>
      )}

      {/* Insights Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card className="p-5 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Winning SKUs</h3>
          </div>
          <div className="space-y-3">
            {(analytics?.insights?.winningSKUs || []).map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-emerald-50/50 rounded-xl">
                <div>
                  <p className="font-semibold text-slate-900">{item.product}</p>
                  <p className="text-sm text-slate-500 font-mono">{item.sku}</p>
                </div>
                <Badge variant="success">
                  <TrendingUp className="w-3 h-3 mr-1 inline" />
                  +{item.growth.toFixed(1)}%
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
              <TrendingDown className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Declining SKUs</h3>
          </div>
          <div className="space-y-3">
            {(analytics?.insights?.decliningSKUs || []).map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-rose-50/50 rounded-xl">
                <div>
                  <p className="font-semibold text-slate-900">{item.product}</p>
                  <p className="text-sm text-slate-500 font-mono">{item.sku}</p>
                </div>
                <Badge variant="danger">
                  <TrendingDown className="w-3 h-3 mr-1 inline" />
                  {item.decline.toFixed(1)}%
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SupplierAnalytics;
