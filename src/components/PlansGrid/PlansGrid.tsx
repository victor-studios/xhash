import Link from 'next/link';
import Button from '@/components/ui/Button';
import { MiningPackage } from '@/types';
import styles from './PlansGrid.module.css';

function PlanCard({ pkg }: { pkg: MiningPackage }) {
  const fillPercent = (pkg.slots_available / pkg.slots_total) * 100;
  const durationText = `${pkg.duration_months} Month${pkg.duration_months > 1 ? 's' : ''}`;
  const dailyEarning = ((pkg.total_return - pkg.price) / (pkg.duration_months * 30)).toFixed(2);

  return (
    <div className={styles.planCard}>
      <div className={styles.planHeader}>
        <div>
          <div className={styles.planName}>{pkg.name}</div>
          {pkg.subtitle && <div className={styles.planSubtitle}>{pkg.subtitle}</div>}
        </div>
        <div
          className={styles.cryptoIcon}
          style={{ backgroundColor: pkg.crypto_color }}
        >
          {pkg.crypto_icon}
        </div>
      </div>

      <div className={styles.capacityBar}>
        <div className={styles.capacityText}>
          Slots: {pkg.slots_available}/{pkg.slots_total} ({fillPercent.toFixed(0)}% Available)
        </div>
        <div className={styles.barTrack}>
          {/* Reverse the fill to represent taken capacity if we want, or just show available. If 100% available, fill is 0% taken. Let's do taken = 100 - fillPercent */}
          <div className={styles.barFill} style={{ width: `${100 - fillPercent}%` }} />
        </div>
      </div>

      <div className={styles.planStats}>
        <div className={styles.planStat}>
          <div className={styles.planStatLabel}>Duration</div>
          <div className={styles.planStatValue}>{durationText}</div>
        </div>
        <div className={styles.planStat}>
          <div className={styles.planStatLabel}>Daily Earning</div>
          <div className={styles.planStatValue}>${dailyEarning}</div>
        </div>
        <div className={styles.planStat}>
          <div className={styles.planStatLabel}>Total Return</div>
          <div className={styles.planStatValue}>${pkg.total_return.toLocaleString()}</div>
        </div>
      </div>

      <div className={styles.planFooter}>
        <div>
          <div className={styles.totalPriceLabel}>Price</div>
          <div className={styles.totalPrice}>${pkg.price.toLocaleString()}</div>
        </div>
        {pkg.is_sold_out ? (
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
  packages: MiningPackage[];
  showViewAll?: boolean;
}

export default function PlansGrid({ packages, showViewAll = false }: PlansGridProps) {
  return (
    <section className={styles.plansSection} id="plans-section">
      <div className="container">
        <div className="section-header">
          <p className="section-tag">
            // Cloud Mining
          </p>
          <h2 className="section-title">Select Your Preferred Mining Plan</h2>
          <p className="section-subtitle">
            Choose from a range of flexible packages designed to fit any investment strategy.
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
