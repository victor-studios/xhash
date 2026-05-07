'use client';

import { useState, useEffect } from 'react';
import { useAdmin } from '../layout';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

export default function AdminDepositsPage() {
  const { token } = useAdmin();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const fetchDeposits = async (statusFilter = '', p = 1) => {
    if (!token) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ type: 'deposit', limit: limit.toString(), page: p.toString() });
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
    fetchDeposits(filter, page);
  }, [token, page]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFilter = (status: string) => {
    setFilter(status);
    setPage(1);
    fetchDeposits(status, 1);
  };

  const getStatusBadge = (status: string) => {
    if (status === 'Completed') return 'admin-badge-green';
    if (status === 'Failed') return 'admin-badge-red';
    if (status === 'Waiting for payment') return 'admin-badge-gold';
    return 'admin-badge-blue';
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Deposits</h1>
          <p className="admin-page-subtitle">{total} total deposits</p>
        </div>
      </div>

      <div className="admin-filter-row">
        <button className={`admin-filter-btn ${filter === '' ? 'active' : ''}`} onClick={() => handleFilter('')}>All</button>
        <button className={`admin-filter-btn ${filter === 'Completed' ? 'active' : ''}`} onClick={() => handleFilter('Completed')}>Completed</button>
        <button className={`admin-filter-btn ${filter === 'Waiting for payment' ? 'active' : ''}`} onClick={() => handleFilter('Waiting for payment')}>Pending</button>
        <button className={`admin-filter-btn ${filter === 'Failed' ? 'active' : ''}`} onClick={() => handleFilter('Failed')}>Failed</button>
      </div>

      {loading && transactions.length === 0 ? (
        <div className="admin-loading">
          <Loader2 size={24} className="animate-spin" />
          Loading deposits...
        </div>
      ) : (
        <>
          <div className="admin-table-wrap admin-table-wrap-fixed">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Description</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody style={{ opacity: loading ? 0.5 : 1, transition: 'opacity 0.2s' }}>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                      No deposits found
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
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--accent-green)' }}>
                        +${Number(tx.amount).toFixed(2)}
                      </td>
                      <td>
                        <span className={`admin-badge ${tx.currency === 'USD (Admin)' ? 'admin-badge-blue' : 'admin-badge-gold'}`} style={{ fontSize: '0.7rem' }}>
                          {tx.currency === 'USD (Admin)' ? 'Manual' : 'Automatic'}
                        </span>
                      </td>
                      <td>
                        <span className={`admin-badge ${getStatusBadge(tx.status)}`}>{tx.status}</span>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{tx.description || '—'}</td>
                      <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {new Date(tx.created_at).toLocaleString()}
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
