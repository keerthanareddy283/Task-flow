import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ToastMessage } from '../../types';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

export interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          const typeIcons = {
            info: <Info size={16} className="text-blue-500 shrink-0" />,
            success: <CheckCircle size={16} className="text-emerald-500 shrink-0" />,
            warning: <AlertCircle size={16} className="text-amber-500 shrink-0" />,
            error: <AlertCircle size={16} className="text-rose-500 shrink-0" />,
          };

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto flex items-center justify-between gap-3 p-3.5 bg-slate-900 text-slate-100 dark:bg-slate-800 dark:text-slate-100 rounded-xl shadow-lg border border-slate-700/80 text-sm"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {typeIcons[toast.type || 'info']}
                <span className="truncate text-xs sm:text-sm font-medium">{toast.message}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {toast.action && (
                  <button
                    onClick={() => {
                      toast.action?.onClick();
                      onDismiss(toast.id);
                    }}
                    className="text-xs font-semibold text-blue-400 hover:text-blue-300 dark:text-blue-300 dark:hover:text-blue-200 uppercase tracking-wider px-2 py-1 rounded hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
                  >
                    {toast.action.label}
                  </button>
                )}
                <button
                  onClick={() => onDismiss(toast.id)}
                  aria-label="Dismiss notification"
                  className="p-1 rounded text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
