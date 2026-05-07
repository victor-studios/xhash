'use client';

import { usePathname } from 'next/navigation';
import Footer from '@/components/Footer/Footer';

export function ConditionalFooter() {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/dashboard');
  const isAdmin = pathname.startsWith('/admin');
  if (isDashboard || isAdmin) return null;
  return <Footer />;
}

export function ConditionalMain({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/dashboard');
  const isAdmin = pathname.startsWith('/admin');

  const style = (isAdmin || isDashboard) 
    ? { paddingTop: '0px' } 
    : { paddingTop: 'calc(var(--navbar-height) + var(--ticker-height, 32px))' };

  return <main style={style}>{children}</main>;
}
