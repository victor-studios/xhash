'use client';

import { useState } from 'react';
import { miningPackages } from '@/data/packages';
import styles from './Orders.module.css';

/* ─── Mock purchased orders ─── */
interface UserOrder {
  id: string;
  packageId: string;
  purchaseDate: string;
  endDate: string;
  status: 'active' | 'ended';
  earned: string;
}

const userOrders: UserOrder[] = [
  {
    id: 'ORD-001',
    packageId: '1',
    purchaseDate: 'May 2, 2026',
    endDate: 'May 5, 2026',
    status: 'active',
    earned: '$14.40',
  },
  {
    id: 'ORD-002',
    packageId: '2',
    purchaseDate: 'May 1, 2026',
    endDate: 'May 4, 2026',
    status: 'active',
    earned: '$32.10',
  },
  {
    id: 'ORD-003',
    packageId: '6',
    purchaseDate: 'Apr 25, 2026',
    endDate: 'Apr 28, 2026',
    status: 'ended',
    earned: '$60.00',
  },
  {
    id: 'ORD-004',
    packageId: '9',
    purchaseDate: 'Apr 20, 2026',
    endDate: 'Apr 23, 2026',
    status: 'ended',
    earned: '$60.00',
  },
  {
    id: 'ORD-005',
    packageId: '4',
    purchaseDate: 'Apr 15, 2026',
    endDate: 'Apr 18, 2026',
    status: 'ended',
    earned: '$60.00',
  },
  {
    id: 'ORD-006',
    packageId: '10',
    purchaseDate: 'Apr 10, 2026',
    endDate: 'Apr 13, 2026',
    status: 'ended',
    earned: '$60.00',
  },
  {
    id: 'ORD-007',
    packageId: '11',
    purchaseDate: 'Apr 5, 2026',
    endDate: 'Apr 8, 2026',
    status: 'ended',
    earned: '$60.00',
  },
];

type FilterType = 'all' | 'active' | 'ended';

export default function OrdersPage() {
  const [filter, setFilter] = useState<FilterType>('all');

  const filtered = userOrders.filter((order) => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const activeCount = userOrders.filter((o) => o.status === 'active').length;
  const endedCount = userOrders.filter((o) => o.status === 'ended').length;

  return (
    <>

      {/* Filter Tabs */}
      <div className="filter-row">
        <button
          className={`filter-btn ${filter === 'all' ? 'active-filter' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({userOrders.length})
        </button>
        <button
          className={`filter-btn ${filter === 'active' ? 'active-filter' : ''}`}
          onClick={() => setFilter('active')}
        >
          Active ({activeCount})
        </button>
        <button
          className={`filter-btn ${filter === 'ended' ? 'active-filter' : ''}`}
          onClick={() => setFilter('ended')}
        >
          Ended ({endedCount})
        </button>
      </div>

      {/* Orders Grid */}
      <div className={styles.ordersGrid}>
        {filtered.map((order) => {
          const pkg = miningPackages.find((p) => p.id === order.packageId);
          if (!pkg) return null;

          return (
            <div
              key={order.id}
              className={`${styles.orderCard} ${order.status === 'ended' ? styles.ended : ''}`}
            >
              {/* Status Badge */}
              <div className={`${styles.statusBadge} ${order.status === 'active' ? styles.badgeActive : styles.badgeEnded}`}>
                <span className={styles.statusDot} />
                {order.status === 'active' ? 'Active' : 'Ended'}
              </div>

              {/* Header */}
              <div className={styles.cardHeader}>
                <div>
                  <div className={styles.cardName}>{pkg.name}</div>
                  {pkg.subtitle && <div className={styles.cardSubtitle}>{pkg.subtitle}</div>}
                </div>
                <div
                  className={styles.cryptoIcon}
                  style={{ backgroundColor: pkg.cryptoColor }}
                >
                  {pkg.cryptoIcon}
                </div>
              </div>

              {/* Progress */}
              {order.status === 'active' && (
                <div className={styles.progressSection}>
                  <div className={styles.progressLabel}>
                    <span>Mining Progress</span>
                    <span className={styles.progressPercent}>67%</span>
                  </div>
                  <div className={styles.progressTrack}>
                    <div className={styles.progressFill} style={{ width: '67%' }} />
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className={styles.cardStats}>
                <div className={styles.cardStat}>
                  <span className={styles.statLabel}>Duration</span>
                  <span className={styles.statValue}>{pkg.duration}</span>
                </div>
                <div className={styles.cardStat}>
                  <span className={styles.statLabel}>Daily Rate</span>
                  <span className={styles.statValue}>{pkg.dailyRate}</span>
                </div>
                <div className={styles.cardStat}>
                  <span className={styles.statLabel}>Price</span>
                  <span className={styles.statValue}>{pkg.totalPrice}</span>
                </div>
              </div>

              {/* Footer */}
              <div className={styles.cardFooter}>
                <div className={styles.footerDates}>
                  <div className={styles.dateRow}>
                    <span className={styles.dateLabel}>Purchased</span>
                    <span className={styles.dateValue}>{order.purchaseDate}</span>
                  </div>
                  <div className={styles.dateRow}>
                    <span className={styles.dateLabel}>{order.status === 'active' ? 'Ends' : 'Ended'}</span>
                    <span className={styles.dateValue}>{order.endDate}</span>
                  </div>
                </div>
                <div className={styles.earnedSection}>
                  <span className={styles.earnedLabel}>Earned</span>
                  <span className={`${styles.earnedValue} ${order.status === 'active' ? styles.earnedActive : ''}`}>
                    {order.earned}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className={styles.emptyState}>
          <p>No {filter === 'all' ? '' : filter} orders found.</p>
        </div>
      )}
    </>
  );
}
