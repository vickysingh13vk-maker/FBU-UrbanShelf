import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Plus, Eye, Edit2, Ban, CheckCircle, Clock, UsersRound,
  MapPin, Phone, Mail, Building, ArrowUpDown, Wallet, LayoutGrid, List
} from 'lucide-react';
import { 
  Card, Badge, Button, Input, Modal, Pagination, Select,
  Section, Grid, Table, THead, TBody, TR, TH, TD, KpiCard, StatBox, CardHeader
} from '../components/ui';
import { CUSTOMERS, CATEGORIES, SUPPLIERS } from '../data';
import { Customer } from '../types';
import { useAuth } from '../context/AuthContext';

type SortConfig = { key: string; direction: 'asc' | 'desc' } | null;

const CustomersPage: React.FC = () => {
  const navigate = useNavigate();
  const { hasPermission } = useAuth();

  // --- State ---
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSupplier, setSelectedSupplier] = useState('All');
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Data State
  const [customersData, setCustomersData] = useState<Customer[]>(CUSTOMERS);

  // Create Modal State (Only for Adding)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    regNo: '',
    storeName: '',
    address1: '',
    address2: '',
    city: '',
    postcode: '',
    openingBalance: '',
    creditLimit: '5000'
  });

  // --- Filtering & Sorting ---
  const filteredCustomers = useMemo(() => {
    let result = customersData.filter(c => {
      const matchesSearch = 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.companyName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
      const matchesSupplier = selectedSupplier === 'All' || c.supplier === selectedSupplier;

      return matchesSearch && matchesCategory && matchesSupplier;
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
  }, [customersData, searchTerm, selectedCategory, selectedSupplier, sortConfig]);

  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCustomers.slice(start, start + itemsPerPage);
  }, [filteredCustomers, currentPage, itemsPerPage]);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const openCreateModal = () => {
    setFormData({
      firstName: '', lastName: '', email: '', phone: '',
      companyName: '', regNo: '', storeName: '',
      address1: '', address2: '', city: '', postcode: '',
      openingBalance: '', creditLimit: '5000'
    });
    setIsCreateModalOpen(true);
  };

  const handleCreate = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.companyName) return;

    const initialWalletBalance = -(parseFloat(formData.openingBalance) || 0);
    const limit = parseFloat(formData.creditLimit) || 5000;
    
    const newCustomer: Customer = {
      id: `C${(Math.floor(Math.random() * 9000) + 1000).toString()}`,
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      companyName: formData.companyName,
      storeName: formData.storeName || formData.companyName,
      regNo: formData.regNo,
      address: `${formData.address1}, ${formData.city} ${formData.postcode}`,
      status: 'Approved',
      walletBalance: initialWalletBalance,
      creditLimit: limit,
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      image: undefined
    };

    setCustomersData([newCustomer, ...customersData]);
    setIsCreateModalOpen(false);
  };

  // --- Stats ---
  const total = customersData.length;
  const approved = customersData.filter(c => c.status === 'Approved').length;
  const pending = customersData.filter(c => c.status === 'Pending').length;
  const blocked = customersData.filter(c => c.status === 'Blocked').length;

  const handleShowDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDetailsModalOpen(true);
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12">
      
      {/* 1. Header */}
      <Section 
        title="Customers" 
        description="Manage B2B client accounts and approvals."
        action={
          <div className="flex gap-4 items-center">
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
               <button 
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                title="Grid View"
               >
                  <LayoutGrid className="h-4 w-4" />
               </button>
               <button 
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-all ${viewMode === 'table' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                title="Table View"
               >
                  <List className="h-4 w-4" />
               </button>
            </div>
            <div className="w-44">
              <Select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-50/50 border-slate-200 text-slate-600 font-bold text-[10px] uppercase tracking-widest h-10 hover:bg-white hover:border-indigo-200 transition-all"
              >
                <option value="All">Category: All</option>
                {CATEGORIES.map(category => (
                  <option key={category.id} value={category.name}>{category.name}</option>
                ))}
              </Select>
            </div>
            <div className="w-44">
              <Select 
                value={selectedSupplier} 
                onChange={(e) => setSelectedSupplier(e.target.value)}
                className="bg-slate-50/50 border-slate-200 text-slate-600 font-bold text-[10px] uppercase tracking-widest h-10 hover:bg-white hover:border-indigo-200 transition-all"
              >
                <option value="All">Supplier: All</option>
                {SUPPLIERS.map(supplier => (
                  <option key={supplier.id} value={supplier.name}>{supplier.name}</option>
                ))}
              </Select>
            </div>
            <Input 
              placeholder="Search by name, email, company..." 
              icon={<Search className="h-4 w-4" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-80 h-10 text-[11px] font-medium"
            />
            {hasPermission('Customers', 'create') && (
              <Button icon={<Plus className="h-4 w-4" />} onClick={openCreateModal}>Add New Customer</Button>
            )}
          </div>
        }
      >
        {/* 2. Summary Cards */}
        <Grid cols={4} gap={4}>
          <KpiCard title="Total Customers" value={total} icon={UsersRound} color="indigo" />
          <KpiCard title="Approved" value={approved} icon={CheckCircle} color="emerald" />
          <KpiCard title="Pending" value={pending} icon={Clock} color="amber" />
          <KpiCard title="Blocked" value={blocked} icon={Ban} color="rose" />
        </Grid>

        {/* 3. Customers Content */}
        {viewMode === 'table' ? (
          <Card padding="none" className="flex flex-col overflow-hidden">
            <Table>
              <THead>
                <TR>
                  <TH onClick={() => handleSort('name')} className="cursor-pointer group select-none">
                    <div className="flex items-center gap-2">Customer <ArrowUpDown className="h-3 w-3 text-slate-300 group-hover:text-indigo-500" /></div>
                  </TH>
                  <TH onClick={() => handleSort('companyName')} className="cursor-pointer group select-none">
                    <div className="flex items-center gap-2">Company <ArrowUpDown className="h-3 w-3 text-slate-300 group-hover:text-indigo-500" /></div>
                  </TH>
                  <TH>Address</TH>
                  <TH onClick={() => handleSort('status')} className="cursor-pointer group select-none">
                    <div className="flex items-center gap-2">Status <ArrowUpDown className="h-3 w-3 text-slate-300 group-hover:text-indigo-500" /></div>
                  </TH>
                  <TH onClick={() => handleSort('creditLimit')} className="cursor-pointer group select-none">
                    <div className="flex items-center gap-2">Credit Limit <ArrowUpDown className="h-3 w-3 text-slate-300 group-hover:text-indigo-500" /></div>
                  </TH>
                  <TH>Avl. Limit</TH>
                  <TH onClick={() => handleSort('walletBalance')} className="cursor-pointer group select-none">
                    <div className="flex items-center gap-2">Wallet <ArrowUpDown className="h-3 w-3 text-slate-300 group-hover:text-indigo-500" /></div>
                  </TH>
                  <TH onClick={() => handleSort('joinedDate')} className="cursor-pointer group select-none">
                    <div className="flex items-center gap-2">Joined <ArrowUpDown className="h-3 w-3 text-slate-300 group-hover:text-indigo-500" /></div>
                  </TH>
                  <TH align="center">Actions</TH>
                </TR>
              </THead>
              <TBody>
                {paginatedCustomers.map((customer) => {
                  const outstanding = customer.walletBalance < 0 ? Math.abs(customer.walletBalance) : 0;
                  const available = Math.max(0, customer.creditLimit - outstanding);
                  
                  return (
                    <TR key={customer.id} className="cursor-pointer" onClick={() => navigate(`/customers/${customer.id}`)}>
                      <TD>
                         <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-indigo-600 font-bold text-sm border border-slate-200">
                              {customer.image ? <img src={customer.image} className="h-full w-full rounded-full object-cover" alt="" /> : customer.name.charAt(0)}
                            </div>
                            <div>
                               <div className="text-sm font-bold text-slate-900">{customer.name}</div>
                               <div className="flex items-center gap-2 text-xs text-slate-500">
                                  <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {customer.email}</span>
                                  <span className="text-slate-300">|</span>
                                  <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {customer.phone}</span>
                               </div>
                            </div>
                         </div>
                      </TD>
                      <TD>
                         <div className="text-sm font-bold text-slate-900">{customer.companyName}</div>
                         <div className="text-xs text-slate-500">{customer.storeName}</div>
                         <div className="text-xs text-slate-400 font-mono mt-0.5">Reg: {customer.regNo}</div>
                      </TD>
                      <TD>
                         <div className="flex items-start gap-1.5 max-w-[200px]">
                            <MapPin className="h-3.5 w-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-slate-600 truncate">{customer.address}</span>
                         </div>
                      </TD>
                      <TD>
                         <Badge variant={
                            customer.status === 'Approved' ? 'success' : 
                            customer.status === 'Pending' ? 'warning' : 'danger'
                         }>
                            {customer.status}
                         </Badge>
                      </TD>
                      <TD className="text-sm text-slate-600 font-medium">
                         £{customer.creditLimit.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                      </TD>
                      <TD className="text-sm font-bold text-emerald-600">
                         £{available.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                      </TD>
                      <TD className="font-mono text-sm font-semibold text-slate-700">
                         £{customer.walletBalance.toFixed(2)}
                      </TD>
                      <TD className="text-sm text-slate-500">
                         {customer.joinedDate}
                      </TD>
                      <TD align="center">
                        <div className="flex justify-center items-center gap-2" onClick={e => e.stopPropagation()}>
                           <button 
                            onClick={() => handleShowDetails(customer)}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="View Details">
                             <Eye className="h-4 w-4" />
                           </button>
                           {hasPermission('Customers', 'edit') && (
                             <button 
                              onClick={() => navigate(`/customers/${customer.id}/edit`)}
                              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Edit">
                               <Edit2 className="h-4 w-4" />
                             </button>
                           )}
                        </div>
                      </TD>
                    </TR>
                  );
                })}
              </TBody>
            </Table>
          </Card>
        ) : (
          <div className="space-y-6">
            <Grid cols={4} gap={4}>
              {paginatedCustomers.map((customer) => {
                const outstanding = customer.walletBalance < 0 ? Math.abs(customer.walletBalance) : 0;
                const available = Math.max(0, customer.creditLimit - outstanding);
                
                return (
                  <Card key={customer.id} padding="none" className="group hover:shadow-lg transition-all duration-300 border-slate-200/60 overflow-hidden flex flex-col h-full">
                    <div className="p-3 flex items-center justify-between bg-slate-50/50 border-b border-slate-100">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-10 w-10 rounded-xl bg-white shadow-sm border border-slate-200 flex items-center justify-center text-indigo-600 font-bold text-sm overflow-hidden shrink-0">
                          {customer.image ? <img src={customer.image} className="h-full w-full object-cover" alt="" /> : customer.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold text-slate-900 truncate leading-tight">{customer.name}</h3>
                          <p className="text-xs font-medium text-slate-500 truncate leading-tight mt-0.5">{customer.companyName}</p>
                        </div>
                      </div>
                      <Badge variant={customer.status === 'Approved' ? 'success' : customer.status === 'Pending' ? 'warning' : 'danger'} className="px-2 py-0.5 text-[10px]">
                        {customer.status}
                      </Badge>
                    </div>
                    
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Credit Limit</p>
                          <p className="text-sm font-bold text-slate-700">£{customer.creditLimit.toLocaleString()}</p>
                        </div>
                        <div className="flex flex-col items-end">
                          <p className="text-[10px] font-bold text-emerald-600/60 uppercase tracking-widest">Available</p>
                          <p className="text-sm font-bold text-emerald-600">£{available.toLocaleString()}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <MapPin className="h-3.5 w-3.5" />
                          <span className="text-xs truncate max-w-[120px]">{customer.address.split(',')[0]}</span>
                        </div>
                        <div className="flex gap-3">
                          <button 
                            onClick={() => handleShowDetails(customer)}
                            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                          >
                            Details
                          </button>
                          {hasPermission('Customers', 'edit') && (
                            <button 
                              onClick={() => navigate(`/customers/${customer.id}/edit`)}
                              className="text-slate-400 hover:text-indigo-600 transition-colors"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </Grid>
            {paginatedCustomers.length === 0 && (
              <div className="py-12 text-center text-slate-500 bg-white rounded-xl border border-dashed border-slate-200">No customers found.</div>
            )}
          </div>
        )}

        <div className="mt-6 bg-white rounded-xl border border-slate-200 overflow-hidden">
          <Pagination 
              currentPage={currentPage}
              totalItems={filteredCustomers.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
              entityName="customers"
          />
        </div>
      </Section>

      {/* 4. Add New Customer Modal */}
      <Modal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        title="Add New Customer" 
        size="lg"
        footer={
           <div className="flex gap-3 justify-end w-full">
            <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleCreate}>Add Customer</Button>
          </div>
        }
      >
        <div className="space-y-6">
           {/* Section 1 */}
           <Card>
              <CardHeader title="Customer Details" icon={<UsersRound className="h-4 w-4 text-indigo-500" />} />
              <div className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <Input label="First Name" placeholder="e.g. John" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                   <Input label="Last Name" placeholder="e.g. Doe" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                   <Input label="Email Address" type="email" placeholder="john@company.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} icon={<Mail className="h-4 w-4" />} />
                   <Input label="Phone Number" placeholder="+44 7000 000000" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} icon={<Phone className="h-4 w-4" />} />
                </div>
              </div>
           </Card>

           {/* Section 2 */}
           <Card>
              <CardHeader title="Business Details" icon={<Building className="h-4 w-4 text-indigo-500" />} />
              <div className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="md:col-span-2">
                      <Input label="Company Name" placeholder="Legal Company Name" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} />
                   </div>
                   <Input label="Company Reg. Number" placeholder="e.g. GB123456" value={formData.regNo} onChange={e => setFormData({...formData, regNo: e.target.value})} />
                   <Input label="Store Name (Trading As)" placeholder="Shop Name" value={formData.storeName} onChange={e => setFormData({...formData, storeName: e.target.value})} />
                </div>
              </div>
           </Card>

           {/* Section 3 */}
           <Card>
              <CardHeader title="Address Details" icon={<MapPin className="h-4 w-4 text-indigo-500" />} />
              <div className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="md:col-span-2">
                      <Input label="Address Line 1" placeholder="Building, Street" value={formData.address1} onChange={e => setFormData({...formData, address1: e.target.value})} />
                   </div>
                   <div className="md:col-span-2">
                      <Input label="Address Line 2" placeholder="Apartment, Suite (Optional)" value={formData.address2} onChange={e => setFormData({...formData, address2: e.target.value})} />
                   </div>
                   <Input label="City" placeholder="e.g. London" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                   <Input label="Postcode" placeholder="e.g. W1 2AB" value={formData.postcode} onChange={e => setFormData({...formData, postcode: e.target.value})} />
                </div>
              </div>
           </Card>

           {/* Section 4: Financials */}
           <Card>
              <CardHeader title="Opening Financials" icon={<Wallet className="h-4 w-4 text-indigo-500" />} />
              <div className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                      <Input 
                         label="Opening Balance" 
                         type="number" 
                         placeholder="0.00" 
                         icon={<span className="text-slate-400 text-sm font-semibold">£</span>}
                         value={formData.openingBalance} 
                         onChange={e => setFormData({...formData, openingBalance: e.target.value})} 
                      />
                      <div className="text-xs text-slate-500 mt-2 leading-relaxed">
                         <p className="mb-1">Starting balance for this customer.</p>
                         <ul className="list-none space-y-1 pl-1">
                            <li>• Positive amount → customer owes money</li>
                            <li>• Negative amount → advance paid</li>
                         </ul>
                      </div>
                   </div>
                   <div>
                      <Input 
                         label="Credit Limit" 
                         type="number" 
                         placeholder="5000" 
                         icon={<span className="text-slate-400 text-sm font-semibold">£</span>}
                         value={formData.creditLimit} 
                         onChange={e => setFormData({...formData, creditLimit: e.target.value})} 
                      />
                   </div>
                </div>
              </div>
           </Card>
        </div>
      </Modal>

      {/* 5. Customer Details Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Customer Profile"
        size="lg"
        footer={
          <div className="flex justify-between items-center w-full">
            <Button variant="ghost" className="text-indigo-600 font-bold" onClick={() => { setIsDetailsModalOpen(false); navigate(`/customers/${selectedCustomer?.id}`); }}>
              View Full Profile
            </Button>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setIsDetailsModalOpen(false)}>Close</Button>
              {hasPermission('Customers', 'edit') && (
                <Button variant="primary" onClick={() => { setIsDetailsModalOpen(false); navigate(`/customers/${selectedCustomer?.id}/edit`); }}>Edit Profile</Button>
              )}
            </div>
          </div>
        }
      >
        {selectedCustomer && (
          <div className="space-y-6">
            <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="h-20 w-20 rounded-2xl bg-white shadow-md border border-slate-200 flex items-center justify-center text-indigo-600 font-bold text-3xl overflow-hidden">
                {selectedCustomer.image ? <img src={selectedCustomer.image} className="h-full w-full object-cover" alt="" /> : selectedCustomer.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-900">{selectedCustomer.name}</h2>
                  <Badge variant={selectedCustomer.status === 'Approved' ? 'success' : selectedCustomer.status === 'Pending' ? 'warning' : 'danger'}>
                    {selectedCustomer.status}
                  </Badge>
                </div>
                <p className="text-slate-500 font-medium">{selectedCustomer.companyName}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {selectedCustomer.email}</span>
                  <span className="text-slate-300">|</span>
                  <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {selectedCustomer.phone}</span>
                </div>
              </div>
            </div>

            <Grid cols={2} gap={4}>
              <Card>
                <CardHeader title="Business Information" />
                <div className="p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-500">Trading Name</span>
                    <span className="text-xs font-bold text-slate-900">{selectedCustomer.storeName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-500">Reg. Number</span>
                    <span className="text-xs font-mono font-bold text-slate-900">{selectedCustomer.regNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-500">Joined Date</span>
                    <span className="text-xs font-bold text-slate-900">{selectedCustomer.joinedDate}</span>
                  </div>
                </div>
              </Card>

              <Card>
                <CardHeader title="Financial Summary" />
                <div className="p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-500">Credit Limit</span>
                    <span className="text-xs font-bold text-slate-900">£{selectedCustomer.creditLimit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-500">Wallet Balance</span>
                    <span className={`text-xs font-bold ${selectedCustomer.walletBalance < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      £{selectedCustomer.walletBalance.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-500">Status</span>
                    <Badge variant={selectedCustomer.status === 'Approved' ? 'success' : 'warning'}>{selectedCustomer.status}</Badge>
                  </div>
                </div>
              </Card>
            </Grid>

            <Card>
              <CardHeader title="Address Details" />
              <div className="p-4">
                <p className="text-sm text-slate-600 leading-relaxed">{selectedCustomer.address}</p>
              </div>
            </Card>
          </div>
        )}
      </Modal>

    </div>
  );
};

export default CustomersPage;
