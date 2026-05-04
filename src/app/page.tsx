import Hero from '@/components/Hero/Hero';
import Features from '@/components/Features/Features';
import HowItWorks from '@/components/HowItWorks/HowItWorks';
import PlansGrid from '@/components/PlansGrid/PlansGrid';
import TopDepositors from '@/components/TopDepositors/TopDepositors';
import LatestTalks from '@/components/LatestTalks/LatestTalks';
import CryptoPrices from '@/components/CryptoPrices/CryptoPrices';
import PaymentPartners from '@/components/PaymentPartners/PaymentPartners';

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <PlansGrid limit={6} showViewAll />
      <TopDepositors />
      <LatestTalks />
      <CryptoPrices />
      <PaymentPartners />
    </>
  );
}
