import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Card } from '../components/ui';
import { Lock, Mail, Eye, EyeOff, AlertCircle, ArrowLeft, Headphones } from 'lucide-react';

const SupplierLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/supplier/dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <img src="/Src/Images/Logo_black.png" alt="FBU" className="h-12 mx-auto mb-2" />
        </div>

        <Card className="p-8 shadow-xl shadow-slate-200/50 border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-800">Supplier Login</h2>
              <p className="text-sm text-slate-500">Please enter your credentials to access the portal</p>
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
                placeholder="supplier@demo.com"
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

            <div className="flex flex-col gap-3">
              <Button
                type="submit"
                variant="primary"
                className="w-full h-12 text-base font-bold shadow-lg shadow-indigo-100"
                loading={loading}
              >
                Login
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="w-full h-12 text-base font-bold"
                onClick={() => navigate('/')}
                icon={<ArrowLeft className="h-4 w-4" />}
              >
                Back to main site
              </Button>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button type="button" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
                Forgot Password?
              </button>
              <button type="button" className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-800 transition-colors">
                <Headphones className="h-3.5 w-3.5" />
                Contact Support
              </button>
            </div>
          </form>
        </Card>

        <p className="text-center mt-8 text-slate-400 text-sm">
          &copy; 2026 Urbanshelf. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default SupplierLogin;
