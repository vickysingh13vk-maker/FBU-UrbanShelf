import React, { useState } from 'react';
import { User, Bell, Shield, Wallet, Globe, Mail, Phone, MapPin, Save, Trash2, Lock, CreditCard, ExternalLink, Check } from 'lucide-react';
import { 
  Card, Button, Badge, CardHeader, Input, Toast
} from '../../components/ui';

const SupplierSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showToast, setShowToast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1000);
  };

  const tabs = [
    { id: 'profile', label: 'Profile Information', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security & Password', icon: Shield },
    { id: 'payment', label: 'Payment Methods', icon: Wallet },
    { id: 'api', label: 'API & Integrations', icon: Globe },
  ];

  return (
    <div className="space-y-5 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Account Settings</h1>
            <p className="text-slate-500 mt-1 font-medium">Manage your supplier profile, notifications, and security.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-3 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                activeTab === tab.id 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                  : 'bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-slate-100'
              }`}
            >
              <tab.icon className={`h-5 w-5 ${activeTab === tab.id ? 'text-white' : 'text-slate-400'}`} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9 space-y-6">
          {activeTab === 'profile' && (
            <Card className="p-8 space-y-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Profile Information</h3>
                <p className="text-sm text-slate-500 font-medium">Update your company details and contact information.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">Company Name</label>
                  <Input defaultValue="FBU Supplier Ltd" className="h-12 rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">Supplier ID</label>
                  <Input defaultValue="SUP-12345" disabled className="h-12 rounded-xl bg-slate-50 border-slate-200 text-slate-500 font-mono" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">Contact Name</label>
                  <Input defaultValue="John Doe" className="h-12 rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">Email Address</label>
                  <Input defaultValue="supplier@demo.com" className="h-12 rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">Phone Number</label>
                  <Input defaultValue="+44 20 1234 5678" className="h-12 rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">Website</label>
                  <Input defaultValue="www.fbusupplier.com" className="h-12 rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">Business Address</label>
                <Input defaultValue="123 Supply Chain Way, London, UK" className="h-12 rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500" />
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <Button 
                  variant="primary" 
                  onClick={handleSave}
                  isLoading={isLoading}
                  icon={<Save className="h-4 w-4" />}
                  className="px-8 h-12 rounded-xl font-bold shadow-lg shadow-indigo-200"
                >
                  Save Changes
                </Button>
              </div>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card className="p-8 space-y-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Security & Password</h3>
                <p className="text-sm text-slate-500 font-medium">Manage your password and security preferences.</p>
              </div>

              <div className="space-y-6 max-w-md">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">Current Password</label>
                  <Input type="password" placeholder="••••••••" className="h-12 rounded-xl border-slate-200" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">New Password</label>
                  <Input type="password" placeholder="••••••••" className="h-12 rounded-xl border-slate-200" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">Confirm New Password</label>
                  <Input type="password" placeholder="••••••••" className="h-12 rounded-xl border-slate-200" />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <Button 
                  variant="primary" 
                  onClick={handleSave}
                  isLoading={isLoading}
                  icon={<Lock className="h-4 w-4" />}
                  className="px-8 h-12 rounded-xl font-bold"
                >
                  Update Password
                </Button>
              </div>
            </Card>
          )}

          {activeTab === 'payment' && (
            <Card className="p-8 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Payment Methods</h3>
                  <p className="text-sm text-slate-500 font-medium">Manage your bank accounts for payouts.</p>
                </div>
                <Button variant="secondary" icon={<CreditCard className="h-4 w-4" />}>Add Account</Button>
              </div>

              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-xl text-indigo-600 shadow-sm">
                    <Wallet className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">HSBC Business Account</p>
                    <p className="text-xs text-slate-500 font-medium">Ending in •••• 4567</p>
                  </div>
                </div>
                <Badge variant="success" className="font-bold">Primary</Badge>
              </div>
            </Card>
          )}

          <Card className="p-8 border-rose-100 bg-rose-50/30 space-y-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-rose-100 rounded-xl text-rose-600">
                <Trash2 className="h-6 w-6" />
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="text-lg font-bold text-rose-900">Deactivate Account</h3>
                <p className="text-sm text-rose-700 font-medium leading-relaxed">
                  Once you deactivate your account, you will no longer have access to the supplier portal. 
                  This action is reversible by contacting FBU support.
                </p>
                <div className="pt-4">
                  <Button variant="ghost" className="text-rose-600 hover:bg-rose-100 hover:text-rose-700 font-bold p-0 h-auto">
                    Deactivate my account
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {showToast && (
        <Toast 
          message="Settings saved successfully!" 
          type="success" 
          icon={<Check className="h-4 w-4" />}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default SupplierSettings;
