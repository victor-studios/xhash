'use client';

import { useState } from 'react';
import { ShoppingBag, ArrowDownToLine, ArrowUpFromLine, Gift, Users, Zap } from 'lucide-react';
import OrderDetailModal from '@/components/Dashboard/OrderDetailModal';

const activityData = [
  { time: '3 mins Ago', type: 'Order', description: 'Purchased BTC Starter Package', amount: '-$44', balance: '$473', amountColor: 'var(--accent-red)', icon: 'order' },
  { time: '12 mins Ago', type: 'Deposit', description: 'Crypto deposit via USDT TRC-20', amount: '+$500', balance: '$517', amountColor: 'var(--accent-green)', icon: 'deposit' },
  { time: '45 mins Ago', type: 'Mining Reward', description: 'Daily BTC mining reward', amount: '+$12.50', balance: '$409', amountColor: 'var(--accent-green)', icon: 'reward' },
  { time: '1 hr Ago', type: 'Withdraw', description: 'Withdrawal to BTC wallet', amount: '-$55', balance: '$397', amountColor: 'var(--accent-red)', icon: 'withdraw' },
  { time: '2 hrs Ago', type: 'Referral', description: 'Referral commission from user_8x2k', amount: '+$8.25', balance: '$411', amountColor: 'var(--accent-green)', icon: 'referral' },
  { time: '5 hrs Ago', type: 'Mining Reward', description: 'Daily ETH mining reward', amount: '+$6.80', balance: '$402.75', amountColor: 'var(--accent-green)', icon: 'reward' },
  { time: '1 day Ago', type: 'Order', description: 'Purchased ETH Pro Package', amount: '-$250', balance: '$395.95', amountColor: 'var(--accent-red)', icon: 'order' },
  { time: '1 day Ago', type: 'Deposit', description: 'Crypto deposit via BTC', amount: '+$1,200', balance: '$645.95', amountColor: 'var(--accent-green)', icon: 'deposit' },
  { time: '2 days Ago', type: 'Referral', description: 'Referral commission from user_m3pq', amount: '+$4.50', balance: '$449.45', amountColor: 'var(--accent-green)', icon: 'referral' },
  { time: '2 days Ago', type: 'Mining Reward', description: 'Daily BTC mining reward', amount: '+$12.50', balance: '$444.95', amountColor: 'var(--accent-green)', icon: 'reward' },
  { time: '3 days Ago', type: 'Bonus', description: 'Welcome bonus credited', amount: '+$25', balance: '$432.45', amountColor: 'var(--accent-green)', icon: 'bonus' },
  { time: '3 days Ago', type: 'Withdraw', description: 'Withdrawal to ETH wallet', amount: '-$100', balance: '$407.45', amountColor: 'var(--accent-red)', icon: 'withdraw' },
];

const filterTabs = [
  { key: 'all', label: 'All' },
  { key: 'deposits', label: 'Deposits' },
  { key: 'withdrawals', label: 'Withdrawals' },
  { key: 'orders', label: 'Orders' },
  { key: 'rewards', label: 'Rewards' },
  { key: 'referrals', label: 'Referrals' },
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
  const [activeFilter, setActiveFilter] = useState('all');
  const [detailModal, setDetailModal] = useState<typeof activityData[0] | null>(null);

  const filtered = activityData.filter((row) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'deposits') return row.type === 'Deposit';
    if (activeFilter === 'withdrawals') return row.type === 'Withdraw';
    if (activeFilter === 'orders') return row.type === 'Order';
    if (activeFilter === 'rewards') return row.type === 'Mining Reward' || row.type === 'Bonus';
    if (activeFilter === 'referrals') return row.type === 'Referral';
    return true;
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
              <th>Balance</th>
              <th style={{ textAlign: 'right' }}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, i) => (
              <tr key={i}>
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
                      color: iconColorMap[row.icon],
                      flexShrink: 0,
                    }}>
                      {iconMap[row.icon]}
                    </span>
                    <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{row.type}</span>
                  </div>
                </td>
                <td style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{row.description}</td>
                <td>{row.time}</td>
                <td style={{ color: row.amountColor, fontWeight: 600 }}>{row.amount}</td>
                <td style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{row.balance}</td>
                <td style={{ textAlign: 'right' }}>
                  <button className="dash-btn-sm view" onClick={() => setDetailModal(row)}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: 'var(--space-3xl)',
          color: 'var(--text-muted)',
          fontSize: '0.9rem',
        }}>
          No activity found for this filter.
        </div>
      )}

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
