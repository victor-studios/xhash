import styles from './Features.module.css';

/* ═══════════════ SVG ICON LIBRARY (From About Page) ═══════════════ */
const IconShield = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const IconCpu = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" />
    <line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" />
    <line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" />
    <line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" />
    <line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" />
  </svg>
);
const IconUsers = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IconLeaf = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 22c1.25-1.25 2.5-3.75 2.5-7.5C4.5 7.5 10 3 20 2c0 10-5.5 15.5-12.5 15.5-3.75 0-6.25 1.25-7.5 2.5z" />
    <path d="M7.17 17.83 15 10" />
  </svg>
);
const IconTrendingUp = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
  </svg>
);
const IconTelescope = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="2" />
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
  </svg>
);

const values = [
  { Icon: IconShield,     title: 'Security First',         desc: 'Military-grade encryption, 2FA, and cold-wallet payout protocols protect every user.' },
  { Icon: IconCpu,        title: 'Engineering Excellence', desc: 'We obsess over latency, efficiency, and fault tolerance across every layer of the stack.' },
  { Icon: IconUsers,      title: 'Community Ownership',    desc: 'Our platform grows with our miners. Feedback directly shapes the product roadmap.' },
  { Icon: IconLeaf,       title: 'Sustainable Mining',     desc: 'We source renewable energy for 60%+ of our compute, targeting 100% by 2026.' },
  { Icon: IconTrendingUp, title: 'Compounding Returns',    desc: 'Auto-reinvest options compound your hashrate position and earnings over time.' },
  { Icon: IconTelescope, title: 'Long-Term Vision',        desc: 'Multi-coin mining and AI compute rental are already on our product roadmap.' },
];

export default function Features() {
  return (
    <section className={styles.features} id="features-section">
      <div className="container">
        <div className="section-header">
          <p className="section-tag">// Core Values</p>
          <h2 className="section-title">What Drives Us</h2>
          <p className="section-subtitle">
            Every decision we make is grounded in these principles — from infrastructure
            architecture to how we communicate with our community.
          </p>
        </div>

        <div className={styles.featuresGrid}>
          {values.map(({ Icon, title, desc }, index) => (
            <div
              key={title}
              className={styles.featureCard}
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <div className={styles.featureIcon}>
                <Icon />
              </div>
              <h3 className={styles.featureTitle}>{title}</h3>
              <p className={styles.featureDescription}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
