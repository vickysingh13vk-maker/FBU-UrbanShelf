import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, Mail, ShoppingCart, Wallet, Plus, Calendar, CheckCircle, Clock } from 'lucide-react';
import { Card } from '../../components/ui';
import LifecycleBadge from '../../components/sales/LifecycleBadge';
import CustomerTimelineItem from '../../components/sales/CustomerTimelineItem';
import TimelineLogForm from '../../components/sales/TimelineLogForm';
import VisitWorkflowModal from '../../components/sales/VisitWorkflowModal';
import { useSalesCRM } from '../../context/SalesCRMContext';
import { useSalesExecution } from '../../context/SalesExecutionContext';
import { useAuth } from '../../context/AuthContext';
import { useCheckIn } from '../../context/CheckInContext';
import { TimelineEventType } from '../../types';

const RepCustomerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { customers, getCustomerTimeline, addTimelineEntry } = useSalesCRM();
  const { getRepFollowUps, completeFollowUp, addFollowUp, orders } = useSalesExecution();
  const { checkIn, checkOut, checkedInCustomer } = useCheckIn();
  const [showLogForm, setShowLogForm] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);
  const [visitModal, setVisitModal] = useState<{ customerId: string; customerName: string } | null>(null);

  const customer = customers.find(c => c.id === id);
  const timeline = id ? getCustomerTimeline(id) : [];
  const repId = user?.id ?? '';
  const customerOrders = orders.filter(o => o.customerId === id).slice(0, 5);
  const isCheckedIn = checkedInCustomer?.id === id;
  const customerFollowUps = getRepFollowUps(repId).filter(f => f.customerId === id && f.status !== 'Cancelled');

  if (!customer) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400">Customer not found</p>
        <button onClick={() => navigate('/sales/customers')} className="mt-4 text-indigo-500 text-sm font-semibold">← Back</button>
      </div>
    );
  }

  const totalOrders = orders.filter(o => o.customerId === id).length;
  const totalRevenue = orders.filter(o => o.customerId === id && o.paymentStatus === 'Paid').reduce((s, o) => s + o.total, 0);
  const lastOrder = customerOrders[0];

  const handleLogActivity = (customerId: string, type: TimelineEventType, notes: string, outcome: string, nextAction: string, amount?: number) => {
    addTimelineEntry({
      customerId,
      type,
      repId: user?.id ?? '',
      repName: user?.name ?? '',
      timestamp: new Date().toISOString(),
      notes,
      outcome: outcome || undefined,
      nextAction: nextAction || undefined,
      amount,
    });
    setShowLogForm(false);
  };

  const handleCheckIn = async () => {
    setCheckingIn(true);
    await checkIn(customer);
    setCheckingIn(false);
  };

  return (
    <div className="space-y-5">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors group w-fit">
        <div className="p-1.5 bg-slate-100 group-hover:bg-slate-200 rounded-lg transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </div>
        Back
      </button>

      {/* Customer Header */}
      <Card padding="md">
        <div className="flex items-start gap-4">
          <img
            src={customer.image ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(customer.storeName)}&background=e0e7ff&color=6366f1`}
            className="h-16 w-16 rounded-2xl object-cover flex-shrink-0"
            alt={customer.storeName}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h1 className="text-lg font-black text-slate-800">{customer.storeName}</h1>
                <p className="text-xs text-slate-500">{customer.companyName} · {customer.name}</p>
              </div>
              <LifecycleBadge stage={customer.lifecycleStage ?? 'Active'} size="md" />
            </div>
            <div className="flex flex-wrap items-center gap-4 mt-3">
              <a href={`tel:${customer.phone}`} onClick={e => e.stopPropagation()}
                className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-indigo-600">
                <Phone className="h-3.5 w-3.5" />{customer.phone}
              </a>
              <a href={`mailto:${customer.email}`} onClick={e => e.stopPropagation()}
                className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-indigo-600">
                <Mail className="h-3.5 w-3.5" />{customer.email}
              </a>
              <span className="flex items-center gap-1.5 text-xs text-slate-500">
                <MapPin className="h-3.5 w-3.5" />{customer.address}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4 pt-4 border-t border-slate-50 flex-wrap">
          <button onClick={isCheckedIn ? checkOut : handleCheckIn} disabled={checkingIn}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
              isCheckedIn ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}>
            <MapPin className="h-4 w-4" />
            {checkingIn ? 'Locating...' : isCheckedIn ? 'Check Out' : 'Check In'}
          </button>
          <button onClick={() => navigate('/sales/orders', { state: { customerId: customer.id, customerName: customer.storeName } })}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
            <ShoppingCart className="h-4 w-4" /> View Orders
          </button>
          <button onClick={() => navigate('/sales/payments', { state: { customerId: customer.id } })}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
            <Wallet className="h-4 w-4" /> Log Payment
          </button>
          <button onClick={() => setShowLogForm(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors ml-auto">
            <Plus className="h-4 w-4" /> Log Activity
          </button>
        </div>
      </Card>

      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { label: 'Outstanding', value: customer.walletBalance < 0 ? `£${Math.abs(customer.walletBalance).toFixed(0)}` : '£0', color: customer.walletBalance < 0 ? 'text-rose-600' : 'text-emerald-600' },
          { label: 'Total Orders', value: totalOrders, color: 'text-slate-800' },
          { label: 'Total Revenue', value: `£${totalRevenue.toLocaleString()}`, color: 'text-slate-800' },
          { label: 'Last Order', value: lastOrder ? lastOrder.date : '—', color: 'text-slate-800' },
        ].map(kpi => (
          <div key={kpi.label} className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
            <p className={`text-xl font-black ${kpi.color}`}>{kpi.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{kpi.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Timeline */}
        <div className="lg:col-span-2">
          <Card padding="md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-700">Communication Timeline</h3>
              <button onClick={() => setShowLogForm(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-semibold hover:bg-indigo-100 transition-colors">
                <Plus className="h-3.5 w-3.5" /> Log
              </button>
            </div>
            {timeline.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-sm text-slate-400">No activity recorded yet</p>
                <button onClick={() => setShowLogForm(true)} className="mt-3 text-indigo-500 text-xs font-semibold">Add first activity →</button>
              </div>
            ) : (
              <div>
                {timeline.map((item, idx) => (
                  <CustomerTimelineItem key={item.id} item={item} isLast={idx === timeline.length - 1} />
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Follow-Ups */}
          <Card padding="md">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-700">Follow-Ups</h3>
              <button
                onClick={() => addFollowUp({
                  repId, repName: user?.name ?? '', customerId: customer.id, customerName: customer.storeName,
                  type: 'Call', priority: 'Medium',
                  scheduledDate: new Date(Date.now() + 86400000).toISOString(),
                  notes: '', status: 'Pending',
                })}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-semibold hover:bg-indigo-100 transition-colors">
                <Plus className="h-3 w-3" /> Add
              </button>
            </div>
            {customerFollowUps.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">No follow-ups scheduled</p>
            ) : (
              <div className="space-y-2">
                {customerFollowUps.slice(0, 4).map(fu => (
                  <div key={fu.id} className={`flex items-start gap-2.5 p-2.5 rounded-xl border ${
                    fu.status === 'Completed' ? 'bg-emerald-50 border-emerald-100' :
                    new Date(fu.scheduledDate) < new Date() ? 'bg-rose-50 border-rose-100' : 'bg-slate-50 border-slate-100'
                  }`}>
                    {fu.status === 'Completed'
                      ? <CheckCircle className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      : <Clock className={`h-3.5 w-3.5 flex-shrink-0 mt-0.5 ${new Date(fu.scheduledDate) < new Date() ? 'text-rose-500' : 'text-amber-500'}`} />
                    }
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-700">{fu.type}</p>
                      <p className="text-xs text-slate-400">{new Date(fu.scheduledDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
                      {fu.notes && <p className="text-xs text-slate-400 mt-0.5 truncate">{fu.notes}</p>}
                    </div>
                    {fu.status === 'Pending' && (
                      <button onClick={() => completeFollowUp(fu.id, 'Completed from customer detail')}
                        className="text-xs text-emerald-600 font-semibold hover:text-emerald-800 flex-shrink-0">
                        Done
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Orders */}
          <Card padding="md">
            <h3 className="text-sm font-bold text-slate-700 mb-4">Recent Orders</h3>
            {customerOrders.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-6">No orders yet</p>
            ) : (
              <div className="space-y-2">
                {customerOrders.map(order => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div>
                      <p className="text-xs font-bold text-slate-700">#{order.id}</p>
                      <p className="text-xs text-slate-400">{order.date} · {order.items} items</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-800">£{order.total.toLocaleString()}</p>
                      <span className={`text-xs font-medium ${
                        order.status === 'Delivered' ? 'text-emerald-600' :
                        order.status === 'Cancelled' ? 'text-rose-500' : 'text-amber-600'
                      }`}>{order.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div> {/* end right column */}
      </div>

      {showLogForm && (
        <TimelineLogForm
          onSave={handleLogActivity}
          onClose={() => setShowLogForm(false)}
          customerId={customer.id}
          customerName={customer.storeName}
          onLaunchVisit={(customerId, customerName) => {
            setShowLogForm(false);
            if (customerId && customerName) {
              setVisitModal({ customerId, customerName });
            }
          }}
          onLaunchOrder={(customerId, customerName) => {
            setShowLogForm(false);
            navigate('/sales/orders/new', {
              state: { customerId, customerName, repId, returnPath: location.pathname },
            });
          }}
        />
      )}

      {visitModal && (
        <VisitWorkflowModal
          customerId={visitModal.customerId}
          customerName={visitModal.customerName}
          onComplete={() => setVisitModal(null)}
          onClose={() => setVisitModal(null)}
        />
      )}
    </div>
  );
};

export default RepCustomerDetail;
