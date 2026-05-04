'use client';

const billsData = [
  { time: '3 mins Ago', type: 'Order', amount: '-$44', balance: '$473', amountColor: 'var(--accent-red)' },
  { time: '3 mins Ago', type: 'Deposit', amount: '+$60', balance: '$517', amountColor: 'var(--accent-green)' },
  { time: '3 mins Ago', type: 'Withdraw', amount: '-$55', balance: '$397', amountColor: 'var(--accent-red)' },
  { time: '3 mins Ago', type: 'Mining Reward', amount: '+$12', balance: '$409', amountColor: 'var(--accent-green)' },
  { time: '3 mins Ago', type: 'Referral', amount: '+$2', balance: '$411', amountColor: 'var(--accent-green)' },
];

export default function BillsPage() {
  return (
    <>
      <h1 className="dash-page-title">Bills</h1>

      {/* Filter Buttons */}
      <div className="filter-row">
        <button className="filter-btn active-filter">All</button>
        <button className="filter-btn">Deposits</button>
        <button className="filter-btn">Withdrawals</button>
        <button className="filter-btn">Mining</button>
      </div>

      {/* Bills Table */}
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
            {billsData.map((row, i) => (
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
