'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag, ArrowDownToLine, ArrowUpFromLine, Gift, Users, Zap, Loader2 } from 'lucide-react';
import OrderDetailModal from '@/components/Dashboard/OrderDetailModal';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { timeAgo } from '@/lib/utils';

const filterTabs = [
  { key: 'all', label: 'All' },
  { key: 'deposit', label: 'Deposits' },
  { key: 'withdraw', label: 'Withdrawals' },
  { key: 'order', label: 'Orders' },
  { key: 'reward', label: 'Rewards' },
  { key: 'referral', label: 'Referrals' },
];

const iconMap: Record<string, React.ReactNode> = {
  order: <ShoppingBag size={14} />,
  deposit: <ArrowDownToLine size={14} />,
  withdraw: <ArrowUpFromLine size={14} />,
  reward: <Zap size={14} />,
  referral: <Users size={14} />,
  bonus: <Gift size={14} />,
};

const iconColorMap: Record<string, string> = {
  order: 'var(--accent-primary)',
  deposit: 'var(--accent-green)',
  withdraw: 'var(--accent-red)',
  reward: 'var(--accent-gold)',
  referral: 'var(--accent-secondary)',
  bonus: 'var(--accent-green)',
};

export default function ActivityPage() {
  const { user, loading: authLoading } = useAuth();
  const [activeFilter, setActiveFilter] = useState('all');
  const [detailModal, setDetailModal] = useState<any | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTransactions() {
      if (!user?.id) return;
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (!error && data) {
          setTransactions(data);
        }
      } catch (err) {
        console.error('Failed to fetch transactions:', err);
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      fetchTransactions();
    }
  }, [user?.id, authLoading]);



  const getAmountStr = (tx: any) => {
    const prefix = ['withdraw', 'order'].includes(tx.type) ? '-' : '+';
    return `${prefix}$${tx.amount}`;
  };

  const getAmountColor = (tx: any) => {
    return ['withdraw', 'order'].includes(tx.type) ? 'var(--accent-red)' : 'var(--accent-green)';
  };

  const filtered = transactions.filter((row) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'reward') return row.type === 'reward' || row.type === 'bonus';
    return row.type === activeFilter;
  });

  return (
    <>
      {/* Filter Buttons */}
      <div className="filter-row">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            className={`filter-btn ${activeFilter === tab.key ? 'active-filter' : ''}`}
            onClick={() => setActiveFilter(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Activity Table */}
      <div className="dash-table-wrap">
        <table className="dash-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Description</th>
              <th>Time</th>
              <th>Amount</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: 'var(--space-3xl)' }}>
                  <Loader2 className="animate-spin mx-auto mb-2" size={24} style={{ color: 'var(--text-secondary)' }} />
                  <span style={{ color: 'var(--text-secondary)' }}>Loading transactions...</span>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: 'var(--space-3xl)', color: 'var(--text-muted)' }}>
                  No activity found for this filter.
                </td>
              </tr>
            ) : (
              filtered.map((row) => (
                <tr key={row.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        color: iconColorMap[row.type] || iconColorMap.deposit,
                        flexShrink: 0,
                      }}>
                        {iconMap[row.type] || iconMap.deposit}
                      </span>
                      <span style={{ fontWeight: 500, color: 'var(--text-primary)', textTransform: 'capitalize' }}>
                        {row.type}
                      </span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{row.description}</td>
                  <td>{timeAgo(row.created_at)}</td>
                  <td style={{ color: getAmountColor(row), fontWeight: 600 }}>{getAmountStr(row)}</td>
                  <td style={{ color: 'var(--text-primary)' }}>{row.status}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="dash-btn-sm view" onClick={() => setDetailModal({
                      time: new Date(row.created_at).toLocaleString(),
                      type: row.type.charAt(0).toUpperCase() + row.type.slice(1),
                      description: row.description,
                      amount: getAmountStr(row),
                      amountColor: getAmountColor(row),
                      icon: row.type,
                      balance: row.status, // We map status to balance for now in the modal
                    })}>View</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {detailModal && (
        <OrderDetailModal
          data={detailModal}
          onClose={() => setDetailModal(null)}
        />
      )}
    </>
  );
}
