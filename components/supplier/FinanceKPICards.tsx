import React from 'react';
import { PoundSterling, Wallet, Clock, Receipt, ArrowUpRight, Calendar, Warehouse } from 'lucide-react';
import { KpiCard } from '../ui';

const FinanceKPICards: React.FC<{ stats: any }> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4 mb-5">
      <KpiCard
        title="Total Revenue"
        value={`£${stats.totalRevenue.toLocaleString()}`}
        icon={PoundSterling}
        color="indigo"
        trend={{ value: '12%', isPositive: true }}
      />
      <KpiCard
        title="Net Earnings"
        value={`£${stats.netEarnings.toLocaleString()}`}
        icon={Wallet}
        color="emerald"
        trend={{ value: '8%', isPositive: true }}
      />
      <KpiCard
        title="Pending Payout"
        value={`£${stats.pendingPayout.toLocaleString()}`}
        icon={Clock}
        color="amber"
      />
      <KpiCard
        title="Commission Paid"
        value={`£${stats.totalCommissionPaid.toLocaleString()}`}
        icon={Receipt}
        color="rose"
      />
      <KpiCard
        title="Last Payout"
        value={`£${stats.lastPayoutAmount.toLocaleString()}`}
        icon={ArrowUpRight}
        color="blue"
      />
      <KpiCard
        title="Next Payout"
        value={stats.nextPayoutDate ? new Date(stats.nextPayoutDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
        icon={Calendar}
        color="violet"
      />
      <KpiCard
        title="Storage Fees"
        value={`£${(stats.storageFees || 0).toLocaleString()}`}
        icon={Warehouse}
        color="slate"
      />
    </div>
  );
};

export default FinanceKPICards;
