import React, { useState, useMemo } from 'react';
import { 
  Card, Button, Badge, Table, THead, TBody, TR, TH, TD, 
  Input, Modal, Toast, Pagination, KpiCard, Drawer
} from '../../components/ui';
import {
  Plus, Search, Filter, MoreHorizontal, Calendar, Clock,
  ChevronRight, ChevronLeft, CheckCircle, Package, MapPin,
  Info, Truck, FileDown, Warehouse,
  Activity, ShieldCheck, Lock, X, BarChart3, Printer, AlertCircle
} from 'lucide-react';
import { useSupplier } from '../../context/SupplierContext';
import { SHIPMENT_STATUS_CONFIG } from '../../constants/supplierStatus';
import type { SupplierShipment, Product } from '../../types';

const WAREHOUSES = [
  { id: 'W1', name: 'London Hub', address: '123 Logistics Way, London, E1 4NS' },
  { id: 'W2', name: 'Manchester North', address: '45 Industrial Park, Manchester, M17 1BR' },
  { id: 'W3', name: 'Birmingham Logistics', address: '88 Distribution Rd, Birmingham, B11 2AL' },
];

const STATUS_CONFIG = SHIPMENT_STATUS_CONFIG;

const CARRIERS = [
  'DHL Express',
  'DPD',
  'UPS',
  'FedEx',
  'Royal Mail',
  'Palletways',
  'Other'
];

const SupplierInbound: React.FC = () => {
  const { shipments, products, addShipment, updateShipment, deleteShipment, isLoading } = useSupplier();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<SupplierShipment | null>(null);
  const [editingShipmentId, setEditingShipmentId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Form State
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string | null>(null);
  const [carrier, setCarrier] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const toggleProduct = (productId: string) => {
    setSelectedProductIds(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const updateQuantity = (productId: string, qty: number) => {
    setQuantities(prev => ({ ...prev, [productId]: isNaN(qty) ? 0 : Math.max(0, qty) }));
  };

  const handleConfirmShipment = () => {
    const warehouse = WAREHOUSES.find(w => w.id === selectedWarehouseId);
    if (!warehouse) {
      setToast({ message: 'Please select a destination warehouse', type: 'error' });
      return;
    }
    if (!carrier) {
      setToast({ message: 'Please select a carrier before confirming', type: 'error' });
      return;
    }

    const totalUnits = Object.values(quantities).reduce((a, b) => (a as number) + (b as number), 0);
    const productCount = selectedProductIds.length;

    const shipmentData = {
      warehouse: warehouse.name,
      carrier,
      trackingNumber,
      productsCount: productCount,
      totalUnits,
      eta: 'Apr 12, 2024', // Mock ETA
      status: editingShipmentId ? undefined : 'IN_TRANSIT' // Default to IN_TRANSIT on confirm
    };

    if (editingShipmentId) {
      updateShipment(editingShipmentId, shipmentData);
      setToast({ message: 'Shipment updated successfully', type: 'success' });
    } else {
      addShipment(shipmentData);
      setToast({ message: 'Shipment created successfully', type: 'success' });
    }

    setIsCreateModalOpen(false);
    resetForm();
  };

  const handleViewDetails = (shipment: SupplierShipment) => {
    setSelectedShipment(shipment);
    setIsDetailDrawerOpen(true);
  };

  const handleEditShipment = (shipment: SupplierShipment) => {
    const warehouse = WAREHOUSES.find(w => w.name === shipment.warehouse);
    setSelectedWarehouseId(warehouse?.id || null);
    setCarrier(shipment.carrier || '');
    setTrackingNumber(shipment.trackingNumber || '');
    
    // For mock data that doesn't have productIds/quantities, we'll pre-fill some
    const productIds = shipment.productIds || products.slice(0, shipment.productsCount || 1).map(p => p.id);
    const shipmentQuantities = shipment.quantities || {};
    
    if (Object.keys(shipmentQuantities).length === 0) {
      productIds.forEach((id: string) => {
        shipmentQuantities[id] = Math.floor(shipment.totalUnits / productIds.length);
      });
    }

    setSelectedProductIds(productIds);
    setQuantities(shipmentQuantities);
    setEditingShipmentId(shipment.id);
    setIsCreateModalOpen(true);
    setCurrentStep(1);
  };

  const handleDeleteShipment = (id: string) => {
    if (window.confirm('Are you sure you want to delete this shipment?')) {
      deleteShipment(id);
      setToast({ message: 'Shipment deleted successfully', type: 'success' });
    }
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    updateShipment(id, { status: newStatus });
    setToast({ message: `Shipment status updated to ${STATUS_CONFIG[newStatus].label}`, type: 'success' });
  };

  const handleSaveDraft = () => {
    const warehouse = WAREHOUSES.find(w => w.id === selectedWarehouseId);
    if (!warehouse) {
      setToast({ message: 'Please select a destination warehouse', type: 'error' });
      return;
    }

    const totalUnits = Object.values(quantities).reduce((a, b) => (a as number) + (b as number), 0);
    const productCount = selectedProductIds.length;

    const shipmentData = {
      warehouse: warehouse.name,
      carrier,
      trackingNumber,
      productsCount: productCount,
      totalUnits,
      eta: 'Apr 12, 2024',
      status: 'DRAFT'
    };

    if (editingShipmentId) {
      updateShipment(editingShipmentId, shipmentData);
      setToast({ message: 'Draft updated successfully', type: 'success' });
    } else {
      addShipment(shipmentData);
      setToast({ message: 'Draft saved successfully', type: 'success' });
    }

    setIsCreateModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setCurrentStep(1);
    setSelectedWarehouseId(null);
    setCarrier('');
    setTrackingNumber('');
    setSelectedProductIds([]);
    setQuantities({});
    setEditingShipmentId(null);
  };

  const filteredShipments = useMemo(() => {
    return shipments.filter(shp => {
      const matchesSearch = shp.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           shp.warehouse.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = !statusFilter || shp.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [shipments, searchQuery, statusFilter]);

  const paginatedShipments = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredShipments.slice(start, start + itemsPerPage);
  }, [filteredShipments, currentPage, itemsPerPage]);

  const stats = useMemo(() => {
    const total = shipments.length;
    const inTransit = shipments.filter(s => s.status === 'IN_TRANSIT').length;
    const received = shipments.filter(s => ['RECEIVED', 'QC_DONE', 'PUTAWAY_DONE', 'CLOSED'].includes(s.status)).length;
    const draft = shipments.filter(s => s.status === 'DRAFT').length;

    // Units calculations
    let unitsInTransit = 0;
    let unitsReceived = 0;
    let totalSentUnitsForReceived = 0;

    shipments.forEach(s => {
      const sentQty = s.totalUnits || 0;
      const receivedQty = s.receivedUnits || 0; // Assuming this field exists or we calculate it

      if (s.status === 'IN_TRANSIT') {
        unitsInTransit += sentQty;
      }
      if (['RECEIVED', 'QC_DONE', 'PUTAWAY_DONE', 'CLOSED'].includes(s.status)) {
        unitsReceived += receivedQty || sentQty; // Fallback to sentQty for mock
        totalSentUnitsForReceived += sentQty;
      }
    });

    const accuracy = totalSentUnitsForReceived > 0 
      ? Math.round((unitsReceived / totalSentUnitsForReceived) * 100) 
      : 100;

    return { total, inTransit, received, draft, unitsInTransit, unitsReceived, accuracy };
  }, [shipments]);



  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Select Warehouse</h3>
              <p className="text-sm text-slate-500 font-medium">Choose the destination warehouse for this shipment.</p>
              <div className="grid grid-cols-1 gap-3">
                {WAREHOUSES.map(w => (
                  <div 
                    key={w.id}
                    onClick={() => setSelectedWarehouseId(w.id)}
                    className={`p-4 border rounded-xl cursor-pointer transition-all ${
                      selectedWarehouseId === w.id 
                        ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600' 
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${selectedWarehouseId === w.id ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                          <MapPin className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{w.name}</p>
                          <p className="text-xs text-slate-500 font-medium">{w.address}</p>
                        </div>
                      </div>
                      {selectedWarehouseId === w.id && <CheckCircle className="h-5 w-5 text-indigo-600" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Carrier Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Carrier</label>
                  <select 
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    value={carrier}
                    onChange={(e) => setCarrier(e.target.value)}
                  >
                    <option value="">Select Carrier</option>
                    {CARRIERS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tracking Number</label>
                  <Input 
                    placeholder="e.g. 1Z999AA10123456784"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4 py-4">
            <h3 className="text-sm font-bold text-slate-900">Select Products</h3>
            <p className="text-sm text-slate-500 font-medium">Select the products you are sending in this shipment.</p>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
              {products.map(p => (
                <div 
                  key={p.id}
                  onClick={() => toggleProduct(p.id)}
                  className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-all ${
                    selectedProductIds.includes(p.id)
                      ? 'border-indigo-600 bg-indigo-50/50'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt="" className="h-10 w-10 rounded-lg border border-slate-200 object-cover" referrerPolicy="no-referrer" />
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{p.name}</p>
                      <p className="text-xs text-slate-500 font-mono">SKU: {p.sku}</p>
                    </div>
                  </div>
                  {selectedProductIds.includes(p.id) && <CheckCircle className="h-5 w-5 text-indigo-600" />}
                </div>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4 py-4">
            <h3 className="text-sm font-bold text-slate-900">Set Quantities</h3>
            <p className="text-sm text-slate-500 font-medium">Specify the number of units for each product.</p>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {selectedProductIds.map(id => {
                const p = products.find(item => item.id === id)!;
                return (
                  <div key={id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt="" className="h-10 w-10 rounded-lg border border-slate-200 object-cover" referrerPolicy="no-referrer" />
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{p.name}</p>
                        <p className="text-xs text-slate-500 font-mono">SKU: {p.sku}</p>
                      </div>
                    </div>
                    <div className="w-32">
                      <Input 
                        type="number" 
                        min="1"
                        value={quantities[id] || ''} 
                        onChange={(e) => updateQuantity(id, parseInt(e.target.value))}
                        placeholder="Qty"
                        className="font-bold"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      case 4:
        const selectedWarehouse = WAREHOUSES.find(w => w.id === selectedWarehouseId);
        const totalUnits = Object.values(quantities).reduce((a, b) => (a as number) + (b as number), 0);
        return (
          <div className="space-y-6 py-4">
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Destination</p>
                    <p className="text-sm font-bold text-slate-900">{selectedWarehouse?.name}</p>
                    <p className="text-xs text-slate-500 font-medium">{selectedWarehouse?.address}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Carrier Details</p>
                    <p className="text-sm font-bold text-slate-900">{carrier || 'Not specified'}</p>
                    <p className="text-xs text-slate-500 font-medium font-mono">{trackingNumber || 'No tracking number'}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Shipment Summary</p>
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-2xl font-black text-slate-900">{selectedProductIds.length}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">SKUs</p>
                      </div>
                      <div className="h-8 w-px bg-slate-200" />
                      <div>
                        <p className="text-2xl font-black text-slate-900">{totalUnits}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Total Units</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Estimated Arrival</p>
                    <div className="flex items-center gap-2 text-sm font-bold text-indigo-600">
                      <Calendar className="h-4 w-4" />
                      <span>Apr 12, 2024</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Inventory Breakdown</h4>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <Table>
                  <THead>
                    <TR className="bg-slate-50/50">
                      <TH className="text-[10px] font-bold text-slate-500 uppercase tracking-wider py-2">Product</TH>
                      <TH className="text-[10px] font-bold text-slate-500 uppercase tracking-wider py-2 text-right">Quantity</TH>
                    </TR>
                  </THead>
                  <TBody>
                    {selectedProductIds.map(id => {
                      const product = products.find(p => p.id === id);
                      return (
                        <TR key={id}>
                          <TD className="py-2">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                                IMG
                              </div>
                              <div>
                                <p className="text-xs font-bold text-slate-900 line-clamp-1">{product?.name}</p>
                                <p className="text-[10px] text-slate-500 font-medium">SKU: {product?.sku}</p>
                              </div>
                            </div>
                          </TD>
                          <TD className="text-right py-2">
                            <span className="text-xs font-black text-slate-900">{quantities[id]}</span>
                          </TD>
                        </TR>
                      );
                    })}
                  </TBody>
                </Table>
              </div>
            </div>

            {/* Storage Estimate */}
            {(() => {
              const STORAGE_RATE_PER_CARTON_PER_DAY = 0.5;
              const calculateStorage = (cartons: number, days: number) => cartons * STORAGE_RATE_PER_CARTON_PER_DAY * days;

              const storageItems = selectedProductIds.map(id => {
                const product = products.find(p => p.id === id)!;
                const unitQty = quantities[id] || 0;
                const upc = product.unitsPerCarton || 60;
                const cartons = Math.ceil(unitQty / upc);
                return {
                  product,
                  unitsPerCarton: upc,
                  cartons,
                  weekEstimate: calculateStorage(cartons, 7),
                  twoWeekEstimate: calculateStorage(cartons, 14),
                };
              });
              const totalWeek = storageItems.reduce((sum, item) => sum + item.weekEstimate, 0);
              const totalTwoWeek = storageItems.reduce((sum, item) => sum + item.twoWeekEstimate, 0);
              const totalCartons = storageItems.reduce((sum, item) => sum + item.cartons, 0);

              return (
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  {/* Header */}
                  <div className="flex items-center justify-between px-6 py-3.5 bg-gradient-to-r from-indigo-50 to-violet-50 border-b border-indigo-100">
                    <div className="flex items-center gap-2.5">
                      <div className="h-7 w-7 rounded-lg bg-indigo-600 flex items-center justify-center">
                        <Warehouse className="h-3.5 w-3.5 text-white" />
                      </div>
                      <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-widest">Storage Estimate</h4>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/80 rounded-full border border-indigo-100">
                      <Package className="h-3 w-3 text-indigo-500" />
                      <span className="text-[10px] font-bold text-indigo-600">{totalCartons} carton{totalCartons !== 1 ? 's' : ''}</span>
                    </div>
                  </div>

                  <div className="px-6 py-5 space-y-5">
                    {/* Line Items Table */}
                    <div className="border border-slate-200/80 rounded-xl overflow-hidden">
                      <Table>
                        <THead>
                          <TR className="bg-slate-50">
                            <TH className="text-[10px] font-bold text-slate-500 uppercase tracking-wider py-2.5 pl-4">Product</TH>
                            <TH className="text-[10px] font-bold text-slate-500 uppercase tracking-wider py-2.5 text-center">Carton Config</TH>
                            <TH className="text-[10px] font-bold text-slate-500 uppercase tracking-wider py-2.5 text-center">Cartons</TH>
                            <TH className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider py-2.5 text-right pr-4">Estimated Storage</TH>
                          </TR>
                        </THead>
                        <TBody>
                          {storageItems.map(({ product, unitsPerCarton, cartons, weekEstimate, twoWeekEstimate }) => (
                            <TR key={product.id} className="border-t border-slate-100 hover:bg-slate-50/50 transition-colors">
                              <TD className="py-3 pl-4">
                                <p className="text-xs font-bold text-slate-900 line-clamp-1">{product.name}</p>
                                <p className="text-[10px] text-slate-400 font-mono mt-0.5">SKU: {product.sku}</p>
                              </TD>
                              <TD className="text-center py-3">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 rounded-md text-[10px] font-semibold text-slate-600">
                                  <Package className="h-2.5 w-2.5" />
                                  {unitsPerCarton} units/carton
                                </span>
                              </TD>
                              <TD className="text-center py-3">
                                <span className="inline-flex items-center justify-center h-6 w-8 bg-indigo-50 rounded-md text-xs font-black text-indigo-700">{cartons}</span>
                              </TD>
                              <TD className="text-right py-3 pr-4">
                                <div className="flex flex-col items-end gap-1">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[9px] font-medium text-slate-400 uppercase">1 wk</span>
                                    <span className="text-xs font-bold text-indigo-600">£{weekEstimate.toFixed(2)}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[9px] font-medium text-slate-400 uppercase">2 wk</span>
                                    <span className="text-xs font-bold text-violet-600">£{twoWeekEstimate.toFixed(2)}</span>
                                  </div>
                                </div>
                              </TD>
                            </TR>
                          ))}
                        </TBody>
                      </Table>
                    </div>

                    {/* Totals */}
                    <div className="bg-gradient-to-r from-slate-50 to-indigo-50/30 rounded-xl border border-slate-200/80 p-4 space-y-3">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Estimated Storage Totals</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                          <span className="text-xs font-semibold text-slate-600">Estimated Storage (1 Week)</span>
                        </div>
                        <span className="text-base font-black text-indigo-600">£{totalWeek.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-violet-500"></div>
                          <span className="text-xs font-semibold text-slate-600">Estimated Storage (2 Weeks)</span>
                        </div>
                        <span className="text-base font-black text-violet-600">£{totalTwoWeek.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Helper Note */}
                    <div className="flex items-start gap-2 px-3 py-2.5 bg-slate-50 rounded-lg border border-slate-100">
                      <Info className="h-3.5 w-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                      <p className="text-[10px] text-slate-500 leading-relaxed">
                        Storage estimates are calculated using £0.50 per carton per day. Final charges may vary based on actual storage duration.
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}

            <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
              <Info className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800 leading-relaxed font-medium">
                By creating this shipment, you agree to follow our packaging and labeling guidelines.
                Incorrectly labeled items may be rejected at the warehouse.
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Inbound Shipments</h1>
            <p className="text-slate-500 mt-1 font-medium">Track and manage your shipments to FBU warehouses.</p>
          </div>
          <Button 
            variant="primary" 
            icon={<Plus className="h-4 w-4" />}
            onClick={() => {
              setIsCreateModalOpen(true);
              setCurrentStep(1);
            }}
          >
            Create Shipment
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-5">
        <KpiCard 
          title="Total Shipments"
          value={stats.total}
          icon={Package}
          color="indigo"
          trend={{ value: '12%', isPositive: true }}
        />
        <KpiCard 
          title="Units In Transit"
          value={stats.unitsInTransit.toLocaleString()}
          icon={Truck}
          color="blue"
          trend={{ value: '8%', isPositive: true }}
        />
        <KpiCard 
          title="Units Received"
          value={stats.unitsReceived.toLocaleString()}
          icon={CheckCircle}
          color="emerald"
          trend={{ value: '15%', isPositive: true }}
        />
        <KpiCard 
          title="Receiving Accuracy"
          value={`${stats.accuracy}%`}
          icon={BarChart3}
          color="amber"
          trend={{ value: '0.2%', isPositive: true }}
        />
      </div>

      {/* Filters Section */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              className="pl-10" 
              placeholder="Search by Shipment ID or Warehouse..." 
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
              {Object.keys(STATUS_CONFIG).map(status => (
                <option key={status} value={status}>{STATUS_CONFIG[status].label}</option>
              ))}
            </select>
            <Button variant="secondary" icon={<Calendar className="h-4 w-4" />}>Date Range</Button>
            <Button variant="secondary" icon={<Filter className="h-4 w-4" />}>More Filters</Button>
          </div>
        </div>
      </Card>

      <Card padding="none">
        <div className="overflow-x-auto">
          <Table>
            <THead>
              <TR>
                <TH className="pl-6">Shipment ID</TH>
                <TH>Warehouse</TH>
                <TH>Carrier / Tracking</TH>
                <TH>Status</TH>
                <TH align="center">Units (Rec/Sent)</TH>
                <TH>Created Date</TH>
                <TH align="right" className="pr-6">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {paginatedShipments.length > 0 ? paginatedShipments.map((shp) => {
                const totalSent = shp.totalUnits || 0;
                const totalReceived = shp.receivedUnits || 0;
                const status = STATUS_CONFIG[shp.status] || { label: shp.status, variant: 'neutral', icon: Info };

                return (
                  <TR key={shp.id} className="group hover:bg-slate-50/50 transition-colors">
                    <TD className="pl-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{shp.id}</span>
                        <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">FBU-IN-{shp.id.split('-')[1]}</span>
                      </div>
                    </TD>
                    <TD>
                      <div className="flex items-center gap-2">
                        <Warehouse className="h-3.5 w-3.5 text-slate-400" />
                        <span className="text-slate-600 font-bold">{shp.warehouse}</span>
                      </div>
                    </TD>
                    <TD>
                      <div className="flex flex-col">
                        <span className="text-slate-700 font-medium">{shp.carrier || 'Not Assigned'}</span>
                        <span className="text-[10px] text-indigo-500 font-bold tracking-wider">{shp.trackingNumber || '---'}</span>
                      </div>
                    </TD>
                    <TD>
                      <Badge variant={status.variant} className="flex items-center gap-1.5 w-fit py-1 px-2.5">
                        <status.icon className="h-3 w-3" />
                        {status.label}
                      </Badge>
                    </TD>
                    <TD align="center">
                      <div className="flex flex-col gap-1 min-w-[100px]">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">{totalReceived} / {totalSent}</span>
                          <span className="text-[10px] font-bold text-slate-400">{totalSent > 0 ? Math.round((totalReceived/totalSent)*100) : 0}%</span>
                        </div>
                        <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              totalReceived === totalSent ? 'bg-emerald-500' : 
                              totalReceived > 0 ? 'bg-amber-500' : 'bg-slate-300'
                            }`}
                            style={{ width: `${totalSent > 0 ? Math.min((totalReceived / totalSent) * 100, 100) : 0}%` }}
                          />
                        </div>
                      </div>
                    </TD>
                    <TD>
                      <div className="flex items-center gap-2 text-slate-500">
                        <Calendar className="h-3.5 w-3.5" />
                        <span className="text-xs font-medium">{shp.createdDate}</span>
                      </div>
                    </TD>
                    <TD align="right" className="pr-6">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleViewDetails(shp)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Info className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleEditShipment(shp)}
                          className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Edit Shipment"
                        >
                          <Truck className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </TD>
                  </TR>
                );
              }) : (
                <TR>
                  <TD colSpan={7} align="center" className="py-12">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <Truck className="h-12 w-12 opacity-20" />
                      <p className="text-lg font-bold">No shipments found</p>
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
          totalItems={filteredShipments.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
          entityName="shipments"
        />
      </Card>

      {/* SHIPMENT DETAIL DRAWER */}
      <Drawer
        isOpen={isDetailDrawerOpen}
        onClose={() => setIsDetailDrawerOpen(false)}
        title={`Shipment Details: ${selectedShipment?.id}`}
        size="lg"
        footer={
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <FileDown className="h-4 w-4" />
                Packing List
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Printer className="h-4 w-4" />
                Labels
              </Button>
            </div>
            <Button variant="primary" onClick={() => setIsDetailDrawerOpen(false)}>Close</Button>
          </div>
        }
      >
        {selectedShipment && (
          <div className="space-y-5">
            {/* Status Stepper */}
            <div className="relative">
              <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-100 -z-10" />
              <div className="flex justify-between">
                {[
                  { label: 'Draft', status: 'DRAFT', icon: Clock },
                  { label: 'In Transit', status: 'IN_TRANSIT', icon: Truck },
                  { label: 'Arrived', status: 'ARRIVED', icon: Warehouse },
                  { label: 'Receiving', status: 'RECEIVING', icon: Activity },
                  { label: 'Completed', status: 'CLOSED', icon: CheckCircle },
                ].map((step, idx) => {
                  const isActive = selectedShipment.status === step.status;
                  const isCompleted = ['RECEIVED', 'QC_DONE', 'PUTAWAY_DONE', 'CLOSED'].includes(selectedShipment.status) || 
                                     (idx === 0 && selectedShipment.status !== 'DRAFT') ||
                                     (idx === 1 && !['DRAFT', 'IN_TRANSIT'].includes(selectedShipment.status));
                  
                  return (
                    <div key={idx} className="flex flex-col items-center gap-2 bg-white px-2">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                        isActive ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100 scale-110' :
                        isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' :
                        'bg-white border-slate-200 text-slate-400'
                      }`}>
                        <step.icon className="h-5 w-5" />
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${
                        isActive ? 'text-indigo-600' : isCompleted ? 'text-emerald-600' : 'text-slate-400'
                      }`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Shipment Info Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">Shipment Info</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Warehouse</p>
                    <p className="text-sm font-bold text-slate-900">{selectedShipment.warehouse}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Status</p>
                    <Badge variant={STATUS_CONFIG[selectedShipment.status]?.variant || 'neutral'}>
                      {STATUS_CONFIG[selectedShipment.status]?.label || selectedShipment.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Carrier</p>
                    <p className="text-sm font-bold text-slate-900">{selectedShipment.carrier || 'Pending'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Tracking #</p>
                    <p className="text-sm font-bold text-indigo-600 font-mono">{selectedShipment.trackingNumber || '---'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">Timeline</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Created</p>
                    <p className="text-sm font-bold text-slate-900">{selectedShipment.createdDate || '2024-03-20'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">ETA</p>
                    <p className="text-sm font-bold text-slate-900">{selectedShipment.eta || '2024-03-25'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Received Date</p>
                    <p className="text-sm font-bold text-slate-900">{selectedShipment.receivedDate || '---'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Inventory Breakdown */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Inventory Breakdown</h4>
                <Badge variant="primary" className="text-[10px]">
                  {selectedShipment.productsCount || 0} SKUs
                </Badge>
              </div>
              
              <div className="border border-slate-100 rounded-2xl overflow-hidden">
                <Table>
                  <THead>
                    <TR className="bg-slate-50/50">
                      <TH className="text-[10px] uppercase tracking-wider">Product / SKU</TH>
                      <TH className="text-[10px] uppercase tracking-wider text-center">Sent</TH>
                      <TH className="text-[10px] uppercase tracking-wider text-center">Received</TH>
                      <TH className="text-[10px] uppercase tracking-wider text-right">Accuracy</TH>
                    </TR>
                  </THead>
                  <TBody>
                    {/* Mocking breakdown if not available */}
                    {((selectedShipment as SupplierShipment & { items?: Product[] }).items || products.slice(0, selectedShipment.productsCount)).map((item: Product & { quantity?: number; receivedQuantity?: number }, idx: number) => {
                      const sent = item.quantity || Math.floor(selectedShipment.totalUnits / selectedShipment.productsCount);
                      const received = item.receivedQuantity || (['RECEIVED', 'QC_DONE', 'PUTAWAY_DONE', 'CLOSED'].includes(selectedShipment.status) ? sent : 0);
                      const accuracy = sent > 0 ? Math.round((received / sent) * 100) : 0;
                      return (
                        <TR key={idx}>
                          <TD>
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-slate-900">{item.name}</span>
                              <span className="text-[10px] text-slate-400 font-mono">SKU-{item.sku || item.id.split('-')[1]}</span>
                            </div>
                          </TD>
                          <TD className="text-center font-bold text-slate-600">{sent}</TD>
                          <TD className="text-center font-bold text-indigo-600">{received}</TD>
                          <TD className="text-right">
                            <span className={`text-xs font-bold ${
                              accuracy === 100 ? 'text-emerald-600' : 
                              accuracy > 0 ? 'text-amber-600' : 'text-slate-400'
                            }`}>
                              {accuracy}%
                            </span>
                          </TD>
                        </TR>
                      );
                    })}
                  </TBody>
                </Table>
              </div>
            </div>

            {/* Operational Notes */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 flex gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-amber-900 mb-1">Warehouse Notes</p>
                <p className="text-xs text-amber-700 leading-relaxed">
                  {selectedShipment.status === 'ARRIVED' 
                    ? 'Shipment has arrived at the loading dock. Receiving process will begin shortly.'
                    : selectedShipment.status === 'RECEIVING'
                    ? 'Warehouse team is currently scanning items. Real-time updates will appear in the breakdown above.'
                    : 'No operational alerts for this shipment.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* Create Shipment Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          resetForm();
        }}
        title={editingShipmentId ? "Edit Inbound Shipment" : "Create Inbound Shipment"}
        size="lg"
        footer={
          <div className="flex justify-between w-full">
            <Button 
              variant="secondary" 
              onClick={handleBack}
              disabled={currentStep === 1}
              icon={<ChevronLeft className="h-4 w-4" />}
            >
              Back
            </Button>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => {
                setIsCreateModalOpen(false);
                resetForm();
              }}>Cancel</Button>
              {currentStep < 4 ? (
                <Button 
                  variant="primary" 
                  onClick={handleNext}
                  disabled={
                    (currentStep === 1 && !selectedWarehouseId) ||
                    (currentStep === 2 && selectedProductIds.length === 0) ||
                    (currentStep === 3 && selectedProductIds.some(id => !quantities[id]))
                  }
                >
                  Next Step <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <>
                  <Button 
                    variant="secondary" 
                    onClick={handleSaveDraft}
                    isLoading={isLoading}
                  >
                    Save as Draft
                  </Button>
                  <Button 
                    variant="primary" 
                    onClick={handleConfirmShipment}
                    isLoading={isLoading}
                  >
                    {editingShipmentId ? 'Update Shipment' : 'Confirm Shipment'}
                  </Button>
                </>
              )}
            </div>
          </div>
        }
      >
        <div className="space-y-5">
          {/* Stepper UI */}
          <div className="flex items-center justify-between relative px-4">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 -z-10"></div>
            <div 
              className="absolute top-1/2 left-0 h-0.5 bg-indigo-600 -translate-y-1/2 -z-10 transition-all duration-500"
              style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
            ></div>
            
            {[1, 2, 3, 4].map(step => (
              <div key={step} className="flex flex-col items-center gap-2 bg-white px-2">
                <div className={`
                  h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
                  ${currentStep >= step ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-400'}
                `}>
                  {currentStep > step ? <CheckCircle className="h-5 w-5" /> : step}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${currentStep >= step ? 'text-indigo-600' : 'text-slate-400'}`}>
                  {['Warehouse', 'Products', 'Quantities', 'Review'][step - 1]}
                </span>
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="min-h-[300px]">
            {renderStepContent()}
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

export default SupplierInbound;
