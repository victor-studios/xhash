'use client';

import { X, Copy } from 'lucide-react';
import styles from './DepositModal.module.css';

interface DepositModalProps {
  onClose: () => void;
  amount: string;
  address: string;
}

export default function DepositModal({ onClose, amount, address }: DepositModalProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          <X size={18} />
        </button>

        <div className="modal-header">
          <div className={styles.btcIcon}>₿</div>
          <h3>Deposit BTC</h3>
        </div>

        {/* QR Code */}
        <div className={styles.qrSection}>
          <div className={styles.qrCode}>
            {/* SVG QR Code pattern */}
            <svg viewBox="0 0 200 200" width="180" height="180">
              <rect width="200" height="200" fill="white" />
              {/* QR-like pattern */}
              <rect x="10" y="10" width="50" height="50" fill="black" />
              <rect x="15" y="15" width="40" height="40" fill="white" />
              <rect x="20" y="20" width="30" height="30" fill="black" />
              <rect x="140" y="10" width="50" height="50" fill="black" />
              <rect x="145" y="15" width="40" height="40" fill="white" />
              <rect x="150" y="20" width="30" height="30" fill="black" />
              <rect x="10" y="140" width="50" height="50" fill="black" />
              <rect x="15" y="145" width="40" height="40" fill="white" />
              <rect x="20" y="150" width="30" height="30" fill="black" />
              {/* Data modules */}
              {Array.from({ length: 15 }, (_, i) =>
                Array.from({ length: 15 }, (_, j) => {
                  const show = (i * 7 + j * 13 + i * j) % 3 !== 0;
                  if (!show) return null;
                  const x = 70 + j * 5;
                  const y = 10 + i * 5;
                  if (x > 135 && y < 65) return null;
                  if (x < 65 && y < 65) return null;
                  if (x < 65 && y > 135) return null;
                  return <rect key={`${i}-${j}`} x={x} y={y} width="4" height="4" fill="black" />;
                })
              )}
              {Array.from({ length: 10 }, (_, i) =>
                Array.from({ length: 24 }, (_, j) => {
                  const show = (i * 11 + j * 7) % 3 !== 0;
                  if (!show) return null;
                  return <rect key={`b-${i}-${j}`} x={10 + j * 8} y={70 + i * 7} width="5" height="5" fill="black" />;
                })
              )}
            </svg>
          </div>
        </div>

        <p className={styles.instruction}>
          Please send funds to the specified address or use a QR code for a deposit. Your amount will be deposited in your XHash account.
        </p>
        <p className={styles.network}>Network: Bitcoin</p>

        {/* Amount Field */}
        <div className="copy-field">
          <input type="text" value={amount} readOnly />
          <button onClick={() => copyToClipboard(amount)} aria-label="Copy amount">
            <Copy size={16} />
          </button>
        </div>

        {/* Address Field */}
        <div className="copy-field">
          <input type="text" value={address} readOnly />
          <button onClick={() => copyToClipboard(address)} aria-label="Copy address">
            <Copy size={16} />
          </button>
        </div>

        <p className={styles.warning}>
          The deposit will be processed within 30 minutes; uploading TXID / Transaction ID / Hash number is recommended. You can consult the 24-hour online customer service if you have any questions.
        </p>
      </div>
    </div>
  );
}
