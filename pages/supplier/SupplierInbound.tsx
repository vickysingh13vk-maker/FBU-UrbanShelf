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
  { id: 'W1', name: 'London Central Hub', address: '123 Logistics Way, London, E1 4NS' },
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

const MONTHLY_STORAGE_RATE_PER_CBM = 18;
const OVERAGE_RATE_PER_CBM_PER_DAY = 0.85;
const DEFAULT_UNITS_PER_CARTON = 60;
const DEFAULT_CBM_PER_CARTON = 0.045;

const formatDate = (date: Date) => date.toISOString().split('T')[0];
const formatCbm = (value: number) => value.toFixed(value >= 10 ? 1 : 3).replace(/\.?0+$/, '');
const formatCurrency = (value: number) => `£${value.toFixed(2)}`;

const getDefaultEta = () => {
  const eta = new Date();
  eta.setDate(eta.getDate() + 5);
  return formatDate(eta);
};

const getUnitsPerCarton = (product: Product) => product.unitsPerCarton || product.units_per_carton || DEFAULT_UNITS_PER_CARTON;
const getCbmPerCarton = (product: Product) => product.cbmPerCarton || product.cbm_per_carton || DEFAULT_CBM_PER_CARTON;

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

  const selectedShipmentLines = useMemo(() => {
    return selectedProductIds
      .map(id => {
        const product = products.find(item => item.id === id);
        if (!product) return null;
        const cartons = quantities[id] || 0;
        const unitsPerCarton = getUnitsPerCarton(product);
        const cbmPerCarton = getCbmPerCarton(product);
        const totalCbm = cartons * cbmPerCarton;
        const monthlyStorage = totalCbm * MONTHLY_STORAGE_RATE_PER_CBM;

        return { product, cartons, unitsPerCarton, cbmPerCarton, totalCbm, monthlyStorage };
      })
      .filter((item): item is {
        product: Product;
        cartons: number;
        unitsPerCarton: number;
        cbmPerCarton: number;
        totalCbm: number;
        monthlyStorage: number;
      } => Boolean(item));
  }, [products, quantities, selectedProductIds]);

  const shipmentSpaceSummary = useMemo(() => {
    const totalCartons = selectedShipmentLines.reduce((sum, item) => sum + item.cartons, 0);
    const totalCbm = selectedShipmentLines.reduce((sum, item) => sum + item.totalCbm, 0);
    const monthlyStorage = selectedShipmentLines.reduce((sum, item) => sum + item.monthlyStorage, 0);

    return {
      totalSkus: selectedProductIds.length,
      totalCartons,
      totalCbm,
      monthlyStorage,
    };
  }, [selectedProductIds.length, selectedShipmentLines]);

  const buildShipmentData = (status?: string): Partial<SupplierShipment> | null => {
    const warehouse = WAREHOUSES.find(w => w.id === selectedWarehouseId);
    if (!warehouse) {
      setToast({ message: 'Please select a destination warehouse', type: 'error' });
      return null;
    }

    const cartonCounts = selectedProductIds.reduce<Record<string, number>>((acc, id) => {
      acc[id] = quantities[id] || 0;
      return acc;
    }, {});
    const existingShipment = editingShipmentId ? shipments.find(shipment => shipment.id === editingShipmentId) : null;

    return {
      warehouse: warehouse.name,
      carrier,
      trackingNumber,
      productsCount: selectedProductIds.length,
      totalUnits: shipmentSpaceSummary.totalCartons,
      eta: existingShipment?.eta || getDefaultEta(),
      productIds: selectedProductIds,
      quantities: cartonCounts,
      totalCbm: shipmentSpaceSummary.totalCbm,
      monthlyStorageEstimate: shipmentSpaceSummary.monthlyStorage,
      ...(status ? { status } : {})
    };
  };

  const handleConfirmShipment = () => {
    if (!carrier) {
      setToast({ message: 'Please select a carrier before confirming', type: 'error' });
      return;
    }

    const shipmentData = buildShipmentData(editingShipmentId ? undefined : 'IN_TRANSIT');
    if (!shipmentData) return;

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
    const shipmentQuantities = { ...(shipment.quantities || {}) };
    
    if (Object.keys(shipmentQuantities).length === 0) {
      productIds.forEach((id: string) => {
        const product = products.find(item => item.id === id);
        const estimatedUnits = shipment.productsCount > 0 ? Math.floor(shipment.totalUnits / productIds.length) : 0;
        shipmentQuantities[id] = Math.max(1, Math.ceil(estimatedUnits / (product ? getUnitsPerCarton(product) : DEFAULT_UNITS_PER_CARTON)));
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
    const shipmentData = buildShipmentData('DRAFT');
    if (!shipmentData) return;

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

  const calculateShipmentSpace = (shipment: SupplierShipment) => {
    if (shipment.productIds?.length) {
      return shipment.productIds.reduce((acc, id) => {
        const product = products.find(item => item.id === id);
        const cartons = shipment.quantities?.[id] || 0;
        const cbm = cartons * (product ? getCbmPerCarton(product) : DEFAULT_CBM_PER_CARTON);
        return {
          cartons: acc.cartons + cartons,
          cbm: acc.cbm + cbm,
          monthlyStorage: acc.monthlyStorage + (cbm * MONTHLY_STORAGE_RATE_PER_CBM),
        };
      }, { cartons: 0, cbm: 0, monthlyStorage: 0 });
    }

    const cartons = shipment.totalUnits || 0;
    const cbm = shipment.totalCbm || cartons * DEFAULT_CBM_PER_CARTON;
    return {
      cartons,
      cbm,
      monthlyStorage: shipment.monthlyStorageEstimate || cbm * MONTHLY_STORAGE_RATE_PER_CBM,
    };
  };

  const stats = useMemo(() => {
    const total = shipments.length;
    const inTransit = shipments.filter(s => s.status === 'IN_TRANSIT').length;
    const received = shipments.filter(s => ['RECEIVED', 'QC_DONE', 'PUTAWAY_DONE', 'CLOSED'].includes(s.status)).length;
    const draft = shipments.filter(s => s.status === 'DRAFT').length;

    let cartonsInTransit = 0;
    let cbmInTransit = 0;
    let totalReservedCbm = 0;
    let monthlyStorage = 0;

    shipments.forEach(s => {
      const space = calculateShipmentSpace(s);
      totalReservedCbm += space.cbm;
      monthlyStorage += space.monthlyStorage;

      if (s.status === 'IN_TRANSIT') {
        cartonsInTransit += space.cartons;
        cbmInTransit += space.cbm;
      }
    });

    return { total, inTransit, received, draft, cartonsInTransit, cbmInTransit, totalReservedCbm, monthlyStorage };
  }, [shipments, products]);

  const getShipmentLineItems = (shipment: SupplierShipment) => {
    if (shipment.productIds?.length) {
      return shipment.productIds
        .map(id => {
          const product = products.find(item => item.id === id);
          if (!product) return null;
          const sent = shipment.quantities?.[id] || 0;
          const received = ['RECEIVED', 'QC_DONE', 'PUTAWAY_DONE', 'CLOSED'].includes(shipment.status) ? sent : 0;
          return { ...product, quantity: sent, receivedQuantity: received };
        })
        .filter((item): item is Product & { quantity: number; receivedQuantity: number } => Boolean(item));
    }

    return products.slice(0, shipment.productsCount).map(product => {
      const sent = shipment.productsCount > 0 ? Math.floor(shipment.totalUnits / shipment.productsCount) : 0;
      const received = ['RECEIVED', 'QC_DONE', 'PUTAWAY_DONE', 'CLOSED'].includes(shipment.status) ? sent : 0;
      return { ...product, quantity: sent, receivedQuantity: received };
    });
  };



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
          <div className="py-4">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5 items-start">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Cartons & Space</h3>
                  <p className="text-sm text-slate-500 font-medium mt-1">
                    Enter cartons for each SKU. Warehouse space is calculated from carton volume in CBM.
                  </p>
                </div>

                <div className="space-y-3 max-h-[470px] overflow-y-auto pr-2">
                  {selectedShipmentLines.map(({ product, cartons, unitsPerCarton, cbmPerCarton, totalCbm }) => (
                    <div key={product.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                      <div className="grid grid-cols-1 xl:grid-cols-[1fr_190px] gap-4">
                        <div className="flex gap-3 min-w-0">
                          <img src={product.image} alt="" className="h-12 w-12 rounded-lg border border-slate-200 object-cover shrink-0" referrerPolicy="no-referrer" />
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 text-sm line-clamp-1">{product.name}</p>
                            <p className="text-xs text-slate-500 font-mono mt-0.5">SKU: {product.sku}</p>
                            <div className="flex flex-wrap gap-2 mt-3">
                              <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600 uppercase">
                                <Package className="h-3 w-3" />
                                {unitsPerCarton} units / carton
                              </span>
                              <span className="inline-flex items-center gap-1.5 rounded-md bg-cyan-50 px-2 py-1 text-[10px] font-bold text-cyan-700 uppercase">
                                <Warehouse className="h-3 w-3" />
                                {formatCbm(cbmPerCarton)} CBM / carton
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Cartons</label>
                          <Input
                            type="number"
                            min="1"
                            value={cartons || ''}
                            onChange={(e) => updateQuantity(product.id, parseInt(e.target.value))}
                            placeholder="0"
                            className="font-bold text-right"
                          />
                          <p className="text-[11px] font-semibold text-slate-500 text-right">
                            {cartons || 0} cartons x {formatCbm(cbmPerCarton)} CBM = <span className="text-slate-900">{formatCbm(totalCbm)} CBM</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-950 text-white rounded-xl border border-slate-900 p-5 sticky top-4 shadow-lg">
                <div className="flex items-center gap-2 mb-5">
                  <div className="h-8 w-8 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
                    <Warehouse className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black">Shipment Space Summary</h4>
                    <p className="text-[11px] text-slate-400 font-medium">Live CBM calculation</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-xs font-semibold text-slate-400">Products</span>
                    <span className="text-sm font-black">{shipmentSpaceSummary.totalSkus} SKUs</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-xs font-semibold text-slate-400">Cartons</span>
                    <span className="text-sm font-black">{shipmentSpaceSummary.totalCartons}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-xs font-semibold text-slate-400">Warehouse Space</span>
                    <span className="text-sm font-black text-cyan-300">{formatCbm(shipmentSpaceSummary.totalCbm)} CBM</span>
                  </div>
                  <div className="rounded-lg bg-white/5 border border-white/10 p-3">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estimated Monthly Storage</p>
                    <p className="text-2xl font-black text-white mt-1">{formatCurrency(shipmentSpaceSummary.monthlyStorage)}</p>
                    <p className="text-[11px] text-slate-400 mt-1">Based on {formatCurrency(MONTHLY_STORAGE_RATE_PER_CBM)} / CBM / month</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 4:
        const selectedWarehouse = WAREHOUSES.find(w => w.id === selectedWarehouseId);
        return (
          <div className="space-y-6 py-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Storage Summary</h3>
              <p className="text-sm text-slate-500 font-medium mt-1">
                Review the reserved warehouse space and monthly storage estimate before creating the inbound shipment.
              </p>
            </div>

            <div className="bg-slate-950 text-white rounded-xl p-6 border border-slate-900">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-6">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Destination Warehouse</p>
                  <p className="text-lg font-black">{selectedWarehouse?.name}</p>
                  <p className="text-xs text-slate-400 font-medium mt-1">{selectedWarehouse?.address}</p>
                  <div className="mt-5 pt-5 border-t border-white/10">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Carrier Details</p>
                    <p className="text-sm font-bold">{carrier || 'Not specified'}</p>
                    <p className="text-xs text-cyan-300 font-mono mt-1">{trackingNumber || 'No tracking number'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg bg-white/5 border border-white/10 p-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total SKUs</p>
                    <p className="text-2xl font-black mt-2">{shipmentSpaceSummary.totalSkus}</p>
                  </div>
                  <div className="rounded-lg bg-white/5 border border-white/10 p-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cartons</p>
                    <p className="text-2xl font-black mt-2">{shipmentSpaceSummary.totalCartons}</p>
                  </div>
                  <div className="rounded-lg bg-cyan-500/10 border border-cyan-400/20 p-4">
                    <p className="text-[10px] font-bold text-cyan-200 uppercase tracking-wider">Warehouse Space</p>
                    <p className="text-2xl font-black mt-2 text-cyan-200">{formatCbm(shipmentSpaceSummary.totalCbm)}</p>
                    <p className="text-[10px] text-cyan-200/70 font-bold uppercase">CBM</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Storage Breakdown</h4>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <Table>
                  <THead>
                    <TR className="bg-slate-50/50">
                      <TH className="text-[10px] font-bold text-slate-500 uppercase tracking-wider py-2">Product</TH>
                      <TH className="text-[10px] font-bold text-slate-500 uppercase tracking-wider py-2 text-center">Cartons</TH>
                      <TH className="text-[10px] font-bold text-slate-500 uppercase tracking-wider py-2 text-center">CBM / Carton</TH>
                      <TH className="text-[10px] font-bold text-slate-500 uppercase tracking-wider py-2 text-center">Total CBM</TH>
                      <TH className="text-[10px] font-bold text-slate-500 uppercase tracking-wider py-2 text-right">Monthly Storage</TH>
                    </TR>
                  </THead>
                  <TBody>
                    {selectedShipmentLines.map(({ product, cartons, cbmPerCarton, totalCbm, monthlyStorage }) => (
                      <TR key={product.id}>
                        <TD className="py-3">
                            <div className="flex items-center gap-2">
                            <img src={product.image} alt="" className="h-8 w-8 rounded bg-slate-100 object-cover border border-slate-200" referrerPolicy="no-referrer" />
                              <div>
                              <p className="text-xs font-bold text-slate-900 line-clamp-1">{product.name}</p>
                              <p className="text-[10px] text-slate-500 font-medium">SKU: {product.sku}</p>
                              </div>
                            </div>
                          </TD>
                        <TD className="text-center py-3 font-bold text-slate-700">{cartons}</TD>
                        <TD className="text-center py-3 font-bold text-slate-700">{formatCbm(cbmPerCarton)} CBM</TD>
                        <TD className="text-center py-3 font-black text-cyan-700">{formatCbm(totalCbm)} CBM</TD>
                        <TD className="text-right py-3">
                          <span className="text-xs font-black text-slate-900">{formatCurrency(monthlyStorage)}</span>
                          </TD>
                        </TR>
                    ))}
                  </TBody>
                </Table>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-cyan-100 bg-cyan-50 p-5">
                <p className="text-[10px] font-bold text-cyan-700 uppercase tracking-widest">Reserved Warehouse Space</p>
                <p className="text-3xl font-black text-cyan-900 mt-2">{formatCbm(shipmentSpaceSummary.totalCbm)} CBM</p>
                <p className="text-xs font-medium text-cyan-700 mt-1">{shipmentSpaceSummary.totalCartons} cartons across {shipmentSpaceSummary.totalSkus} SKUs</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Estimated Monthly Storage</p>
                <p className="text-3xl font-black text-slate-900 mt-2">{formatCurrency(shipmentSpaceSummary.monthlyStorage)}</p>
                <p className="text-xs font-medium text-slate-500 mt-1">{formatCurrency(MONTHLY_STORAGE_RATE_PER_CBM)} / CBM / month</p>
              </div>
            </div>

            <div className="rounded-xl border border-amber-100 bg-amber-50 p-5 flex gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-black text-amber-900 uppercase tracking-wider">Storage Policy</p>
                <p className="text-xs text-amber-800 leading-relaxed mt-1 font-medium">
                  Storage is billed monthly based on warehouse space usage in CBM. If inventory exceeds the reserved warehouse space,
                  additional storage will be charged daily based on CBM usage at {formatCurrency(OVERAGE_RATE_PER_CBM_PER_DAY)} / CBM / day.
                </p>
              </div>
            </div>


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
            <p className="text-slate-500 mt-1 font-medium">Plan cartons, reserve warehouse space, and estimate monthly storage by CBM.</p>
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
          title="Cartons In Transit"
          value={stats.cartonsInTransit.toLocaleString()}
          icon={Truck}
          color="blue"
          trend={{ value: '8%', isPositive: true }}
        />
        <KpiCard 
          title="Reserved Space"
          value={`${formatCbm(stats.totalReservedCbm)} CBM`}
          icon={Warehouse}
          color="emerald"
          trend={{ value: '15%', isPositive: true }}
        />
        <KpiCard 
          title="Monthly Storage"
          value={formatCurrency(stats.monthlyStorage)}
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
                <TH align="center">Space Reserved</TH>
                <TH>Created Date</TH>
                <TH align="right" className="pr-6">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {paginatedShipments.length > 0 ? paginatedShipments.map((shp) => {
                const shipmentSpace = calculateShipmentSpace(shp);
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
                          <span className="text-xs font-bold text-slate-900">{shipmentSpace.cartons} cartons</span>
                          <span className="text-[10px] font-bold text-cyan-600">{formatCbm(shipmentSpace.cbm)} CBM</span>
                        </div>
                        <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-500 bg-cyan-500"
                            style={{ width: `${Math.min((shipmentSpace.cbm / 5) * 100, 100)}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-400 font-semibold text-left">{formatCurrency(shipmentSpace.monthlyStorage)} / month</span>
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
        size="xl"
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

            {/* Storage Breakdown */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Storage Breakdown</h4>
                <Badge variant="primary" className="text-[10px]">
                  {selectedShipment.productsCount || 0} SKUs
                </Badge>
              </div>
              
              <div className="border border-slate-100 rounded-2xl overflow-hidden">
                <Table>
                  <THead>
                    <TR className="bg-slate-50/50">
                      <TH className="text-[10px] uppercase tracking-wider">Product / SKU</TH>
                      <TH className="text-[10px] uppercase tracking-wider text-center">Cartons</TH>
                      <TH className="text-[10px] uppercase tracking-wider text-center">CBM / Carton</TH>
                      <TH className="text-[10px] uppercase tracking-wider text-right">Total CBM</TH>
                    </TR>
                  </THead>
                  <TBody>
                    {getShipmentLineItems(selectedShipment).map((item, idx) => {
                      const cartons = item.quantity;
                      const cbmPerCarton = getCbmPerCarton(item);
                      const totalCbm = cartons * cbmPerCarton;
                      return (
                        <TR key={idx}>
                          <TD>
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-slate-900">{item.name}</span>
                              <span className="text-[10px] text-slate-400 font-mono">SKU-{item.sku || item.id.split('-')[1]}</span>
                            </div>
                          </TD>
                          <TD className="text-center font-bold text-slate-600">{cartons}</TD>
                          <TD className="text-center font-bold text-slate-600">{formatCbm(cbmPerCarton)} CBM</TD>
                          <TD className="text-right font-black text-cyan-700">{formatCbm(totalCbm)} CBM</TD>
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
        size="xl"
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
                    (currentStep === 3 && selectedProductIds.some(id => !quantities[id] || quantities[id] <= 0))
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
                  {['Warehouse', 'Products', 'Cartons & Space', 'Storage Summary'][step - 1]}
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
