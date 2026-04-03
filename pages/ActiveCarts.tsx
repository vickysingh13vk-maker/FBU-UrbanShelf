import React, { useState, useMemo } from 'react';
import { 
  Search, Download, Mail, ShoppingCart, Clock, AlertCircle, 
  ArrowUpDown, ArrowLeft, MailCheck
} from 'lucide-react';
import { 
  Card, Button, Input, Pagination,
  Section, Grid, Table, THead, TBody, TR, TH, TD, KpiCard
} from '../components/ui';
import { ACTIVE_CARTS } from '../data';
import { Cart } from '../types';
import { Link } from 'react-router-dom';

type SortConfig = { key: string; direction: 'asc' | 'desc' } | null;

const ActiveCartsPage: React.FC = () => {
  // --- State ---
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [sentEmails, setSentEmails] = useState<Set<string>>(new Set());

  // --- Sorting & Filtering ---
  const filteredCarts = useMemo(() => {
    let result = ACTIVE_CARTS.filter(cart => 
      cart.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cart.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cart.userName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortConfig) {
      result.sort((a: any, b: any) => {
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
    return result;
  }, [searchTerm, sortConfig]);

  const paginatedCarts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCarts.slice(start, start + itemsPerPage);
  }, [filteredCarts, currentPage, itemsPerPage]);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleSendReminder = (id: string, name: string) => {
    // In a real app, this would call an API
    if (confirm(`Send cart reminder email to ${name}?`)) {
      setSentEmails(prev => new Set(prev).add(id));
      alert(`Reminder email sent successfully to ${name}`);
    }
  };

  // --- Stats ---
  const totalActiveCarts = ACTIVE_CARTS.length;
  const highQtyCarts = ACTIVE_CARTS.filter(c => c.totalQty > 50).length;
  // Mock logic for "Oldest Cart"
  const oldestCartDays = 5;

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12">
      
      {/* 1. Page Header */}
      <div className="flex flex-col gap-4">
        <Link to="/orders" className="text-sm font-medium text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition-colors w-fit">
           <ArrowLeft className="h-4 w-4" /> Back to Orders
        </Link>
        <Section 
          title={`Active Carts (${totalActiveCarts})`} 
          description="Customers with items currently in cart but not checked out."
        >
          {/* 2. Summary Cards */}
          <Grid cols={3} gap={4}>
            <KpiCard title="Total Active Carts" value={totalActiveCarts} icon={ShoppingCart} color="blue" />
            <KpiCard title="Customers with Items > 50 Qty" value={highQtyCarts} icon={AlertCircle} color="amber" />
            <KpiCard title="Oldest Cart (Days)" value={oldestCartDays} icon={Clock} color="slate" />
          </Grid>

          <Card padding="none" className="flex flex-col overflow-hidden">
            {/* 3. Controls */}
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white">
              <div className="w-full sm:w-80">
                <Input 
                  placeholder="Search carts..." 
                  icon={<Search className="h-4 w-4" />} 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="secondary" icon={<Download className="h-4 w-4" />}>Export CSV</Button>
            </div>

            {/* 4. Table */}
            <Table>
              <THead>
                <TR>
                  <TH align="center">Actions</TH>
                  <TH onClick={() => handleSort('id')} className="cursor-pointer group select-none">
                    <div className="flex items-center gap-2">Cart ID <ArrowUpDown className="h-3 w-3 text-slate-300 group-hover:text-indigo-500" /></div>
                  </TH>
                  <TH onClick={() => handleSort('userEmail')} className="cursor-pointer group select-none">
                    <div className="flex items-center gap-2">User Email <ArrowUpDown className="h-3 w-3 text-slate-300 group-hover:text-indigo-500" /></div>
                  </TH>
                  <TH onClick={() => handleSort('userName')} className="cursor-pointer group select-none">
                    <div className="flex items-center gap-2">User Name <ArrowUpDown className="h-3 w-3 text-slate-300 group-hover:text-indigo-500" /></div>
                  </TH>
                  <TH onClick={() => handleSort('totalItems')} className="cursor-pointer group select-none" align="center">
                    <div className="flex items-center gap-2 justify-center">Total Items <ArrowUpDown className="h-3 w-3 text-slate-300 group-hover:text-indigo-500" /></div>
                  </TH>
                  <TH onClick={() => handleSort('totalQty')} className="cursor-pointer group select-none" align="center">
                    <div className="flex items-center gap-2 justify-center">Total Qty <ArrowUpDown className="h-3 w-3 text-slate-300 group-hover:text-indigo-500" /></div>
                  </TH>
                  <TH>Items</TH>
                  <TH onClick={() => handleSort('lastUpdated')} className="cursor-pointer group select-none">
                     <div className="flex items-center gap-2">Last Updated <ArrowUpDown className="h-3 w-3 text-slate-300 group-hover:text-indigo-500" /></div>
                  </TH>
                  <TH onClick={() => handleSort('created')} className="cursor-pointer group select-none">
                     <div className="flex items-center gap-2">Created <ArrowUpDown className="h-3 w-3 text-slate-300 group-hover:text-indigo-500" /></div>
                  </TH>
                </TR>
              </THead>
              <TBody>
                {paginatedCarts.map((cart) => (
                  <TR key={cart.id}>
                    <TD align="center">
                      <button 
                        onClick={() => handleSendReminder(cart.id, cart.userName)}
                        disabled={sentEmails.has(cart.id)}
                        className={`p-2 rounded-lg border flex items-center justify-center transition-all ${
                          sentEmails.has(cart.id)
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-200 cursor-default'
                            : 'border-slate-200 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200'
                        }`}
                        title={sentEmails.has(cart.id) ? "Reminder Sent" : "Send Reminder Email"}
                      >
                        {sentEmails.has(cart.id) ? <MailCheck className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
                      </button>
                    </TD>
                    <TD className="font-mono font-medium text-slate-600">
                      {cart.id}
                    </TD>
                    <TD className="text-slate-600">
                      {cart.userEmail}
                    </TD>
                    <TD className="font-bold text-slate-900">
                      {cart.userName}
                    </TD>
                    <TD align="center" className="text-slate-600">
                      {cart.totalItems}
                    </TD>
                    <TD align="center" className="font-bold text-slate-900">
                      {cart.totalQty}
                    </TD>
                    <TD>
                      <div className="truncate max-w-[200px] text-sm text-slate-500" title={cart.items.join(', ')}>
                         {cart.items.join(', ')}
                      </div>
                    </TD>
                    <TD className="text-slate-500">
                      {cart.lastUpdated}
                    </TD>
                    <TD className="text-slate-500">
                      {cart.created}
                    </TD>
                  </TR>
                ))}
                {paginatedCarts.length === 0 && (
                   <TR>
                      <TD colSpan={9} className="py-12 text-center text-slate-500">No active carts found.</TD>
                   </TR>
                )}
              </TBody>
            </Table>
            
            <Pagination 
                currentPage={currentPage}
                totalItems={filteredCarts.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={setItemsPerPage}
                entityName="carts"
            />
          </Card>
        </Section>
      </div>
    </div>
  );
};

export default ActiveCartsPage;
