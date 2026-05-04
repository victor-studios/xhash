import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer} id="site-footer">
      <div className="container">
        <div className={styles.footerGrid}>
          <div className={styles.footerBrand}>
            <div className={styles.brandName}>XHash</div>
            <p className={styles.brandDescription}>
              We provide GPU-powered compute solutions for cryptocurrency mining online without 
              requiring direct participation or ownership of equipment.
            </p>
            <div className={styles.socialLinks}>
              <a href="#" className={styles.socialLink} aria-label="WhatsApp">💬</a>
              <a href="#" className={styles.socialLink} aria-label="Facebook">f</a>
              <a href="#" className={styles.socialLink} aria-label="Instagram">📷</a>
              <a href="#" className={styles.socialLink} aria-label="YouTube">▶</a>
            </div>
          </div>

          <div className={styles.footerSection}>
            <h4>Explore</h4>
            <div className={styles.footerLinks}>
              <Link href="/" className={styles.footerLink}>Home</Link>
              <Link href="/mining" className={styles.footerLink}>Mine</Link>
              <Link href="/about" className={styles.footerLink}>Why Us</Link>
              <Link href="/blog" className={styles.footerLink}>Blog</Link>
            </div>
          </div>

          <div className={styles.footerSection}>
            <h4>Resources</h4>
            <div className={styles.footerLinks}>
              <Link href="/about" className={styles.footerLink}>About</Link>
              <Link href="/faq" className={styles.footerLink}>FAQ</Link>
              <Link href="/privacy" className={styles.footerLink}>Privacy Policy</Link>
              <Link href="/terms" className={styles.footerLink}>Terms</Link>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p className={styles.copyright}>Copyright © {new Date().getFullYear()} XHash. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
