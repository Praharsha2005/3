'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (message: string, type: ToastType) => void;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType = 'info') => {
    const id = Date.now().toString();
    const newToast: Toast = { id, message, type };
    setToasts(prev => [...prev, newToast]);
    
    // Auto hide toast after 3 seconds
    setTimeout(() => {
      hideToast(id);
    }, 3000);
  };

  const hideToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const value = {
    toasts,
    showToast,
    hideToast,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <ToastComponent key={toast.id} toast={toast} onHide={hideToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastComponent({ toast, onHide }: { toast: Toast; onHide: (id: string) => void }) {
  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500',
  }[toast.type];

  useEffect(() => {
    const timer = setTimeout(() => {
      onHide(toast.id);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [toast.id, onHide]);

  return (
    <div className={`${bgColor} text-white px-4 py-2 rounded-md shadow-lg flex items-center`}>
      <span className="flex-1">{toast.message}</span>
      <button 
        onClick={() => onHide(toast.id)}
        className="ml-4 text-white hover:text-gray-200"
      >
        &times;
      </button>
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}