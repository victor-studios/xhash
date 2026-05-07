'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { MiningPackage } from '@/types';
import { useAuth } from '@/lib/auth-context';
import styles from './Orders.module.css';

interface OrderRow {
  id: string;
  package_id: string;
  status: 'active' | 'expired' | 'pending';
  amount: number;
  created_at: string;
}

type FilterType = 'all' | 'active' | 'expired';

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [filter, setFilter] = useState<FilterType>('all');
  const [plans, setPlans] = useState<MiningPackage[]>([]);
  const [userOrders, setUserOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('mining_plans').select('*').then(({ data }) => {
      if (data) setPlans(data as MiningPackage[]);
    });
  }, []);

  useEffect(() => {
    async function fetchOrders() {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (!error && data) {
          setUserOrders(data as OrderRow[]);
        }
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      fetchOrders();
    }
  }, [user?.id, authLoading]);

  const filtered = userOrders.filter((order) => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const activeCount = userOrders.filter((o) => o.status === 'active').length;
  const expiredCount = userOrders.filter((o) => o.status === 'expired').length;

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
          className={`filter-btn ${filter === 'expired' ? 'active-filter' : ''}`}
          onClick={() => setFilter('expired')}
        >
          Expired ({expiredCount})
        </button>
      </div>

      {loading || authLoading ? (
        <div className="p-8 text-center" style={{ color: 'var(--text-secondary)' }}>
          Loading your orders...
        </div>
      ) : (
        <>
          {/* Orders Grid */}
          <div className={styles.ordersGrid}>
            {filtered.map((order) => {
              // Find plan by package_id (assuming it stores the plan slug or ID, the mock used slug)
              const pkg = plans.find((p) => p.slug === order.package_id || p.id === order.package_id);
              if (!pkg) return null;

              const durationText = `${pkg.duration_months} Month${pkg.duration_months > 1 ? 's' : ''}`;
              const dailyEarning = ((pkg.total_return - pkg.price) / (pkg.duration_months * 30)).toFixed(2);
              
              const purchaseDateObj = new Date(order.created_at);
              const endDateObj = new Date(order.created_at);
              endDateObj.setMonth(endDateObj.getMonth() + pkg.duration_months);

              const purchaseDateStr = purchaseDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
              const endDateStr = endDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

              // Mock progress calculation for active orders
              const totalTime = endDateObj.getTime() - purchaseDateObj.getTime();
              const elapsedTime = Date.now() - purchaseDateObj.getTime();
              let progressPercent = Math.min(Math.max((elapsedTime / totalTime) * 100, 0), 100);
              if (order.status === 'expired') progressPercent = 100;
              
              // Calculate earned so far
              const dailyRateNum = parseFloat(dailyEarning);
              const daysPassed = Math.floor(elapsedTime / (1000 * 60 * 60 * 24));
              const earnedSoFar = Math.min(daysPassed * dailyRateNum, pkg.total_return - pkg.price);

              return (
                <div
                  key={order.id}
                  className={`${styles.orderCard} ${order.status === 'expired' ? styles.ended : ''}`}
                >
                  {/* Status Badge */}
                  <div className={`${styles.statusBadge} ${order.status === 'active' ? styles.badgeActive : styles.badgeEnded}`}>
                    <span className={styles.statusDot} />
                    {order.status === 'active' ? 'Active' : order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </div>

                  {/* Header */}
                  <div className={styles.cardHeader}>
                    <div>
                      <div className={styles.cardName}>{pkg.name}</div>
                      {pkg.subtitle && <div className={styles.cardSubtitle}>{pkg.subtitle}</div>}
                    </div>
                    <div
                      className={styles.cryptoIcon}
                      style={{ backgroundColor: pkg.crypto_color }}
                    >
                      {pkg.crypto_icon}
                    </div>
                  </div>

                  {/* Progress */}
                  {order.status === 'active' && (
                    <div className={styles.progressSection}>
                      <div className={styles.progressLabel}>
                        <span>Mining Progress</span>
                        <span className={styles.progressPercent}>{Math.round(progressPercent)}%</span>
                      </div>
                      <div className={styles.progressTrack}>
                        <div className={styles.progressFill} style={{ width: `${progressPercent}%` }} />
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  <div className={styles.cardStats}>
                    <div className={styles.cardStat}>
                      <span className={styles.statLabel}>Duration</span>
                      <span className={styles.statValue}>{durationText}</span>
                    </div>
                    <div className={styles.cardStat}>
                      <span className={styles.statLabel}>Daily Rate</span>
                      <span className={styles.statValue}>${dailyEarning}</span>
                    </div>
                    <div className={styles.cardStat}>
                      <span className={styles.statLabel}>Price</span>
                      <span className={styles.statValue}>${order.amount.toLocaleString() || pkg.price.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className={styles.cardFooter}>
                    <div className={styles.footerDates}>
                      <div className={styles.dateRow}>
                        <span className={styles.dateLabel}>Purchased</span>
                        <span className={styles.dateValue}>{purchaseDateStr}</span>
                      </div>
                      <div className={styles.dateRow}>
                        <span className={styles.dateLabel}>{order.status === 'active' ? 'Ends' : 'Ended'}</span>
                        <span className={styles.dateValue}>{endDateStr}</span>
                      </div>
                    </div>
                    <div className={styles.earnedSection}>
                      <span className={styles.earnedLabel}>Earned</span>
                      <span className={`${styles.earnedValue} ${order.status === 'active' ? styles.earnedActive : ''}`}>
                        ${earnedSoFar > 0 ? earnedSoFar.toFixed(2) : '0.00'}
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
      )}
    </>
  );
}
