import React from 'react';
import { Card } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Table, THead, TBody, TR, TH, TD } from '../../ui/Table';
import { RecentOrder } from '../../../mock/supplierDashboard';

export interface RecentOrdersCardProps {
  recentOrders: RecentOrder[];
}

const statusVariant = (status: string) => {
  switch (status) {
    case 'DELIVERED': return 'success';
    case 'SHIPPED': return 'primary';
    case 'PACKED': return 'warning';
    case 'PROCESSING': return 'secondary';
    default: return 'secondary';
  }
};

const RecentOrdersCard: React.FC<RecentOrdersCardProps> = ({ recentOrders }) => {
  return (
    <Card padding="none" className="p-5 hover:shadow-xl transition-all duration-300 border-slate-100 bg-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight">Recent Orders</h3>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <THead>
            <TR className="hover:bg-transparent">
              <TH className="text-[10px] uppercase tracking-wider">Order ID</TH>
              <TH className="text-[10px] uppercase tracking-wider">Buyer</TH>
              <TH className="text-[10px] uppercase tracking-wider">Product</TH>
              <TH align="center" className="text-[10px] uppercase tracking-wider">Qty</TH>
              <TH align="center" className="text-[10px] uppercase tracking-wider">Status</TH>
              <TH align="right" className="text-[10px] uppercase tracking-wider">Earnings</TH>
            </TR>
          </THead>
          <TBody>
            {recentOrders.map((order) => (
              <TR key={order.id} className="hover:bg-slate-50/50 transition-colors">
                <TD className="py-3.5">
                  <span className="text-xs font-bold text-indigo-600">{order.id}</span>
                </TD>
                <TD className="py-3.5">
                  <span className="text-xs font-medium text-slate-700">{order.buyer}</span>
                </TD>
                <TD className="py-3.5">
                  <span className="text-xs text-slate-600">{order.product}</span>
                </TD>
                <TD align="center" className="py-3.5">
                  <span className="text-xs font-bold text-slate-900">{order.qty}</span>
                </TD>
                <TD align="center" className="py-3.5">
                  <Badge variant={statusVariant(order.status) as any} className="text-[9px] font-bold uppercase tracking-wider">
                    {order.status}
                  </Badge>
                </TD>
                <TD align="right" className="py-3.5">
                  <span className="text-xs font-bold text-emerald-600">{order.earnings}</span>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </div>
    </Card>
  );
};

export default RecentOrdersCard;
