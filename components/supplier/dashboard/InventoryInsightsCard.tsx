import React from 'react';
import { PackageSearch } from 'lucide-react';
import { Card } from '../../ui/Card';
import { InventoryCoverageItem } from '../../../mock/supplierDashboard';

export interface InventoryInsightsCardProps {
  inventoryCoverage: InventoryCoverageItem[];
}

const InventoryInsightsCard: React.FC<InventoryInsightsCardProps> = ({ inventoryCoverage }) => {
  return (
    <Card padding="none" className="lg:col-span-3 flex flex-col p-5 hover:shadow-xl transition-all duration-300 border-slate-100 group bg-white">
      <div className="flex items-center gap-2 mb-4">
        <PackageSearch className="h-4 w-4 text-amber-600" />
        <h3 className="text-sm font-bold text-slate-900 tracking-tight">Inventory Coverage</h3>
      </div>
      <div className="space-y-5 flex-1">
        {inventoryCoverage.map((item, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between items-end">
              <p className="text-xs font-bold text-slate-900">{item.name}</p>
              <p className={`text-[11px] font-bold ${item.coverage < 10 ? 'text-rose-600' : 'text-slate-500'}`}>
                {item.coverage} Days
              </p>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${item.coverage < 10 ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]'}`}
                style={{ width: `${Math.min((item.coverage / 30) * 100, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              <span>Stock: {(item?.stock || 0).toLocaleString()}</span>
              <span>Daily: {item.daily} units</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default InventoryInsightsCard;
