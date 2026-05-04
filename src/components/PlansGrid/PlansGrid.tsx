import Link from 'next/link';
import Button from '@/components/ui/Button';
import { miningPackages } from '@/data/packages';
import { MiningPackage } from '@/types';
import styles from './PlansGrid.module.css';

function PlanCard({ pkg }: { pkg: MiningPackage }) {
  const fillPercent = (pkg.capacityCurrent / pkg.capacityTotal) * 100;

  return (
    <div className={styles.planCard}>
      <div className={styles.planHeader}>
        <div>
          <div className={styles.planName}>{pkg.name}</div>
          {pkg.subtitle && <div className={styles.planSubtitle}>{pkg.subtitle}</div>}
        </div>
        <div
          className={styles.cryptoIcon}
          style={{ backgroundColor: pkg.cryptoColor }}
        >
          {pkg.cryptoIcon}
        </div>
      </div>

      <div className={styles.capacityBar}>
        <div className={styles.capacityText}>
          {pkg.capacityCurrent}/{pkg.capacityTotal} ({fillPercent}%)
        </div>
        <div className={styles.barTrack}>
          <div className={styles.barFill} style={{ width: `${fillPercent}%` }} />
        </div>
      </div>

      <div className={styles.planStats}>
        <div className={styles.planStat}>
          <div className={styles.planStatLabel}>Duration</div>
          <div className={styles.planStatValue}>{pkg.duration}</div>
        </div>
        <div className={styles.planStat}>
          <div className={styles.planStatLabel}>Daily Mining</div>
          <div className={styles.planStatValue}>{pkg.dailyMining}</div>
        </div>
        <div className={styles.planStat}>
          <div className={styles.planStatLabel}>Hardware</div>
          <div className={styles.planStatValue}>{pkg.hardwareCost}</div>
        </div>
      </div>

      <div className={styles.planReturn}>
        <div className={styles.returnValue}>{pkg.totalReturn}</div>
        <div className={styles.returnLabel}>Total Return</div>
      </div>

      <div className={styles.planFooter}>
        <div>
          <div className={styles.totalPriceLabel}>Total Price</div>
          <div className={styles.totalPrice}>{pkg.totalPrice}</div>
        </div>
        {pkg.isSoldOut ? (
          <Button variant="soldOut" size="sm">Sold Out</Button>
        ) : (
          <Link href={`/mining/${pkg.slug}`}>
            <Button variant="primary" size="sm">Buy Plan</Button>
          </Link>
        )}
      </div>
    </div>
  );
}

interface PlansGridProps {
  limit?: number;
  showViewAll?: boolean;
}

export default function PlansGrid({ limit, showViewAll = false }: PlansGridProps) {
  const packages = limit ? miningPackages.slice(0, limit) : miningPackages;

  return (
    <section className={styles.plansSection} id="plans-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Choose a <span className="gradient-text">Plan</span></h2>
          <p className="section-subtitle">
            Our packages are designed for maximum reliability, with transparent metrics and real-time performance tracking at every level.
          </p>
        </div>

        <div className={styles.plansGrid}>
          {packages.map((pkg) => (
            <PlanCard key={pkg.id} pkg={pkg} />
          ))}
        </div>

        {showViewAll && (
          <div className={styles.viewAllWrapper}>
            <Link href="/mining">
              <Button variant="secondary" size="lg">View All Packages →</Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
