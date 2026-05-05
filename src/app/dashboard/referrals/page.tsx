'use client';

import { Copy, Users, CheckSquare, TrendingUp } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import styles from './Referrals.module.css';

const referralHistory = [
  { referral: 'username', action: 'Created Account', earning: '$0' },
  { referral: 'username', action: '3 mins Ago', earning: '$5' },
  { referral: 'username', action: '3 mins Ago', earning: '$5' },
  { referral: 'username', action: '3 mins Ago', earning: '$5' },
];

export default function ReferralsPage() {
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText('https://xhash.io/r/kr950MG425');
    toast({ variant: 'success', title: 'Copied!', message: 'Affiliate link copied to clipboard.' });
  };

  return (
    <>
      {/* Info Banner */}
      <div className={styles.infoBanner}>
        <div className={styles.bannerIcon}>
          <span style={{ fontSize: '3rem' }}>💰</span>
        </div>
        <div className={styles.bannerText}>
          <p>
            We allow you to earn money by recommending our website to others. You can start making money even if you
            do not invest. You&apos;ll earn up to 4.5% of their purchase on each order. See the link below, copy-paste that link
            and share it with your friends, and earn a massive referral reward.
          </p>
          <p className={styles.bannerNote}>
            Note: Affiliate Program doesn&apos;t include $10 Primary Mining.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-info">
            <h4>Total Referrals</h4>
            <span className="stat-value" style={{ color: 'var(--accent-green)' }}>13</span>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(0, 230, 118, 0.12)', color: 'var(--accent-green)' }}>
            <Users size={24} />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <h4>Referral Earning</h4>
            <span className="stat-value" style={{ color: 'var(--accent-gold)' }}>$455</span>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(255, 215, 0, 0.12)', color: 'var(--accent-gold)' }}>
            <TrendingUp size={24} />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <h4>Verified Referrals</h4>
            <span className="stat-value" style={{ color: 'var(--accent-secondary)' }}>10</span>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(0, 210, 255, 0.12)', color: 'var(--accent-secondary)' }}>
            <CheckSquare size={24} />
          </div>
        </div>
      </div>

      {/* Affiliate Link */}
      <div className="affiliate-bar" style={{ marginBottom: 'var(--space-2xl)' }}>
        <div className="affiliate-bar-label">Affiliate Link :</div>
        <div className="affiliate-bar-url">https://xhash.io/r/kr950MG425</div>
        <button className="affiliate-bar-copy" onClick={handleCopy} aria-label="Copy affiliate link">
          <Copy size={18} />
        </button>
      </div>

      {/* Referral History Table */}
      <div className="dash-table-wrap">
        <table className="dash-table">
          <thead>
            <tr>
              <th>Referral</th>
              <th>Action</th>
              <th>Total Earning</th>
            </tr>
          </thead>
          <tbody>
            {referralHistory.map((row, i) => (
              <tr key={i}>
                <td>{row.referral}</td>
                <td>{row.action}</td>
                <td style={{ textAlign: 'right', color: 'var(--text-primary)', fontWeight: 600 }}>{row.earning}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
