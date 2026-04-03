import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Plus, RotateCcw, Search, Download, Edit2, Trash2, Tag, CheckCircle, Clock, ShoppingBag, 
  ArrowUpDown
} from 'lucide-react';
import { 
  Card, Button, Input, Select, Badge, Modal, Pagination,
  Section, Grid, Table, THead, TBody, TR, TH, TD, KpiCard, CardHeader
} from '../components/ui';
import { COUPONS, CATEGORIES } from '../data';
import { Coupon } from '../types';
import { useAuth } from '../context/AuthContext';

type SortConfig = { key: string; direction: 'asc' | 'desc' } | null;

const CouponsPage: React.FC = () => {
  const location = useLocation();
  const { hasPermission } = useAuth();

  // --- State ---
  const [data, setData] = useState<Coupon[]>(COUPONS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Coupon>>({
    code: '',
    type: 'Fixed Amount',
    value: 0,
    minOrder: 0,
    maxDiscount: 0,
    usageLimit: 0,
    validFrom: '',
    validUntil: '',
    categories: []
  });

  // --- Effects ---
  useEffect(() => {
    if (location.state && (location.state as any).openModal) {
      handleOpenModal();
    }
  }, [location]);

  // --- Filtering & Sorting ---
  const filteredCoupons = useMemo(() => {
    let result = data.filter(c => {
      const matchesSearch = c.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
      const matchesType = typeFilter === 'All' || c.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });

    if (sortConfig) {
      result.sort((a: any, b: any) => {
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
    return result;
  }, [data, searchTerm, statusFilter, typeFilter, sortConfig]);

  const paginatedCoupons = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCoupons.slice(start, start + itemsPerPage);
  }, [filteredCoupons, currentPage, itemsPerPage]);

  // --- Handlers ---
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleRefresh = () => {
    // Simulate refresh
    const current = data;
    setData([]);
    setTimeout(() => setData(current), 300);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this coupon?')) {
      setData(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleOpenModal = (coupon?: Coupon) => {
    if (coupon) {
      setEditingId(coupon.id);
      setFormData({ ...coupon });
    } else {
      setEditingId(null);
      setFormData({
        code: '',
        type: 'Fixed Amount',
        value: 0,
        minOrder: 0,
        maxDiscount: 0,
        usageLimit: 100,
        validFrom: new Date().toISOString().split('T')[0],
        validUntil: '',
        categories: []
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.code || !formData.validFrom || !formData.validUntil) return; // Basic validation

    if (editingId) {
      setData(prev => prev.map(c => c.id === editingId ? { ...c, ...formData } as Coupon : c));
    } else {
      const newCoupon: Coupon = {
        ...formData as Coupon,
        id: `CPN-${Date.now()}`,
        status: 'Active',
        usedCount: 0
      };
      setData(prev => [newCoupon, ...prev]);
    }
    setIsModalOpen(false);
    // Success toast could go here
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = e.target.options;
    const value: string[] = [];
    for (let i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    setFormData(prev => ({ ...prev, categories: value }));
  };

  // Stats
  const total = data.length;
  const active = data.filter(c => c.status === 'Active').length;
  const expired = data.filter(c => c.status === 'Expired').length;
  const used = data.reduce((acc, c) => acc + c.usedCount, 0);

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12">
      
      {/* 1. Page Header */}
      <Section 
        title="Manage Coupons" 
        description="View and manage discount coupons"
        action={
          <div className="flex gap-2">
             <button 
               onClick={handleRefresh}
               className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all bg-white shadow-sm"
             >
               <RotateCcw className="h-4 w-4" />
             </button>
             {hasPermission('Marketing', 'create') && (
               <Button icon={<Plus className="h-4 w-4" />} onClick={() => handleOpenModal()}>Add Coupon</Button>
             )}
          </div>
        }
      >
        {/* 2. Summary Cards */}
        <Grid cols={4} gap={4}>
          <KpiCard title="Total Coupons" value={total} icon={Tag} color="blue" />
          <KpiCard title="Active Coupons" value={active} icon={CheckCircle} color="emerald" />
          <KpiCard title="Expired Coupons" value={expired} icon={Clock} color="rose" />
          <KpiCard title="Coupons Used" value={used} icon={ShoppingBag} color="indigo" />
        </Grid>

        <Card padding="none" className="flex flex-col overflow-hidden">
          {/* 3. Filters & Controls */}
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white sticky top-0 z-10">
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto flex-1">
               <div className="w-full sm:w-72">
                 <Input 
                   placeholder="Search by coupon code..." 
                   icon={<Search className="h-4 w-4" />} 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                 />
               </div>
               <div className="w-36">
                 <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                   <option value="All">All Status</option>
                   <option value="Active">Active</option>
                   <option value="Expired">Expired</option>
                   <option value="Upcoming">Upcoming</option>
                 </Select>
               </div>
               <div className="w-40">
                 <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                   <option value="All">All Types</option>
                   <option value="Fixed Amount">Fixed Amount</option>
                   <option value="Percentage">Percentage</option>
                 </Select>
               </div>
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
               <div className="w-24">
                  <Select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))}>
                     <option value="10">10 rows</option>
                     <option value="20">20 rows</option>
                     <option value="50">50 rows</option>
                  </Select>
               </div>
               <Button variant="secondary" icon={<Download className="h-4 w-4" />}>Export</Button>
            </div>
          </div>

          {/* 4. Coupons Table */}
          <Table>
            <THead>
              <TR>
                <TH onClick={() => handleSort('code')} className="cursor-pointer group select-none">
                  <div className="flex items-center gap-2">Code <ArrowUpDown className="h-3 w-3 text-slate-300 group-hover:text-indigo-500" /></div>
                </TH>
                <TH onClick={() => handleSort('type')} className="cursor-pointer group select-none">
                  <div className="flex items-center gap-2">Type <ArrowUpDown className="h-3 w-3 text-slate-300 group-hover:text-indigo-500" /></div>
                </TH>
                <TH onClick={() => handleSort('value')} className="cursor-pointer group select-none">
                  <div className="flex items-center gap-2">Value <ArrowUpDown className="h-3 w-3 text-slate-300 group-hover:text-indigo-500" /></div>
                </TH>
                <TH>Min Order</TH>
                <TH>Max Discount</TH>
                <TH>Usage Limit</TH>
                <TH>Used</TH>
                <TH>Valid From</TH>
                <TH>Valid Until</TH>
                <TH onClick={() => handleSort('status')} className="cursor-pointer group select-none">
                  <div className="flex items-center gap-2">Status <ArrowUpDown className="h-3 w-3 text-slate-300 group-hover:text-indigo-500" /></div>
                </TH>
                <TH align="center">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {paginatedCoupons.map((coupon) => (
                <TR key={coupon.id}>
                  <TD className="font-mono text-sm font-bold text-indigo-600">
                    {coupon.code}
                  </TD>
                  <TD className="text-sm text-slate-600">
                    {coupon.type}
                  </TD>
                  <TD className="text-sm font-bold text-slate-900">
                    {coupon.type === 'Percentage' ? `${coupon.value}%` : `£${coupon.value}`}
                  </TD>
                  <TD className="text-sm text-slate-500">
                    £{coupon.minOrder}
                  </TD>
                  <TD className="text-sm text-slate-500">
                    £{coupon.maxDiscount}
                  </TD>
                  <TD className="text-sm text-slate-500">
                    {coupon.usageLimit}
                  </TD>
                  <TD className="text-sm text-slate-500">
                    {coupon.usedCount}
                  </TD>
                  <TD className="text-sm text-slate-500">
                    {coupon.validFrom}
                  </TD>
                  <TD className="text-sm text-slate-500">
                    {coupon.validUntil}
                  </TD>
                  <TD>
                    <Badge variant={
                      coupon.status === 'Active' ? 'success' : 
                      coupon.status === 'Upcoming' ? 'info' : 'neutral'
                    }>
                      {coupon.status}
                    </Badge>
                  </TD>
                  <TD align="center">
                    <div className="flex justify-center items-center gap-2">
                       {hasPermission('Marketing', 'edit') && (
                         <button 
                           className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                           onClick={() => handleOpenModal(coupon)}
                           title="Edit"
                         >
                           <Edit2 className="h-4 w-4" />
                         </button>
                       )}
                       {hasPermission('Marketing', 'delete') && (
                         <button 
                           className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                           onClick={() => handleDelete(coupon.id)}
                           title="Delete"
                         >
                           <Trash2 className="h-4 w-4" />
                         </button>
                       )}
                    </div>
                  </TD>
                </TR>
              ))}
              {paginatedCoupons.length === 0 && (
                 <TR>
                    <TD colSpan={11} className="py-12 text-center text-slate-500">No coupons found.</TD>
                 </TR>
              )}
            </TBody>
          </Table>
          
          <Pagination 
              currentPage={currentPage}
              totalItems={filteredCoupons.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
              entityName="coupons"
          />
        </Card>
      </Section>

      {/* 5. Add/Edit Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingId ? "Edit Coupon" : "Add Coupon"}
        size="lg"
        footer={
           <div className="flex gap-3 justify-end w-full">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSave} disabled={!formData.code}>{editingId ? "Save Coupon" : "Add Coupon"}</Button>
          </div>
        }
      >
        <div className="space-y-6">
           <Card>
              <CardHeader title="Coupon Details" />
              <div className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="md:col-span-2">
                      <Input 
                        label="Coupon Code" 
                        placeholder="e.g. SUMMER25" 
                        value={formData.code} 
                        onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} 
                      />
                   </div>
                   <Select 
                     label="Type" 
                     value={formData.type} 
                     onChange={e => setFormData({...formData, type: e.target.value as any})}
                   >
                      <option value="Fixed Amount">Fixed Amount</option>
                      <option value="Percentage">Percentage</option>
                   </Select>
                   <Input 
                     label="Value" 
                     type="number" 
                     value={formData.value} 
                     onChange={e => setFormData({...formData, value: Number(e.target.value)})} 
                   />
                   <Input 
                     label="Min Order Amount" 
                     type="number" 
                     value={formData.minOrder} 
                     onChange={e => setFormData({...formData, minOrder: Number(e.target.value)})} 
                   />
                   <Input 
                     label="Max Discount" 
                     type="number" 
                     value={formData.maxDiscount} 
                     onChange={e => setFormData({...formData, maxDiscount: Number(e.target.value)})} 
                   />
                   <Input 
                     label="Usage Limit" 
                     type="number" 
                     value={formData.usageLimit} 
                     onChange={e => setFormData({...formData, usageLimit: Number(e.target.value)})} 
                   />
                   <div className="hidden md:block"></div> {/* Spacer */}
                   
                   <Input 
                     label="Valid From" 
                     type="date" 
                     value={formData.validFrom} 
                     onChange={e => setFormData({...formData, validFrom: e.target.value})} 
                   />
                   <Input 
                     label="Valid Until" 
                     type="date" 
                     value={formData.validUntil} 
                     onChange={e => setFormData({...formData, validUntil: e.target.value})} 
                   />
                   
                   <div className="md:col-span-2">
                      <Select 
                        label="Applicable Categories"
                        multiple 
                        className="h-32"
                        value={formData.categories}
                        onChange={handleCategoryChange as any}
                      >
                         <option value="All">All Categories</option>
                         {CATEGORIES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                      </Select>
                      <p className="text-xs text-slate-500 mt-1">Hold Ctrl (Windows) or Cmd (Mac) to select multiple options.</p>
                   </div>
                </div>
              </div>
           </Card>
        </div>
      </Modal>

    </div>
  );
};

export default CouponsPage;
