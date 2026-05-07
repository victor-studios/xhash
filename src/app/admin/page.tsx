'use client';

import { useState, useEffect } from 'react';
import { useAdmin } from './layout';
import {
  Users,
  Wallet,
  ArrowUpFromLine,
  TrendingUp,
  ShoppingBag,
  MessageSquare,
  DollarSign,
  Clock,
  Loader2,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { admin, token } = useAdmin();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      if (!token) return;
      try {
        const res = await fetch('/api/admin/stats', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [token]);

  if (loading) {
    return (
      <div className="admin-loading">
        <Loader2 size={24} className="animate-spin" />
        Loading dashboard...
      </div>
    );
  }

  const timeAgo = (date: string) => {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard Overview</h1>
          <p className="admin-page-subtitle">Welcome back, {admin?.displayName}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <div className="admin-stat-icon" style={{ background: 'rgba(0, 210, 255, 0.12)', color: 'var(--accent-secondary)' }}>
              <Users size={22} />
            </div>
          </div>
          <div className="admin-stat-value">{stats?.totalUsers || 0}</div>
          <div className="admin-stat-label">Total Users</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <div className="admin-stat-icon" style={{ background: 'rgba(0, 230, 118, 0.12)', color: 'var(--accent-green)' }}>
              <Wallet size={22} />
            </div>
          </div>
          <div className="admin-stat-value">${(stats?.totalDeposits || 0).toLocaleString()}</div>
          <div className="admin-stat-label">Total Deposits</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <div className="admin-stat-icon" style={{ background: 'rgba(255, 71, 87, 0.12)', color: 'var(--accent-red)' }}>
              <ArrowUpFromLine size={22} />
            </div>
          </div>
          <div className="admin-stat-value">${(stats?.totalWithdrawals || 0).toLocaleString()}</div>
          <div className="admin-stat-label">Total Withdrawals</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <div className="admin-stat-icon" style={{ background: 'rgba(108, 92, 231, 0.12)', color: 'var(--accent-primary)' }}>
              <DollarSign size={22} />
            </div>
          </div>
          <div className="admin-stat-value">${(stats?.revenue || 0).toLocaleString()}</div>
          <div className="admin-stat-label">Net Revenue</div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="admin-stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <div className="admin-stat-icon" style={{ background: 'rgba(255, 215, 0, 0.12)', color: 'var(--accent-gold)' }}>
              <Clock size={22} />
            </div>
          </div>
          <div className="admin-stat-value">{stats?.pendingWithdrawals || 0}</div>
          <div className="admin-stat-label">Pending Withdrawals</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <div className="admin-stat-icon" style={{ background: 'rgba(0, 230, 118, 0.12)', color: 'var(--accent-green)' }}>
              <ShoppingBag size={22} />
            </div>
          </div>
          <div className="admin-stat-value">{stats?.activeOrders || 0} / {stats?.totalOrders || 0}</div>
          <div className="admin-stat-label">Active / Total Orders</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <div className="admin-stat-icon" style={{ background: 'rgba(0, 210, 255, 0.12)', color: 'var(--accent-secondary)' }}>
              <MessageSquare size={22} />
            </div>
          </div>
          <div className="admin-stat-value">{stats?.openTickets || 0}</div>
          <div className="admin-stat-label">Open Support Tickets</div>
        </div>
      </div>

      {/* Two Column — Recent Activity */}
      <div className="admin-two-col">
        {/* Recent Transactions */}
        <div className="admin-card">
          <h3 className="admin-card-title">Recent Transactions</h3>
          {stats?.recentTransactions?.length > 0 ? (
            <div>
              {stats.recentTransactions.map((tx: any) => (
                <div key={tx.id} className="admin-activity-item">
                  <div
                    className="admin-activity-dot"
                    style={{
                      background: tx.type === 'deposit'
                        ? 'var(--accent-green)'
                        : tx.status === 'Completed' || tx.status === 'Confirmed'
                        ? 'var(--accent-green)'
                        : tx.status === 'Pending' || tx.status === 'Processing'
                        ? 'var(--accent-gold)'
                        : 'var(--accent-red)',
                    }}
                  />
                  <div className="admin-activity-content">
                    <div className="admin-activity-text">
                      <strong style={{ color: tx.type === 'deposit' ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                        {tx.type === 'deposit' ? '+ ' : '− '}${tx.amount}
                      </strong>
                      {' — '}
                      <span style={{ color: 'var(--text-muted)' }}>{tx.currency}</span>
                      {' · '}
                      <span className={`admin-badge ${
                        tx.status === 'Completed' || tx.status === 'Confirmed' ? 'admin-badge-green' :
                        tx.status === 'Pending' || tx.status === 'Processing' ? 'admin-badge-gold' :
                        'admin-badge-red'
                      }`}>
                        {tx.status}
                      </span>
                    </div>
                    <div className="admin-activity-time">{timeAgo(tx.created_at)}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="admin-empty">
              <div className="admin-empty-text">No recent transactions</div>
            </div>
          )}
        </div>

        {/* Recent Users */}
        <div className="admin-card">
          <h3 className="admin-card-title">Recent Users</h3>
          {stats?.recentUsers?.length > 0 ? (
            <div>
              {stats.recentUsers.map((user: any) => (
                <div key={user.id} className="admin-activity-item">
                  <div className="admin-activity-dot" style={{ background: 'var(--accent-primary)' }} />
                  <div className="admin-activity-content">
                    <div className="admin-activity-text">
                      <strong>{user.display_name || user.username || 'User'}</strong>
                      {' — '}
                      <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
                        @{user.username || user.id?.substring(0, 8)}
                      </span>
                    </div>
                    <div className="admin-activity-time">
                      Balance: ${Number(user.available_balance || 0).toFixed(2)} · {timeAgo(user.created_at)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="admin-empty">
              <div className="admin-empty-text">No users yet</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
