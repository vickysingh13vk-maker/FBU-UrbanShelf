import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, MapPin, Navigation, CheckCircle2, XCircle, 
  Clock, ArrowLeft, Loader2, Info, AlertTriangle,
  Phone, Globe, Map as MapIcon
} from 'lucide-react';
import { Card, Button, Badge } from '../components/ui';
import { useNavigate } from 'react-router-dom';
import { useCheckIn } from '../context/CheckInContext';
import { CUSTOMERS } from '../data';
import { Customer } from '../types';

const CheckIn: React.FC = () => {
  const navigate = useNavigate();
  const { checkIn, isNear, checkedInCustomer } = useCheckIn();
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [nearbyStatus, setNearbyStatus] = useState<Record<string, boolean>>({});

  const filteredCustomers = CUSTOMERS.filter(c => 
    c.storeName.toLowerCase().includes(search.toLowerCase()) ||
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCheckIn = async (customer: Customer) => {
    setLoading(customer.id);
    setError(null);
    try {
      const success = await checkIn(customer);
      if (success) {
        navigate('/');
      } else {
        setError(`You are too far from ${customer.storeName}. Please move closer to check-in.`);
      }
    } catch (err) {
      setError('Failed to get your location. Please check your GPS settings.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 bg-white rounded-xl border border-slate-200 shadow-sm thumb-button"
        >
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </button>
        <div>
          <h1 className="text-xl font-extrabold text-primary tracking-tight">GPS Check-In</h1>
          <p className="text-xs text-slate-500 font-medium">Verify your location to start an order</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input 
          type="text"
          placeholder="Search customer or shop name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium text-slate-700"
        />
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3"
          >
            <XCircle className="h-5 w-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-bold text-rose-700">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Customer List */}
      <div className="space-y-4">
        {filteredCustomers.map((customer) => (
          <Card key={customer.id} className="sales-card p-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden">
                  <img 
                    src={customer.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(customer.storeName)}&background=random`} 
                    alt="" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-tight">{customer.storeName}</h3>
                  <p className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {customer.address.split(',')[0]}
                  </p>
                </div>
              </div>
              <Badge 
                variant={customer.status === 'Approved' ? 'success' : 'warning'}
                className="text-[9px] uppercase tracking-widest px-2 py-0.5"
              >
                {customer.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Outstanding</p>
                <p className="text-xs font-black text-rose-600">£{customer.walletBalance.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Credit Limit</p>
                <p className="text-xs font-black text-slate-700">£{customer.creditLimit.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="secondary" 
                className="flex-1 py-3 text-xs font-bold thumb-button"
                onClick={() => navigate(`/customers/${customer.id}`)}
              >
                View Profile
              </Button>
              <Button 
                variant="primary" 
                className="flex-1 py-3 text-xs font-bold thumb-button bg-primary hover:bg-primary-light border-none shadow-lg shadow-primary/20"
                onClick={() => handleCheckIn(customer)}
                disabled={loading === customer.id || checkedInCustomer?.id === customer.id}
                icon={loading === customer.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
              >
                {checkedInCustomer?.id === customer.id ? 'Checked In' : 'Check-In'}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-10 w-10 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No customers found</h3>
          <p className="text-sm text-slate-500">Try searching with a different name</p>
        </div>
      )}
    </div>
  );
};

export default CheckIn;
