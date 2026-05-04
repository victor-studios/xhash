import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'About Us — XHash GPU Mining Platform',
  description:
    'Learn about XHash, the GPU-powered cloud mining platform built for the next era of decentralised compute. Our mission, values, and team.',
};

/* ═══════════════ SVG ICON LIBRARY ═══════════════ */

const IconZap = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const IconLock = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const IconBarChart = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const IconGlobe = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const IconShield = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const IconCpu = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
    <rect x="9" y="9" width="6" height="6" />
    <line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" />
    <line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" />
    <line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" />
    <line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" />
  </svg>
);

const IconUsers = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
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
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const IconTelescope = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="2" />
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
  </svg>
);

const IconArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

/* ═══════════════ FLOATING CODE WINDOWS ═══════════════ */

function CodeWindowHashrate() {
  return (
    <div className={`${styles.codeWindow} ${styles.codeWindowTop}`}>
      <div className={styles.codeWindowBar}>
        <span className={`${styles.dot} ${styles.dotRed}`} />
        <span className={`${styles.dot} ${styles.dotYellow}`} />
        <span className={`${styles.dot} ${styles.dotGreen}`} />
        <span className={styles.codeWindowTitle}>hashrate_monitor.ts</span>
      </div>
      <div className={styles.codeLine}>
        <span className={styles.codeNum}>1</span>
        <span><span className={styles.codeKw}>const </span><span className={styles.codeProp}>hashrate</span><span className={styles.codePunc}> = </span><span className={styles.codeStr}>&apos;847.3 TH/s&apos;</span></span>
      </div>
      <div className={styles.codeLine}>
        <span className={styles.codeNum}>2</span>
        <span><span className={styles.codeKw}>const </span><span className={styles.codeProp}>uptime</span><span className={styles.codePunc}> = </span><span className={styles.codeVal}>99.98</span><span className={styles.codeCmt}> // %</span></span>
      </div>
      <div className={styles.codeLine}>
        <span className={styles.codeNum}>3</span>
        <span><span className={styles.codeKw}>const </span><span className={styles.codeProp}>workers</span><span className={styles.codePunc}> = </span><span className={styles.codeVal}>12_400</span></span>
      </div>
      <div className={styles.codeLine}>
        <span className={styles.codeNum}>4</span>
        <span><span className={styles.codeFn}>emitReward</span><span className={styles.codePunc}>(</span><span className={styles.codeProp}>hashrate</span><span className={styles.codePunc}>)</span></span>
      </div>
      <div className={styles.codeLine}>
        <span className={styles.codeNum}>5</span>
        <span className={styles.codeCmt}>{'// ✓ All rigs online'}</span>
      </div>
    </div>
  );
}

function CodeWindowBlock() {
  return (
    <div className={`${styles.codeWindow} ${styles.codeWindowBottom}`}>
      <div className={styles.codeWindowBar}>
        <span className={`${styles.dot} ${styles.dotRed}`} />
        <span className={`${styles.dot} ${styles.dotYellow}`} />
        <span className={`${styles.dot} ${styles.dotGreen}`} />
        <span className={styles.codeWindowTitle}>block_reward.py</span>
      </div>
      <div className={styles.codeLine}>
        <span className={styles.codeNum}>1</span>
        <span className={styles.codeCmt}># XHash reward engine</span>
      </div>
      <div className={styles.codeLine}>
        <span className={styles.codeNum}>2</span>
        <span><span className={styles.codeKw}>def </span><span className={styles.codeFn}>distribute</span><span className={styles.codePunc}>(</span><span className={styles.codeProp}>pool</span><span className={styles.codePunc}>):</span></span>
      </div>
      <div className={styles.codeLine}>
        <span className={styles.codeNum}>3</span>
        <span><span className={styles.codeIndent} /><span className={styles.codeProp}>reward</span><span className={styles.codePunc}> = </span><span className={styles.codeProp}>pool</span><span className={styles.codePunc}>.</span><span className={styles.codeFn}>solve</span><span className={styles.codePunc}>()</span></span>
      </div>
      <div className={styles.codeLine}>
        <span className={styles.codeNum}>4</span>
        <span><span className={styles.codeIndent} /><span className={styles.codeKw}>return </span><span className={styles.codeProp}>reward</span><span className={styles.codePunc}> * </span><span className={styles.codeVal}>0.9975</span></span>
      </div>
      <div className={styles.codeLine}>
        <span className={styles.codeNum}>5</span>
        <span className={styles.codeCmt}># Block #885,241 mined ✓</span>
      </div>
    </div>
  );
}

/* ═══════════════ STAT PILL (live-looking) ═══════════════ */
function StatPill({ value, label }: { value: string; label: string }) {
  return (
    <div className={styles.statPill}>
      <span className={styles.statPillValue}>{value}</span>
      <span className={styles.statPillLabel}>{label}</span>
    </div>
  );
}

/* ═══════════════ PAGE ═══════════════ */
export default function AboutPage() {

  const missionItems = [
    { Icon: IconZap,      title: 'Zero Hardware, Full Power',  desc: 'Start mining in minutes — no rigs, no setup, no maintenance costs.' },
    { Icon: IconLock,     title: 'Non-Custodial Payouts',      desc: 'Earnings go directly to your wallet. We never hold your crypto.' },
    { Icon: IconBarChart, title: 'Real-Time Transparency',     desc: 'Live dashboard: hashrate, worker status, and earnings per block.' },
    { Icon: IconGlobe,    title: 'Global Infrastructure',      desc: 'Data centers across 3 continents for 99.98% uptime SLA.' },
  ];

  const values = [
    { Icon: IconShield,     title: 'Security First',        desc: 'Military-grade encryption, 2FA, and cold-wallet payout protocols protect every user.' },
    { Icon: IconCpu,        title: 'Engineering Excellence',desc: 'We obsess over latency, efficiency, and fault tolerance across every layer of the stack.' },
    { Icon: IconUsers,      title: 'Community Ownership',   desc: 'Our platform grows with our miners. Feedback directly shapes the product roadmap.' },
    { Icon: IconLeaf,       title: 'Sustainable Mining',    desc: 'We source renewable energy for 60%+ of our compute, targeting 100% by 2026.' },
    { Icon: IconTrendingUp, title: 'Compounding Returns',   desc: 'Auto-reinvest options compound your hashrate position and earnings over time.' },
    { Icon: IconTelescope, title: 'Long-Term Vision',       desc: 'Multi-coin mining and AI compute rental are already on our product roadmap.' },
  ];

  const team = [
    { initials: 'AK', name: 'Alex Kovacs',  role: 'CEO & Co-Founder', bio: 'Ex-Google DeepMind. 12 years distributed systems. Three blockchain exits.' },
    { initials: 'SR', name: 'Sara Reyes',   role: 'CTO',              bio: 'CUDA kernel engineer. Former Nvidia GPU Architecture team. 4 compute patents.' },
    { initials: 'JL', name: 'James Liu',    role: 'Head of Security', bio: 'Cryptographer. Previously led security at Binance. PhD CS, MIT.' },
    { initials: 'MN', name: 'Maya Nkosi',   role: 'Head of Growth',   bio: 'Scaled three DeFi protocols past $1B TVL. Speaker, DevCon 2023.' },
  ];

  return (
    <>
      {/* ══════════ HERO ══════════ */}
      <section className={styles.hero}>
        {/* ambient background */}
        <div className={styles.heroBg} aria-hidden="true" />
        <div className={`${styles.heroOrb} ${styles.heroOrbPurple}`} aria-hidden="true" />
        <div className={`${styles.heroOrb} ${styles.heroOrbCyan}`}   aria-hidden="true" />

        <div className={styles.heroInner}>
          {/* ── Text col ── */}
          <div className={styles.heroText}>
            <div className={styles.heroBadge}>
              <span className={styles.heroBadgeDot} aria-hidden="true" />
              Est. 2023 · GPU-Powered Cloud Mining
            </div>

            <h1 className={styles.heroTitle}>
              Redefining&nbsp;
              <span className={styles.heroAccent}>Distributed&nbsp;Compute</span>
              &nbsp;for the&nbsp;Next&nbsp;Era
            </h1>

            <p className={styles.heroDesc}>
              XHash is a next-generation GPU cloud mining platform built on transparency,
              performance, and accessibility — eliminating the barrier between everyday users
              and professional-grade crypto infrastructure.
            </p>

            <div className={styles.heroStats}>
              <StatPill value="847+ TH/s"  label="Total Hashrate" />
              <StatPill value="12,400+"    label="Active Workers"  />
              <StatPill value="99.98%"     label="Uptime SLA"      />
            </div>
          </div>

          {/* ── Visual col ── */}
          <div className={styles.heroVisual}>
            {/* Premium image */}
            <div className={styles.heroImageWrap}>
              <Image
                src="/about-hero.png"
                alt="XHash distributed GPU mining network"
                fill
                className={styles.heroImage}
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* coloured overlay so it blends with dark bg */}
              <div className={styles.heroImageOverlay} aria-hidden="true" />
            </div>

            {/* Floating glass code screens */}
            <CodeWindowHashrate />
            <CodeWindowBlock />

            {/* Corner glow badges */}
            <div className={styles.glowBadge} aria-hidden="true">
              <span className={styles.glowBadgeDot} />
              LIVE · 847.3 TH/s
            </div>
          </div>
        </div>
      </section>

      <div className={styles.divider} />

      {/* ══════════ MISSION ══════════ */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.missionGrid}>
            <div className={styles.missionText}>
              <p className={styles.eyebrow}>// Our Mission</p>
              <h2 className={styles.sectionTitle}>
                Democratising Access to{' '}
                <span className={styles.gradientText}>Industrial Mining</span>
              </h2>
              <p className={styles.bodyText}>
                The crypto mining industry has long been dominated by well-funded operations
                with access to cheap energy and enterprise-grade hardware. XHash changes that
                by pooling distributed GPU compute and sharing rewards fairly across every participant.
              </p>
              <p className={styles.bodyText}>
                Our infrastructure is co-located across Tier-3 data centres on three continents,
                ensuring redundancy, low latency, and maximum performance for every mining package
                we offer — from entry-level to institutional.
              </p>
            </div>

            <div className={styles.missionCards}>
              {missionItems.map(({ Icon, title, desc }, i) => (
                <div key={title} className={styles.missionCard} style={{ animationDelay: `${i * 80}ms` }}>
                  <div className={styles.missionCardIcon}><Icon /></div>
                  <div>
                    <h4 className={styles.missionCardTitle}>{title}</h4>
                    <p  className={styles.missionCardDesc}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className={styles.divider} />

      {/* ══════════ VALUES ══════════ */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.centeredHeader}>
            <p className={styles.sectionTag}>// Core Values</p>
            <h2 className={styles.sectionTitle}>What Drives Us</h2>
            <p className={styles.sectionSub}>
              Every decision we make is grounded in these principles — from infrastructure
              architecture to how we communicate with our community.
            </p>
          </div>

          <div className={styles.valuesGrid}>
            {values.map(({ Icon, title, desc }, i) => (
              <div key={title} className={styles.valueCard} style={{ animationDelay: `${i * 70}ms` }}>
                <div className={styles.valueIcon}><Icon /></div>
                <h3 className={styles.valueTitle}>{title}</h3>
                <p  className={styles.valueDesc}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className={styles.divider} />

      {/* ══════════ TEAM ══════════ */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.centeredHeader}>
            <p className={styles.sectionTag}>// The People</p>
            <h2 className={styles.sectionTitle}>Meet the Team</h2>
            <p className={styles.sectionSub}>
              A tight-knit group of engineers, cryptographers, and finance veterans united
              by one belief: compute should be accessible to everyone.
            </p>
          </div>

          <div className={styles.teamGrid}>
            {team.map(({ initials, name, role, bio }, i) => (
              <div key={name} className={styles.teamCard} style={{ animationDelay: `${i * 90}ms` }}>
                <div className={styles.teamAvatar}>{initials}</div>
                <h4 className={styles.teamName}>{name}</h4>
                <p  className={styles.teamRole}>{role}</p>
                <p  className={styles.teamBio}>{bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className={styles.divider} />

      {/* ══════════ CTA ══════════ */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaBand}>
            <div className={styles.ctaTopLine} aria-hidden="true" />
            <h2 className={styles.ctaTitle}>Ready to Start Mining?</h2>
            <p className={styles.ctaBody}>
              Join over 50,000 miners already earning daily BTC rewards with XHash.
              No hardware, no hassle — just pure compute power at your fingertips.
            </p>
            <Link href="/register" className={styles.ctaBtn}>
              Get Started Free <IconArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
