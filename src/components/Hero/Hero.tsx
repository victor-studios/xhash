'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { heroStats } from '@/data/content';
import styles from './Hero.module.css';
import MiningRig3D from '@/components/MiningRig3D/MiningRig3D';

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  return (
    <>
      {/* ══ 3D Mining Rig — fixed full-screen, self-manages scroll ══ */}
      <MiningRig3D />

      {/* ══ Decorative rings ══ */}
      <div className={styles.ringsContainer} aria-hidden="true">
        <div className={styles.rigRing} />
        <div className={styles.rigRingOuter} />
      </div>

      <section ref={heroRef} className={styles.hero} id="hero-section">
        <div className={styles.gridOverlay} aria-hidden="true" />
        <div className={`${styles.glowOrb} ${styles.glowOrbPurple}`} aria-hidden="true" />
        <div className={`${styles.glowOrb} ${styles.glowOrbCyan}`} aria-hidden="true" />

        <div className="container">
          <div className={styles.heroInner}>

            {/* ── Left: Content ── */}
            <div className={styles.heroContent}>
              <div className={styles.heroBadge}>
                <span className={styles.badgeDot} />
                <span className={styles.badgeText}>Live — 99.98% Uptime</span>
                <span className={styles.badgeSeparator}>·</span>
                <span className={styles.badgeText}>GPU-Powered</span>
              </div>

              <h1 className={styles.heroTitle}>
                Start <span className={styles.highlight}>Bitcoin Mining</span> Today!
              </h1>

              <p className={styles.heroDescription}>
                Harness the power of thousands of enterprise-grade GPUs and ASICs. Pure compute performance, zero hardware hassle.
              </p>

              <div className={styles.heroChecks}>
                {[
                  'Zero hardware maintenance required',
                  'Live performance & reward tracking',
                  'Instant daily payouts to your wallet',
                ].map((text, i) => (
                  <div key={i} className={styles.heroCheck}>
                    <span className={styles.checkIcon}>✓</span>
                    {text}
                  </div>
                ))}
              </div>

              <div className={styles.heroCTA}>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className={styles.emailInput}
                  id="hero-email-input"
                />
                <Link href="/register">
                  <Button variant="primary" size="lg">Get Started</Button>
                </Link>
              </div>

              <div className={styles.heroStats}>
                {heroStats.map((stat, index) => (
                  <div key={index} className={styles.stat}>
                    <div className={styles.statValue}>{stat.value}</div>
                    <div className={styles.statLabel}>{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className={styles.trustBar}>
                <span className={styles.trustItem}>
                  <span className={styles.trustDot} style={{ background: '#00E676' }} />
                  SOC 2 Certified
                </span>
                <span className={styles.trustSep} />
                <span className={styles.trustItem}>
                  <span className={styles.trustDot} style={{ background: '#00D2FF' }} />
                  256-bit Encryption
                </span>
                <span className={styles.trustSep} />
                <span className={styles.trustItem}>
                  <span className={styles.trustDot} style={{ background: '#6C5CE7' }} />
                  10,000+ Investors
                </span>
              </div>
            </div>

            {/* ── Right: only the data card (rings moved outside section) ── */}
            <div className={styles.heroRigPlaceholder} aria-hidden="true">
              <div className={styles.rigDataReadout}>
                <div className={styles.readoutLine}>
                  <span className={styles.readoutLabel}>HASHRATE</span>
                  <span className={styles.readoutValue}>142.8 TH/s</span>
                </div>
                <div className={styles.readoutLine}>
                  <span className={styles.readoutLabel}>TEMP</span>
                  <span className={styles.readoutValue}>68°C</span>
                </div>
                <div className={styles.readoutLine}>
                  <span className={styles.readoutLabel}>POWER</span>
                  <span className={styles.readoutValue}>3,200W</span>
                </div>
                <div className={styles.readoutLine}>
                  <span className={styles.readoutLabel}>STATUS</span>
                  <span className={styles.readoutValueGreen}>ONLINE ●</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className={styles.scrollHint} aria-hidden="true">
          <div className={styles.scrollLine} />
          <span>Scroll</span>
        </div>
      </section>
    </>
  );
}
