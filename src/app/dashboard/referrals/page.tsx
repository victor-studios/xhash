'use client';

import { useState, useEffect } from 'react';
import { Copy, Users, CheckSquare, TrendingUp, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { timeAgo } from '@/lib/utils';
import styles from './Referrals.module.css';

interface ReferralRow {
  id: string;
  referred_email: string;
  status: 'verified' | 'pending';
  total_earned: number;
  created_at: string;
}

export default function ReferralsPage() {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [affiliateCode, setAffiliateCode] = useState('...');
  const [referrals, setReferrals] = useState<ReferralRow[]>([]);
  
  // Stats
  const totalReferrals = referrals.length;
  const verifiedReferrals = referrals.filter(r => r.status === 'verified').length;
  const totalEarned = referrals.reduce((acc, curr) => acc + (curr.total_earned || 0), 0);

  useEffect(() => {
    async function fetchData() {
      if (!user?.id) return;
      try {
        setLoading(true);
        // Fetch affiliate code from profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('affiliate_code')
          .eq('id', user.id)
          .single();
          
        if (profile?.affiliate_code) {
          setAffiliateCode(profile.affiliate_code);
        }

        // Fetch referrals
        const { data: refData } = await supabase
          .from('referrals')
          .select('*')
          .eq('referrer_id', user.id)
          .order('created_at', { ascending: false });
          
        if (refData) {
          setReferrals(refData as ReferralRow[]);
        }
      } catch (err) {
        console.error('Failed to fetch referrals data:', err);
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      fetchData();
    }
  }, [user?.id, authLoading]);

  const referralLink = `https://xhashgpu.com/r/${affiliateCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    toast({ variant: 'success', title: 'Copied!', message: 'Affiliate link copied to clipboard.' });
  };



  return (
    <>
      {/* Info Banner */}
      <div className={styles.infoBanner}>
        <div className={styles.bannerIcon}>
          <span style={{ fontSize: '3rem' }}>💰</span>
        </div>
        <div className={styles.bannerText}>
          <p>
            We allow you to earn money by recommending our website to others. You can start making money even if you
            do not invest. You&apos;ll earn up to 4.5% of their purchase on each order. See the link below, copy-paste that link
            and share it with your friends, and earn a massive referral reward.
          </p>
          <p className={styles.bannerNote}>
            Note: Affiliate Program doesn&apos;t include $10 Primary Mining.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-info">
            <h4>Total Referrals</h4>
            <span className="stat-value" style={{ color: 'var(--accent-green)' }}>{totalReferrals}</span>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(0, 230, 118, 0.12)', color: 'var(--accent-green)' }}>
            <Users size={24} />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <h4>Referral Earning</h4>
            <span className="stat-value" style={{ color: 'var(--accent-gold)' }}>${totalEarned.toFixed(2)}</span>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(255, 215, 0, 0.12)', color: 'var(--accent-gold)' }}>
            <TrendingUp size={24} />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <h4>Verified Referrals</h4>
            <span className="stat-value" style={{ color: 'var(--accent-secondary)' }}>{verifiedReferrals}</span>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(0, 210, 255, 0.12)', color: 'var(--accent-secondary)' }}>
            <CheckSquare size={24} />
          </div>
        </div>
      </div>

      {/* Affiliate Link */}
      <div className="affiliate-bar" style={{ marginBottom: 'var(--space-2xl)' }}>
        <div className="affiliate-bar-label">Affiliate Link :</div>
        <div className="affiliate-bar-url">{referralLink}</div>
        <button className="affiliate-bar-copy" onClick={handleCopy} aria-label="Copy affiliate link">
          <Copy size={18} />
        </button>
      </div>

      {/* Referral History Table */}
      <div className="dash-table-wrap">
        <table className="dash-table">
          <thead>
            <tr>
              <th>Referred Email</th>
              <th>Status</th>
              <th>Time</th>
              <th style={{ textAlign: 'right' }}>Total Earning</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: 'var(--space-3xl)' }}>
                  <Loader2 className="animate-spin mx-auto mb-2" size={24} style={{ color: 'var(--text-secondary)' }} />
                  <span style={{ color: 'var(--text-secondary)' }}>Loading referrals...</span>
                </td>
              </tr>
            ) : referrals.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: 'var(--space-3xl)', color: 'var(--text-muted)' }}>
                  No referrals yet.
                </td>
              </tr>
            ) : (
              referrals.map((row) => (
                <tr key={row.id}>
                  <td>
                    {/* Mask email partially for privacy */}
                    {row.referred_email.replace(/(.{2})(.*)(?=@)/,
                      (_, a, b) => a + '*'.repeat(b.length)
                    )}
                  </td>
                  <td>
                    <span style={{ 
                      color: row.status === 'verified' ? 'var(--accent-green)' : 'var(--accent-gold)',
                      textTransform: 'capitalize' 
                    }}>
                      {row.status}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{timeAgo(row.created_at)}</td>
                  <td style={{ textAlign: 'right', color: 'var(--text-primary)', fontWeight: 600 }}>
                    ${(row.total_earned || 0).toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
