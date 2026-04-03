import React, { useState, useMemo } from 'react';
import { ShoppingCart, Search, Filter, MoreHorizontal, Calendar, Download, Package } from 'lucide-react';
import { 
  Card, Button, Badge, Table, THead, TBody, TR, TH, TD, Input, Pagination
} from '../../components/ui';
import { Link } from 'react-router-dom';
import { useSupplier } from '../../context/SupplierContext';
import { ORDER_STATUS_CONFIG } from '../../constants/supplierStatus';

const SupplierOrders: React.FC = () => {
  const { orders, isLoading } = useSupplier();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           order.buyer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           order.product.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = !statusFilter || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, currentPage, itemsPerPage]);



  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Orders</h1>
            <p className="text-slate-500 mt-1 font-medium">View and track customer orders for your products.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export Orders
            </Button>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              className="pl-10" 
              placeholder="Search by Order ID, Buyer or Product..." 
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
              {Object.keys(ORDER_STATUS_CONFIG).map(status => (
                <option key={status} value={status}>{ORDER_STATUS_CONFIG[status].label}</option>
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
                <TH className="pl-6">Order ID</TH>
                <TH>Date</TH>
                <TH>Buyer</TH>
                <TH>Product</TH>
                <TH align="center">Quantity</TH>
                <TH>Commission</TH>
                <TH>Net Earnings</TH>
                <TH align="right" className="pr-6">Status</TH>
              </TR>
            </THead>
            <TBody>
              {paginatedOrders.length > 0 ? paginatedOrders.map((order) => (
                <TR key={order.id}>
                  <TD className="pl-6 font-bold text-indigo-600">
                    <Link to={`/supplier/orders/${order.id}`} className="hover:underline">
                      {order.id}
                    </Link>
                  </TD>
                  <TD className="text-slate-500 text-sm font-medium">{order.date}</TD>
                  <TD className="text-slate-600 font-bold">{order.buyer}</TD>
                  <TD className="text-slate-600 font-medium">{order.product}</TD>
                  <TD align="center" className="font-bold text-slate-900">{order.quantity}</TD>
                  <TD className="text-rose-500 font-bold">£{order.commission.toFixed(2)}</TD>
                  <TD className="font-black text-emerald-600">£{order.netEarnings.toFixed(2)}</TD>
                  <TD align="right" className="pr-6">
                    <Badge variant={ORDER_STATUS_CONFIG[order.status]?.variant || 'neutral'}>
                      {ORDER_STATUS_CONFIG[order.status]?.label || order.status}
                    </Badge>
                  </TD>
                </TR>
              )) : (
                <TR>
                  <TD colSpan={8} align="center" className="py-12">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <ShoppingCart className="h-12 w-12 opacity-20" />
                      <p className="text-lg font-bold">No orders found</p>
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
          totalItems={filteredOrders.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
          entityName="orders"
        />
      </Card>
    </div>
  );
};

export default SupplierOrders;
