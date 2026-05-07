'use client';

import Link from 'next/link';
import styles from '../content-pages.module.css';

export default function PrivacyPage() {
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.bgOrbs}>
        <div className={`${styles.orb} ${styles.orbPurple}`} />
        <div className={`${styles.orb} ${styles.orbCyan}`} />
      </div>

      <div className={styles.container}>
        <header className={styles.header}>
          <p className={styles.tag}>// Legal</p>
          <h1 className={styles.title}>Privacy Policy</h1>
          <p className={styles.subtitle}>How we protect and manage your data at XHash.</p>
        </header>

        <div className={styles.content}>
          <div className={styles.legalSection}>
            <h2 className={styles.legalHeading}>1. Information Collection</h2>
            <p className={styles.legalText}>
              At XHash, we prioritize your privacy. We collect minimal personal information necessary to provide our services:
            </p>
            <ul className={styles.legalList}>
              <li className={styles.legalListItem}>Email address for account authentication and security.</li>
              <li className={styles.legalListItem}>Wallet addresses for processing deposits and withdrawals.</li>
              <li className={styles.legalListItem}>Technical data such as IP addresses for fraud prevention.</li>
            </ul>
          </div>

          <div className={styles.legalSection}>
            <h2 className={styles.legalHeading}>2. Use of Information</h2>
            <p className={styles.legalText}>
              Your information is used solely for the following purposes:
            </p>
            <ul className={styles.legalList}>
              <li className={styles.legalListItem}>To manage your account and provide mining services.</li>
              <li className={styles.legalListItem}>To process your financial transactions securely.</li>
              <li className={styles.legalListItem}>To send critical security alerts and account updates.</li>
              <li className={styles.legalListItem}>To improve our platform's performance and security.</li>
            </ul>
          </div>

          <div className={styles.legalSection}>
            <h2 className={styles.legalHeading}>3. Data Security</h2>
            <p className={styles.legalText}>
              We implement industry-standard security measures, including 256-bit encryption and SOC 2 certified infrastructure. We do not store your passwords in plain text, and we utilize non-custodial payout protocols where possible to minimize risk.
            </p>
          </div>

          <div className={styles.legalSection}>
            <h2 className={styles.legalHeading}>4. Third-Party Services</h2>
            <p className={styles.legalText}>
              We use trusted third-party providers for specific functions:
            </p>
            <ul className={styles.legalList}>
              <li className={styles.legalListItem}><strong>Supabase:</strong> For secure database management and authentication.</li>
              <li className={styles.legalListItem}><strong>Atlos:</strong> For processing cryptocurrency payments and webhooks.</li>
            </ul>
            <p className={styles.legalText}>
              These providers have their own privacy policies and are chosen for their high security standards.
            </p>
          </div>

          <div className={styles.legalSection}>
            <h2 className={styles.legalHeading}>5. Your Rights</h2>
            <p className={styles.legalText}>
              You have the right to access, correct, or delete your personal information at any time through your account settings. For data deletion requests, please contact our support team.
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

