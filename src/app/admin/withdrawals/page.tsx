'use client';

import { useState, useEffect } from 'react';
import { useAdmin } from '../layout';
import { Loader2, CheckCircle, XCircle, Copy, ChevronLeft, ChevronRight } from 'lucide-react';

export default function AdminWithdrawalsPage() {
  const { admin, token } = useAdmin();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const fetchWithdrawals = async (statusFilter = '', p = 1) => {
    if (!token) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ type: 'withdraw', limit: limit.toString(), page: p.toString() });
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
    fetchWithdrawals(filter, page);
  }, [token, page]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFilter = (status: string) => {
    setFilter(status);
    setPage(1);
    fetchWithdrawals(status, 1);
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
        fetchWithdrawals(filter, page);
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

  const totalPages = Math.ceil(total / limit);

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
        <button className={`admin-filter-btn ${filter === 'Failed' ? 'active' : ''}`} onClick={() => handleFilter('Failed')}>Rejected</button>
      </div>

      {loading && transactions.length === 0 ? (
        <div className="admin-loading">
          <Loader2 size={24} className="animate-spin" />
          Loading withdrawals...
        </div>
      ) : (
        <>
          <div className="admin-table-wrap admin-table-wrap-fixed">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Amount</th>
                  <th>Destination Wallet</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody style={{ opacity: loading ? 0.5 : 1, transition: 'opacity 0.2s' }}>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
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

          {totalPages > 1 && (
            <div className="admin-pagination">
              <button 
                className="admin-pagination-btn"
                disabled={page === 1 || loading}
                onClick={() => setPage(prev => prev - 1)}
              >
                <ChevronLeft size={20} />
              </button>
              
              <div className="admin-pagination-info">
                Page {page} of {totalPages}
              </div>

              <button 
                className="admin-pagination-btn"
                disabled={page === totalPages || loading}
                onClick={() => setPage(prev => prev + 1)}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}
