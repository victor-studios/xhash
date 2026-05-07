'use client';

import { useState, useEffect, Suspense } from 'react';
import { useAdmin } from '../layout';
import { useSearchParams } from 'next/navigation';
import { 
  Loader2, 
  ChevronLeft, 
  ChevronRight, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  ShoppingBag, 
  DollarSign,
} from 'lucide-react';

const statusMap: Record<string, string> = {
  'Completed': 'admin-badge-green',
  'Failed': 'admin-badge-red',
  'In Progress': 'admin-badge-gold',
  'Waiting for payment': 'admin-badge-blue',
  'Pending': 'admin-badge-gold',
  'Rejected': 'admin-badge-red',
  'Processing': 'admin-badge-blue',
};

const typeLabels: Record<string, string> = {
  deposit: 'Deposit',
  withdraw: 'Withdrawal',
  order: 'Mining Order',
  reward: 'Affiliate Reward',
  commission: 'Commission',
};

function TransactionsContent() {
  const { token } = useAdmin();
  const searchParams = useSearchParams();
  
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [type, setType] = useState(searchParams.get('type') || '');
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const limit = 10;

  useEffect(() => {
    async function fetchTransactions() {
      if (!token) return;
      setLoading(true);
      try {
        const query = new URLSearchParams({
          limit: limit.toString(),
          page: page.toString(),
          ...(type && { type }),
          ...(status && { status }),
        });

        const res = await fetch(`/api/admin/transactions?${query.toString()}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setTransactions(data.transactions);
          setTotal(data.total);
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    fetchTransactions();
  }, [token, page, type, status]);

  const totalPages = Math.ceil(total / limit);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <ArrowDownToLine size={14} />;
      case 'withdraw': return <ArrowUpFromLine size={14} />;
      case 'order': return <ShoppingBag size={14} />;
      default: return <DollarSign size={14} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'deposit': return 'var(--accent-green)';
      case 'withdraw': return 'var(--accent-red)';
      case 'order': return 'var(--accent-secondary)';
      case 'reward': return 'var(--accent-gold)';
      default: return 'var(--accent-primary)';
    }
  };

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Platform Transactions</h1>
          <p className="admin-page-subtitle">Monitoring all financial activities ({total})</p>
        </div>
      </div>

      <div className="admin-filter-row" style={{ marginBottom: 'var(--space-lg)' }}>
        <div className="admin-form-group" style={{ marginBottom: 0, minWidth: '180px' }}>
          <select 
            className="admin-form-select" 
            value={type} 
            onChange={(e) => { setType(e.target.value); setPage(1); }}
          >
            <option value="">All Types</option>
            <option value="deposit">Deposits</option>
            <option value="withdraw">Withdrawals</option>
            <option value="order">Orders</option>
            <option value="reward">Rewards</option>
          </select>
        </div>

        <div className="admin-form-group" style={{ marginBottom: 0, minWidth: '180px' }}>
          <select 
            className="admin-form-select" 
            value={status} 
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          >
            <option value="">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">Processing</option>
            <option value="Failed">Failed / Rejected</option>
          </select>
        </div>

        <div style={{ marginLeft: 'auto' }}>
           <button onClick={() => { setType(''); setStatus(''); setPage(1); }} className="admin-btn admin-btn-outline">
             Reset Filters
           </button>
        </div>
      </div>

      {loading && transactions.length === 0 ? (
        <div className="admin-loading"><Loader2 size={24} className="animate-spin" /> Loading...</div>
      ) : transactions.length === 0 ? (
        <div className="admin-card">
          <div className="admin-empty">
            <div className="admin-empty-icon">💸</div>
            <div className="admin-empty-text">No transactions found matching filters</div>
          </div>
        </div>
      ) : (
        <>
          <div className="admin-table-wrap admin-table-wrap-fixed">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Currency/ID</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody style={{ opacity: loading ? 0.5 : 1, transition: 'opacity 0.2s' }}>
                {transactions.map(tx => (
                  <tr key={tx.id}>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          {tx.user?.display_name || tx.user?.username || 'User'}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                          @{tx.user?.username || tx.user_id.substring(0, 8)}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ 
                          width: 24, 
                          height: 24, 
                          borderRadius: '50%', 
                          background: 'rgba(255,255,255,0.03)', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          border: '1px solid rgba(255,255,255,0.05)',
                          color: getTypeColor(tx.type)
                        }}>
                          {getTypeIcon(tx.type)}
                        </div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>
                          {typeLabels[tx.type] || tx.type}
                        </span>
                      </div>
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                      {tx.type === 'withdraw' ? '−' : '+'}${Number(tx.amount).toLocaleString()}
                    </td>
                    <td>
                      <span className={`admin-badge ${statusMap[tx.status] || 'admin-badge-purple'}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>{tx.currency || 'USD'}</span>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                          ID: {tx.id.substring(0, 8)}...
                        </span>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {new Date(tx.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
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

export default function AdminTransactionsPage() {
  return (
    <Suspense fallback={<div className="admin-loading"><Loader2 size={24} className="animate-spin" /> Loading page...</div>}>
      <TransactionsContent />
    </Suspense>
  );
}
