'use client';

import { useCryptoPrices } from '@/lib/use-crypto-prices';
import { RefreshCw } from 'lucide-react';
import styles from './CryptoPrices.module.css';

export default function CryptoPrices() {
  const { prices, loading, lastUpdated, refetch } = useCryptoPrices();

  return (
    <section className={styles.cryptoPrices} id="crypto-prices-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Crypto <span className="gradient-text">Prices</span></h2>
          {lastUpdated && (
            <p className={styles.lastUpdated}>
              Live from CoinGecko · Updated {lastUpdated.toLocaleTimeString()}
              <button onClick={refetch} className={styles.refreshBtn} aria-label="Refresh prices">
                <RefreshCw size={14} className={loading ? styles.spinning : ''} />
              </button>
            </p>
          )}
        </div>

        <div className={styles.pricesGrid}>
          {prices.map((crypto) => (
            <div key={crypto.id} className={styles.priceCard}>
              <div className={styles.priceIcon}>
                {crypto.image ? (
                  <img src={crypto.image} alt={crypto.name} width={28} height={28} style={{ borderRadius: '50%' }} />
                ) : (
                  crypto.icon
                )}
              </div>
              <div className={styles.priceInfo}>
                <div className={styles.priceName}>{crypto.name}</div>
                <div className={styles.priceSymbol}>{crypto.symbol}</div>
              </div>
              <div className={styles.priceValue}>
                <div className={styles.priceAmount}>${crypto.price}</div>
                <div className={`${styles.priceChange} ${crypto.isPositive ? styles.positive : styles.negative}`}>
                  {crypto.change}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
