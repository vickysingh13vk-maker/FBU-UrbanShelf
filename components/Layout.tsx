import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard, PieChart, ShoppingBag, Layers, Box, ShoppingCart,
  Users, Ticket, Tag, Megaphone, Heart, Settings, UsersRound, Shield,
  Mail, Wallet, Warehouse, RotateCcw, Truck, Activity,
  BarChart3, Map, Gift, FileText, UserCircle, Target, TrendingUp,
  ClipboardList, MapPin, CreditCard, UserCheck, Bell, AlertTriangle
} from 'lucide-react';
import { Sidebar, Navbar } from './ui';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  
  const { user, hasPermission, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (user?.roleName === 'Supplier' && user?.onboardingCompleted === false) {
      navigate('/supplier/onboarding');
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const allNavigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard, group: 'main', module: 'Dashboard' },
    { name: 'Sales Rep Dashboard', href: '/sales-rep-dashboard', icon: Activity, group: 'main', module: 'Dashboard' },
    { name: 'Analytics', href: '/analytics', icon: PieChart, group: 'analytics', module: 'Analytics' },
    { name: 'Rep Performance', href: '/rep-performance', icon: BarChart3, group: 'analytics', module: 'Analytics' },
    { name: 'Orders', href: '/orders', icon: ShoppingCart, group: 'analytics', module: 'Orders' },
    
    { name: 'Products', href: '/products', icon: Box, group: 'analytics', module: 'Products' },
    { name: 'Suppliers', href: '/suppliers', icon: ShoppingBag, group: 'analytics', module: 'Suppliers' },
    { name: 'Categories', href: '/categories', icon: Layers, group: 'analytics', module: 'Categories' },
    
    { name: 'Customers', href: '/customers', icon: UsersRound, group: 'customers', module: 'Customers' },
    { name: 'Marketing', href: '/marketing', icon: Megaphone, group: 'customers', module: 'Marketing' },
    { name: 'Email Campaigns', href: '/email-campaigns', icon: Mail, group: 'customers', module: 'Marketing' },
    { name: 'Coupons', href: '/coupons', icon: Ticket, group: 'customers', module: 'Coupons' },
    { name: 'Loyalty Program', href: '/loyalty', icon: Heart, group: 'customers', module: 'Loyalty Program' },
    { name: 'Pricing Tiers', href: '/pricing', icon: Tag, group: 'customers', module: 'Pricing Tiers' },
    
    { name: 'Shipments', href: '/admin/shipments', icon: Truck, group: 'admin', module: 'Administration' },
    { name: 'Finance', href: '/finance', icon: Wallet, group: 'admin', module: 'Administration' },
    { name: 'Inventory', href: '/inventory', icon: Warehouse, group: 'admin', module: 'Products' },
    { name: 'Stock Reversals', href: '/stock-reversal-ledger', icon: RotateCcw, group: 'admin', module: 'Products' },
    { name: 'Users', href: '/users', icon: Users, group: 'admin', module: 'Users' },
    { name: 'Roles & Permissions', href: '/roles', icon: Shield, group: 'admin', module: 'Administration' },
    { name: 'Administration', href: '/admin', icon: Settings, group: 'admin', module: 'Administration' },
  ];

  const supplierNavigation = [
    { name: 'Dashboard', href: '/supplier/dashboard', icon: LayoutDashboard, group: 'main' },
    { name: 'Products', href: '/supplier/products', icon: Box, group: 'analytics' },
    { name: 'Inbound Shipments', href: '/supplier/inbound', icon: Truck, group: 'analytics' },
    { name: 'Orders', href: '/supplier/orders', icon: ShoppingCart, group: 'analytics' },
    { name: 'Performance', href: '/supplier/performance', icon: Activity, group: 'analytics' },
    { name: 'Sales Analytics', href: '/supplier/analytics', icon: BarChart3, group: 'analytics' },
    { name: 'Market Insights', href: '/supplier/market-insights', icon: Map, group: 'analytics' },
    { name: 'Pricing', href: '/supplier/pricing', icon: Tag, group: 'analytics' },
    { name: 'Promotions', href: '/supplier/promotions', icon: Gift, group: 'analytics' },
    { name: 'Inventory', href: '/supplier/inventory', icon: Warehouse, group: 'admin' },
    { name: 'Finance', href: '/supplier/finance', icon: Wallet, group: 'admin' },
    { name: 'Reports', href: '/supplier/reports', icon: FileText, group: 'admin' },
    { name: 'Account Manager', href: '/supplier/account-manager', icon: UserCircle, group: 'admin' },
    { name: 'Settings', href: '/supplier/settings', icon: Settings, group: 'admin' },
  ];

  const salesManagerNavigation = [
    { name: 'Dashboard', href: '/sales-manager/dashboard', icon: LayoutDashboard, group: 'main' },
    { name: 'Team Monitoring', href: '/sales-manager/team', icon: UserCheck, group: 'main' },
    { name: 'Customers', href: '/sales-manager/customers', icon: UsersRound, group: 'crm' },
    { name: 'Leads Pipeline', href: '/sales-manager/leads', icon: Target, group: 'crm' },
    { name: 'Team Orders', href: '/sales-manager/orders', icon: ShoppingCart, group: 'crm' },
    { name: 'Payments', href: '/sales-manager/payments', icon: Wallet, group: 'crm' },
    { name: 'Territories', href: '/sales-manager/territories', icon: MapPin, group: 'analytics' },
    { name: 'Reports', href: '/sales-manager/reports', icon: FileText, group: 'analytics' },
    { name: 'Analytics', href: '/sales-manager/analytics', icon: BarChart3, group: 'analytics' },
    { name: 'Customer Health', href: '/sales-manager/customer-health', icon: AlertTriangle, group: 'analytics' },
    { name: 'Alerts', href: '/sales-manager/alerts', icon: Bell, group: 'analytics' },
    { name: 'Notifications', href: '/notifications', icon: Bell, group: 'ops' },
    { name: 'Escalations', href: '/escalations', icon: AlertTriangle, group: 'ops' },
    { name: 'Approvals', href: '/approvals', icon: ClipboardList, group: 'ops' },
    { name: 'Documents', href: '/documents', icon: FileText, group: 'ops' },
    { name: 'Automation', href: '/automation', icon: Activity, group: 'ops' },
  ];

  const salesRepNavigation = [
    { name: 'Dashboard', href: '/sales/dashboard', icon: LayoutDashboard, group: 'main' },
    { name: 'Today\'s Route', href: '/sales/route', icon: Map, group: 'execution' },
    { name: 'Visits', href: '/sales/visits', icon: MapPin, group: 'execution' },
    { name: 'Follow-Ups', href: '/sales/follow-ups', icon: ClipboardList, group: 'execution' },
    { name: 'Tasks', href: '/sales/tasks', icon: Activity, group: 'execution' },
    { name: 'Collections', href: '/sales/collections', icon: CreditCard, group: 'execution' },
    { name: 'My Customers', href: '/sales/customers', icon: UsersRound, group: 'crm' },
    { name: 'Leads', href: '/sales/leads', icon: Target, group: 'crm' },
    { name: 'My Orders', href: '/sales/orders', icon: ShoppingCart, group: 'crm' },
    { name: 'My Payments', href: '/sales/payments', icon: Wallet, group: 'crm' },
    { name: 'Activities', href: '/sales/activities', icon: Activity, group: 'crm' },
    { name: 'My Reports', href: '/sales/reporting', icon: TrendingUp, group: 'analytics' },
    { name: 'My Profile', href: '/sales/profile', icon: UserCircle, group: 'analytics' },
    { name: 'Notifications', href: '/notifications', icon: Bell, group: 'ops' },
    { name: 'Documents', href: '/documents', icon: FileText, group: 'ops' },
  ];

  let navigation: typeof allNavigation;
  switch (user?.roleName) {
    case 'Supplier':
      navigation = supplierNavigation;
      break;
    case 'Sales Manager':
      navigation = salesManagerNavigation;
      break;
    case 'Sales Rep':
      navigation = salesRepNavigation;
      break;
    default:
      navigation = allNavigation.filter(item => hasPermission(item.module, 'view'));
  }

  const userData = {
    name: user?.name || 'Guest User',
    role: user?.roleName || 'Viewer',
    avatar: user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'G')}&background=2666B5&color=fff`
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      <Sidebar 
        isOpen={sidebarOpen} 
        isCollapsed={isCollapsed}
        onClose={() => setSidebarOpen(false)} 
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        navigation={navigation} 
        user={userData} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar 
          onMenuClick={() => setSidebarOpen(true)}
          isFullScreen={isFullScreen}
          onToggleFullScreen={toggleFullScreen}
          showNotifications={showNotifications}
          onToggleNotifications={() => setShowNotifications(!showNotifications)}
          notificationsRef={notificationsRef}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-5 lg:p-6">
          <div className="max-w-[1400px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
