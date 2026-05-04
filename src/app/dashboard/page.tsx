'use client';

import Link from 'next/link';
import { Copy, Wallet, ArrowUpFromLine, TrendingUp, Users, Trophy, CheckSquare, AlertTriangle, ListChecks, Activity, Cpu, Clock, Zap } from 'lucide-react';
import styles from './Dashboard.module.css';

// Mock weekly mining data for the graph
const weeklyData = [
  { day: 'Mon', earned: 42, mined: 35 },
  { day: 'Tue', earned: 58, mined: 48 },
  { day: 'Wed', earned: 35, mined: 30 },
  { day: 'Thu', earned: 72, mined: 60 },
  { day: 'Fri', earned: 65, mined: 55 },
  { day: 'Sat', earned: 80, mined: 70 },
  { day: 'Sun', earned: 48, mined: 40 },
];

const maxVal = Math.max(...weeklyData.map(d => Math.max(d.earned, d.mined)));

export default function DashboardPage() {
  const handleCopy = () => {
    navigator.clipboard.writeText('https://xhash.io/r/kr950MG425');
  };

  return (
    <>
      <h1 className="dash-page-title">Overview</h1>

      {/* Balance Cards */}
      <div className={styles.balanceRow}>
        <div className={styles.balanceCard}>
          <div className={styles.balanceIcon} style={{ background: 'linear-gradient(135deg, #FFD700, #FF8C00)' }}>
            <Wallet size={28} color="#070A14" />
          </div>
          <div className={styles.balancePair}>
            <div className={styles.balanceItem}>
              <span className={styles.balanceLabel}>Available Balance</span>
              <span className={styles.balanceValue} style={{ color: 'var(--accent-green)' }}>$ 340</span>
            </div>
            <div className={styles.balanceItem}>
              <span className={styles.balanceLabel}>Total Deposit</span>
              <span className={styles.balanceValue}>$400</span>
              <Link href="/dashboard/deposit" className={styles.actionBtn}>
                <Wallet size={14} />
                Deposit
              </Link>
            </div>
          </div>
        </div>

        <div className={styles.balanceCard}>
          <div className={styles.balanceIcon} style={{ background: 'linear-gradient(135deg, #FF6B6B, #ee5a24)' }}>
            <TrendingUp size={28} color="#fff" />
          </div>
          <div className={styles.balancePair}>
            <div className={styles.balanceItem}>
              <span className={styles.balanceLabel}>total Earned</span>
              <span className={styles.balanceValue} style={{ color: 'var(--accent-green)' }}>$ 340</span>
            </div>
            <div className={styles.balanceItem}>
              <span className={styles.balanceLabel}>Total Withdrawn</span>
              <span className={styles.balanceValue}>$400</span>
              <Link href="/dashboard/withdraw" className={styles.actionBtn}>
                <ArrowUpFromLine size={14} />
                Withdraw
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mining Progress Graph */}
      <div className={styles.graphSection}>
        <div className={styles.graphHeader}>
          <h2 className={styles.sectionTitle}>Mining Progress</h2>
          <div className={styles.graphLegend}>
            <span className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: 'var(--accent-primary)' }} />
              Earned
            </span>
            <span className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: 'var(--accent-secondary)' }} />
              Mined
            </span>
          </div>
        </div>

        <div className={styles.graph}>
          {/* Y-axis labels */}
          <div className={styles.yAxis}>
            <span>${maxVal}</span>
            <span>${Math.round(maxVal * 0.75)}</span>
            <span>${Math.round(maxVal * 0.5)}</span>
            <span>${Math.round(maxVal * 0.25)}</span>
            <span>$0</span>
          </div>

          {/* Bars */}
          <div className={styles.bars}>
            {weeklyData.map((d) => (
              <div key={d.day} className={styles.barGroup}>
                <div className={styles.barPair}>
                  <div
                    className={styles.bar}
                    style={{
                      height: `${(d.earned / maxVal) * 100}%`,
                      background: 'var(--gradient-primary)',
                    }}
                    title={`Earned: $${d.earned}`}
                  />
                  <div
                    className={styles.bar}
                    style={{
                      height: `${(d.mined / maxVal) * 100}%`,
                      background: 'linear-gradient(180deg, var(--accent-secondary), rgba(0, 210, 255, 0.4))',
                    }}
                    title={`Mined: $${d.mined}`}
                  />
                </div>
                <span className={styles.barLabel}>{d.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className={styles.quickStats}>
        <div className={styles.quickStatCard}>
          <div className={styles.quickStatIcon} style={{ background: 'rgba(108, 92, 231, 0.12)' }}>
            <Activity size={20} color="var(--accent-primary)" />
          </div>
          <div>
            <span className={styles.quickStatLabel}>Hash Rate</span>
            <span className={styles.quickStatValue}>245.8 MH/s</span>
          </div>
        </div>
        <div className={styles.quickStatCard}>
          <div className={styles.quickStatIcon} style={{ background: 'rgba(0, 230, 118, 0.12)' }}>
            <Cpu size={20} color="var(--accent-green)" />
          </div>
          <div>
            <span className={styles.quickStatLabel}>Active Miners</span>
            <span className={styles.quickStatValue}>3</span>
          </div>
        </div>
        <div className={styles.quickStatCard}>
          <div className={styles.quickStatIcon} style={{ background: 'rgba(255, 215, 0, 0.12)' }}>
            <Zap size={20} color="var(--accent-gold)" />
          </div>
          <div>
            <span className={styles.quickStatLabel}>Daily Return</span>
            <span className={styles.quickStatValue}>$12.50</span>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-info">
            <h4>Profits</h4>
            <span className="stat-value" style={{ color: 'var(--accent-green)' }}>$ 340</span>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(0, 230, 118, 0.12)', color: 'var(--accent-green)' }}>
            <TrendingUp size={24} />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <h4>Affiliates</h4>
            <span className="stat-value" style={{ color: 'var(--accent-green)' }}>$ 340</span>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(0, 210, 255, 0.12)', color: 'var(--accent-secondary)' }}>
            <Users size={24} />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <h4>Rewards</h4>
            <span className="stat-value" style={{ color: 'var(--accent-green)' }}>$ 340</span>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(255, 215, 0, 0.12)', color: 'var(--accent-gold)' }}>
            <Trophy size={24} />
          </div>
        </div>
      </div>

      {/* My Orders */}
      <h2 className={styles.sectionTitle}>My orders</h2>
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-info">
            <h4>Active</h4>
            <span className="stat-value" style={{ color: 'var(--accent-green)' }}>2</span>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(0, 230, 118, 0.12)', color: 'var(--accent-green)' }}>
            <CheckSquare size={24} />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <h4>Expired</h4>
            <span className="stat-value" style={{ color: 'var(--accent-gold)' }}>5</span>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(255, 215, 0, 0.12)', color: 'var(--accent-gold)' }}>
            <AlertTriangle size={24} />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <h4>All</h4>
            <span className="stat-value" style={{ color: 'var(--accent-secondary)' }}>7</span>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(0, 210, 255, 0.12)', color: 'var(--accent-secondary)' }}>
            <ListChecks size={24} />
          </div>
        </div>
      </div>

      {/* Affiliate Link */}
      <div className="affiliate-bar">
        <div className="affiliate-bar-label">Affiliate Link :</div>
        <div className="affiliate-bar-url">https://xhash.io/r/kr950MG425</div>
        <button className="affiliate-bar-copy" onClick={handleCopy} aria-label="Copy affiliate link" id="copy-affiliate-link">
          <Copy size={18} />
        </button>
      </div>
    </>
  );
}
