import Hero from '@/components/Hero/Hero';
import Features from '@/components/Features/Features';
import PlansGrid from '@/components/PlansGrid/PlansGrid';
import TopDepositors from '@/components/TopDepositors/TopDepositors';
import LatestTalks from '@/components/LatestTalks/LatestTalks';
import CryptoPrices from '@/components/CryptoPrices/CryptoPrices';
import PaymentPartners from '@/components/PaymentPartners/PaymentPartners';
import ProcessSection from '@/components/ProcessSection/ProcessSection';
import { supabase } from '@/lib/supabase';
import { MiningPackage } from '@/types';

export const revalidate = 60; // revalidate every minute

export default async function Home() {
  const { data: plans } = await supabase.from('mining_plans').select('*').order('price', { ascending: false });

  // Filter for homepage: 3 month plan for each coin + Bitcoin 6 month plan (total 6)
  const homepagePlans = (plans as MiningPackage[] || []).filter(
    (p) => p.duration_months === 3 || (p.crypto === 'BTC' && p.duration_months === 6)
  );

  return (
    <>
      <Hero />
      <Features />
      <PlansGrid packages={homepagePlans} showViewAll />
      <ProcessSection />
      <TopDepositors />
      <LatestTalks />
      <CryptoPrices />
      <PaymentPartners />
    </>
  );
}
