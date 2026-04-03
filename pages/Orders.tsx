import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Plus, Filter, Search, Eye, Download, Printer, 
  CheckCircle, Clock, XCircle, Calendar, CreditCard, User, Box, Heart,
  ChevronRight, ChevronLeft, MapPin, Building, Trash2, ArrowLeft, Minus, ShoppingBag, ShieldCheck, Wallet,
  ArrowUpDown, Phone, Mail, ChevronDown, ChevronUp, ShoppingCart, CornerDownRight, Lock, Edit3, RefreshCw, FileText,
  Edit2, Check, X, AlertTriangle, FileDown, Layers, Image as ImageIcon, Hash, Globe, RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Card, Badge, Button, Input, Select, Modal, Toggle, Pagination,
  Section, Grid, Table, THead, TBody, TR, TH, TD, KpiCard, StatBox, CardHeader, TextArea
} from '../components/ui';
import { ORDERS, PRODUCTS, CUSTOMERS, CATEGORIES } from '../data';
import { Order, Product, Customer, StockReversal } from '../types';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';

type SortConfig = { key: string; direction: 'asc' | 'desc' } | null;

// --- Extended Types for Order Wizard ---
interface CartItemData {
  qty: number;
  price: number;
  isFoc?: boolean;
  dealId?: string;
}

const MOCK_DEALS = [
  { id: 'deal1', name: 'Buy 10 Get 1 Free' },
  { id: 'deal2', name: '10% Bulk Discount' },
  { id: 'deal3', name: 'Summer Special' },
];

// Temporary Item type for the Price Edit Modal
interface TempOrderItem {
  id: number;
  name: string;
  price: number;
  qty: number;
}

const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasPermission, role, user } = useAuth();
  const { reverseStock, orderActivities, addOrderActivity } = useProducts();

  const SIMULATED_ORDER_ITEMS = [
    { name: 'LOST MARY BM6000 KIT', qty: 10, price: '3.85', flavour: 'Strawberry Lime' },
    { name: 'LOST MARY BM6000 KIT', qty: 5, price: '3.85', flavour: 'Pineapple Passion Fruit' },
    { name: 'ELF BAR 600', qty: 20, price: '3.99', flavour: 'Blueberry' },
  ];

  // --- View State ---
  const [view, setView] = useState<'list' | 'create'>('list');

  // --- List View State ---
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  
  // FBU Order Statuses: Pending, Approved, Picking, Packed, Shipped, Delivered, Cancelled
  const fbuStatuses = ['Pending', 'Approved', 'Picking', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];
  
  // Status Update & Detail Modal State
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [newStatus, setNewStatus] = useState<string>('');

  // --- Stock Reversal State ---
  const [isReversalModalOpen, setIsReversalModalOpen] = useState(false);
  const [reversalData, setReversalData] = useState<Partial<StockReversal>>({
    reversalType: 'Add Stock Back',
    reason: 'Customer Return',
    reversalQuantity: 0,
    notes: ''
  });

  // --- Price Editing State ---
  const [isPriceEditModalOpen, setIsPriceEditModalOpen] = useState(false);
  const [editingItems, setEditingItems] = useState<TempOrderItem[]>([]);
  const [editingDiscount, setEditingDiscount] = useState<number>(0);
  const [editingCouponCode, setEditingCouponCode] = useState<string>('');
  const [editingOrderRef, setEditingOrderRef] = useState<Order | null>(null);

  const [orderSort, setOrderSort] = useState<SortConfig>(null);
  const [orderPage, setOrderPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Local state to simulate updates since we don't have a backend
  const [localOrders, setLocalOrders] = useState<Order[]>(ORDERS);

  // --- Create Order Wizard State ---
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerTab, setCustomerTab] = useState<'all' | 'recent' | 'favorites' | 'frequent'>('all');
  const [favorites, setFavorites] = useState<string[]>(['C001', 'C004']); // Mock initial favorites
  const [customerFilters, setCustomerFilters] = useState({
    region: 'All',
    creditRange: 'All',
    sort: 'Alphabetical (A–Z)'
  });
  const [visibleCustomersCount, setVisibleCustomersCount] = useState(6);
  const [couponCode, setCouponCode] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [useCredit, setUseCredit] = useState(false);
  const [productTab, setProductTab] = useState<'products' | 'cart'>('products');
  const [productFilters, setProductFilters] = useState({
    category: 'All',
    supplier: 'All',
    stock: 'All'
  });
  
  // Cart maps Product ID to Data (Qty, Price)
  const [cart, setCart] = useState<{ [key: string]: CartItemData }>({});

  const cartItemsCount = useMemo(() => 
    (Object.values(cart) as CartItemData[]).reduce((sum, item) => sum + item.qty, 0),
  [cart]);

  const subtotal = useMemo(() => 
    (Object.values(cart) as CartItemData[]).reduce((sum, item) => {
      if (item.isFoc) return sum;
      return sum + (item.price * item.qty);
    }, 0),
  [cart]);
  
  // --- Wizard Sorting & Pagination State ---
  const [productPage, setProductPage] = useState(1);
  const [productSearch, setProductSearch] = useState('');
  const [isCustomerDetailsExpanded, setIsCustomerDetailsExpanded] = useState(false);
  const productsPerPage = 8;

  // --- Effects ---
  useEffect(() => {
    if (location.state && (location.state as any).openModal) {
      setView('create');
      setCurrentStep(1);
      setSelectedCustomer(null);
      setCart({});
    }
  }, [location]);

  // --- Helpers ---
  const getCustomerDetails = (customerName: string) => {
    return CUSTOMERS.find(c => c.name === customerName) || {
      email: 'N/A',
      address: 'N/A',
      companyName: 'N/A',
      storeName: 'N/A',
      phone: 'N/A',
      image: undefined
    };
  };

  const handleSort = (key: string, config: SortConfig, setConfig: (c: SortConfig) => void) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (config && config.key === key && config.direction === 'asc') {
      direction = 'desc';
    }
    setConfig({ key, direction });
  };

  const updateCartItem = (productId: string, updates: Partial<CartItemData>) => {
    setCart(prev => {
      if (!prev[productId]) return prev;
      const newCart = { ...prev };
      newCart[productId] = { ...prev[productId], ...updates };
      return newCart;
    });
  };

  const sortData = (data: any[], config: SortConfig) => {
    if (!config) return data;
    return [...data].sort((a, b) => {
      let aValue = a[config.key];
      let bValue = b[config.key];
      
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();

      if (aValue < bValue) return config.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return config.direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  // --- Filtering & Sorting for List View ---
  const filteredOrders = useMemo(() => {
    let result = localOrders.filter(order => {
      const matchesSearch = 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
        order.customer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
      const matchesPayment = paymentFilter === 'All' || order.paymentStatus === paymentFilter;
      return matchesSearch && matchesStatus && matchesPayment;
    });

    return sortData(result, orderSort);
  }, [localOrders, searchTerm, statusFilter, paymentFilter, orderSort]);

  const paginatedOrders = useMemo(() => {
    const start = (orderPage - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, orderPage, itemsPerPage]);

  // --- Cart Actions (Create Order) ---
  const handleAddToCart = (product: Product, delta: number) => {
    setCart(prev => {
      const currentItem = prev[product.id];
      const currentQty = currentItem?.qty || 0;
      const newQty = Math.max(0, currentQty + delta);
      
      const newCart = { ...prev };

      if (newQty === 0) {
        delete newCart[product.id];
      } else {
        newCart[product.id] = {
          qty: newQty,
          price: product.price
        };
      }
      return newCart;
    });
  };

  const handleSubmitOrder = () => {
      if (!selectedCustomer) return;
      
      const cartItems = Object.values(cart) as CartItemData[];
      const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
      const total = subtotal * 1.2; // 20% VAT
      const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);

      const newOrder: Order = {
          id: `${Math.floor(Math.random() * 1000)}`,
          customer: selectedCustomer.name,
          date: new Date().toLocaleDateString('en-GB'),
          total: total,
          items: totalItems,
          status: 'Pending',
          paymentStatus: 'Pending'
      };

      setLocalOrders([newOrder, ...localOrders]);
      setView('list');
      setCurrentStep(1);
      setSelectedCustomer(null);
      setCart({});
  };

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

  const openDeleteModal = (order: Order, e: React.MouseEvent) => {
    e.stopPropagation();
    setOrderToDelete(order);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (orderToDelete) {
      setLocalOrders(prev => prev.filter(o => o.id !== orderToDelete.id));
      setNotification({ message: `Order #${orderToDelete.id} has been deleted successfully.`, type: 'success' });
      setIsDeleteModalOpen(false);
      setOrderToDelete(null);
      
      // Clear notification after 3 seconds
      setTimeout(() => setNotification(null), 3000);
    }
  };

  // --- Price Edit Logic ---
  const openPriceEditModal = (order: Order, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingOrderRef(order);
    
    // Simulate items
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

  const handleReverseStockConfirm = () => {
    if (!reversalData.reversalQuantity || reversalData.reversalQuantity <= 0) {
      setNotification({ message: 'Please enter a valid quantity', type: 'error' });
      return;
    }

    if (!reversalData.product) {
      setNotification({ message: 'Please select a product', type: 'error' });
      return;
    }

    reverseStock({
      ...reversalData,
      adminUser: user?.name || 'Admin',
    } as StockReversal);

    setIsReversalModalOpen(false);
    setNotification({ message: 'Stock reversal recorded successfully', type: 'success' });
  };

  // --- Render Order Details for Modal ---
  const renderOrderDetails = () => {
    if (!selectedOrder) return null;
    const customerDetails = getCustomerDetails(selectedOrder.customer);
    const tax = selectedOrder.total * 0.2; // Mock 20% Tax
    const subtotal = selectedOrder.total - tax;

    // Use shared simulated order items
    const displayItems = SIMULATED_ORDER_ITEMS;

    return (
      <div className="space-y-6">
         {/* Customer & Order Info Header */}
         <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 flex flex-col md:flex-row justify-between gap-6">
            <div className="flex gap-4">
               <div className="h-12 w-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 text-lg font-bold shadow-sm overflow-hidden">
                  {customerDetails.image ? <img src={customerDetails.image} alt="" className="h-full w-full object-cover" /> : selectedOrder.customer.charAt(0)}
               </div>
               <div>
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wide">Customer</p>
                  <h3 className="text-lg font-bold text-slate-900">{selectedOrder.customer}</h3>
                  <div className="text-sm text-slate-500 mt-0.5">{customerDetails.email}</div>
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
               <span>{customerDetails.address !== 'N/A' ? customerDetails.address : 'No address provided'}</span>
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

         {/* Activity Timeline */}
         <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
               <Clock className="h-4 w-4 text-slate-400" />
               Order Activity Timeline
            </h4>
            <div className="space-y-4">
               {orderActivities.filter(a => a.orderId === selectedOrder.id).length > 0 ? (
                  orderActivities.filter(a => a.orderId === selectedOrder.id).map((activity, idx) => (
                     <div key={activity.id} className="flex gap-3 relative">
                        {idx !== orderActivities.filter(a => a.orderId === selectedOrder.id).length - 1 && (
                           <div className="absolute left-2 top-5 bottom-0 w-px bg-slate-100"></div>
                        )}
                        <div className="h-4 w-4 rounded-full bg-indigo-100 border-2 border-white flex-shrink-0 z-10 mt-1"></div>
                        <div className="flex-1">
                           <div className="flex justify-between items-start">
                              <p className="text-sm font-bold text-slate-900">{activity.type}</p>
                              <span className="text-[10px] text-slate-400 font-mono">{new Date(activity.date).toLocaleString()}</span>
                           </div>
                           <p className="text-xs text-slate-500 mt-0.5">{activity.message}</p>
                           <p className="text-[10px] text-slate-400 mt-1">By: {activity.user}</p>
                        </div>
                     </div>
                  ))
               ) : (
                  <div className="text-center py-4">
                     <p className="text-xs text-slate-400 italic">No activity recorded yet.</p>
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

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const renderStep1 = () => {
    // Filter and Sort Customers
    let filtered = CUSTOMERS.filter(c => {
      // Only show approved customers
      if (c.status !== 'Approved') return false;

      const matchesSearch = 
        c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
        c.companyName.toLowerCase().includes(customerSearch.toLowerCase()) ||
        c.email.toLowerCase().includes(customerSearch.toLowerCase());
      
      const matchesTab = 
        customerTab === 'all' ? true :
        customerTab === 'favorites' ? favorites.includes(c.id) :
        customerTab === 'recent' ? ['C001', 'C002', 'C003'].includes(c.id) : // Mock recent
        customerTab === 'frequent' ? ['C004', 'C005'].includes(c.id) : true; // Mock frequent

      return matchesSearch && matchesTab;
    });

    // Sorting
    filtered.sort((a, b) => {
      if (customerTab === 'all') {
        const aFav = favorites.includes(a.id);
        const bFav = favorites.includes(b.id);
        if (aFav && !bFav) return -1;
        if (!aFav && bFav) return 1;
      }
      
      if (customerFilters.sort === 'Alphabetical (A–Z)') {
        return a.name.localeCompare(b.name);
      }
      if (customerFilters.sort === 'Alphabetical (Z–A)') {
        return b.name.localeCompare(a.name);
      }
      if (customerFilters.sort === 'Highest Credit') {
        return b.walletBalance - a.walletBalance;
      }
      if (customerFilters.sort === 'Recently Added') {
        return new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime();
      }
      if (customerFilters.sort === 'Recently Ordered') {
        const getLatestOrderDate = (customerName: string) => {
          const customerOrders = ORDERS.filter(o => o.customer === customerName);
          if (customerOrders.length === 0) return 0;
          
          const dates = customerOrders.map(o => {
            const [day, month, year] = o.date.split('/').map(Number);
            return new Date(year, month - 1, day).getTime();
          });
          return Math.max(...dates);
        };
        
        return getLatestOrderDate(b.name) - getLatestOrderDate(a.name);
      }
      return 0;
    });

    const displayCustomers = filtered.slice(0, visibleCustomersCount);
    const hasMore = filtered.length > visibleCustomersCount;

    return (
      <div className="space-y-8 animate-fadeIn">
        <div className="space-y-6">
          {/* Search, Filters and Tabs */}
          <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex-1 min-w-[300px]">
                  <Input 
                    placeholder="Search by name, company, or email..." 
                    value={customerSearch}
                    onChange={e => setCustomerSearch(e.target.value)}
                    icon={<Search className="h-5 w-5 text-slate-400" />}
                  />
                </div>
                <div className="w-48">
                  <Select 
                    value={customerFilters.region}
                    onChange={e => setCustomerFilters(prev => ({ ...prev, region: e.target.value }))}
                    options={['All', 'North', 'South', 'East', 'West'].map(r => ({ label: r === 'All' ? 'Region: All' : r, value: r }))}
                  />
                </div>
                <div className="w-48">
                  <Select 
                    value={customerFilters.sort}
                    onChange={e => setCustomerFilters(prev => ({ ...prev, sort: e.target.value }))}
                    options={[
                      { label: 'Sort: A–Z', value: 'Alphabetical (A–Z)' },
                      { label: 'Sort: Z–A', value: 'Alphabetical (Z–A)' },
                      { label: 'Sort: Recently Ordered', value: 'Recently Ordered' },
                      { label: 'Sort: Highest Credit', value: 'Highest Credit' },
                      { label: 'Sort: Recently Added', value: 'Recently Added' }
                    ]}
                  />
                </div>
              </div>

              <div className="flex p-1 bg-slate-100 rounded-xl w-fit">
                {(['all', 'recent', 'favorites', 'frequent'] as const).map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setCustomerTab(tab)}
                    className={`px-6 py-2 text-sm font-bold rounded-lg transition-all capitalize ${customerTab === tab ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    {tab === 'all' ? 'All Customers' : tab === 'recent' ? 'Recent' : tab === 'favorites' ? 'Favorites' : 'Frequent Buyers'}
                  </button>
                ))}
              </div>
            </div>

            {/* Customer Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayCustomers.map(c => {
                const isFavorite = favorites.includes(c.id);
                const isApproved = c.status === 'Approved';
                
                return (
                  <Card 
                    key={c.id} 
                    className={`group relative cursor-pointer transition-all hover:shadow-xl hover:border-indigo-200 border-2 ${selectedCustomer?.id === c.id ? 'border-indigo-600 bg-indigo-50/30' : 'border-transparent'}`}
                    onClick={() => {
                      if (isApproved) {
                        setSelectedCustomer(c);
                        setCurrentStep(2);
                      }
                    }}
                  >
                    {/* Favorite Heart */}
                    <button 
                      onClick={(e) => toggleFavorite(e, c.id)}
                      className={`absolute top-4 right-4 p-2 rounded-full transition-all z-10 ${isFavorite ? 'text-rose-500 bg-rose-50' : 'text-slate-300 hover:text-rose-400 hover:bg-slate-50'}`}
                    >
                      <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                    </button>

                    <div className="flex items-start gap-4 mb-4">
                      <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors overflow-hidden">
                        {c.image ? <img src={c.image} alt="" className="h-full w-full object-cover" /> : c.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-900 truncate">{c.name}</h4>
                        <p className="text-xs text-slate-500 truncate font-medium">{c.companyName}</p>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Mail className="h-3.5 w-3.5 text-slate-400" />
                        <span className="truncate">{c.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Phone className="h-3.5 w-3.5 text-slate-400" />
                        <span>{c.phone}</span>
                      </div>
                      <div className="flex items-start gap-2 text-xs text-slate-600">
                        <MapPin className="h-3.5 w-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-2 leading-relaxed">{c.address}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Credit</p>
                        <p className="text-sm font-bold text-indigo-600">£{c.walletBalance.toFixed(2)}</p>
                      </div>
                      <Button 
                        variant={selectedCustomer?.id === c.id ? 'primary' : 'secondary'} 
                        size="sm"
                      >
                        {selectedCustomer?.id === c.id ? 'Selected' : 'Select Customer'}
                      </Button>
                    </div>
                  </Card>

                );
              })}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="flex justify-center pt-8">
                <Button 
                  variant="secondary" 
                  onClick={() => setVisibleCustomersCount(prev => prev + 6)}
                  className="px-12"
                >
                  Load More Customers
                </Button>
              </div>
            )}

            {filtered.length === 0 && (
              <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <User className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">No customers found</h3>
                <p className="text-sm text-slate-500">Try adjusting your search or filters.</p>
              </div>
            )}
        </div>
      </div>
    );
  };

  const renderStep2 = () => {
    const filteredProducts = PRODUCTS.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) || 
                           p.sku.toLowerCase().includes(productSearch.toLowerCase()) ||
                           p.supplier?.toLowerCase().includes(productSearch.toLowerCase()) ||
                           p.category.toLowerCase().includes(productSearch.toLowerCase());
      const matchesCategory = productFilters.category === 'All' || p.category === productFilters.category;
      const matchesSupplier = productFilters.supplier === 'All' || p.supplier === productFilters.supplier;
      const matchesStock = productFilters.stock === 'All' || 
                          (productFilters.stock === 'In Stock' && p.stock > 0) ||
                          (productFilters.stock === 'Out of Stock' && p.stock === 0);
      return matchesSearch && matchesCategory && matchesSupplier && matchesStock;
    });

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const displayProducts = filteredProducts.slice((productPage - 1) * productsPerPage, productPage * productsPerPage);

    const vat = subtotal * 0.2;
    const total = subtotal + vat;

    return (
      <div className="relative animate-fadeIn">
        <div className="space-y-6">
          <div className="flex p-1 bg-slate-100 rounded-xl w-fit">
            <button 
              onClick={() => setProductTab('products')}
              className={`px-6 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2 ${productTab === 'products' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Box className="h-4 w-4" /> Products
            </button>
            <button 
              onClick={() => setProductTab('cart')}
              className={`px-6 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2 ${productTab === 'cart' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <ShoppingCart className="h-4 w-4" /> Cart <Badge variant={cartItemsCount > 0 ? 'indigo' : 'secondary'}>{cartItemsCount}</Badge>
            </button>
          </div>

          {productTab === 'products' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="md:col-span-2">
                  <Input 
                    placeholder="Search products by name, SKU, supplier, or category..." 
                    icon={<Search className="h-4 w-4" />} 
                    value={productSearch}
                    onChange={e => { setProductSearch(e.target.value); setProductPage(1); }}
                  />
                </div>
                <Select 
                  value={productFilters.category}
                  onChange={val => setProductFilters(prev => ({ ...prev, category: val }))}
                  options={['All', ...CATEGORIES.map(c => c.name)]}
                />
                <Select 
                  value={productFilters.stock}
                  onChange={val => setProductFilters(prev => ({ ...prev, stock: val }))}
                  options={['All', 'In Stock', 'Out of Stock']}
                />
              </div>

              <Card padding="none" className="overflow-hidden">
                <Table className="text-sm">
                  <THead>
                    <TR>
                      <TH className="px-4 py-4">IMAGE</TH>
                      <TH className="px-4 py-4">NAME</TH>
                      <TH className="px-4 py-4">FLAVOUR</TH>
                      <TH className="px-4 py-4">SUPPLIER</TH>
                      <TH className="px-4 py-4">QUANTITY</TH>
                      <TH className="px-4 py-4">PRICE/PC.</TH>
                      <TH className="px-4 py-4">VAT</TH>
                      <TH className="px-4 py-4">PRICE INCLUDING VAT</TH>
                      <TH className="px-4 py-4">PC/CARTON</TH>
                      <TH className="px-4 py-4">STOCK</TH>
                      <TH className="px-4 py-4">CARTON PRICE</TH>
                    </TR>
                  </THead>
                  <TBody>
                    {displayProducts.map(product => {
                      const inCart = cart[product.id];
                      const cartonPrice = product.price * (product.unitsPerCarton || 1);

                      return (
                        <TR key={product.id}>
                          <TD className="px-4 py-4">
                            <div className="h-12 w-12 rounded bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0">
                              <img src={product.image} alt="" className="h-10 w-10 object-contain mix-blend-multiply" />
                            </div>
                          </TD>
                          <TD className="px-4 py-4">
                            <div className="min-w-[200px]">
                              <p className="font-black text-slate-900 text-sm uppercase">{product.name}</p>
                              <p className="text-[11px] text-slate-400 font-medium">{product.sku}</p>
                            </div>
                          </TD>
                          <TD className="px-4 py-4">
                            <span className="text-slate-500 font-medium">{product.flavour}</span>
                          </TD>
                          <TD className="px-4 py-4">
                            <span className="text-slate-500 font-medium">{product.supplier}</span>
                          </TD>
                          <TD className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => handleAddToCart(product, -1)} 
                                className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded text-slate-400 hover:text-indigo-600 transition-colors"
                                disabled={!inCart}
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <div className="w-16 h-10 border border-slate-200 rounded flex items-center justify-center font-bold text-slate-900 bg-white">
                                {inCart?.qty || 0}
                              </div>
                              <button 
                                onClick={() => handleAddToCart(product, 1)} 
                                className="w-8 h-8 flex items-center justify-center bg-indigo-50 rounded text-indigo-600 hover:bg-indigo-100 transition-colors"
                                disabled={product.stock > 0 && (inCart?.qty || 0) >= product.stock}
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                          </TD>
                          <TD className="px-4 py-4">
                            <p className="text-sm font-black text-slate-900">£{product.price.toFixed(2)}</p>
                          </TD>
                          <TD className="px-4 py-4 text-slate-400">£0.00</TD>
                          <TD className="px-4 py-4 text-slate-400">£{product.price.toFixed(2)}</TD>
                          <TD className="px-4 py-4 text-slate-500 font-medium">{product.unitsPerCarton || 1}</TD>
                          <TD className="px-4 py-4">
                            <span className={`font-bold ${product.stock === 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                              {product.stock}
                            </span>
                          </TD>
                          <TD className="px-4 py-4">
                            <p className="text-sm font-bold text-emerald-600">£{cartonPrice.toFixed(2)}</p>
                          </TD>
                        </TR>
                      );
                    })}
                  </TBody>
                </Table>
                {totalPages > 1 && (
                  <div className="p-4 border-t border-slate-100">
                    <Pagination 
                      currentPage={productPage} 
                      totalItems={filteredProducts.length} 
                      itemsPerPage={productsPerPage} 
                      onPageChange={setProductPage} 
                      entityName="products"
                    />
                  </div>
                )}
              </Card>
            </div>
          ) : (
            <Card padding="none" className="overflow-hidden">
              <Table className="text-sm">
                <THead>
                  <TR>
                    <TH className="px-4 py-4">Product</TH>
                    <TH className="px-4 py-4">Price</TH>
                    <TH className="px-4 py-4">Quantity</TH>
                    <TH className="px-4 py-4 text-right">Subtotal</TH>
                    <TH className="px-4 py-4"></TH>
                  </TR>
                </THead>
                  <TBody>
                    {Object.keys(cart).length > 0 ? (Object.entries(cart) as [string, CartItemData][]).map(([id, item]) => {
                      const p = PRODUCTS.find(prod => prod.id === id);
                      if (!p) return null;
                      return (
                        <TR key={id}>
                          <TD className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-12 w-12 rounded bg-slate-50 border border-slate-200 flex items-center justify-center">
                                <img src={p.image} alt="" className="h-10 w-10 object-contain mix-blend-multiply" />
                              </div>
                              <div>
                                <p className="font-bold text-slate-900 text-sm">{p.name}</p>
                                <p className="text-xs text-slate-500">{p.flavour}</p>
                              </div>
                            </div>
                          </TD>
                          <TD className="px-4 py-4 text-sm text-slate-600 font-medium">£{item.price.toFixed(2)}</TD>
                          <TD className="px-4 py-4">
                            <div className="flex items-center bg-slate-100 rounded p-0.5 border border-slate-200 w-fit">
                              <button onClick={() => handleAddToCart(p, -1)} className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm text-slate-600 hover:text-indigo-600 font-bold">-</button>
                              <span className="w-10 text-center font-bold text-slate-900 text-sm">{item.qty}</span>
                              <button onClick={() => handleAddToCart(p, 1)} className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm text-slate-600 hover:text-indigo-600 font-bold" disabled={item.qty >= p.stock}>+</button>
                            </div>
                          </TD>
                          <TD className="px-4 py-4 text-right font-bold text-slate-900">£{(item.qty * item.price).toFixed(2)}</TD>
                          <TD className="px-4 py-4 text-right">
                            <button onClick={() => handleAddToCart(p, -item.qty)} className="p-2 text-slate-400 hover:text-rose-600 transition-colors">
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </TD>
                        </TR>
                      );
                    }) : (
                    <TR>
                      <TD colSpan={5} className="text-center py-12 text-slate-400 italic">Your cart is empty.</TD>
                    </TR>
                  )}
                </TBody>
              </Table>
            </Card>
          )}
        </div>
      </div>
    );
  };

  const renderStep3 = () => {
    const vat = subtotal * 0.2;
    const shipping = 0;
    const discount = 0;
    const totalDue = subtotal + vat + shipping - discount;
    const finalTotal = useCredit ? Math.max(0, totalDue - (selectedCustomer?.walletBalance || 0)) : totalDue;
    const creditApplied = useCredit ? Math.min(totalDue, selectedCustomer?.walletBalance || 0) : 0;

    const isCreditLimitExceeded = totalDue > (selectedCustomer?.creditLimit || 0);

    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn items-start">
        <div className="lg:col-span-9 space-y-8">
          {/* Customer Details Section */}
          <Section 
            title="Customer Details" 
            padding="none"
          >
            <Card className="border-slate-200 overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 flex-shrink-0 shadow-sm">
                    {selectedCustomer?.image ? (
                      <img src={selectedCustomer.image} alt="" className="h-full w-full rounded-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <User className="h-7 w-7" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-[23px] font-bold text-slate-900 leading-tight">{selectedCustomer?.name}</h3>
                    <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <Building className="h-3.5 w-3.5" />
                      {selectedCustomer?.companyName}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                  {!isCustomerDetailsExpanded && (
                    <>
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                        <Mail className="h-3.5 w-3.5 text-slate-400" />
                        {selectedCustomer?.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                        <Phone className="h-3.5 w-3.5 text-slate-400" />
                        {selectedCustomer?.phone}
                      </div>
                    </>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIsCustomerDetailsExpanded(!isCustomerDetailsExpanded)}
                    icon={isCustomerDetailsExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                  >
                    {isCustomerDetailsExpanded ? 'Hide Details' : 'View Details'}
                  </Button>
                </div>
              </div>

              <AnimatePresence>
                {isCustomerDetailsExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="pt-8 mt-8 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-indigo-50 flex items-center justify-center">
                            <User className="h-3.5 w-3.5 text-indigo-600" />
                          </div>
                          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Contact Information</p>
                        </div>
                        <div className="space-y-2.5 pl-8">
                          <div>
                            <p className="text-[10px] text-slate-400 uppercase font-medium">Email Address</p>
                            <p className="text-sm font-semibold text-slate-700">{selectedCustomer?.email}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 uppercase font-medium">Phone Number</p>
                            <p className="text-sm font-semibold text-slate-700">{selectedCustomer?.phone}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-amber-50 flex items-center justify-center">
                            <Building className="h-3.5 w-3.5 text-amber-600" />
                          </div>
                          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Business Details</p>
                        </div>
                        <div className="space-y-2.5 pl-8">
                          <div>
                            <p className="text-[10px] text-slate-400 uppercase font-medium">Company Name</p>
                            <p className="text-sm font-semibold text-slate-700">{selectedCustomer?.companyName}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 uppercase font-medium">Registration No</p>
                            <p className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                              <Hash className="h-3 w-3 text-slate-400" />
                              {selectedCustomer?.regNo}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-emerald-50 flex items-center justify-center">
                            <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                          </div>
                          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Billing Address</p>
                        </div>
                        <div className="pl-8 space-y-2">
                          <p className="text-sm font-semibold text-slate-700 leading-relaxed max-w-xs">
                            {selectedCustomer?.address}
                          </p>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                            <Globe className="h-3.5 w-3.5 text-slate-400" />
                            <span>United Kingdom</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </Section>

          {/* Order Items Section */}
          <Section title="Order Items" padding="none">
            <Card padding="none" className="overflow-hidden border-slate-200">
              <Table className="text-sm">
                <THead>
                  <TR>
                    <TH className="px-4 py-4 w-10">FOC</TH>
                    <TH className="px-4 py-4">Deal</TH>
                    <TH className="px-4 py-4">Product</TH>
                    <TH className="px-4 py-4">Flavour</TH>
                    <TH className="px-4 py-4">Price / Pc</TH>
                    <TH className="px-4 py-4">No. of Items</TH>
                    <TH className="px-4 py-4">Price / Carton</TH>
                    <TH className="px-4 py-4">Total Cartons</TH>
                    <TH className="px-4 py-4">VAT</TH>
                    <TH className="px-4 py-4 text-center">Remove</TH>
                  </TR>
                </THead>
                <TBody>
                  {(Object.entries(cart) as [string, CartItemData][]).map(([id, item]) => {
                    const p = PRODUCTS.find(prod => prod.id === id);
                    if (!p) return null;
                    
                    const unitsPerCarton = p.unitsPerCarton || 200;
                    const pricePerCarton = item.price * unitsPerCarton;
                    const totalCartons = item.qty / unitsPerCarton;
                    const itemVat = item.isFoc ? 0 : (item.qty * item.price * 0.2);
                    
                    return (
                      <TR key={id}>
                        <TD className="px-4 py-4">
                          <input 
                            type="checkbox" 
                            checked={item.isFoc || false}
                            onChange={(e) => updateCartItem(id, { isFoc: e.target.checked })}
                            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                        </TD>
                        <TD className="px-4 py-4">
                          <Select 
                            value={item.dealId || ''}
                            onChange={(e) => updateCartItem(id, { dealId: e.target.value })}
                            className="text-xs !p-1.5 w-32"
                            options={[
                              { label: 'Select Deal', value: '' },
                              ...MOCK_DEALS.map(deal => ({ label: deal.name, value: deal.id }))
                            ]}
                          />
                        </TD>
                        <TD className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden">
                              <img src={p.image} alt="" className="h-8 w-8 object-contain mix-blend-multiply" />
                            </div>
                            <span className="font-bold text-slate-900 text-xs truncate max-w-[120px]">{p.name}</span>
                          </div>
                        </TD>
                        <TD className="px-4 py-4 text-xs text-slate-600">{p.flavour}</TD>
                        <TD className="px-4 py-4">
                          <div className="flex items-center gap-1.5 group">
                            <span className="text-xs font-bold text-slate-700">£</span>
                            <input 
                              type="number"
                              step="0.01"
                              value={item.price}
                              onChange={(e) => updateCartItem(id, { price: parseFloat(e.target.value) || 0 })}
                              className="w-16 text-xs font-bold text-slate-900 border-none bg-transparent p-0 focus:ring-0 focus:outline-none"
                            />
                            <Edit3 className="h-3 w-3 text-slate-300 group-hover:text-indigo-400 transition-colors cursor-pointer" />
                          </div>
                        </TD>
                        <TD className="px-4 py-4">
                          <div className="flex items-center bg-slate-50 rounded-lg border border-slate-200 w-fit overflow-hidden">
                            <button 
                              onClick={() => handleAddToCart(p, -unitsPerCarton)} 
                              className="w-8 h-8 flex items-center justify-center hover:bg-white text-slate-500 transition-colors"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <input 
                              type="number"
                              value={item.qty}
                              onChange={(e) => {
                                const val = parseInt(e.target.value) || 0;
                                updateCartItem(id, { qty: val });
                              }}
                              className="w-12 text-center text-xs font-bold text-slate-900 bg-transparent border-none focus:ring-0 p-0"
                            />
                            <button 
                              onClick={() => handleAddToCart(p, unitsPerCarton)} 
                              className="w-8 h-8 flex items-center justify-center hover:bg-white text-slate-500 transition-colors"
                              disabled={item.qty >= p.stock && p.stock > 0}
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </TD>
                        <TD className="px-4 py-4 text-xs font-bold text-slate-700">£{pricePerCarton.toFixed(2)}</TD>
                        <TD className="px-4 py-4 text-xs font-bold text-slate-700">{totalCartons.toFixed(2)}</TD>
                        <TD className="px-4 py-4 text-xs font-bold text-slate-700">£{itemVat.toFixed(2)}</TD>
                        <TD className="px-4 py-4 text-center">
                          <button 
                            onClick={() => handleAddToCart(p, -item.qty)}
                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </TD>
                      </TR>
                    );
                  })}
                </TBody>
              </Table>
            </Card>
          </Section>

          {/* Additional Inputs Section */}
          <div className="space-y-6">
            <TextArea 
              label="Order Notes"
              placeholder="Add internal notes about this order..."
              value={orderNotes}
              onChange={e => setOrderNotes(e.target.value)}
              rows={3}
              className="w-full"
            />
            <TextArea 
              label="Delivery Instructions"
              placeholder="Add instructions for the delivery team..."
              value={deliveryInstructions}
              onChange={e => setDeliveryInstructions(e.target.value)}
              rows={3}
              className="w-full"
            />
          </div>
        </div>

        {/* Right Column: Payment Summary */}
        <div className="lg:col-span-3 sticky top-6">
          <Card className="shadow-2xl border-indigo-100 overflow-hidden ring-1 ring-slate-200/50" padding="none">
            <div className="p-5 bg-gradient-to-br from-slate-50 to-white border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-indigo-600" /> Payment Summary
              </h3>
            </div>
            
            <div className="p-5 space-y-6">
              {/* Coupon Section */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Promo Code</p>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <input 
                      type="text"
                      placeholder="Enter code"
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                    />
                  </div>
                  <Button variant="secondary" size="sm" className="px-4">Apply</Button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium">Subtotal</span>
                  <span className="font-bold text-slate-900">£{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500 font-medium">VAT</span>
                    <Badge variant="secondary" className="text-[9px] px-1.5 py-0">20%</Badge>
                  </div>
                  <span className="font-bold text-slate-900">£{vat.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium">Discount</span>
                    <span className="font-bold text-emerald-600">-£{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium">Shipping</span>
                  <span className="font-bold text-slate-900">£{shipping.toFixed(2)}</span>
                </div>
                
                {useCredit && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-between items-center text-sm p-2 bg-indigo-50/50 rounded-lg border border-indigo-100/50"
                  >
                    <div className="flex items-center gap-1.5">
                      <Wallet className="h-3.5 w-3.5 text-indigo-600" />
                      <span className="text-indigo-700 font-bold">Credit Applied</span>
                    </div>
                    <span className="font-bold text-indigo-700">-£{creditApplied.toFixed(2)}</span>
                  </motion.div>
                )}
              </div>

              {/* Total Section */}
              <div className="pt-5 border-t border-slate-100">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-sm font-bold text-slate-900 mb-1">Total Payable</span>
                  <div className="text-right">
                    <span className="text-3xl font-black text-indigo-600 tracking-tight">£{finalTotal.toFixed(2)}</span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 text-right font-medium">Net amount after all adjustments</p>
              </div>

              {/* Credit Toggle */}
              <div className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-100/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center border border-indigo-100">
                      <Wallet className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Available Credit</p>
                      <p className="text-lg font-black text-slate-900 leading-none mt-0.5">£{selectedCustomer?.walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Use Credit</span>
                    <Toggle checked={useCredit} onChange={setUseCredit} />
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="space-y-4">
                <Button 
                  variant="primary" 
                  className={`w-full py-4 text-lg shadow-2xl transition-all duration-300 ${isCreditLimitExceeded ? 'opacity-50 grayscale' : 'shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 active:translate-y-0'}`}
                  onClick={handleSubmitOrder}
                  icon={<ShieldCheck className="h-6 w-6" />}
                  disabled={isCreditLimitExceeded}
                >
                  Generate Link & Pay
                </Button>
                <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  <Lock className="h-3 w-3" /> Secure Checkout
                </div>
              </div>

              {isCreditLimitExceeded && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3"
                >
                  <div className="h-8 w-8 rounded-lg bg-rose-100 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-rose-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-rose-700 mb-0.5">Credit Limit Exceeded</p>
                    <p className="text-[10px] text-rose-600 leading-relaxed">
                      Order total (£{totalDue.toFixed(2)}) exceeds customer limit (£{selectedCustomer?.creditLimit.toFixed(2)}).
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </Card>
        </div>
      </div>
    );
  };

  // --- MAIN RENDER ---
  if (view === 'create') {
    return (
      <div className="max-w-[1400px] mx-auto pb-12">
        <div className="flex flex-col gap-6">
           <div className="flex items-center gap-4">
              <button 
                onClick={() => setView('list')}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <h1 className="text-2xl font-bold text-slate-900">Create Order</h1>
           </div>
           
           {/* Stepper */}
           <div className="w-full max-w-5xl mx-auto mb-4">
             <div className="flex items-center justify-between bg-white rounded-2xl border border-slate-200 shadow-sm p-2">
                 <button 
                    onClick={() => setCurrentStep(1)}
                    className={`flex-1 flex items-center p-4 rounded-xl transition-all text-left ${currentStep === 1 ? 'bg-indigo-50 border border-indigo-100' : 'hover:bg-slate-50'}`}
                 >
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm mr-4 shadow-sm transition-all ${currentStep > 1 ? 'bg-emerald-500 text-white' : currentStep === 1 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                      {currentStep > 1 ? <Check className="h-5 w-5" /> : '1'}
                    </div>
                    <div>
                        <div className={`text-xs font-bold uppercase tracking-wider ${currentStep === 1 ? 'text-indigo-700' : currentStep > 1 ? 'text-emerald-700' : 'text-slate-400'}`}>1 Customer</div>
                        <div className="text-[11px] text-slate-500 font-medium">Select buyer</div>
                    </div>
                 </button>
                 <div className="h-8 w-px bg-slate-200 mx-4"></div>
                 <button 
                    onClick={() => selectedCustomer && setCurrentStep(2)}
                    disabled={!selectedCustomer}
                    className={`flex-1 flex items-center p-4 rounded-xl transition-all text-left ${currentStep === 2 ? 'bg-indigo-50 border border-indigo-100' : selectedCustomer ? 'hover:bg-slate-50' : 'opacity-50 cursor-not-allowed'}`}
                 >
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm mr-4 shadow-sm transition-all ${currentStep > 2 ? 'bg-emerald-500 text-white' : currentStep === 2 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                      {currentStep > 2 ? <Check className="h-5 w-5" /> : '2'}
                    </div>
                    <div>
                        <div className={`text-xs font-bold uppercase tracking-wider ${currentStep === 2 ? 'text-indigo-700' : currentStep > 2 ? 'text-emerald-700' : 'text-slate-400'}`}>2 Products</div>
                        <div className="text-[11px] text-slate-500 font-medium">Add items</div>
                    </div>
                 </button>
                 <div className="h-8 w-px bg-slate-200 mx-4"></div>
                 <button 
                    onClick={() => selectedCustomer && Object.keys(cart).length > 0 && setCurrentStep(3)}
                    disabled={!selectedCustomer || Object.keys(cart).length === 0}
                    className={`flex-1 flex items-center p-4 rounded-xl transition-all text-left ${currentStep === 3 ? 'bg-indigo-50 border border-indigo-100' : (selectedCustomer && Object.keys(cart).length > 0) ? 'hover:bg-slate-50' : 'opacity-50 cursor-not-allowed'}`}
                 >
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm mr-4 shadow-sm transition-all ${currentStep === 3 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>3</div>
                    <div>
                        <div className={`text-xs font-bold uppercase tracking-wider ${currentStep === 3 ? 'text-indigo-700' : 'text-slate-400'}`}>3 Review</div>
                        <div className="text-[11px] text-slate-500 font-medium">Confirm order</div>
                    </div>
                 </button>
             </div>
           </div>

           <div className="min-h-[500px]">
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
           </div>

           {/* Footer Buttons */}
           <div className="flex justify-between items-center pt-8 border-t border-slate-200 mt-8">
              <Button 
                variant="secondary" 
                onClick={() => currentStep > 1 ? setCurrentStep(p=>p-1) : setView('list')}
                icon={<ChevronLeft className="h-4 w-4" />}
              >
                 {currentStep > 1 ? 'Back to Previous Step' : 'Cancel Order'}
              </Button>
              
              <div className="flex items-center gap-6">
                {currentStep === 2 && cartItemsCount > 0 && (
                  <div className="flex items-center gap-6 animate-fadeIn">
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Items</span>
                      <span className="font-bold text-slate-900">{cartItemsCount}</span>
                    </div>
                    <div className="h-8 w-px bg-slate-200"></div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Subtotal</span>
                      <span className="font-bold text-indigo-600">£{subtotal.toFixed(2)}</span>
                    </div>
                  </div>
                )}
                
                {currentStep < 3 && (
                    <Button 
                      variant="primary" 
                      onClick={() => setCurrentStep(p=>p+1)} 
                      disabled={(currentStep === 1 && !selectedCustomer) || (currentStep === 2 && Object.keys(cart).length === 0)}
                      className="px-8"
                    >
                      Continue to {currentStep === 1 ? 'Products' : 'Review'} <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                )}
              </div>
           </div>
        </div>
      </div>
    );
  }

  // --- LIST VIEW ---
  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12">
      
      {/* 1. Page Header */}
      <Section 
        title="Orders" 
        description="Manage customer orders and payment status."
        action={
          <>
            <Button variant="secondary" icon={<ShoppingCart className="h-4 w-4" />} onClick={() => navigate('/active-carts')}>Active Carts (36)</Button>
            {hasPermission('Orders', 'create') && (
              <Button icon={<Plus className="h-4 w-4" />} onClick={() => { setCurrentStep(1); setSelectedCustomer(null); setCart({}); setView('create'); }}>Create Order</Button>
            )}
          </>
        }
      >
        {/* 2. Order Summary Cards */}
        <Grid cols={4} gap={4}>
          <KpiCard 
            title="Total Orders" 
            value={localOrders.length} 
            icon={Box} 
            color="indigo" 
            onClick={() => { setStatusFilter('All'); setPaymentFilter('All'); }} 
          />
          <KpiCard 
            title="Pending Processing" 
            value={localOrders.filter(o => o.status === 'Pending' || o.status === 'Processing').length} 
            icon={Clock} 
            color="amber" 
            onClick={() => setStatusFilter('Pending')} 
          />
          <KpiCard 
            title="Completed Orders" 
            value={localOrders.filter(o => o.status === 'Delivered').length} 
            icon={CheckCircle} 
            color="emerald" 
            onClick={() => setStatusFilter('Delivered')} 
          />
          <KpiCard 
            title="Cancelled / Returns" 
            value={localOrders.filter(o => o.status === 'Cancelled').length} 
            icon={XCircle} 
            color="rose" 
            onClick={() => setStatusFilter('Cancelled')} 
          />
        </Grid>

        <Card padding="none" className="flex flex-col">
          {/* 3. Filter Bar */}
          <div className="p-4 border-b border-slate-200 bg-white sticky top-0 z-10 rounded-t-2xl">
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
               <div className="w-full lg:w-96">
                 <Input placeholder="Search Order ID, Customer..." icon={<Search className="h-4 w-4" />} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
               </div>
               <div className="flex flex-wrap gap-2 w-full lg:w-auto">
                  <div className="w-40">
                     <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                       <option value="All">All Statuses</option>
                       {fbuStatuses.map(status => (
                         <option key={status} value={status}>{status}</option>
                       ))}
                     </Select>
                  </div>
                  <div className="w-40">
                     <Select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)}>
                       <option value="All">Payment Status</option>
                       <option value="Paid">Paid</option>
                       <option value="Pending">Pending</option>
                       <option value="Refunded">Refunded</option>
                     </Select>
                  </div>
                  <Button variant="ghost" icon={<Filter className="h-4 w-4" />} onClick={() => { setSearchTerm(''); setStatusFilter('All'); setPaymentFilter('All'); }}>Reset</Button>
               </div>
            </div>
          </div>

          {/* 4. Orders Table */}
          <Table>
            <THead>
              <TR>
                <TH>Order ID</TH>
                <TH>Customer</TH>
                <TH>Total</TH>
                <TH>Status</TH>
                <TH>Payment</TH>
                <TH>Date</TH>
                <TH align="center">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {paginatedOrders.map((order) => {
                const isDelivered = order.status === 'Delivered';
                const isCancelled = order.status === 'Cancelled';
                const canEditPrice = !isDelivered && !isCancelled;
                
                return (
                  <TR 
                    key={order.id} 
                    className={`cursor-pointer transition-all ${orderToDelete?.id === order.id ? 'ring-2 ring-rose-500 ring-inset bg-rose-50' : ''}`} 
                    onClick={() => openDetailModal(order)}
                  >
                    <TD className="font-mono text-slate-600">#{order.id}</TD>
                    <TD>
                       <div className="font-medium text-slate-900">{order.customer}</div>
                       <div className="text-xs text-slate-500">{getCustomerDetails(order.customer).companyName}</div>
                    </TD>
                    <TD className="font-bold text-slate-900">
                       <div className="flex items-center gap-2">
                          £{order.total.toFixed(2)}
                          {canEditPrice && hasPermission('Orders', 'edit') && (
                             <button 
                               onClick={(e) => openPriceEditModal(order, e)}
                               className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                               title="Edit Price & Qty"
                             >
                                <Edit2 className="h-3.5 w-3.5" />
                             </button>
                          )}
                       </div>
                    </TD>
                    <TD>
                       <Badge variant={
                          order.status === 'Delivered' ? 'success' : 
                          order.status === 'Cancelled' ? 'danger' : 
                          order.status === 'Shipped' ? 'info' : 'warning'
                       }>{order.status}</Badge>
                    </TD>
                    <TD className="text-slate-600">{order.paymentStatus}</TD>
                    <TD className="text-slate-600">{order.date}</TD>
                    <TD align="center">
                      <div className="flex justify-center gap-2" onClick={e => e.stopPropagation()}>
                        {isDelivered || !hasPermission('Orders', 'edit') ? (
                          <button 
                             onClick={() => openDetailModal(order)}
                             className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                             title="View Order"
                          >
                             <Eye className="h-4 w-4" />
                          </button>
                        ) : (
                          <button 
                             onClick={() => openStatusModal(order)}
                             className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                             title="Update Status"
                          >
                             <RefreshCw className="h-4 w-4" />
                          </button>
                        )}
                        
                        {order.status === 'Approved' && role?.name === 'Admin' && (
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
                        
                        {hasPermission('Orders', 'delete') && (
                          <button 
                             onClick={(e) => openDeleteModal(order, e)}
                             className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                             title="Delete Order"
                          >
                             <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </TD>
                  </TR>
                );
              })}
              {paginatedOrders.length === 0 && (
                <TR>
                  <TD colSpan={7} className="py-12 text-center text-slate-500">No orders found.</TD>
                </TR>
              )}
            </TBody>
          </Table>
          
          <Pagination 
            currentPage={orderPage} 
            totalItems={filteredOrders.length} 
            itemsPerPage={itemsPerPage} 
            onPageChange={setOrderPage} 
            onItemsPerPageChange={setItemsPerPage} 
            entityName="orders" 
          />
        </Card>
      </Section>

      {/* UPDATE STATUS MODAL */}
      <Modal 
         isOpen={isStatusModalOpen} 
         onClose={() => setIsStatusModalOpen(false)} 
         title="Update Order Status"
         size="sm"
         footer={
            <div className="flex gap-2 justify-end">
               <Button variant="secondary" onClick={() => setIsStatusModalOpen(false)}>Cancel</Button>
               <Button variant="primary" onClick={handleUpdateStatusConfirm} disabled={!newStatus}>Confirm Update</Button>
            </div>
         }
      >
         <div className="py-4 space-y-4">
             <p className="text-sm text-slate-500">
                Update status for Order <span className="font-bold text-slate-900">#{selectedOrder?.id}</span>.
             </p>
             <Select 
                label="Order Status"
                value={newStatus} 
                onChange={(e) => setNewStatus(e.target.value)}
             >
                <option value="" disabled>Select Status</option>
                {fbuStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
             </Select>
         </div>
      </Modal>

      {/* VIEW ORDER DETAILS MODAL */}
      <Modal
         isOpen={isDetailModalOpen}
         onClose={() => setIsDetailModalOpen(false)}
         title={`Order #${selectedOrder?.id}`}
         size="lg"
         footer={
            <div className="flex justify-between w-full">
               <div className="flex gap-2">
                  <Button variant="secondary" icon={<Printer className="h-4 w-4" />}>Print</Button>
                  <Button variant="secondary" icon={<FileDown className="h-4 w-4" />}>Invoice</Button>
                  <Button variant="secondary" icon={<Mail className="h-4 w-4" />}>Send Email</Button>
                  {selectedOrder && selectedOrder.status === 'Approved' && role?.name === 'Admin' && (
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
                  {selectedOrder && selectedOrder.status !== 'Delivered' && selectedOrder.status !== 'Cancelled' && hasPermission('Orders', 'edit') && (
                      <Button 
                        variant="secondary" 
                        icon={<Edit2 className="h-4 w-4" />}
                        onClick={() => openPriceEditModal(selectedOrder)}
                      >
                        Edit Order
                      </Button>
                  )}
               </div>
               <Button variant="secondary" onClick={() => setIsDetailModalOpen(false)}>Close</Button>
            </div>
         }
      >
         {selectedOrder && renderOrderDetails()}
      </Modal>

      {/* PRICE EDIT MODAL */}
      <Modal 
         isOpen={isPriceEditModalOpen}
         onClose={() => setIsPriceEditModalOpen(false)}
         title={`Edit Pricing - Order #${editingOrderRef?.id}`}
         size="lg"
         footer={
            <div className="flex gap-2 justify-end w-full">
               <Button variant="secondary" onClick={() => setIsPriceEditModalOpen(false)}>Cancel</Button>
               <Button variant="primary" onClick={handleSavePriceEdit}>Save Changes</Button>
            </div>
         }
      >
         <div className="space-y-6">
            <div className="flex items-center gap-2 p-3 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-sm">
               <AlertTriangle className="h-4 w-4 flex-shrink-0" />
               <p>Warning: Changing prices for an <strong>Approved</strong> order will revert its status to <strong>Not Approved</strong>.</p>
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
                           onChange={e => handleItemChange(idx, 'price', parseFloat(e.target.value) || 0)} 
                        />
                     </div>
                     <div className="col-span-3">
                        <Input 
                           label="Qty" 
                           type="number" 
                           value={item.qty.toString()} 
                           onChange={e => handleItemChange(idx, 'qty', parseInt(e.target.value) || 1)} 
                        />
                     </div>
                  </div>
               ))}
            </div>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-100">
               <Input 
                  label="Coupon Code" 
                  placeholder="e.g. SAVE20" 
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

      {/* DELETE CONFIRMATION MODAL */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => { setIsDeleteModalOpen(false); setOrderToDelete(null); }}
        title="Confirm Deletion"
        size="sm"
        footer={
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => { setIsDeleteModalOpen(false); setOrderToDelete(null); }}>Cancel</Button>
            <Button variant="danger" onClick={handleDeleteConfirm}>Delete Order</Button>
          </div>
        }
      >
        <div className="py-4 flex flex-col items-center text-center space-y-4">
          <div className="h-16 w-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-600">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Are you sure?</h3>
            <p className="text-sm text-slate-500 mt-1">
              You are about to delete order <span className="font-bold text-slate-900">#{orderToDelete?.id}</span>. This action cannot be undone.
            </p>
          </div>
        </div>
      </Modal>

      {/* STOCK REVERSAL MODAL */}
      <Modal
        isOpen={isReversalModalOpen}
        onClose={() => setIsReversalModalOpen(false)}
        title="Stock Reversal"
        size="md"
        footer={
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setIsReversalModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleReverseStockConfirm}>Confirm Reversal</Button>
          </div>
        }
      >
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm">
            <div className="col-span-2 border-b border-slate-200 pb-2 mb-2">
              <Select 
                label="Select Product from Order" 
                value={reversalData.product}
                onChange={e => {
                  const item = SIMULATED_ORDER_ITEMS.find(i => i.name === e.target.value);
                  if (item) {
                    setReversalData({
                      ...reversalData,
                      product: item.name,
                      flavour: item.flavour || 'Standard',
                      originalQuantity: item.qty
                    });
                  }
                }}
              >
                {SIMULATED_ORDER_ITEMS.map(item => (
                  <option key={item.name} value={item.name}>{item.name}</option>
                ))}
              </Select>
            </div>
            <div>
              <p className="text-slate-500 font-medium">Order ID</p>
              <p className="font-bold text-slate-900">#{reversalData.orderId}</p>
            </div>
            <div>
              <p className="text-slate-500 font-medium">Customer</p>
              <p className="font-bold text-slate-900">{reversalData.customer}</p>
            </div>
            <div>
              <p className="text-slate-500 font-medium">Flavour</p>
              <p className="font-bold text-slate-900">{reversalData.flavour}</p>
            </div>
            <div>
              <p className="text-slate-500 font-medium">Original Qty</p>
              <p className="font-bold text-slate-900">{reversalData.originalQuantity}</p>
            </div>
          </div>

          <div className="space-y-4">
            <Select 
              label="Reversal Type"
              value={reversalData.reversalType}
              onChange={e => setReversalData(prev => ({ ...prev, reversalType: e.target.value as any }))}
            >
              <option value="Add Stock Back">Add Stock Back</option>
              <option value="Remove Extra Stock">Remove Extra Stock</option>
            </Select>

            <Input 
              label="Reversal Quantity"
              type="number"
              value={reversalData.reversalQuantity?.toString()}
              onChange={e => setReversalData(prev => ({ ...prev, reversalQuantity: parseInt(e.target.value) || 0 }))}
            />

            <Select 
              label="Reason"
              value={reversalData.reason}
              onChange={e => setReversalData(prev => ({ ...prev, reason: e.target.value as any }))}
              required
            >
              <option value="Customer Return">Customer Return</option>
              <option value="Dispatch Error">Dispatch Error</option>
              <option value="Warehouse Adjustment">Warehouse Adjustment</option>
              <option value="Damaged Stock">Damaged Stock</option>
              <option value="Other">Other</option>
            </Select>

            <TextArea 
              label="Notes (Optional)"
              value={reversalData.notes}
              onChange={e => setReversalData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Enter any additional details..."
            />
          </div>
        </div>
      </Modal>

      {/* NOTIFICATION TOAST */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-8 left-1/2 z-[100] w-full max-w-md px-4"
          >
            <div className={`flex items-center justify-between p-4 rounded-2xl shadow-2xl border ${
              notification.type === 'success' ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-rose-600 border-rose-500 text-white'
            }`}>
              <div className="flex items-center gap-3">
                {notification.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
                <p className="text-sm font-bold">{notification.message}</p>
              </div>
              <button onClick={() => setNotification(null)} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrdersPage;
