'use client';

import { type ReactNode } from 'react';
import { ShoppingCart, ArrowUpFromLine, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import styles from './ConfirmModal.module.css';

/* ─── Types ─── */
export type ConfirmVariant = 'purchase' | 'withdraw' | 'danger' | 'info' | 'success';

export interface ConfirmDetail {
  label: string;
  value: string;
  accent?: boolean;
}

interface ConfirmModalProps {
  variant?: ConfirmVariant;
  title: string;
  message?: string;
  details?: ConfirmDetail[];
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel: () => void;
  /** If true, hides the cancel button (e.g. success result screens) */
  singleAction?: boolean;
  children?: ReactNode;
}

/* ─── Icon Map ─── */
const iconMap: Record<ConfirmVariant, ReactNode> = {
  purchase: <ShoppingCart size={28} />,
  withdraw: <ArrowUpFromLine size={28} />,
  danger: <AlertTriangle size={28} />,
  info: <Info size={28} />,
  success: <CheckCircle size={28} />,
};

const iconClassMap: Record<ConfirmVariant, string> = {
  purchase: styles.iconPurchase,
  withdraw: styles.iconWithdraw,
  danger: styles.iconDanger,
  info: styles.iconInfo,
  success: styles.iconSuccess,
};

export default function ConfirmModal({
  variant = 'info',
  title,
  message,
  details,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  singleAction = false,
  children,
}: ConfirmModalProps) {
  const confirmBtnClass =
    variant === 'purchase'
      ? `${styles.btnConfirm} ${styles.btnConfirmGreen}`
      : variant === 'danger'
        ? `${styles.btnConfirm} ${styles.btnConfirmDanger}`
        : styles.btnConfirm;

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.box} onClick={(e) => e.stopPropagation()}>
        {/* Icon */}
        <div className={`${styles.iconWrapper} ${iconClassMap[variant]}`}>
          {iconMap[variant]}
        </div>

        {/* Title & Message */}
        <h3 className={styles.title}>{title}</h3>
        {message && <p className={styles.message}>{message}</p>}

        {/* Detail Rows */}
        {details && details.length > 0 && (
          <div className={styles.details}>
            {details.map((d, i) => (
              <div key={i} className={styles.detailRow}>
                <span className={styles.detailLabel}>{d.label}</span>
                <span className={`${styles.detailValue} ${d.accent ? styles.detailValueAccent : ''}`}>
                  {d.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Custom children */}
        {children}

        {/* Actions */}
        {singleAction ? (
          <button className={styles.btnSingle} onClick={onCancel}>
            {confirmLabel}
          </button>
        ) : (
          <div className={styles.actions}>
            <button className={styles.btnCancel} onClick={onCancel}>
              {cancelLabel}
            </button>
            <button className={confirmBtnClass} onClick={onConfirm}>
              {confirmLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
