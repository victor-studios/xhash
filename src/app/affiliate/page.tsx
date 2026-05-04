import type { Metadata } from 'next';
import Link from 'next/link';
import { Gift, DollarSign, Clock, Ban } from 'lucide-react';
import Button from '@/components/ui/Button';
import { affiliateBenefits, affiliateSteps } from '@/data/affiliate';
import styles from './affiliate.module.css';

export const metadata: Metadata = {
  title: 'Affiliate Program — XHash',
  description:
    'Join the XHash affiliate program. Earn up to 4.5% referral rewards with no deposit required, instant crypto payments, and unlimited referrals.',
};

const iconMap: Record<string, React.ReactNode> = {
  Gift: <Gift size={24} />,
  DollarSign: <DollarSign size={24} />,
  Clock: <Clock size={24} />,
  Infinity: <Ban size={24} strokeWidth={0} />,
};

/* Use Infinity symbol instead of lucide icon for the "No Limits" card */
function BenefitIcon({ iconName }: { iconName: string }) {
  if (iconName === 'Infinity') {
    return (
      <span style={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1 }}>∞</span>
    );
  }
  return <>{iconMap[iconName]}</>;
}

export default function AffiliatePage() {
  return (
    <div className={styles.affiliatePage}>
      <div className="container">
        {/* Page Hero */}
        <div className={styles.pageHero}>
          <h1 className={styles.pageTitle}>Affiliate</h1>
          <p className={styles.pageSubtitle}>
            Lorem ipsum dolor sit amet consectetur. Viverra arcu velit sit eget sed mauris dignissim id.
            Commodo lorem at nunc risus rhoncus suspendisse sed dui vitae. Nisl libero pulvinar feugiat
            amet purus sed a. Bibendum sed scelerisque id dui.
          </p>
        </div>

        {/* Benefits Section */}
        <div className={styles.benefitsSection} id="affiliate-benefits">
          <h2 className={styles.benefitsTitle}>
            Our affiliate program includes many benefits
          </h2>
          <div className={styles.benefitsGrid}>
            {affiliateBenefits.map((benefit, index) => (
              <div
                key={index}
                className={styles.benefitCard}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={styles.benefitIcon}>
                  <BenefitIcon iconName={benefit.icon} />
                </div>
                <h3 className={styles.benefitTitle}>{benefit.title}</h3>
                <p className={styles.benefitDescription}>{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How Does It Work */}
        <div className={styles.howItWorksSection} id="affiliate-how-it-works">
          <h2 className={styles.howTitle}>How does it works</h2>
          <div className={styles.stepsGrid}>
            {affiliateSteps.map((step, index) => (
              <div key={index} className={styles.stepItem}>
                <div className={styles.stepNumber}>{step.number}</div>
                <p className={styles.stepDescription}>{step.description}</p>
              </div>
            ))}
          </div>
          <div className={styles.ctaWrapper}>
            <Link href="/register">
              <Button variant="success" size="md">Join Now</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
