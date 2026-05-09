import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Phone, ChevronRight, Filter } from 'lucide-react';
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

  const handleCheckIn = async (e: React.MouseEvent, customer: typeof customers[0]) => {
    e.stopPropagation();
    setCheckingInId(customer.id);
    await checkIn(customer);
    setCheckingInId(null);
  };

  const getLastActivity = (customerId: string) => getCustomerTimeline(customerId)[0];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-slate-800">My Customers</h1>
        <p className="text-sm text-slate-500 mt-1">{customers.length} accounts assigned to you</p>
      </div>

      {/* Search + Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search customers..."
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {LIFECYCLE_FILTERS.map(f => (
            <button key={f} onClick={() => setLifecycleFilter(f)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                lifecycleFilter === f ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Customer List */}
      {filtered.length === 0 ? (
        <Card padding="lg" className="flex flex-col items-center justify-center py-16 text-center">
          <Filter className="h-8 w-8 text-slate-200 mb-2" />
          <p className="text-sm text-slate-400">No customers match your filter</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map(customer => {
            const lastActivity = getLastActivity(customer.id);
            const isCheckedIn = checkedInCustomer?.id === customer.id;
            return (
              <Card key={customer.id} padding="md"
                className={`cursor-pointer hover:shadow-md transition-all ${isCheckedIn ? 'ring-2 ring-emerald-400' : ''}`}
                onClick={() => navigate(`/sales/customers/${customer.id}`)}>
                <div className="flex items-start gap-4">
                  <img
                    src={customer.image ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(customer.storeName)}&background=e0e7ff&color=6366f1`}
                    className="h-12 w-12 rounded-2xl object-cover flex-shrink-0"
                    alt={customer.storeName}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <h3 className="text-sm font-bold text-slate-800">{customer.storeName}</h3>
                        <p className="text-xs text-slate-400">{customer.name} · {customer.companyName}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <LifecycleBadge stage={customer.lifecycleStage ?? 'Active'} />
                        {isCheckedIn && (
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Checked In</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <Phone className="h-3 w-3" />{customer.phone}
                      </span>
                      <span className={`text-xs font-semibold ${customer.walletBalance < 0 ? 'text-rose-500' : 'text-emerald-600'}`}>
                        {customer.walletBalance < 0 ? `Owes £${Math.abs(customer.walletBalance).toFixed(2)}` : `Bal £${customer.walletBalance.toFixed(2)}`}
                      </span>
                      {customer.nextFollowUp && (
                        <span className="text-xs text-amber-600 font-medium">
                          Follow-up {new Date(customer.nextFollowUp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </span>
                      )}
                    </div>
                    {lastActivity && (
                      <p className="text-xs text-slate-400 mt-1.5 truncate">Last: {lastActivity.type} — {lastActivity.notes}</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 mt-3 pt-3 border-t border-slate-50">
                  <button onClick={e => handleCheckIn(e, customer)} disabled={checkingInId === customer.id || isCheckedIn}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      isCheckedIn ? 'bg-emerald-100 text-emerald-700 cursor-default' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                    }`}>
                    <MapPin className="h-3.5 w-3.5" />
                    {checkingInId === customer.id ? 'Checking in...' : isCheckedIn ? 'Checked In' : 'Check In'}
                  </button>
                  <button onClick={e => { e.stopPropagation(); navigate(`/sales/customers/${customer.id}`); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors ml-auto">
                    View <ChevronRight className="h-3.5 w-3.5" />
                  </button>
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
