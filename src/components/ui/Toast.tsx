'use client';

import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react';
import { X, CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react';
import styles from './Toast.module.css';

/* ─── Types ─── */
export type ToastVariant = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  variant: ToastVariant;
  title: string;
  message?: string;
  duration?: number; // ms, default 3500
  exiting?: boolean;
}

interface ToastContextValue {
  toast: (opts: Omit<Toast, 'id' | 'exiting'>) => void;
}

/* ─── Context ─── */
const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}

/* ─── Icons ─── */
const iconMap: Record<ToastVariant, ReactNode> = {
  success: <CheckCircle size={18} />,
  error: <XCircle size={18} />,
  info: <Info size={18} />,
  warning: <AlertTriangle size={18} />,
};

/* ─── Provider ─── */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)));
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 260);
  }, []);

  const toast = useCallback(
    (opts: Omit<Toast, 'id' | 'exiting'>) => {
      const id = `toast-${++counter.current}`;
      const duration = opts.duration ?? 3500;

      setToasts((prev) => [...prev, { ...opts, id, duration }]);

      setTimeout(() => dismiss(id), duration);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* Toast Container */}
      <div className={styles.toastContainer} aria-live="polite" aria-label="Notifications">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`${styles.toast} ${styles[t.variant]} ${t.exiting ? styles.exiting : ''}`}
            role="alert"
          >
            <div className={styles.toastIcon}>{iconMap[t.variant]}</div>
            <div className={styles.toastContent}>
              <div className={styles.toastTitle}>{t.title}</div>
              {t.message && <div className={styles.toastMessage}>{t.message}</div>}
            </div>
            <button className={styles.toastClose} onClick={() => dismiss(t.id)} aria-label="Dismiss">
              <X size={14} />
            </button>
            <div
              className={styles.progressBar}
              style={{ animationDuration: `${t.duration ?? 3500}ms` }}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
