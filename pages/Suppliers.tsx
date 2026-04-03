import React, { useState, useMemo, useRef } from 'react';
import { 
  Search, Plus, Download, ExternalLink, Edit, Trash2, CheckCircle, ShoppingBag, Layers, 
  Upload, Image as ImageIcon, X, ArrowUpDown
} from 'lucide-react';
import { 
  Card, Button, Input, Select, Badge, Modal, Toggle,
  Section, Grid, Table, THead, TBody, TR, TH, TD, KpiCard, StatBox, CardHeader
} from '../components/ui';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, CartesianGrid 
} from 'recharts';
import { SUPPLIERS } from '../data';
import { Supplier } from '../types';
import { useAuth } from '../context/AuthContext';

type SortConfig = { key: string; direction: 'asc' | 'desc' } | null;

const SuppliersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  const { hasPermission } = useAuth();
  
  // --- Modal State ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [supplierForm, setSupplierForm] = useState({
    name: '',
    status: true, // defaults to Active
    featured: false,
    logoPreview: null as string | null
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Data Processing ---
  const filteredSuppliers = useMemo(() => {
    let data = SUPPLIERS.filter(supplier => {
      const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || supplier.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    if (sortConfig) {
        data.sort((a: any, b: any) => {
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];

            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }
    return data;
  }, [searchTerm, statusFilter, sortConfig]);

  const activeSuppliersCount = SUPPLIERS.filter(b => b.status === 'Active').length;
  const totalProductsCount = SUPPLIERS.reduce((acc, curr) => acc + curr.products, 0);

  const chartData = useMemo(() => {
    return [...SUPPLIERS]
      .sort((a, b) => b.products - a.products)
      .slice(0, 5)
      .map(b => ({ name: b.name, products: b.products }));
  }, []);

  const statusData = [
    { name: 'Active', value: activeSuppliersCount, color: '#10b981' },
    { name: 'Inactive', value: SUPPLIERS.length - activeSuppliersCount, color: '#94a3b8' },
  ].filter(d => d.value > 0);

  // --- Handlers ---
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleOpenModal = (supplier?: Supplier) => {
    if (supplier) {
      setEditingId(supplier.id);
      setSupplierForm({
        name: supplier.name,
        status: supplier.status === 'Active',
        featured: false, // Mock default as strictly 'featured' isn't in the base data type yet
        logoPreview: supplier.logo
      });
    } else {
      setEditingId(null);
      setSupplierForm({
        name: '',
        status: true,
        featured: false,
        logoPreview: null
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSupplierForm(prev => ({ ...prev, logoPreview: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // Validation logic
    if (!supplierForm.name.trim()) return;
    
    if (editingId) {
      console.log(`Updating Supplier [${editingId}]:`, supplierForm);
    } else {
      console.log("Creating New Supplier:", supplierForm);
    }
    // Logic to update backend would go here
    handleCloseModal();
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12">
      
      {/* 1. Page Header */}
      <Section 
        title="Suppliers" 
        description="Manage product suppliers used across the catalog."
        action={hasPermission('Inventory', 'create') && <Button icon={<Plus className="h-4 w-4" />} onClick={() => handleOpenModal()}>Add Supplier</Button>}
      >
        {/* 2. Supplier Summary Cards */}
        <Grid cols={3} gap={4}>
          <KpiCard title="Total Suppliers" value={SUPPLIERS.length} icon={ShoppingBag} color="indigo" />
          <KpiCard title="Active Suppliers" value={activeSuppliersCount} icon={CheckCircle} color="emerald" />
          <KpiCard title="Total Products Linked" value={totalProductsCount} icon={Layers} color="blue" />
        </Grid>

        {/* 3. Supplier Insights (Charts) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 p-6">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-900">Top Suppliers by Volume</h3>
              <p className="text-sm text-slate-500">Suppliers with the largest product catalogs</p>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 13, fontWeight: 500 }} width={100} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="products" fill="#2666B5" radius={[0, 4, 4, 0]} barSize={24} name="Products" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-900">Supplier Status</h3>
              <p className="text-sm text-slate-500">Active vs Inactive distribution</p>
            </div>
            <div className="h-64 relative">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
               </ResponsiveContainer>
               <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                  <span className="text-3xl font-extrabold text-slate-900">{SUPPLIERS.length}</span>
                  <span className="text-xs text-slate-400 font-bold uppercase">Total</span>
                </div>
            </div>
          </Card>
        </div>

        {/* 4. Filter & Table Section */}
        <Card padding="none" className="flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white">
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto flex-1">
              <div className="w-full sm:w-80">
                 <Input 
                   placeholder="Search suppliers..." 
                   icon={<Search className="h-4 w-4" />} 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                 />
              </div>
              <div className="w-full sm:w-48">
                <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </Select>
              </div>
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
               <Button variant="ghost" size="sm" onClick={() => { setSearchTerm(''); setStatusFilter('All'); }}>Reset</Button>
               <Button variant="secondary" size="sm" icon={<Download className="h-4 w-4" />}>Export</Button>
            </div>
          </div>

          {/* Suppliers Table */}
          <Table>
            <THead>
              <TR>
                <TH onClick={() => handleSort('name')} className="cursor-pointer group select-none">
                  <div className="flex items-center gap-2">Supplier Name <ArrowUpDown className="h-3 w-3 text-slate-300 group-hover:text-indigo-500" /></div>
                </TH>
                <TH onClick={() => handleSort('status')} className="cursor-pointer group select-none">
                  <div className="flex items-center gap-2">Status <ArrowUpDown className="h-3 w-3 text-slate-300 group-hover:text-indigo-500" /></div>
                </TH>
                <TH onClick={() => handleSort('products')} className="cursor-pointer group select-none">
                  <div className="flex items-center gap-2">Product Count <ArrowUpDown className="h-3 w-3 text-slate-300 group-hover:text-indigo-500" /></div>
                </TH>
                <TH>Created Date</TH>
                <TH align="center">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {filteredSuppliers.map((supplier) => (
                <TR key={supplier.id}>
                  <TD>
                    <div className="flex items-center">
                      <img className="h-10 w-10 rounded-lg object-cover bg-slate-50 border border-slate-200 mr-4" src={supplier.logo} alt="" />
                      <div>
                        <div className="text-sm font-bold text-slate-900">{supplier.name}</div>
                        <div className="text-xs text-slate-400 font-mono mt-0.5">{supplier.id}</div>
                      </div>
                    </div>
                  </TD>
                  <TD>
                    <Badge variant={supplier.status === 'Active' ? 'success' : 'neutral'}>
                      {supplier.status}
                    </Badge>
                  </TD>
                  <TD>
                    <div className="flex items-center gap-2">
                       <Layers className="h-4 w-4 text-slate-400" />
                       <span className="text-sm font-medium text-slate-700">{supplier.products} items</span>
                    </div>
                  </TD>
                  <TD className="text-sm text-slate-500">
                    Oct 24, 2023
                  </TD>
                  <TD align="center">
                    <div className="flex justify-center items-center gap-2">
                      {hasPermission('Inventory', 'edit') && (
                        <button 
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          onClick={() => handleOpenModal(supplier)}
                          title="Edit Supplier"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      )}
                      {hasPermission('Inventory', 'delete') && (
                        <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </TD>
                </TR>
              ))}
              {filteredSuppliers.length === 0 && (
                <TR>
                  <TD colSpan={5} className="py-12 text-center text-slate-500">No suppliers found</TD>
                </TR>
              )}
            </TBody>
          </Table>
        </Card>
      </Section>

      {/* --- ADD/EDIT SUPPLIER MODAL --- */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title={editingId ? "Edit Supplier" : "Add New Supplier"}
        footer={
          <div className="flex gap-3 justify-end w-full">
            <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
            <Button 
              variant="primary" 
              onClick={handleSave} 
              disabled={!supplierForm.name.trim()}
            >
              {editingId ? "Save Changes" : "Create Supplier"}
            </Button>
          </div>
        }
      >
        <div className="space-y-6">
          
          {/* Section 1: Supplier Information */}
          <Card>
            <CardHeader title="Supplier Information" />
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 gap-4">
                 {/* Logo Upload */}
                 <div className="flex flex-col gap-2">
                   <label className="block text-sm font-semibold text-slate-700">Supplier Logo</label>
                   <div 
                     className={`
                       border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors
                       ${supplierForm.logoPreview ? 'border-indigo-200 bg-indigo-50/30' : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'}
                     `}
                     onClick={() => fileInputRef.current?.click()}
                   >
                     <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleImageUpload}
                     />
                     
                     {supplierForm.logoPreview ? (
                       <div className="relative group">
                         <img src={supplierForm.logoPreview} alt="Preview" className="h-24 w-24 object-contain rounded-lg bg-white shadow-sm p-1" />
                         <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <span className="text-white text-xs font-medium">Change</span>
                         </div>
                         <button 
                           onClick={(e) => { e.stopPropagation(); setSupplierForm(prev => ({ ...prev, logoPreview: null })); }}
                           className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 shadow-sm hover:bg-rose-600"
                         >
                           <X className="h-3 w-3" />
                         </button>
                       </div>
                     ) : (
                       <div className="text-center py-4">
                         <div className="h-10 w-10 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-2">
                            <ImageIcon className="h-5 w-5" />
                         </div>
                         <p className="text-sm font-medium text-slate-600">Click to upload logo</p>
                         <p className="text-xs text-slate-400 mt-1">SVG, PNG, JPG (max. 800x400px)</p>
                       </div>
                     )}
                   </div>
                 </div>

                 {/* Supplier Name */}
                 <Input 
                   label="Supplier Name" 
                   placeholder="e.g. Acme Corp" 
                   value={supplierForm.name}
                   onChange={(e) => setSupplierForm(prev => ({ ...prev, name: e.target.value }))}
                 />
                 
                 {/* Status Toggle */}
                 <div className="bg-white p-3 rounded-xl border border-slate-200">
                   <Toggle 
                     checked={supplierForm.status} 
                     onChange={(checked) => setSupplierForm(prev => ({ ...prev, status: checked }))} 
                     label="Active Status"
                     description="Enable this supplier to be used in products immediately."
                   />
                 </div>
              </div>
            </div>
          </Card>

          {/* Section 2: Display Settings */}
          <Card>
            <CardHeader title="Display Settings" />
            <div className="p-5">
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                 <Toggle 
                   checked={supplierForm.featured} 
                   onChange={(checked) => setSupplierForm(prev => ({ ...prev, featured: checked }))} 
                   label="Featured Supplier"
                   description="Highlight this supplier on the storefront homepage."
                 />
              </div>
            </div>
          </Card>

        </div>
      </Modal>

    </div>
  );
};

export default SuppliersPage;
