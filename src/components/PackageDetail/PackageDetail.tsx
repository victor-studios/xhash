'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MiningPackage } from '@/types';
import { useToast } from '@/components/ui/Toast';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import styles from './PackageDetail.module.css';

interface PackageDetailProps {
  pkg: MiningPackage;
}

export default function PackageDetail({ pkg }: PackageDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showLowBalance, setShowLowBalance] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const { toast } = useToast();
  const { user, updateBalance } = useAuth();
  const router = useRouter();

  const handleBuyNow = () => {
    if (!user) {
      toast({ variant: 'error', title: 'Login Required', message: 'Please login to purchase a plan.' });
      router.push('/login');
      return;
    }

    const totalCost = pkg.price * quantity;
    if (user.balance < totalCost) {
      setShowLowBalance(true);
      return;
    }

    setShowConfirm(true);
  };

  const handleConfirmPurchase = async () => {
    if (!user || purchasing) return;
    setPurchasing(true);

    try {
      // Atomic RPC: deducts balance, creates orders, logs transaction in one DB transaction
      const { data, error } = await supabase.rpc('purchase_mining_plan', {
        p_user_id: user.id,
        p_package_slug: pkg.slug,
        p_price: pkg.price,
        p_quantity: quantity,
        p_description: `Purchased ${quantity}x ${pkg.name} mining contract`,
      });

      if (error) {
        console.error('RPC Error:', error);
        throw new Error('Failed to process purchase');
      }

      if (!data.success) {
        if (data.error === 'Insufficient funds') {
          toast({ variant: 'error', title: 'Insufficient Balance', message: 'Your balance has changed. Please top up.' });
          setShowConfirm(false);
          setPurchasing(false);
          return;
        }
        throw new Error(data.error || 'Purchase failed');
      }

      // Update local state with the new balance from the server
      updateBalance(data.new_balance);

      setShowConfirm(false);
      setShowSuccess(true);
      toast({
        variant: 'success',
        title: 'Order Placed!',
        message: `Your ${pkg.name} mining contract is now active.`,
      });
    } catch (err: any) {
      console.error('Purchase error:', err);
      toast({ variant: 'error', title: 'Purchase Failed', message: err.message || 'Something went wrong.' });
    } finally {
      setPurchasing(false);
    }
  };

  const orderId = `XH-${Date.now().toString(36).toUpperCase().slice(-6)}`;
  
  const durationText = `${pkg.duration_months} Month${pkg.duration_months > 1 ? 's' : ''}`;
  const dailyEarning = ((pkg.total_return - pkg.price) / (pkg.duration_months * 30)).toFixed(2);
  const profit = pkg.total_return - pkg.price;

  return (
    <div className={styles.packageDetail}>
      <div className="container">
        <h1 className={styles.packageTitle}>{pkg.name} {pkg.subtitle ? `(${pkg.subtitle})` : ''}</h1>

        <div className={styles.infoGrid}>
          <div className={styles.infoCard}>
            <div className={styles.infoLabel}>Contract Price</div>
            <div className={styles.infoValue}>${pkg.price.toLocaleString()}</div>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.infoLabel}>Contract Profit</div>
            <div className={styles.infoValue}>${profit.toLocaleString()}</div>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.infoLabel}>Total Return</div>
            <div className={`${styles.infoValue} ${styles.accent}`}>${pkg.total_return.toLocaleString()}</div>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.infoLabel}>Contract Terms</div>
            <div className={styles.infoValue}>{durationText}</div>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.infoLabel}>Return Type</div>
            <div className={styles.infoValue}>End of Term</div>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.infoLabel}>Daily Rate</div>
            <div className={styles.infoValue}>${dailyEarning}</div>
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
          <button className={styles.buyNowBtn} id="buy-now-button" onClick={handleBuyNow}>
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

      {/* Low Balance Modal */}
      {showLowBalance && (
        <ConfirmModal
          variant="withdraw"
          title="Insufficient Balance"
          message={`You need $${(pkg.price * quantity).toLocaleString()} to purchase this plan, but your current balance is $${(user?.balance || 0).toLocaleString()}.`}
          details={[
            { label: 'Required', value: `$${(pkg.price * quantity).toLocaleString()}` },
            { label: 'Available', value: `$${(user?.balance || 0).toLocaleString()}` },
            { label: 'Shortfall', value: <span style={{ color: 'var(--accent-red)' }}>${((pkg.price * quantity) - (user?.balance || 0)).toLocaleString()}</span> },
          ]}
          confirmLabel="Top Up Balance"
          cancelLabel="Cancel"
          onConfirm={() => router.push('/dashboard/deposit')}
          onCancel={() => setShowLowBalance(false)}
        />
      )}

      {/* Purchase Confirmation Modal */}
      {showConfirm && (
        <ConfirmModal
          variant="purchase"
          title="Confirm Purchase"
          message={`You are about to purchase ${quantity}x ${pkg.name} mining contract.`}
          details={[
            { label: 'Package', value: pkg.name },
            { label: 'Quantity', value: String(quantity) },
            { label: 'Total Cost', value: `$${(pkg.price * quantity).toLocaleString()}` },
            { label: 'Duration', value: durationText },
            { label: 'Daily Rate', value: `$${dailyEarning}` },
            { label: 'Balance After', value: `$${((user?.balance || 0) - (pkg.price * quantity)).toLocaleString()}` },
            { label: 'Expected Return', value: `$${(pkg.total_return * quantity).toLocaleString()}`, accent: true },
          ]}
          confirmLabel="Confirm Purchase"
          cancelLabel="Cancel"
          onConfirm={handleConfirmPurchase}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      {/* Purchase Success Modal */}
      {showSuccess && (
        <ConfirmModal
          variant="success"
          title="Purchase Successful!"
          message="Your mining contract is now active. You will start receiving daily returns within 24 hours."
          details={[
            { label: 'Order ID', value: orderId },
            { label: 'Package', value: pkg.name },
            { label: 'Status', value: 'Active', accent: true },
            { label: 'Daily Return', value: `$${dailyEarning}` },
          ]}
          confirmLabel="Got it"
          onCancel={() => setShowSuccess(false)}
          singleAction
        />
      )}
    </div>
  );
}
