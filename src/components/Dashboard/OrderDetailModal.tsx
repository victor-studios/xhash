'use client';

import { X } from 'lucide-react';

interface OrderDetailModalProps {
  data: {
    time: string;
    type: string;
    amount: string;
    balance: string;
  };
  onClose: () => void;
}

export default function OrderDetailModal({ data, onClose }: OrderDetailModalProps) {
  const isPositive = data.amount.startsWith('+');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          <X size={18} />
        </button>

        <div className="modal-header">
          <h3>Transaction Details</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(30, 35, 72, 0.5)' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>Time</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{data.time}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(30, 35, 72, 0.5)' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>Type</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{data.type}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(30, 35, 72, 0.5)' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>Amount</span>
            <span style={{
              fontSize: '0.95rem',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              color: isPositive ? 'var(--accent-green)' : 'var(--accent-red)',
            }}>
              {data.amount}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>Balance After</span>
            <span style={{ fontSize: '0.95rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
              {data.balance}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
