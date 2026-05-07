'use client';

import { useState, useEffect } from 'react';
import { useAdmin } from '../layout';
import { Search, Loader2, Trash2, DollarSign, X } from 'lucide-react';

export default function AdminUsersPage() {
  const { admin, token } = useAdmin();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);

  // Balance modal
  const [balanceModal, setBalanceModal] = useState<any>(null);
  const [balanceAmount, setBalanceAmount] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Delete modal
  const [deleteModal, setDeleteModal] = useState<any>(null);

  const fetchUsers = async (searchQuery = '') => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users?search=${searchQuery}&limit=100`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
        setTotal(data.total);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers(search);
  };

  const handleAdjustBalance = async () => {
    if (!balanceModal || !balanceAmount || !token) return;
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: balanceModal.id,
          action: 'adjust_balance',
          value: balanceAmount,
        }),
      });
      if (res.ok) {
        setBalanceModal(null);
        setBalanceAmount('');
        fetchUsers(search);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteModal || !token) return;
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: deleteModal.id }),
      });
      if (res.ok) {
        setDeleteModal(null);
        fetchUsers(search);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const isLevel1 = admin?.level === 1;

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Users</h1>
          <p className="admin-page-subtitle">{total} registered users</p>
        </div>
        <form onSubmit={handleSearch} className="admin-search-bar">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
      </div>

      {loading ? (
        <div className="admin-loading">
          <Loader2 size={24} className="animate-spin" />
          Loading users...
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Balance</th>
                <th>Deposited</th>
                <th>Earned</th>
                <th>Withdrawn</th>
                <th>Joined</th>
                {isLevel1 && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={isLevel1 ? 8 : 7} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                          {user.display_name || 'User'}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                          @{user.username || user.id?.substring(0, 8)}
                        </span>
                      </div>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{user.email}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-green)', fontWeight: 600 }}>
                      ${Number(user.available_balance || 0).toFixed(2)}
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>
                      ${Number(user.total_deposit || 0).toFixed(2)}
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>
                      ${Number(user.total_earned || 0).toFixed(2)}
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>
                      ${Number(user.total_withdrawn || 0).toFixed(2)}
                    </td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    {isLevel1 && (
                      <td>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          <button
                            className="admin-btn admin-btn-primary admin-btn-sm"
                            onClick={() => setBalanceModal(user)}
                            title="Adjust Balance"
                          >
                            <DollarSign size={12} />
                          </button>
                          <button
                            className="admin-btn admin-btn-red admin-btn-sm"
                            onClick={() => setDeleteModal(user)}
                            title="Delete User"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Balance Adjustment Modal */}
      {balanceModal && (
        <div className="admin-modal-overlay" onClick={() => setBalanceModal(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <button className="admin-modal-close" onClick={() => setBalanceModal(null)}>
              <X size={16} />
            </button>
            <h3 className="admin-modal-title">Adjust Balance</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 'var(--space-lg)' }}>
              User: <strong style={{ color: 'var(--text-primary)' }}>@{balanceModal.username}</strong>
              <br />
              Current Balance: <strong style={{ color: 'var(--accent-green)' }}>${Number(balanceModal.available_balance || 0).toFixed(2)}</strong>
            </p>
            <div className="admin-form-group">
              <label className="admin-form-label">Amount (use negative to deduct)</label>
              <input
                type="number"
                className="admin-form-input"
                placeholder="e.g. 100 or -50"
                value={balanceAmount}
                onChange={(e) => setBalanceAmount(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                className="admin-btn admin-btn-primary"
                onClick={handleAdjustBalance}
                disabled={actionLoading}
                style={{ flex: 1 }}
              >
                {actionLoading ? 'Processing...' : 'Adjust Balance'}
              </button>
              <button
                className="admin-btn admin-btn-outline"
                onClick={() => setBalanceModal(null)}
                style={{ flex: 1 }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="admin-modal-overlay" onClick={() => setDeleteModal(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <button className="admin-modal-close" onClick={() => setDeleteModal(null)}>
              <X size={16} />
            </button>
            <h3 className="admin-modal-title">Delete User</h3>
            <p style={{ color: 'var(--accent-red)', fontSize: '0.85rem', marginBottom: 'var(--space-lg)' }}>
              ⚠️ This action is irreversible. Are you sure you want to delete:
            </p>
            <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', marginBottom: 'var(--space-xl)', fontWeight: 600 }}>
              @{deleteModal.username} ({deleteModal.email})
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                className="admin-btn admin-btn-red"
                onClick={handleDeleteUser}
                disabled={actionLoading}
                style={{ flex: 1 }}
              >
                {actionLoading ? 'Deleting...' : 'Delete User'}
              </button>
              <button
                className="admin-btn admin-btn-outline"
                onClick={() => setDeleteModal(null)}
                style={{ flex: 1 }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
