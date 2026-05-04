import type { Metadata } from 'next';
import PlansGrid from '@/components/PlansGrid/PlansGrid';

export const metadata: Metadata = {
  title: 'Mining Packages — XHash',
  description: 'Explore all GPU-powered mining packages on XHash. Choose from Bitcoin, Ethereum, Litecoin, Dogecoin, and more.',
};

export default function MiningPage() {
  return (
    <div style={{ paddingTop: 'var(--space-xl)' }}>
      <PlansGrid />
    </div>
  );
}
