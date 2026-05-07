'use client';

import { useState, useEffect } from 'react';
import { useAdmin } from '../layout';
import { Loader2, X, UserPlus, Key, Eye, EyeOff, Check } from 'lucide-react';

const levelLabels: Record<number, string> = { 1: 'Super Admin', 2: 'Moderator', 3: 'Support' };
const levelColors: Record<number, string> = { 1: 'admin-badge-red', 2: 'admin-badge-gold', 3: 'admin-badge-blue' };

export default function ManageAdminsPage() {
  const { token } = useAdmin();
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ username: '', password: '', level: 3, displayName: '' });
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  // PIN management
  const [currentPin, setCurrentPin] = useState('--------');
  const [newPin, setNewPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [pinLoading, setPinLoading] = useState(false);
  const [pinSuccess, setPinSuccess] = useState('');

  const fetchAdmins = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/admins', { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) { const data = await res.json(); setAdmins(data.admins); }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAdmins(); fetchPin(); }, [token]);

  const fetchPin = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/admin/settings', { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) { const data = await res.json(); setCurrentPin(data.pin); }
    } catch (err) { console.error(err); }
  };

  const handleChangePin = async () => {
    if (!newPin || newPin.length !== 8) { setError('PIN must be exactly 8 characters'); return; }
    if (!/[a-zA-Z]/.test(newPin) || !/[0-9]/.test(newPin)) { setError('PIN must contain both letters and numbers'); return; }
    setPinLoading(true); setError(''); setPinSuccess('');
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ newPin: newPin.toUpperCase() }),
      });
      if (res.ok) {
        setPinSuccess('PIN updated successfully');
        setCurrentPin(newPin.toUpperCase());
        setNewPin('');
        setTimeout(() => setPinSuccess(''), 3000);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to update PIN');
      }
    } catch (err: any) { setError(err.message); }
    finally { setPinLoading(false); }
  };

  const handleCreate = async () => {
    if (!form.username || !form.password) { setError('Username and password required'); return; }
    setActionLoading(true); setError('');
    try {
      const res = await fetch('/api/admin/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setShowCreate(false);
      setForm({ username: '', password: '', level: 3, displayName: '' });
      fetchAdmins();
    } catch (err: any) { setError(err.message); }
    finally { setActionLoading(false); }
  };

  const handleDeactivate = async (adminId: string) => {
    if (!token || !confirm('Are you sure you want to deactivate this admin?')) return;
    try {
      await fetch('/api/admin/admins', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ adminId }),
      });
      fetchAdmins();
    } catch (err) { console.error(err); }
  };

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Manage Admins</h1>
          <p className="admin-page-subtitle">{admins.length} admin accounts</p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={() => setShowCreate(true)}>
          <UserPlus size={16} /> Add Admin
        </button>
      </div>

      {loading ? (
        <div className="admin-loading"><Loader2 size={24} className="animate-spin" /> Loading...</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Username</th><th>Display Name</th><th>Level</th><th>Status</th><th>Last Login</th><th>Created</th><th>Actions</th></tr></thead>
            <tbody>
              {admins.map(a => (
                <tr key={a.id}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>@{a.username}</td>
                  <td>{a.display_name || '—'}</td>
                  <td><span className={`admin-badge ${levelColors[a.level]}`}>{levelLabels[a.level]}</span></td>
                  <td><span className={`admin-badge ${a.is_active ? 'admin-badge-green' : 'admin-badge-red'}`}>{a.is_active ? 'Active' : 'Inactive'}</span></td>
                  <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {a.last_login ? new Date(a.last_login).toLocaleString() : 'Never'}
                  </td>
                  <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{new Date(a.created_at).toLocaleDateString()}</td>
                  <td>
                    {a.is_active && a.level !== 1 ? (
                      <button className="admin-btn admin-btn-red admin-btn-sm" onClick={() => handleDeactivate(a.id)}>Deactivate</button>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* PIN Management Card */}
      <div className="admin-card" style={{ marginTop: 'var(--space-xl)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
          <Key size={18} style={{ color: 'var(--accent-gold)' }} />
          <h3 className="admin-card-title" style={{ marginBottom: 0 }}>Security PIN</h3>
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)', lineHeight: 1.6 }}>
          This PIN is shared by all admins and required during login. Only Level 1 admins can change it.
        </p>

        <div style={{ display: 'flex', gap: 'var(--space-lg)', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div className="admin-form-group" style={{ marginBottom: 0, flex: '1 1 200px' }}>
            <label className="admin-form-label">Current PIN</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                className="admin-form-input"
                type={showPin ? 'text' : 'password'}
                value={currentPin}
                readOnly
                style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.2em', fontWeight: 700 }}
              />
              <button
                className="admin-btn admin-btn-outline admin-btn-sm"
                onClick={() => setShowPin(!showPin)}
                style={{ padding: '10px' }}
                title={showPin ? 'Hide' : 'Show'}
              >
                {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="admin-form-group" style={{ marginBottom: 0, flex: '1 1 200px' }}>
            <label className="admin-form-label">New PIN (8 chars, letters + numbers)</label>
            <input
              className="admin-form-input"
              type="text"
              placeholder="e.g. ABCD1234"
              value={newPin}
              onChange={e => setNewPin(e.target.value.toUpperCase().slice(0, 8))}
              maxLength={8}
              style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.15em', fontWeight: 700, textTransform: 'uppercase' }}
            />
          </div>

          <button
            className="admin-btn admin-btn-primary"
            onClick={handleChangePin}
            disabled={pinLoading || newPin.length !== 8}
            style={{ height: 46 }}
          >
            {pinLoading ? 'Updating...' : 'Update PIN'}
          </button>
        </div>

        {pinSuccess && (
          <div style={{ marginTop: 'var(--space-md)', padding: '10px 16px', background: 'rgba(0,230,118,0.1)', border: '1px solid rgba(0,230,118,0.3)', borderRadius: 'var(--radius-md)', color: 'var(--accent-green)', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Check size={14} /> {pinSuccess}
          </div>
        )}
      </div>

      {showCreate && (
        <div className="admin-modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <button className="admin-modal-close" onClick={() => setShowCreate(false)}><X size={16} /></button>
            <h3 className="admin-modal-title">Create New Admin</h3>
            <div className="admin-form-group">
              <label className="admin-form-label">Username</label>
              <input className="admin-form-input" placeholder="admin_username" value={form.username} onChange={e => setForm({...form, username: e.target.value})} />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Password</label>
              <input className="admin-form-input" type="password" placeholder="Strong password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Display Name</label>
              <input className="admin-form-input" placeholder="Display name" value={form.displayName} onChange={e => setForm({...form, displayName: e.target.value})} />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Level</label>
              <select className="admin-form-select" value={form.level} onChange={e => setForm({...form, level: Number(e.target.value)})}>
                <option value={1}>Level 1 — Super Admin</option>
                <option value={2}>Level 2 — Moderator</option>
                <option value={3}>Level 3 — Support</option>
              </select>
            </div>
            {error && <div style={{ padding: '10px 16px', background: 'rgba(255,71,87,0.1)', border: '1px solid rgba(255,71,87,0.3)', borderRadius: 'var(--radius-md)', color: 'var(--accent-red)', fontSize: '0.82rem', marginBottom: 'var(--space-md)' }}>{error}</div>}
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="admin-btn admin-btn-primary" onClick={handleCreate} disabled={actionLoading} style={{ flex: 1 }}>{actionLoading ? 'Creating...' : 'Create Admin'}</button>
              <button className="admin-btn admin-btn-outline" onClick={() => setShowCreate(false)} style={{ flex: 1 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
