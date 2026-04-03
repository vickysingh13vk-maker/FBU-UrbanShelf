import React from 'react';
import { Box, Package, AlertTriangle, AlertCircle, TrendingUp } from 'lucide-react';
import { KpiCard } from '../ui';

const InventoryKPICards: React.FC<{ stats: { totalProducts: number; totalUnits: number; lowStock: number; outOfStock: number; totalValue: number } }> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-5">
      <KpiCard
        title="Total Products"
        value={stats.totalProducts}
        icon={Box}
        color="indigo"
      />
      <KpiCard
        title="Total Units"
        value={stats.totalUnits.toLocaleString()}
        icon={Package}
        color="blue"
      />
      <KpiCard
        title="Low Stock"
        value={stats.lowStock}
        icon={AlertTriangle}
        color="amber"
        trend={{ value: 'Action Required', isPositive: false }}
      />
      <KpiCard
        title="Out of Stock"
        value={stats.outOfStock}
        icon={AlertCircle}
        color="rose"
        trend={{ value: 'Critical', isPositive: false }}
      />
      <KpiCard
        title="Inventory Value"
        value={`£${stats.totalValue.toLocaleString()}`}
        icon={TrendingUp}
        color="emerald"
      />
    </div>
  );
};

export default InventoryKPICards;
