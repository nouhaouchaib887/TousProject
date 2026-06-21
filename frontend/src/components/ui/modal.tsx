import React, { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxSizeClass?: string;
  id?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxSizeClass = 'max-w-lg',
  id,
}) => {
  // Prevent body scrolling when Modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div id={id} className="relative z-50">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
          />

          {/* Scrolling Container */}
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              {/* Modal Box */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                className={`w-full ${maxSizeClass} transform overflow-hidden rounded-xl bg-white text-left align-middle shadow-2xl border border-slate-200 transition-all`}
              >
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
                  <h3 className="text-base font-bold text-slate-800 leading-6 tracking-tight">
                    {title}
                  </h3>
                  <button
                    onClick={onClose}
                    className="p-1 px-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    title="Fermer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Body Content */}
                <div className="p-6">{children}</div>
              </motion.div>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
