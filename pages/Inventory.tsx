import React, { useState, useMemo } from 'react';
import { 
  Warehouse, Search, Filter, ArrowUpDown, 
  AlertTriangle, CheckCircle, Package, 
  Plus, Edit2, History, Save, X, ArrowUpRight, ArrowDownRight,
  MapPin, TrendingUp, MoreVertical, ChevronRight, RefreshCw
} from 'lucide-react';
import { 
  Card, Button, Badge, Input, Table, THead, TBody, TR, TH, TD,
  Modal
} from '../components/ui';
import { Product } from '../types';
import { useProducts } from '../context/ProductContext';
import { motion, AnimatePresence } from 'motion/react';

const InventoryPage: React.FC = () => {
  const { products: inventory, updateStock, stockHistory } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Low Stock' | 'Out of Stock' | 'In Stock'>('All');
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adjustmentQty, setAdjustmentQty] = useState<number>(0);
  const [adjustmentType, setAdjustmentType] = useState<'add' | 'remove'>('add');
  const [adjustmentReason, setAdjustmentReason] = useState('');

  // Stats
  const stats = useMemo(() => {
    const totalItems = inventory.length;
    const lowStock = inventory.filter(p => p.stock > 0 && p.stock <= 50).length;
    const outOfStock = inventory.filter(p => p.stock === 0).length;
    const totalValue = inventory.reduce((sum, p) => sum + (p.price * p.stock), 0);
    
    return { totalItems, lowStock, outOfStock, totalValue };
  }, [inventory]);

  // Filtered Inventory
  const filteredInventory = useMemo(() => {
    return inventory.filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.barcode?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (item.flavour?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      
      const matchesFilter = 
        filterStatus === 'All' ||
        (filterStatus === 'Low Stock' && item.stock > 0 && item.stock <= 50) ||
        (filterStatus === 'Out of Stock' && item.stock === 0) ||
        (filterStatus === 'In Stock' && item.stock > 50);
        
      return matchesSearch && matchesFilter;
    });
  }, [inventory, searchTerm, filterStatus]);

  const handleAdjustStock = (product: Product) => {
    setSelectedProduct(product);
    setAdjustmentQty(0);
    setAdjustmentType('add');
    setAdjustmentReason('');
    setIsAdjustModalOpen(true);
  };

  const saveAdjustment = () => {
    if (!selectedProduct) return;
    
    const change = adjustmentType === 'add' ? adjustmentQty : -adjustmentQty;
    const newStock = Math.max(0, selectedProduct.stock + change);
    
    updateStock(selectedProduct.id, newStock, adjustmentReason, adjustmentType, adjustmentQty);
    
    setIsAdjustModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Warehouse className="h-6 w-6 text-indigo-600" />
            Inventory Management
          </h1>
          <p className="text-slate-500 mt-1">Monitor and adjust stock levels across your catalog.</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="secondary" 
            icon={<History className="h-4 w-4" />}
            onClick={() => setIsHistoryModalOpen(true)}
          >
            Stock History
          </Button>
          <Button 
            icon={<Plus className="h-4 w-4" />}
            onClick={() => {
              setSelectedProduct(null);
              setAdjustmentQty(0);
              setAdjustmentType('add');
              setAdjustmentReason('Restock');
              setIsAdjustModalOpen(true);
            }}
          >
            Receive Stock
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-indigo-500">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Products</p>
              <p className="text-xl font-bold text-slate-900">{stats.totalItems}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-amber-500">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Low Stock Items</p>
              <p className="text-xl font-bold text-slate-900">{stats.lowStock}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-rose-500">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
              <X className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Out of Stock</p>
              <p className="text-xl font-bold text-slate-900">{stats.outOfStock}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-emerald-500">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <ArrowUpRight className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Inventory Value</p>
              <p className="text-xl font-bold text-slate-900">£{stats.totalValue.toLocaleString()}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col lg:flex-row gap-4 justify-between items-center">
          <div className="w-full lg:w-96">
            <Input 
              placeholder="Search by name, SKU, or flavour..." 
              icon={<Search className="h-4 w-4" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2 w-full lg:w-auto">
            {(['All', 'In Stock', 'Low Stock', 'Out of Stock'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterStatus === status 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
            <div className="h-10 w-px bg-slate-200 mx-1 hidden sm:block" />
            <Button variant="secondary" icon={<Filter className="h-4 w-4" />}>Advanced Filter</Button>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="overflow-x-auto no-scrollbar">
          <Table noWrapper={true}>
            <THead>
              <TR>
                <TH>Product Info</TH>
                <TH>Warehouse</TH>
                <TH>Stock Levels</TH>
                <TH>Pricing (Wholesale/MRP)</TH>
                <TH>Batch/Expiry</TH>
                <TH>Status</TH>
                <TH className="text-right">Actions</TH>
              </TR>
            </THead>
            <TBody>
              <AnimatePresence mode="popLayout">
                {filteredInventory.map((item) => (
                  <motion.tr
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={item.id}
                    className="hover:bg-slate-50 transition-colors group"
                  >
                    <TD>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-slate-100 overflow-hidden border border-slate-200 flex-shrink-0">
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-slate-900 truncate">{item.name}</p>
                          <p className="text-xs text-slate-500 truncate">SKU: {item.sku}</p>
                          {item.barcode && <p className="text-[10px] text-slate-400">UPC: {item.barcode}</p>}
                        </div>
                      </div>
                    </TD>
                    <TD>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <MapPin size={14} className="text-slate-400" />
                        {item.warehouseLocation || 'Unassigned'}
                      </div>
                    </TD>
                    <TD>
                      <div className="space-y-1 min-w-[120px]">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-500">Available:</span>
                          <span className="font-bold text-slate-900">{item.stock.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">Reserved:</span>
                          <span className="text-indigo-600 font-medium">{item.reservedStock || 0}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">Damaged:</span>
                          <span className="text-rose-500 font-medium">{item.damagedStock || 0}</span>
                        </div>
                      </div>
                    </TD>
                    <TD>
                      <div className="text-sm">
                        <p className="font-medium text-slate-900">£{item.price.toFixed(2)}</p>
                        {item.mrp && <p className="text-xs text-slate-400 line-through">£{item.mrp.toFixed(2)}</p>}
                      </div>
                    </TD>
                    <TD>
                      <div className="text-xs space-y-1">
                        <p className="text-slate-600 font-medium">Batch: {item.batchNumber || 'N/A'}</p>
                        <p className="text-slate-400">Exp: {item.expiryDate || 'N/A'}</p>
                      </div>
                    </TD>
                    <TD>
                      {item.stock === 0 ? (
                        <Badge variant="danger" icon={<X className="h-3 w-3" />}>Out of Stock</Badge>
                      ) : item.stock <= 50 ? (
                        <Badge variant="warning" icon={<AlertTriangle className="h-3 w-3" />}>Low Stock</Badge>
                      ) : (
                        <Badge variant="success" icon={<CheckCircle className="h-3 w-3" />}>In Stock</Badge>
                      )}
                    </TD>
                    <TD className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => setIsHistoryModalOpen(true)}
                          className="h-9 w-9 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600 flex items-center justify-center transition-all"
                          title="View History"
                        >
                          <History className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleAdjustStock(item)}
                          className="h-9 px-3 rounded-lg border border-slate-200 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 flex items-center gap-2 transition-all text-sm font-medium"
                          title="Adjust Stock"
                        >
                          <RefreshCw className="h-4 w-4" />
                          Adjust
                        </button>
                        <button className="h-9 w-9 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600 flex items-center justify-center transition-all">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </TD>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TBody>
          </Table>
        </div>

        {filteredInventory.length === 0 && (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-slate-100 text-slate-400 mb-4">
              <Search className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">No products found</h3>
            <p className="text-slate-500 mt-1">Try adjusting your search or filters to find what you're looking for.</p>
            <Button 
              variant="secondary" 
              className="mt-4"
              onClick={() => { setSearchTerm(''); setFilterStatus('All'); }}
            >
              Clear all filters
            </Button>
          </div>
        )}
      </Card>

      {/* Stock Adjustment Modal */}
      <Modal
        isOpen={isAdjustModalOpen}
        onClose={() => setIsAdjustModalOpen(false)}
        title="Adjust Stock Level"
      >
        <div className="space-y-6">
          {selectedProduct ? (
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="h-12 w-12 rounded-lg bg-white overflow-hidden border border-slate-200">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div>
                <p className="font-bold text-slate-900">{selectedProduct.name}</p>
                <p className="text-sm text-slate-500">SKU: {selectedProduct.sku} | Current: <span className="font-bold text-indigo-600">{selectedProduct.stock}</span></p>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Select Product</label>
              <select 
                className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white text-slate-900"
                onChange={(e) => {
                  const p = inventory.find(item => item.id === e.target.value);
                  if (p) setSelectedProduct(p);
                }}
                value={selectedProduct?.id || ''}
              >
                <option value="">Select a product to receive...</option>
                {inventory.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.flavour || 'No flavour'})</option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setAdjustmentType('add')}
              className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                adjustmentType === 'add'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'
              }`}
            >
              <PlusCircle className="h-6 w-6" />
              <span className="font-bold">Add Stock</span>
            </button>
            <button
              onClick={() => setAdjustmentType('remove')}
              className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                adjustmentType === 'remove'
                  ? 'border-rose-500 bg-rose-50 text-rose-700'
                  : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'
              }`}
            >
              <MinusCircle className="h-6 w-6" />
              <span className="font-bold">Remove Stock</span>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Adjustment Quantity</label>
              <div className="relative">
                <Input
                  type="number"
                  min="1"
                  value={adjustmentQty || ''}
                  onChange={(e) => setAdjustmentQty(parseInt(e.target.value) || 0)}
                  placeholder="Enter quantity..."
                  className="pl-10"
                />
                <Package className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Reason for Adjustment</label>
              <select 
                value={adjustmentReason}
                onChange={(e) => setAdjustmentReason(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white text-slate-900"
              >
                <option value="">Select a reason...</option>
                <option value="Restock">Restock / New Shipment</option>
                <option value="Return">Customer Return</option>
                <option value="Damage">Damaged Goods</option>
                <option value="Correction">Inventory Correction</option>
                <option value="Expiry">Expired Product</option>
                <option value="Lost">Lost / Theft</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              variant="secondary" 
              className="flex-1"
              onClick={() => setIsAdjustModalOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1"
              icon={<Save className="h-4 w-4" />}
              disabled={!adjustmentQty || !adjustmentReason}
              onClick={saveAdjustment}
            >
              Confirm Adjustment
            </Button>
          </div>
        </div>
      </Modal>

      {/* Stock History Modal */}
      <Modal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        title="Inventory Stock History"
      >
        <div className="space-y-4">
          <div className="max-h-[400px] overflow-y-auto pr-2 space-y-3 no-scrollbar">
            {stockHistory.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <History className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>No stock movement history found.</p>
              </div>
            ) : (
              stockHistory.map((movement) => (
                <div key={movement.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                      movement.type === 'add' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                    }`}>
                      {movement.type === 'add' ? <PlusCircle className="h-5 w-5" /> : <MinusCircle className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{movement.productName}</p>
                      <p className="text-xs text-slate-500">{movement.reason} • {new Date(movement.date).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className={`text-sm font-bold ${
                    movement.type === 'add' ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {movement.type === 'add' ? '+' : '-'}{movement.quantity}
                  </div>
                </div>
              ))
            )}
          </div>
          <Button 
            variant="secondary" 
            className="w-full"
            onClick={() => setIsHistoryModalOpen(false)}
          >
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
};

// Helper icons not in lucide-react main import
const PlusCircle = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
);

const MinusCircle = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/></svg>
);

export default InventoryPage;
