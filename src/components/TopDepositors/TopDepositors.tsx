import { topDepositors } from '@/data/content';
import styles from './TopDepositors.module.css';

export default function TopDepositors() {
  return (
    <section className={styles.depositors} id="top-depositors-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Top <span className="gradient-text">Depositors</span></h2>
        </div>

        <div className={styles.tabs}>
          <button className={`${styles.tab} ${styles.active}`}>Top Depositors</button>
          <button className={styles.tab}>Top Withdrawals</button>
        </div>

        <div className={styles.scrollContainer}>
          <div className={styles.depositorTrack}>
            {topDepositors.map((depositor) => (
              <div key={depositor.id} className={styles.depositorCard}>
                <div className={styles.flag}>{depositor.flag}</div>
                <div className={styles.depositorName}>{depositor.name}</div>
                <div className={styles.depositorCountry}>{depositor.country}</div>
                <div className={styles.depositorAmount}>{depositor.amount}</div>
                <div className={styles.depositorDate}>{depositor.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
