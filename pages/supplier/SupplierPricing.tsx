import React, { useState, useMemo } from 'react';
import {
  Search, TrendingUp, BarChart3, Target,
  ArrowUpDown, Percent, PoundSterling
} from 'lucide-react';
import {
  Card, Button, Badge, Table, THead, TBody, TR, TH, TD,
  Input, Pagination, Toast
} from '../../components/ui';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Cell
} from 'recharts';
import { useSupplier } from '../../context/SupplierContext';
import { StandardGrid, StandardTooltip, CHART_COLORS, AXIS_TICK_STYLE, formatCurrency, formatPercent } from '../../utils/chartHelpers';

const SupplierPricing: React.FC = () => {
  const { products } = useSupplier();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const pricingData = useMemo(() => products.map(p => ({
    id: p.id,
    name: p.name,
    sku: p.sku,
    flavour: p.flavour,
    wholesalePrice: p.price,
    sellingPrice: p.mrp,
    margin: ((p.mrp - p.price) / p.mrp * 100),
    discountImpact: Math.round((p.mrp - p.price) * 0.12 * 100) / 100,
    revenueImpact: p.revenue || 0
  })), [products]);

  const sortedData = useMemo(() => {
    return [...pricingData]
      .filter(p => {
        const q = searchQuery.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
      })
      .sort((a, b) => b.margin - a.margin);
  }, [pricingData, searchQuery]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(start, start + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const kpis = useMemo(() => {
    if (pricingData.length === 0) return { avgMargin: 0, bestProduct: '-', totalRevenue: 0, priceSpread: 0 };
    const avgMargin = pricingData.reduce((sum, p) => sum + p.margin, 0) / pricingData.length;
    const bestProduct = [...pricingData].sort((a, b) => b.margin - a.margin)[0];
    const totalRevenue = pricingData.reduce((sum, p) => sum + p.revenueImpact, 0);
    const priceSpread = pricingData.reduce((sum, p) => sum + (p.sellingPrice - p.wholesalePrice), 0) / pricingData.length;
    return {
      avgMargin: avgMargin.toFixed(1),
      bestProduct: bestProduct?.name || '-',
      totalRevenue,
      priceSpread: priceSpread.toFixed(2)
    };
  }, [pricingData]);

  const chartData = useMemo(() => {
    return [...pricingData]
      .sort((a, b) => b.margin - a.margin)
      .slice(0, 12)
      .map(p => ({
        name: p.name.length > 18 ? p.name.substring(0, 18) + '...' : p.name,
        margin: parseFloat(p.margin.toFixed(1)),
        sku: p.sku
      }));
  }, [pricingData]);

  const getMarginColor = (margin: number) => {
    if (margin > 30) return CHART_COLORS.emerald;
    if (margin >= 15) return CHART_COLORS.amber;
    return CHART_COLORS.rose;
  };

  const getMarginTextClass = (margin: number) => {
    if (margin > 30) return 'text-emerald-600';
    if (margin >= 15) return 'text-amber-600';
    return 'text-rose-600';
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Pricing & Performance</h1>
            <p className="text-slate-500 mt-1 font-medium">Analyse margins, price points, and revenue impact across your catalog.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" icon={<BarChart3 className="h-4 w-4" />}>Export Report</Button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-md hover:border-slate-200 transition-all h-full">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Average Margin</p>
            <div className="rounded-lg p-1.5 bg-emerald-50 text-emerald-500">
              <Percent className="h-3.5 w-3.5" />
            </div>
          </div>
          <p className="text-xl font-black text-slate-900 tracking-tight mt-2">{kpis.avgMargin}%</p>
        </Card>

        <Card className="hover:shadow-md hover:border-slate-200 transition-all h-full">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Best Price Point</p>
            <div className="rounded-lg p-1.5 bg-indigo-50 text-indigo-500">
              <Target className="h-3.5 w-3.5" />
            </div>
          </div>
          <p className="text-xl font-black text-slate-900 tracking-tight mt-2 truncate" title={kpis.bestProduct}>
            {kpis.bestProduct.length > 16 ? kpis.bestProduct.substring(0, 16) + '...' : kpis.bestProduct}
          </p>
        </Card>

        <Card className="hover:shadow-md hover:border-slate-200 transition-all h-full">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Total Revenue Impact</p>
            <div className="rounded-lg p-1.5 bg-blue-50 text-blue-500">
              <PoundSterling className="h-3.5 w-3.5" />
            </div>
          </div>
          <p className="text-xl font-black text-slate-900 tracking-tight mt-2">{formatCurrency(kpis.totalRevenue)}</p>
        </Card>

        <Card className="hover:shadow-md hover:border-slate-200 transition-all h-full">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Price Spread</p>
            <div className="rounded-lg p-1.5 bg-amber-50 text-amber-500">
              <ArrowUpDown className="h-3.5 w-3.5" />
            </div>
          </div>
          <p className="text-xl font-black text-slate-900 tracking-tight mt-2">£{kpis.priceSpread}</p>
        </Card>
      </div>

      {/* Chart Section */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Margin by SKU</h3>
            <p className="text-sm text-slate-500 font-medium">Top products sorted by margin percentage</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">&gt;30%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-amber-500" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">15-30%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-rose-500" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">&lt;15%</span>
            </div>
          </div>
        </div>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 60 }}>
              <StandardGrid />
              <XAxis
                dataKey="name"
                tick={AXIS_TICK_STYLE}
                angle={-35}
                textAnchor="end"
                height={80}
              />
              <YAxis
                tick={AXIS_TICK_STYLE}
                tickFormatter={(v) => formatPercent(v)}
              />
              <StandardTooltip
                formatter={(value: number) => [formatPercent(value), 'Margin']}
              />
              <Bar dataKey="margin" radius={[6, 6, 0, 0]} maxBarSize={48}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getMarginColor(entry.margin)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Search */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              className="pl-10"
              placeholder="Search by product name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Pricing Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <Table>
            <THead>
              <TR>
                <TH className="pl-6">Product</TH>
                <TH>SKU</TH>
                <TH align="right">Wholesale (£)</TH>
                <TH align="right">Selling Price (£)</TH>
                <TH align="right">Margin %</TH>
                <TH align="right" className="pr-6">Revenue Impact (£)</TH>
              </TR>
            </THead>
            <TBody>
              {paginatedData.length > 0 ? paginatedData.map((item) => (
                <TR key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                  <TD className="pl-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900">{item.name}</span>
                      {item.flavour && (
                        <span className="text-[11px] font-medium text-slate-400">{item.flavour}</span>
                      )}
                    </div>
                  </TD>
                  <TD>
                    <span className="text-xs font-mono font-bold text-slate-500">{item.sku}</span>
                  </TD>
                  <TD align="right">
                    <span className="text-sm font-bold text-slate-700 tabular-nums">£{item.wholesalePrice.toFixed(2)}</span>
                  </TD>
                  <TD align="right">
                    <span className="text-sm font-bold text-slate-700 tabular-nums">£{item.sellingPrice.toFixed(2)}</span>
                  </TD>
                  <TD align="right">
                    <span className={`text-sm font-black tabular-nums ${getMarginTextClass(item.margin)}`}>
                      {item.margin.toFixed(1)}%
                    </span>
                  </TD>
                  <TD align="right" className="pr-6">
                    <span className="text-sm font-bold text-slate-700 tabular-nums">£{item.revenueImpact.toLocaleString()}</span>
                  </TD>
                </TR>
              )) : (
                <TR>
                  <TD colSpan={6} align="center" className="py-12">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="h-8 w-8 text-slate-300" />
                      <p className="text-sm font-medium text-slate-400">No products found matching your search.</p>
                    </div>
                  </TD>
                </TR>
              )}
            </TBody>
          </Table>
        </div>
        <div className="p-4 border-t border-slate-100">
          <Pagination
            currentPage={currentPage}
            totalItems={sortedData.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
            entityName="products"
          />
        </div>
      </Card>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default SupplierPricing;
