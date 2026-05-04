'use client';

import { useState } from 'react';

const ordersData = [
  { time: '3 mins Ago', type: 'Order', amount: '-$44', balance: '$473', amountColor: 'var(--accent-red)' },
  { time: '3 mins Ago', type: 'Order', amount: '-$40', balance: '$517', amountColor: 'var(--accent-red)' },
  { time: '3 mins Ago', type: 'Deposit', amount: '+$60', balance: '$457', amountColor: 'var(--accent-green)' },
  { time: '3 mins Ago', type: 'Withdraw', amount: '-$55', balance: '$397', amountColor: 'var(--accent-red)' },
  { time: '3 mins Ago', type: 'Withdraw', amount: '-$50', balance: '$452', amountColor: 'var(--accent-red)' },
  { time: '3 mins Ago', type: 'Referral', amount: '+$2', balance: '$502', amountColor: 'var(--accent-green)' },
];

export default function OrdersPage() {
  const [filterType, setFilterType] = useState('all');
  const [filterTime, setFilterTime] = useState('all');

  const filtered = ordersData.filter((row) => {
    if (filterType !== 'all' && row.type.toLowerCase() !== filterType) return false;
    return true;
  });

  return (
    <>
      <h1 className="dash-page-title">Orders</h1>

      {/* Filter Buttons */}
      <div className="filter-row">
        <button
          className={`filter-btn ${filterType === 'all' ? 'active-filter' : ''}`}
          onClick={() => setFilterType('all')}
        >
          Filter By Type
        </button>
        <button
          className={`filter-btn ${filterTime !== 'all' ? 'active-filter' : ''}`}
          onClick={() => setFilterTime(filterTime === 'all' ? 'recent' : 'all')}
        >
          Filter By Time
        </button>
      </div>

      {/* Orders Table */}
      <div className="dash-table-wrap">
        <table className="dash-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Balance</th>
              <th style={{ textAlign: 'right' }}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, i) => (
              <tr key={i}>
                <td>{row.time}</td>
                <td>{row.type}</td>
                <td style={{ color: row.amountColor, fontWeight: 600 }}>{row.amount}</td>
                <td style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{row.balance}</td>
                <td style={{ textAlign: 'right' }}>
                  <button className="dash-btn-sm view">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
