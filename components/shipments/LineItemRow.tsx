import React from 'react';
import { X } from 'lucide-react';
import { ShipmentItem } from '../../types';
import { PRODUCTS } from '../../data';
import SearchableSelect from '../ui/SearchableSelect';

interface Props {
  item: ShipmentItem;
  index: number;
  onChange: (id: string, field: keyof ShipmentItem, value: string | number) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
}

const LineItemRow: React.FC<Props> = ({ item, index, onChange, onRemove, canRemove }) => {
  // Unique product names (deduplicated — each name shown once)
  const uniqueNames = Array.from(new Set(PRODUCTS.map(p => p.name)));
  const productOptions = uniqueNames.map(name => ({ value: name, label: name }));

  // Flavours for selected product name
  const flavourOptions = PRODUCTS
    .filter(p => p.name === item.productName && p.flavour)
    .map(p => ({ value: p.flavour!, label: p.flavour! }));

  // When product name changes: reset flavour, set price from first matching product
  const handleProductChange = (productName: string) => {
    const first = PRODUCTS.find(p => p.name === productName);
    onChange(item.id, 'productName', productName);
    onChange(item.id, 'productId', first?.id ?? '');
    onChange(item.id, 'flavour', '');
    const price = first?.price ?? 0;
    onChange(item.id, 'unitPrice', price);
    onChange(item.id, 'totalPrice', item.quantity * price);
  };

  // When flavour changes: find matching variant → update productId + price
  const handleFlavourChange = (flavour: string) => {
    onChange(item.id, 'flavour', flavour);
    const match = PRODUCTS.find(p => p.name === item.productName && p.flavour === flavour);
    if (match) {
      onChange(item.id, 'productId', match.id);
      onChange(item.id, 'unitPrice', match.price);
      onChange(item.id, 'totalPrice', item.quantity * match.price);
    }
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
      <td className="py-2 px-3 text-xs text-slate-400 w-8">{index + 1}</td>

      {/* Product — searchable, unique names */}
      <td className="py-2 px-2">
        <SearchableSelect
          options={productOptions}
          value={item.productName}
          onChange={handleProductChange}
          placeholder="Search product..."
          className="min-w-[160px]"
          emptyLabel="No products"
        />
      </td>

      {/* Flavour — searchable, filtered by product */}
      <td className="py-2 px-2">
        <SearchableSelect
          options={flavourOptions}
          value={item.flavour ?? ''}
          onChange={handleFlavourChange}
          placeholder="Any / All"
          disabled={!item.productName}
          className="min-w-[140px]"
          emptyLabel="No flavours"
        />
      </td>

      {/* Qty */}
      <td className="py-2 px-2">
        <input
          type="number"
          min="1"
          value={item.quantity || ''}
          onChange={e => handleQty(e.target.value)}
          placeholder="0"
          className="w-20 text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-right"
        />
      </td>

      {/* Unit Price */}
      <td className="py-2 px-2">
        <div className="relative">
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-slate-400">£</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={item.unitPrice || ''}
            onChange={e => handlePrice(e.target.value)}
            placeholder="0.00"
            className="w-24 text-xs border border-slate-200 rounded-lg pl-5 pr-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-right"
          />
        </div>
      </td>

      {/* Total */}
      <td className="py-2 px-3 text-xs font-semibold text-slate-700 text-right">
        £{item.totalPrice.toFixed(2)}
      </td>

      {/* Remove */}
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
