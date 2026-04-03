import React, { useState, useMemo } from 'react';
import {
  Search, Plus, Pencil, Trash2, Megaphone, TrendingUp,
  Receipt, BarChart3, Tag, CalendarDays, Percent
} from 'lucide-react';
import {
  Card, Button, Badge, Table, THead, TBody, TR, TH, TD,
  Input, Pagination, Modal, Toast
} from '../../components/ui';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis
} from 'recharts';
import { useSupplier } from '../../context/SupplierContext';
import { StandardGrid, StandardTooltip, CHART_COLORS, AXIS_TICK_STYLE, formatCurrency } from '../../utils/chartHelpers';
import { PROMOTION_STATUS_CONFIG } from '../../constants/supplierStatus';
import type { Promotion } from '../../types';

const SupplierPromotions: React.FC = () => {
  const { promotions, addPromotion, updatePromotion, deletePromotion, products } = useSupplier();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [promotionToDelete, setPromotionToDelete] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    campaignName: '',
    product: '',
    sku: '',
    discountPercent: '',
    startDate: '',
    endDate: '',
    status: 'Active' as 'Active' | 'Scheduled'
  });

  // KPI calculations
  const kpis = useMemo(() => {
    const activeCampaigns = promotions.filter(p => p.status === 'Active').length;
    const totalDiscountGiven = promotions.reduce((sum, p) => sum + (p.totalDiscountGiven || 0), 0);
    const totalRevenue = promotions.reduce((sum, p) => sum + (p.revenue || 0), 0);
    const promsWithRoi = promotions.filter(p => p.roi > 0);
    const avgRoi = promsWithRoi.length > 0
      ? promsWithRoi.reduce((sum, p) => sum + p.roi, 0) / promsWithRoi.length
      : 0;
    return { activeCampaigns, totalDiscountGiven, totalRevenue, avgRoi };
  }, [promotions]);

  // Chart data
  const chartData = useMemo(() => {
    return promotions
      .filter(p => p.revenue > 0 || p.totalDiscountGiven > 0)
      .map(p => ({
        name: p.campaignName.length > 16 ? p.campaignName.substring(0, 16) + '...' : p.campaignName,
        revenue: p.revenue,
        discount: p.totalDiscountGiven
      }));
  }, [promotions]);

  // Filtered and paginated data
  const filteredPromotions = useMemo(() => {
    return promotions.filter(p => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = p.campaignName.toLowerCase().includes(q) ||
                           p.product.toLowerCase().includes(q) ||
                           p.sku.toLowerCase().includes(q);
      const matchesStatus = !statusFilter || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [promotions, searchQuery, statusFilter]);

  const paginatedPromotions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPromotions.slice(start, start + itemsPerPage);
  }, [filteredPromotions, currentPage, itemsPerPage]);

  // Handlers
  const handleOpenModal = (promo?: Promotion) => {
    if (promo) {
      setEditingPromotion(promo);
      setFormData({
        campaignName: promo.campaignName,
        product: promo.product,
        sku: promo.sku,
        discountPercent: promo.discountPercent.toString(),
        startDate: promo.startDate,
        endDate: promo.endDate,
        status: promo.status === 'Ended' ? 'Active' : promo.status
      });
    } else {
      setEditingPromotion(null);
      setFormData({
        campaignName: '',
        product: '',
        sku: '',
        discountPercent: '',
        startDate: '',
        endDate: '',
        status: 'Active'
      });
    }
    setIsModalOpen(true);
  };

  const handleProductChange = (productName: string) => {
    const selected = products.find(p => p.name === productName);
    setFormData(prev => ({
      ...prev,
      product: productName,
      sku: selected?.sku || ''
    }));
  };

  const handleSave = () => {
    if (!formData.campaignName || !formData.product || !formData.discountPercent || !formData.startDate || !formData.endDate) {
      setToast({ message: 'Please fill in all required fields', type: 'error' });
      return;
    }

    const discount = parseFloat(formData.discountPercent);
    if (discount < 0 || discount > 100) {
      setToast({ message: 'Discount must be between 0 and 100', type: 'error' });
      return;
    }

    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      setToast({ message: 'End date must be after start date', type: 'error' });
      return;
    }

    const promoData = {
      campaignName: formData.campaignName,
      product: formData.product,
      sku: formData.sku,
      discountPercent: parseFloat(formData.discountPercent),
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: formData.status,
      unitsSold: editingPromotion?.unitsSold || 0,
      revenue: editingPromotion?.revenue || 0,
      roi: editingPromotion?.roi || 0,
      totalDiscountGiven: editingPromotion?.totalDiscountGiven || 0
    };

    if (editingPromotion) {
      updatePromotion(editingPromotion.id, promoData);
      setToast({ message: 'Campaign updated successfully', type: 'success' });
    } else {
      addPromotion(promoData);
      setToast({ message: 'Campaign created successfully', type: 'success' });
    }
    setIsModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (promotionToDelete) {
      deletePromotion(promotionToDelete);
      setToast({ message: 'Campaign deleted successfully', type: 'success' });
      setIsDeleteModalOpen(false);
      setPromotionToDelete(null);
    }
  };

  const formatDuration = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    const fmt = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    return `${fmt(s)} - ${fmt(e)}`;
  };

  const getStatusVariant = (status: string) => {
    return PROMOTION_STATUS_CONFIG[status]?.variant || 'neutral';
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Promotion Performance</h1>
            <p className="text-slate-500 mt-1 font-medium">Track campaign effectiveness, discounts, and ROI.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" icon={<BarChart3 className="h-4 w-4" />}>Export</Button>
            <Button size="sm" className="gap-2" onClick={() => handleOpenModal()}>
              <Plus className="h-4 w-4" />
              Create Campaign
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-md hover:border-slate-200 transition-all h-full">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Active Campaigns</p>
            <div className="rounded-lg p-1.5 bg-indigo-50 text-indigo-500">
              <Megaphone className="h-3.5 w-3.5" />
            </div>
          </div>
          <p className="text-xl font-black text-slate-900 tracking-tight mt-2">{kpis.activeCampaigns}</p>
        </Card>

        <Card className="hover:shadow-md hover:border-slate-200 transition-all h-full">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Total Discount Given</p>
            <div className="rounded-lg p-1.5 bg-rose-50 text-rose-500">
              <Tag className="h-3.5 w-3.5" />
            </div>
          </div>
          <p className="text-xl font-black text-slate-900 tracking-tight mt-2">{formatCurrency(kpis.totalDiscountGiven)}</p>
        </Card>

        <Card className="hover:shadow-md hover:border-slate-200 transition-all h-full">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Promotion Revenue</p>
            <div className="rounded-lg p-1.5 bg-emerald-50 text-emerald-500">
              <TrendingUp className="h-3.5 w-3.5" />
            </div>
          </div>
          <p className="text-xl font-black text-slate-900 tracking-tight mt-2">{formatCurrency(kpis.totalRevenue)}</p>
        </Card>

        <Card className="hover:shadow-md hover:border-slate-200 transition-all h-full">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Average ROI</p>
            <div className="rounded-lg p-1.5 bg-blue-50 text-blue-500">
              <Percent className="h-3.5 w-3.5" />
            </div>
          </div>
          <p className="text-xl font-black text-slate-900 tracking-tight mt-2">{kpis.avgRoi.toFixed(0)}%</p>
        </Card>
      </div>

      {/* Chart */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Revenue vs Discount by Campaign</h3>
            <p className="text-sm text-slate-500 font-medium">Compare promotion revenue against discount cost</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-indigo-500" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-rose-500" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Discount</span>
            </div>
          </div>
        </div>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 60 }}>
              <StandardGrid />
              <XAxis
                dataKey="name"
                tick={AXIS_TICK_STYLE}
                angle={-35}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={AXIS_TICK_STYLE} tickFormatter={(v) => formatCurrency(v)} />
              <StandardTooltip
                formatter={(value: number, name: string) => [formatCurrency(value), name === 'revenue' ? 'Revenue' : 'Discount']}
              />
              <Bar dataKey="revenue" fill={CHART_COLORS.indigo} radius={[6, 6, 0, 0]} maxBarSize={32} name="revenue" />
              <Bar dataKey="discount" fill={CHART_COLORS.rose} radius={[6, 6, 0, 0]} maxBarSize={32} name="discount" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              className="pl-10"
              placeholder="Search campaigns, products, or SKUs..."
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
              <option value="Ended">Ended</option>
              <option value="Scheduled">Scheduled</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Promotions Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <Table>
            <THead>
              <TR>
                <TH className="pl-6">Campaign Name</TH>
                <TH>Product / SKU</TH>
                <TH align="right">Units Sold</TH>
                <TH align="right">Revenue (£)</TH>
                <TH align="right">Discount %</TH>
                <TH>Duration</TH>
                <TH align="center">Status</TH>
                <TH align="center" className="pr-6">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {paginatedPromotions.length > 0 ? paginatedPromotions.map((promo) => (
                <TR key={promo.id} className="group hover:bg-slate-50/50 transition-colors">
                  <TD className="pl-6">
                    <span className="font-bold text-slate-900">{promo.campaignName}</span>
                  </TD>
                  <TD>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium text-slate-700 truncate max-w-[220px]">{promo.product}</span>
                      <span className="text-xs font-mono font-bold text-slate-400">{promo.sku}</span>
                    </div>
                  </TD>
                  <TD align="right">
                    <span className="text-sm font-black text-slate-900 tabular-nums">{promo.unitsSold.toLocaleString()}</span>
                  </TD>
                  <TD align="right">
                    <span className="text-sm font-bold text-emerald-600 tabular-nums">{formatCurrency(promo.revenue)}</span>
                  </TD>
                  <TD align="right">
                    <span className="text-sm font-bold text-slate-700 tabular-nums">{promo.discountPercent}%</span>
                  </TD>
                  <TD>
                    <div className="flex items-center gap-1.5 text-sm text-slate-500 font-medium">
                      <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                      {formatDuration(promo.startDate, promo.endDate)}
                    </div>
                  </TD>
                  <TD align="center">
                    <Badge variant={getStatusVariant(promo.status)}>{promo.status}</Badge>
                  </TD>
                  <TD align="center" className="pr-6">
                    <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleOpenModal(promo)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-indigo-600 transition-colors"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => { setPromotionToDelete(promo.id); setIsDeleteModalOpen(true); }}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </TD>
                </TR>
              )) : (
                <TR>
                  <TD colSpan={8} align="center" className="py-12">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="h-8 w-8 text-slate-300" />
                      <p className="text-sm font-medium text-slate-400">No campaigns found matching your criteria.</p>
                    </div>
                  </TD>
                </TR>
              )}
            </TBody>
          </Table>
        </div>
        <div className="p-4 border-t border-slate-100">
          <Pagination
            currentPage={currentPage}
            totalItems={filteredPromotions.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
            entityName="campaigns"
          />
        </div>
      </Card>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPromotion ? 'Edit Campaign' : 'Create Campaign'}
        footer={
          <div className="flex items-center justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editingPromotion ? 'Save Changes' : 'Create Campaign'}</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Campaign Name</label>
            <Input
              placeholder="Enter campaign name"
              value={formData.campaignName}
              onChange={(e) => setFormData(prev => ({ ...prev, campaignName: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Product</label>
            <select
              value={formData.product}
              onChange={(e) => handleProductChange(e.target.value)}
              className="w-full h-10 px-4 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            >
              <option value="">Select a product</option>
              {products.map(p => (
                <option key={p.id} value={p.name}>{p.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Discount %</label>
              <Input
                type="number"
                placeholder="e.g. 10"
                min="0"
                max="100"
                value={formData.discountPercent}
                onChange={(e) => setFormData(prev => ({ ...prev, discountPercent: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'Active' | 'Scheduled' }))}
                className="w-full h-10 px-4 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              >
                <option value="Active">Active</option>
                <option value="Scheduled">Scheduled</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Start Date</label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">End Date</label>
              <Input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
              />
            </div>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Campaign"
        footer={
          <div className="flex items-center justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDeleteConfirm}>Delete</Button>
          </div>
        }
      >
        <p className="text-sm text-slate-600">Are you sure you want to delete this campaign? This action cannot be undone.</p>
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default SupplierPromotions;
