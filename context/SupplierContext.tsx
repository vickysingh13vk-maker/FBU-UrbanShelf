import React, { createContext, useContext, useState } from 'react';
import { MOCK_SUPPLIER_PRODUCTS } from '../mock/supplierProducts';
import { MOCK_SUPPLIER_ORDERS } from '../mock/supplierOrders';
import { MOCK_SUPPLIER_INVENTORY } from '../mock/supplierInventory';
import { MOCK_SUPPLIER_SHIPMENTS } from '../mock/supplierShipments';
import { MOCK_SUPPLIER_FINANCE } from '../mock/supplierFinance';
import { MOCK_SUPPLIER_ANALYTICS } from '../mock/supplierAnalytics';
import { MOCK_SUPPLIER_PROMOTIONS } from '../mock/supplierPromotions';
import { MOCK_SUPPLIER_MARKET_INSIGHTS } from '../mock/supplierMarketInsights';
import { MOCK_SUPPLIER_REPORTS } from '../mock/supplierReports';
import {
  Product,
  SupplierOrder,
  SupplierInventoryItem,
  SupplierShipment,
  SupplierFinanceData,
  SupplierAnalyticsData,
  SupplierMarketInsightsData,
  SupplierReportsData,
  Promotion,
  SupplierOnboardingData,
} from '../types';
import { PRODUCTS, SUPPLIERS } from '../data';

interface SupplierContextType {
  products: Product[];
  orders: SupplierOrder[];
  inventory: SupplierInventoryItem[];
  shipments: SupplierShipment[];
  finance: SupplierFinanceData;
  analytics: SupplierAnalyticsData;
  promotions: Promotion[];
  marketInsights: SupplierMarketInsightsData;
  reports: SupplierReportsData;
  addProduct: (product: Partial<Product>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateInventory: (id: string, adjustment: { type: 'Add' | 'Reduce'; quantity: number; reason: string }) => void;
  addShipment: (shipment: Partial<SupplierShipment>) => void;
  updateShipment: (id: string, shipment: Partial<SupplierShipment>) => void;
  deleteShipment: (id: string) => void;
  addPromotion: (promotion: Partial<Promotion>) => void;
  updatePromotion: (id: string, promotion: Partial<Promotion>) => void;
  deletePromotion: (id: string) => void;
  isLoading: boolean;
  // Onboarding
  allBrands: { id: string; name: string; logo: string }[];
  allProducts: Product[];
  productMappings: Record<string, string>; // productId → userId
  completeOnboarding: (userId: string, data: SupplierOnboardingData, brandNames: string[], productIds: string[]) => void;
  isProductAssigned: (productId: string) => boolean;
}

const SupplierContext = createContext<SupplierContextType | undefined>(undefined);

export const SupplierProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(MOCK_SUPPLIER_PRODUCTS);
  const [orders] = useState<SupplierOrder[]>(MOCK_SUPPLIER_ORDERS);
  const [inventory, setInventory] = useState<SupplierInventoryItem[]>(MOCK_SUPPLIER_INVENTORY);
  const [shipments, setShipments] = useState<SupplierShipment[]>(MOCK_SUPPLIER_SHIPMENTS);
  const [finance] = useState<SupplierFinanceData>(MOCK_SUPPLIER_FINANCE as SupplierFinanceData);
  const [analytics] = useState<SupplierAnalyticsData>(MOCK_SUPPLIER_ANALYTICS);
  const [promotions, setPromotions] = useState<Promotion[]>(MOCK_SUPPLIER_PROMOTIONS as Promotion[]);
  const [marketInsights] = useState<SupplierMarketInsightsData>(MOCK_SUPPLIER_MARKET_INSIGHTS);
  const [reports] = useState<SupplierReportsData>(MOCK_SUPPLIER_REPORTS as SupplierReportsData);
  const [isLoading, setIsLoading] = useState(false);

  // Onboarding data
  const allBrands = SUPPLIERS.map(s => ({ id: s.id, name: s.name, logo: s.logo }));
  const allProducts = PRODUCTS as Product[];
  const [productMappings, setProductMappings] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('fbu_product_mappings');
    return saved ? JSON.parse(saved) : {};
  });

  const isProductAssigned = (productId: string) => {
    return productId in productMappings;
  };

  const completeOnboarding = (userId: string, data: SupplierOnboardingData, brandNames: string[], productIds: string[]) => {
    // Map selected products to this supplier
    const newMappings = { ...productMappings };
    productIds.forEach(pid => {
      newMappings[pid] = userId;
    });
    setProductMappings(newMappings);
    localStorage.setItem('fbu_product_mappings', JSON.stringify(newMappings));

    // Save onboarding data
    const onboardingStore = JSON.parse(localStorage.getItem('fbu_onboarding_data') || '{}');
    onboardingStore[userId] = { ...data, brands: brandNames, productIds };
    localStorage.setItem('fbu_onboarding_data', JSON.stringify(onboardingStore));

    // Mark user as onboarded
    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      user.onboardingCompleted = true;
      localStorage.setItem('auth_user', JSON.stringify(user));
    }
  };

  const addProduct = (product: Partial<Product>) => {
    setIsLoading(true);
    setTimeout(() => {
      const newProduct = {
        id: `SP-${Math.floor(Math.random() * 1000)}`,
        createdDate: new Date().toISOString().split('T')[0],
        status: 'Active',
        stock: 0,
        ...product,
      } as Product;
      setProducts(prev => [newProduct, ...prev]);
      setIsLoading(false);
    }, 500);
  };

  const updateProduct = (id: string, updatedProduct: Partial<Product>) => {
    setIsLoading(true);
    setTimeout(() => {
      setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...updatedProduct } : p)));
      setIsLoading(false);
    }, 500);
  };

  const deleteProduct = (id: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setProducts(prev => prev.filter(p => p.id !== id));
      setIsLoading(false);
    }, 500);
  };

  const updateInventory = (id: string, adjustment: { type: 'Add' | 'Reduce'; quantity: number; reason: string }) => {
    setIsLoading(true);
    setTimeout(() => {
      setInventory(prev =>
        prev.map(item => {
          if (item.id === id) {
            const newAvailable =
              adjustment.type === 'Add'
                ? item.available + adjustment.quantity
                : Math.max(0, item.available - adjustment.quantity);
            return { ...item, available: newAvailable };
          }
          return item;
        })
      );
      setIsLoading(false);
    }, 500);
  };

  const addShipment = (shipment: Partial<SupplierShipment>) => {
    setIsLoading(true);
    setTimeout(() => {
      const newShipment = {
        id: `SHP-${Math.floor(Math.random() * 1000) + 1000}`,
        createdDate: new Date().toISOString().split('T')[0],
        status: 'DRAFT',
        ...shipment,
      } as SupplierShipment;
      setShipments(prev => [newShipment, ...prev]);
      setIsLoading(false);
    }, 500);
  };

  const updateShipment = (id: string, updatedShipment: Partial<SupplierShipment>) => {
    setIsLoading(true);
    setTimeout(() => {
      setShipments(prev => prev.map(s => (s.id === id ? { ...s, ...updatedShipment } : s)));
      setIsLoading(false);
    }, 500);
  };

  const deleteShipment = (id: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setShipments(prev => prev.filter(s => s.id !== id));
      setIsLoading(false);
    }, 500);
  };

  const addPromotion = (promotion: Partial<Promotion>) => {
    setIsLoading(true);
    setTimeout(() => {
      const newPromotion = {
        id: `PROMO-${String(Math.floor(Math.random() * 900) + 100)}`,
        unitsSold: 0,
        revenue: 0,
        roi: 0,
        totalDiscountGiven: 0,
        ...promotion,
      } as Promotion;
      setPromotions(prev => [newPromotion, ...prev]);
      setIsLoading(false);
    }, 500);
  };

  const updatePromotion = (id: string, updatedPromotion: Partial<Promotion>) => {
    setIsLoading(true);
    setTimeout(() => {
      setPromotions(prev => prev.map(p => (p.id === id ? { ...p, ...updatedPromotion } : p)));
      setIsLoading(false);
    }, 500);
  };

  const deletePromotion = (id: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setPromotions(prev => prev.filter(p => p.id !== id));
      setIsLoading(false);
    }, 500);
  };

  return (
    <SupplierContext.Provider
      value={{
        products,
        orders,
        inventory,
        shipments,
        finance,
        analytics,
        promotions,
        marketInsights,
        reports,
        addProduct,
        updateProduct,
        deleteProduct,
        updateInventory,
        addShipment,
        updateShipment,
        deleteShipment,
        addPromotion,
        updatePromotion,
        deletePromotion,
        isLoading,
        allBrands,
        allProducts,
        productMappings,
        completeOnboarding,
        isProductAssigned,
      }}
    >
      {children}
    </SupplierContext.Provider>
  );
};

export const useSupplier = () => {
  const context = useContext(SupplierContext);
  if (context === undefined) {
    throw new Error('useSupplier must be used within a SupplierProvider');
  }
  return context;
};
