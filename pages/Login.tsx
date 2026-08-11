import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Card } from '../components/ui';
import { Lock, Mail, Eye, EyeOff, AlertCircle, ShieldCheck, Briefcase, Users, UserCircle, Truck, ScanEye } from 'lucide-react';

interface DemoAccount {
  role: string;
  name: string;
  email: string;
  password: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  { role: 'Admin', name: 'John Doe', email: 'admin@urbanshelf.com', password: 'admin123', icon: ShieldCheck, accent: 'text-indigo-600 bg-indigo-50 group-hover:bg-indigo-100' },
  { role: 'Manager', name: 'Jane Smith', email: 'manager@urbanshelf.com', password: 'manager123', icon: Briefcase, accent: 'text-blue-600 bg-blue-50 group-hover:bg-blue-100' },
  { role: 'Sales Manager', name: 'David Patel', email: 'david.patel@demand.com', password: 'manager123', icon: Users, accent: 'text-purple-600 bg-purple-50 group-hover:bg-purple-100' },
  { role: 'Sales Rep', name: 'John Smith', email: 'john.smith@demand.com', password: 'sales123', icon: UserCircle, accent: 'text-emerald-600 bg-emerald-50 group-hover:bg-emerald-100' },
  { role: 'Supplier', name: 'FBU Supplier', email: 'supplier@demo.com', password: '123456', icon: Truck, accent: 'text-amber-600 bg-amber-50 group-hover:bg-amber-100' },
  { role: 'Viewer', name: 'Olivia Bennett', email: 'viewer.demo@urbanshelf.com', password: 'viewer123', icon: ScanEye, accent: 'text-slate-600 bg-slate-100 group-hover:bg-slate-200' },
];

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [demoLoadingEmail, setDemoLoadingEmail] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const performLogin = async (loginEmail: string, loginPassword: string) => {
    setError(null);
    try {
      const success = await login(loginEmail, loginPassword);
      if (success) {
        const savedUser = localStorage.getItem('auth_user');
        const parsedUser = savedUser ? JSON.parse(savedUser) : null;
        if (parsedUser?.roleName === 'Supplier') {
          if (parsedUser.onboardingCompleted) {
            navigate('/supplier/dashboard');
          } else {
            navigate('/supplier/onboarding');
          }
        } else if (parsedUser?.roleName === 'Sales Rep') {
          navigate('/sales/dashboard');
        } else if (parsedUser?.roleName === 'Sales Manager') {
          navigate('/sales-manager/dashboard');
        } else {
          navigate('/');
        }
      } else {
        setError('Invalid email or password');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await performLogin(email, password);
    setLoading(false);
  };

  const handleDemoLogin = async (account: DemoAccount) => {
    setEmail(account.email);
    setPassword(account.password);
    setDemoLoadingEmail(account.email);
    await performLogin(account.email, account.password);
    setDemoLoadingEmail(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <img src="/Src/Images/Logo.png" alt="Urban Shelf" className="h-14 mx-auto mb-2" />
        </div>

        <Card className="p-8 shadow-xl shadow-slate-200/50 border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-800">Welcome Back</h2>
              <p className="text-sm text-slate-500">Please enter your credentials to continue</p>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-600 px-4 py-3 rounded-xl flex items-center gap-3 text-sm animate-shake">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="admin@urbanshelf.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="h-4 w-4" />}
                required
                className="h-12"
              />

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<Lock className="h-4 w-4" />}
                  required
                  className="h-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-[38px] text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-300 bg-white transition-all checked:border-indigo-600 checked:bg-indigo-600 hover:border-indigo-400"
                  />
                  <svg className="pointer-events-none absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-slate-600 group-hover:text-slate-800 transition-colors">Remember me</span>
              </label>
              <button type="button" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
                Forgot Password?
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full h-12 text-base font-bold shadow-lg shadow-indigo-100"
              isLoading={loading}
            >
              Sign In to Dashboard
            </Button>

          </form>
        </Card>

        <Card className="mt-6 p-6 shadow-xl shadow-slate-200/50 border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-slate-100" />
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Quick Demo Login</p>
            <div className="h-px flex-1 bg-slate-100" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {DEMO_ACCOUNTS.map((account) => {
              const Icon = account.icon;
              const isLoadingThis = demoLoadingEmail === account.email;
              return (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => handleDemoLogin(account)}
                  disabled={demoLoadingEmail !== null || loading}
                  className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-left transition-all hover:border-indigo-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg transition-colors ${account.accent}`}>
                    {isLoadingThis ? (
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-slate-700 truncate">{account.role}</span>
                    <span className="block text-xs text-slate-400 truncate">{account.email}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </Card>

        <p className="text-center mt-8 text-slate-400 text-sm">
          &copy; 2026 Urbanshelf. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
