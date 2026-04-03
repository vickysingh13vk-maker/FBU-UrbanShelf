import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Package,
  Warehouse,
  Edit2,
  Upload,
  Trash2,
  FileText,
  PoundSterling,
  Image as ImageIcon,
  Save,
  Copy,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { 
  Card, 
  Button, 
  Badge, 
  Table, 
  THead, 
  TBody, 
  TR, 
  TH, 
  TD, 
  Input,
  Toast,
  Pagination,
  Modal,
  TextArea,
  Toggle,
  Select
} from '../../components/ui';
import { Link } from 'react-router-dom';
import { 
  KpiBlock,
  InventoryHoverTooltip
} from '../../components/supplier/SupplierComponents';
import { useSupplier } from '../../context/SupplierContext';
import type { Product } from '../../types';

const SupplierProducts: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, isLoading } = useSupplier();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [showErrors, setShowErrors] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    barcode: '',
    category: '',
    nicotineStrength: '',
    flavour: '',
    weight: '',
    dimensions: '',
    price: '',
    reorderLevel: '',
    status: true, // true = Active, false = Draft
    description: ''
  });

  const handleOpenModal = (product?: Product) => {
    setShowErrors(false);
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        sku: product.sku,
        barcode: product.barcode || '',
        category: product.category,
        nicotineStrength: product.nicotineStrength || '',
        flavour: product.flavour || '',
        weight: product.weight || '',
        dimensions: product.dimensions || '',
        price: product.price.toString(),
        reorderLevel: product.reorderLevel?.toString() || '',
        status: product.status === 'Active',
        description: product.description || ''
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        sku: '',
        barcode: '',
        category: '',
        nicotineStrength: '',
        flavour: '',
        weight: '',
        dimensions: '',
        price: '',
        reorderLevel: '',
        status: true,
        description: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    setShowErrors(true);
    const parsedPrice = parseFloat(formData.price);
    if (!formData.name || !formData.sku || !formData.price || isNaN(parsedPrice)) {
      setToast({ message: 'Please fill in all required fields with valid values', type: 'error' });
      return;
    }

    const productData = {
      ...formData,
      price: parsedPrice,
      reorderLevel: parseInt(formData.reorderLevel) || 0,
      status: formData.status ? 'Active' : 'Draft',
      image: editingProduct?.image || `https://picsum.photos/seed/${formData.sku}/100/100`
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
      setToast({ message: 'Product updated successfully', type: 'success' });
    } else {
      addProduct(productData);
      setToast({ message: 'Product created successfully', type: 'success' });
    }
    setIsModalOpen(false);
  };

  const handleDuplicate = (product: Product) => {
    const duplicatedProduct = {
      ...product,
      name: `${product.name} (Copy)`,
      sku: `${product.sku}-COPY`,
      id: undefined, // Let the context generate a new ID
      createdDate: undefined // Let the context generate a new date
    };
    addProduct(duplicatedProduct);
    setToast({ message: 'Product duplicated successfully', type: 'success' });
  };

  const handleDeleteConfirm = () => {
    if (productToDelete) {
      deleteProduct(productToDelete);
      setToast({ message: 'Product deleted successfully', type: 'success' });
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  // Filtering & Sorting Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             p.sku.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = !statusFilter || p.status.toLowerCase() === statusFilter.toLowerCase();
        const matchesCategory = !categoryFilter || p.category.toLowerCase() === categoryFilter.toLowerCase();
        return matchesSearch && matchesStatus && matchesCategory;
      })
      .sort((a, b) => {
        const aValue = a[sortBy as keyof Product];
        const bValue = b[sortBy as keyof Product];
        if (sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
  }, [products, searchQuery, statusFilter, categoryFilter, sortBy, sortOrder]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);



  const stats = useMemo(() => {
    const totalProducts = products.length;
    const activeProducts = products.filter(p => p.status === 'Active').length;
    const lowStockProducts = products.filter(p => p.status === 'Low Stock').length;
    const totalRevenue = products.reduce((acc, p) => acc + (p.revenue || 0), 0);
    
    return { totalProducts, activeProducts, lowStockProducts, totalRevenue };
  }, [products]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Products</h1>
            <p className="text-slate-500 mt-1 font-medium">Manage your product catalog and monitor sales performance.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2">
              <Upload className="h-4 w-4" />
              Import CSV
            </Button>
            <Button size="sm" className="gap-2" onClick={() => handleOpenModal()}>
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KpiBlock 
          title="Total Catalog"
          icon={Package}
          metrics={[
            { label: 'Total SKUs', value: stats.totalProducts.toString() },
            { label: 'Active', value: stats.activeProducts.toString() }
          ]}
          color="indigo"
        />
        <KpiBlock 
          title="Inventory Health"
          icon={Warehouse}
          metrics={[
            { label: 'Low Stock', value: stats.lowStockProducts.toString() },
            { label: 'Out of Stock', value: products.filter(p => p.status === 'Out of Stock').length.toString() }
          ]}
          color="rose"
          tooltip="SKUs requiring immediate replenishment."
        />
        <KpiBlock 
          title="Sales Performance"
          icon={TrendingUp}
          metrics={[
            { label: 'Total Revenue', value: `£${stats.totalRevenue.toLocaleString()}` },
            { label: 'Growth', value: '+12.5%', trend: { value: '12.5%', isPositive: true } }
          ]}
          color="emerald"
        />
        <KpiBlock 
          title="Pricing"
          icon={PoundSterling}
          metrics={[
            { label: 'Avg. Price', value: `£${(stats.totalRevenue / (products.reduce((acc, p) => acc + (p.unitsSold || 0), 0) || 1)).toFixed(2)}` },
            { label: 'Top Price', value: `£${Math.max(...products.map(p => p.price)).toFixed(2)}` }
          ]}
          color="amber"
        />
      </div>

      {/* Filters Section */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              className="pl-10" 
              placeholder="Search products by name or SKU..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 px-4 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-10 px-4 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            >
              <option value="">All Categories</option>
              <option value="Pre-filled Vape Kits + Pods">Kits & Pods</option>
              <option value="Disposable">Disposable</option>
              <option value="Pod Kits">Pod Kits</option>
              <option value="Nicotine Pouches">Nicotine Pouches</option>
            </select>
            <select 
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order as 'asc' | 'desc');
              }}
              className="h-10 px-4 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="price-asc">Price (Low-High)</option>
              <option value="price-desc">Price (High-Low)</option>
              <option value="stock-desc">Stock (High-Low)</option>
              <option value="createdDate-desc">Newest First</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Products Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <Table>
            <THead>
              <TR>
                <TH className="pl-6 w-16">Product</TH>
                <TH>SKU & Category</TH>
                <TH align="center">Inventory</TH>
                <TH align="center">Boxes Sold</TH>
                <TH>Revenue</TH>
                <TH align="center">Trend</TH>
                <TH>Status</TH>
                <TH align="center" className="pr-6">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {paginatedProducts.length > 0 ? paginatedProducts.map((product) => (
                <TR key={product.id} className="group hover:bg-slate-50/50 transition-colors">
                  <TD className="pl-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl border border-slate-100 overflow-hidden bg-white shadow-sm shrink-0 group-hover:scale-105 transition-transform duration-300">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="h-full w-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex flex-col min-w-[200px]">
                        <Link to={`/supplier/products/${product.id}`} className="font-bold text-slate-900 hover:text-indigo-600 transition-colors truncate">
                          {product.name}
                        </Link>
                        <span className="text-[11px] font-medium text-slate-400">£{product.price.toFixed(2)} / unit</span>
                      </div>
                    </div>
                  </TD>
                  <TD>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-mono font-bold text-slate-500">{product.sku}</span>
                      <Badge variant="secondary" className="w-fit text-[10px] py-0 px-1.5 h-4 uppercase tracking-wider font-bold">
                        {product.category}
                      </Badge>
                    </div>
                  </TD>
                  <TD align="center">
                    <div className="relative group/stock inline-block">
                      <div className="flex flex-col items-center cursor-help">
                        <span className="text-sm font-black text-slate-900 tabular-nums">{(product.stock || 0).toLocaleString()}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Units</span>
                      </div>
                      
                      {/* Tooltip on Hover */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/stock:block z-50">
                        <InventoryHoverTooltip data={{ product: product.name, total: product.stock, flavours: product.flavours }} />
                      </div>
                    </div>
                  </TD>
                  <TD align="center">
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-black text-slate-900 tabular-nums">{(product.unitsSold || 0).toLocaleString()}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Boxes</span>
                    </div>
                  </TD>
                  <TD>
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-emerald-600 tabular-nums">£{(product.revenue || 0).toLocaleString()}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Total Sales</span>
                    </div>
                  </TD>
                  <TD align="center">
                    {product.trend === 'up' ? (
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-emerald-50 text-emerald-600">
                        <TrendingUp className="h-4 w-4" />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-rose-50 text-rose-600">
                        <TrendingDown className="h-4 w-4" />
                      </div>
                    )}
                  </TD>
                  <TD>
                    <Badge variant={
                      product.status === 'Active' ? 'success' : 
                      product.status === 'Low Stock' ? 'warning' : 'danger'
                    }>
                      {product.status}
                    </Badge>
                  </TD>
                  <TD align="center" className="pr-6">
                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        className="h-8 w-8 rounded-lg border border-slate-200 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 flex items-center justify-center transition-all"
                        onClick={() => handleOpenModal(product)} 
                        title="Edit"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button 
                        className="h-8 w-8 rounded-lg border border-slate-200 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 flex items-center justify-center transition-all"
                        onClick={() => handleDuplicate(product)}
                        title="Duplicate"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                      <button 
                        className="h-8 w-8 rounded-lg border border-slate-200 text-slate-500 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 flex items-center justify-center transition-all"
                        onClick={() => {
                          setProductToDelete(product.id);
                          setIsDeleteModalOpen(true);
                        }}
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </TD>
                </TR>
              )) : (
                <TR>
                  <TD colSpan={8} align="center" className="py-12">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <Package className="h-12 w-12 opacity-20" />
                      <p className="text-lg font-bold">No products found</p>
                      <p className="text-sm">Try adjusting your search or filters</p>
                    </div>
                  </TD>
                </TR>
              )}
            </TBody>
          </Table>
        </div>
        
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

      {/* Add/Edit Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? "Edit Product" : "Add New Product"}
        size="xl"
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} isLoading={isLoading} icon={<Save className="h-4 w-4" />}>
              {editingProduct ? "Update Product" : "Create Product"}
            </Button>
          </div>
        }
      >
        <div className="space-y-5 pb-4">
          {/* SECTION 1: Basic Information */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative group">
            <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                <FileText className="h-5 w-5" />
              </div>
              Basic Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Input 
                  label="Product Name *" 
                  placeholder="e.g. Lost Mary BM600" 
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
                <Input 
                  label="SKU *" 
                  placeholder="e.g. LM-BM600-01" 
                  value={formData.sku}
                  onChange={(e) => setFormData({...formData, sku: e.target.value})}
                  error={showErrors && !formData.sku ? "SKU is required." : undefined}
                />
              </div>
              <div>
                <Input 
                  label="Barcode (EAN/UPC)" 
                  placeholder="e.g. 5060123456789" 
                  value={formData.barcode}
                  onChange={(e) => setFormData({...formData, barcode: e.target.value})}
                />
              </div>
              <div>
                <Select 
                  label="Category" 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="">Select Category</option>
                  <option value="Pre-filled Vape Kits + Pods">Kits & Pods</option>
                  <option value="Disposable">Disposable</option>
                  <option value="Pod Kits">Pod Kits</option>
                  <option value="Nicotine Pouches">Nicotine Pouches</option>
                </Select>
              </div>
              <div>
                <Input 
                  label="Nicotine Strength" 
                  placeholder="e.g. 20mg" 
                  value={formData.nicotineStrength}
                  onChange={(e) => setFormData({...formData, nicotineStrength: e.target.value})}
                />
              </div>
              <div>
                <Input 
                  label="Flavor" 
                  placeholder="e.g. Blue Razz Ice" 
                  value={formData.flavour}
                  onChange={(e) => setFormData({...formData, flavour: e.target.value})}
                />
              </div>
              <div>
                <Input 
                  label="Weight (g)" 
                  type="number" 
                  placeholder="e.g. 35" 
                  value={formData.weight}
                  onChange={(e) => setFormData({...formData, weight: e.target.value})}
                />
              </div>
              <div className="md:col-span-2">
                <Input 
                  label="Dimensions (L x W x H cm)" 
                  placeholder="e.g. 10 x 5 x 2" 
                  value={formData.dimensions}
                  onChange={(e) => setFormData({...formData, dimensions: e.target.value})}
                />
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

          {/* SECTION 2: Pricing & Inventory */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative">
            <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                <PoundSterling className="h-5 w-5" />
              </div>
              Pricing & Inventory
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="Selling Price (£) *" 
                type="number" 
                step="0.01" 
                placeholder="e.g. 4.50" 
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                error={showErrors && !formData.price ? "Price is required." : undefined}
              />
              <Input 
                label="Reorder Level" 
                type="number" 
                placeholder="e.g. 100" 
                value={formData.reorderLevel}
                onChange={(e) => setFormData({...formData, reorderLevel: e.target.value})}
              />
            </div>
          </div>

          {/* SECTION 3: Media */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative">
            <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                <ImageIcon className="h-5 w-5" />
              </div>
              Product Media
            </h4>
            
            <div className="flex flex-col gap-6">
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center gap-3 bg-slate-50/50 hover:bg-slate-50 hover:border-indigo-300 transition-all cursor-pointer">
                <div className="p-3 bg-white rounded-full shadow-sm">
                  <Upload className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-900">Click to upload or drag and drop</p>
                  <p className="text-xs text-slate-500 mt-1">PNG, JPG or WEBP (max. 2MB)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Product"
        footer={
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} isLoading={isLoading}>Delete Product</Button>
          </div>
        }
      >
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="p-4 bg-rose-50 rounded-full">
            <Trash2 className="h-8 w-8 text-rose-500" />
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-slate-900">Are you sure?</p>
            <p className="text-sm text-slate-500 mt-1">
              This action cannot be undone. This will permanently delete the product and remove it from our servers.
            </p>
          </div>
        </div>
      </Modal>

      {/* Toast Notifications */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
};

export default SupplierProducts;
