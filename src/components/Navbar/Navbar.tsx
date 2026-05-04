'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { navLinks } from '@/data/content';
import { User, LayoutDashboard } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const { user, isLoggedIn } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileOpen]);

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`} id="main-navbar">
      <div className={styles.navbarInner}>
        <Link href="/" className={styles.logo}>
          XHash
        </Link>

        <div className={styles.navLinks}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.navLink} ${pathname === link.href ? styles.active : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className={styles.navRight}>

          {isLoggedIn ? (
            <Link href="/dashboard" className={styles.userMenu} id="nav-dashboard-link">
              <span className={styles.dashboardLabel}>
                <LayoutDashboard size={16} />
                Dashboard
              </span>
              <div className={styles.userAvatar}>
                {user?.name ? user.name[0].toUpperCase() : <User size={16} />}
              </div>
            </Link>
          ) : (
            <>
              <Link href="/login" className={styles.btnLogin}>
                Login
              </Link>
              <Link href="/register" className={styles.btnSignUp}>
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button
          className={`${styles.hamburger} ${isMobileOpen ? styles.open : ''}`}
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label="Toggle menu"
          id="mobile-menu-toggle"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div className={`${styles.mobileMenu} ${isMobileOpen ? styles.open : ''}`} id="mobile-menu">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`${styles.mobileNavLink} ${pathname === link.href ? styles.active : ''}`}
          >
            {link.label}
          </Link>
        ))}
        <div className={styles.mobileAuthButtons}>
          {isLoggedIn ? (
            <Link href="/dashboard" className={styles.btnSignUp} style={{ width: '100%', textAlign: 'center' }}>
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className={styles.btnLogin}>Login</Link>
              <Link href="/register" className={styles.btnSignUp}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
