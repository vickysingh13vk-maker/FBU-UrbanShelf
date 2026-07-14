import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, FileText, FileDown, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { Card, Button, Input, Table, THead, TBody, TR, TH, TD, Pagination } from '../components/ui';
import { CUSTOMER_LEDGER_NEW } from '../data/newDashboardData';

type SortDir = 'asc' | 'desc';
type SortKey = 'customer' | 'orders' | 'paid' | 'balance';
type SortState = { key: SortKey; dir: SortDir } | null;

const CustomerLedgerPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortState>({ key: 'balance', dir: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    let rows = query
      ? CUSTOMER_LEDGER_NEW.filter((item) => item.customer.toLowerCase().includes(query))
      : CUSTOMER_LEDGER_NEW;

    if (sort) {
      const mul = sort.dir === 'asc' ? 1 : -1;
      rows = [...rows].sort((a, b) =>
        sort.key === 'customer' ? a.customer.localeCompare(b.customer) * mul : (a[sort.key] - b[sort.key]) * mul
      );
    }
    return rows;
  }, [search, sort]);

  const totalOutstanding = useMemo(
    () => CUSTOMER_LEDGER_NEW.reduce((sum, item) => sum + (item.balance < 0 ? item.balance : 0), 0),
    []
  );

  const paged = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage, itemsPerPage]);

  const toggleSort = (key: SortKey, defaultDir: SortDir = 'desc') => {
    setCurrentPage(1);
    setSort((prev) => (!prev || prev.key !== key ? { key, dir: defaultDir } : { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' }));
  };

  const SortIcon = ({ sortKey }: { sortKey: SortKey }) => {
    if (!sort || sort.key !== sortKey) return <ArrowUpDown className="h-3 w-3 text-slate-300 group-hover:text-slate-400 inline ml-1" />;
    return sort.dir === 'asc'
      ? <ArrowUp className="h-3 w-3 text-indigo-600 inline ml-1" />
      : <ArrowDown className="h-3 w-3 text-indigo-600 inline ml-1" />;
  };

  return (
    <div className="space-y-6 pb-20">
      <div>
        <Link to="/new-dashboard" className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-widest mb-3">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Customer Ledger</h1>
            <p className="text-sm text-slate-500 mt-1">
              Full balance and payment tracking across all {CUSTOMER_LEDGER_NEW.length} customers
            </p>
          </div>
          <Button variant="secondary" size="sm" icon={<FileDown className="h-3.5 w-3.5" />}>
            Download Ledger
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-100 bg-white p-4">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Total Customers</p>
          <p className="mt-2 text-xl font-black tracking-tight text-slate-900 tabular-nums">{CUSTOMER_LEDGER_NEW.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-4">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Accounts With Balance Due</p>
          <p className="mt-2 text-xl font-black tracking-tight text-slate-900 tabular-nums">
            {CUSTOMER_LEDGER_NEW.filter((c) => c.balance < 0).length}
          </p>
        </div>
        <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4">
          <p className="text-[11px] font-bold uppercase tracking-widest text-rose-500">Total Outstanding</p>
          <p className="mt-2 text-xl font-black tracking-tight text-rose-600 tabular-nums">
            {totalOutstanding.toLocaleString()}
          </p>
        </div>
      </div>

      <Card padding="none" className="rounded-2xl overflow-hidden flex flex-col border-slate-100">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-indigo-500" />
            <h3 className="text-base font-bold text-slate-900 tracking-tight">All Customers</h3>
          </div>
          <div className="w-full sm:w-72">
            <Input
              icon={<Search className="h-4 w-4" />}
              type="text"
              placeholder="Search customer name..."
              aria-label="Search customer ledger by name"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table className="w-full">
            <THead>
              <TR>
                <TH onClick={() => toggleSort('customer', 'asc')} className="py-2 group">
                  Customer <SortIcon sortKey="customer" />
                </TH>
                <TH align="right" onClick={() => toggleSort('orders')} className="py-2 group">
                  Total Orders <SortIcon sortKey="orders" />
                </TH>
                <TH align="right" onClick={() => toggleSort('paid')} className="py-2 group">
                  Total Paid <SortIcon sortKey="paid" />
                </TH>
                <TH align="right" onClick={() => toggleSort('balance', 'asc')} className="py-2 group">
                  Outstanding Balance <SortIcon sortKey="balance" />
                </TH>
                <TH align="right" className="py-2">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {paged.length === 0 && (
                <tr><td colSpan={5} className="text-center text-slate-400 text-xs py-10">No customers match your search.</td></tr>
              )}
              {paged.map((item, idx) => (
                <TR key={idx}>
                  <TD className="py-2 text-xs font-medium text-slate-900">{item.customer}</TD>
                  <TD align="right" className="py-2 text-xs text-slate-600 tabular-nums">{item.orders}</TD>
                  <TD align="right" className="py-2 text-xs font-medium text-emerald-600 tabular-nums">{item.paid.toLocaleString()}</TD>
                  <TD align="right" className="py-2">
                    <span className={`text-xs font-medium tabular-nums ${item.balance !== 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                      {item.balance.toLocaleString()}
                    </span>
                  </TD>
                  <TD align="right" className="py-2">
                    <button className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-widest rounded">
                      View Statement
                    </button>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </div>
        <Pagination
          currentPage={currentPage}
          totalItems={filtered.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(n) => { setItemsPerPage(n); setCurrentPage(1); }}
          entityName="customers"
        />
      </Card>
    </div>
  );
};

export default CustomerLedgerPage;
