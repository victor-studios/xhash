'use client';

import { useState } from 'react';
import { X, Upload } from 'lucide-react';
import styles from './UploadProofModal.module.css';

interface UploadProofModalProps {
  orderNumber: string;
  depositDate: string;
  onClose: () => void;
}

export default function UploadProofModal({ orderNumber, depositDate, onClose }: UploadProofModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [txid, setTxid] = useState('');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          <X size={18} />
        </button>

        <div className={styles.header}>
          <h3>Withdraw Status</h3>
        </div>

        <div className={styles.detailRow}>
          <span className={styles.label}>Order Number:</span>
          <span className={styles.value}>{orderNumber}</span>
        </div>
        <div className={styles.detailRow}>
          <span className={styles.label}>Deposit Initiated :</span>
          <span className={styles.value}>{depositDate}</span>
        </div>

        {/* File Upload */}
        <div className={styles.uploadRow}>
          <input
            type="text"
            className="dash-input"
            placeholder="Add File"
            value={file?.name || ''}
            readOnly
            style={{ flex: 1 }}
          />
          <label className={styles.uploadBtn}>
            <Upload size={14} />
            Upload
            <input
              type="file"
              hidden
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              id="upload-proof-file"
            />
          </label>
        </div>

        {/* TXID Input */}
        <input
          type="text"
          className="dash-input"
          placeholder="TRXID/Transaction ID/Hash number"
          value={txid}
          onChange={(e) => setTxid(e.target.value)}
          style={{ width: '100%', marginBottom: 'var(--space-lg)' }}
          id="upload-proof-txid"
        />

        <button className="dash-btn-primary" id="upload-proof-submit">
          Submit
        </button>
      </div>
    </div>
  );
}
