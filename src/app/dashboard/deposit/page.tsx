'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Copy, Clock, CheckCircle2, XCircle, Upload } from 'lucide-react';
import DepositModal from '@/components/Dashboard/DepositModal';
import UploadProofModal from '@/components/Dashboard/UploadProofModal';
import StatusModal from '@/components/Dashboard/StatusModal';
import { useToast } from '@/components/ui/Toast';
import styles from './Deposit.module.css';

/* ─── Crypto Options ─── */
interface CryptoOption {
  id: string;
  name: string;
  chain: string;
  symbol: string;
  icon: string;
  color: string;
  address: string;
}

const cryptoOptions: CryptoOption[] = [
  { id: 'usdt-trc20', name: 'USDT', chain: 'TRC-20 (Tron)', symbol: 'USDT', icon: '₮', color: '#26A17B', address: 'TXqHhR3vKx3sYUgwNPx5WMj6Hf1YkGNg8Z' },
  { id: 'usdt-bsc', name: 'USDT', chain: 'BEP-20 (BSC)', symbol: 'USDT', icon: '₮', color: '#26A17B', address: '0x8B2Fe44c1a62d5C2eF8bC1a2E3b4D5c6F7890123' },
  { id: 'usdt-sol', name: 'USDT', chain: 'SPL (Solana)', symbol: 'USDT', icon: '₮', color: '#26A17B', address: '7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj' },
  { id: 'sol', name: 'Solana', chain: 'Solana', symbol: 'SOL', icon: '◎', color: '#9945FF', address: '5kGzRqCNjfVLP4k9dfq4bUzDrgY2rqTnGX3KY6vRcbiN' },
  { id: 'eth', name: 'Ethereum', chain: 'ERC-20', symbol: 'ETH', icon: '⟠', color: '#627EEA', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD3e' },
  { id: 'btc', name: 'Bitcoin', chain: 'Bitcoin', symbol: 'BTC', icon: '₿', color: '#F7931A', address: '3HCXsjABKQe7mTNmI2HAwc1RRatMvU6Htqa' },
  { id: 'ltc', name: 'Litecoin', chain: 'Litecoin', symbol: 'LTC', icon: 'Ł', color: '#BFBBBB', address: 'ltc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4' },
  { id: 'xrp', name: 'XRP', chain: 'XRPL', symbol: 'XRP', icon: '✕', color: '#23292F', address: 'rN7hFD5jUyMLBjL3EJQEkpsTedQ2HQBEkq' },
  { id: 'ada', name: 'Cardano', chain: 'Cardano', symbol: 'ADA', icon: '₳', color: '#0033AD', address: 'addr1qxyz789abc456def012ghi345jkl678mno901pqr' },
];

const depositHistory = [
  { status: 'Completed', time: '3 mins Ago', amount: '$535', crypto: 'BTC', action: 'view' as const },
  { status: 'Completed', time: '12 mins Ago', amount: '$1,200', crypto: 'ETH', action: 'view' as const },
  { status: 'Failed', time: '1 hr Ago', amount: '$250', crypto: 'USDT', action: 'view' as const },
  { status: 'Waiting for payment', time: '2 hrs Ago', amount: '$535', crypto: 'BTC', action: 'upload' as const },
  { status: 'Completed', time: '3 hrs Ago', amount: '$800', crypto: 'SOL', action: 'view' as const },
  { status: 'Completed', time: '5 hrs Ago', amount: '$3,500', crypto: 'BTC', action: 'view' as const },
  { status: 'Failed', time: '8 hrs Ago', amount: '$150', crypto: 'LTC', action: 'view' as const },
  { status: 'Completed', time: '12 hrs Ago', amount: '$2,000', crypto: 'ETH', action: 'view' as const },
  { status: 'Waiting for payment', time: '1 day Ago', amount: '$420', crypto: 'USDT', action: 'upload' as const },
  { status: 'Completed', time: '1 day Ago', amount: '$1,750', crypto: 'BTC', action: 'view' as const },
  { status: 'Completed', time: '2 days Ago', amount: '$600', crypto: 'SOL', action: 'view' as const },
  { status: 'Failed', time: '2 days Ago', amount: '$90', crypto: 'XRP', action: 'view' as const },
  { status: 'Completed', time: '3 days Ago', amount: '$4,200', crypto: 'BTC', action: 'view' as const },
  { status: 'Completed', time: '3 days Ago', amount: '$310', crypto: 'ADA', action: 'view' as const },
  { status: 'Completed', time: '4 days Ago', amount: '$1,100', crypto: 'ETH', action: 'view' as const },
  { status: 'Failed', time: '5 days Ago', amount: '$200', crypto: 'LTC', action: 'view' as const },
  { status: 'Completed', time: '5 days Ago', amount: '$950', crypto: 'USDT', action: 'view' as const },
  { status: 'Completed', time: '6 days Ago', amount: '$2,800', crypto: 'BTC', action: 'view' as const },
  { status: 'Completed', time: '1 week Ago', amount: '$500', crypto: 'SOL', action: 'view' as const },
  { status: 'Completed', time: '1 week Ago', amount: '$1,350', crypto: 'ETH', action: 'view' as const },
];

export default function DepositPage() {
  const [activeTab, setActiveTab] = useState<'balance' | 'direct'>('balance');
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoOption>(cryptoOptions[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [statusModal, setStatusModal] = useState<{
    type: 'success' | 'failed';
    data: { time: string; status: string; paymentSystem: string; amount: string; remarks: string };
  } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const handleRowAction = (row: typeof depositHistory[0]) => {
    if (row.action === 'upload') {
      setShowUploadModal(true);
    } else {
      setStatusModal({
        type: row.status === 'Failed' ? 'failed' : 'success',
        data: {
          time: 'Apr 20, 2023 12:32:38 PM',
          status: row.status === 'Failed' ? 'Failed' : 'Successful',
          paymentSystem: row.crypto,
          amount: `${row.amount} = 0.02445 ${row.crypto}`,
          remarks: row.status === 'Failed' ? 'The deposit failed' : 'Amount deposited successfully',
        },
      });
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ variant: 'success', title: 'Copied!', message: 'Address copied to clipboard.' });
  };

  return (
    <>
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
                  <div className="dash-input-group">
                    <div className={styles.cryptoDropdown} ref={dropdownRef}>
                      <button
                        type="button"
                        className={`${styles.dropdownTrigger} ${dropdownOpen ? styles.open : ''}`}
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        id="deposit-payment-method"
                      >
                        <span
                          className={styles.cryptoIconBadge}
                          style={{ backgroundColor: selectedCrypto.color }}
                        >
                          {selectedCrypto.icon}
                        </span>
                        <span className={styles.cryptoName}>
                          {selectedCrypto.name}
                          <span className={styles.cryptoChain}>[{selectedCrypto.chain}]</span>
                        </span>
                        <ChevronDown
                          size={16}
                          className={`${styles.dropdownArrow} ${dropdownOpen ? styles.rotated : ''}`}
                        />
                      </button>

                      {dropdownOpen && (
                        <div className={styles.dropdownMenu}>
                          {cryptoOptions.map((option) => (
                            <button
                              key={option.id}
                              type="button"
                              className={`${styles.dropdownItem} ${selectedCrypto.id === option.id ? styles.selected : ''}`}
                              onClick={() => {
                                setSelectedCrypto(option);
                                setDropdownOpen(false);
                              }}
                            >
                              <span
                                className={`${styles.cryptoIconBadge} ${styles.cryptoIconSmall}`}
                                style={{ backgroundColor: option.color }}
                              >
                                {option.icon}
                              </span>
                              <span className={styles.cryptoName}>
                                {option.name}
                                <span className={styles.cryptoChain}>[{option.chain}]</span>
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <input
                      type="text"
                      className="dash-input"
                      placeholder="Enter Amount in $"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      id="deposit-amount"
                    />
                  </div>

                  <p className="dash-note">
                    Note: The minimum deposit $100<br />
                    Please fill in the TXID / Transaction ID / Hash number after the transfer is completed.
                  </p>

                  <button
                    className="dash-btn-primary"
                    onClick={() => setShowDepositModal(true)}
                    id="deposit-submit-btn"
                  >
                    Deposit
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
                        XH-DEP-kr950MG425
                        <button className={styles.bankCopyBtn} onClick={() => handleCopy('XH-DEP-kr950MG425')} aria-label="Copy">
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
                      type="text"
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
                    onClick={() => {
                      if (!amount || parseFloat(amount) < 500) {
                        toast({ variant: 'error', title: 'Invalid Amount', message: 'Minimum bank deposit is $500.' });
                        return;
                      }
                      toast({ variant: 'info', title: 'Deposit Initiated', message: 'Please complete the bank transfer using the details above. Your account will be credited once confirmed.' });
                    }}
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
            <span className={styles.balanceAmount}>$ 340</span>
          </div>
        </div>

        {/* ─── Right: Deposit History (Fixed Panel) ─── */}
        <div className={styles.historyPanel}>
          <div className={styles.historyHeader}>
            <h3>Deposit History</h3>
            <span className={styles.historyCount}>{depositHistory.length} records</span>
          </div>
          <div className={styles.historyList}>
            {depositHistory.map((row, i) => (
              <div key={i} className={styles.historyItem} onClick={() => handleRowAction(row)}>
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
                  {row.action === 'upload' && (
                    <span className={styles.uploadBadge}>
                      <Upload size={10} />
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Deposit BTC Modal */}
      {showDepositModal && (
        <DepositModal
          onClose={() => setShowDepositModal(false)}
          amount={`${amount || '0.00'} ${selectedCrypto.symbol}`}
          address={selectedCrypto.address}
        />
      )}

      {/* Upload Proof Modal */}
      {showUploadModal && (
        <UploadProofModal
          orderNumber="ORD-2026050512345"
          depositDate="May 5, 2026 12:32 PM"
          onClose={() => setShowUploadModal(false)}
        />
      )}

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
