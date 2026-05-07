'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle2, XCircle, Clock, Loader2 } from 'lucide-react';
import StatusModal from '@/components/Dashboard/StatusModal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { useToast } from '@/components/ui/Toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { timeAgo } from '@/lib/utils';
import styles from './Withdraw.module.css';

const walletLabels: Record<string, string> = {
  'usdt-trc20': '₮ USDT [Network: Tron TRC20]',
  'usdt-bep20': '₮ USDT [Network: Binance BEP20]',
};

export default function WithdrawPage() {
  const { user, loading: authLoading, updateBalance } = useAuth();
  const [wallet, setWallet] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [password, setPassword] = useState('');
  const [statusModal, setStatusModal] = useState<{
    type: 'success' | 'failed';
    data: { time: string; status: string; paymentSystem: string; amount: string; remarks: string };
  } | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [withdrawHistory, setWithdrawHistory] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      if (!user?.id) return;
      try {
        setLoading(true);
        // Fetch balance + wallet settings
        const { data: profile } = await supabase
          .from('profiles')
          .select('available_balance, wallet_network, wallet_address')
          .eq('id', user.id)
          .single();
        if (profile) {
          setAvailableBalance(profile.available_balance || 0);
          setWallet(profile.wallet_network || '');
          setWalletAddress(profile.wallet_address || '');
        }

        // Fetch withdrawals
        const { data: txs } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .eq('type', 'withdraw')
          .order('created_at', { ascending: false });
        
        if (txs) setWithdrawHistory(txs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (!authLoading) fetchData();
  }, [user?.id, authLoading]);

  const getStatusColor = (status: string) => {
    if (status === 'Completed' || status === 'Confirmed') return 'var(--accent-green)';
    if (status === 'Failed') return 'var(--accent-red)';
    if (status === 'In Progress' || status === 'Processing') return 'var(--accent-secondary)';
    return 'var(--accent-gold)';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'Completed' || status === 'Confirmed') return <CheckCircle2 size={14} />;
    if (status === 'Failed') return <XCircle size={14} />;
    if (status === 'In Progress' || status === 'Processing') return <Loader2 size={14} className="spin" />;
    return <Clock size={14} />;
  };



  const handleViewRow = (row: any) => {
    let remarks = 'Amount withdrawn successfully';
    if (row.status === 'Failed') remarks = 'The withdrawal failed';
    if (row.status === 'In Progress' || row.status === 'Processing' || row.status === 'Pending') remarks = 'Withdrawal is currently being processed';
    
    setStatusModal({
      type: row.status === 'Failed' ? 'failed' : 'success',
      data: {
        time: new Date(row.created_at).toLocaleString(),
        status: row.status,
        paymentSystem: row.currency,
        amount: `$${row.amount}`,
        remarks: remarks,
      },
    });
  };

  const handleWithdrawClick = () => {
    // Validation
    if (!wallet) {
      toast({ variant: 'error', title: 'Wallet Required', message: 'Please select a wallet to withdraw to.' });
      return;
    }
    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || numAmount < 10) {
      toast({ variant: 'error', title: 'Invalid Amount', message: 'Minimum withdrawal amount is $10.' });
      return;
    }
    if (numAmount > availableBalance) {
      toast({ variant: 'error', title: 'Insufficient Funds', message: 'You do not have enough balance.' });
      return;
    }
    if (!password) {
      toast({ variant: 'error', title: 'Password Required', message: 'Please enter your password to confirm.' });
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirmWithdraw = async () => {
    if (!user?.id) return;

    try {
      // In a real app we would verify password here with auth API
      
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch('/api/withdraw/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          wallet: walletLabels[wallet] || wallet,
          password: password,
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit withdrawal request');
      }

      // Optimistic UI updates
      setAvailableBalance(result.new_balance);
      updateBalance(result.new_balance); // Update global auth context
      
      const { data: txs } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', 'withdraw')
        .order('created_at', { ascending: false });
      if (txs) setWithdrawHistory(txs);

      setShowConfirm(false);
      setShowSuccess(true);
      toast({
        variant: 'success',
        title: 'Withdrawal Submitted',
        message: `Your withdrawal of $${amount} is being processed.`,
      });

      // Reset form (except wallet which is saved)
      setAmount('');
      setPassword('');

    } catch (err: any) {
      console.error(err);
      toast({ variant: 'error', title: 'Error', message: err.message || 'Failed to submit withdrawal request.' });
    }
  };

  return (
    <>
      <div className={styles.splitLayout}>
        {/* ─── Left: Withdraw Form ─── */}
        <div className={styles.formSection}>
          {/* Withdraw Form */}
          <div className={styles.formBody}>
            <div className="dash-input-group">
              <input
                type="text"
                className="dash-input"
                placeholder="No wallet configured. Please add one in Settings."
                value={wallet ? `${walletLabels[wallet]} - ${walletAddress}` : ''}
                disabled
                id="withdraw-wallet"
                style={{ opacity: 0.7, cursor: 'not-allowed' }}
              />
              <input
                type="number"
                className="dash-input"
                placeholder="Enter Amount in $"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                id="withdraw-amount"
              />
              <input
                type="password"
                className="dash-input"
                placeholder="Enter Password to confirm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="withdraw-password"
              />
            </div>

            <p className="dash-note">
              Note: The minimum Withdraw $10<br />
              Please fill in the TXID / Transaction ID / Hash number after the transfer is completed.
            </p>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="dash-btn-primary" id="withdraw-submit-btn" onClick={handleWithdrawClick} style={{ flex: 1 }}>
                Withdraw
              </button>
              <Link 
                href="/dashboard/settings" 
                className="dash-btn-primary" 
                style={{ 
                  flex: 1, 
                  background: 'var(--bg-card)', 
                  border: '1px solid var(--border-default)', 
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none'
                }}
              >
                Change Wallet
              </Link>
            </div>
          </div>

          {/* Balance card stretches to fill remaining space */}
          <div className={styles.balanceCardStretch}>
            <h3>Available Balance</h3>
            <span className={styles.balanceAmount}>$ {availableBalance.toFixed(2)}</span>
          </div>
        </div>

        {/* ─── Right: Withdraw History (Fixed Panel) ─── */}
        <div className={styles.historyPanel}>
          <div className={styles.historyHeader}>
            <h3>Withdraw History</h3>
            <span className={styles.historyCount}>{withdrawHistory.length} records</span>
          </div>
          <div className={styles.historyList}>
            {loading ? (
              <div className="p-4 text-center" style={{ color: 'var(--text-secondary)' }}>
                <Loader2 size={24} className="animate-spin mx-auto mb-2" />
                Loading history...
              </div>
            ) : withdrawHistory.length === 0 ? (
              <div className="p-4 text-center" style={{ color: 'var(--text-secondary)' }}>
                No withdrawal history found.
              </div>
            ) : (
              withdrawHistory.map((row) => (
                <div key={row.id} className={styles.historyItem} onClick={() => handleViewRow(row)}>
                  <div className={styles.historyItemLeft}>
                    <div className={styles.historyStatusIcon} style={{ color: getStatusColor(row.status) }}>
                      {getStatusIcon(row.status)}
                    </div>
                    <div className={styles.historyItemInfo}>
                      <span className={styles.historyStatus} style={{ color: getStatusColor(row.status) }}>
                        {row.status}
                      </span>
                      <span className={styles.historyTime}>{timeAgo(row.created_at)}</span>
                    </div>
                  </div>
                  <div className={styles.historyItemRight}>
                    <span className={styles.historyAmount}>${row.amount}</span>
                    <span className={styles.historyCrypto}>{row.currency}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Status Modal */}
      {statusModal && (
        <StatusModal
          type={statusModal.type}
          data={statusModal.data}
          onClose={() => setStatusModal(null)}
        />
      )}

      {/* Withdraw Confirmation Modal */}
      {showConfirm && (
        <ConfirmModal
          variant="withdraw"
          title="Confirm Withdrawal"
          message={`You are about to withdraw $${amount} to your ${walletLabels[wallet] || wallet} wallet.`}
          details={[
            { label: 'Wallet', value: walletLabels[wallet] || wallet },
            { label: 'Amount', value: `$${amount}` },
            { label: 'Processing Time', value: '~30 minutes' },
          ]}
          confirmLabel="Confirm Withdrawal"
          cancelLabel="Cancel"
          onConfirm={handleConfirmWithdraw}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      {/* Withdrawal Success Modal */}
      {showSuccess && (
        <ConfirmModal
          variant="success"
          title="Withdrawal Submitted!"
          message="Your withdrawal request has been submitted and is being processed. You will receive your funds shortly."
          details={[
            { label: 'Status', value: 'Processing', accent: true },
            { label: 'Estimated Time', value: '~30 minutes' },
          ]}
          confirmLabel="Done"
          onCancel={() => setShowSuccess(false)}
          singleAction
        />
      )}
    </>
  );
}
