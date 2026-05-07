import React, { useState } from 'react';
import { Wallet, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Card } from '../../components/ui';
import { useSalesCRM } from '../../context/SalesCRMContext';
import { useWorkSession } from '../../context/WorkSessionContext';
import { useAuth } from '../../context/AuthContext';
import { ORDERS } from '../../data';

const MOCK_COMMISSION = {
  earned: 145.13,
  pending: 38.00,
  blocked: 12.50,
  rate: '8%',
};

const RepPayments: React.FC = () => {
  const { user } = useAuth();
  const { getRepCustomers, addTimelineEntry } = useSalesCRM();
  const { recordCollection, todayStats } = useWorkSession();
  const [collectingId, setCollectingId] = useState<string | null>(null);
  const [amounts, setAmounts] = useState<Record<string, string>>({});
  const [collected, setCollected] = useState<Record<string, boolean>>({});

  const repId = user?.id ?? '';
  const myCustomers = getRepCustomers(repId);

  // Customers with outstanding balance or unpaid orders
  const customersDue = myCustomers.filter(c => {
    const hasUnpaid = ORDERS.some(o => o.customerId === c.id && o.paymentStatus === 'Pending' && o.repId === repId);
    return c.walletBalance < 0 || hasUnpaid;
  });

  const myOrders = ORDERS.filter(o => o.repId === repId);
  const recentOrders = myOrders.slice(0, 5);

  const handleCollect = (customerId: string, customerName: string) => {
    const amt = parseFloat(amounts[customerId] ?? '0');
    if (!amt || amt <= 0) return;
    recordCollection(amt);
    addTimelineEntry({
      customerId,
      type: 'Payment',
      repId,
      repName: user?.name ?? '',
      timestamp: new Date().toISOString(),
      notes: `Cash collection logged: £${amt.toFixed(2)}`,
      amount: amt,
    });
    setCollected(prev => ({ ...prev, [customerId]: true }));
    setCollectingId(null);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-slate-800">Payments</h1>
        <p className="text-sm text-slate-500 mt-1">Collections due and your commission</p>
      </div>

      {/* Today Collection Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card padding="md">
          <div className="h-9 w-9 bg-emerald-50 rounded-xl flex items-center justify-center mb-2">
            <Wallet className="h-5 w-5 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-slate-800">£{todayStats.collections.toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-0.5">Collected Today</p>
        </Card>
        <Card padding="md">
          <div className="h-9 w-9 bg-amber-50 rounded-xl flex items-center justify-center mb-2">
            <Clock className="h-5 w-5 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-slate-800">{customersDue.length}</p>
          <p className="text-xs text-slate-400 mt-0.5">Due Collections</p>
        </Card>
        <Card padding="md">
          <div className="h-9 w-9 bg-blue-50 rounded-xl flex items-center justify-center mb-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
          </div>
          <p className="text-2xl font-black text-slate-800">£{MOCK_COMMISSION.earned}</p>
          <p className="text-xs text-slate-400 mt-0.5">Commission Earned</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Collections Due */}
        <Card padding="md">
          <h3 className="text-sm font-bold text-slate-700 mb-4">Collections Due</h3>
          {customersDue.length === 0 ? (
            <div className="text-center py-10">
              <CheckCircle className="h-8 w-8 text-emerald-300 mx-auto mb-2" />
              <p className="text-sm text-slate-400">No collections outstanding</p>
            </div>
          ) : (
            <div className="space-y-3">
              {customersDue.map(c => {
                const unpaidOrders = ORDERS.filter(o => o.customerId === c.id && o.paymentStatus === 'Pending' && o.repId === repId);
                const unpaidTotal = unpaidOrders.reduce((s, o) => s + o.total, 0);
                const dueAmount = Math.abs(c.walletBalance) + unpaidTotal;
                const isCollecting = collectingId === c.id;
                const isDone = collected[c.id];

                return (
                  <div key={c.id} className={`p-4 rounded-xl border transition-all ${isDone ? 'border-emerald-200 bg-emerald-50' : 'border-rose-100 bg-rose-50'}`}>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <p className="text-sm font-bold text-slate-800">{c.storeName}</p>
                        <p className="text-xs text-slate-400">{c.name}</p>
                      </div>
                      {isDone ? (
                        <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                          <CheckCircle className="h-3.5 w-3.5" /> Collected
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-bold text-rose-600">
                          <AlertCircle className="h-3.5 w-3.5" /> £{dueAmount.toFixed(2)} due
                        </span>
                      )}
                    </div>

                    {!isDone && (
                      isCollecting ? (
                        <div className="flex gap-2">
                          <input
                            type="number"
                            value={amounts[c.id] ?? ''}
                            onChange={e => setAmounts(prev => ({ ...prev, [c.id]: e.target.value }))}
                            placeholder="Amount £"
                            min="0"
                            step="0.01"
                            className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
                          />
                          <button onClick={() => handleCollect(c.id, c.storeName)}
                            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-colors">
                            Save
                          </button>
                          <button onClick={() => setCollectingId(null)}
                            className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-500">
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => setCollectingId(c.id)}
                          className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-colors">
                          Log Collection
                        </button>
                      )
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Commission Widget */}
        <div className="space-y-4">
          <Card padding="md">
            <h3 className="text-sm font-bold text-slate-700 mb-4">My Commission</h3>
            <div className="space-y-3">
              {[
                { label: 'Earned',  value: MOCK_COMMISSION.earned,  color: 'text-emerald-600', bg: 'bg-emerald-50', icon: <CheckCircle className="h-4 w-4 text-emerald-500" /> },
                { label: 'Pending', value: MOCK_COMMISSION.pending, color: 'text-amber-600',   bg: 'bg-amber-50',   icon: <Clock className="h-4 w-4 text-amber-500" /> },
                { label: 'Blocked', value: MOCK_COMMISSION.blocked, color: 'text-rose-600',    bg: 'bg-rose-50',    icon: <AlertCircle className="h-4 w-4 text-rose-500" /> },
              ].map(item => (
                <div key={item.label} className={`flex items-center justify-between p-3 ${item.bg} rounded-xl`}>
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <span className="text-sm font-semibold text-slate-700">{item.label}</span>
                  </div>
                  <span className={`text-sm font-black ${item.color}`}>£{item.value.toFixed(2)}</span>
                </div>
              ))}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span className="text-xs text-slate-500">Commission rate</span>
                <span className="text-xs font-bold text-slate-700">{MOCK_COMMISSION.rate} of paid orders</span>
              </div>
            </div>
          </Card>

          {/* Recent Orders */}
          <Card padding="md">
            <h3 className="text-sm font-bold text-slate-700 mb-3">Recent Orders</h3>
            <div className="space-y-2">
              {recentOrders.map(order => (
                <div key={order.id} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                  <div>
                    <p className="text-xs font-bold text-slate-700">#{order.id} · {order.customer}</p>
                    <p className="text-xs text-slate-400">{order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-800">£{order.total.toLocaleString()}</p>
                    <span className={`text-xs font-medium ${order.paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RepPayments;
