'use client';

import { usePathname } from 'next/navigation';
import Footer from '@/components/Footer/Footer';

export function ConditionalFooter() {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/dashboard');
  if (isDashboard) return null;
  return <Footer />;
}
