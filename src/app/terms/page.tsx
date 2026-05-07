'use client';

import Link from 'next/link';
import styles from '../content-pages.module.css';

export default function TermsPage() {
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.bgOrbs}>
        <div className={`${styles.orb} ${styles.orbPurple}`} />
        <div className={`${styles.orb} ${styles.orbCyan}`} />
      </div>

      <div className={styles.container}>
        <header className={styles.header}>
          <p className={styles.tag}>// Legal</p>
          <h1 className={styles.title}>Terms of Service</h1>
          <p className={styles.subtitle}>The rules and guidelines for using the XHash platform.</p>
        </header>

        <div className={styles.content}>
          <div className={styles.legalSection}>
            <h2 className={styles.legalHeading}>1. Acceptance of Terms</h2>
            <p className={styles.legalText}>
              By accessing or using the XHash platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </div>

          <div className={styles.legalSection}>
            <h2 className={styles.legalHeading}>2. Eligibility</h2>
            <p className={styles.legalText}>
              You must be at least 18 years old and capable of forming a binding contract to use XHash. It is your responsibility to ensure that using cloud mining services is legal in your jurisdiction.
            </p>
          </div>

          <div className={styles.legalSection}>
            <h2 className={styles.legalHeading}>3. Mining Services</h2>
            <p className={styles.legalText}>
              XHash provides cloud-based mining power. While we strive for 100% uptime, mining difficulty and rewards are subject to network conditions beyond our control. We do not guarantee specific profit amounts.
            </p>
          </div>

          <div className={styles.legalSection}>
            <h2 className={styles.legalHeading}>4. Financial Transactions</h2>
            <p className={styles.legalText}>
              All deposits and withdrawals are processed in cryptocurrency.
            </p>
            <ul className={styles.legalList}>
              <li className={styles.legalListItem}>The minimum deposit is $10.</li>
              <li className={styles.legalListItem}>The minimum withdrawal is $10.</li>
              <li className={styles.legalListItem}>Transaction fees may apply depending on the blockchain network used.</li>
              <li className={styles.legalListItem}>Withdrawals are typically processed within 30-60 minutes but may take longer during network congestion.</li>
            </ul>
          </div>

          <div className={styles.legalSection}>
            <h2 className={styles.legalHeading}>5. Risk Disclosure</h2>
            <p className={styles.legalText}>
              Cryptocurrency mining involves significant risk. The value of mined assets and the cost of mining may fluctuate. XHash is not responsible for any financial losses resulting from market volatility or changes in mining difficulty.
            </p>
          </div>

          <div className={styles.legalSection}>
            <h2 className={styles.legalHeading}>6. Prohibited Activities</h2>
            <p className={styles.legalText}>
              Users are prohibited from:
            </p>
            <ul className={styles.legalList}>
              <li className={styles.legalListItem}>Attempting to exploit or bypass platform security.</li>
              <li className={styles.legalListItem}>Creating multiple accounts to abuse referral programs.</li>
              <li className={styles.legalListItem}>Using the platform for any illegal or fraudulent activities.</li>
            </ul>
          </div>

          <div className={styles.legalSection}>
            <h2 className={styles.legalHeading}>7. Termination</h2>
            <p className={styles.legalText}>
              We reserve the right to suspend or terminate your account if you violate these terms or engage in suspicious activity.
            </p>
          </div>
        </div>

        <section className={styles.ctaSection}>
          <div className={styles.ctaBand}>
            <div className={styles.ctaTopLine} aria-hidden="true" />
            <div className={styles.ctaContent}>
              <div className={styles.ctaTextCol}>
                <h2 className={styles.ctaTitle}>Ready to Start Mining?</h2>
                <p className={styles.ctaBody}>
                  Join over 50,000 miners already earning daily BTC rewards with XHash.
                  No hardware, no hassle — just pure compute power at your fingertips.
                </p>
              </div>
              <div className={styles.ctaAction}>
                <Link href="/mining" className={styles.ctaBtn}>
                  Explore Plans
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '8px' }}>
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

