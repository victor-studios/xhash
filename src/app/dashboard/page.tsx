'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Copy, Wallet, ArrowUpFromLine, TrendingUp, Users, Trophy, CheckSquare, AlertTriangle, ListChecks, Activity, Cpu, Zap } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import styles from './Dashboard.module.css';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';

interface WeeklyData {
  day: string;
  earned: number;
  mined: number;
}

export default function DashboardPage() {
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState({ active: 0, expired: 0, all: 0 });
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [maxVal, setMaxVal] = useState(100);

  useEffect(() => {
    async function fetchDashboardData() {
      if (!user?.id) return;
      
      try {
        setLoading(true);

        // Fetch Profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error fetching profile:', profileError);
        } else if (profileData) {
          setProfile(profileData);
        }

        // Fetch Orders Count
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('status')
          .eq('user_id', user.id);
          
        if (!ordersError && ordersData) {
          const active = ordersData.filter(o => o.status === 'active').length;
          const expired = ordersData.filter(o => o.status === 'expired').length;
          setOrders({ active, expired, all: ordersData.length });
        }

        // Fetch Mining History
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const { data: historyData, error: historyError } = await supabase
          .from('mining_history')
          .select('*')
          .eq('user_id', user.id)
          .gte('date', sevenDaysAgo.toISOString().split('T')[0])
          .order('date', { ascending: true });

        if (!historyError && historyData && historyData.length > 0) {
          const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          const formattedData = historyData.map(d => {
            const dateObj = new Date(d.date);
            return {
              day: days[dateObj.getDay()],
              earned: Number(d.earned) || 0,
              mined: Number(d.mined) || 0
            };
          });
          setWeeklyData(formattedData);
          
          const max = Math.max(...formattedData.map(d => Math.max(d.earned, d.mined)));
          setMaxVal(max > 0 ? max : 100);
        } else {
          // Default mock layout for empty state
          const defaultData = [
            { day: 'Mon', earned: 0, mined: 0 },
            { day: 'Tue', earned: 0, mined: 0 },
            { day: 'Wed', earned: 0, mined: 0 },
            { day: 'Thu', earned: 0, mined: 0 },
            { day: 'Fri', earned: 0, mined: 0 },
            { day: 'Sat', earned: 0, mined: 0 },
            { day: 'Sun', earned: 0, mined: 0 },
          ];
          setWeeklyData(defaultData);
          setMaxVal(100);
        }

      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      fetchDashboardData();
    }
  }, [user?.id, authLoading]);

  const handleCopy = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://xhashgpu.com';
    const affiliateUrl = `${origin}/register?r=${profile?.affiliate_code || 'default'}`;
    navigator.clipboard.writeText(affiliateUrl);
    toast({ variant: 'success', title: 'Copied!', message: 'Affiliate link copied to clipboard.' });
  };

  if (authLoading || loading) {
    return <div className="p-8 text-center" style={{ color: 'var(--text-secondary)' }}>Loading dashboard data...</div>;
  }

  // Default fallbacks if profile not found
  const availableBalance = profile?.available_balance || 0;
  const totalDeposit = profile?.total_deposit || 0;
  const totalEarned = profile?.total_earned || 0;
  const totalWithdrawn = profile?.total_withdrawn || 0;
  const hashRate = profile?.hash_rate || 0;
  const activeMiners = profile?.active_miners || 0;
  const dailyReturn = profile?.daily_return || 0;
  const affiliateEarned = profile?.affiliate_earned || 0;
  const rewardsEarned = profile?.rewards_earned || 0;

  return (
    <>
      {/* Balance Cards */}
      {/* Balance & Stats Row */}
      <div className={styles.topDashboardSection}>
        {/* Main Available Balance Card */}
        <div className={styles.mainBalanceCard}>
          <div className={styles.mainBalanceHeader}>
            <div className={styles.balanceIconWrapper}>
              <Wallet size={32} color="var(--accent-primary)" />
            </div>
            <div>
              <span className={styles.mainBalanceLabel}>Available Balance</span>
              <div className={styles.mainBalanceValue}>$ {availableBalance.toFixed(2)}</div>
            </div>
          </div>
          <div className={styles.mainBalanceActions}>
            <Link href="/dashboard/deposit" className={styles.mainActionBtn}>
              <Wallet size={16} /> Deposit
            </Link>
            <Link href="/dashboard/withdraw" className={`${styles.mainActionBtn} ${styles.btnOutline}`}>
              <ArrowUpFromLine size={16} /> Withdraw
            </Link>
          </div>
        </div>

        {/* Secondary Stats Cards */}
        <div className={styles.secondaryStatsGrid}>
          <div className={styles.secondaryStatCard}>
            <div className={styles.statIconSmall} style={{ color: 'var(--accent-green)', background: 'rgba(0, 230, 118, 0.1)' }}>
              <TrendingUp size={20} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statLabel}>Total Earned</span>
              <span className={styles.statValue}>$ {totalEarned.toFixed(2)}</span>
            </div>
          </div>
          
          <div className={styles.secondaryStatCard}>
            <div className={styles.statIconSmall} style={{ color: 'var(--accent-gold)', background: 'rgba(255, 215, 0, 0.1)' }}>
              <Wallet size={20} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statLabel}>Total Deposit</span>
              <span className={styles.statValue}>$ {totalDeposit.toFixed(2)}</span>
            </div>
          </div>

          <div className={styles.secondaryStatCard}>
            <div className={styles.statIconSmall} style={{ color: 'var(--accent-secondary)', background: 'rgba(0, 210, 255, 0.1)' }}>
              <ArrowUpFromLine size={20} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statLabel}>Total Withdrawn</span>
              <span className={styles.statValue}>$ {totalWithdrawn.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mining Progress Graph */}
      <div className={styles.graphSection}>
        <div className={styles.graphHeader}>
          <h2 className={styles.sectionTitle}>Mining Progress</h2>
          <div className={styles.graphLegend}>
            <span className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: 'var(--accent-primary)' }} />
              Earned
            </span>
            <span className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: 'var(--accent-secondary)' }} />
              Mined
            </span>
          </div>
        </div>

        <div className={styles.graph}>
          {/* Y-axis labels */}
          <div className={styles.yAxis}>
            <span>${maxVal}</span>
            <span>${Math.round(maxVal * 0.75)}</span>
            <span>${Math.round(maxVal * 0.5)}</span>
            <span>${Math.round(maxVal * 0.25)}</span>
            <span>$0</span>
          </div>

          {/* Bars */}
          <div className={styles.bars}>
            {weeklyData.map((d, index) => (
              <div key={index} className={styles.barGroup}>
                <div className={styles.barPair}>
                  <div
                    className={styles.bar}
                    style={{
                      height: `${(d.earned / maxVal) * 100}%`,
                      background: 'var(--gradient-primary)',
                    }}
                    title={`Earned: $${d.earned}`}
                  />
                  <div
                    className={styles.bar}
                    style={{
                      height: `${(d.mined / maxVal) * 100}%`,
                      background: 'linear-gradient(180deg, var(--accent-secondary), rgba(0, 210, 255, 0.4))',
                    }}
                    title={`Mined: $${d.mined}`}
                  />
                </div>
                <span className={styles.barLabel}>{d.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className={styles.quickStats}>
        <div className={styles.quickStatCard}>
          <div className={styles.quickStatIcon} style={{ background: 'rgba(108, 92, 231, 0.12)' }}>
            <Activity size={20} color="var(--accent-primary)" />
          </div>
          <div>
            <span className={styles.quickStatLabel}>Hash Rate</span>
            <span className={styles.quickStatValue}>{hashRate} MH/s</span>
          </div>
        </div>
        <div className={styles.quickStatCard}>
          <div className={styles.quickStatIcon} style={{ background: 'rgba(0, 230, 118, 0.12)' }}>
            <Cpu size={20} color="var(--accent-green)" />
          </div>
          <div>
            <span className={styles.quickStatLabel}>Active Miners</span>
            <span className={styles.quickStatValue}>{activeMiners}</span>
          </div>
        </div>
        <div className={styles.quickStatCard}>
          <div className={styles.quickStatIcon} style={{ background: 'rgba(255, 215, 0, 0.12)' }}>
            <Zap size={20} color="var(--accent-gold)" />
          </div>
          <div>
            <span className={styles.quickStatLabel}>Daily Return</span>
            <span className={styles.quickStatValue}>${dailyReturn.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-info">
            <h4>Profits</h4>
            <span className="stat-value" style={{ color: 'var(--accent-green)' }}>$ {totalEarned.toFixed(2)}</span>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(0, 230, 118, 0.12)', color: 'var(--accent-green)' }}>
            <TrendingUp size={24} />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <h4>Affiliates</h4>
            <span className="stat-value" style={{ color: 'var(--accent-green)' }}>$ {affiliateEarned.toFixed(2)}</span>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(0, 210, 255, 0.12)', color: 'var(--accent-secondary)' }}>
            <Users size={24} />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <h4>Rewards</h4>
            <span className="stat-value" style={{ color: 'var(--accent-green)' }}>$ {rewardsEarned.toFixed(2)}</span>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(255, 215, 0, 0.12)', color: 'var(--accent-gold)' }}>
            <Trophy size={24} />
          </div>
        </div>
      </div>

      {/* My Orders */}
      <h2 className={styles.sectionTitle}>My orders</h2>
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-info">
            <h4>Active</h4>
            <span className="stat-value" style={{ color: 'var(--accent-green)' }}>{orders.active}</span>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(0, 230, 118, 0.12)', color: 'var(--accent-green)' }}>
            <CheckSquare size={24} />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <h4>Expired</h4>
            <span className="stat-value" style={{ color: 'var(--accent-gold)' }}>{orders.expired}</span>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(255, 215, 0, 0.12)', color: 'var(--accent-gold)' }}>
            <AlertTriangle size={24} />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <h4>All</h4>
            <span className="stat-value" style={{ color: 'var(--accent-secondary)' }}>{orders.all}</span>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(0, 210, 255, 0.12)', color: 'var(--accent-secondary)' }}>
            <ListChecks size={24} />
          </div>
        </div>
      </div>

      {/* Affiliate Link */}
      <div className="affiliate-bar">
        <div className="affiliate-bar-label">Affiliate Link :</div>
        <div className="affiliate-bar-url">
          {(typeof window !== 'undefined' ? window.location.origin : 'https://xhashgpu.com')}/register?r={profile?.affiliate_code || 'default'}
        </div>
        <button className="affiliate-bar-copy" onClick={handleCopy} aria-label="Copy affiliate link" id="copy-affiliate-link">
          <Copy size={18} />
        </button>
      </div>
    </>
  );
}

