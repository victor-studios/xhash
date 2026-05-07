'use client';

import Link from 'next/link';
import styles from '../content-pages.module.css';

export default function FAQPage() {
  const faqs = [
    {
      q: "What is XHash Cloud Mining?",
      a: "XHash is a GPU-powered cloud mining platform that allows users to rent mining power from our high-performance data centers. You can start mining cryptocurrency without needing to purchase, setup, or maintain any physical hardware."
    },
    {
      q: "How do I start mining?",
      a: "Simply create an account, deposit funds into your wallet, and choose a mining plan that fits your budget. Once purchased, your plan activates immediately, and you will start seeing mining returns in your dashboard."
    },
    {
      q: "What is the minimum deposit and withdrawal?",
      a: "The minimum deposit is $10. The minimum withdrawal is also $10. We support various cryptocurrencies for both deposits and withdrawals, primarily focusing on USDT (TRC20 and BEP20)."
    },
    {
      q: "When do I receive my mining rewards?",
      a: "Mining rewards are calculated daily and added to your available balance. You can track your earnings in real-time through the dashboard's internal graphs and history."
    },
    {
      q: "Do I need any technical knowledge?",
      a: "No. XHash is designed for everyone. We handle all the technical complexities of hardware management, pool configuration, and uptime. You only need to manage your portfolio through our user-friendly interface."
    },
    {
      q: "How secure is my data and funds?",
      a: "We use military-grade encryption, SOC 2 certified data centers, and non-custodial payout protocols. Your account is protected by 2FA, and our smart contracts ensure that payouts are processed accurately."
    }
  ];

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.bgOrbs}>
        <div className={`${styles.orb} ${styles.orbPurple}`} />
        <div className={`${styles.orb} ${styles.orbCyan}`} />
      </div>

      <div className={styles.container}>
        <header className={styles.header}>
          <p className={styles.tag}>// Help Center</p>
          <h1 className={styles.title}>Frequently Asked Questions</h1>
          <p className={styles.subtitle}>Everything you need to know about XHash mining.</p>
        </header>

        <div className={styles.content}>
          {faqs.map((faq, index) => (
            <div key={index} className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>{faq.q}</h3>
              <p className={styles.faqAnswer}>{faq.a}</p>
            </div>
          ))}
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

