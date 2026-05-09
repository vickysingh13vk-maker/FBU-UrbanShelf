import React from 'react';
import { X } from 'lucide-react';
import { ShipmentItem } from '../../types';
import { PRODUCTS } from '../../data';

interface Props {
  item: ShipmentItem;
  index: number;
  onChange: (id: string, field: keyof ShipmentItem, value: string | number) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
}

const LineItemRow: React.FC<Props> = ({ item, index, onChange, onRemove, canRemove }) => {
  const products = PRODUCTS;
  const selectedProduct = products.find(p => p.id === item.productId);
  const flavours = products.filter(p => item.productId && p.name === selectedProduct?.name && p.flavour).map(p => p.flavour!);

  const handleProductChange = (productId: string) => {
    const p = products.find(pr => pr.id === productId);
    onChange(item.id, 'productId', productId);
    onChange(item.id, 'productName', p?.name ?? '');
    onChange(item.id, 'flavour', p?.flavour ?? '');
    if (p) onChange(item.id, 'unitPrice', p.price);
  };

  const handleQty = (v: string) => {
    const qty = parseInt(v) || 0;
    onChange(item.id, 'quantity', qty);
    onChange(item.id, 'totalPrice', qty * item.unitPrice);
  };

  const handlePrice = (v: string) => {
    const price = parseFloat(v) || 0;
    onChange(item.id, 'unitPrice', price);
    onChange(item.id, 'totalPrice', item.quantity * price);
  };

  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50/50">
      <td className="py-2 px-3 text-xs text-slate-400">{index + 1}</td>
      <td className="py-2 px-2">
        <select
          value={item.productId}
          onChange={e => handleProductChange(e.target.value)}
          className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        >
          <option value="">Select product...</option>
          {Array.from(new Map(products.map(p => [p.id, p])).values()).map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </td>
      <td className="py-2 px-2">
        <select
          value={item.flavour ?? ''}
          onChange={e => onChange(item.id, 'flavour', e.target.value)}
          disabled={!item.productId}
          className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white disabled:opacity-40"
        >
          <option value="">Any / All</option>
          {flavours.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      </td>
      <td className="py-2 px-2">
        <input
          type="number" min="1"
          value={item.quantity || ''}
          onChange={e => handleQty(e.target.value)}
          placeholder="0"
          className="w-20 text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-right"
        />
      </td>
      <td className="py-2 px-2">
        <div className="relative">
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-slate-400">£</span>
          <input
            type="number" min="0" step="0.01"
            value={item.unitPrice || ''}
            onChange={e => handlePrice(e.target.value)}
            placeholder="0.00"
            className="w-24 text-xs border border-slate-200 rounded-lg pl-5 pr-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-right"
          />
        </div>
      </td>
      <td className="py-2 px-3 text-xs font-semibold text-slate-700 text-right">
        £{item.totalPrice.toFixed(2)}
      </td>
      <td className="py-2 px-2">
        {canRemove && (
          <button
            onClick={() => onRemove(item.id)}
            className="h-6 w-6 flex items-center justify-center rounded-lg hover:bg-rose-50 text-slate-300 hover:text-rose-500 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </td>
    </tr>
  );
};

export default LineItemRow;
