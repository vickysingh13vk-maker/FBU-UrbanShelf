import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, AlertCircle, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { Card, Input, Table, THead, TBody, TR, TH, TD, Badge, Pagination } from '../components/ui';
import { PAYMENT_DUE_28_DAYS_NEW } from '../data/newDashboardData';

const parsePendingAmount = (pending: string): number => parseFloat(pending.replace(/[£,]/g, '')) || 0;

const getDueTier = (pending: string): { dot: string } => {
  const amount = parsePendingAmount(pending);
  if (amount >= 15000) return { dot: 'bg-rose-500' };
  if (amount >= 5000) return { dot: 'bg-amber-400' };
  return { dot: 'bg-slate-300' };
};

type SortDir = 'asc' | 'desc';
type SortKey = 'name' | 'pending' | 'orders';
type SortState = { key: SortKey; dir: SortDir } | null;

const PaymentsDuePage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortState>({ key: 'pending', dir: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    let rows = query
      ? PAYMENT_DUE_28_DAYS_NEW.rows.filter((row) => row.name.toLowerCase().includes(query))
      : PAYMENT_DUE_28_DAYS_NEW.rows;

    if (sort) {
      const mul = sort.dir === 'asc' ? 1 : -1;
      rows = [...rows].sort((a, b) => {
        if (sort.key === 'name') return a.name.localeCompare(b.name) * mul;
        if (sort.key === 'pending') return (parsePendingAmount(a.pending) - parsePendingAmount(b.pending)) * mul;
        return (a.orders - b.orders) * mul;
      });
    }
    return rows;
  }, [search, sort]);

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
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">28 Days Payment Due</h1>
          <Badge variant="danger" className="text-[10px] uppercase tracking-wider">{PAYMENT_DUE_28_DAYS_NEW.rows.length} accounts</Badge>
        </div>
        <p className="text-sm text-slate-500 mt-1">All accounts below are 28+ days overdue</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-slate-100 bg-white p-4">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Accounts Overdue</p>
          <p className="mt-2 text-xl font-black tracking-tight text-slate-900 tabular-nums">{PAYMENT_DUE_28_DAYS_NEW.rows.length}</p>
        </div>
        <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4">
          <p className="text-[11px] font-bold uppercase tracking-widest text-rose-500">Total Outstanding</p>
          <p className="mt-2 text-xl font-black tracking-tight text-rose-600 tabular-nums">£{PAYMENT_DUE_28_DAYS_NEW.totalOutstanding.replace('£', '')}</p>
        </div>
      </div>

      <Card padding="none" className="rounded-2xl overflow-hidden flex flex-col border-slate-100">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-rose-500" />
            <h3 className="text-base font-bold text-slate-900 tracking-tight">All Overdue Accounts</h3>
          </div>
          <div className="w-full sm:w-72">
            <Input
              icon={<Search className="h-4 w-4" />}
              type="text"
              placeholder="Search customer name..."
              aria-label="Search overdue accounts by name"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table className="w-full">
            <THead>
              <TR>
                <TH onClick={() => toggleSort('name', 'asc')} className="py-2 group">
                  Customer <SortIcon sortKey="name" />
                </TH>
                <TH className="py-2">Email</TH>
                <TH align="right" onClick={() => toggleSort('pending')} className="py-2 group">
                  Total Pending <SortIcon sortKey="pending" />
                </TH>
                <TH align="right" onClick={() => toggleSort('orders')} className="py-2 group">
                  Orders <SortIcon sortKey="orders" />
                </TH>
              </TR>
            </THead>
            <TBody>
              {paged.length === 0 && (
                <tr><td colSpan={4} className="text-center text-slate-400 text-xs py-10">No accounts match your search.</td></tr>
              )}
              {paged.map((row) => {
                const tier = getDueTier(row.pending);
                return (
                  <TR key={row.name}>
                    <TD className="py-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`h-2 w-2 rounded-full shrink-0 ${tier.dot}`} />
                        <span className="text-xs font-medium text-indigo-600 truncate">{row.name}</span>
                      </div>
                    </TD>
                    <TD className="py-2 text-xs text-slate-500 font-medium">{row.email}</TD>
                    <TD align="right" className="py-2 text-xs font-medium text-rose-600 tabular-nums">{row.pending}</TD>
                    <TD align="right" className="py-2 text-xs font-medium text-slate-900 tabular-nums">{row.orders}</TD>
                  </TR>
                );
              })}
            </TBody>
          </Table>
        </div>
        <Pagination
          currentPage={currentPage}
          totalItems={filtered.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(n) => { setItemsPerPage(n); setCurrentPage(1); }}
          entityName="accounts"
        />
      </Card>
    </div>
  );
};

export default PaymentsDuePage;
