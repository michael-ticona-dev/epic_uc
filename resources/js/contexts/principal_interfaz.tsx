import React, { createContext, useContext, useState } from 'react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

interface UIContextType {
  toasts: Toast[];
  showToast: (type: Toast['type'], message: string) => void;
  removeToast: (id: string) => void;
  prefersReducedMotion: boolean;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const showToast = (type: Toast['type'], message: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((current) => [...current, { id, type, message }]);
    setTimeout(() => removeToast(id), 5000);
  };

  const removeToast = (id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  };

  const value = {
    toasts,
    showToast,
    removeToast,
    prefersReducedMotion,
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}
