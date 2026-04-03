import React, { useMemo } from 'react';
import { Card, Badge, Table, THead, TBody, TR, TH, TD } from '../../components/ui';
import { useSupplier } from '../../context/SupplierContext';
import { MapPin, TrendingUp, PoundSterling, BarChart3 } from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { CHART_COLORS, formatCurrency } from '../../utils/chartHelpers';
import type { MarketRegion } from '../../types';

const SupplierMarketInsights: React.FC = () => {
  const { marketInsights } = useSupplier();

  const kpis = marketInsights?.kpis || {
    totalRegions: 0,
    highestGrowthRegion: '-',
    totalMarketRevenue: 0,
    avgRegionalRevenue: 0,
  };

  const sortedRegions = useMemo((): MarketRegion[] => {
    const regions: MarketRegion[] = marketInsights?.regions || [];
    return [...regions].sort((a, b) => b.revenue - a.revenue);
  }, [marketInsights]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Market Insights</h1>
        <p className="text-slate-500 mt-1 font-medium">Regional performance and market coverage across the UK</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-md hover:border-slate-200 transition-all h-full">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Total Regions</p>
            <div className="rounded-lg p-1.5 bg-indigo-50 text-indigo-500">
              <MapPin className="h-3.5 w-3.5" />
            </div>
          </div>
          <p className="text-xl font-black text-slate-900 tracking-tight mt-2">{kpis.totalRegions}</p>
        </Card>
        <Card className="hover:shadow-md hover:border-slate-200 transition-all h-full">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Highest Growth Region</p>
            <div className="rounded-lg p-1.5 bg-emerald-50 text-emerald-500">
              <TrendingUp className="h-3.5 w-3.5" />
            </div>
          </div>
          <p className="text-xl font-black text-slate-900 tracking-tight mt-2">{kpis.highestGrowthRegion}</p>
        </Card>
        <Card className="hover:shadow-md hover:border-slate-200 transition-all h-full">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Total Market Revenue</p>
            <div className="rounded-lg p-1.5 bg-blue-50 text-blue-500">
              <PoundSterling className="h-3.5 w-3.5" />
            </div>
          </div>
          <p className="text-xl font-black text-slate-900 tracking-tight mt-2">{formatCurrency(kpis.totalMarketRevenue)}</p>
        </Card>
        <Card className="hover:shadow-md hover:border-slate-200 transition-all h-full">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Avg Regional Revenue</p>
            <div className="rounded-lg p-1.5 bg-amber-50 text-amber-500">
              <BarChart3 className="h-3.5 w-3.5" />
            </div>
          </div>
          <p className="text-xl font-black text-slate-900 tracking-tight mt-2">{formatCurrency(kpis.avgRegionalRevenue)}</p>
        </Card>
      </div>

      {/* Map + Table Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map Section */}
        <div className="lg:col-span-8">
          <Card className="p-5 hover:shadow-lg transition-all duration-300">
            <h2 className="text-sm font-bold text-slate-900 mb-4">Regional Performance Map</h2>
            <MapContainer
              center={[54.5, -2.5]}
              zoom={6}
              style={{ height: '500px', width: '100%', borderRadius: '16px', zIndex: 1 }}
              scrollWheelZoom={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {(marketInsights?.regions || []).map((region) => (
                <CircleMarker
                  key={region.id}
                  center={[region.lat, region.lng]}
                  radius={Math.max(8, region.revenue / 2000)}
                  pathOptions={{
                    color: region.growthRate >= 0 ? CHART_COLORS.indigo : CHART_COLORS.rose,
                    fillColor: region.growthRate >= 0 ? CHART_COLORS.indigo : CHART_COLORS.rose,
                    fillOpacity: 0.5,
                    weight: 2,
                  }}
                >
                  <Popup>
                    <div className="text-sm">
                      <p className="font-bold text-slate-900">{region.name}</p>
                      <p className="text-slate-600">Units Sold: {region.unitsSold.toLocaleString()}</p>
                      <p className="text-slate-600">Revenue: {formatCurrency(region.revenue)}</p>
                      <p className={region.growthRate >= 0 ? 'text-emerald-600 font-semibold' : 'text-rose-600 font-semibold'}>
                        Growth: {region.growthRate >= 0 ? '+' : ''}{region.growthRate.toFixed(1)}%
                      </p>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </Card>
        </div>

        {/* Regional Data Table */}
        <div className="lg:col-span-4">
          <Card padding="none">
            <div className="p-4 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900">Regional Breakdown</h2>
            </div>
            <Table>
              <THead>
                <TR>
                  <TH>Region</TH>
                  <TH>Revenue</TH>
                  <TH>Growth</TH>
                </TR>
              </THead>
              <TBody>
                {sortedRegions.map((region, i) => (
                  <TR key={i} className="group hover:bg-slate-50/50 transition-colors">
                    <TD className="font-medium text-slate-900">{region.name}</TD>
                    <TD className="font-semibold">{formatCurrency(region.revenue)}</TD>
                    <TD>
                      <Badge variant={region.growthRate >= 0 ? 'success' : 'danger'}>
                        {region.growthRate >= 0 ? '+' : ''}{region.growthRate.toFixed(1)}%
                      </Badge>
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SupplierMarketInsights;
