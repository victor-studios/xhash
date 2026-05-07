'use client';

import { useState, useEffect } from 'react';
import { useAdmin } from '../layout';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

const actionLabels: Record<string, string> = {
  login: '🔐 Logged in',
  adjust_balance: '💰 Adjusted user balance',
  delete_user: '🗑️ Deleted user',
  withdrawal_approve: '✅ Approved withdrawal',
  withdrawal_reject: '❌ Rejected withdrawal',
  create_admin: '👤 Created new admin',
  deactivate_admin: '🚫 Deactivated admin',
  reply_support: '💬 Replied to support',
  update_support_status: '📝 Updated support status',
};

export default function AdminActivityPage() {
  const { token } = useAdmin();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    async function fetchLogs() {
      if (!token) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/activity?limit=${limit}&page=${page}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setLogs(data.logs);
          setTotal(data.total);
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    fetchLogs();
  }, [token, page]);

  const totalPages = Math.ceil(total / limit);

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Activity Log</h1>
          <p className="admin-page-subtitle">{total} recorded actions</p>
        </div>
      </div>

      {loading && logs.length === 0 ? (
        <div className="admin-loading"><Loader2 size={24} className="animate-spin" /> Loading...</div>
      ) : logs.length === 0 ? (
        <div className="admin-card">
          <div className="admin-empty">
            <div className="admin-empty-icon">📋</div>
            <div className="admin-empty-text">No activity recorded yet</div>
          </div>
        </div>
      ) : (
        <>
          <div className="admin-table-wrap admin-table-wrap-fixed">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Admin</th>
                  <th>Action</th>
                  <th>Details</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody style={{ opacity: loading ? 0.5 : 1, transition: 'opacity 0.2s' }}>
                {logs.map(log => (
                  <tr key={log.id}>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                      @{log.admin_username || 'Unknown'}
                    </td>
                    <td style={{ color: 'var(--text-primary)' }}>
                      {actionLabels[log.action] || log.action}
                    </td>
                    <td title={log.details ? JSON.stringify(log.details) : ''} style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {log.details ? JSON.stringify(log.details) : '—'}
                    </td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {new Date(log.created_at).toLocaleString()}
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
