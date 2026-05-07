'use client';

import { useState, useEffect } from 'react';
import { useAdmin } from '../layout';
import { Loader2 } from 'lucide-react';

export default function AdminDepositsPage() {
  const { token } = useAdmin();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState('');

  const fetchDeposits = async (statusFilter = '') => {
    if (!token) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ type: 'deposit', limit: '100' });
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
    fetchDeposits();
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFilter = (status: string) => {
    setFilter(status);
    fetchDeposits(status);
  };

  const getStatusBadge = (status: string) => {
    if (status === 'Completed') return 'admin-badge-green';
    if (status === 'Failed') return 'admin-badge-red';
    if (status === 'Waiting for payment') return 'admin-badge-gold';
    return 'admin-badge-blue';
  };

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

      {loading ? (
        <div className="admin-loading">
          <Loader2 size={24} className="animate-spin" />
          Loading deposits...
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Amount</th>
                <th>Currency</th>
                <th>Status</th>
                <th>Description</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
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
                    <td>{tx.currency}</td>
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
      )}
    </>
  );
}
