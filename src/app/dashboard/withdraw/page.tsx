'use client';

import { useState } from 'react';
import StatusModal from '@/components/Dashboard/StatusModal';

const withdrawHistory = [
  { status: 'Completed', time: '3 mins Ago', amount: '$535', crypto: 'BTC' },
  { status: 'Completed', time: '3 mins Ago', amount: '$535', crypto: 'BTC' },
  { status: 'Failed', time: '3 mins Ago', amount: '$535', crypto: 'BTC' },
  { status: 'In Progress', time: '3 mins Ago', amount: '$535', crypto: 'BTC' },
];

export default function WithdrawPage() {
  const [wallet, setWallet] = useState('');
  const [amount, setAmount] = useState('');
  const [password, setPassword] = useState('');
  const [statusModal, setStatusModal] = useState<{
    type: 'success' | 'failed';
    data: { time: string; status: string; paymentSystem: string; amount: string; remarks: string };
  } | null>(null);

  const getStatusClass = (status: string) => {
    if (status === 'Completed') return 'status-completed';
    if (status === 'Failed') return 'status-failed';
    if (status === 'In Progress') return 'status-progress';
    return 'status-waiting';
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

  return (
    <>
      <h1 className="dash-page-title">Deposit</h1>

      {/* Balance Card */}
      <div className="balance-card">
        <h3>Available Balance</h3>
        <span className="balance-amount">$ 340</span>
      </div>

      {/* Withdraw Form */}
      <div className="dash-card" style={{ marginBottom: 'var(--space-2xl)' }}>
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

        <button className="dash-btn-primary" id="withdraw-submit-btn">
          Withdraw
        </button>
      </div>

      {/* Withdraw History */}
      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--space-lg)' }}>
        Withdraw History
      </h2>

      <div className="dash-table-wrap">
        <table className="dash-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Time</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {withdrawHistory.map((row, i) => (
              <tr key={i}>
                <td className={getStatusClass(row.status)}>{row.status}</td>
                <td>{row.time}</td>
                <td>
                  <div className="amount-cell">
                    <div className="crypto-icon">₿</div>
                    <strong style={{ color: 'var(--text-primary)' }}>{row.amount}</strong>
                    <span className="crypto-tag">-{row.crypto}</span>
                    <button
                      className="dash-btn-sm view"
                      onClick={() => handleViewRow(row)}
                    >
                      View
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
