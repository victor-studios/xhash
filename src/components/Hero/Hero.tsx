'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { heroStats } from '@/data/content';
import styles from './Hero.module.css';

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      const heroBottom = heroRef.current.getBoundingClientRect().bottom;
      setPastHero(heroBottom < 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* ══ Decorative rings — z-index 0, behind the 3D rig ══ */}
      <div className={styles.ringsContainer} aria-hidden="true">
        <div className={styles.rigRing} />
        <div className={styles.rigRingOuter} />
      </div>

      {/* ══ Sketchfab 3D Mining Rig — z-index 1, above rings ══
          Hero state   → right column of hero (absolute)
          Scrolled     → fixed right-center, 42% width background */}
      <div
        className={`${styles.rigWrapper} ${pastHero ? styles.rigBackground : ''}`}
        aria-hidden="true"
      >
        <div className={styles.maskBottom} />
        <div className={styles.maskTop} />
        <div className={styles.maskLeft} />
        <div className={styles.maskRight} />
        <div className={styles.iframeGlow} />

        <iframe
          title="Crypto Farm / Mining Rig 3D"
          frameBorder="0"
          allow="autoplay; fullscreen; xr-spatial-tracking"
          src="https://sketchfab.com/models/049f02ffd15c41ca8cb8020feb43993f/embed?autostart=1&autospin=0.15&camera=0&ui_controls=0&ui_infos=0&ui_stop=0&ui_watermark=0&ui_help=0&ui_settings=0&ui_vr=0&ui_fullscreen=0&ui_annotations=0&ui_hint=0&dnt=1"
          className={styles.sketchfabIframe}
        />
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
