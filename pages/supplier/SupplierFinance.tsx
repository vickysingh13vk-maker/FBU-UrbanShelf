import React, { useState, useMemo } from 'react';
import {
  Search, Receipt, Filter, Eye, FileDown
} from 'lucide-react';
import {
  Card, Button, Badge, Table, THead, TBody, TR, TH, TD,
  Input, Pagination
} from '../../components/ui';
import { useSupplier } from '../../context/SupplierContext';
import { TRANSACTION_STATUS_CONFIG } from '../../constants/supplierStatus';
import { SupplierTransaction } from '../../types';
import FinanceKPICards from '../../components/supplier/FinanceKPICards';
import FinanceCharts from '../../components/supplier/FinanceCharts';
import TransactionDetails from '../../components/supplier/TransactionDetails';

const SupplierFinance: React.FC = () => {
  const { finance } = useSupplier();
  
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Drawer State
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<SupplierTransaction | null>(null);

  const filteredTransactions = useMemo(() => {
    return finance.transactions.filter((trx: SupplierTransaction) => {
      const matchesSearch = trx.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           trx.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           trx.product.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = !statusFilter || trx.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [finance.transactions, searchQuery, statusFilter]);

  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(start, start + itemsPerPage);
  }, [filteredTransactions, currentPage, itemsPerPage]);

  const getStatusBadge = (status: string) => {
    const cfg = TRANSACTION_STATUS_CONFIG[status];
    if (!cfg) return <Badge variant="neutral">{status}</Badge>;
    const Icon = cfg.icon;
    return (
      <Badge variant={cfg.variant} className="font-bold gap-1.5">
        {Icon && <Icon className="h-3 w-3" />}
        {cfg.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Finance</h1>
            <p className="text-slate-500 mt-1 font-medium">Track your revenue, commissions, and payouts.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" icon={<FileDown className="h-4 w-4" />}>
              Export Report
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <FinanceKPICards stats={finance.kpis} />

      {/* Charts & Summary */}
      <FinanceCharts data={finance.trends} />

      {/* Transactions Table Section */}
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <h3 className="text-sm font-bold text-slate-900">Transaction History</h3>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                className="pl-10" 
                placeholder="Search transactions..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 px-4 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            >
              <option value="">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Processing">Processing</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
            <Button variant="secondary" icon={<Filter className="h-4 w-4" />}>More Filters</Button>
          </div>
        </div>

        <Card padding="none">
          <div className="overflow-x-auto">
            <Table>
              <THead>
                <TR>
                  <TH className="pl-6">Transaction ID</TH>
                  <TH>Order ID</TH>
                  <TH>Product / SKU</TH>
                  <TH>Revenue</TH>
                  <TH>Commission</TH>
                  <TH>Net Amount</TH>
                  <TH>Invoice Type</TH>
                  <TH>Status</TH>
                  <TH align="right" className="pr-6">Date</TH>
                </TR>
              </THead>
              <TBody>
                {paginatedTransactions.length > 0 ? paginatedTransactions.map((trx: SupplierTransaction) => (
                  <TR 
                    key={trx.id} 
                    className="group hover:bg-slate-50/50 transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedTransaction(trx);
                      setIsDetailsOpen(true);
                    }}
                  >
                    <TD className="pl-6">
                      <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{trx.id}</span>
                    </TD>
                    <TD className="text-slate-600 font-medium">{trx.orderId}</TD>
                    <TD>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900">{trx.product}</span>
                        <span className="text-xs font-bold text-slate-400 font-mono">{trx.sku}</span>
                      </div>
                    </TD>
                    <TD className="font-bold text-slate-900">£{trx.revenue.toFixed(2)}</TD>
                    <TD className="font-bold text-rose-500">-£{trx.commission.toFixed(2)}</TD>
                    <TD className="font-black text-emerald-600">£{trx.netAmount.toFixed(2)}</TD>
                    <TD>
                      <Badge variant={(trx as any).invoiceType === 'Sales' ? 'primary' : (trx as any).invoiceType === 'Service Fee' ? 'info' : 'neutral'} className="font-bold">
                        {(trx as any).invoiceType || 'Sales'}
                      </Badge>
                    </TD>
                    <TD>{getStatusBadge(trx.status)}</TD>
                    <TD align="right" className="pr-6">
                      <div className="flex items-center justify-end gap-3">
                        <span className="text-slate-500 font-medium">{trx.date}</span>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Eye className="h-4 w-4 text-slate-400" />
                        </Button>
                      </div>
                    </TD>
                  </TR>
                )) : (
                  <TR>
                    <TD colSpan={9} align="center" className="py-12">
                      <div className="flex flex-col items-center gap-2 text-slate-400">
                        <Receipt className="h-12 w-12 opacity-20" />
                        <p className="text-lg font-bold">No transactions found</p>
                        <p className="text-sm">Try adjusting your search or filters</p>
                      </div>
                    </TD>
                  </TR>
                )}
              </TBody>
            </Table>
          </div>
          
          <Pagination 
            currentPage={currentPage}
            totalItems={filteredTransactions.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
            entityName="transactions"
          />
        </Card>
      </div>

      {/* Details Drawer */}
      <TransactionDetails 
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        transaction={selectedTransaction}
      />
    </div>
  );
};

export default SupplierFinance;
