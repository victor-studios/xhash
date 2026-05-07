'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/settings');
  }, [router]);

  return (
    <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: 'var(--space-3xl)' }}>
      Redirecting to Settings...
    </div>
  );
}
