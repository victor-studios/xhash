'use client';

import { useState } from 'react';
import { topDepositors, topWithdrawals } from '@/data/content';
import styles from './TopDepositors.module.css';

export default function TopDepositors() {
  const [activeTab, setActiveTab] = useState<'depositors' | 'withdrawals'>('depositors');

  const data = activeTab === 'depositors' ? topDepositors : topWithdrawals;

  return (
    <section className={styles.depositors} id="top-depositors-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">
            Top <span className="gradient-text">Depositors</span>
          </h2>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'depositors' ? styles.active : ''}`}
            onClick={() => setActiveTab('depositors')}
          >
            Top Depositors
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'withdrawals' ? styles.active : ''}`}
            onClick={() => setActiveTab('withdrawals')}
          >
            Top Withdrawals
          </button>
        </div>

        {/* 6×2 Grid */}
        <div className={styles.depositorGrid}>
          {data.map((item) => (
            <div key={item.id} className={styles.depositorCard}>
              <div className={styles.cardLeft}>
                <span className={styles.flag}>{item.flag}</span>
                <div>
                  <div className={styles.depositorName}>{item.name}</div>
                  <div className={styles.depositorCountry}>{item.country}</div>
                </div>
              </div>
              <div className={styles.cardRight}>
                <div className={styles.depositorAmount}>{item.amount}</div>
                <div className={styles.depositorDate}>{item.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
