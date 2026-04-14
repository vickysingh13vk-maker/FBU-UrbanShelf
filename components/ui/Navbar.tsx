import React, { useState, useRef, useEffect } from 'react';
import { Menu, Search, Maximize, Minimize, Bell, ShoppingCart, Box, Users, ChevronDown, User as UserIcon, CheckCircle2, Calendar, LogOut, Settings, Shield, PlusCircle, Briefcase, Wallet, Warehouse, ShoppingBag } from 'lucide-react';
import { Input } from './Input';
import { useAuth } from '../../context/AuthContext';
import { useDashboard, DashboardRole } from '../../context/DashboardContext';
import { useLocation } from 'react-router-dom';

interface NavbarProps {
  onMenuClick: () => void;
  isFullScreen: boolean;
  onToggleFullScreen: () => void;
  showNotifications: boolean;
  onToggleNotifications: () => void;
  notificationsRef: React.RefObject<HTMLDivElement | null>;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onMenuClick, 
  isFullScreen, 
  onToggleFullScreen, 
  showNotifications, 
  onToggleNotifications,
  notificationsRef
}) => {
  const { user, logout } = useAuth();
  const { activeRole, setActiveRole } = useDashboard();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const isDashboard = location.pathname === '/';
  const isSupplier = user?.roleName === 'Supplier';

  const roles: { id: DashboardRole; label: string; icon: any }[] = [
    { id: 'admin', label: 'Admin', icon: Shield },
    { id: 'sales', label: 'Sales', icon: Briefcase },
    { id: 'finance', label: 'Finance', icon: Wallet },
    { id: 'inventory', label: 'Inventory', icon: Warehouse },
    { id: 'supplier', label: 'Supplier', icon: ShoppingBag },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentDate = new Date().toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 h-14 flex items-center">
      <div className="flex items-center justify-between w-full px-6">
        <div className="flex items-center gap-4">
          <button
            className="lg:hidden p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* Global Search */}
        <div className={`flex-1 flex items-center px-4 gap-6 ${isSupplier ? 'justify-start' : 'justify-center'}`}>
          <div className={`w-full ${isSupplier ? 'max-w-md' : 'max-w-xs'}`}>
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                type="text"
                placeholder="Search..." 
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 pl-9 pr-4 text-xs focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none"
              />
            </div>
          </div>

          {/* Role Switcher Tabs */}
          {isDashboard && user?.roleName === 'Admin' && (
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              {roles.map((role) => {
                const Icon = role.icon;
                const isActive = activeRole === role.id;
                return (
                  <button
                    key={role.id}
                    onClick={() => setActiveRole(role.id)}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all ${
                      isActive 
                        ? 'bg-white text-indigo-600 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50/50'
                    }`}
                  >
                    <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-indigo-500' : 'text-slate-400'}`} />
                    <span className="hidden lg:inline">{role.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-2">
          <button 
            className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors hidden sm:block"
            onClick={onToggleFullScreen}
            title={isFullScreen ? "Exit Full Screen" : "Enter Full Screen"}
          >
            {isFullScreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </button>

          <div className="relative" ref={notificationsRef}>
            <button 
              className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors relative"
              onClick={onToggleNotifications}
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-2 right-2 h-1.5 w-1.5 bg-rose-500 rounded-full border border-white"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h3 className="font-bold text-slate-900 text-sm">Notifications</h3>
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-wider">3 New</span>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <NotificationItem 
                    icon={<ShoppingCart className="h-4 w-4" />}
                    iconBg="bg-blue-50 text-blue-600"
                    title="New Order #ORD-092"
                    description="Acme Corp placed a new order for $1,240.00"
                    time="10 minutes ago"
                  />
                  <NotificationItem 
                    icon={<Box className="h-4 w-4" />}
                    iconBg="bg-emerald-50 text-emerald-600"
                    title="Low Stock Alert"
                    description="Premium Widget is running low (5 items left)"
                    time="1 hour ago"
                  />
                  <NotificationItem 
                    icon={<Users className="h-4 w-4" />}
                    iconBg="bg-purple-50 text-purple-600"
                    title="New Customer Registration"
                    description="TechSolutions Inc. has registered an account"
                    time="3 hours ago"
                  />
                </div>
                <div className="p-3 border-t border-slate-100 text-center bg-slate-50/50">
                  <button className="text-xs text-indigo-600 font-bold hover:text-indigo-700 uppercase tracking-wider">View All Notifications</button>
                </div>
              </div>
            )}
          </div>
          
          <div className="h-4 w-px bg-slate-200 mx-2 hidden sm:block"></div>

          <div className="relative" ref={userMenuRef}>
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 hover:bg-slate-50 p-1 rounded-lg transition-colors group"
            >
              <div className="h-7 w-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-900/20">
                 <UserIcon className="h-4 w-4" />
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-slate-900 leading-none">{user?.name}</p>
                <p className="text-[10px] font-medium text-slate-400 mt-0.5 leading-none">{user?.roleName}</p>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-2">
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                    <UserIcon className="h-4 w-4" /> Profile Settings
                  </button>
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                    <Settings className="h-4 w-4" /> Account Settings
                  </button>
                  <div className="h-px bg-slate-100 my-1"></div>
                  <button 
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

const NotificationItem: React.FC<{
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
  time: string;
}> = ({ icon, iconBg, title, description, time }) => (
  <div className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer group">
    <div className="flex gap-3">
      <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${iconBg}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-slate-900 font-semibold">{title}</p>
        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{description}</p>
        <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-wider">{time}</p>
      </div>
    </div>
  </div>
);
