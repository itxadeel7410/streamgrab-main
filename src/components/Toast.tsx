import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type?: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className="fixed bottom-24 inset-x-4 sm:inset-x-auto sm:right-6 sm:left-auto z-50 flex items-center justify-center pointer-events-auto transition-all duration-300">
      <div className="bg-[#2d3449]/95 backdrop-blur-md text-[#dae2fd] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-[#6bd8cb]/30 max-w-md w-full">
        {toast.type === 'error' ? (
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
        ) : toast.type === 'info' ? (
          <Info className="w-5 h-5 text-[#00F0FF] shrink-0" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-[#6bd8cb] shrink-0" />
        )}
        <span className="text-sm font-medium flex-1">{toast.message}</span>
        <button
          onClick={onClose}
          className="text-[#bcc9c6] hover:text-white transition-colors p-1 rounded-lg"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
