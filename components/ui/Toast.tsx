import React, { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-4 right-4 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border animate-in slide-in-from-bottom-5 duration-300 z-[100] ${
      type === 'success' 
        ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
        : 'bg-rose-50 border-rose-100 text-rose-800'
    }`}>
      {type === 'success' ? (
        <CheckCircle className="h-5 w-5 text-emerald-500" />
      ) : (
        <XCircle className="h-5 w-5 text-rose-500" />
      )}
      <p className="text-sm font-bold">{message}</p>
      <button 
        onClick={onClose}
        className="ml-2 p-1 hover:bg-black/5 rounded-lg transition-colors"
      >
        <X className="h-4 w-4 opacity-50" />
      </button>
    </div>
  );
};
