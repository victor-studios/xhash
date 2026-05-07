'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from './layout';
import {
  Users,
  Wallet,
  ArrowUpFromLine,
  ArrowDownToLine,
  TrendingUp,
  ShoppingBag,
  MessageSquare,
  DollarSign,
  Clock,
  AlertTriangle,
  ChevronRight,
  Loader2,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { admin, token } = useAdmin();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (admin && admin.level === 3) {
      router.replace('/admin/support');
      return;
    }

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
    if (!date) return '—';
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (isNaN(seconds) || seconds < 0) return '—';
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      'Completed': 'admin-badge-green',
      'Failed': 'admin-badge-red',
      'In Progress': 'admin-badge-gold',
      'Waiting for payment': 'admin-badge-blue',
    };
    return map[status] || 'admin-badge-purple';
  };

  const getTypeColor = (type: string) => {
    const map: Record<string, string> = {
      deposit: 'var(--accent-green)',
      withdraw: 'var(--accent-red)',
      order: 'var(--accent-primary)',
      reward: 'var(--accent-gold)',
    };
    return map[type] || 'var(--text-secondary)';
  };

  const getTypeIcon = (type: string) => {
    const map: Record<string, React.ReactNode> = {
      deposit: <ArrowDownToLine size={14} />,
      withdraw: <ArrowUpFromLine size={14} />,
      order: <ShoppingBag size={14} />,
    };
    return map[type] || <DollarSign size={14} />;
  };

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard Overview</h1>
          <p className="admin-page-subtitle">Welcome back, {admin?.displayName}</p>
        </div>
      </div>

      {/* ── Primary Stats Row ── */}
      <div className="admin-stats-grid">
        <div
          className="admin-stat-card"
          onClick={() => router.push('/admin/users')}
          style={{ cursor: 'pointer' }}
        >
          <div className="admin-stat-header">
            <div className="admin-stat-icon" style={{ background: 'rgba(0, 210, 255, 0.12)', color: 'var(--accent-secondary)' }}>
              <Users size={22} />
            </div>
            <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
          </div>
          <div className="admin-stat-value">{stats?.totalUsers || 0}</div>
          <div className="admin-stat-label">Total Users</div>
        </div>

        <div
          className="admin-stat-card"
          onClick={() => router.push('/admin/deposits')}
          style={{ cursor: 'pointer' }}
        >
          <div className="admin-stat-header">
            <div className="admin-stat-icon" style={{ background: 'rgba(0, 230, 118, 0.12)', color: 'var(--accent-green)' }}>
              <Wallet size={22} />
            </div>
            <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
          </div>
          <div className="admin-stat-value" style={{ color: 'var(--accent-green)' }}>
            ${(stats?.totalDeposits || 0).toLocaleString()}
          </div>
          <div className="admin-stat-label">Total Deposits</div>
        </div>

        <div
          className="admin-stat-card"
          onClick={() => router.push('/admin/withdrawals')}
          style={{ cursor: 'pointer' }}
        >
          <div className="admin-stat-header">
            <div className="admin-stat-icon" style={{ background: 'rgba(255, 71, 87, 0.12)', color: 'var(--accent-red)' }}>
              <ArrowUpFromLine size={22} />
            </div>
            <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
          </div>
          <div className="admin-stat-value" style={{ color: 'var(--accent-red)' }}>
            ${(stats?.totalWithdrawals || 0).toLocaleString()}
          </div>
          <div className="admin-stat-label">Total Withdrawals</div>
        </div>

        <div
          className="admin-stat-card"
          style={{ cursor: 'default' }}
        >
          <div className="admin-stat-header">
            <div className="admin-stat-icon" style={{ background: 'rgba(108, 92, 231, 0.12)', color: 'var(--accent-primary)' }}>
              <TrendingUp size={22} />
            </div>
          </div>
          <div className="admin-stat-value" style={{ color: (stats?.revenue || 0) >= 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
            ${Math.abs(stats?.revenue || 0).toLocaleString()}
          </div>
          <div className="admin-stat-label">Net Revenue</div>
        </div>
      </div>

      {/* ── Secondary Stats Row ── */}
      <div className="admin-stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div
          className="admin-stat-card"
          onClick={() => router.push('/admin/withdrawals')}
          style={{ cursor: 'pointer' }}
        >
          <div className="admin-stat-header">
            <div className="admin-stat-icon" style={{ background: 'rgba(255, 215, 0, 0.12)', color: 'var(--accent-gold)' }}>
              <Clock size={22} />
            </div>
            <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
          </div>
          <div className="admin-stat-value" style={{ color: (stats?.pendingWithdrawals || 0) > 0 ? 'var(--accent-gold)' : 'var(--text-primary)' }}>
            {stats?.pendingWithdrawals || 0}
          </div>
          <div className="admin-stat-label">Pending Withdrawals</div>
        </div>

        <div
          className="admin-stat-card"
          onClick={() => router.push('/admin/deposits')}
          style={{ cursor: 'pointer' }}
        >
          <div className="admin-stat-header">
            <div className="admin-stat-icon" style={{ background: 'rgba(0, 210, 255, 0.12)', color: 'var(--accent-secondary)' }}>
              <ArrowDownToLine size={22} />
            </div>
            <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
          </div>
          <div className="admin-stat-value">{stats?.pendingDeposits || 0}</div>
          <div className="admin-stat-label">Pending Deposits</div>
        </div>

        <div
          className="admin-stat-card"
          style={{ cursor: 'default' }}
        >
          <div className="admin-stat-header">
            <div className="admin-stat-icon" style={{ background: 'rgba(0, 230, 118, 0.12)', color: 'var(--accent-green)' }}>
              <ShoppingBag size={22} />
            </div>
          </div>
          <div className="admin-stat-value">
            <span style={{ color: 'var(--accent-green)' }}>{stats?.activeOrders || 0}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 400 }}> / {stats?.totalOrders || 0}</span>
          </div>
          <div className="admin-stat-label">Active / Total Orders</div>
        </div>

        <div
          className="admin-stat-card"
          onClick={() => router.push('/admin/support')}
          style={{ cursor: 'pointer' }}
        >
          <div className="admin-stat-header">
            <div className="admin-stat-icon" style={{ background: 'rgba(255, 71, 87, 0.12)', color: 'var(--accent-red)' }}>
              <AlertTriangle size={22} />
            </div>
            <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
          </div>
          <div className="admin-stat-value" style={{ color: (stats?.failedTransactions || 0) > 0 ? 'var(--accent-red)' : 'var(--text-primary)' }}>
            {stats?.failedTransactions || 0}
          </div>
          <div className="admin-stat-label">Failed Transactions</div>
        </div>
      </div>

      {/* ── Two Column — Recent Activity ── */}
      <div className="admin-two-col">
        {/* Recent Transactions */}
        <div className="admin-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-lg)' }}>
            <h3 className="admin-card-title" style={{ marginBottom: 0 }}>Recent Transactions</h3>
            <button
              onClick={() => router.push('/admin/transactions')}
              style={{
                background: 'none',
                border: '1px solid var(--border-accent)',
                borderRadius: 'var(--radius-full)',
                padding: '5px 14px',
                color: 'var(--text-secondary)',
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'var(--transition-fast)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-primary)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-accent)';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              View All <ArrowRight size={12} />
            </button>
          </div>
          {stats?.recentTransactions?.length > 0 ? (
            <div>
              {stats.recentTransactions.map((tx: any) => (
                <div
                  key={tx.id}
                  className="admin-activity-item"
                  onClick={() => {
                    router.push(`/admin/transactions?type=${tx.type}`);
                  }}
                  style={{ cursor: 'pointer', borderRadius: 'var(--radius-sm)', padding: '10px 8px', transition: 'var(--transition-fast)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(108, 92, 231, 0.06)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      color: getTypeColor(tx.type),
                      flexShrink: 0,
                    }}
                  >
                    {getTypeIcon(tx.type)}
                  </div>
                  <div className="admin-activity-content" style={{ flex: 1 }}>
                    <div className="admin-activity-text" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <strong style={{ color: getTypeColor(tx.type), fontFamily: 'var(--font-mono)' }}>
                          {tx.type === 'deposit' ? '+' : '−'}${Number(tx.amount).toLocaleString()}
                        </strong>
                        <span className={`admin-badge ${getStatusBadge(tx.status)}`}>
                          {tx.status}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>
                        {timeAgo(tx.created_at)}
                      </span>
                    </div>
                    <div className="admin-activity-time" style={{ marginTop: '2px' }}>
                      {tx.profiles?.display_name || tx.profiles?.username || 'Unknown User'}
                      {tx.currency ? ` · ${tx.currency}` : ''}
                    </div>
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-lg)' }}>
            <h3 className="admin-card-title" style={{ marginBottom: 0 }}>Recent Users</h3>
            <button
              onClick={() => router.push('/admin/users')}
              style={{
                background: 'none',
                border: '1px solid var(--border-accent)',
                borderRadius: 'var(--radius-full)',
                padding: '5px 14px',
                color: 'var(--text-secondary)',
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'var(--transition-fast)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-primary)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-accent)';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              View All <ArrowRight size={12} />
            </button>
          </div>
          {stats?.recentUsers?.length > 0 ? (
            <div>
              {stats.recentUsers.map((user: any) => (
                <div
                  key={user.id}
                  className="admin-activity-item"
                  onClick={() => router.push('/admin/users')}
                  style={{ cursor: 'pointer', borderRadius: 'var(--radius-sm)', padding: '10px 8px', transition: 'var(--transition-fast)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(108, 92, 231, 0.06)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, rgba(108, 92, 231, 0.2), rgba(0, 210, 255, 0.2))',
                      border: '1px solid rgba(108, 92, 231, 0.3)',
                      color: 'var(--accent-primary-light)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      fontFamily: 'var(--font-mono)',
                      flexShrink: 0,
                    }}
                  >
                    {(user.display_name || user.username || 'U')[0].toUpperCase()}
                  </div>
                  <div className="admin-activity-content" style={{ flex: 1 }}>
                    <div className="admin-activity-text" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <strong>{user.display_name || user.username || 'User'}</strong>
                        <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
                          @{user.username || user.id?.substring(0, 8)}
                        </span>
                      </div>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        color: Number(user.available_balance || 0) > 0 ? 'var(--accent-green)' : 'var(--text-muted)',
                        flexShrink: 0,
                      }}>
                        ${Number(user.available_balance || 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="admin-activity-time" style={{ marginTop: '2px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>{user.email}</span>
                      <span>{timeAgo(user.created_at)}</span>
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
