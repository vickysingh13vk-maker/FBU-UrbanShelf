import React from 'react';
// phase5-cache-bust
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
import ShipmentsPage from './pages/Shipments';

// Sales Manager CRM
import SMDashboard from './pages/sales-manager/SMDashboard';
import SMTeam from './pages/sales-manager/SMTeam';
import SMCustomers from './pages/sales-manager/SMCustomers';
import SMLeads from './pages/sales-manager/SMLeads';
import SMOrders from './pages/sales-manager/SMOrders';
import SMPayments from './pages/sales-manager/SMPayments';
import SMTerritories from './pages/sales-manager/SMTerritories';
import SMReports from './pages/sales-manager/SMReports';
import SMAnalytics from './pages/sales-manager/SMAnalytics';
import SMCustomerHealth from './pages/sales-manager/SMCustomerHealth';
import SMAlerts from './pages/sales-manager/SMAlerts';

// Sales Rep CRM
import RepDashboard from './pages/sales/RepDashboard';
import RepCustomerDetail from './pages/sales/RepCustomerDetail';
import RepLeadDetail from './pages/sales/RepLeadDetail';
import RepCustomers from './pages/sales/RepCustomers';
import RepLeads from './pages/sales/RepLeads';
import RepActivities from './pages/sales/RepActivities';
import RepOrders from './pages/sales/RepOrders';
import RepPayments from './pages/sales/RepPayments';
import RepReporting from './pages/sales/RepReporting';
import RepProfile from './pages/sales/RepProfile';
import RepVisits from './pages/sales/RepVisits';
import RepVisitDetail from './pages/sales/RepVisitDetail';
import RepFollowUps from './pages/sales/RepFollowUps';
import RepTasks from './pages/sales/RepTasks';
import RepCollections from './pages/sales/RepCollections';
import RepRoute from './pages/sales/RepRoute';
import RepOrderCreate from './pages/sales/RepOrderCreate';

// Phase 5 CRM Ops
import NotificationsCenter from './pages/NotificationsCenter';
import EscalationsDashboard from './pages/EscalationsDashboard';
import ApprovalQueue from './pages/ApprovalQueue';
import AuditLogs from './pages/AuditLogs';
import DocumentsManager from './pages/DocumentsManager';
import AutomationRules from './pages/AutomationRules';
import Customer360 from './pages/Customer360';

// Contexts
import { AuthProvider } from './context/AuthContext';
import { DashboardProvider } from './context/DashboardContext';
import { CheckInProvider } from './context/CheckInContext';
import { ProductProvider } from './context/ProductContext';
import { SupplierProvider } from './context/SupplierContext';
import { ShipmentProvider } from './context/ShipmentContext';
import { WorkSessionProvider } from './context/WorkSessionContext';
import { SalesCRMProvider } from './context/SalesCRMContext';
import { SalesExecutionProvider } from './context/SalesExecutionContext';
import { SalesManagerProvider } from './context/SalesManagerContext';
import { NotificationProvider } from './context/NotificationContext';
import { CRMOpsProvider } from './context/CRMOpsContext';
import { AutomationProvider } from './context/AutomationContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <DashboardProvider>
        <ProductProvider>
          <SupplierProvider>
            <ShipmentProvider>
            <WorkSessionProvider>
            <SalesCRMProvider>
            <SalesExecutionProvider>
            <SalesManagerProvider>
            <NotificationProvider>
            <CRMOpsProvider>
            <AutomationProvider>
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

                    {/* Supplier */}
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

                    {/* Core */}
                    <Route path="/analytics" element={<AnalyticsPage />} />
                    <Route path="/rep-performance" element={<RepPerformancePage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/inventory" element={<InventoryPage />} />
                    <Route path="/orders" element={<OrdersPage />} />
                    <Route path="/active-carts" element={<ActiveCartsPage />} />
                    <Route path="/customers" element={<CustomersPage />} />
                    <Route path="/customers/:id" element={<CustomerDetailsPage mode="view" />} />
                    <Route path="/customers/:id/edit" element={<CustomerDetailsPage mode="edit" />} />
                    <Route path="/customers/:id/360" element={<Customer360 />} />
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
                    <Route path="/admin/shipments" element={<ShipmentsPage />} />
                    <Route path="/loyalty" element={<GenericPage title="Loyalty Program" description="Points and rewards configuration." data={[]} columns={[]} actionLabel="Configure" />} />

                    {/* Sales Manager CRM */}
                    <Route path="/sales-manager/dashboard" element={<SMDashboard />} />
                    <Route path="/sales-manager/team" element={<SMTeam />} />
                    <Route path="/sales-manager/customers" element={<SMCustomers />} />
                    <Route path="/sales-manager/leads" element={<SMLeads />} />
                    <Route path="/sales-manager/orders" element={<SMOrders />} />
                    <Route path="/sales-manager/payments" element={<SMPayments />} />
                    <Route path="/sales-manager/territories" element={<SMTerritories />} />
                    <Route path="/sales-manager/reports" element={<SMReports />} />
                    <Route path="/sales-manager/analytics" element={<SMAnalytics />} />
                    <Route path="/sales-manager/customer-health" element={<SMCustomerHealth />} />
                    <Route path="/sales-manager/alerts" element={<SMAlerts />} />
                    <Route path="/sales-manager/escalations" element={<EscalationsDashboard />} />
                    <Route path="/sales-manager/approvals" element={<ApprovalQueue />} />

                    {/* Sales Rep CRM */}
                    <Route path="/sales/dashboard" element={<RepDashboard />} />
                    <Route path="/sales/customers" element={<RepCustomers />} />
                    <Route path="/sales/customers/:id" element={<RepCustomerDetail />} />
                    <Route path="/sales/leads/:id" element={<RepLeadDetail />} />
                    <Route path="/sales/leads" element={<RepLeads />} />
                    <Route path="/sales/activities" element={<RepActivities />} />
                    <Route path="/sales/orders" element={<RepOrders />} />
                    <Route path="/sales/orders/new" element={<RepOrderCreate />} />
                    <Route path="/sales/payments" element={<RepPayments />} />
                    <Route path="/sales/reporting" element={<RepReporting />} />
                    <Route path="/sales/profile" element={<RepProfile />} />
                    <Route path="/sales/visits" element={<RepVisits />} />
                    <Route path="/sales/visits/:id" element={<RepVisitDetail />} />
                    <Route path="/sales/follow-ups" element={<RepFollowUps />} />
                    <Route path="/sales/tasks" element={<RepTasks />} />
                    <Route path="/sales/collections" element={<RepCollections />} />
                    <Route path="/sales/route" element={<RepRoute />} />

                    {/* CRM Ops (Phase 5) */}
                    <Route path="/notifications" element={<NotificationsCenter />} />
                    <Route path="/escalations" element={<EscalationsDashboard />} />
                    <Route path="/approvals" element={<ApprovalQueue />} />
                    <Route path="/audit" element={<AuditLogs />} />
                    <Route path="/documents" element={<DocumentsManager />} />
                    <Route path="/automation" element={<AutomationRules />} />

                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Layout>
              } />
            </Routes>
          </HashRouter>
        </CheckInProvider>
            </AutomationProvider>
            </CRMOpsProvider>
            </NotificationProvider>
            </SalesManagerProvider>
            </SalesExecutionProvider>
            </SalesCRMProvider>
            </WorkSessionProvider>
            </ShipmentProvider>
          </SupplierProvider>
        </ProductProvider>
      </DashboardProvider>
    </AuthProvider>
  );
};

export default App;
