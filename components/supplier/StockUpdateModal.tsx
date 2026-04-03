import React, { useState } from 'react';
import { Modal, Button, Input } from '../ui';
import { EnrichedInventoryItem } from '../../types';

const StockUpdateModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  item: EnrichedInventoryItem | null;
  onUpdate: (id: string, adjustment: { type: 'Add' | 'Reduce'; quantity: number; reason: string }) => void;
}> = ({ isOpen, onClose, item, onUpdate }) => {
  const [type, setType] = useState<'Add' | 'Reduce'>('Add');
  const [quantity, setQuantity] = useState(0);
  const [reason, setReason] = useState('');

  if (!item) return null;

  const handleSubmit = () => {
    onUpdate(item.id, { type, quantity, reason });
    onClose();
    // Reset form
    setType('Add');
    setQuantity(0);
    setReason('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Update Stock Levels"
      footer={
        <div className="flex justify-end gap-3 w-full">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit}>Update Stock</Button>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
          <div className="flex items-center gap-3">
            <img src={item.image} alt="" className="h-12 w-12 rounded-lg border border-slate-200 object-cover" referrerPolicy="no-referrer" />
            <div>
              <p className="text-sm font-bold text-slate-900">{item.product}</p>
              <p className="text-xs text-slate-500 font-mono">{item.sku}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Warehouse</label>
            <Input value={item.warehouse} disabled />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Adjustment Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'Add' | 'Reduce')}
              className="w-full h-10 px-4 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            >
              <option value="Add">Add Stock</option>
              <option value="Reduce">Reduce Stock</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Quantity</label>
          <Input
            type="number"
            placeholder="Enter quantity..."
            value={quantity || ''}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Reason for Adjustment</label>
          <textarea
            className="w-full p-4 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all min-h-[100px]"
            placeholder="Explain why this adjustment is being made..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
      </div>
    </Modal>
  );
};

export default StockUpdateModal;
