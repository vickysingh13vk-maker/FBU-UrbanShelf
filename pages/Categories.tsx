import React, { useState, useRef, useMemo } from 'react';
import { 
  Search, Plus, FolderTree, Edit, Trash2, Layers, Box, CheckCircle, XCircle, ChevronRight, Folder, FolderOpen,
  Upload, Image as ImageIcon, X, ArrowUpDown
} from 'lucide-react';
import { 
  Card, Button, Input, Select, Badge, Modal, Toggle,
  Section, Grid, Table, THead, TBody, TR, TH, TD, KpiCard, StatBox, CardHeader
} from '../components/ui';
import { CATEGORIES } from '../data';
import { Category } from '../types';
import { useAuth } from '../context/AuthContext';

type SortConfig = { key: string; direction: 'asc' | 'desc' } | null;

const CategoriesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  const { hasPermission } = useAuth();

  // --- Modal State ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    status: true, // defaults to Active
    parentId: '',
    displayOrder: 0,
    imagePreview: null as string | null
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Data Processing ---
  const filteredCategories = useMemo(() => {
    let data = CATEGORIES.filter(cat => {
      const matchesSearch = cat.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || 
                            (statusFilter === 'Active' && cat.status === 'Active') || 
                            (statusFilter === 'Inactive' && cat.status === 'Hidden');
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

  const totalCategories = CATEGORIES.length;
  const activeCategories = CATEGORIES.filter(c => c.status === 'Active').length;
  const inactiveCategories = CATEGORIES.filter(c => c.status === 'Hidden').length;
  const totalProducts = CATEGORIES.reduce((acc, curr) => acc + curr.products, 0);

  // --- Handlers ---
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingId(category.id);
      setCategoryForm({
        name: category.name,
        status: category.status === 'Active',
        parentId: '', // Default as existing data type doesn't track parent yet
        displayOrder: 0, // Default as existing data type doesn't track order yet
        imagePreview: null // Default as existing data type doesn't track image yet
      });
    } else {
      setEditingId(null);
      setCategoryForm({
        name: '',
        status: true,
        parentId: '',
        displayOrder: 0,
        imagePreview: null
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
        setCategoryForm(prev => ({ ...prev, imagePreview: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!categoryForm.name.trim()) return;
    
    if (editingId) {
      console.log(`Updating Category [${editingId}]:`, categoryForm);
    } else {
      console.log("Creating New Category:", categoryForm);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12">
      
      {/* 1. Page Header */}
      <Section 
        title="Categories" 
        description="Manage product categories and catalog structure."
        action={hasPermission('Inventory', 'create') && <Button icon={<Plus className="h-4 w-4" />} onClick={() => handleOpenModal()}>Add Category</Button>}
      >
        {/* 2. Category Summary Cards */}
        <Grid cols={4} gap={4}>
          <KpiCard title="Total Categories" value={totalCategories} icon={Layers} color="indigo" />
          <KpiCard title="Active Categories" value={activeCategories} icon={CheckCircle} color="emerald" />
          <KpiCard title="Hidden Categories" value={inactiveCategories} icon={XCircle} color="neutral" />
          <KpiCard title="Total Products" value={totalProducts} icon={Box} color="blue" />
        </Grid>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* 5. Category Hierarchy View (Left Panel) */}
          <Card padding="none" className="lg:col-span-1 flex flex-col h-[600px] overflow-hidden">
            <CardHeader 
              title="Catalog Structure" 
              icon={<FolderTree className="h-4 w-4 text-slate-500" />}
              action={<span className="text-xs font-medium text-slate-500 px-2 py-1 bg-white rounded border border-slate-200">Root Level</span>}
            />
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
               {CATEGORIES.map((category) => (
                 <div 
                   key={category.id}
                   onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                   className={`
                     group flex items-center justify-between px-3 py-3 rounded-lg cursor-pointer transition-all duration-200
                     ${selectedCategory === category.id 
                       ? 'bg-indigo-50 border border-indigo-100 shadow-sm' 
                       : 'hover:bg-slate-50 border border-transparent'}
                   `}
                 >
                   <div className="flex items-center gap-3">
                     {selectedCategory === category.id 
                       ? <FolderOpen className="h-5 w-5 text-indigo-600" />
                       : <Folder className="h-5 w-5 text-slate-400 group-hover:text-slate-500" />
                     }
                     <div>
                       <div className={`text-sm font-medium ${selectedCategory === category.id ? 'text-indigo-900' : 'text-slate-700'}`}>
                         {category.name}
                       </div>
                       <div className="text-xs text-slate-400">{category.products} products</div>
                     </div>
                   </div>
                   {selectedCategory === category.id && <ChevronRight className="h-4 w-4 text-indigo-400" />}
                 </div>
               ))}
               
                {hasPermission('Inventory', 'create') && (
                  <button 
                    onClick={() => handleOpenModal()}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-lg border border-dashed border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-all text-sm font-medium"
                  >
                    <Plus className="h-4 w-4" /> Add Root Category
                  </button>
                )}
            </div>
          </Card>

          {/* 4. Categories Table (Right Panel) */}
          <Card padding="none" className="lg:col-span-2 flex flex-col h-[600px] overflow-hidden">
            {/* Filters */}
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white">
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto flex-1">
                <div className="w-full sm:w-64">
                  <Input 
                    placeholder="Search categories..." 
                    icon={<Search className="h-4 w-4" />} 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="w-full sm:w-40">
                  <Select 
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="All">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Hidden</option>
                  </Select>
                </div>
              </div>
              
              <Button variant="ghost" size="sm" onClick={() => { setSearchTerm(''); setStatusFilter('All'); }}>Reset</Button>
            </div>

            {/* Table */}
            <Table>
              <THead>
                <TR>
                  <TH onClick={() => handleSort('name')} className="cursor-pointer group select-none">
                    <div className="flex items-center gap-2">Category Name <ArrowUpDown className="h-3 w-3 text-slate-300 group-hover:text-indigo-500" /></div>
                  </TH>
                  <TH onClick={() => handleSort('description')} className="cursor-pointer group select-none">
                    <div className="flex items-center gap-2">Description <ArrowUpDown className="h-3 w-3 text-slate-300 group-hover:text-indigo-500" /></div>
                  </TH>
                  <TH onClick={() => handleSort('products')} className="cursor-pointer group select-none">
                    <div className="flex items-center gap-2">Products <ArrowUpDown className="h-3 w-3 text-slate-300 group-hover:text-indigo-500" /></div>
                  </TH>
                  <TH onClick={() => handleSort('status')} className="cursor-pointer group select-none">
                    <div className="flex items-center gap-2">Status <ArrowUpDown className="h-3 w-3 text-slate-300 group-hover:text-indigo-500" /></div>
                  </TH>
                  <TH align="center">Actions</TH>
                </TR>
              </THead>
              <TBody>
                {filteredCategories.map((category) => (
                  <TR 
                    key={category.id} 
                    className={`cursor-pointer ${selectedCategory === category.id ? 'bg-indigo-50/30' : ''}`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <TD>
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 mr-4 border border-slate-200">
                          <Layers className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900">{category.name}</div>
                          <div className="text-xs text-slate-400 font-mono mt-0.5">{category.id}</div>
                        </div>
                      </div>
                    </TD>
                    <TD>
                      <div className="text-sm text-slate-600 line-clamp-1 max-w-xs">{category.description}</div>
                    </TD>
                    <TD>
                      <Badge variant="info">{category.products}</Badge>
                    </TD>
                    <TD>
                      <Badge variant={category.status === 'Active' ? 'success' : 'neutral'}>
                        {category.status}
                      </Badge>
                    </TD>
                    <TD align="center">
                      <div className="flex items-center justify-center gap-2" onClick={e => e.stopPropagation()}>
                        {hasPermission('Inventory', 'edit') && (
                          <button 
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            onClick={() => handleOpenModal(category)}
                            title="Edit Category"
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
                {filteredCategories.length === 0 && (
                  <TR>
                    <TD colSpan={5} className="py-12 text-center text-slate-500">No categories found</TD>
                  </TR>
                )}
              </TBody>
            </Table>
            
            <div className="bg-white px-6 py-4 border-t border-slate-100 text-sm text-slate-500">
               {filteredCategories.length} categories shown
            </div>
          </Card>
        </div>
      </Section>

      {/* --- ADD/EDIT CATEGORY MODAL --- */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title={editingId ? "Edit Category" : "Add Category"}
        footer={
          <div className="flex gap-3 justify-end w-full">
            <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
            <Button 
              variant="primary" 
              onClick={handleSave} 
              disabled={!categoryForm.name.trim()}
            >
              {editingId ? "Save Changes" : "Create Category"}
            </Button>
          </div>
        }
      >
        <div className="space-y-6">
          
          {/* Section 1: Category Information */}
          <Card>
            <CardHeader title="Category Information" />
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {/* Image Upload */}
                 <div className="flex flex-col gap-2">
                   <label className="block text-sm font-semibold text-slate-700">Category Image / Icon</label>
                   <div 
                     className={`
                       border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors
                       ${categoryForm.imagePreview ? 'border-indigo-200 bg-indigo-50/30' : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'}
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
                     
                     {categoryForm.imagePreview ? (
                       <div className="relative group">
                         <img src={categoryForm.imagePreview} alt="Preview" className="h-24 w-24 object-contain rounded-lg bg-white shadow-sm p-1" />
                         <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <span className="text-white text-xs font-medium">Change</span>
                         </div>
                         <button 
                           onClick={(e) => { e.stopPropagation(); setCategoryForm(prev => ({ ...prev, imagePreview: null })); }}
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
                         <p className="text-sm font-medium text-slate-600">Click to upload image</p>
                         <p className="text-xs text-slate-400 mt-1">SVG, PNG, JPG</p>
                       </div>
                     )}
                   </div>
                 </div>

                 {/* Name */}
                 <Input 
                   label="Category Name" 
                   placeholder="e.g. Office Furniture" 
                   value={categoryForm.name}
                   onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                 />
                 
                 {/* Parent Category */}
                 <Select 
                   label="Parent Category" 
                   value={categoryForm.parentId} 
                   onChange={(e) => setCategoryForm(prev => ({ ...prev, parentId: e.target.value }))}
                 >
                   <option value="">None (Top Level)</option>
                   {CATEGORIES.filter(c => c.id !== editingId).map(cat => (
                     <option key={cat.id} value={cat.id}>{cat.name}</option>
                   ))}
                 </Select>

                 {/* Display Order */}
                 <Input 
                   label="Display Order" 
                   type="number"
                   placeholder="0" 
                   value={categoryForm.displayOrder}
                   onChange={(e) => setCategoryForm(prev => ({ ...prev, displayOrder: parseInt(e.target.value) || 0 }))}
                 />

                 {/* Status Toggle */}
                 <div className="bg-white p-3 rounded-xl border border-slate-200 mt-2">
                   <Toggle 
                     checked={categoryForm.status} 
                     onChange={(checked) => setCategoryForm(prev => ({ ...prev, status: checked }))} 
                     label="Active Status"
                     description="Visible in catalog and menus."
                   />
                 </div>
              </div>
            </div>
          </Card>
        </div>
      </Modal>

    </div>
  );
};

export default CategoriesPage;
