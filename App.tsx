import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import ProductsPage from './pages/Products';
import InventoryPage from './pages/Inventory';
import OrdersPage from './pages/Orders';
import AnalyticsPage from './pages/Analytics';
import RepPerformancePage from './pages/RepPerformance';
import GenericPage from './pages/GenericPage';
import AdminPage from './pages/Admin';
import SuppliersPage from './pages/Suppliers';
import CategoriesPage from './pages/Categories';
import CustomersPage from './pages/Customers';
import CustomerDetailsPage from './pages/CustomerDetails';
import ActiveCartsPage from './pages/ActiveCarts';
import CouponsPage from './pages/Coupons';
import PricingTiersPage from './pages/PricingTiers';
import MarketingPage from './pages/Marketing';
import LoginPage from './pages/Login';
import SupplierLogin from './pages/SupplierLogin';
import SupplierDashboard from './pages/supplier/SupplierDashboard';
import SupplierProducts from './pages/supplier/SupplierProducts';
import SupplierProductDetails from './pages/supplier/SupplierProductDetails';
import SupplierInbound from './pages/supplier/SupplierInbound';
import SupplierInventory from './pages/supplier/SupplierInventory';
import SupplierOrders from './pages/supplier/SupplierOrders';
import SupplierOrderDetails from './pages/supplier/SupplierOrderDetails';
import SupplierFinance from './pages/supplier/SupplierFinance';
import SupplierPerformance from './pages/supplier/SupplierPerformance';
import SupplierSettings from './pages/supplier/SupplierSettings';
import SupplierAnalytics from './pages/supplier/SupplierAnalytics';
import SupplierMarketInsights from './pages/supplier/SupplierMarketInsights';
import SupplierPricing from './pages/supplier/SupplierPricing';
import SupplierPromotions from './pages/supplier/SupplierPromotions';
import SupplierReports from './pages/supplier/SupplierReports';
import SupplierAccountManager from './pages/supplier/SupplierAccountManager';
import SupplierOnboarding from './pages/supplier/SupplierOnboarding';
import UsersPage from './pages/Users';
import RolesPermissionsPage from './pages/RolesPermissions';
import CheckInPage from './pages/CheckIn';
import CommissionDashboardPage from './pages/CommissionDashboard';
import StockReversalLedgerPage from './pages/StockReversalLedger';
import { AuthProvider } from './context/AuthContext';
import { DashboardProvider } from './context/DashboardContext';
import { CheckInProvider } from './context/CheckInContext';
import { ProductProvider } from './context/ProductContext';
import { SupplierProvider } from './context/SupplierContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <DashboardProvider>
        <ProductProvider>
          <SupplierProvider>
            <CheckInProvider>
            <HashRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/supplier/login" element={<SupplierLogin />} />
              <Route path="/supplier/onboarding" element={<SupplierOnboarding />} />
              <Route path="/*" element={
                <Layout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/supplier/dashboard" element={<SupplierDashboard />} />
                    <Route path="/supplier/products" element={<SupplierProducts />} />
                    <Route path="/supplier/products/:id" element={<SupplierProductDetails />} />
                    <Route path="/supplier/inbound" element={<SupplierInbound />} />
                    <Route path="/supplier/inventory" element={<SupplierInventory />} />
                    <Route path="/supplier/orders" element={<SupplierOrders />} />
                    <Route path="/supplier/orders/:id" element={<SupplierOrderDetails />} />
                    <Route path="/supplier/finance" element={<SupplierFinance />} />
                    <Route path="/supplier/performance" element={<SupplierPerformance />} />
                    <Route path="/supplier/settings" element={<SupplierSettings />} />
                    <Route path="/supplier/analytics" element={<SupplierAnalytics />} />
                    <Route path="/supplier/market-insights" element={<SupplierMarketInsights />} />
                    <Route path="/supplier/pricing" element={<SupplierPricing />} />
                    <Route path="/supplier/promotions" element={<SupplierPromotions />} />
                    <Route path="/supplier/reports" element={<SupplierReports />} />
                    <Route path="/supplier/account-manager" element={<SupplierAccountManager />} />
                    <Route path="/analytics" element={<AnalyticsPage />} />
                    <Route path="/rep-performance" element={<RepPerformancePage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/inventory" element={<InventoryPage />} />
                    <Route path="/orders" element={<OrdersPage />} />
                    <Route path="/active-carts" element={<ActiveCartsPage />} />
                    
                    <Route path="/customers" element={<CustomersPage />} />
                    <Route path="/customers/:id" element={<CustomerDetailsPage mode="view" />} />
                    <Route path="/customers/:id/edit" element={<CustomerDetailsPage mode="edit" />} />

                    <Route path="/check-in" element={<CheckInPage />} />
                    <Route path="/commission" element={<CommissionDashboardPage />} />
                    <Route path="/stock-reversal-ledger" element={<StockReversalLedgerPage />} />

                    <Route path="/coupons" element={<CouponsPage />} />
                    <Route path="/pricing" element={<PricingTiersPage />} />
                    <Route path="/marketing" element={<MarketingPage />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="/suppliers" element={<SuppliersPage />} />
                    <Route path="/categories" element={<CategoriesPage />} />

                    <Route path="/users" element={<UsersPage />} />
                    <Route path="/roles" element={<RolesPermissionsPage />} />

                    {/* Placeholders for other routes to ensure navigation works visually */}
                    <Route path="/loyalty" element={<GenericPage title="Loyalty Program" description="Points and rewards configuration." data={[]} columns={[]} actionLabel="Configure" />} />

                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Layout>
              } />
            </Routes>
          </HashRouter>
        </CheckInProvider>
      </SupplierProvider>
    </ProductProvider>
  </DashboardProvider>
</AuthProvider>
);
};

export default App;
