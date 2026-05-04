'use client';

import { useState } from 'react';
import DepositModal from '@/components/Dashboard/DepositModal';

const depositHistory = [
  { status: 'Completed', time: '3 mins Ago', amount: '$535', crypto: 'BTC', action: 'view' },
  { status: 'Completed', time: '3 mins Ago', amount: '$535', crypto: 'BTC', action: 'view' },
  { status: 'Failed', time: '3 mins Ago', amount: '$535', crypto: 'BTC', action: 'view' },
  { status: 'Waiting for payment', time: '3 mins Ago', amount: '$535', crypto: 'BTC', action: 'upload' },
];

export default function DepositPage() {
  const [showModal, setShowModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [amount, setAmount] = useState('');

  const getStatusClass = (status: string) => {
    if (status === 'Completed') return 'status-completed';
    if (status === 'Failed') return 'status-failed';
    return 'status-waiting';
  };

  return (
    <>
      <h1 className="dash-page-title">Deposit</h1>

      {/* Balance Card */}
      <div className="balance-card">
        <h3>Available Balance</h3>
        <span className="balance-amount">$ 340</span>
      </div>

      {/* Deposit Form */}
      <div className="dash-card" style={{ marginBottom: 'var(--space-2xl)' }}>
        <div className="dash-input-group">
          <select
            className="dash-select"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            id="deposit-payment-method"
          >
            <option value="" disabled>Select Payment Method</option>
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
            id="deposit-amount"
          />
        </div>

        <p className="dash-note">
          Note: The minimum deposit $100<br />
          Please fill in the TXID / Transaction ID / Hash number after the transfer is completed.
        </p>

        <button
          className="dash-btn-primary"
          onClick={() => setShowModal(true)}
          id="deposit-submit-btn"
        >
          Deposit
        </button>
      </div>

      {/* Deposit History */}
      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--space-lg)' }}>
        Deposit History
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
            {depositHistory.map((row, i) => (
              <tr key={i}>
                <td className={getStatusClass(row.status)}>{row.status}</td>
                <td>{row.time}</td>
                <td>
                  <div className="amount-cell">
                    <div className="crypto-icon">₿</div>
                    <strong style={{ color: 'var(--text-primary)' }}>{row.amount}</strong>
                    <span className="crypto-tag">-{row.crypto}</span>
                    <button className={`dash-btn-sm ${row.action === 'upload' ? 'upload' : 'view'}`}>
                      {row.action === 'upload' ? 'Upload' : 'View'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Deposit BTC Modal */}
      {showModal && (
        <DepositModal
          onClose={() => setShowModal(false)}
          amount="0.04 BTC"
          address="3HCXsjABKQe7mTNmI2HAwc1RRatMvU6Htqa"
        />
      )}
    </>
  );
}
