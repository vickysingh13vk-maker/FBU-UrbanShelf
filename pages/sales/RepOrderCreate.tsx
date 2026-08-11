import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Search, Plus, Minus, ShoppingCart, CheckCircle, X,
  ChevronDown, ChevronUp, CornerDownRight, Trash2, Box, Check,
  ChevronLeft, ChevronRight, Lock, ShieldCheck, CreditCard, Wallet,
  Building, Mail, Phone, Hash, Edit3,
  Heart, MapPin, Link2, Upload, Image as ImageIcon,
} from 'lucide-react';
import { Card, Table, THead, TBody, TR, TH, TD, Badge, Button } from '../../components/ui';
import { useSalesExecution } from '../../context/SalesExecutionContext';
import { useSalesCRM } from '../../context/SalesCRMContext';
import { useAuth } from '../../context/AuthContext';
import { useWorkSession } from '../../context/WorkSessionContext';
import { PRODUCTS, COUPONS } from '../../data';
import { Product, Customer, PaymentStatus, PaymentMethod, Coupon, FollowUp } from '../../types';

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = 1 | 2 | 3;
type TabView = 'products' | 'cart';
type CustomerTab = 'all' | 'recent' | 'favorites' | 'frequent';

interface CartItemData {
  qty: number;
  price: number;
  isFoc?: boolean;
  dealId?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const MOCK_DEALS = [
  { id: 'deal1', name: 'Buy 10 Get 1 Free' },
  { id: 'deal2', name: '10% Bulk Discount' },
  { id: 'deal3', name: 'Summer Special' },
];

// Discount each deal applies to a cart line, given the line's quantity and unit price.
const dealDiscount = (dealId: string | undefined, qty: number, price: number): number => {
  switch (dealId) {
    case 'deal1': return Math.floor(qty / 10) * price; // 1 free unit per 10 bought
    case 'deal2': return qty * price * 0.10;            // 10% bulk discount
    case 'deal3': return qty * price * 0.15;            // Summer Special: 15% off
    default: return 0;
  }
};

const CATEGORY_LIST = Array.from(new Set(PRODUCTS.map(p => p.category)));

const FOLLOW_UP_TYPES = [
  'Callback', 'Payment Reminder', 'Revisit', 'Product Demo',
  'Negotiation', 'Trial Follow-Up', 'Collection Follow-Up',
];

// ─── Inline Toggle ────────────────────────────────────────────────────────────

const Toggle: React.FC<{ checked: boolean; onChange: (v: boolean) => void }> = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
      checked ? 'bg-indigo-600' : 'bg-slate-200'
    }`}>
    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
      checked ? 'translate-x-5' : 'translate-x-0'
    }`} />
  </button>
);

// ─── Component ────────────────────────────────────────────────────────────────

const RepOrderCreate: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { createOrder, updateOrder, addFollowUp } = useSalesExecution();
  const { customers: CUSTOMERS } = useSalesCRM();
  const { recordOrder } = useWorkSession();

  const state = (location.state ?? {}) as {
    customerId?: string;
    customerName?: string;
    visitId?: string;
    returnPath?: string;
  };

  const hasPreselected = !!state.customerId;
  const visitId = state.visitId;

  // ── Customer Selection ─────────────────────────────────────────────────────
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    hasPreselected ? (CUSTOMERS.find(c => c.id === state.customerId) ?? null) : null,
  );
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerTab, setCustomerTab] = useState<CustomerTab>('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(6);

  // ── Step / Tab ─────────────────────────────────────────────────────────────
  const [step, setStep] = useState<Step>(hasPreselected ? 2 : 1);
  const [tab,  setTab]  = useState<TabView>('products');

  // ── Product / Cart ─────────────────────────────────────────────────────────
  const [productSearch,  setProductSearch]  = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [stockFilter,    setStockFilter]    = useState('All');
  const [cart,           setCart]           = useState<Record<string, CartItemData>>({});
  const [flavourPicker,  setFlavourPicker]  = useState<string | null>(null);

  // ── Review fields ──────────────────────────────────────────────────────────
  const [orderNotes,            setOrderNotes]            = useState('');
  const [deliveryInstructions,  setDeliveryInstructions]  = useState('');
  const [couponCode,            setCouponCode]            = useState('');
  const [appliedCoupon,         setAppliedCoupon]         = useState<Coupon | null>(null);
  const [couponError,           setCouponError]           = useState('');
  const [useCredit,             setUseCredit]             = useState(false);
  const [detailsExpanded,       setDetailsExpanded]       = useState(false);

  // ── Order result ───────────────────────────────────────────────────────────
  const [orderId, setOrderId] = useState('');

  // ── Outcome modal ──────────────────────────────────────────────────────────
  const [showOutcomeModal,  setShowOutcomeModal]  = useState(false);
  const [outcomePayStatus,  setOutcomePayStatus]  = useState<PaymentStatus | null>(null);
  const [outcomePayMethod,  setOutcomePayMethod]  = useState<PaymentMethod | null>(null);
  const [outcomeNotes,      setOutcomeNotes]      = useState('');
  const [mediaFiles,        setMediaFiles]        = useState<File[]>([]);
  const [showFollowUp,      setShowFollowUp]      = useState(false);
  const [followUpType,      setFollowUpType]      = useState('');
  const [followUpDate,      setFollowUpDate]      = useState('');
  const [followUpNotes,     setFollowUpNotes]     = useState('');

  // ── Derived ────────────────────────────────────────────────────────────────
  const customer     = selectedCustomer;
  const customerId   = selectedCustomer?.id ?? '';
  const customerName = selectedCustomer?.storeName || selectedCustomer?.name || 'Customer';

  const cartItemsCount = useMemo(
    () => Object.values(cart).reduce((s, i: CartItemData) => s + i.qty, 0),
    [cart],
  );
  const subtotal = useMemo(
    () => Object.values(cart).reduce((s, i: CartItemData) => (i.isFoc ? s : s + i.price * i.qty), 0),
    [cart],
  );
  const dealDiscountTotal = useMemo(
    () => Object.values(cart).reduce((s, i: CartItemData) => (i.isFoc ? s : s + dealDiscount(i.dealId, i.qty, i.price)), 0),
    [cart],
  );
  const subtotalAfterDeals = Math.max(0, subtotal - dealDiscountTotal);
  const couponDiscount = useMemo(() => {
    if (!appliedCoupon || subtotalAfterDeals < appliedCoupon.minOrder) return 0;
    const raw = appliedCoupon.type === 'Percentage'
      ? subtotalAfterDeals * (appliedCoupon.value / 100)
      : appliedCoupon.value;
    return Math.min(raw, appliedCoupon.maxDiscount, subtotalAfterDeals);
  }, [appliedCoupon, subtotalAfterDeals]);
  const netSubtotal     = subtotalAfterDeals - couponDiscount;
  const vat             = netSubtotal * 0.2;
  const totalDue        = netSubtotal + vat;
  const creditAvailable = customer?.walletBalance ?? 0;
  const creditApplied   = useCredit ? Math.min(totalDue, creditAvailable) : 0;
  const finalTotal      = totalDue - creditApplied;

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) return;
    const match = COUPONS.find(c => c.code.toUpperCase() === code);
    if (!match) {
      setAppliedCoupon(null);
      setCouponError('Invalid promo code.');
      return;
    }
    if (match.status !== 'Active') {
      setAppliedCoupon(null);
      setCouponError(`This code is ${match.status.toLowerCase()}.`);
      return;
    }
    if (subtotalAfterDeals < match.minOrder) {
      setAppliedCoupon(null);
      setCouponError(`Requires a minimum order of £${match.minOrder.toFixed(2)}.`);
      return;
    }
    setAppliedCoupon(match);
    setCouponError('');
  };

  const clearCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  // ── Rep customers for Step 1 ───────────────────────────────────────────────
  const repCustomers = useMemo(() => {
    const assigned = CUSTOMERS.filter(
      c => c.assignedRepId === user?.id && c.status === 'Approved',
    );
    return assigned.length > 0
      ? assigned
      : CUSTOMERS.filter(c => c.status === 'Approved');
  }, [user?.id, CUSTOMERS]);

  // ── Product groups ─────────────────────────────────────────────────────────
  const filteredGroups = useMemo(() => {
    const flat = PRODUCTS.filter(p => {
      const q = productSearch.toLowerCase();
      const matchSearch =
        !productSearch ||
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        (p.supplier ?? '').toLowerCase().includes(q) ||
        (p.flavour ?? '').toLowerCase().includes(q);
      const matchCat   = categoryFilter === 'All' || p.category === categoryFilter;
      const matchStock =
        stockFilter === 'All' ||
        (stockFilter === 'In Stock' && p.stock > 0) ||
        (stockFilter === 'Out of Stock' && p.stock === 0);
      return matchSearch && matchCat && matchStock;
    });
    const map = new Map<string, Product[]>();
    flat.forEach(p => {
      const arr = map.get(p.name) ?? [];
      arr.push(p);
      map.set(p.name, arr);
    });
    return Array.from(map.entries());
  }, [productSearch, categoryFilter, stockFilter]);

  // ── Cart actions ───────────────────────────────────────────────────────────
  const handleAddToCart = (product: Product, delta: number) => {
    setCart(prev => {
      const cur  = prev[product.id]?.qty ?? 0;
      const next = Math.max(0, cur + delta);
      const copy = { ...prev };
      if (next === 0) {
        delete copy[product.id];
      } else {
        copy[product.id] = {
          qty:    next,
          price:  prev[product.id]?.price ?? product.price,
          isFoc:  prev[product.id]?.isFoc,
          dealId: prev[product.id]?.dealId,
        };
      }
      return copy;
    });
  };

  const updateCartItem = (id: string, updates: Partial<CartItemData>) => {
    setCart(prev => {
      if (!prev[id]) return prev;
      return { ...prev, [id]: { ...prev[id], ...updates } };
    });
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = () => {
    const id = createOrder({
      customer:      customerName,
      customerId,
      repId:         user?.id ?? '',
      visitId,
      date:          new Date().toLocaleDateString('en-GB'),
      total:         finalTotal,
      items:         cartItemsCount,
      status:        'Pending',
      paymentStatus: 'Pending',
    });
    setOrderId(id);
    recordOrder(finalTotal);
    if (visitId) {
      navigate(state.returnPath ?? '/sales/orders', {
        state: {
          returnedOrderId:    id,
          returnedOrderTotal: finalTotal,
          returnedVisitId:    visitId,
        },
      });
    } else {
      setShowOutcomeModal(true);
    }
  };

  const handleOutcomeComplete = () => {
    if (orderId) {
      updateOrder(orderId, {
        paymentStatus: outcomePayStatus ?? 'Pending',
        paymentMethod: outcomePayStatus === 'Paid' ? (outcomePayMethod ?? undefined) : undefined,
        notes: outcomeNotes.trim() || undefined,
      });
    }
    if (showFollowUp && followUpType && followUpDate) {
      addFollowUp({
        type: followUpType as FollowUp['type'],
        repId: user?.id ?? '',
        customerId,
        customerName,
        dueDate: followUpDate,
        status: 'Pending',
        priority: 'Medium',
        notes: followUpNotes,
        linkedVisitId: visitId,
      });
    }
    setShowOutcomeModal(false);
    navigate(state.returnPath ?? '/sales/orders');
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMediaFiles(prev => [...prev, ...Array.from(e.target.files ?? [])]);
  };

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  // ── Stepper ────────────────────────────────────────────────────────────────
  const Stepper = () => (
    <div className="flex items-center justify-between bg-white rounded-2xl border border-slate-200 shadow-sm p-2">
      {/* Step 1 */}
      <div
        onClick={() => !hasPreselected && step > 1 && setStep(1)}
        className={`flex-1 flex items-center p-4 rounded-xl transition-all ${
          step === 1
            ? 'bg-indigo-50 border border-indigo-100'
            : !hasPreselected && step > 1
            ? 'hover:bg-slate-50 cursor-pointer'
            : 'cursor-default'
        }`}>
        <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm mr-4 shadow-sm flex-shrink-0 transition-all ${
          hasPreselected || step > 1 ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white'
        }`}>
          {hasPreselected || step > 1 ? <Check className="h-5 w-5" /> : '1'}
        </div>
        <div>
          <div className={`text-xs font-bold uppercase tracking-wider ${
            hasPreselected || step > 1 ? 'text-emerald-700' : 'text-indigo-700'
          }`}>1 Customer</div>
          <div className="text-[11px] text-slate-500 font-medium">
            {step > 1 || hasPreselected ? customerName : 'Select buyer'}
          </div>
        </div>
      </div>

      <div className="h-8 w-px bg-slate-200 mx-2 flex-shrink-0" />

      {/* Step 2 */}
      <div
        onClick={() => step === 3 && setStep(2)}
        className={`flex-1 flex items-center p-4 rounded-xl transition-all ${
          step === 2
            ? 'bg-indigo-50 border border-indigo-100'
            : step === 3
            ? 'hover:bg-slate-50 cursor-pointer'
            : step === 1
            ? 'opacity-50 cursor-not-allowed'
            : ''
        }`}>
        <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm mr-4 shadow-sm flex-shrink-0 transition-all ${
          step === 3 ? 'bg-emerald-500 text-white' : step === 2 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'
        }`}>
          {step === 3 ? <Check className="h-5 w-5" /> : '2'}
        </div>
        <div>
          <div className={`text-xs font-bold uppercase tracking-wider ${
            step === 2 ? 'text-indigo-700' : step === 3 ? 'text-emerald-700' : 'text-slate-400'
          }`}>2 Products</div>
          <div className="text-[11px] text-slate-500 font-medium">Add items</div>
        </div>
      </div>

      <div className="h-8 w-px bg-slate-200 mx-2 flex-shrink-0" />

      {/* Step 3 */}
      <div
        onClick={() => Object.keys(cart).length > 0 && step >= 2 && setStep(3)}
        className={`flex-1 flex items-center p-4 rounded-xl transition-all ${
          step === 3
            ? 'bg-indigo-50 border border-indigo-100'
            : Object.keys(cart).length > 0 && step >= 2
            ? 'hover:bg-slate-50 cursor-pointer'
            : 'opacity-50 cursor-not-allowed'
        }`}>
        <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm mr-4 shadow-sm flex-shrink-0 transition-all ${
          step === 3 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'
        }`}>
          3
        </div>
        <div>
          <div className={`text-xs font-bold uppercase tracking-wider ${
            step === 3 ? 'text-indigo-700' : 'text-slate-400'
          }`}>3 Review</div>
          <div className="text-[11px] text-slate-500 font-medium">Confirm order</div>
        </div>
      </div>
    </div>
  );

  // ── Footer ─────────────────────────────────────────────────────────────────
  const Footer = () => {
    const handleBack = () => {
      if (step === 1) navigate(-1);
      else if (step === 2 && hasPreselected) navigate(-1);
      else setStep((step - 1) as Step);
    };
    return (
      <div className="flex justify-between items-center pt-8 border-t border-slate-200 mt-8">
        <Button
          variant="secondary"
          icon={<ChevronLeft className="h-4 w-4" />}
          onClick={handleBack}>
          {step > 2 ? 'Back to Previous Step' : 'Back'}
        </Button>

        <div className="flex items-center gap-6">
          {step === 2 && cartItemsCount > 0 && (
            <>
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Items</span>
                <span className="font-bold text-slate-900">{cartItemsCount}</span>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Subtotal</span>
                <span className="font-bold text-indigo-600">£{subtotal.toFixed(2)}</span>
              </div>
            </>
          )}

          {step === 1 && (
            <Button
              variant="primary"
              onClick={() => setStep(2)}
              disabled={!selectedCustomer}
              className="px-8">
              Continue to Products <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}

          {step === 2 && (
            <Button
              variant="primary"
              onClick={() => setStep(3)}
              disabled={Object.keys(cart).length === 0}
              className="px-8">
              Continue to Review <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    );
  };

  // ── Step 1: Customer Selection ─────────────────────────────────────────────
  const renderStep1 = () => {
    let filtered = repCustomers.filter(c => {
      const q = customerSearch.toLowerCase();
      const matchSearch =
        !customerSearch ||
        c.name.toLowerCase().includes(q) ||
        (c.storeName ?? '').toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q);
      const matchTab =
        customerTab === 'all' ? true :
        customerTab === 'favorites' ? favorites.includes(c.id) :
        customerTab === 'recent' ? ['C001', 'C002', 'C003'].includes(c.id) :
        customerTab === 'frequent' ? ['C004', 'C005'].includes(c.id) :
        true;
      return matchSearch && matchTab;
    });

    filtered.sort((a, b) => {
      if (customerTab === 'all') {
        const aFav = favorites.includes(a.id);
        const bFav = favorites.includes(b.id);
        if (aFav && !bFav) return -1;
        if (!aFav && bFav) return 1;
      }
      return a.name.localeCompare(b.name);
    });

    const display = filtered.slice(0, visibleCount);
    const hasMore = filtered.length > visibleCount;

    return (
      <div className="space-y-6">
        {/* Search */}
        <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex-1 min-w-[260px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              value={customerSearch}
              onChange={e => setCustomerSearch(e.target.value)}
              placeholder="Search by name, store, or email..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex p-1 bg-slate-100 rounded-xl w-fit">
          {(['all', 'recent', 'favorites', 'frequent'] as const).map(t => (
            <button
              key={t}
              onClick={() => setCustomerTab(t)}
              className={`px-6 py-2 text-sm font-bold rounded-lg transition-all ${
                customerTab === t ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}>
              {t === 'all' ? 'All Customers' : t === 'recent' ? 'Recent' : t === 'favorites' ? 'Favorites' : 'Frequent Buyers'}
            </button>
          ))}
        </div>

        {/* Customer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {display.map(c => {
            const isFav      = favorites.includes(c.id);
            const isSelected = selectedCustomer?.id === c.id;
            return (
              <Card
                key={c.id}
                className={`group relative cursor-pointer transition-all hover:shadow-xl hover:border-indigo-200 border-2 ${
                  isSelected ? 'border-indigo-600 bg-indigo-50/30' : 'border-transparent'
                }`}
                onClick={() => { setSelectedCustomer(c); setStep(2); }}>
                {/* Favorite heart */}
                <button
                  onClick={e => toggleFavorite(e, c.id)}
                  className={`absolute top-4 right-4 p-2 rounded-full transition-all z-10 ${
                    isFav ? 'text-rose-500 bg-rose-50' : 'text-slate-300 hover:text-rose-400 hover:bg-slate-50'
                  }`}>
                  <Heart className={`h-5 w-5 ${isFav ? 'fill-current' : ''}`} />
                </button>

                <div className="flex items-start gap-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors overflow-hidden flex-shrink-0">
                    {c.image ? <img src={c.image} alt="" className="h-full w-full object-cover" /> : c.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 truncate">{c.name}</h4>
                    <p className="text-xs text-slate-500 truncate font-medium">{c.storeName}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Mail className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{c.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Phone className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
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
                  <Button variant={isSelected ? 'primary' : 'secondary'} size="sm">
                    {isSelected ? 'Selected' : 'Select Customer'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {hasMore && (
          <div className="flex justify-center pt-4">
            <Button variant="secondary" onClick={() => setVisibleCount(v => v + 6)} className="px-12">
              Load More Customers
            </Button>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No customers found</h3>
            <p className="text-sm text-slate-500 mt-1">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    );
  };

  // ── Step 2: Products ───────────────────────────────────────────────────────
  const renderStep2 = () => (
    <div className="space-y-6">
      {/* Products / Cart tabs */}
      <div className="flex p-1 bg-slate-100 rounded-xl w-fit">
        <button
          onClick={() => setTab('products')}
          className={`px-6 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2 ${
            tab === 'products' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}>
          <Box className="h-4 w-4" /> Products
        </button>
        <button
          onClick={() => setTab('cart')}
          className={`px-6 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2 ${
            tab === 'cart' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}>
          <ShoppingCart className="h-4 w-4" /> Cart
          <Badge variant={cartItemsCount > 0 ? 'indigo' : 'secondary'}>{cartItemsCount}</Badge>
        </button>
      </div>

      {/* ── Products tab ── */}
      {tab === 'products' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                value={productSearch}
                onChange={e => setProductSearch(e.target.value)}
                placeholder="Search products by name, SKU, supplier, or category..."
                className="w-full pl-10 pr-9 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
              {productSearch && (
                <button onClick={() => setProductSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="h-4 w-4 text-slate-400" />
                </button>
              )}
            </div>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300">
              <option value="All">All</option>
              {CATEGORY_LIST.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              value={stockFilter}
              onChange={e => setStockFilter(e.target.value)}
              className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300">
              <option value="All">All</option>
              <option value="In Stock">In Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>

          <Card padding="none" className="overflow-hidden">
            <div className="overflow-x-auto">
              <Table className="text-sm">
                <THead>
                  <TR>
                    <TH className="px-4 py-4">IMAGE</TH>
                    <TH className="px-4 py-4">NAME</TH>
                    <TH className="px-4 py-4">BRAND</TH>
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
                  {filteredGroups.length === 0 && (
                    <TR>
                      <TD colSpan={10} className="text-center py-12 text-slate-400 italic">
                        No products found
                      </TD>
                    </TR>
                  )}
                  {filteredGroups.map(([groupName, variants]) => {
                    const first          = variants[0];
                    const isMulti        = variants.length > 1;
                    const totalStock     = variants.reduce((s, v) => s + v.stock, 0);
                    const totalQtyInCart = variants.reduce((s, v) => s + (cart[v.id]?.qty ?? 0), 0);
                    const flavoursInCart = variants.filter(v => cart[v.id]?.qty > 0).length;
                    const prices         = [...new Set(variants.map(v => v.price))];
                    const priceDisplay   = prices.length === 1
                      ? `£${prices[0].toFixed(2)}`
                      : `£${Math.min(...prices).toFixed(2)} - £${Math.max(...prices).toFixed(2)}`;
                    const cartonPrice    = first.price * (first.unitsPerCarton ?? 1);
                    const isOpen         = flavourPicker === groupName;

                    return (
                      <React.Fragment key={groupName}>
                        <TR className={isOpen ? 'bg-indigo-50/30' : ''}>
                          <TD className="px-4 py-4">
                            <div className="h-12 w-12 rounded bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0">
                              <img src={first.image} alt="" className="h-10 w-10 object-contain mix-blend-multiply" />
                            </div>
                          </TD>
                          <TD className="px-4 py-4">
                            <div className="min-w-[200px]">
                              <p className="font-black text-slate-900 text-sm uppercase">{groupName}</p>
                              <p className="text-[11px] text-slate-400 font-medium">{first.sku}</p>
                              {isMulti
                                ? <p className="text-[11px] text-indigo-500 font-bold">{variants.length} flavours available</p>
                                : <p className="text-[11px] text-slate-400 font-medium">{first.flavour}</p>
                              }
                            </div>
                          </TD>
                          <TD className="px-4 py-4">
                            <span className="text-slate-500 font-medium">{first.supplier}</span>
                          </TD>
                          <TD className="px-4 py-4">
                            {isMulti ? (
                              <button
                                onClick={() => setFlavourPicker(isOpen ? null : groupName)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                  isOpen
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                                    : totalQtyInCart > 0
                                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}>
                                {totalQtyInCart > 0 ? (
                                  <>
                                    <span className="bg-white/20 rounded-full h-5 w-5 flex items-center justify-center text-xs">
                                      {totalQtyInCart}
                                    </span>
                                    {flavoursInCart} flavour{flavoursInCart > 1 ? 's' : ''}
                                  </>
                                ) : 'Select Flavours'}
                                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                              </button>
                            ) : (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleAddToCart(first, -1)}
                                  disabled={!cart[first.id]}
                                  className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded text-slate-400 hover:text-indigo-600 transition-colors disabled:opacity-40">
                                  <Minus className="h-4 w-4" />
                                </button>
                                <div className="w-16 h-10 border border-slate-200 rounded flex items-center justify-center font-bold text-slate-900 bg-white">
                                  {cart[first.id]?.qty ?? 0}
                                </div>
                                <button
                                  onClick={() => handleAddToCart(first, 1)}
                                  disabled={first.stock === 0 || (cart[first.id]?.qty ?? 0) >= first.stock}
                                  className="w-8 h-8 flex items-center justify-center bg-indigo-50 rounded text-indigo-600 hover:bg-indigo-100 transition-colors disabled:opacity-40">
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                            )}
                          </TD>
                          <TD className="px-4 py-4">
                            <p className="text-sm font-black text-slate-900">{priceDisplay}</p>
                          </TD>
                          <TD className="px-4 py-4 text-slate-400">£0.00</TD>
                          <TD className="px-4 py-4 text-slate-400">{priceDisplay}</TD>
                          <TD className="px-4 py-4 text-slate-500 font-medium">{first.unitsPerCarton ?? 1}</TD>
                          <TD className="px-4 py-4">
                            <span className={`font-bold ${totalStock === 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                              {totalStock}
                            </span>
                          </TD>
                          <TD className="px-4 py-4">
                            <p className="text-sm font-bold text-emerald-600">£{cartonPrice.toFixed(2)}</p>
                          </TD>
                        </TR>

                        {isMulti && isOpen && variants.map(variant => {
                          const vQty    = cart[variant.id]?.qty ?? 0;
                          const vCarton = variant.price * (variant.unitsPerCarton ?? 1);
                          return (
                            <TR key={variant.id} className="bg-slate-50/60">
                              <TD className="px-4 py-2">
                                <div className="flex items-center justify-center">
                                  <CornerDownRight className="h-4 w-4 text-slate-300" />
                                </div>
                              </TD>
                              <TD className="px-4 py-2">
                                <div className="flex items-center gap-2.5">
                                  <img src={variant.image} alt="" className="h-8 w-8 rounded-md border border-slate-200 object-cover flex-shrink-0" />
                                  <div className="flex items-center gap-1.5">
                                    <div className={`h-2 w-2 rounded-full flex-shrink-0 ${
                                      variant.stock === 0 ? 'bg-rose-400' : variant.stock < 50 ? 'bg-amber-400' : 'bg-emerald-400'
                                    }`} />
                                    <span className="text-sm font-semibold text-slate-700">
                                      {variant.flavour ?? 'Original'}
                                    </span>
                                  </div>
                                </div>
                              </TD>
                              <TD className="px-4 py-2">
                                <span className="text-xs text-slate-400">{variant.supplier}</span>
                              </TD>
                              <TD className="px-4 py-2">
                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={() => handleAddToCart(variant, -1)}
                                    disabled={!cart[variant.id]}
                                    className="w-7 h-7 flex items-center justify-center bg-white border border-slate-200 rounded text-slate-400 hover:text-indigo-600 hover:border-indigo-300 transition-colors disabled:opacity-40">
                                    <Minus className="h-3 w-3" />
                                  </button>
                                  <div className={`w-12 h-7 border rounded flex items-center justify-center font-bold text-xs bg-white ${
                                    vQty > 0 ? 'border-indigo-300 text-indigo-700' : 'border-slate-200 text-slate-900'
                                  }`}>
                                    {vQty}
                                  </div>
                                  <button
                                    onClick={() => handleAddToCart(variant, 1)}
                                    disabled={variant.stock === 0 || vQty >= variant.stock}
                                    className="w-7 h-7 flex items-center justify-center bg-indigo-50 border border-indigo-100 rounded text-indigo-600 hover:bg-indigo-100 transition-colors disabled:opacity-40">
                                    <Plus className="h-3 w-3" />
                                  </button>
                                </div>
                              </TD>
                              <TD className="px-4 py-2">
                                <span className="text-xs font-bold text-slate-700">£{variant.price.toFixed(2)}</span>
                              </TD>
                              <TD className="px-4 py-2 text-xs text-slate-400">£0.00</TD>
                              <TD className="px-4 py-2 text-xs text-slate-400">£{variant.price.toFixed(2)}</TD>
                              <TD className="px-4 py-2 text-xs text-slate-400">{variant.unitsPerCarton ?? 1}</TD>
                              <TD className="px-4 py-2">
                                <span className={`text-xs font-bold ${
                                  variant.stock === 0 ? 'text-rose-500' : variant.stock < 50 ? 'text-amber-500' : 'text-emerald-500'
                                }`}>
                                  {variant.stock}
                                </span>
                              </TD>
                              <TD className="px-4 py-2">
                                <span className="text-xs font-bold text-emerald-600">£{vCarton.toFixed(2)}</span>
                              </TD>
                            </TR>
                          );
                        })}
                      </React.Fragment>
                    );
                  })}
                </TBody>
              </Table>
            </div>
          </Card>
        </div>
      )}

      {/* ── Cart tab ── */}
      {tab === 'cart' && (
        <Card padding="none" className="overflow-hidden">
          <Table className="text-sm">
            <THead>
              <TR>
                <TH className="px-4 py-4">Product</TH>
                <TH className="px-4 py-4">Price</TH>
                <TH className="px-4 py-4">Quantity</TH>
                <TH className="px-4 py-4 text-right">Subtotal</TH>
                <TH className="px-4 py-4" />
              </TR>
            </THead>
            <TBody>
              {Object.keys(cart).length === 0 ? (
                <TR>
                  <TD colSpan={5} className="text-center py-12 text-slate-400 italic">
                    Your cart is empty.
                  </TD>
                </TR>
              ) : (
                Object.entries(cart).map(([id, item]) => {
                  const p = PRODUCTS.find(pr => pr.id === id);
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
                      <TD className="px-4 py-4 text-sm text-slate-600 font-medium">
                        £{item.price.toFixed(2)}
                      </TD>
                      <TD className="px-4 py-4">
                        <div className="flex items-center bg-slate-100 rounded p-0.5 border border-slate-200 w-fit">
                          <button
                            onClick={() => handleAddToCart(p, -1)}
                            className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm text-slate-600 hover:text-indigo-600 font-bold">
                            -
                          </button>
                          <span className="w-10 text-center font-bold text-slate-900 text-sm">{item.qty}</span>
                          <button
                            onClick={() => handleAddToCart(p, 1)}
                            disabled={item.qty >= p.stock}
                            className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm text-slate-600 hover:text-indigo-600 font-bold">
                            +
                          </button>
                        </div>
                      </TD>
                      <TD className="px-4 py-4 text-right font-bold text-slate-900">
                        £{(item.qty * item.price).toFixed(2)}
                      </TD>
                      <TD className="px-4 py-4 text-right">
                        <button
                          onClick={() => handleAddToCart(p, -item.qty)}
                          className="p-2 text-slate-400 hover:text-rose-600 transition-colors">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </TD>
                    </TR>
                  );
                })
              )}
            </TBody>
          </Table>
        </Card>
      )}
    </div>
  );

  // ── Step 3: Review ─────────────────────────────────────────────────────────
  const renderStep3 = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

      {/* Left */}
      <div className="lg:col-span-9 space-y-8">

        {/* Customer Details */}
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-4">Customer Details</h2>
          <Card className="border-slate-200 overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 flex-shrink-0 shadow-sm overflow-hidden">
                  {customer?.image
                    ? <img src={customer.image} alt="" className="h-full w-full rounded-full object-cover" />
                    : <span className="text-xl font-bold">{customerName.charAt(0)}</span>
                  }
                </div>
                <div>
                  <h3 className="text-[22px] font-bold text-slate-900 leading-tight">{customerName}</h3>
                  {customer?.companyName && (
                    <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <Building className="h-3.5 w-3.5" /> {customer.companyName}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                {!detailsExpanded && customer?.email && (
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                    <Mail className="h-3.5 w-3.5 text-slate-400" /> {customer.email}
                  </div>
                )}
                {!detailsExpanded && customer?.phone && (
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                    <Phone className="h-3.5 w-3.5 text-slate-400" /> {customer.phone}
                  </div>
                )}
                <button
                  onClick={() => setDetailsExpanded(v => !v)}
                  className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 px-3 py-1.5 rounded-full transition-colors">
                  {detailsExpanded
                    ? <><ChevronUp className="h-4 w-4" /> Hide Details</>
                    : <><ChevronDown className="h-4 w-4" /> View Details</>
                  }
                </button>
              </div>
            </div>

            {detailsExpanded && customer && (
              <div className="pt-6 mt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Email</p>
                    <p className="font-semibold text-slate-700">{customer.email}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Phone</p>
                    <p className="font-semibold text-slate-700">{customer.phone}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Company</p>
                    <p className="font-semibold text-slate-700">{customer.companyName}</p>
                  </div>
                  {customer.regNo && (
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Reg No.</p>
                      <p className="font-semibold text-slate-700 flex items-center gap-1">
                        <Hash className="h-3 w-3 text-slate-400" /> {customer.regNo}
                      </p>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Address</p>
                  <p className="font-semibold text-slate-700 leading-relaxed">{customer.address}</p>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Order Items */}
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-4">Order Items</h2>
          <Card padding="none" className="overflow-hidden border-slate-200">
            <div className="overflow-x-auto">
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
                  {Object.entries(cart).map(([id, item]) => {
                    const p = PRODUCTS.find(pr => pr.id === id);
                    if (!p) return null;
                    const unitsPerCarton = p.unitsPerCarton ?? 200;
                    const pricePerCarton = item.price * unitsPerCarton;
                    const totalCartons   = item.qty / unitsPerCarton;
                    const itemVat        = item.isFoc ? 0 : item.qty * item.price * 0.2;
                    return (
                      <TR key={id}>
                        <TD className="px-4 py-4">
                          <input
                            type="checkbox"
                            checked={item.isFoc ?? false}
                            onChange={e => updateCartItem(id, { isFoc: e.target.checked })}
                            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                        </TD>
                        <TD className="px-4 py-4">
                          <select
                            value={item.dealId ?? ''}
                            onChange={e => updateCartItem(id, { dealId: e.target.value })}
                            className="text-xs px-2 py-1.5 border border-slate-200 rounded-lg w-32 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300">
                            <option value="">Select Deal</option>
                            {MOCK_DEALS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                          </select>
                        </TD>
                        <TD className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                              <img src={p.image} alt="" className="h-8 w-8 object-contain mix-blend-multiply" />
                            </div>
                            <span className="font-bold text-slate-900 text-xs truncate max-w-[120px]">{p.name}</span>
                          </div>
                        </TD>
                        <TD className="px-4 py-4 text-xs text-slate-600 whitespace-nowrap">
                          {p.flavour ?? '—'}
                        </TD>
                        <TD className="px-4 py-4">
                          <div className="flex items-center gap-1.5 group">
                            <span className="text-xs font-bold text-slate-700">£</span>
                            <input
                              type="number"
                              step="0.01"
                              value={item.price}
                              onChange={e => updateCartItem(id, { price: parseFloat(e.target.value) || 0 })}
                              className="w-16 text-xs font-bold text-slate-900 border-none bg-transparent p-0 focus:ring-0 focus:outline-none"
                            />
                            <Edit3 className="h-3 w-3 text-slate-300 group-hover:text-indigo-400 transition-colors cursor-pointer" />
                          </div>
                        </TD>
                        <TD className="px-4 py-4">
                          <div className="flex items-center bg-slate-50 rounded-lg border border-slate-200 w-fit overflow-hidden">
                            <button
                              onClick={() => handleAddToCart(p, -1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-white text-slate-500 transition-colors">
                              <Minus className="h-3 w-3" />
                            </button>
                            <input
                              type="number"
                              value={item.qty}
                              onChange={e => updateCartItem(id, { qty: Math.max(0, Math.min(parseInt(e.target.value) || 0, p.stock)) })}
                              className="w-12 text-center text-xs font-bold text-slate-900 bg-transparent border-none focus:ring-0 p-0"
                            />
                            <button
                              onClick={() => handleAddToCart(p, 1)}
                              disabled={item.qty >= p.stock}
                              className="w-8 h-8 flex items-center justify-center hover:bg-white text-slate-500 transition-colors">
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </TD>
                        <TD className="px-4 py-4 text-xs font-bold text-slate-700 whitespace-nowrap">
                          £{pricePerCarton.toFixed(2)}
                        </TD>
                        <TD className="px-4 py-4 text-xs font-bold text-slate-700">
                          {totalCartons.toFixed(2)}
                        </TD>
                        <TD className="px-4 py-4 text-xs font-bold text-slate-700 whitespace-nowrap">
                          £{itemVat.toFixed(2)}
                        </TD>
                        <TD className="px-4 py-4 text-center">
                          <button
                            onClick={() => handleAddToCart(p, -item.qty)}
                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </TD>
                      </TR>
                    );
                  })}
                </TBody>
              </Table>
            </div>
          </Card>
        </div>

        {/* Notes */}
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Order Notes</label>
            <textarea
              value={orderNotes}
              onChange={e => setOrderNotes(e.target.value)}
              placeholder="Add internal notes about this order..."
              rows={3}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Delivery Instructions</label>
            <textarea
              value={deliveryInstructions}
              onChange={e => setDeliveryInstructions(e.target.value)}
              placeholder="Add instructions for the delivery team..."
              rows={3}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Right: Payment Summary */}
      <div className="lg:col-span-3 lg:sticky lg:top-6">
        <Card className="shadow-2xl border-indigo-100 overflow-hidden ring-1 ring-slate-200/50" padding="none">
          <div className="p-5 bg-gradient-to-br from-slate-50 to-white border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-indigo-600" /> Payment Summary
            </h3>
          </div>

          <div className="p-5 space-y-6">
            {/* Promo */}
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
                <Button variant="secondary" size="sm" className="px-4" onClick={handleApplyCoupon} disabled={!couponCode.trim()}>Apply</Button>
              </div>
              {couponError && <p className="text-xs font-semibold text-rose-600">{couponError}</p>}
              {appliedCoupon && (
                <div className="flex items-center justify-between text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                  <span>{appliedCoupon.code} applied</span>
                  <button onClick={clearCoupon} className="text-emerald-600 hover:text-emerald-800">Remove</button>
                </div>
              )}
            </div>

            {/* Breakdown */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Subtotal</span>
                <span className="font-bold text-slate-900">£{subtotal.toFixed(2)}</span>
              </div>
              {dealDiscountTotal > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium">Deal Discount</span>
                  <span className="font-bold text-emerald-600">-£{dealDiscountTotal.toFixed(2)}</span>
                </div>
              )}
              {couponDiscount > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium">Promo Discount</span>
                  <span className="font-bold text-emerald-600">-£{couponDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 font-medium">VAT</span>
                  <Badge variant="secondary" className="text-[9px] px-1.5 py-0">20%</Badge>
                </div>
                <span className="font-bold text-slate-900">£{vat.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Shipping</span>
                <span className="font-bold text-slate-900">£0.00</span>
              </div>
              {useCredit && creditApplied > 0 && (
                <div className="flex justify-between items-center text-sm p-2 bg-indigo-50/50 rounded-lg border border-indigo-100/50">
                  <div className="flex items-center gap-1.5">
                    <Wallet className="h-3.5 w-3.5 text-indigo-600" />
                    <span className="text-indigo-700 font-bold">Credit Applied</span>
                  </div>
                  <span className="font-bold text-indigo-700">-£{creditApplied.toFixed(2)}</span>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="pt-5 border-t border-slate-100">
              <div className="flex justify-between items-end mb-1">
                <span className="text-sm font-bold text-slate-900">Total Payable</span>
                <span className="text-3xl font-black text-indigo-600 tracking-tight">
                  £{finalTotal.toFixed(2)}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 text-right font-medium">Net amount after all adjustments</p>
            </div>

            {/* Credit toggle */}
            {customer && (
              <div className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-100/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center border border-indigo-100 flex-shrink-0">
                      <Wallet className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Available Credit</p>
                      <p className="text-lg font-black text-slate-900 leading-none mt-0.5">
                        £{creditAvailable.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Use Credit</span>
                    <Toggle checked={useCredit} onChange={setUseCredit} />
                  </div>
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="space-y-4">
              <Button
                variant="primary"
                className="w-full py-4 text-base shadow-2xl shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 active:translate-y-0"
                onClick={handleSubmit}
                icon={<ShieldCheck className="h-5 w-5" />}>
                Place Order
              </Button>
              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                <Lock className="h-3 w-3" /> Secure Checkout
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  // ── Main ───────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-[1400px] mx-auto pb-12">
      <div className="flex flex-col gap-6">
        {/* Title */}
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-900">Create Order</h1>
          {selectedCustomer && <span className="text-slate-400 text-sm">— {customerName}</span>}
        </div>

        {/* Stepper */}
        <Stepper />

        {/* Step content */}
        <div className="min-h-[500px]">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>

        {/* Footer */}
        <Footer />
      </div>

      {/* ── Outcome Modal ── */}
      {showOutcomeModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

            {/* Header */}
            <div className="flex items-center gap-4 p-6 border-b border-slate-100">
              <div className="h-12 w-12 bg-emerald-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">Order Placed!</h2>
                <p className="text-sm text-slate-500">{customerName}</p>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Order card */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Order ID</p>
                  <p className="text-sm font-bold text-emerald-900 mt-0.5">#{orderId}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Total</p>
                  <p className="text-2xl font-black text-emerald-900 mt-0.5">£{finalTotal.toFixed(2)}</p>
                </div>
              </div>

              {/* Payment Status */}
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Payment Status</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'Paid' as PaymentStatus,      label: 'Done',      activeClass: 'bg-emerald-50 border-emerald-500 text-emerald-700' },
                    { value: 'Pending' as PaymentStatus,   label: 'Pending',   activeClass: 'bg-amber-50 border-amber-500 text-amber-700' },
                    { value: 'On Credit' as PaymentStatus, label: 'On Credit', activeClass: 'bg-blue-50 border-blue-500 text-blue-700' },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setOutcomePayStatus(opt.value)}
                      className={`py-2.5 px-3 rounded-xl text-sm font-bold border-2 transition-all ${
                        outcomePayStatus === opt.value
                          ? opt.activeClass
                          : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                      }`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Method (Paid only) */}
              {outcomePayStatus === 'Paid' && (
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Payment Method</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'Link' as PaymentMethod, icon: <Link2 className="h-4 w-4" /> },
                      { value: 'Card' as PaymentMethod, icon: <CreditCard className="h-4 w-4" /> },
                    ].map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setOutcomePayMethod(opt.value)}
                        className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-bold border-2 transition-all ${
                          outcomePayMethod === opt.value
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                            : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                        }`}>
                        {opt.icon}
                        {opt.value}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Status notices */}
              {outcomePayStatus === 'Pending' && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-amber-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-amber-700 text-xs font-black">!</span>
                  </div>
                  <p className="text-sm text-amber-700 font-medium">Payment is pending. Follow up with the customer to collect.</p>
                </div>
              )}
              {outcomePayStatus === 'On Credit' && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                  <Wallet className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-700 font-medium">Order placed on credit. Amount added to customer's outstanding balance.</p>
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Notes</label>
                <textarea
                  value={outcomeNotes}
                  onChange={e => setOutcomeNotes(e.target.value)}
                  placeholder="Add notes about this order..."
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
                />
              </div>

              {/* Media */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Photos / Videos</label>
                <label className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-sm text-slate-500 hover:border-indigo-300 hover:text-indigo-500 cursor-pointer transition-colors">
                  <Upload className="h-4 w-4" />
                  Upload Media
                  <input type="file" multiple accept="image/*,video/*" className="hidden" onChange={handleMediaUpload} />
                </label>
                {mediaFiles.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-3">
                    {mediaFiles.map((file, idx) => (
                      <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                        {file.type.startsWith('image/') ? (
                          <img src={URL.createObjectURL(file)} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <ImageIcon className="h-6 w-6 text-slate-400" />
                          </div>
                        )}
                        <button
                          onClick={() => setMediaFiles(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute top-1 right-1 h-5 w-5 bg-black/60 rounded-full flex items-center justify-center">
                          <X className="h-3 w-3 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Follow-Up Accordion */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setShowFollowUp(v => !v)}
                  className="w-full flex items-center justify-between p-4 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                  <span>Schedule Follow-Up <span className="text-slate-400 font-normal">(Optional)</span></span>
                  {showFollowUp
                    ? <ChevronUp className="h-4 w-4 text-slate-400" />
                    : <ChevronDown className="h-4 w-4 text-slate-400" />}
                </button>
                {showFollowUp && (
                  <div className="p-4 space-y-4 border-t border-slate-100">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Type</label>
                      <select
                        value={followUpType}
                        onChange={e => setFollowUpType(e.target.value)}
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300">
                        <option value="">Select type...</option>
                        {FOLLOW_UP_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Due Date</label>
                      <input
                        type="date"
                        value={followUpDate}
                        onChange={e => setFollowUpDate(e.target.value)}
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Notes</label>
                      <textarea
                        value={followUpNotes}
                        onChange={e => setFollowUpNotes(e.target.value)}
                        placeholder="Notes for follow-up..."
                        rows={2}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Done CTA */}
              <Button variant="primary" className="w-full py-4 text-base" onClick={handleOutcomeComplete}>
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RepOrderCreate;
