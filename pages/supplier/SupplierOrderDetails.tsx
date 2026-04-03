import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Truck, MapPin, Calendar, Package, Download, Printer, MoreHorizontal, CheckCircle2, Clock, CreditCard, Activity } from 'lucide-react';
import { 
  Card, Button, Badge, CardHeader, Table, THead, TBody, TR, TH, TD
} from '../../components/ui';
import { useSupplier } from '../../context/SupplierContext';

const SupplierOrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { orders } = useSupplier();

  const order = useMemo(() => {
    return orders.find(o => o.id === id);
  }, [orders, id]);

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <div className="p-4 bg-slate-100 rounded-full">
          <ShoppingCart className="h-12 w-12 text-slate-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Order Not Found</h2>
        <p className="text-slate-500">The order you are looking for does not exist or has been removed.</p>
        <Link to="/supplier/orders">
          <Button variant="primary">Back to Orders</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/supplier/orders" className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-900 transition-all shadow-sm hover:shadow-md">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Order Details</h1>
              <p className="text-slate-500 font-medium mt-1">Order ID: {order.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" icon={<Printer className="h-4 w-4" />}>Print Invoice</Button>
            <Button variant="primary" icon={<Download className="h-4 w-4" />}>Download PDF</Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 space-y-5">
          {/* Order Info Card */}
          <Card className="p-8">
            <div className="flex flex-col md:flex-row justify-between gap-5 pb-5 border-b border-slate-100">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">{order.id}</h2>
                  <Badge 
                    variant={
                      order.status === 'DELIVERED' ? 'success' :
                      order.status === 'SHIPPED' ? 'info' :
                      order.status === 'CANCELLED' ? 'danger' : 'primary'
                    }
                    className="font-bold"
                  >
                    {order.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {order.date}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    10:30 AM
                  </div>
                </div>
              </div>
              <div className="md:text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Amount</p>
                <p className="text-3xl font-black text-indigo-600 tracking-tight">£{order.amount.toFixed(2)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 py-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-400">
                  <ShoppingCart className="h-4 w-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Customer</span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-900">{order.buyer}</p>
                  <p className="text-xs text-slate-500 font-medium">customer@vapeworld.com</p>
                  <p className="text-xs text-slate-500 font-medium">+44 20 1234 5678</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-400">
                  <MapPin className="h-4 w-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Shipping Address</span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-900">London Logistics Center</p>
                  <p className="text-xs text-slate-500 font-medium">45 Warehouse Road</p>
                  <p className="text-xs text-slate-500 font-medium">London, E1 6AN, UK</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-400">
                  <Truck className="h-4 w-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Shipping Method</span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-900">Next Day Delivery</p>
                  <p className="text-xs text-slate-500 font-medium">Carrier: DPD</p>
                  <p className="text-xs text-slate-500 font-medium">Tracking: DPD-123456789</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Order Items Table */}
          <Card padding="none" className="overflow-hidden">
            <div className="p-8 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Order Items</h3>
              <p className="text-sm text-slate-500 font-medium">Products included in this order</p>
            </div>
            <Table>
              <THead>
                <TR>
                  <TH className="pl-8">Product</TH>
                  <TH>Quantity</TH>
                  <TH>Price</TH>
                  <TH align="right" className="pr-8">Total</TH>
                </TR>
              </THead>
              <TBody>
                <TR className="hover:bg-slate-50/50 transition-colors">
                  <TD className="pl-8">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 border border-slate-100">
                        <Package className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{order.product}</p>
                        <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">SKU: {order.id}-ITEM</p>
                      </div>
                    </div>
                  </TD>
                  <TD className="font-black text-slate-900 tabular-nums">{order.quantity}</TD>
                  <TD className="text-slate-600 font-medium tabular-nums">£{(order.amount / order.quantity).toFixed(2)}</TD>
                  <TD align="right" className="pr-8 font-black text-slate-900 tabular-nums">£{order.amount.toFixed(2)}</TD>
                </TR>
              </TBody>
            </Table>
          </Card>
        </div>

        {/* Sidebar Summary */}
        <div className="lg:col-span-4 space-y-5">
          <Card className="p-8 space-y-5">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Order Summary</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-bold text-slate-900 tabular-nums">£{order.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span className="text-slate-500">Shipping</span>
                <span className="font-bold text-slate-900 tabular-nums">£0.00</span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span className="text-slate-500">Tax (20%)</span>
                <span className="font-bold text-slate-900 tabular-nums">£{(order.amount * 0.2).toFixed(2)}</span>
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                <span className="text-base font-bold text-slate-900">Total</span>
                <span className="text-2xl font-black text-indigo-600 tabular-nums">£{(order.amount * 1.2).toFixed(2)}</span>
              </div>
            </div>
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3">
              <div className="p-2 bg-white rounded-xl text-emerald-600 shadow-sm">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-900">Payment Received</p>
                <p className="text-[10px] text-emerald-700 font-medium">Paid via Bank Transfer</p>
              </div>
            </div>
          </Card>

          <Card className="p-8 space-y-5">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Fulfillment Status</h3>
            </div>
            <div className="space-y-5 relative">
              <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-slate-100" />
              {[
                { status: 'Delivered', date: 'Apr 01, 10:30 AM', active: order.status === 'DELIVERED', icon: CheckCircle2 },
                { status: 'Shipped', date: 'Mar 31, 02:15 PM', active: ['DELIVERED', 'SHIPPED'].includes(order.status), icon: Truck },
                { status: 'Processing', date: 'Mar 30, 09:00 AM', active: true, icon: Clock },
              ].map((step, i) => (
                <div key={i} className="flex gap-6 relative z-10">
                  <div className={`h-5 w-5 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    step.active ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-200 bg-white text-slate-300'
                  }`}>
                    <step.icon className="h-3 w-3" />
                  </div>
                  <div className="space-y-1">
                    <p className={`text-sm font-bold transition-colors ${step.active ? 'text-slate-900' : 'text-slate-400'}`}>{step.status}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{step.date}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="secondary" className="w-full h-12 rounded-xl font-bold" icon={<MoreHorizontal className="h-4 w-4" />}>Manage Fulfillment</Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SupplierOrderDetails;
