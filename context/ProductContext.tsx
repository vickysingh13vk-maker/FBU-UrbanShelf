import React, { createContext, useContext, useState, useMemo } from 'react';
import { Product, StockReversal } from '../types';
import { PRODUCTS, SUPPLIERS } from '../data';

export interface OrderActivity {
  id: string;
  orderId: string;
  type: string;
  message: string;
  date: string;
  user: string;
}

export interface ExtendedProduct extends Product {
  supplier: string;
  packSize: string;
  featured: boolean;
  description?: string;
  tags?: string[];
  pricingTier?: string;
  creditAmount?: number;
  // Configuration fields
  customisable?: boolean;
  bundleSize?: number;
  freeItemQty?: number;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: 'add' | 'remove';
  quantity: number;
  reason: string;
  date: string;
}

interface ProductContextType {
  products: ExtendedProduct[];
  stockHistory: StockMovement[];
  stockReversals: StockReversal[];
  orderActivities: OrderActivity[];
  setProducts: React.Dispatch<React.SetStateAction<ExtendedProduct[]>>;
  updateStock: (productId: string, newStock: number, reason: string, type: 'add' | 'remove', qty: number) => void;
  deleteProduct: (productId: string) => void;
  saveProduct: (product: Partial<ExtendedProduct>) => void;
  reverseStock: (reversal: Omit<StockReversal, 'id' | 'date'>) => void;
  addOrderActivity: (activity: Omit<OrderActivity, 'id' | 'date'>) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<ExtendedProduct[]>(() => 
    PRODUCTS.map((p, idx) => ({
      ...p,
      supplier: p.supplier || SUPPLIERS[idx % SUPPLIERS.length]?.name || 'Generic',
      packSize: idx % 3 === 0 ? 'Pack of 6' : '1 Unit',
      featured: idx % 5 === 0,
      description: 'High-quality product designed for professional use. Durable, reliable, and efficient.',
      tags: ['New', 'Best Seller'],
      pricingTier: 'Standard',
      creditAmount: 0,
      customisable: false,
      bundleSize: 1,
      freeItemQty: 0
    }))
  );

  const [stockHistory, setStockHistory] = useState<StockMovement[]>([]);
  const [stockReversals, setStockReversals] = useState<StockReversal[]>([
    {
      id: 'REV-1',
      orderId: '326',
      customer: 'James Cameron',
      product: 'LOST MARY BM6000 KIT',
      flavour: 'Strawberry Lime',
      originalQuantity: 10,
      reversalType: 'Add Stock Back',
      reversalQuantity: 2,
      reason: 'Customer Return',
      notes: 'Customer changed mind about flavour.',
      date: new Date(Date.now() - 86400000).toISOString(),
      adminUser: 'John Doe'
    }
  ]);
  const [orderActivities, setOrderActivities] = useState<OrderActivity[]>([
    {
      id: 'ACT-1',
      orderId: '326',
      type: 'Order Approved',
      message: 'Order status updated to Approved',
      date: new Date(Date.now() - 172800000).toISOString(),
      user: 'John Doe'
    },
    {
      id: 'ACT-2',
      orderId: '326',
      type: 'Stock Reversal',
      message: 'Stock reversed: Add Stock Back (2 units) - Reason: Customer Return',
      date: new Date(Date.now() - 86400000).toISOString(),
      user: 'John Doe'
    }
  ]);

  const updateStock = (productId: string, newStock: number, reason: string, type: 'add' | 'remove', qty: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, stock: newStock } : p
    ));

    const movement: StockMovement = {
      id: `M${Date.now()}`,
      productId,
      productName: product.name,
      type,
      quantity: qty,
      reason,
      date: new Date().toISOString()
    };

    setStockHistory(prev => [movement, ...prev]);
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const saveProduct = (productData: Partial<ExtendedProduct>) => {
    setProducts(prev => {
      const exists = prev.find(p => p.id === productData.id);
      if (exists) {
        return prev.map(p => p.id === productData.id ? { ...p, ...productData } as ExtendedProduct : p);
      } else {
        const newProduct: ExtendedProduct = {
          id: `P${Date.now()}`,
          name: '',
          sku: '',
          category: '',
          price: 0,
          stock: 0,
          status: 'Active',
          image: 'https://picsum.photos/40/40?random=' + Math.floor(Math.random() * 1000),
          supplier: 'Generic',
          packSize: '1 Unit',
          featured: false,
          ...productData
        } as ExtendedProduct;
        return [newProduct, ...prev];
      }
    });
  };

  const reverseStock = (reversal: Omit<StockReversal, 'id' | 'date'>) => {
    const newReversal: StockReversal = {
      ...reversal,
      id: `REV-${Date.now()}`,
      date: new Date().toISOString(),
    };

    setStockReversals(prev => [newReversal, ...prev]);

    // Update inventory
    const product = products.find(p => p.name === reversal.product && p.flavour === reversal.flavour);
    if (product) {
      const type = reversal.reversalType === 'Add Stock Back' ? 'add' : 'remove';
      const newStock = type === 'add' ? product.stock + reversal.reversalQuantity : product.stock - reversal.reversalQuantity;
      updateStock(product.id, newStock, `Stock Reversal: ${reversal.reason}`, type, reversal.reversalQuantity);
    }

    // Record activity
    addOrderActivity({
      orderId: reversal.orderId,
      type: 'Stock Reversal',
      message: `Stock reversed: ${reversal.reversalType} (${reversal.reversalQuantity} units) - Reason: ${reversal.reason}`,
      user: reversal.adminUser
    });
  };

  const addOrderActivity = (activity: Omit<OrderActivity, 'id' | 'date'>) => {
    const newActivity: OrderActivity = {
      ...activity,
      id: `ACT-${Date.now()}`,
      date: new Date().toISOString(),
    };
    setOrderActivities(prev => [newActivity, ...prev]);
  };

  return (
    <ProductContext.Provider value={{ 
      products, 
      stockHistory, 
      stockReversals,
      orderActivities,
      setProducts, 
      updateStock, 
      deleteProduct, 
      saveProduct,
      reverseStock,
      addOrderActivity
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
