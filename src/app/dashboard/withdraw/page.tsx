'use client';

import { useState } from 'react';
import { CheckCircle2, XCircle, Clock, Loader2 } from 'lucide-react';
import StatusModal from '@/components/Dashboard/StatusModal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { useToast } from '@/components/ui/Toast';
import styles from './Withdraw.module.css';

const withdrawHistory = [
  { status: 'Completed', time: '3 mins Ago', amount: '$535', crypto: 'BTC' },
  { status: 'Completed', time: '15 mins Ago', amount: '$1,200', crypto: 'ETH' },
  { status: 'Failed', time: '1 hr Ago', amount: '$300', crypto: 'USDT' },
  { status: 'In Progress', time: '2 hrs Ago', amount: '$535', crypto: 'BTC' },
  { status: 'Completed', time: '4 hrs Ago', amount: '$750', crypto: 'SOL' },
  { status: 'Completed', time: '6 hrs Ago', amount: '$2,100', crypto: 'BTC' },
  { status: 'Failed', time: '10 hrs Ago', amount: '$400', crypto: 'LTC' },
  { status: 'Completed', time: '14 hrs Ago', amount: '$1,800', crypto: 'ETH' },
  { status: 'In Progress', time: '1 day Ago', amount: '$320', crypto: 'USDT' },
  { status: 'Completed', time: '1 day Ago', amount: '$900', crypto: 'BTC' },
  { status: 'Completed', time: '2 days Ago', amount: '$1,450', crypto: 'SOL' },
  { status: 'Failed', time: '2 days Ago', amount: '$175', crypto: 'XRP' },
  { status: 'Completed', time: '3 days Ago', amount: '$3,200', crypto: 'BTC' },
  { status: 'Completed', time: '3 days Ago', amount: '$280', crypto: 'ADA' },
  { status: 'Completed', time: '4 days Ago', amount: '$670', crypto: 'ETH' },
  { status: 'Failed', time: '5 days Ago', amount: '$120', crypto: 'LTC' },
  { status: 'Completed', time: '5 days Ago', amount: '$2,400', crypto: 'BTC' },
  { status: 'Completed', time: '6 days Ago', amount: '$550', crypto: 'USDT' },
  { status: 'Completed', time: '1 week Ago', amount: '$1,100', crypto: 'SOL' },
  { status: 'Completed', time: '1 week Ago', amount: '$3,800', crypto: 'ETH' },
];

const walletLabels: Record<string, string> = {
  btc: 'BTC [Bitcoin]',
  eth: 'ETH [Ethereum]',
  'usdt-trc20': 'USDT – TRC20 [Tron]',
  'usdt-erc20': 'USDT – ERC20 [Ethereum]',
  ltc: 'LTC [Litecoin]',
  usdc: 'USDC [Ethereum]',
  bch: 'BCH [Bitcoin Cash]',
};

export default function WithdrawPage() {
  const [wallet, setWallet] = useState('');
  const [amount, setAmount] = useState('');
  const [password, setPassword] = useState('');
  const [statusModal, setStatusModal] = useState<{
    type: 'success' | 'failed';
    data: { time: string; status: string; paymentSystem: string; amount: string; remarks: string };
  } | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    if (status === 'Completed') return 'var(--accent-green)';
    if (status === 'Failed') return 'var(--accent-red)';
    if (status === 'In Progress') return 'var(--accent-secondary)';
    return 'var(--accent-gold)';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'Completed') return <CheckCircle2 size={14} />;
    if (status === 'Failed') return <XCircle size={14} />;
    if (status === 'In Progress') return <Loader2 size={14} />;
    return <Clock size={14} />;
  };

  const handleViewRow = (row: typeof withdrawHistory[0]) => {
    setStatusModal({
      type: row.status === 'Failed' ? 'failed' : 'success',
      data: {
        time: 'Apr 20, 2023 12:32:38 PM',
        status: row.status === 'Failed' ? 'Failed' : 'Successful',
        paymentSystem: row.crypto,
        amount: `${row.amount} = 0.02445 ${row.crypto}`,
        remarks: row.status === 'Failed' ? 'The Withdraw Failed' : 'Amount deposited Successfully',
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
    if (!amount || isNaN(numAmount) || numAmount < 100) {
      toast({ variant: 'error', title: 'Invalid Amount', message: 'Minimum withdrawal amount is $100.' });
      return;
    }
    if (!password) {
      toast({ variant: 'error', title: 'Password Required', message: 'Please enter your password to confirm.' });
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirmWithdraw = () => {
    setShowConfirm(false);
    setShowSuccess(true);
    toast({
      variant: 'success',
      title: 'Withdrawal Submitted',
      message: `Your withdrawal of $${amount} is being processed.`,
    });
    // Reset form
    setWallet('');
    setAmount('');
    setPassword('');
  };

  return (
    <>
      <div className={styles.splitLayout}>
        {/* ─── Left: Withdraw Form ─── */}
        <div className={styles.formSection}>
          {/* Withdraw Form */}
          <div className={styles.formBody}>
            <div className="dash-input-group">
              <select
                className="dash-select"
                value={wallet}
                onChange={(e) => setWallet(e.target.value)}
                id="withdraw-wallet"
              >
                <option value="" disabled>Select Wallet</option>
                <option value="btc">BTC [Network: Bitcoin]</option>
                <option value="eth">ETH [Network: Ethereum]</option>
                <option value="usdt-trc20">USDT – TRC20 [Network: Tron]</option>
                <option value="usdt-erc20">USDT – ERC20 [Network: Ethereum]</option>
                <option value="ltc">LTC [Network: Litecoin]</option>
                <option value="usdc">USDC [Network: Ethereum]</option>
                <option value="bch">BCH [Network: Bitcoin Cash]</option>
              </select>
              <input
                type="text"
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
              Note: The minimum Withdraw $100<br />
              Please fill in the TXID / Transaction ID / Hash number after the transfer is completed.
            </p>

            <button className="dash-btn-primary" id="withdraw-submit-btn" onClick={handleWithdrawClick}>
              Withdraw
            </button>
          </div>

          {/* Balance card stretches to fill remaining space */}
          <div className={styles.balanceCardStretch}>
            <h3>Available Balance</h3>
            <span className={styles.balanceAmount}>$ 340</span>
          </div>
        </div>

        {/* ─── Right: Withdraw History (Fixed Panel) ─── */}
        <div className={styles.historyPanel}>
          <div className={styles.historyHeader}>
            <h3>Withdraw History</h3>
            <span className={styles.historyCount}>{withdrawHistory.length} records</span>
          </div>
          <div className={styles.historyList}>
            {withdrawHistory.map((row, i) => (
              <div key={i} className={styles.historyItem} onClick={() => handleViewRow(row)}>
                <div className={styles.historyItemLeft}>
                  <div className={styles.historyStatusIcon} style={{ color: getStatusColor(row.status) }}>
                    {getStatusIcon(row.status)}
                  </div>
                  <div className={styles.historyItemInfo}>
                    <span className={styles.historyStatus} style={{ color: getStatusColor(row.status) }}>
                      {row.status}
                    </span>
                    <span className={styles.historyTime}>{row.time}</span>
                  </div>
                </div>
                <div className={styles.historyItemRight}>
                  <span className={styles.historyAmount}>{row.amount}</span>
                  <span className={styles.historyCrypto}>{row.crypto}</span>
                </div>
              </div>
            ))}
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
