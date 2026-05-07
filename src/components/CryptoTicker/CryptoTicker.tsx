'use client';

import { usePathname } from 'next/navigation';
import { useCryptoPrices } from '@/lib/use-crypto-prices';
import styles from './CryptoTicker.module.css';

export default function CryptoTicker() {
  const { prices } = useCryptoPrices();
  const pathname = usePathname();

  // Hide on admin pages
  if (pathname.startsWith('/admin')) return null;

  if (!prices.length) return null;

  // Duplicate the list so the scroll loops seamlessly
  const doubled = [...prices, ...prices];

  return (
    <div className={styles.ticker} id="crypto-ticker">
      <div className={styles.tickerTrack}>
        {doubled.map((coin, index) => (
          <div key={`${coin.id}-${index}`} className={styles.tickerItem}>
            {coin.image ? (
              <img src={coin.image} alt={coin.name} className={styles.tickerIcon} />
            ) : (
              <span className={styles.tickerIconFallback}>{coin.icon}</span>
            )}
            <span className={styles.tickerName}>{coin.name}</span>
            <span className={styles.tickerSymbol}>{coin.symbol}</span>
            <span className={styles.tickerPrice}>${coin.price}</span>
            <span className={`${styles.tickerChange} ${coin.isPositive ? styles.positive : styles.negative}`}>
              {coin.change}
            </span>
            {index < doubled.length - 1 && <span className={styles.tickerDot} />}
          </div>
        ))}
      </div>
    </div>
  );
}
