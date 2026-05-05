'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  LayoutDashboard,
  Wallet,
  ArrowUpFromLine,
  ArrowLeftRight,
  ShoppingBag,
  Users,
  Settings,
  Search,
  LogOut,
} from 'lucide-react';
import styles from './Sidebar.module.css';

const sidebarLinks = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Orders', href: '/dashboard/orders', icon: ShoppingBag },
  { label: 'Deposit', href: '/dashboard/deposit', icon: Wallet },
  { label: 'Withdraw', href: '/dashboard/withdraw', icon: ArrowUpFromLine },
  { label: 'Transactions', href: '/dashboard/bills', icon: ArrowLeftRight },
  { label: 'Referrals', href: '/dashboard/referrals', icon: Users },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.navItem} ${isActive(link.href) ? styles.active : ''}`}
            >
              <Icon size={18} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className={styles.bottomSection}>
        <p className={styles.tagline}>
          Miner , The easy way to invest and mine crypto.
        </p>
        <Link href="/mining" className={styles.explorePlans}>
          <Search size={16} />
          <span>Explore Plans</span>
        </Link>
        <button onClick={logout} className={styles.logoutBtn}>
          <LogOut size={16} />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}
