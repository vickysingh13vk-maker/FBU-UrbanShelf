import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarItemProps {
  to: string;
  icon: any;
  label: string;
  active: boolean;
  isCollapsed: boolean;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon: Icon, label, active, isCollapsed }) => (
  <Link
    to={to}
    title={isCollapsed ? label : undefined}
    className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group relative ${
      active 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`}
  >
    {active && !isCollapsed && (
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-400 rounded-r-full" />
    )}
    <Icon className={`h-5 w-5 flex-shrink-0 transition-colors ${isCollapsed ? 'mx-auto' : 'mr-3'} ${active ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
    {!isCollapsed && <span className="truncate">{label}</span>}
  </Link>
);

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
  navigation: { name: string; href: string; icon: any; group?: string }[];
  user: { name: string; role: string; avatar: string };
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, isCollapsed, onClose, onToggleCollapse, navigation, user }) => {
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);

  // The sidebar is effectively collapsed if it's set to collapsed AND not being hovered
  const effectiveCollapsed = isCollapsed && !isHovered;

  const groups = [
    { id: 'main', items: navigation.filter(item => !item.group || item.group === 'main') },
    { id: 'analytics', label: 'Analytics & Catalog', items: navigation.filter(item => item.group === 'analytics') },
    { id: 'customers', label: 'Customers & Marketing', items: navigation.filter(item => item.group === 'customers') },
    { id: 'admin', label: 'Administration', items: navigation.filter(item => item.group === 'admin') },
  ];

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          fixed inset-y-0 left-0 z-50 bg-[#0F172A] border-r border-slate-800 transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:flex lg:flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          ${effectiveCollapsed ? 'w-20' : 'w-64'}
        `}
      >
        {/* Logo */}
        <div className={`flex items-center h-16 flex-shrink-0 px-4 border-b border-slate-800/50 ${effectiveCollapsed ? 'justify-center' : ''}`}>
          <Link to="/" className="flex items-center gap-3 group">
            {effectiveCollapsed
              ? <img src="/Src/Images/Logo_Icon.png" alt="FBU" className="h-8 shrink-0 group-hover:scale-105 transition-transform duration-300" />
              : <img src="/Src/Images/Logo.png" alt="FBU" className="h-10 shrink-0 group-hover:scale-105 transition-transform duration-300" />
            }
          </Link>
          <button 
            className="ml-auto lg:hidden text-slate-400 hover:text-white"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav Links */}
        <div className="flex-1 overflow-y-auto px-3 py-6 space-y-8 custom-scrollbar">
          {groups.map((group) => (
            group.items.length > 0 && (
              <div key={group.id} className="space-y-2">
                {!effectiveCollapsed && group.label && (
                  <h3 className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
                    {group.label}
                  </h3>
                )}
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <SidebarItem 
                      key={item.name}
                      to={item.href}
                      icon={item.icon}
                      label={item.name}
                      active={location.pathname === item.href}
                      isCollapsed={effectiveCollapsed}
                    />
                  ))}
                </div>
              </div>
            )
          ))}
        </div>

        {/* Collapse Toggle (Desktop) */}
        <div className="hidden lg:block p-3 border-t border-slate-800/50">
          <button
            onClick={onToggleCollapse}
            className="flex items-center justify-center w-full py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <div className="flex items-center gap-2 text-xs font-medium"><ChevronLeft className="h-4 w-4" /> Collapse Sidebar</div>}
          </button>
        </div>

        {/* User Profile Summary */}
        <div className={`p-4 border-t border-slate-800/50 bg-slate-900/30 ${effectiveCollapsed ? 'flex justify-center' : ''}`}>
          <div className="flex items-center gap-3">
            <img 
              className="h-9 w-9 rounded-lg bg-slate-800 border border-slate-700 object-cover" 
              src={user.avatar} 
              alt="Profile" 
            />
            {!effectiveCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                <p className="text-[10px] font-medium text-slate-500 truncate uppercase tracking-wider">{user.role}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
