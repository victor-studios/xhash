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
