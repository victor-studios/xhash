import type { Metadata } from 'next';
import PlansGrid from '@/components/PlansGrid/PlansGrid';
import { supabase } from '@/lib/supabase';
import { MiningPackage } from '@/types';

export const metadata: Metadata = {
  title: 'Mining Packages — XHash',
  description: 'Explore all GPU-powered mining packages on XHash. Choose from Bitcoin, Ethereum, Litecoin, and more.',
};

export const revalidate = 60; // revalidate every minute

export default async function MiningPage() {
  const { data: plans } = await supabase.from('mining_plans').select('*').order('price', { ascending: false });

  return (
    <div style={{ paddingTop: 'var(--space-xl)' }}>
      <PlansGrid packages={plans as MiningPackage[] || []} />
    </div>
  );
}
