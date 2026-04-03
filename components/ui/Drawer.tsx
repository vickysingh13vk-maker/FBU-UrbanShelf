import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Drawer: React.FC<DrawerProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer, 
  size = 'md' 
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const maxWidths = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
            />

            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className={`pointer-events-auto w-screen ${maxWidths[size]}`}
              >
                <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-2xl">
                  {/* Header */}
                  <div className="px-6 py-6 border-b border-slate-100">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h2>
                      <button
                        type="button"
                        className="rounded-full p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all"
                        onClick={onClose}
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative flex-1 px-6 py-8">
                    {children}
                  </div>

                  {/* Footer */}
                  {footer && (
                    <div className="flex-shrink-0 border-t border-slate-100 px-6 py-6 bg-slate-50/50">
                      {footer}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
