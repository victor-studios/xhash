'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Wallet,
  ArrowUpFromLine,
  MessageSquare,
  ShieldCheck,
  Activity,
  LogOut,
  Shield,
} from 'lucide-react';
import XHashLogo from '@/components/XHashLogo/XHashLogo';
import styles from './AdminSidebar.module.css';

interface AdminSidebarProps {
  admin: {
    username: string;
    level: number;
    displayName: string;
  } | null;
}

const levelLabels: Record<number, string> = {
  1: 'Super Admin',
  2: 'Moderator',
  3: 'Support',
};

const levelColors: Record<number, string> = {
  1: 'var(--accent-red)',
  2: 'var(--accent-gold)',
  3: 'var(--accent-secondary)',
};

export default function AdminSidebar({ admin }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_data');
    router.push('/admin/login');
  };

  // Build nav links based on admin level
  const navLinks = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard, minLevel: 3 },
    { label: 'Users', href: '/admin/users', icon: Users, minLevel: 2 },
    { label: 'Deposits', href: '/admin/deposits', icon: Wallet, minLevel: 2 },
    { label: 'Withdrawals', href: '/admin/withdrawals', icon: ArrowUpFromLine, minLevel: 2 },
    { label: 'Support', href: '/admin/support', icon: MessageSquare, minLevel: 3 },
    { label: 'Manage Admins', href: '/admin/manage-admins', icon: ShieldCheck, minLevel: 1 },
    { label: 'Activity Log', href: '/admin/activity', icon: Activity, minLevel: 1 },
  ];

  const visibleLinks = navLinks.filter(link => (admin?.level || 99) <= link.minLevel);

  return (
    <aside className={styles.sidebar}>
      {/* Logo & Brand */}
      <div className={styles.brand}>
        <Link href="/admin" className={styles.logoLink}>
          <XHashLogo height={22} />
        </Link>
        <span className={styles.adminTag}>ADMIN</span>
      </div>

      {/* Admin Profile Badge */}
      {admin && (
        <div className={styles.profileBadge}>
          <div className={styles.avatarCircle} style={{ borderColor: levelColors[admin.level] }}>
            <Shield size={18} color={levelColors[admin.level]} />
          </div>
          <div className={styles.profileInfo}>
            <span className={styles.profileName}>{admin.displayName}</span>
            <span className={styles.profileLevel} style={{ color: levelColors[admin.level] }}>
              {levelLabels[admin.level]}
            </span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className={styles.nav}>
        {visibleLinks.map((link) => {
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

      {/* Bottom Section */}
      <div className={styles.bottomSection}>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          <LogOut size={16} />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}
