import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, CreditCard, Wallet, DollarSign, CheckCircle, Clock, 
  UsersRound, Building, MapPin, LayoutList, Lock, Save, X, FileText, Eye, Edit2, AlertTriangle, Printer, FileDown,
  Mail, Phone, ChevronDown, ChevronUp, User, Globe, Hash, Building2, RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Card, Button, Input, Badge, Modal, Select, 
  Section, Grid, Table, THead, TBody, TR, TH, TD, KpiCard, StatBox, Tabs, UnderlineTabs, CardHeader, TextArea
} from '../components/ui';
import { CUSTOMERS, ORDERS } from '../data';
import { Customer, Order } from '../types';

interface CustomerDetailsPageProps {
  mode: 'view' | 'edit';
}

// Temporary Item type for the Price Edit Modal
interface TempOrderItem {
  id: number;
  name: string;
  price: number;
  qty: number;
}

const CustomerDetailsPage: React.FC<CustomerDetailsPageProps> = ({ mode }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'details' | 'financials' | 'orders'>('details');

  // Find customer
  const customer = useMemo(() => CUSTOMERS.find(c => c.id === id), [id]);

  // Local state for orders to simulate updates
  const [localOrders, setLocalOrders] = useState<Order[]>(ORDERS);

  // Status Update & Detail Modal State
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<string>('');

  // --- Price Editing State ---
  const [isPriceEditModalOpen, setIsPriceEditModalOpen] = useState(false);
  const [editingItems, setEditingItems] = useState<TempOrderItem[]>([]);
  const [editingDiscount, setEditingDiscount] = useState<number>(0);
  const [editingCouponCode, setEditingCouponCode] = useState<string>('');
  const [editingOrderRef, setEditingOrderRef] = useState<Order | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    mobile: '',
    companyName: '',
    regNo: '',
    storeName: '',
    address1: '',
    address2: '',
    city: '',
    postcode: '',
    creditLimit: '0'
  });

  // Load data into form on mount
  useEffect(() => {
    if (customer) {
      const [first, ...last] = customer.name.split(' ');
      const parts = customer.address.split(',').map(s => s.trim());
      setFormData({
        firstName: first || '',
        lastName: last.join(' ') || '',
        email: customer.email,
        phone: customer.phone,
        mobile: customer.mobile || '',
        companyName: customer.companyName,
        regNo: customer.regNo,
        storeName: customer.storeName,
        address1: parts[0] || '',
        address2: '',
        city: parts[1] || '',
        postcode: parts[2] || '',
        creditLimit: customer.creditLimit.toString()
      });
    }
  }, [customer]);

  if (!customer) {
    return (
        <div className="flex flex-col items-center justify-center h-96">
            <h2 className="text-xl font-bold text-slate-900">Customer not found</h2>
            <Button variant="secondary" className="mt-4" onClick={() => navigate('/customers')}>Back to Customers</Button>
        </div>
    );
  }

  // --- Financial Calculations ---
  const outstandingBalance = customer.walletBalance < 0 ? Math.abs(customer.walletBalance) : 0;
  const currentCreditLimit = parseFloat(formData.creditLimit) || 0;
  const availableCredit = Math.max(0, currentCreditLimit - outstandingBalance);

  // Use localOrders for calculations to reflect updates
  const customerOrders = localOrders.filter(o => o.customer === customer.name);

  const totalPaid = customerOrders
    .filter(o => o.status === 'Delivered' || o.status === 'Processing')
    .reduce((sum, o) => sum + o.total, 0);

  // --- Handlers ---
  const handleSave = () => {
    // In a real app, API call here.
    if (customer) {
        customer.name = `${formData.firstName} ${formData.lastName}`;
        customer.email = formData.email;
        customer.phone = formData.phone;
        customer.mobile = formData.mobile;
        customer.companyName = formData.companyName;
        customer.storeName = formData.storeName;
        customer.regNo = formData.regNo;
        customer.address = `${formData.address1}, ${formData.city} ${formData.postcode}`;
        customer.creditLimit = parseFloat(formData.creditLimit);
    }
    navigate(`/customers/${id}`); // Go back to view mode
  };

  const isReadOnly = mode === 'view';

  // --- Status Update Logic ---
  const openStatusModal = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus('');
    setIsStatusModalOpen(true);
  };

  const handleUpdateStatusConfirm = () => {
    if (selectedOrder && newStatus) {
      setLocalOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, status: newStatus as any } : o));
      setIsStatusModalOpen(false);
      setIsDetailModalOpen(false); 
      setSelectedOrder(null);
    }
  };

  const openDetailModal = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  // --- Price Edit Logic ---
  const openPriceEditModal = (order: Order, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingOrderRef(order);
    
    const simulatedItems: TempOrderItem[] = Array.from({ length: order.items }).map((_, i) => ({
      id: i,
      name: `Product Item ${i + 1}`,
      price: parseFloat((order.total / order.items).toFixed(2)),
      qty: 1
    }));
    
    const currentSimTotal = simulatedItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const diff = order.total - currentSimTotal;
    if (simulatedItems.length > 0) {
      simulatedItems[0].price += diff;
    }

    setEditingItems(simulatedItems);
    setEditingDiscount(0);
    setEditingCouponCode('');
    setIsPriceEditModalOpen(true);
  };

  const handleItemChange = (index: number, field: keyof TempOrderItem, value: number) => {
    setEditingItems(prev => {
      const next = [...prev];
      // @ts-ignore
      next[index][field] = value;
      return next;
    });
  };

  const calculateEditingTotal = () => {
    const subtotal = editingItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
    return Math.max(0, subtotal - editingDiscount);
  };

  const handleSavePriceEdit = () => {
    if (!editingOrderRef) return;

    const newTotal = calculateEditingTotal();
    const newItemsCount = editingItems.reduce((acc, item) => acc + item.qty, 0);
    
    const isApproved = ['Processing', 'Shipped', 'Completed'].includes(editingOrderRef.status);
    let shouldRevertStatus = false;

    if (isApproved) {
      if (!window.confirm("Editing the price will change the order status to Not Approved (Pending). Do you want to continue?")) {
        return;
      }
      shouldRevertStatus = true;
    }

    const updatedOrder = {
      ...editingOrderRef,
      total: newTotal,
      items: newItemsCount,
      status: shouldRevertStatus ? 'Pending' as const : editingOrderRef.status
    };

    setLocalOrders(prev => prev.map(o => o.id === editingOrderRef.id ? updatedOrder : o));
    
    if (selectedOrder && selectedOrder.id === editingOrderRef.id) {
        setSelectedOrder(updatedOrder);
    }

    setIsPriceEditModalOpen(false);
    setEditingOrderRef(null);
  };

   const [isReversalModalOpen, setIsReversalModalOpen] = useState(false);
  const [reversalData, setReversalData] = useState({
    orderId: '',
    customer: '',
    reversalType: 'Add Stock Back' as 'Add Stock Back' | 'Damaged / Write-off',
    reason: 'Customer Return',
    reversalQuantity: 0,
    notes: '',
    product: '',
    flavour: 'Standard',
    originalQuantity: 0
  });

  const SIMULATED_ORDER_ITEMS = [
    { name: "Premium Office Chair", qty: 2, price: "150.00", flavour: "Black" },
    { name: "Ergonomic Keyboard", qty: 1, price: "85.00", flavour: "Standard" }
  ];

  const handleReverseStockConfirm = () => {
    // In a real app, this would call an API or context function
    console.log('Stock Reversal Recorded:', reversalData);
    setIsReversalModalOpen(false);
    setIsDetailModalOpen(false);
    alert(`Stock reversal for Order #${reversalData.orderId} has been recorded.`);
  };

  const renderOrderDetails = () => {
    if (!selectedOrder) return null;
    const tax = selectedOrder.total * 0.2; // Mock 20% Tax
    const subtotal = selectedOrder.total - tax;

    // Simulate Items
    const displayItems = Array.from({ length: Math.min(3, selectedOrder.items) }).map((_, i) => ({
       name: i === 0 ? "Premium Office Chair" : i === 1 ? "Ergonomic Keyboard" : "USB-C Hub",
       qty: Math.ceil(selectedOrder.items / 3),
       price: (selectedOrder.total / selectedOrder.items).toFixed(2)
    }));

    return (
      <div className="space-y-6">
         {/* Customer & Order Info Header */}
         <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 flex flex-col md:flex-row justify-between gap-6">
            <div className="flex gap-4">
               <div className="h-12 w-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 text-lg font-bold shadow-sm overflow-hidden">
                  {customer.image ? <img src={customer.image} alt="" className="h-full w-full object-cover" /> : selectedOrder.customer.charAt(0)}
               </div>
               <div>
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wide">Customer</p>
                  <h3 className="text-lg font-bold text-slate-900">{selectedOrder.customer}</h3>
                  <div className="text-sm text-slate-500 mt-0.5">{customer.email}</div>
                  <div className="text-xs text-slate-400 mt-1">{selectedOrder.date}</div>
               </div>
            </div>
            
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
               <div>
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wide">Order ID</p>
                  <p className="font-mono font-medium text-slate-900">#{selectedOrder.id}</p>
               </div>
               <div>
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wide">Status</p>
                  <Badge variant={selectedOrder.status === 'Delivered' ? 'success' : selectedOrder.status === 'Cancelled' ? 'danger' : 'warning'}>
                     {selectedOrder.status}
                  </Badge>
               </div>
               <div>
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wide mt-2">Payment Status</p>
                  <div className="font-medium text-slate-900">{selectedOrder.paymentStatus}</div>
               </div>
               <div>
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wide mt-2">Total</p>
                  <p className="font-bold text-slate-900">£{selectedOrder.total.toFixed(2)}</p>
               </div>
            </div>
         </div>

         {/* Delivery Address */}
         <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h4 className="text-sm font-bold text-slate-900 mb-2">Delivery Address</h4>
            <div className="flex items-start gap-2 text-sm text-slate-600">
               <MapPin className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
               <span>{customer.address !== 'N/A' ? customer.address : 'No address provided'}</span>
            </div>
         </div>

         {/* Order Items */}
         <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 text-sm font-bold text-slate-900">
               Order Items
            </div>
            <div className="divide-y divide-slate-100">
               {displayItems.map((item, idx) => (
                  <div key={idx} className="p-4 flex items-center justify-between group hover:bg-slate-50 transition-colors">
                     <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-slate-100 border border-slate-200"></div>
                        <div>
                           <div className="text-sm font-medium text-slate-900 mb-1">{item.name}</div>
                           <div className="text-xs text-slate-500">Qty: {item.qty} × £{item.price}</div>
                        </div>
                     </div>
                     <div className="text-sm font-bold text-slate-900">
                        £{(item.qty * parseFloat(item.price)).toFixed(2)}
                     </div>
                  </div>
               ))}
               {selectedOrder.items > 3 && (
                  <div className="p-3 text-center text-xs text-slate-500 bg-slate-50/50">
                     + {selectedOrder.items - 3} more items...
                  </div>
               )}
            </div>
         </div>

         {/* Financial Breakdown */}
         <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-2">
            <div className="flex justify-between text-sm text-slate-600">
               <span>Subtotal</span>
               <span className="font-medium">£{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-600">
               <span>Tax (20%)</span>
               <span className="font-medium">£{tax.toFixed(2)}</span>
            </div>
            <div className="border-t border-slate-200 my-2 pt-2 flex justify-between items-center">
               <span className="text-base font-bold text-slate-900">Total</span>
               <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-slate-900">£{selectedOrder.total.toFixed(2)}</span>
                  {selectedOrder.status !== 'Delivered' && selectedOrder.status !== 'Cancelled' && (
                     <button 
                       onClick={(e) => { setIsDetailModalOpen(false); openPriceEditModal(selectedOrder, e); }}
                       className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 hover:border-indigo-200 shadow-sm transition-all"
                       title="Edit Price"
                     >
                        <Edit2 className="h-4 w-4" />
                     </button>
                  )}
               </div>
            </div>
         </div>
      </div>
    );
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
           <button 
             onClick={() => navigate('/customers')}
             className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
           >
             <ArrowLeft className="h-6 w-6" />
           </button>
           <div>
             <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                {customer.name}
                {mode === 'edit' && <Badge variant="warning">Editing</Badge>}
             </h1>
             <p className="text-slate-500 text-sm">{customer.companyName} • {customer.id}</p>
           </div>
        </div>
        <div className="flex gap-3">
           {mode === 'view' ? (
              <Button 
                onClick={() => navigate(`/customers/${id}/edit`)}
                icon={<Lock className="h-4 w-4" />}
              >
                 Edit Profile
              </Button>
           ) : (
              <>
                 <Button variant="secondary" onClick={() => navigate(`/customers/${id}`)}>Cancel</Button>
                 <Button variant="primary" icon={<Save className="h-4 w-4" />} onClick={handleSave}>Save Changes</Button>
              </>
           )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <UnderlineTabs 
          tabs={[
            { id: 'details', label: 'Profile Details' },
            { id: 'financials', label: 'Credit & Financials' },
            { id: 'orders', label: `Orders (${customerOrders.length})` }
          ]}
          activeTab={activeTab}
          onChange={(id) => setActiveTab(id as any)}
        />
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
         
         {/* PROFILE TAB */}
         {activeTab === 'details' && (
            <div className="space-y-6 animate-fadeIn max-w-3xl">
               {/* Main Profile Card */}
               <Card className="overflow-hidden border-none shadow-xl shadow-slate-200/50 ring-1 ring-slate-200">
                  <div className="bg-gradient-to-r from-indigo-600 to-violet-600 h-32 relative">
                     <div className="absolute -bottom-12 left-8 flex items-end gap-6">
                        <div className="h-24 w-24 rounded-2xl bg-white p-1 shadow-lg ring-4 ring-white/20">
                           <div className="h-full w-full rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 text-3xl font-bold overflow-hidden">
                              {customer.image ? (
                                 <img src={customer.image} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                              ) : (
                                 customer.name.charAt(0)
                              )}
                           </div>
                        </div>
                        <div className="pb-2">
                           <h2 className="text-2xl font-bold text-white drop-shadow-sm">{customer.name}</h2>
                           <p className="text-indigo-100 text-sm font-medium flex items-center gap-2">
                              <Badge variant="info" className="bg-white/20 text-white border-none backdrop-blur-md">
                                 {customer.status}
                              </Badge>
                              <span className="opacity-80">•</span>
                              <span>Joined {customer.joinedDate}</span>
                           </p>
                        </div>
                     </div>
                  </div>

                  <div className="pt-16 pb-8 px-8">
                     <div className="flex flex-wrap items-center gap-x-12 gap-y-6">
                        <div className="flex items-center gap-3">
                           <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                              <Mail className="h-4 w-4" />
                           </div>
                           <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</p>
                              <p className="text-sm font-semibold text-slate-900">{customer.email}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-3">
                           <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                              <Phone className="h-4 w-4" />
                           </div>
                           <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phone Number</p>
                              <p className="text-sm font-semibold text-slate-900">{customer.phone}</p>
                           </div>
                        </div>
                        {customer.mobile && (
                          <div className="flex items-center gap-3">
                             <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                                <Phone className="h-4 w-4" />
                             </div>
                             <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mobile Number</p>
                                <p className="text-sm font-semibold text-slate-900">{customer.mobile}</p>
                             </div>
                          </div>
                        )}
                        <div className="flex items-center gap-3">
                           <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                              <Building2 className="h-4 w-4" />
                           </div>
                           <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Company</p>
                              <p className="text-sm font-semibold text-slate-900">{customer.companyName}</p>
                           </div>
                        </div>
                        <div className="ml-auto">
                           {mode === 'view' && (
                              <Button 
                                 variant="ghost" 
                                 size="sm" 
                                 onClick={() => setIsExpanded(!isExpanded)}
                                 className="text-indigo-600 hover:bg-indigo-50 font-bold text-xs uppercase tracking-widest transition-all"
                                 icon={isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                              >
                                 {isExpanded ? 'Hide Details' : 'View Full Details'}
                              </Button>
                           )}
                        </div>
                     </div>

                     <AnimatePresence>
                        {(isExpanded || mode === 'edit') && (
                           <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                              className="overflow-hidden"
                           >
                              <div className="mt-10 pt-10 border-t border-slate-100 space-y-12">
                                 {/* Personal Details Section */}
                                 <section className="space-y-6">
                                    <div className="flex items-center justify-between">
                                       <div className="flex items-center gap-2 text-slate-900 font-bold">
                                          <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">
                                             <User className="h-4 w-4" />
                                          </div>
                                          <h3 className="text-sm uppercase tracking-wider">Personal Information</h3>
                                       </div>
                                       <div className="h-px flex-1 bg-slate-100 ml-4"></div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                       <Input 
                                          label="First Name" 
                                          value={formData.firstName} 
                                          onChange={e => setFormData({...formData, firstName: e.target.value})} 
                                          disabled={isReadOnly}
                                          placeholder="Enter first name"
                                       />
                                       <Input 
                                          label="Last Name" 
                                          value={formData.lastName} 
                                          onChange={e => setFormData({...formData, lastName: e.target.value})} 
                                          disabled={isReadOnly}
                                          placeholder="Enter last name"
                                       />
                                       {mode === 'edit' && (
                                          <>
                                             <Input 
                                                label="Email Address" 
                                                value={formData.email} 
                                                onChange={e => setFormData({...formData, email: e.target.value})} 
                                                icon={<Mail className="h-4 w-4" />}
                                                placeholder="email@example.com"
                                             />
                                             <Input 
                                                label="Phone Number" 
                                                value={formData.phone} 
                                                onChange={e => setFormData({...formData, phone: e.target.value})} 
                                                icon={<Phone className="h-4 w-4" />}
                                                placeholder="+44 0000 000000"
                                             />
                                             <Input 
                                                label="Mobile Number" 
                                                value={formData.mobile} 
                                                onChange={e => setFormData({...formData, mobile: e.target.value})} 
                                                icon={<Phone className="h-4 w-4" />}
                                                placeholder="+44 0000 000000"
                                             />
                                          </>
                                       )}
                                    </div>
                                 </section>

                                 {/* Business Details Section */}
                                 <section className="space-y-6">
                                    <div className="flex items-center justify-between">
                                       <div className="flex items-center gap-2 text-slate-900 font-bold">
                                          <div className="p-1.5 bg-amber-50 rounded-lg text-amber-600">
                                             <Building2 className="h-4 w-4" />
                                          </div>
                                          <h3 className="text-sm uppercase tracking-wider">Business Details</h3>
                                       </div>
                                       <div className="h-px flex-1 bg-slate-100 ml-4"></div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                       <div className="md:col-span-2">
                                          <Input 
                                             label="Company Name" 
                                             value={formData.companyName} 
                                             onChange={e => setFormData({...formData, companyName: e.target.value})} 
                                             disabled={isReadOnly}
                                             placeholder="Enter legal company name"
                                          />
                                       </div>
                                       <Input 
                                          label="Store Name (Trading As)" 
                                          value={formData.storeName} 
                                          onChange={e => setFormData({...formData, storeName: e.target.value})} 
                                          disabled={isReadOnly}
                                          icon={<Globe className="h-4 w-4" />}
                                          placeholder="Enter store name"
                                       />
                                       <Input 
                                          label="Registration Number" 
                                          value={formData.regNo} 
                                          onChange={e => setFormData({...formData, regNo: e.target.value})} 
                                          disabled={isReadOnly}
                                          icon={<Hash className="h-4 w-4" />}
                                          placeholder="GB00000000"
                                       />
                                    </div>
                                 </section>

                                 {/* Address Section */}
                                 <section className="space-y-6">
                                    <div className="flex items-center justify-between">
                                       <div className="flex items-center gap-2 text-slate-900 font-bold">
                                          <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600">
                                             <MapPin className="h-4 w-4" />
                                          </div>
                                          <h3 className="text-sm uppercase tracking-wider">Address Information</h3>
                                       </div>
                                       <div className="h-px flex-1 bg-slate-100 ml-4"></div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                       <div className="md:col-span-2">
                                          <Input 
                                             label="Address Line 1" 
                                             value={formData.address1} 
                                             onChange={e => setFormData({...formData, address1: e.target.value})} 
                                             disabled={isReadOnly}
                                             placeholder="Street address"
                                          />
                                       </div>
                                       <div className="md:col-span-2">
                                          <Input 
                                             label="Address Line 2" 
                                             value={formData.address2} 
                                             onChange={e => setFormData({...formData, address2: e.target.value})} 
                                             disabled={isReadOnly}
                                             placeholder="Apartment, suite, unit, etc. (optional)"
                                          />
                                       </div>
                                       <Input 
                                          label="City" 
                                          value={formData.city} 
                                          onChange={e => setFormData({...formData, city: e.target.value})} 
                                          disabled={isReadOnly}
                                          placeholder="Enter city"
                                       />
                                       <Input 
                                          label="Postcode" 
                                          value={formData.postcode} 
                                          onChange={e => setFormData({...formData, postcode: e.target.value})} 
                                          disabled={isReadOnly}
                                          placeholder="E.g. SW1A 1AA"
                                       />
                                    </div>
                                 </section>
                              </div>
                           </motion.div>
                        )}
                     </AnimatePresence>
                  </div>
               </Card>
            </div>
         )}

         {/* FINANCIALS TAB */}
         {activeTab === 'financials' && (
            <div className="space-y-6 animate-fadeIn">
               <Grid cols={4} gap={4}>
                  {/* Credit Limit Card (Editable in Edit Mode) - Custom Design */}
                  <Card className={`flex flex-col justify-between h-full relative ${mode === 'edit' ? 'ring-2 ring-indigo-500/20 border-indigo-200' : ''}`}>
                     <div className="p-6">
                        <div className="flex justify-between items-start">
                           <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 mb-4 inline-block">
                              <CreditCard className="h-6 w-6" />
                           </div>
                           {mode === 'edit' && <Badge variant="info">Editable</Badge>}
                        </div>
                        
                        <div className="mt-auto">
                           <p className="text-sm font-medium text-slate-500">Credit Limit</p>
                           {mode === 'edit' ? (
                              <div className="mt-2">
                                 <Input 
                                    type="number"
                                    value={formData.creditLimit}
                                    onChange={e => setFormData({...formData, creditLimit: e.target.value})}
                                    icon={<span className="text-slate-400 text-sm font-semibold">£</span>}
                                    className="text-lg font-bold"
                                 />
                              </div>
                           ) : (
                              <h3 className="text-3xl font-bold text-slate-900 mt-2 tracking-tight">£{currentCreditLimit.toLocaleString()}</h3>
                           )}
                           <p className="text-xs text-slate-400 mt-1">Max allowed credit</p>
                        </div>
                     </div>
                  </Card>

                  <KpiCard 
                     title="Outstanding Balance" 
                     value={`£${outstandingBalance.toLocaleString()}`} 
                     icon={Wallet} 
                     color="rose" 
                  />
                  <KpiCard 
                     title="Total Paid" 
                     value={`£${totalPaid.toLocaleString()}`} 
                     icon={DollarSign} 
                     color="emerald" 
                  />
                  <KpiCard 
                     title="Available Credit" 
                     value={`£${availableCredit.toLocaleString()}`} 
                     icon={CheckCircle} 
                     color="blue" 
                  />
               </Grid>
            </div>
         )}

         {/* ORDERS TAB */}
         {activeTab === 'orders' && (
            <div className="space-y-6 animate-fadeIn">
               <Card padding="none">
                  <Table>
                    <THead>
                      <TR>
                        <TH>Order ID</TH>
                        <TH>Date</TH>
                        <TH>Items</TH>
                        <TH>Total</TH>
                        <TH>Status</TH>
                        <TH align="center">Actions</TH>
                      </TR>
                    </THead>
                    <TBody>
                      {customerOrders.map((order) => (
                        <TR key={order.id} onClick={() => openDetailModal(order)} className="cursor-pointer">
                          <TD className="font-mono font-medium text-slate-900">#{order.id}</TD>
                          <TD className="text-slate-500">{order.date}</TD>
                          <TD className="text-slate-500">{order.items} items</TD>
                          <TD className="font-bold text-slate-900">£{order.total.toFixed(2)}</TD>
                          <TD>
                            <Badge variant={
                              order.status === 'Delivered' ? 'success' : 
                              order.status === 'Cancelled' ? 'danger' : 
                              order.status === 'Processing' ? 'info' : 'warning'
                            }>
                              {order.status}
                            </Badge>
                          </TD>
                          <TD align="center">
                            <div className="flex justify-center gap-2" onClick={e => e.stopPropagation()}>
                               <button 
                                 onClick={() => openDetailModal(order)}
                                 className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                 title="View Details"
                               >
                                  <Eye className="h-4 w-4" />
                               </button>
                               <button 
                                 onClick={() => openStatusModal(order)}
                                 className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                 title="Update Status"
                               >
                                  <LayoutList className="h-4 w-4" />
                               </button>
                               {order.status === 'Approved' && (
                                  <button 
                                    onClick={(e) => {
                                       e.stopPropagation();
                                       const firstItem = SIMULATED_ORDER_ITEMS[0];
                                       setReversalData({
                                          orderId: order.id,
                                          customer: order.customer,
                                          reversalType: 'Add Stock Back',
                                          reason: 'Customer Return',
                                          reversalQuantity: 0,
                                          notes: '',
                                          product: firstItem.name,
                                          flavour: firstItem.flavour || 'Standard',
                                          originalQuantity: firstItem.qty
                                       });
                                       setIsReversalModalOpen(true);
                                    }}
                                    className="p-2 text-amber-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                    title="Reverse Stock"
                                  >
                                     <RotateCcw className="h-4 w-4" />
                                  </button>
                               )}
                            </div>
                          </TD>
                        </TR>
                      ))}
                      {customerOrders.length === 0 && (
                        <TR>
                           <TD colSpan={6} className="py-12 text-center text-slate-500">
                              No orders found for this customer.
                           </TD>
                        </TR>
                      )}
                    </TBody>
                  </Table>
               </Card>
            </div>
         )}

         {/* MODALS */}
         
         {/* Status Update Modal */}
         <Modal 
            isOpen={isStatusModalOpen} 
            onClose={() => setIsStatusModalOpen(false)} 
            title="Update Order Status"
            footer={
               <div className="flex gap-3 justify-end w-full">
                  <Button variant="secondary" onClick={() => setIsStatusModalOpen(false)}>Cancel</Button>
                  <Button variant="primary" onClick={handleUpdateStatusConfirm} disabled={!newStatus}>Update Status</Button>
               </div>
            }
         >
            <div className="space-y-4">
               <p className="text-sm text-slate-600">
                  Select the new status for order <span className="font-mono font-bold text-slate-900">#{selectedOrder?.id}</span>.
               </p>
               <Select 
                  label="New Status" 
                  value={newStatus} 
                  onChange={e => setNewStatus(e.target.value)}
               >
                  <option value="">Select Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
               </Select>
            </div>
         </Modal>

         {/* Price Editing Modal */}
         <Modal 
            isOpen={isPriceEditModalOpen} 
            onClose={() => setIsPriceEditModalOpen(false)} 
            title="Edit Order Pricing"
            size="lg"
            footer={
               <div className="flex gap-3 justify-end w-full">
                  <Button variant="secondary" onClick={() => setIsPriceEditModalOpen(false)}>Cancel</Button>
                  <Button variant="primary" onClick={handleSavePriceEdit} icon={<Save className="h-4 w-4" />}>Save Pricing</Button>
               </div>
            }
         >
            <div className="space-y-6">
               <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0" />
                  <p className="text-sm text-amber-800">
                     Editing prices for an approved order will reset its status to <span className="font-bold">Pending</span>.
                  </p>
               </div>

               <div className="space-y-4">
                  {editingItems.map((item, idx) => (
                     <div key={item.id} className="grid grid-cols-12 gap-4 items-end bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div className="col-span-6">
                           <Input label="Item Name" value={item.name} disabled />
                        </div>
                        <div className="col-span-3">
                           <Input 
                              label="Price (£)" 
                              type="number" 
                              value={item.price.toString()} 
                              onChange={e => handleItemChange(idx, 'price', parseFloat(e.target.value))} 
                           />
                        </div>
                        <div className="col-span-3">
                           <Input 
                              label="Qty" 
                              type="number" 
                              value={item.qty.toString()} 
                              onChange={e => handleItemChange(idx, 'qty', parseInt(e.target.value))} 
                           />
                        </div>
                     </div>
                  ))}
               </div>

               <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                  <Input 
                     label="Coupon Code" 
                     placeholder="e.g. SAVE10" 
                     value={editingCouponCode}
                     onChange={e => setEditingCouponCode(e.target.value)}
                  />
                  <Input 
                     label="Discount Amount (£)" 
                     type="number" 
                     value={editingDiscount.toString()}
                     onChange={e => setEditingDiscount(parseFloat(e.target.value) || 0)}
                  />
               </div>

               <div className="bg-slate-900 rounded-xl p-6 text-white flex justify-between items-center shadow-lg">
                  <div>
                     <p className="text-slate-400 text-sm font-medium">New Order Total</p>
                     <p className="text-xs text-slate-500 mt-1">Including all items and discounts</p>
                  </div>
                  <div className="text-3xl font-bold tracking-tight">
                     £{calculateEditingTotal().toFixed(2)}
                  </div>
               </div>
            </div>
         </Modal>

          {/* Order Detail Modal */}
         <Modal 
            isOpen={isDetailModalOpen} 
            onClose={() => setIsDetailModalOpen(false)} 
            title="Order Details"
            size="lg"
            footer={
               <div className="flex justify-between w-full">
                  <div className="flex gap-2">
                     <Button variant="secondary" icon={<Printer className="h-4 w-4" />}>Print</Button>
                     <Button variant="secondary" icon={<FileDown className="h-4 w-4" />}>Invoice</Button>
                     {selectedOrder && selectedOrder.status === 'Approved' && (
                        <Button 
                          variant="warning" 
                          icon={<RotateCcw className="h-4 w-4" />}
                          onClick={() => {
                             const firstItem = SIMULATED_ORDER_ITEMS[0];
                             setReversalData({
                                orderId: selectedOrder.id,
                                customer: selectedOrder.customer,
                                reversalType: 'Add Stock Back',
                                reason: 'Customer Return',
                                reversalQuantity: 0,
                                notes: '',
                                product: firstItem.name,
                                flavour: firstItem.flavour || 'Standard',
                                originalQuantity: firstItem.qty
                             });
                             setIsReversalModalOpen(true);
                          }}
                        >
                          Reverse Stock
                        </Button>
                     )}
                  </div>
                  <Button variant="secondary" onClick={() => setIsDetailModalOpen(false)}>Close</Button>
               </div>
            }
         >
            {selectedOrder && renderOrderDetails()}
         </Modal>

         {/* Stock Reversal Modal */}
         <Modal
            isOpen={isReversalModalOpen}
            onClose={() => setIsReversalModalOpen(false)}
            title="Reverse Stock (Add Back to Inventory)"
            size="md"
            footer={
               <div className="flex gap-3 justify-end w-full">
                  <Button variant="secondary" onClick={() => setIsReversalModalOpen(false)}>Cancel</Button>
                  <Button variant="primary" onClick={handleReverseStockConfirm}>Confirm Reversal</Button>
               </div>
            }
         >
            <div className="space-y-4">
               <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0" />
                  <p className="text-sm text-amber-800">
                     This action will add stock back to the inventory for Order <span className="font-bold">#{reversalData.orderId}</span>.
                  </p>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <Select 
                    label="Product" 
                    value={reversalData.product} 
                    onChange={e => setReversalData({...reversalData, product: e.target.value})}
                  >
                     {SIMULATED_ORDER_ITEMS.map(item => (
                        <option key={item.name} value={item.name}>{item.name}</option>
                     ))}
                  </Select>
                  <Input 
                    label="Quantity to Reverse" 
                    type="number" 
                    value={reversalData.reversalQuantity.toString()}
                    onChange={e => setReversalData({...reversalData, reversalQuantity: parseInt(e.target.value) || 0})}
                    placeholder={`Max ${reversalData.originalQuantity}`}
                  />
               </div>

               <Select 
                 label="Reversal Type" 
                 value={reversalData.reversalType} 
                 onChange={e => setReversalData({...reversalData, reversalType: e.target.value as any})}
               >
                  <option value="Add Stock Back">Add Stock Back (Resellable)</option>
                  <option value="Damaged / Write-off">Damaged / Write-off (Not Resellable)</option>
               </Select>

               <TextArea 
                 label="Reason / Notes" 
                 value={reversalData.notes} 
                 onChange={e => setReversalData({...reversalData, notes: e.target.value})}
                 placeholder="Enter reason for stock reversal..."
               />
            </div>
         </Modal>

      </div>
    </div>
  );
};

export default CustomerDetailsPage;
