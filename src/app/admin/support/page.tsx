'use client';

import { useState, useEffect } from 'react';
import { useAdmin } from '../layout';
import { Loader2, X, Send } from 'lucide-react';

export default function AdminSupportPage() {
  const { admin, token } = useAdmin();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState('');
  const [replyModal, setReplyModal] = useState<any>(null);
  const [replyText, setReplyText] = useState('');
  const [replyStatus, setReplyStatus] = useState('resolved');
  const [actionLoading, setActionLoading] = useState(false);
  const canReply = admin && admin.level <= 2;

  const fetchMessages = async (statusFilter = '') => {
    if (!token) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: '100' });
      if (statusFilter) params.set('status', statusFilter);
      const res = await fetch(`/api/admin/support?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages);
        setTotal(data.total);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchMessages(); }, [token]);

  const handleFilter = (s: string) => { setFilter(s); fetchMessages(s); };

  const handleReply = async () => {
    if (!replyModal || !token) return;
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/support', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ messageId: replyModal.id, reply: replyText || undefined, status: replyStatus }),
      });
      if (res.ok) { setReplyModal(null); setReplyText(''); fetchMessages(filter); }
    } catch (err) { console.error(err); }
    finally { setActionLoading(false); }
  };

  const badge = (s: string) => s === 'open' ? 'admin-badge-gold' : s === 'in_progress' ? 'admin-badge-blue' : s === 'resolved' ? 'admin-badge-green' : 'admin-badge-purple';

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Support Messages</h1>
          <p className="admin-page-subtitle">{total} total messages</p>
        </div>
      </div>
      <div className="admin-filter-row">
        {['', 'open', 'in_progress', 'resolved', 'closed'].map(s => (
          <button key={s} className={`admin-filter-btn ${filter === s ? 'active' : ''}`} onClick={() => handleFilter(s)}>
            {s || 'All'}
          </button>
        ))}
      </div>
      {loading ? (
        <div className="admin-loading"><Loader2 size={24} className="animate-spin" /> Loading...</div>
      ) : messages.length === 0 ? (
        <div className="admin-card"><div className="admin-empty"><div className="admin-empty-icon">💬</div><div className="admin-empty-text">No messages found</div></div></div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>From</th><th>Subject</th><th>Message</th><th>Status</th><th>Date</th>{canReply && <th>Actions</th>}</tr></thead>
            <tbody>
              {messages.map(msg => (
                <tr key={msg.id}>
                  <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{msg.user_email || 'Unknown'}</td>
                  <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{msg.subject}</td>
                  <td style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.message}</td>
                  <td><span className={`admin-badge ${badge(msg.status)}`}>{msg.status}</span></td>
                  <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{new Date(msg.created_at).toLocaleDateString()}</td>
                  {canReply && <td><button className="admin-btn admin-btn-primary admin-btn-sm" onClick={() => { setReplyModal(msg); setReplyText(msg.admin_reply || ''); }}><Send size={12} /> Reply</button></td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {replyModal && (
        <div className="admin-modal-overlay" onClick={() => setReplyModal(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <button className="admin-modal-close" onClick={() => setReplyModal(null)}><X size={16} /></button>
            <h3 className="admin-modal-title">Reply to Support</h3>
            <div style={{ marginBottom: 'var(--space-lg)', padding: 'var(--space-md)', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 4 }}>From: {replyModal.user_email}</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600, marginBottom: 8 }}>{replyModal.subject}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{replyModal.message}</div>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Your Reply</label>
              <textarea className="admin-form-input" style={{ minHeight: 120, resize: 'vertical' }} placeholder="Type reply..." value={replyText} onChange={e => setReplyText(e.target.value)} />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Set Status</label>
              <select className="admin-form-select" value={replyStatus} onChange={e => setReplyStatus(e.target.value)}>
                <option value="open">Open</option><option value="in_progress">In Progress</option><option value="resolved">Resolved</option><option value="closed">Closed</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="admin-btn admin-btn-primary" onClick={handleReply} disabled={actionLoading} style={{ flex: 1 }}>{actionLoading ? 'Sending...' : 'Send Reply'}</button>
              <button className="admin-btn admin-btn-outline" onClick={() => setReplyModal(null)} style={{ flex: 1 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
