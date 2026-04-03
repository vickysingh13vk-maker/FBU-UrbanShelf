import React, { useState, useMemo } from 'react';
import { 
  RotateCcw, Search, Filter, Download, Calendar, 
  User, Box, Hash, Clock, FileText, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { 
  Card, Badge, Button, Input, Table, THead, TBody, TR, TH, TD,
  Section, Grid, KpiCard
} from '../components/ui';
import { useProducts } from '../context/ProductContext';
import { motion } from 'motion/react';

const StockReversalLedger: React.FC = () => {
  const { stockReversals } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  const filteredReversals = useMemo(() => {
    return stockReversals.filter(rev => {
      const matchesSearch = 
        rev.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rev.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rev.product.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = typeFilter === 'All' || rev.reversalType === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [stockReversals, searchTerm, typeFilter]);

  const stats = useMemo(() => {
    const total = stockReversals.length;
    const additions = stockReversals.filter(r => r.reversalType === 'Add Stock Back').length;
    const removals = stockReversals.filter(r => r.reversalType === 'Remove Extra Stock').length;
    const totalQty = stockReversals.reduce((sum, r) => sum + r.reversalQuantity, 0);

    return { total, additions, removals, totalQty };
  }, [stockReversals]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <RotateCcw className="h-6 w-6 text-indigo-600" />
            Stock Reversal Ledger
          </h1>
          <p className="text-slate-500 mt-1">Audit trail of all inventory reversals from approved orders.</p>
        </div>
        <Button variant="secondary" icon={<Download className="h-4 w-4" />}>Export Ledger</Button>
      </div>

      <Grid cols={4}>
        <KpiCard 
          title="Total Reversals" 
          value={stats.total.toString()} 
          icon={Hash}
          color="indigo"
        />
        <KpiCard 
          title="Stock Additions" 
          value={stats.additions.toString()} 
          icon={ArrowUpRight}
          color="emerald"
        />
        <KpiCard 
          title="Stock Removals" 
          value={stats.removals.toString()} 
          icon={ArrowDownRight}
          color="rose"
        />
        <KpiCard 
          title="Total Units Reversed" 
          value={stats.totalQty.toString()} 
          icon={Box}
          color="amber"
        />
      </Grid>

      <Card>
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search by Order ID, Customer, or Product..." 
              className="pl-10"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select 
              className="h-10 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
            >
              <option value="All">All Types</option>
              <option value="Add Stock Back">Add Stock Back</option>
              <option value="Remove Extra Stock">Remove Extra Stock</option>
            </select>
          </div>
        </div>

        <Table>
          <THead>
            <TR>
              <TH>Date</TH>
              <TH>Order ID</TH>
              <TH>Customer</TH>
              <TH>Product</TH>
              <TH>Type</TH>
              <TH>Qty</TH>
              <TH>Reason</TH>
              <TH>Admin</TH>
            </TR>
          </THead>
          <TBody>
            {filteredReversals.length > 0 ? (
              filteredReversals.map((rev) => (
                <TR key={rev.id}>
                  <TD>
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-900">{new Date(rev.date).toLocaleDateString()}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{new Date(rev.date).toLocaleTimeString()}</span>
                    </div>
                  </TD>
                  <TD>
                    <Badge variant="secondary" className="font-mono">#{rev.orderId}</Badge>
                  </TD>
                  <TD>
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                        {rev.customer.charAt(0)}
                      </div>
                      <span className="font-medium text-slate-700">{rev.customer}</span>
                    </div>
                  </TD>
                  <TD>
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-900">{rev.product}</span>
                      <span className="text-xs text-slate-500">{rev.flavour}</span>
                    </div>
                  </TD>
                  <TD>
                    <Badge variant={rev.reversalType === 'Add Stock Back' ? 'success' : 'danger'}>
                      {rev.reversalType === 'Add Stock Back' ? 'Addition' : 'Removal'}
                    </Badge>
                  </TD>
                  <TD>
                    <span className={`font-bold ${rev.reversalType === 'Add Stock Back' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {rev.reversalType === 'Add Stock Back' ? '+' : '-'}{rev.reversalQuantity}
                    </span>
                  </TD>
                  <TD>
                    <div className="flex flex-col">
                      <span className="text-sm text-slate-700">{rev.reason}</span>
                      {rev.notes && <span className="text-[10px] text-slate-400 italic truncate max-w-[150px]">{rev.notes}</span>}
                    </div>
                  </TD>
                  <TD>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <User className="h-3 w-3" />
                      <span className="text-sm">{rev.adminUser}</span>
                    </div>
                  </TD>
                </TR>
              ))
            ) : (
              <TR>
                <TD colSpan={8} className="text-center py-12">
                  <div className="flex flex-col items-center">
                    <div className="h-12 w-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-3">
                      <RotateCcw className="h-6 w-6" />
                    </div>
                    <p className="text-slate-500 font-medium">No reversal records found</p>
                    <p className="text-sm text-slate-400 mt-1">Stock reversals from approved orders will appear here.</p>
                  </div>
                </TD>
              </TR>
            )}
          </TBody>
        </Table>
      </Card>
    </div>
  );
};

export default StockReversalLedger;
