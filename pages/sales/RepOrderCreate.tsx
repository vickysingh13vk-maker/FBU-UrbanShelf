import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Search, Plus, Minus, ShoppingCart, Package, CheckCircle, X } from 'lucide-react';
import { Card } from '../../components/ui';
import { useSalesExecution } from '../../context/SalesExecutionContext';
import { useAuth } from '../../context/AuthContext';
import { PRODUCTS } from '../../data';
import { Product } from '../../types';

type Step = 'products' | 'review';

interface CartItem {
  product: Product;
  qty: number;
}

const CATEGORIES = Array.from(new Set(PRODUCTS.map(p => p.category)));

const stockBadge = (stock: number) => {
  if (stock === 0) return <span className="px-1.5 py-0.5 bg-rose-50 text-rose-600 text-[10px] font-bold rounded-full">Out</span>;
  if (stock <= 50) return <span className="px-1.5 py-0.5 bg-amber-50 text-amber-600 text-[10px] font-bold rounded-full">Low</span>;
  return <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full">In Stock</span>;
};

const RepOrderCreate: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { createOrder } = useSalesExecution();

  const state = (location.state ?? {}) as {
    customerId?: string;
    customerName?: string;
    visitId?: string;
    repId?: string;
    returnPath?: string;
  };

  const customerId = state.customerId ?? '';
  const customerName = state.customerName ?? 'Customer';
  const visitId = state.visitId;

  const [step, setStep] = useState<Step>('products');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [cart, setCart] = useState<Record<string, CartItem>>({});
  const [submitted, setSubmitted] = useState(false);
  const [orderId, setOrderId] = useState('');

  const filtered = useMemo(() => {
    return PRODUCTS.filter(p => {
      const matchSearch = !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase()) ||
        (p.flavour ?? '').toLowerCase().includes(search.toLowerCase());
      const matchCat = categoryFilter === 'All' || p.category === categoryFilter;
      return matchSearch && matchCat;
    });
  }, [search, categoryFilter]);

  const cartItems = Object.values(cart).filter(i => i.qty > 0);
  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);
  const subtotal = cartItems.reduce((s, i) => s + i.product.price * i.qty, 0);
  const vat = subtotal * 0.2;
  const total = subtotal + vat;

  const setQty = (product: Product, qty: number) => {
    if (qty <= 0) {
      setCart(prev => { const next = { ...prev }; delete next[product.id]; return next; });
    } else {
      setCart(prev => ({ ...prev, [product.id]: { product, qty } }));
    }
  };

  const getQty = (id: string) => cart[id]?.qty ?? 0;

  const handleSubmit = () => {
    const id = createOrder({
      customer: customerName,
      customerId,
      repId: user?.id ?? '',
      visitId,
      date: new Date().toLocaleDateString('en-GB'),
      total,
      items: cartCount,
      status: 'Pending',
      paymentStatus: 'Pending',
    });
    setOrderId(id);
    setSubmitted(true);
  };

  const handleDone = () => {
    const returnPath = state.returnPath ?? '/sales/orders';
    navigate(returnPath, {
      state: {
        returnedOrderId: orderId,
        returnedOrderTotal: total,
        returnedVisitId: visitId,
      },
    });
  };

  if (submitted) {
    return (
      <div className="space-y-5">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-20 w-20 bg-emerald-100 rounded-3xl flex items-center justify-center mb-5">
            <CheckCircle className="h-10 w-10 text-emerald-600" />
          </div>
          <h2 className="text-xl font-black text-slate-800 mb-1">Order Placed!</h2>
          <p className="text-sm text-slate-500 mb-1">{customerName}</p>
          <p className="text-xs text-slate-400 mb-6">Order #{orderId}</p>
          <div className="grid grid-cols-2 gap-3 w-full max-w-xs mb-8">
            {[
              { label: 'Items', value: cartCount },
              { label: 'Subtotal', value: `£${subtotal.toFixed(2)}` },
              { label: 'VAT (20%)', value: `£${vat.toFixed(2)}` },
              { label: 'Total', value: `£${total.toFixed(2)}` },
            ].map(r => (
              <div key={r.label} className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-400">{r.label}</p>
                <p className="text-sm font-black text-slate-800">{r.value}</p>
              </div>
            ))}
          </div>
          <button onClick={handleDone}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-colors">
            {visitId ? 'Back to Visit →' : 'Done'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => step === 'review' ? setStep('products') : navigate(-1)}
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors group w-fit">
          <div className="p-1.5 bg-slate-100 group-hover:bg-slate-200 rounded-lg transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </div>
          {step === 'review' ? 'Products' : 'Back'}
        </button>
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          {(['products', 'review'] as Step[]).map((s, i) => (
            <div key={s} className={`h-1.5 rounded-full transition-all ${step === s || (s === 'products') ? 'bg-indigo-600' : 'bg-slate-200'}`}
              style={{ width: step === s ? 24 : 12 }} />
          ))}
          <span className="text-xs text-slate-400 ml-1">{step === 'products' ? 'Products' : 'Review'}</span>
        </div>
      </div>

      <div>
        <h1 className="text-xl font-black text-slate-800">New Order</h1>
        <p className="text-xs text-slate-500 mt-0.5">{customerName}</p>
      </div>

      {/* ── STEP 1: Products ── */}
      {step === 'products' && (
        <>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products, SKU, flavour..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="h-4 w-4 text-slate-400" />
              </button>
            )}
          </div>

          {/* Category filter */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {['All', ...CATEGORIES].map(cat => (
              <button key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  categoryFilter === cat ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}>
                {cat}
              </button>
            ))}
          </div>

          {/* Product list */}
          <div className="space-y-2">
            {filtered.length === 0 && (
              <Card padding="md" className="text-center py-10">
                <Package className="h-8 w-8 text-slate-200 mx-auto mb-2" />
                <p className="text-sm text-slate-400">No products found</p>
              </Card>
            )}
            {filtered.map(product => {
              const qty = getQty(product.id);
              const outOfStock = product.stock === 0;
              return (
                <div key={product.id}
                  className={`flex items-center gap-3 p-3 bg-white border rounded-xl transition-all ${
                    qty > 0 ? 'border-indigo-200 bg-indigo-50/30' : 'border-slate-200'
                  } ${outOfStock ? 'opacity-50' : ''}`}>
                  <img src={product.image} alt={product.name}
                    className="h-10 w-10 rounded-lg object-cover flex-shrink-0 bg-slate-100" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">{product.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {product.flavour && <p className="text-xs text-slate-500 truncate">{product.flavour}</p>}
                      {stockBadge(product.stock)}
                    </div>
                    <p className="text-xs font-bold text-indigo-600 mt-0.5">£{product.price.toFixed(2)} / unit</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {qty > 0 ? (
                      <>
                        <button
                          onClick={() => setQty(product, qty - 1)}
                          className="h-7 w-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
                          <Minus className="h-3.5 w-3.5 text-slate-600" />
                        </button>
                        <span className="text-sm font-black text-slate-800 w-6 text-center">{qty}</span>
                        <button
                          onClick={() => setQty(product, qty + 1)}
                          disabled={outOfStock}
                          className="h-7 w-7 rounded-lg bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center transition-colors disabled:opacity-40">
                          <Plus className="h-3.5 w-3.5 text-white" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => !outOfStock && setQty(product, 1)}
                        disabled={outOfStock}
                        className="h-8 w-8 rounded-lg bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center transition-colors disabled:opacity-40">
                        <Plus className="h-4 w-4 text-white" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cart bar */}
          {cartCount > 0 && (
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 shadow-xl z-30">
              <button
                onClick={() => setStep('review')}
                className="w-full flex items-center justify-between px-5 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  <span className="text-sm">{cartCount} items</span>
                </div>
                <span className="text-sm">£{subtotal.toFixed(2)} + VAT · Review →</span>
              </button>
            </div>
          )}
          {/* Spacer so last product isn't hidden behind cart bar */}
          {cartCount > 0 && <div className="h-20" />}
        </>
      )}

      {/* ── STEP 2: Review ── */}
      {step === 'review' && (
        <>
          {/* Customer */}
          <Card padding="md">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Customer</p>
            <p className="text-sm font-bold text-slate-800">{customerName}</p>
            {customerId && <p className="text-xs text-slate-400">ID: {customerId}</p>}
          </Card>

          {/* Items */}
          <Card padding="md">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Order Items</p>
            <div className="space-y-2">
              {cartItems.map(({ product, qty }) => (
                <div key={product.id} className="flex items-center gap-3">
                  <img src={product.image} alt={product.name}
                    className="h-9 w-9 rounded-lg object-cover flex-shrink-0 bg-slate-100" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-700 truncate">{product.name}</p>
                    {product.flavour && <p className="text-xs text-slate-400">{product.flavour}</p>}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-bold text-slate-800">£{(product.price * qty).toFixed(2)}</p>
                    <p className="text-xs text-slate-400">{qty} × £{product.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Totals */}
          <Card padding="md">
            <div className="space-y-2">
              {[
                { label: 'Subtotal', value: `£${subtotal.toFixed(2)}` },
                { label: 'VAT (20%)', value: `£${vat.toFixed(2)}` },
              ].map(r => (
                <div key={r.label} className="flex justify-between text-sm">
                  <span className="text-slate-500">{r.label}</span>
                  <span className="font-semibold text-slate-700">{r.value}</span>
                </div>
              ))}
              <div className="h-px bg-slate-100 my-1" />
              <div className="flex justify-between">
                <span className="text-sm font-bold text-slate-800">Total</span>
                <span className="text-base font-black text-indigo-600">£{total.toFixed(2)}</span>
              </div>
            </div>
          </Card>

          <button onClick={handleSubmit}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-colors">
            Place Order · £{total.toFixed(2)}
          </button>
        </>
      )}
    </div>
  );
};

export default RepOrderCreate;
