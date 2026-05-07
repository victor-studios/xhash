'use client';

import { useState, useEffect } from 'react';
import { useAdmin } from '../layout';
import { Loader2, CheckCircle, XCircle, Copy } from 'lucide-react';

export default function AdminWithdrawalsPage() {
  const { admin, token } = useAdmin();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const fetchWithdrawals = async (statusFilter = '') => {
    if (!token) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ type: 'withdraw', limit: '100' });
      if (statusFilter) params.set('status', statusFilter);
      const res = await fetch(`/api/admin/transactions?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setTransactions(data.transactions);
        setTotal(data.total);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFilter = (status: string) => {
    setFilter(status);
    fetchWithdrawals(status);
  };

  const handleAction = async (transactionId: string, action: 'approve' | 'reject') => {
    if (!token) return;
    setActionLoading(transactionId);
    try {
      const res = await fetch('/api/admin/transactions', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ transactionId, action }),
      });
      if (res.ok) {
        fetchWithdrawals(filter);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCopy = (address: string) => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const getStatusBadge = (status: string) => {
    if (status === 'Completed' || status === 'Confirmed') return 'admin-badge-green';
    if (status === 'Failed' || status === 'Rejected') return 'admin-badge-red';
    if (status === 'Pending' || status === 'Processing' || status === 'In Progress') return 'admin-badge-gold';
    return 'admin-badge-blue';
  };

  const isPending = (status: string) => {
    return ['Pending', 'Processing', 'In Progress'].includes(status);
  };

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Withdrawals</h1>
          <p className="admin-page-subtitle">{total} total withdrawals</p>
        </div>
      </div>

      <div className="admin-filter-row">
        <button className={`admin-filter-btn ${filter === '' ? 'active' : ''}`} onClick={() => handleFilter('')}>All</button>
        <button className={`admin-filter-btn ${filter === 'In Progress' ? 'active' : ''}`} onClick={() => handleFilter('In Progress')}>Processing</button>
        <button className={`admin-filter-btn ${filter === 'Completed' ? 'active' : ''}`} onClick={() => handleFilter('Completed')}>Completed</button>
        <button className={`admin-filter-btn ${filter === 'Rejected' ? 'active' : ''}`} onClick={() => handleFilter('Rejected')}>Rejected</button>
      </div>

      {loading ? (
        <div className="admin-loading">
          <Loader2 size={24} className="animate-spin" />
          Loading withdrawals...
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Amount</th>
                <th>Currency</th>
                <th>Destination Wallet</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No withdrawals found
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                        @{tx.user?.username || 'Unknown'}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--accent-red)' }}>
                      −${Number(tx.amount).toFixed(2)}
                    </td>
                    <td style={{ fontSize: '0.8rem' }}>{tx.currency}</td>
                    <td>
                      {tx.user?.wallet_address ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', fontWeight: 600 }}>
                            {tx.user.wallet_network || 'USDT TRC20'}
                          </span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ 
                              fontFamily: 'var(--font-mono)', 
                              fontSize: '0.78rem', 
                              color: 'var(--text-primary)',
                              background: 'rgba(0,0,0,0.2)',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              border: '1px solid rgba(255,255,255,0.05)',
                              maxWidth: '120px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }} title={tx.user.wallet_address}>
                              {tx.user.wallet_address.substring(0, 6)}...{tx.user.wallet_address.substring(tx.user.wallet_address.length - 4)}
                            </span>
                            <button 
                              onClick={() => handleCopy(tx.user.wallet_address)}
                              style={{ 
                                background: 'transparent', 
                                border: 'none', 
                                color: copiedAddress === tx.user.wallet_address ? 'var(--accent-green)' : 'var(--text-muted)', 
                                cursor: 'pointer',
                                padding: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '4px'
                              }}
                              title="Copy Address"
                            >
                              {copiedAddress === tx.user.wallet_address ? <CheckCircle size={14} /> : <Copy size={14} />}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic' }}>Not provided</span>
                      )}
                    </td>
                    <td>
                      <span className={`admin-badge ${getStatusBadge(tx.status)}`}>{tx.status}</span>
                    </td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {new Date(tx.created_at).toLocaleString()}
                    </td>
                    <td>
                      {isPending(tx.status) ? (
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          <button
                            className="admin-btn admin-btn-green admin-btn-sm"
                            onClick={() => handleAction(tx.id, 'approve')}
                            disabled={actionLoading === tx.id}
                            title="Approve"
                          >
                            <CheckCircle size={12} />
                            {actionLoading === tx.id ? '...' : 'Approve'}
                          </button>
                          <button
                            className="admin-btn admin-btn-red admin-btn-sm"
                            onClick={() => handleAction(tx.id, 'reject')}
                            disabled={actionLoading === tx.id}
                            title="Reject"
                          >
                            <XCircle size={12} />
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
