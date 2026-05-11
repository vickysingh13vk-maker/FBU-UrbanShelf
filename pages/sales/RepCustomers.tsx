import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Phone, ChevronRight } from 'lucide-react';
import { Card } from '../../components/ui';
import LifecycleBadge from '../../components/sales/LifecycleBadge';
import { useSalesCRM } from '../../context/SalesCRMContext';
import { useAuth } from '../../context/AuthContext';
import { useCheckIn } from '../../context/CheckInContext';
import { CustomerLifecycleStage } from '../../types';

const LIFECYCLE_FILTERS: (CustomerLifecycleStage | 'All')[] = ['All', 'Active', 'At Risk', 'Prospect', 'Qualified', 'Inactive'];

const RepCustomers: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getRepCustomers, getCustomerTimeline } = useSalesCRM();
  const { checkIn, checkedInCustomer } = useCheckIn();

  const [search, setSearch] = useState('');
  const [lifecycleFilter, setLifecycleFilter] = useState<CustomerLifecycleStage | 'All'>('All');
  const [checkingInId, setCheckingInId] = useState<string | null>(null);

  const repId = user?.id ?? '';
  const customers = getRepCustomers(repId);

  const filtered = customers.filter(c => {
    const matchSearch = !search ||
      c.storeName.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search);
    const matchLifecycle = lifecycleFilter === 'All' || c.lifecycleStage === lifecycleFilter;
    return matchSearch && matchLifecycle;
  });

  // Counts per lifecycle stage
  const stageCounts = LIFECYCLE_FILTERS.reduce((acc, f) => {
    acc[f] = f === 'All' ? customers.length : customers.filter(c => c.lifecycleStage === f).length;
    return acc;
  }, {} as Record<string, number>);

  const handleCheckIn = async (e: React.MouseEvent, customer: typeof customers[0]) => {
    e.stopPropagation();
    setCheckingInId(customer.id);
    await checkIn(customer);
    setCheckingInId(null);
  };

  const getLastActivity = (customerId: string) => getCustomerTimeline(customerId)[0];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-800">My Customers</h1>
          <p className="text-xs text-slate-500 mt-0.5">{customers.length} accounts assigned</p>
        </div>
      </div>

      {/* Search + Lifecycle filters */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, contact or phone..."
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-0.5">
          {LIFECYCLE_FILTERS.map(f => (
            <button key={f} onClick={() => setLifecycleFilter(f)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                lifecycleFilter === f ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}>
              {f}
              {stageCounts[f] > 0 && (
                <span className={`text-xs ${lifecycleFilter === f ? 'text-indigo-200' : 'text-slate-400'}`}>
                  {stageCounts[f]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Customer List */}
      {filtered.length === 0 ? (
        <Card padding="md" className="flex flex-col items-center justify-center py-10 text-center">
          <Search className="h-8 w-8 text-slate-200 mb-2" />
          <p className="text-sm text-slate-400">No customers match</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map(customer => {
            const lastActivity = getLastActivity(customer.id);
            const isCheckedIn = checkedInCustomer?.id === customer.id;
            return (
              <Card key={customer.id} padding="sm"
                className={`cursor-pointer hover:shadow-md transition-all ${isCheckedIn ? 'ring-2 ring-emerald-400' : ''}`}
                onClick={() => navigate(`/sales/customers/${customer.id}`)}>
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <img
                    src={customer.image ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(customer.storeName)}&background=e0e7ff&color=6366f1`}
                    className="h-10 w-10 rounded-xl object-cover flex-shrink-0"
                    alt={customer.storeName}
                  />

                  {/* Main info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-sm font-bold text-slate-800 truncate">{customer.storeName}</h3>
                      <LifecycleBadge stage={customer.lifecycleStage ?? 'Active'} />
                      {isCheckedIn && (
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full flex-shrink-0">✓ In</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />{customer.phone}
                      </span>
                      <span className={`font-semibold ${customer.walletBalance < 0 ? 'text-rose-500' : 'text-emerald-600'}`}>
                        {customer.walletBalance < 0 ? `Owes £${Math.abs(customer.walletBalance).toFixed(0)}` : `Bal £${customer.walletBalance.toFixed(0)}`}
                      </span>
                      {customer.nextFollowUp && (
                        <span className="text-amber-500 font-medium">
                          FU {new Date(customer.nextFollowUp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </span>
                      )}
                    </div>
                    {lastActivity && (
                      <p className="text-xs text-slate-300 mt-0.5 truncate">{lastActivity.type}: {lastActivity.notes}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {!isCheckedIn && (
                      <button
                        onClick={e => handleCheckIn(e, customer)}
                        disabled={checkingInId === customer.id}
                        className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors">
                        <MapPin className="h-3 w-3" />
                        {checkingInId === customer.id ? '…' : 'In'}
                      </button>
                    )}
                    <ChevronRight className="h-4 w-4 text-slate-300" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RepCustomers;
