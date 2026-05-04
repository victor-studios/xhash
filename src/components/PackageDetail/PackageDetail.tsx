'use client';

import { useState } from 'react';
import { MiningPackage } from '@/types';
import styles from './PackageDetail.module.css';

interface PackageDetailProps {
  pkg: MiningPackage;
}

export default function PackageDetail({ pkg }: PackageDetailProps) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className={styles.packageDetail}>
      <div className="container">
        <h1 className={styles.packageTitle}>{pkg.name} {pkg.subtitle ? `(${pkg.subtitle})` : ''}</h1>

        <div className={styles.infoGrid}>
          <div className={styles.infoCard}>
            <div className={styles.infoLabel}>Contract Price</div>
            <div className={styles.infoValue}>{pkg.totalPrice}</div>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.infoLabel}>{pkg.totalPrice} Contract Profit</div>
            <div className={styles.infoValue}>{pkg.contractProfit}</div>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.infoLabel}>{pkg.contractProfit} Fixed Return</div>
            <div className={`${styles.infoValue} ${styles.accent}`}>{pkg.fixedReturn}</div>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.infoLabel}>Contract Terms</div>
            <div className={styles.infoValue}>{pkg.duration}</div>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.infoLabel}>Return Type</div>
            <div className={styles.infoValue}>{pkg.returnType}</div>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.infoLabel}>Daily Rate</div>
            <div className={styles.infoValue}>{pkg.dailyRate}</div>
          </div>
          <div className={`${styles.infoCard} ${styles.referralCard}`}>
            <div className={styles.infoLabel}>Referral Reward</div>
            <div className={styles.infoValue}>{pkg.referralReward}</div>
          </div>
        </div>

        <div className={styles.purchaseRow}>
          <div className={styles.quantitySelector}>
            <button
              className={styles.qtyBtn}
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <input
              type="number"
              className={styles.qtyInput}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              min={1}
              id="quantity-input"
            />
            <button
              className={styles.qtyBtn}
              onClick={() => setQuantity(quantity + 1)}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <button className={styles.buyNowBtn} id="buy-now-button">
            Buy Now
          </button>
        </div>

        <div className={styles.detailsSection}>
          <h2 className={styles.detailsTitle}>Details</h2>
          <p className={styles.detailsNote}>Note: Each account is limited to 1 copy per day.</p>

          <div className={styles.detailBlock}>
            <h3 className={styles.detailBlockTitle}>1. Purchase instructions</h3>
            <p className={styles.detailBlockText}>
              Please carefully understand the package information before purchasing an order. If you have 
              any questions about the package, you can consult our 24-hour online customer service. Once 
              an order is placed, the package has been reviewed, and no refunds are allowed.
            </p>
          </div>

          <div className={styles.detailBlock}>
            <h3 className={styles.detailBlockTitle}>2. Output settlement</h3>
            <p className={styles.detailBlockText}>
              Cloud mining payouts will be automatically credited to your balance daily at 08:00 AM US 
              Eastern Standard Time.
            </p>
          </div>

          <div className={styles.detailBlock}>
            <h3 className={styles.detailBlockTitle}>3. Additional description</h3>
            <p className={styles.detailBlockText}>
              (1) Mining machine rental fee: The cost you pay is the physical mining machine rental fee.<br />
              (2) Management fee: This product does not charge any management or electricity fee.
            </p>
          </div>

          <div className={styles.detailBlock}>
            <h3 className={styles.detailBlockTitle}>4. Termination of contract</h3>
            <p className={styles.detailBlockText}>
              The contract will be terminated automatically when it expires. Mining Contract becomes active 
              immediately after payment confirmation. Unless otherwise provided by the applicable Law or by 
              a particular offer, all purchases are final and non-refundable. Thank you for your understanding.
            </p>
            <p className={styles.detailBlockText} style={{ marginTop: '8px' }}>
              The platform reserves the right of final interpretation for the terms of this contract.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
