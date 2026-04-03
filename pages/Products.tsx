import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Plus, Filter, Search, Edit2, Trash2, Copy, Download, Upload, 
  Box, CheckCircle, AlertCircle, XCircle, Image as ImageIcon, X, Save, ArrowUpDown,
  FileText, DollarSign, Settings, Tag as TagIcon
} from 'lucide-react';
import { 
  Card, Badge, Button, Input, Modal, TextArea, Toggle, Select, Pagination, 
  Section, Grid, Table, THead, TBody, TR, TH, TD, KpiCard, Tag, CardHeader 
} from '../components/ui';
import { PRODUCTS, SUPPLIERS, CATEGORIES } from '../data';
import { useAuth } from '../context/AuthContext';
import { useProducts, ExtendedProduct } from '../context/ProductContext';

type SortConfig = { key: string; direction: 'asc' | 'desc' } | null;

const ProductsPage: React.FC = () => {
  const location = useLocation();
  const { hasPermission } = useAuth();
  const { products, setProducts, deleteProduct, saveProduct } = useProducts();

  // --- State ---
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: 'All',
    supplier: 'All',
    status: 'All',
    availability: 'All', // 'In Stock', 'Out of Stock'
    featured: 'All' // 'Featured', 'Standard'
  });
  
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showErrors, setShowErrors] = useState(false); // New state to control error visibility

  // Form State
  const initialFormState = {
    name: '',
    description: '',
    tags: [] as string[], // Changed from string to string[] for chip input
    supplier: '',
    category: '',
    status: true, // true = Active, false = Draft
    price: '',
    packSize: '',
    creditAmount: '',
    stock: '',
    customisable: false,
    bundleSize: '',
    freeItemQty: '',
    pricingTier: '',
    featured: false,
    images: [] as string[]
  };

  const [formData, setFormData] = useState(initialFormState);
  const [tagInput, setTagInput] = useState(''); // Local state for tag input field
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Effects ---
  useEffect(() => {
    if (location.state && (location.state as any).openModal) {
      handleOpenModal();
    }
  }, [location]);

  // --- Filtering & Sorting Logic ---
  const filteredProducts = useMemo(() => {
    let result = products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filters.category === 'All' || p.category === filters.category;
      const matchesSupplier = filters.supplier === 'All' || p.supplier === filters.supplier;
      const matchesStatus = filters.status === 'All' || p.status === filters.status;
      
      let matchesAvailability = true;
      if (filters.availability === 'In Stock') matchesAvailability = p.stock > 0;
      if (filters.availability === 'Out of Stock') matchesAvailability = p.stock === 0;

      let matchesFeatured = true;
      if (filters.featured === 'Featured') matchesFeatured = p.featured;

      return matchesSearch && matchesCategory && matchesSupplier && matchesStatus && matchesAvailability && matchesFeatured;
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
  }, [products, searchTerm, filters, sortConfig]);

  // --- Pagination Logic ---
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  // --- Handlers ---
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleOpenModal = (product?: ExtendedProduct) => {
    setShowErrors(false); // Reset errors on open
    setTagInput(''); // Reset tag input
    if (product) {
      setEditingId(product.id);
      setFormData({
        name: product.name,
        description: product.description || '',
        tags: product.tags || [],
        supplier: SUPPLIERS.find(s => s.name === product.supplier)?.id || '',
        category: CATEGORIES.find(c => c.name === product.category)?.id || '',
        status: product.status === 'Active',
        price: product.price.toString(),
        packSize: product.packSize,
        creditAmount: product.creditAmount?.toString() || '',
        stock: product.stock.toString(),
        customisable: product.customisable || false,
        bundleSize: product.bundleSize?.toString() || '',
        freeItemQty: product.freeItemQty?.toString() || '',
        pricingTier: product.pricingTier || '',
        featured: product.featured,
        images: product.image ? [product.image] : []
      });
    } else {
      setEditingId(null);
      setFormData(initialFormState);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImages: string[] = [];
      const promises = Array.from(files).map((file: File) => {
        return new Promise<void>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            if (typeof reader.result === 'string') {
               newImages.push(reader.result);
            }
            resolve();
          };
          reader.readAsDataURL(file);
        });
      });
  
      Promise.all(promises).then(() => {
          setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
          if (fileInputRef.current) fileInputRef.current.value = ''; // Reset to allow re-selection
      });
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // --- Tag Logic ---
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !formData.tags.includes(newTag)) {
        setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag] }));
        setTagInput('');
      }
    } else if (e.key === 'Backspace' && !tagInput && formData.tags.length > 0) {
      // Optional: Remove last tag on backspace if input is empty
      setFormData(prev => ({ ...prev, tags: prev.tags.slice(0, -1) }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };

  // Validation Check
  const isFormValid = formData.name.trim() !== '' && formData.supplier !== '' && formData.category !== '';

  const handleSave = () => {
    setShowErrors(true); // Trigger error display
    
    // Basic validation
    if (!isFormValid) return;
    
    const supplierName = SUPPLIERS.find(s => s.id === formData.supplier)?.name || 'Generic';
    const categoryName = CATEGORIES.find(c => c.id === formData.category)?.name || 'Uncategorized';

    const productData: ExtendedProduct = {
      id: editingId || `P${Date.now()}`,
      name: formData.name,
      sku: editingId ? products.find(p => p.id === editingId)?.sku || `SKU-${Date.now()}` : `SKU-${Date.now()}`,
      supplier: supplierName,
      category: categoryName,
      price: parseFloat(formData.price) || 0,
      stock: parseInt(formData.stock) || 0,
      status: formData.status ? 'Active' : 'Draft',
      image: formData.images[0] || 'https://picsum.photos/40/40?random=default',
      packSize: formData.packSize,
      featured: formData.featured,
      description: formData.description,
      tags: formData.tags,
      pricingTier: formData.pricingTier,
      creditAmount: parseFloat(formData.creditAmount) || 0,
      customisable: formData.customisable,
      bundleSize: parseInt(formData.bundleSize) || 1,
      freeItemQty: parseInt(formData.freeItemQty) || 0,
      unitsPerCarton: 1 // Default
    };

    if (editingId) {
      saveProduct(productData);
    } else {
      saveProduct(productData);
    }
    
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      deleteProduct(id);
    }
  };

  const setFilter = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({ category: 'All', supplier: 'All', status: 'All', availability: 'All', featured: 'All' });
    setSearchTerm('');
  };

  // --- Render ---
  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12">
      
      {/* 1. Page Header */}
      <Section 
        title="Products" 
        description="Manage product catalog, pricing, and availability."
        action={
          <>
            {hasPermission('Products', 'create') && (
              <Button variant="secondary" icon={<Upload className="h-4 w-4" />}>Import</Button>
            )}
            <Button variant="secondary" icon={<Download className="h-4 w-4" />}>Export</Button>
            {hasPermission('Products', 'create') && (
              <Button icon={<Plus className="h-4 w-4" />} onClick={() => handleOpenModal()}>Add Product</Button>
            )}
          </>
        }
      >
        {/* 2. Product Summary Cards */}
        <Grid cols={4} gap={4}>
          <KpiCard 
            title="Total Products" 
            value={products.length} 
            icon={Box} 
            color="indigo"
            onClick={resetFilters}
          />
          <KpiCard 
            title="Active Products" 
            value={products.filter(p => p.status === 'Active').length} 
            icon={CheckCircle} 
            color="emerald"
            onClick={() => setFilter('status', 'Active')}
          />
          <KpiCard 
            title="Inactive Drafts" 
            value={products.filter(p => p.status === 'Draft').length} 
            icon={XCircle} 
            color="slate"
            onClick={() => setFilter('status', 'Draft')}
          />
          <KpiCard 
            title="Low Stock Alert" 
            value={products.filter(p => p.stock < 10).length} 
            icon={AlertCircle} 
            color="amber"
            onClick={() => setFilter('availability', 'In Stock')} 
          />
        </Grid>

        <Card padding="none" className="flex flex-col">
          {/* 3. Filter Bar (Sticky) */}
          <div className="p-4 border-b border-slate-200 bg-white sticky top-0 z-10 rounded-t-2xl">
             <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
                <div className="w-full lg:w-96">
                  <Input 
                    placeholder="Search by name, SKU..." 
                    icon={<Search className="h-4 w-4" />} 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-10 text-[11px] font-medium"
                  />
                </div>
                <div className="flex flex-wrap gap-2 w-full lg:w-auto">
                   <div className="w-40">
                     <Select 
                      value={filters.category} 
                      onChange={(e) => setFilter('category', e.target.value)}
                      className="bg-slate-50/50 border-slate-200 text-slate-600 font-bold text-[10px] uppercase tracking-widest h-10 hover:bg-white hover:border-indigo-200 transition-all"
                     >
                       <option value="All">Category: All</option>
                       {CATEGORIES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                     </Select>
                   </div>
                   <div className="w-40">
                     <Select 
                      value={filters.supplier} 
                      onChange={(e) => setFilter('supplier', e.target.value)}
                      className="bg-slate-50/50 border-slate-200 text-slate-600 font-bold text-[10px] uppercase tracking-widest h-10 hover:bg-white hover:border-indigo-200 transition-all"
                     >
                       <option value="All">Supplier: All</option>
                       {SUPPLIERS.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                     </Select>
                   </div>
                   <div className="w-40">
                     <Select 
                      value={filters.status} 
                      onChange={(e) => setFilter('status', e.target.value)}
                      className="bg-slate-50/50 border-slate-200 text-slate-600 font-bold text-[10px] uppercase tracking-widest h-10 hover:bg-white hover:border-indigo-200 transition-all"
                     >
                       <option value="All">Status: All</option>
                       <option value="Active">Active</option>
                       <option value="Draft">Draft</option>
                       <option value="Low Stock">Low Stock</option>
                     </Select>
                   </div>
                   <Button variant="ghost" size="sm" icon={<Filter className="h-4 w-4" />} onClick={resetFilters} className="text-[10px] font-bold uppercase tracking-widest">Reset</Button>
                </div>
             </div>
          </div>

          {/* 4. Products Table */}
          <Table>
            <THead>
              <TR>
                <TH onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-2">Product <ArrowUpDown className="h-3 w-3 text-slate-300 group-hover:text-indigo-500" /></div>
                </TH>
                <TH onClick={() => handleSort('sku')}>
                  <div className="flex items-center gap-2">SKU <ArrowUpDown className="h-3 w-3 text-slate-300 group-hover:text-indigo-500" /></div>
                </TH>
                <TH onClick={() => handleSort('category')}>
                  <div className="flex items-center gap-2">Category <ArrowUpDown className="h-3 w-3 text-slate-300 group-hover:text-indigo-500" /></div>
                </TH>
                <TH onClick={() => handleSort('price')}>
                  <div className="flex items-center gap-2">Price <ArrowUpDown className="h-3 w-3 text-slate-300 group-hover:text-indigo-500" /></div>
                </TH>
                <TH onClick={() => handleSort('stock')}>
                  <div className="flex items-center gap-2">Stock <ArrowUpDown className="h-3 w-3 text-slate-300 group-hover:text-indigo-500" /></div>
                </TH>
                <TH onClick={() => handleSort('status')}>
                  <div className="flex items-center gap-2">Status <ArrowUpDown className="h-3 w-3 text-slate-300 group-hover:text-indigo-500" /></div>
                </TH>
                <TH align="center">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {paginatedProducts.map((product) => (
                <TR key={product.id}>
                  <TD>
                    <div className="flex items-center">
                      <img className="h-10 w-10 rounded-lg object-cover bg-slate-50 border border-slate-200 mr-4" src={product.image} alt="" />
                      <div>
                        <div className="text-sm font-bold text-slate-900">{product.name}</div>
                        {product.featured && <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded ml-1">Featured</span>}
                      </div>
                    </div>
                  </TD>
                  <TD className="font-mono text-slate-500">{product.sku}</TD>
                  <TD className="text-slate-500">{product.category}</TD>
                  <TD className="font-bold text-slate-900">£{product.price.toFixed(2)}</TD>
                  <TD className="text-slate-500">
                     <span className={`${product.stock < 10 ? 'text-rose-600 font-bold' : ''}`}>{product.stock} units</span>
                  </TD>
                  <TD>
                    <Badge variant={
                      product.status === 'Active' ? 'success' : 
                      product.status === 'Low Stock' ? 'warning' : 'neutral'
                    }>
                      {product.status}
                    </Badge>
                  </TD>
                  <TD align="center">
                    <div className="flex justify-center items-center gap-2">
                       {hasPermission('Products', 'edit') && (
                         <button 
                            className="h-9 w-9 rounded-lg border border-slate-200 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 flex items-center justify-center transition-all"
                            onClick={() => handleOpenModal(product)} 
                            title="Edit"
                          >
                           <Edit2 className="h-4 w-4" />
                         </button>
                       )}
                       {hasPermission('Products', 'create') && (
                         <button 
                            className="h-9 w-9 rounded-lg border border-slate-200 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 flex items-center justify-center transition-all"
                            title="Duplicate"
                          >
                           <Copy className="h-4 w-4" />
                         </button>
                       )}
                       {hasPermission('Products', 'delete') && (
                         <button 
                            className="h-9 w-9 rounded-lg border border-slate-200 text-slate-500 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 flex items-center justify-center transition-all"
                            onClick={() => handleDelete(product.id)} 
                            title="Delete"
                          >
                           <Trash2 className="h-4 w-4" />
                         </button>
                       )}
                    </div>
                  </TD>
                </TR>
              ))}
              {paginatedProducts.length === 0 && (
                <TR>
                   <TD colSpan={7} className="py-12 text-center text-slate-500">
                      No products found matching your filters.
                   </TD>
                </TR>
              )}
            </TBody>
          </Table>
          
          {/* Pagination */}
          <Pagination 
            currentPage={currentPage}
            totalItems={filteredProducts.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
            entityName="products"
          />
        </Card>
      </Section>

      {/* --- ADD/EDIT PRODUCT MODAL --- */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title={editingId ? "Edit Product" : "Create New Product"} 
        size="xl"
        footer={
           <div className="flex gap-3 justify-end w-full">
            <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
            <Button 
              variant="primary" 
              onClick={handleSave} 
              icon={<Save className="h-4 w-4" />}
            >
              {editingId ? "Save Changes" : "Create Product"}
            </Button>
          </div>
        }
      >
         <div className="space-y-8 pb-4">
            
            {/* SECTION 1: Basic Information */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative group">
               <h4 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                     <FileText className="h-5 w-5" />
                  </div>
                  Basic Details
               </h4>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                     <Input 
                        label="Product Name" 
                        placeholder="e.g. Premium Ergonomic Chair" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        error={showErrors && !formData.name ? "Product name is required." : undefined}
                     />
                  </div>
                  <div className="md:col-span-2">
                     <TextArea 
                        label="Description" 
                        placeholder="Detailed product description..." 
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                     />
                  </div>
                  <div>
                     <Select 
                        label="Supplier" 
                        value={formData.supplier}
                        onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                        error={showErrors && !formData.supplier ? "Supplier is required." : undefined}
                     >
                        <option value="">Select Supplier</option>
                        {SUPPLIERS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                     </Select>
                  </div>
                  <div>
                     <Select 
                        label="Category" 
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        error={showErrors && !formData.category ? "Category is required." : undefined}
                     >
                        <option value="">Select Category</option>
                        {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                     </Select>
                  </div>
                  
                  {/* TAGS INPUT */}
                  <div className="md:col-span-2">
                     <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tags</label>
                     <div className="flex flex-wrap items-center gap-2 p-2 rounded-xl border border-slate-200 bg-white focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all min-h-[46px]">
                        {formData.tags.map((tag, index) => (
                           <Tag key={index} onRemove={() => removeTag(tag)} icon={<TagIcon className="h-3 w-3" />}>
                              {tag}
                           </Tag>
                        ))}
                        <input 
                           type="text" 
                           value={tagInput}
                           onChange={(e) => setTagInput(e.target.value)}
                           onKeyDown={handleTagKeyDown}
                           placeholder={formData.tags.length === 0 ? "e.g. New, Sale, Winter (Press Enter)" : ""}
                           className="flex-1 min-w-[140px] border-none focus:ring-0 p-1 text-sm bg-transparent placeholder-slate-400"
                        />
                     </div>
                  </div>

                  {/* AVAILABILITY STATUS */}
                  <div className="md:col-span-2">
                     <label className="block text-sm font-semibold text-slate-700 mb-1.5">Availability Status</label>
                     <div className="w-full bg-white px-3 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
                        <Toggle 
                           checked={formData.status} 
                           onChange={(checked) => setFormData({...formData, status: checked})}
                           label={formData.status ? "Active" : "Draft"}
                           description={formData.status ? "Product is live" : "Hidden from catalog"}
                        />
                     </div>
                  </div>
               </div>
            </div>

            {/* SECTION 2: Pricing & Stock */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative">
               <h4 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                     <DollarSign className="h-5 w-5" />
                  </div>
                  Pricing & Inventory
               </h4>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Input 
                     label="Price Per Unit (£)" 
                     type="number" 
                     placeholder="0.00" 
                     value={formData.price}
                     onChange={(e) => setFormData({...formData, price: e.target.value})}
                  />
                  <Input 
                     label="Pack Size" 
                     placeholder="e.g. 1 Unit, Pack of 6" 
                     value={formData.packSize}
                     onChange={(e) => setFormData({...formData, packSize: e.target.value})}
                  />
                  <Input 
                     label="Credit Amount" 
                     type="number" 
                     placeholder="0" 
                     value={formData.creditAmount}
                     onChange={(e) => setFormData({...formData, creditAmount: e.target.value})}
                  />
                  <Input 
                     label="Stock Available" 
                     type="number" 
                     placeholder="0" 
                     value={formData.stock}
                     onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  />
               </div>
            </div>

             {/* SECTION 3: Media */}
             <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative">
               <h4 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                     <ImageIcon className="h-5 w-5" />
                  </div>
                  Product Media
               </h4>
               
               <div className="flex flex-col gap-6">
                  <input 
                     type="file" 
                     ref={fileInputRef} 
                     className="hidden" 
                     accept="image/*"
                     multiple
                     onChange={handleImageUpload}
                  />

                  {formData.images.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {formData.images.map((img, index) => (
                            <div key={index} className="relative group aspect-square rounded-xl border border-slate-200 overflow-hidden bg-slate-50 shadow-sm">
                                <img src={img} alt={`Product ${index}`} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                <button 
                                    onClick={() => removeImage(index)}
                                    className="absolute top-2 right-2 p-1.5 bg-rose-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-sm hover:bg-rose-600 scale-90 group-hover:scale-100"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                                {index === 0 && (
                                    <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[10px] font-bold text-center py-1 backdrop-blur-sm">
                                        Main Image
                                    </div>
                                )}
                            </div>
                        ))}
                        <div 
                            className="aspect-square rounded-xl border-2 border-dashed border-slate-300 hover:border-indigo-400 hover:bg-indigo-50 flex flex-col items-center justify-center cursor-pointer transition-all group bg-slate-50/50"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <div className="p-3 bg-white shadow-sm rounded-full group-hover:text-indigo-600 transition-colors text-slate-400 mb-2">
                                <Plus className="h-6 w-6" />
                            </div>
                            <span className="text-xs text-slate-500 font-semibold group-hover:text-indigo-600">Add More</span>
                        </div>
                    </div>
                  ) : (
                    <div 
                        className="border-2 border-dashed border-slate-300 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group bg-slate-50/50"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <div className="h-16 w-16 bg-white shadow-sm text-indigo-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Upload className="h-8 w-8" />
                        </div>
                        <p className="text-base font-semibold text-slate-900">Click to upload images</p>
                        <p className="text-sm text-slate-500 mt-1">SVG, PNG, JPG (Multiple allowed)</p>
                    </div>
                  )}
               </div>
            </div>

            {/* SECTION 4: Configuration */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative">
               <h4 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <div className="p-2 bg-violet-50 rounded-lg text-violet-600">
                     <Settings className="h-5 w-5" />
                  </div>
                  Advanced Configuration
               </h4>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-colors">
                        <Toggle 
                           checked={formData.customisable} 
                           onChange={(checked) => setFormData({...formData, customisable: checked})}
                           label="Customisable Product" 
                           description="Allow customers to configure options."
                        />
                     </div>
                     <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-colors">
                        <Toggle 
                           checked={formData.featured} 
                           onChange={(checked) => setFormData({...formData, featured: checked})}
                           label="Featured Product" 
                           description="Highlight on homepage."
                        />
                     </div>
                  </div>
                  <Input 
                     label="Bundle Size" 
                     type="number" 
                     placeholder="1" 
                     value={formData.bundleSize}
                     onChange={(e) => setFormData({...formData, bundleSize: e.target.value})}
                  />
                  <Input 
                     label="Free Item Quantity" 
                     type="number" 
                     placeholder="0" 
                     value={formData.freeItemQty}
                     onChange={(e) => setFormData({...formData, freeItemQty: e.target.value})}
                  />
                  <div className="md:col-span-2">
                     <Select 
                        label="Pricing Tier Strategy" 
                        value={formData.pricingTier}
                        onChange={(e) => setFormData({...formData, pricingTier: e.target.value})}
                     >
                        <option value="">Select Strategy (Optional)</option>
                        <option value="Standard">Standard Retail</option>
                        <option value="Wholesale">Wholesale Bulk</option>
                        <option value="VIP">VIP Exclusive</option>
                     </Select>
                  </div>
               </div>
            </div>

         </div>
      </Modal>
    </div>
  );
};

export default ProductsPage;
