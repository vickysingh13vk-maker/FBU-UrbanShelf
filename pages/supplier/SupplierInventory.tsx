import React, { useState, useMemo } from 'react';
import {
  Warehouse, Package,
  FileDown, Info,
  Eye, History, Edit3,
} from 'lucide-react';
import {
  Card, Button, Badge, Table, THead, TBody, TR, TH, TD,
  Pagination, Toast
} from '../../components/ui';
import { useSupplier } from '../../context/SupplierContext';
import { getStockStatus } from '../../constants/supplierStatus';
import { EnrichedInventoryItem } from '../../types';
import InventoryKPICards from '../../components/supplier/InventoryKPICards';
import InventoryFilters from '../../components/supplier/InventoryFilters';
import StockUpdateModal from '../../components/supplier/StockUpdateModal';

const SupplierInventory: React.FC = () => {
  const { inventory, products, updateInventory, isLoading } = useSupplier();
  
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  // Modal State
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<EnrichedInventoryItem | null>(null);

  // Enrich inventory data with missing fields from products or defaults
  const enrichedInventory = useMemo(() => {
    return inventory.map(item => {
      const product = products.find(p => p.sku === item.sku || p.name === item.product);
      const unitPrice = product?.price || 5.99;
      const dailySales = item.dailySales || 0;
      const totalStock = item.available + (item.reserved || 0);
      const sellThroughRate = totalStock > 0 && dailySales > 0 ? ((dailySales / totalStock) * 100) : 0;
      const daysOfInventoryLeft = dailySales > 0 ? Math.floor(item.available / dailySales) : 999;
      const today = new Date();
      const stockOutDate = dailySales > 0 ? new Date(today.getTime() + daysOfInventoryLeft * 86400000) : null;
      const recommendedProductionQty = Math.max(0, ((item.reorderLevel || 0) * 2) - item.available - (item.incoming || 0));
      return {
        ...item,
        category: product?.category || 'Uncategorized',
        image: product?.image || `https://picsum.photos/seed/${item.sku}/40/40`,
        unitPrice,
        incoming: item.incoming || Math.floor(Math.random() * 500),
        inventoryValue: (item.available * unitPrice),
        damaged: item.damaged || 0,
        sellThroughRate: sellThroughRate.toFixed(1),
        daysOfInventoryLeft,
        estimatedStockOutDate: stockOutDate ? stockOutDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A',
        recommendedProductionQty
      };
    });
  }, [inventory, products]);


  const filteredInventory = useMemo(() => {
    return enrichedInventory.filter(item => {
      const matchesSearch = item.product.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesWarehouse = !warehouseFilter || item.warehouse === warehouseFilter;
      const matchesCategory = !categoryFilter || item.category === categoryFilter;
      
      const status = getStockStatus(item.available);
      const matchesStatus = !statusFilter || status.label === statusFilter;
      
      return matchesSearch && matchesWarehouse && matchesCategory && matchesStatus;
    });
  }, [enrichedInventory, searchQuery, warehouseFilter, categoryFilter, statusFilter]);

  const stats = useMemo(() => {
    const totalProducts = new Set(filteredInventory.map(i => i.sku)).size;
    const totalUnits = filteredInventory.reduce((acc, i) => acc + i.available, 0);
    const lowStock = filteredInventory.filter(i => i.available > 0 && i.available < 20).length;
    const outOfStock = filteredInventory.filter(i => i.available === 0).length;
    const totalValue = filteredInventory.reduce((acc, i) => acc + i.inventoryValue, 0);
    
    return { totalProducts, totalUnits, lowStock, outOfStock, totalValue };
  }, [filteredInventory]);

  const paginatedInventory = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredInventory.slice(start, start + itemsPerPage);
  }, [filteredInventory, currentPage, itemsPerPage]);

  const warehouses = Array.from(new Set(enrichedInventory.map(item => item.warehouse)));
  const categories = Array.from(new Set(enrichedInventory.map(item => item.category)));

  const handleUpdateStock = (id: string, adjustment: any) => {
    updateInventory(id, adjustment);
    setToast({ message: 'Stock level updated successfully', type: 'success' });
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Inventory</h1>
            <p className="text-slate-500 mt-1 font-medium">Monitor your product stock stored in FBU warehouses.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" icon={<FileDown className="h-4 w-4" />}>
              Export Inventory
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <InventoryKPICards stats={stats} />

      {/* Filters Section */}
      <InventoryFilters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        warehouseFilter={warehouseFilter}
        setWarehouseFilter={setWarehouseFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        warehouses={warehouses}
        categories={categories}
      />

      {/* Inventory Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <Table>
            <THead>
              <TR>
                <TH className="pl-6">Product</TH>
                <TH>SKU</TH>
                <TH>Category</TH>
                <TH>Warehouse</TH>
                <TH align="center">Available</TH>
                <TH align="center">Reserved</TH>
                <TH align="center">Incoming</TH>
                <TH>Unit Price</TH>
                <TH>Value</TH>
                <TH align="center">Damaged</TH>
                <TH>Sell-through</TH>
                <TH>Days Left</TH>
                <TH>Est. Stock-Out</TH>
                <TH>Status</TH>
                <TH align="right" className="pr-6">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {paginatedInventory.length > 0 ? paginatedInventory.map((item) => {
                const status = getStockStatus(item.available);
                return (
                  <TR key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                    <TD className="pl-6">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt="" className="h-10 w-10 rounded border border-slate-200 object-cover" referrerPolicy="no-referrer" />
                        <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{item.product}</span>
                      </div>
                    </TD>
                    <TD className="text-xs font-mono font-bold text-slate-500">{item.sku}</TD>
                    <TD className="text-slate-600 font-medium">{item.category}</TD>
                    <TD>
                      <div className="flex items-center gap-2">
                        <Warehouse className="h-3.5 w-3.5 text-slate-400" />
                        <span className="text-slate-600 font-medium">{item.warehouse}</span>
                      </div>
                    </TD>
                    <TD align="center">
                      <span className={`text-sm font-black ${item.available < 20 ? 'text-rose-600' : 'text-indigo-600'}`}>
                        {item.available.toLocaleString()}
                      </span>
                    </TD>
                    <TD align="center" className="text-slate-500 font-bold">{item.reserved.toLocaleString()}</TD>
                    <TD align="center" className="text-indigo-400 font-bold">{item.incoming.toLocaleString()}</TD>
                    <TD className="font-bold text-slate-900">£{item.unitPrice.toFixed(2)}</TD>
                    <TD className="font-black text-slate-900">£{item.inventoryValue.toLocaleString()}</TD>
                    <TD align="center">
                      <span className={`font-bold ${item.damaged > 0 ? 'text-rose-600' : 'text-slate-400'}`}>{item.damaged}</span>
                    </TD>
                    <TD className="font-bold text-slate-600">{item.sellThroughRate}%</TD>
                    <TD>
                      <span className={`font-bold ${item.daysOfInventoryLeft < 7 ? 'text-rose-600' : item.daysOfInventoryLeft < 14 ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {item.daysOfInventoryLeft === 999 ? '-' : `${item.daysOfInventoryLeft}d`}
                      </span>
                    </TD>
                    <TD className="text-sm text-slate-600 font-medium">{item.estimatedStockOutDate}</TD>
                    <TD>
                      <Badge variant={status.variant} className="gap-1.5 py-1 pr-2 pl-1.5 font-bold">
                        <status.icon className="h-3 w-3" />
                        {status.label}
                      </Badge>
                    </TD>
                    <TD align="right" className="pr-6">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                          title="View Product"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                          title="Stock Details"
                        >
                          <Info className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-slate-400 hover:text-amber-600 hover:bg-amber-50"
                          title="Update Stock"
                          onClick={() => {
                            setSelectedItem(item);
                            setIsUpdateModalOpen(true);
                          }}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                          title="Stock History"
                        >
                          <History className="h-4 w-4" />
                        </Button>
                      </div>
                    </TD>
                  </TR>
                );
              }) : (
                <TR>
                  <TD colSpan={15} align="center" className="py-12">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <Package className="h-12 w-12 opacity-20" />
                      <p className="text-lg font-bold">No inventory records found</p>
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
          totalItems={filteredInventory.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
          entityName="inventory items"
        />
      </Card>

      {/* Modals */}
      <StockUpdateModal 
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        item={selectedItem}
        onUpdate={handleUpdateStock}
      />

      {/* Toast */}
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

export default SupplierInventory;
