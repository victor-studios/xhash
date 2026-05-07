'use client';

import { useState, useRef, useEffect } from 'react';
import Script from 'next/script';
import { Copy, Clock, CheckCircle2, XCircle, Upload, Loader2 } from 'lucide-react';
import StatusModal from '@/components/Dashboard/StatusModal';
import { useToast } from '@/components/ui/Toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { timeAgo } from '@/lib/utils';
import styles from './Deposit.module.css';

export default function DepositPage() {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'balance' | 'direct'>('balance');
  const [amount, setAmount] = useState('');
  
  const [statusModal, setStatusModal] = useState<{
    type: 'success' | 'failed';
    data: { time: string; status: string; paymentSystem: string; amount: string; remarks: string };
  } | null>(null);
  
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [depositHistory, setDepositHistory] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      if (!user?.id) return;
      try {
        setLoading(true);
        // Fetch balance
        const { data: profile } = await supabase
          .from('profiles')
          .select('available_balance')
          .eq('id', user.id)
          .single();
        if (profile) setAvailableBalance(profile.available_balance || 0);

        // Fetch deposits
        const { data: txs } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .eq('type', 'deposit')
          .order('created_at', { ascending: false });
        
        if (txs) setDepositHistory(txs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (!authLoading) fetchData();
  }, [user?.id, authLoading]);

  const getStatusColor = (status: string) => {
    if (status === 'Completed') return 'var(--accent-green)';
    if (status === 'Failed') return 'var(--accent-red)';
    return 'var(--accent-gold)';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'Completed') return <CheckCircle2 size={14} />;
    if (status === 'Failed') return <XCircle size={14} />;
    return <Clock size={14} />;
  };



  const handleRowAction = (row: any) => {
    if (row.status === 'Waiting for payment') {
      // Do nothing or handle bank transfer upload proof logic if needed in the future
      toast({ variant: 'info', title: 'Processing', message: 'Bank transfer is being processed.' });
    } else {
      setStatusModal({
        type: row.status === 'Failed' ? 'failed' : 'success',
        data: {
          time: new Date(row.created_at).toLocaleString(),
          status: row.status,
          paymentSystem: row.currency,
          amount: `$${row.amount}`,
          remarks: row.status === 'Failed' ? 'The deposit failed' : 'Amount deposited successfully',
        },
      });
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ variant: 'success', title: 'Copied!', message: 'Address copied to clipboard.' });
  };

  const handleBankDeposit = async () => {
    if (!amount || parseFloat(amount) < 500) {
      toast({ variant: 'error', title: 'Invalid Amount', message: 'Minimum bank deposit is $500.' });
      return;
    }
    
    if (!user?.id) return;
    
    const { error } = await supabase.from('transactions').insert({
      user_id: user.id,
      type: 'deposit',
      amount: parseFloat(amount),
      currency: 'USD (Bank)',
      status: 'Waiting for payment',
      description: 'Direct Bank Transfer'
    });

    if (!error) {
      toast({ variant: 'info', title: 'Deposit Initiated', message: 'Please complete the bank transfer. Your account will be credited once confirmed.' });
      setAmount('');
      // Optimistically fetch again to update list
      const { data: txs } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', 'deposit')
        .order('created_at', { ascending: false });
      if (txs) setDepositHistory(txs);
    } else {
      toast({ variant: 'error', title: 'Error', message: 'Failed to initiate deposit.' });
    }
  };

  return (
    <>
      <Script src="https://atlos.io/packages/app/atlos.js" strategy="lazyOnload" />
      <div className={styles.splitLayout}>
        {/* ─── Left: Deposit Form ─── */}
        <div className={styles.formSection}>
          {/* Deposit Method Tabs + Form */}
          <div className={styles.formBody}>
            <div className="dash-tabs">
              <button
                className={`dash-tab ${activeTab === 'balance' ? 'active' : ''}`}
                onClick={() => setActiveTab('balance')}
              >
                Crypto Deposit
              </button>
              <button
                className={`dash-tab ${activeTab === 'direct' ? 'active' : ''}`}
                onClick={() => setActiveTab('direct')}
              >
                Direct Deposit / Bank Transfer
              </button>
            </div>

            <div className="dash-tab-content">
              {activeTab === 'balance' && (
                <>
                  <div style={{ textAlign: 'center', marginBottom: '1.5rem', background: 'var(--bg-card)', padding: '16px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-default)' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '12px' }}>
                      <span className={styles.cryptoIconBadge} style={{ backgroundColor: '#F7931A', width: '32px', height: '32px', fontSize: '1.1rem' }}>₿</span>
                      <span className={styles.cryptoIconBadge} style={{ backgroundColor: '#26A17B', width: '32px', height: '32px', fontSize: '1.1rem' }}>₮</span>
                      <span className={styles.cryptoIconBadge} style={{ backgroundColor: '#2775CA', width: '32px', height: '32px', fontSize: '1.1rem', fontWeight: 'bold' }}>$</span>
                      <span className={styles.cryptoIconBadge} style={{ backgroundColor: '#627EEA', width: '32px', height: '32px', fontSize: '1.1rem' }}>⟠</span>
                      <span className={styles.cryptoIconBadge} style={{ backgroundColor: '#9945FF', width: '32px', height: '32px', fontSize: '1.1rem' }}>◎</span>
                      <span className={styles.cryptoIconBadge} style={{ backgroundColor: '#F3BA2F', width: '32px', height: '32px', fontSize: '1.1rem', color: '#000', fontWeight: 'bold' }}>B</span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                      You can deposit quick and safely within minutes with crypto deposit
                    </p>
                  </div>

                  <div className="dash-input-group">

                    <input
                      type="number"
                      className="dash-input"
                      placeholder="Enter Amount in $"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      id="deposit-amount"
                    />
                  </div>

                  <p className="dash-note">
                    Note: The minimum deposit $10<br />
                    Please fill in the TXID / Transaction ID / Hash number after the transfer is completed.
                  </p>

                  <button
                    className="dash-btn-primary"
                    onClick={() => {
                      if (!amount || parseFloat(amount) < 10) {
                        toast({ variant: 'error', title: 'Invalid Amount', message: 'Minimum deposit is $10.' });
                        return;
                      }
                      
                      if (typeof (window as any).atlos !== 'undefined') {
                        (window as any).atlos.Pay({
                          merchantId: '7VTAJWP38H',
                          orderId: user?.id || `GUEST_${Date.now()}`,
                          orderAmount: parseFloat(amount)
                        });
                      } else {
                        toast({ variant: 'error', title: 'Error', message: 'Payment gateway is still loading. Please try again in a moment.' });
                      }
                    }}
                    id="deposit-submit-btn"
                  >
                    Proceed to Payment
                  </button>
                </>
              )}

              {activeTab === 'direct' && (
                <>
                  <div className={styles.bankCard}>
                    <div className={styles.bankRow}>
                      <span className={styles.bankLabel}>Bank Name</span>
                      <span className={styles.bankValue}>
                        XHash Financial Ltd.
                        <button className={styles.bankCopyBtn} onClick={() => handleCopy('XHash Financial Ltd.')} aria-label="Copy">
                          <Copy size={12} />
                        </button>
                      </span>
                    </div>
                    <div className={styles.bankRow}>
                      <span className={styles.bankLabel}>Account Number</span>
                      <span className={styles.bankValue}>
                        4820 7391 0056 2314
                        <button className={styles.bankCopyBtn} onClick={() => handleCopy('4820739100562314')} aria-label="Copy">
                          <Copy size={12} />
                        </button>
                      </span>
                    </div>
                    <div className={styles.bankRow}>
                      <span className={styles.bankLabel}>Routing Number</span>
                      <span className={styles.bankValue}>
                        021000089
                        <button className={styles.bankCopyBtn} onClick={() => handleCopy('021000089')} aria-label="Copy">
                          <Copy size={12} />
                        </button>
                      </span>
                    </div>
                    <div className={styles.bankRow}>
                      <span className={styles.bankLabel}>SWIFT Code</span>
                      <span className={styles.bankValue}>
                        XHSHUS33
                        <button className={styles.bankCopyBtn} onClick={() => handleCopy('XHSHUS33')} aria-label="Copy">
                          <Copy size={12} />
                        </button>
                      </span>
                    </div>
                    <div className={styles.bankRow}>
                      <span className={styles.bankLabel}>Reference</span>
                      <span className={styles.bankValue}>
                        XH-DEP-{user?.id?.substring(0, 8) || '00000000'}
                        <button className={styles.bankCopyBtn} onClick={() => handleCopy(`XH-DEP-${user?.id?.substring(0, 8) || '00000000'}`)} aria-label="Copy">
                          <Copy size={12} />
                        </button>
                      </span>
                    </div>
                  </div>

                  <p className={styles.bankNote}>
                    ⚠ Always include the reference number — transfers without it may be delayed up to 48 hours.
                  </p>

                  <div className="dash-input-group" style={{ marginTop: 'var(--space-lg)' }}>
                    <input
                      type="number"
                      className="dash-input"
                      placeholder="Enter Amount in $"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      id="bank-deposit-amount"
                    />
                  </div>

                  <p className="dash-note">
                    Note: Minimum bank deposit is $500. Processing time: 1–3 business days.
                  </p>

                  <button
                    className="dash-btn-primary"
                    onClick={handleBankDeposit}
                    id="bank-deposit-submit-btn"
                  >
                    Confirm Bank Deposit
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Balance card stretches to fill remaining space */}
          <div className={styles.balanceCardStretch}>
            <h3>Available Balance</h3>
            <span className={styles.balanceAmount}>$ {availableBalance.toFixed(2)}</span>
          </div>
        </div>

        {/* ─── Right: Deposit History (Fixed Panel) ─── */}
        <div className={styles.historyPanel}>
          <div className={styles.historyHeader}>
            <h3>Deposit History</h3>
            <span className={styles.historyCount}>{depositHistory.length} records</span>
          </div>
          <div className={styles.historyList}>
            {loading ? (
              <div className="p-4 text-center" style={{ color: 'var(--text-secondary)' }}>
                <Loader2 size={24} className="animate-spin mx-auto mb-2" />
                Loading history...
              </div>
            ) : depositHistory.length === 0 ? (
              <div className="p-4 text-center" style={{ color: 'var(--text-secondary)' }}>
                No deposit history found.
              </div>
            ) : (
              depositHistory.map((row) => (
                <div key={row.id} className={styles.historyItem} onClick={() => handleRowAction(row)}>
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
                    {row.status === 'Waiting for payment' && (
                      <span className={styles.uploadBadge}>
                        <Upload size={10} />
                      </span>
                    )}
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
    </>
  );
}
