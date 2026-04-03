import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer, size = 'md' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const maxWidths = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-2xl',
    xl: 'max-w-5xl'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        <div className="fixed inset-0 bg-slate-900/50 transition-opacity backdrop-blur-sm" onClick={onClose} />
        
        <div className={`relative transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all sm:my-8 w-full ${maxWidths[size]}`}>
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold leading-6 text-slate-900">{title}</h3>
              <button onClick={onClose} className="rounded-full p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="px-4 py-5 sm:p-6 max-h-[70vh] overflow-y-auto bg-slate-50/50">
            {children}
          </div>
          {footer && (
            <div className="bg-white px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 border-t border-slate-200">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
