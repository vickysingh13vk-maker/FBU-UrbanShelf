import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSupplier } from '../../context/SupplierContext';
import { Card, Button, Input, Badge } from '../../components/ui';
import {
  CheckCircle, ChevronRight, ChevronLeft, Building2, User, Phone, Mail,
  MapPin, FileText, Search, Package, Lock, ShieldCheck, LogOut
} from 'lucide-react';
import type { SupplierOnboardingData } from '../../types';

const COUNTRIES = [
  'United Kingdom', 'Ireland', 'France', 'Germany', 'Netherlands',
  'Belgium', 'Spain', 'Italy', 'Portugal', 'Poland'
];

const BUSINESS_TYPES = ['Manufacturer', 'Distributor', 'Brand Owner'] as const;

const SupplierOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const { user, markOnboardingComplete, logout } = useAuth();
  const { allBrands, allProducts, productMappings, completeOnboarding } = useSupplier();

  const [currentStep, setCurrentStep] = useState(1);
  const [productSearch, setProductSearch] = useState('');

  // Step 1 - Business Info
  const [businessInfo, setBusinessInfo] = useState<SupplierOnboardingData>({
    companyName: '',
    contactPerson: '',
    phone: '',
    email: user?.email || '',
    vatNumber: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'United Kingdom',
    businessType: 'Distributor',
  });

  // Step 2 - Brand Selection
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  // Step 3 - Product Selection
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  const updateField = (field: keyof SupplierOnboardingData, value: string) => {
    setBusinessInfo(prev => ({ ...prev, [field]: value }));
  };

  const toggleBrand = (brandName: string) => {
    setSelectedBrands(prev =>
      prev.includes(brandName)
        ? prev.filter(b => b !== brandName)
        : [...prev, brandName]
    );
    // Clear product selections when brands change
    setSelectedProductIds([]);
  };

  const toggleProduct = (productId: string) => {
    setSelectedProductIds(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Products filtered by selected brands, with availability status
  const filteredProducts = useMemo(() => {
    return allProducts
      .filter(p => selectedBrands.includes(p.supplier || ''))
      .filter(p => {
        if (!productSearch) return true;
        const q = productSearch.toLowerCase();
        return p.name.toLowerCase().includes(q) ||
               p.sku.toLowerCase().includes(q) ||
               (p.flavour || '').toLowerCase().includes(q);
      });
  }, [allProducts, selectedBrands, productSearch]);

  const isStep1Valid = businessInfo.companyName && businessInfo.contactPerson && businessInfo.phone && businessInfo.email && businessInfo.vatNumber && businessInfo.address && businessInfo.city && businessInfo.postalCode;
  const isStep2Valid = selectedBrands.length > 0;
  const isStep3Valid = selectedProductIds.length > 0;

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = () => {
    if (!user) return;
    completeOnboarding(user.id, businessInfo, selectedBrands, selectedProductIds);
    markOnboardingComplete();
    navigate('/supplier/dashboard');
  };

  const stepLabels = ['Business Info', 'Brands', 'Products', 'Review'];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/Src/Images/Logo_black.png" alt="FBU" className="h-10" />
            <div className="h-6 w-px bg-slate-200" />
            <div>
              <p className="text-sm font-bold text-slate-900">Supplier Onboarding</p>
              <p className="text-xs text-slate-500">Welcome, {user?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="info" className="text-xs">Step {currentStep} of 4</Badge>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Stepper */}
        <div className="flex items-center justify-between relative mb-10 px-8">
          <div className="absolute top-1/2 left-8 right-8 h-0.5 bg-slate-200 -translate-y-1/2 -z-10" />
          <div
            className="absolute top-1/2 left-8 h-0.5 bg-indigo-600 -translate-y-1/2 -z-10 transition-all duration-500"
            style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
          />
          {stepLabels.map((label, idx) => {
            const step = idx + 1;
            return (
              <div key={step} className="flex flex-col items-center gap-2 bg-slate-50 px-3">
                <div className={`
                  h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
                  ${currentStep > step ? 'bg-emerald-500 text-white' :
                    currentStep === step ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' :
                    'bg-white border-2 border-slate-200 text-slate-400'}
                `}>
                  {currentStep > step ? <CheckCircle className="h-5 w-5" /> : step}
                </div>
                <span className={`text-[11px] font-bold uppercase tracking-wider ${
                  currentStep >= step ? 'text-indigo-600' : 'text-slate-400'
                }`}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <Card className="p-8">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-indigo-600" />
                  Business Information
                </h2>
                <p className="text-sm text-slate-500 mt-1">Tell us about your business to get started.</p>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <Input
                  label="Company Name"
                  placeholder="e.g. ABC Distribution Ltd"
                  value={businessInfo.companyName}
                  onChange={e => updateField('companyName', e.target.value)}
                  icon={<Building2 className="h-4 w-4" />}
                  required
                />
                <Input
                  label="Contact Person"
                  placeholder="e.g. John Smith"
                  value={businessInfo.contactPerson}
                  onChange={e => updateField('contactPerson', e.target.value)}
                  icon={<User className="h-4 w-4" />}
                  required
                />
                <Input
                  label="Phone Number"
                  placeholder="e.g. +44 20 7123 4567"
                  value={businessInfo.phone}
                  onChange={e => updateField('phone', e.target.value)}
                  icon={<Phone className="h-4 w-4" />}
                  required
                />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="e.g. contact@company.com"
                  value={businessInfo.email}
                  onChange={e => updateField('email', e.target.value)}
                  icon={<Mail className="h-4 w-4" />}
                  required
                />
                <div className="col-span-2">
                  <Input
                    label="VAT Number"
                    placeholder="e.g. GB123456789"
                    value={businessInfo.vatNumber}
                    onChange={e => updateField('vatNumber', e.target.value)}
                    icon={<FileText className="h-4 w-4" />}
                    required
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-indigo-600" />
                  Business Address
                </h3>
                <div className="grid grid-cols-2 gap-5">
                  <div className="col-span-2">
                    <Input
                      label="Street Address"
                      placeholder="e.g. 123 Business Park"
                      value={businessInfo.address}
                      onChange={e => updateField('address', e.target.value)}
                      required
                    />
                  </div>
                  <Input
                    label="City"
                    placeholder="e.g. London"
                    value={businessInfo.city}
                    onChange={e => updateField('city', e.target.value)}
                    required
                  />
                  <Input
                    label="Postal Code"
                    placeholder="e.g. EC1A 1BB"
                    value={businessInfo.postalCode}
                    onChange={e => updateField('postalCode', e.target.value)}
                    required
                  />
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Country</label>
                    <select
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      value={businessInfo.country}
                      onChange={e => updateField('country', e.target.value)}
                    >
                      {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Business Type</label>
                    <select
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      value={businessInfo.businessType}
                      onChange={e => updateField('businessType', e.target.value as any)}
                    >
                      {BUSINESS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-indigo-600" />
                  Select Your Brands
                </h2>
                <p className="text-sm text-slate-500 mt-1">Choose the brands you distribute. You can select multiple brands.</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {allBrands.map(brand => {
                  const isSelected = selectedBrands.includes(brand.name);
                  return (
                    <div
                      key={brand.id}
                      onClick={() => toggleBrand(brand.name)}
                      className={`relative p-6 border-2 rounded-2xl cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/50 shadow-md shadow-indigo-100'
                          : 'border-slate-200 hover:border-slate-300 bg-white hover:shadow-sm'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-3 right-3">
                          <CheckCircle className="h-5 w-5 text-indigo-600" />
                        </div>
                      )}
                      <div className="flex flex-col items-center gap-3">
                        <div className={`h-16 w-16 rounded-2xl flex items-center justify-center text-lg font-black ${
                          isSelected ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {brand.name.charAt(0)}
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-slate-900">{brand.name}</p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {allProducts.filter(p => p.supplier === brand.name).length} products
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {selectedBrands.length > 0 && (
                <div className="flex items-center gap-2 pt-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Selected:</span>
                  {selectedBrands.map(b => (
                    <Badge key={b} variant="primary" className="text-xs">{b}</Badge>
                  ))}
                </div>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Package className="h-5 w-5 text-indigo-600" />
                  Select Products
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Choose the products you supply. Products already assigned to another supplier are unavailable.
                </p>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  className="pl-10"
                  placeholder="Search by product name, SKU, or flavour..."
                  value={productSearch}
                  onChange={e => setProductSearch(e.target.value)}
                />
              </div>

              {/* Brand filter chips */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Showing from:</span>
                {selectedBrands.map(b => (
                  <Badge key={b} variant="primary" className="text-xs">{b}</Badge>
                ))}
              </div>

              {/* Product list */}
              <div className="space-y-2 max-h-[420px] overflow-y-auto pr-2">
                {filteredProducts.map(product => {
                  const isAssigned = product.id in productMappings && productMappings[product.id] !== user?.id;
                  const isSelected = selectedProductIds.includes(product.id);

                  return (
                    <div
                      key={product.id}
                      onClick={() => !isAssigned && toggleProduct(product.id)}
                      className={`flex items-center justify-between p-4 border rounded-xl transition-all ${
                        isAssigned
                          ? 'border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed'
                          : isSelected
                          ? 'border-indigo-600 bg-indigo-50/50 cursor-pointer'
                          : 'border-slate-200 hover:border-slate-300 bg-white cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {/* Checkbox */}
                        <div className={`h-5 w-5 rounded-md border-2 flex items-center justify-center transition-all ${
                          isAssigned ? 'border-slate-200 bg-slate-100' :
                          isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'
                        }`}>
                          {isSelected && <CheckCircle className="h-3.5 w-3.5 text-white" />}
                          {isAssigned && <Lock className="h-3 w-3 text-slate-400" />}
                        </div>
                        <img
                          src={product.image}
                          alt=""
                          className="h-10 w-10 rounded-lg border border-slate-200 object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{product.name}</p>
                          <div className="flex items-center gap-3 mt-0.5">
                            <span className="text-[10px] text-slate-500 font-mono">SKU: {product.sku}</span>
                            {product.flavour && (
                              <span className="text-[10px] text-slate-400">{product.flavour}</span>
                            )}
                            {product.nicotineStrength && (
                              <span className="text-[10px] text-slate-400">{product.nicotineStrength}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="neutral" className="text-[10px]">{product.supplier}</Badge>
                        {isAssigned ? (
                          <Badge variant="danger" className="text-[10px]">Already Assigned</Badge>
                        ) : isSelected ? (
                          <Badge variant="success" className="text-[10px]">Selected</Badge>
                        ) : (
                          <Badge variant="info" className="text-[10px]">Available</Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
                {filteredProducts.length === 0 && (
                  <div className="text-center py-12 text-slate-400">
                    <Package className="h-12 w-12 mx-auto opacity-20 mb-3" />
                    <p className="font-bold">No products found</p>
                    <p className="text-sm">Try adjusting your search or brand selection</p>
                  </div>
                )}
              </div>

              {selectedProductIds.length > 0 && (
                <div className="bg-indigo-50 rounded-xl px-4 py-3 flex items-center justify-between">
                  <span className="text-sm font-bold text-indigo-700">
                    {selectedProductIds.length} product{selectedProductIds.length > 1 ? 's' : ''} selected
                  </span>
                </div>
              )}
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  Review & Submit
                </h2>
                <p className="text-sm text-slate-500 mt-1">Please review your details before submitting.</p>
              </div>

              {/* Business Details */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Business Details</h3>
                <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                  {[
                    ['Company', businessInfo.companyName],
                    ['Contact', businessInfo.contactPerson],
                    ['Phone', businessInfo.phone],
                    ['Email', businessInfo.email],
                    ['VAT', businessInfo.vatNumber],
                    ['Type', businessInfo.businessType],
                    ['Address', `${businessInfo.address}, ${businessInfo.city}, ${businessInfo.postalCode}`],
                    ['Country', businessInfo.country],
                  ].map(([label, value]) => (
                    <div key={label as string}>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">{label}</p>
                      <p className="text-sm font-bold text-slate-900">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selected Brands */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                  Selected Brands ({selectedBrands.length})
                </h3>
                <div className="flex flex-wrap gap-3">
                  {selectedBrands.map(b => {
                    const brand = allBrands.find(br => br.name === b);
                    return (
                      <div key={b} className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2">
                        <div className="h-8 w-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-sm">
                          {b.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-900 text-sm">{b}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Selected Products */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                  Selected Products ({selectedProductIds.length})
                </h3>
                <div className="space-y-2 max-h-[250px] overflow-y-auto">
                  {selectedProductIds.map(id => {
                    const product = allProducts.find(p => p.id === id);
                    if (!product) return null;
                    return (
                      <div key={id} className="flex items-center gap-3 bg-white border border-slate-100 rounded-xl p-3">
                        <img
                          src={product.image}
                          alt=""
                          className="h-8 w-8 rounded-lg border border-slate-200 object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate">{product.name}</p>
                          <p className="text-[10px] text-slate-500 font-mono">SKU: {product.sku}</p>
                        </div>
                        <Badge variant="neutral" className="text-[10px] flex-shrink-0">{product.supplier}</Badge>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Footer Navigation */}
          <div className="flex justify-between items-center pt-8 mt-8 border-t border-slate-100">
            <Button
              variant="secondary"
              onClick={handleBack}
              disabled={currentStep === 1}
              icon={<ChevronLeft className="h-4 w-4" />}
            >
              Back
            </Button>
            <div className="flex gap-3">
              {currentStep < 4 ? (
                <Button
                  variant="primary"
                  onClick={handleNext}
                  disabled={
                    (currentStep === 1 && !isStep1Valid) ||
                    (currentStep === 2 && !isStep2Valid) ||
                    (currentStep === 3 && !isStep3Valid)
                  }
                >
                  Continue <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  className="px-8"
                >
                  Submit & Start Using FBU
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SupplierOnboarding;
