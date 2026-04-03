import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '../../ui/Card';
import { Flavour } from '../../../mock/supplierDashboard';

export interface TopProductItem {
  rank: number;
  name: string;
  category?: string;
  boxesSold?: number;
  units: number;
  revenue: number;
  trend?: string;
  flavours: Flavour[];
  total?: number;
}

export interface TopProductsCardProps {
  topProducts: TopProductItem[];
}

const TopProductsCard: React.FC<TopProductsCardProps> = ({ topProducts }) => {
  return (
    <Card padding="none" className="lg:col-span-6 flex flex-col p-5 hover:shadow-lg transition-all border-slate-100 bg-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-900">Top Selling Products</h3>
        <Link to="/supplier/products" className="text-[11px] font-bold text-indigo-600 hover:underline">View All</Link>
      </div>

      <div className="space-y-2">
        {topProducts.map((product) => {
          const soldQty = product.boxesSold || product.units || 0;
          const isUp = product.trend === 'up';
          const rankColors: Record<number, string> = {
            1: 'bg-amber-100 text-amber-700 ring-1 ring-amber-200',
            2: 'bg-slate-200 text-slate-700 ring-1 ring-slate-300',
            3: 'bg-orange-100 text-orange-700 ring-1 ring-orange-200',
          };

          return (
            <div key={product.rank} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-slate-50/50 transition-all group">
              {/* Rank */}
              <div className={`flex items-center justify-center h-8 w-8 rounded-lg text-xs font-black shadow-sm flex-shrink-0 ${rankColors[product.rank] || 'bg-slate-50 text-slate-500 border border-slate-100'}`}>
                {product.rank}
              </div>

              {/* Product info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">{product.name}</p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-xs text-slate-400">{soldQty.toLocaleString()} units</span>
                  {product.category && <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded uppercase">{product.category.split(' ')[0]}</span>}
                </div>
              </div>

              {/* Revenue */}
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-black text-emerald-600">£{product.revenue.toLocaleString()}</p>
              </div>

              {/* Trend */}
              <div className={`p-1.5 rounded-lg flex-shrink-0 ${isUp ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
                {isUp ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
              </div>
            </div>
          );
        })}

        {topProducts.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-6">No products sold in this period</p>
        )}
      </div>
    </Card>
  );
};

export default TopProductsCard;
