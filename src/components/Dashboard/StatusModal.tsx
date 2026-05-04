'use client';

import { X } from 'lucide-react';
import styles from './StatusModal.module.css';

interface StatusModalProps {
  type: 'success' | 'failed';
  data: {
    time: string;
    status: string;
    paymentSystem: string;
    amount: string;
    remarks: string;
  };
  onClose: () => void;
}

export default function StatusModal({ type, data, onClose }: StatusModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          <X size={18} />
        </button>

        <div className={`${styles.header} ${type === 'failed' ? styles.headerFailed : styles.headerSuccess}`}>
          <h3>{type === 'failed' ? 'Withdraw Failed' : 'Withdraw Successful'}</h3>
        </div>

        <div className={styles.body}>
          <div className={styles.row}>
            <span className={styles.label}>Time</span>
            <span className={styles.value}>{data.time}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Status</span>
            <span className={`${styles.value} ${type === 'failed' ? 'status-failed' : 'status-completed'}`}>
              {data.status}
            </span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Payment System</span>
            <span className={styles.value}>{data.paymentSystem}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Amount</span>
            <span className={styles.value}>{data.amount}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Remarks</span>
            <span className={styles.value}>{data.remarks}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
