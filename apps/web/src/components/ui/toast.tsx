'use client';

import React, { createContext, useContext, useState } from 'react';
import { Icon } from './icons';

interface ToastItem {
  id: number;
  message: string;
  points?: number;
  type?: 'success' | 'info' | 'error';
}

interface ToastContextType {
  showToast: (message: string, points?: number, type?: 'success' | 'info' | 'error') => void;
}

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = (message: string, points?: number, type: 'success' | 'info' | 'error' = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, points, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div id="toasts" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className="toast animate-in fade-in slide-in-from-bottom-2 duration-200">
            {t.points ? (
              <span className="pts">+{t.points}</span>
            ) : (
              <Icon name={t.type === 'error' ? 'x' : 'check'} className={t.type === 'error' ? 'text-brand' : 'text-ok'} />
            )}
            <div>
              <b>{t.message}</b>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
