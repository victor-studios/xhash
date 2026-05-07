'use client';

import { useState, useEffect } from 'react';
import { useAdmin } from '../layout';
import { Loader2 } from 'lucide-react';

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

  useEffect(() => {
    async function fetchLogs() {
      if (!token) return;
      try {
        const res = await fetch('/api/admin/activity?limit=100', {
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
  }, [token]);

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Activity Log</h1>
          <p className="admin-page-subtitle">{total} recorded actions</p>
        </div>
      </div>

      {loading ? (
        <div className="admin-loading"><Loader2 size={24} className="animate-spin" /> Loading...</div>
      ) : logs.length === 0 ? (
        <div className="admin-card">
          <div className="admin-empty">
            <div className="admin-empty-icon">📋</div>
            <div className="admin-empty-text">No activity recorded yet</div>
          </div>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Admin</th>
                <th>Action</th>
                <th>Details</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                    @{log.admin_username || 'Unknown'}
                  </td>
                  <td style={{ color: 'var(--text-primary)' }}>
                    {actionLabels[log.action] || log.action}
                  </td>
                  <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
      )}
    </>
  );
}
