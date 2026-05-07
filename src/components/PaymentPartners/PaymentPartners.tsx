'use client';

import styles from './PaymentPartners.module.css';

interface Partner {
  name: string;
  svg: React.ReactNode;
}

const partners: Partner[] = [
  {
    name: 'Visa',
    svg: (
      <svg viewBox="0 0 120 40" fill="currentColor">
        <path d="M50.6 4.2L43.5 35.8H36.1L43.2 4.2H50.6ZM82.1 23.4L86 12.1L88.2 23.4H82.1ZM90.5 35.8H97.2L91.4 4.2H85.2C83.7 4.2 82.4 5.1 81.9 6.4L70.8 35.8H78.6L80.1 31.3H89.6L90.5 35.8ZM72.7 24.3C72.7 16 61.1 15.5 61.2 11.9C61.2 10.8 62.3 9.6 64.5 9.3C65.6 9.2 68.7 9 72.2 10.6L73.7 3.7C71.8 3 69.4 2.4 66.5 2.4C59.2 2.4 54 6.3 53.9 11.9C53.9 16 57.6 18.3 60.3 19.6C63.2 21 64.1 21.9 64.1 23.2C64 25.2 61.6 26 59.4 26C55.4 26 53.1 25 51.3 24.1L49.7 31.3C51.6 32.2 55 33 58.5 33C66.3 33 72.7 29.2 72.7 24.3ZM33.8 4.2L22 35.8H14.1L8.4 10C8 8.3 7.7 7.7 6.3 6.9C4 5.7 0.2 4.6 0 4.5L0.2 4.2H12.2C13.9 4.2 15.4 5.3 15.8 7.2L18.7 23.5L26.3 4.2H33.8Z" />
      </svg>
    ),
  },
  {
    name: 'Mastercard',
    svg: (
      <svg viewBox="0 0 120 40" fill="currentColor">
        <circle cx="45" cy="20" r="16" opacity="0.7" />
        <circle cx="75" cy="20" r="16" opacity="0.5" />
        <text x="60" y="36" textAnchor="middle" fontSize="7" fontWeight="700" letterSpacing="1">MASTERCARD</text>
      </svg>
    ),
  },
  {
    name: 'PayPal',
    svg: (
      <svg viewBox="0 0 120 40" fill="currentColor">
        <path d="M44.7 8H34.3C33.6 8 33 8.5 32.9 9.2L29 32.4C28.9 32.9 29.3 33.4 29.9 33.4H34.8C35.5 33.4 36.1 32.9 36.2 32.2L37.2 25.7C37.3 25 37.9 24.5 38.6 24.5H41.4C47.2 24.5 50.6 21.7 51.4 16.2C51.8 13.8 51.4 11.9 50.3 10.6C49 9 46.8 8 44.7 8ZM45.5 16.5C45.1 19.4 42.9 19.4 40.8 19.4H39.6L40.5 13.6C40.6 13.2 40.9 12.9 41.3 12.9H41.9C43.3 12.9 44.7 12.9 45.4 13.7C45.8 14.2 45.7 15.1 45.5 16.5Z" />
        <path d="M69.3 16.3H64.4C64 16.3 63.7 16.6 63.6 17L63.4 18L63 17.4C61.8 15.7 59.2 15.2 56.7 15.2C50.8 15.2 45.8 19.6 44.8 25.6C44.3 28.6 44.9 31.4 46.5 33.4C48 35.2 50.1 36 52.6 36C56.8 36 59.1 33.3 59.1 33.3L58.9 34.3C58.8 34.8 59.2 35.3 59.8 35.3H64.2C64.9 35.3 65.5 34.8 65.6 34.1L68.4 17.3C68.5 16.8 68.1 16.3 69.3 16.3Z" opacity="0.7" />
        <path d="M90.5 8H80.1C79.4 8 78.8 8.5 78.7 9.2L74.8 32.4C74.7 32.9 75.1 33.4 75.7 33.4H81C81.5 33.4 81.9 33 82 32.5L83 25.7C83.1 25 83.7 24.5 84.4 24.5H87.2C93 24.5 96.4 21.7 97.2 16.2C97.6 13.8 97.2 11.9 96.1 10.6C94.9 9 92.8 8 90.5 8Z" opacity="0.5" />
      </svg>
    ),
  },
  {
    name: 'Stripe',
    svg: (
      <svg viewBox="0 0 120 40" fill="currentColor">
        <text x="60" y="26" textAnchor="middle" fontSize="18" fontWeight="700" fontFamily="sans-serif" letterSpacing="1">stripe</text>
      </svg>
    ),
  },
  {
    name: 'Google Pay',
    svg: (
      <svg viewBox="0 0 120 40" fill="currentColor">
        <path d="M25 8C15.6 8 8 15.6 8 25C8 34.4 15.6 42 25 42C34.4 42 42 34.4 42 25C42 15.6 34.4 8 25 8ZM25 10C33.3 10 40 16.7 40 25C40 33.3 33.3 40 25 40C16.7 40 10 33.3 10 25C10 16.7 16.7 10 25 10Z" opacity="0.3" />
        <text x="25" y="29" textAnchor="middle" fontSize="16" fontWeight="800">G</text>
        <text x="78" y="28" textAnchor="middle" fontSize="14" fontWeight="600">Pay</text>
      </svg>
    ),
  },
  {
    name: 'Apple Pay',
    svg: (
      <svg viewBox="0 0 120 40" fill="currentColor">
        <path d="M22 10C20.8 11.4 18.9 12.5 17 12.3C16.8 10.4 17.7 8.4 18.8 7.1C20 5.7 22 4.7 23.7 4.6C23.9 6.6 23.1 8.5 22 10ZM23.7 12.6C21 12.5 18.7 14.2 17.5 14.2C16.2 14.2 14.3 12.7 12 12.8C9.2 12.8 6.6 14.4 5.2 16.9C2.3 22 4.5 29.6 7.3 33.6C8.7 35.6 10.3 37.8 12.4 37.7C14.4 37.6 15.2 36.4 17.6 36.4C20 36.4 20.7 37.7 22.8 37.6C25 37.6 26.4 35.6 27.8 33.7C29.4 31.5 30 29.4 30.1 29.3C30 29.2 25.8 27.6 25.7 22.7C25.7 18.5 29 16.6 29.2 16.4C27.1 13.4 23.9 12.7 23.7 12.6Z" />
        <text x="78" y="28" textAnchor="middle" fontSize="14" fontWeight="600">Pay</text>
      </svg>
    ),
  },
  {
    name: 'Bitcoin',
    svg: (
      <svg viewBox="40 2 40 36" fill="currentColor">
        <text x="60" y="30" textAnchor="middle" fontSize="28" fontWeight="800">₿</text>
      </svg>
    ),
  },
  {
    name: 'Ethereum',
    svg: (
      <svg viewBox="42 2 36 36" fill="currentColor">
        <path d="M60 4L45 22L60 30L75 22L60 4Z" opacity="0.8" />
        <path d="M60 30L45 22L60 36L75 22L60 30Z" opacity="0.5" />
      </svg>
    ),
  },
  {
    name: 'Tether',
    svg: (
      <svg viewBox="35 8 50 32" fill="currentColor">
        <text x="60" y="30" textAnchor="middle" fontSize="20" fontWeight="800">₮</text>
        <text x="60" y="38" textAnchor="middle" fontSize="6" fontWeight="600" letterSpacing="1">TETHER</text>
      </svg>
    ),
  },
  {
    name: 'Binance',
    svg: (
      <svg viewBox="38 0 44 40" fill="currentColor">
        <polygon points="60,4 66,10 54,10" />
        <polygon points="60,36 66,30 54,30" />
        <polygon points="42,20 48,14 48,26" />
        <polygon points="78,20 72,14 72,26" />
        <rect x="56" y="16" width="8" height="8" transform="rotate(45 60 20)" />
      </svg>
    ),
  },
  {
    name: 'Coinbase',
    svg: (
      <svg viewBox="0 0 120 40" fill="currentColor">
        <circle cx="36" cy="20" r="14" opacity="0.2" />
        <circle cx="36" cy="20" r="10" opacity="0.4" />
        <path d="M36 13C32.1 13 29 16.1 29 20C29 23.9 32.1 27 36 27C38.4 27 40.5 25.8 41.7 24H38.8C37.9 25 36.5 25.5 36 25.5C33.6 25.5 31.5 23.5 31.5 20C31.5 16.5 33.6 14.5 36 14.5C37 14.5 38 15 38.8 16H41.7C40.5 14.2 38.4 13 36 13Z" />
        <text x="78" y="24" textAnchor="middle" fontSize="10" fontWeight="700" letterSpacing="0.5">Coinbase</text>
      </svg>
    ),
  },
  {
    name: 'Payoneer',
    svg: (
      <svg viewBox="0 0 120 40" fill="currentColor">
        <circle cx="28" cy="20" r="12" opacity="0.2" />
        <path d="M20 20C20 15.6 23.6 12 28 12C32.4 12 36 15.6 36 20" strokeWidth="3" fill="none" stroke="currentColor" opacity="0.7" />
        <circle cx="28" cy="20" r="3" />
        <text x="75" y="24" textAnchor="middle" fontSize="10" fontWeight="600">Payoneer</text>
      </svg>
    ),
  },
  {
    name: 'Skrill',
    svg: (
      <svg viewBox="0 0 120 40" fill="currentColor">
        <text x="60" y="26" textAnchor="middle" fontSize="16" fontWeight="700" fontStyle="italic" letterSpacing="1">Skrill</text>
      </svg>
    ),
  },
  {
    name: 'Neteller',
    svg: (
      <svg viewBox="0 0 120 40" fill="currentColor">
        <text x="60" y="25" textAnchor="middle" fontSize="13" fontWeight="700" letterSpacing="1">NETELLER</text>
      </svg>
    ),
  },
  {
    name: 'Perfect Money',
    svg: (
      <svg viewBox="28 6 64 30" fill="currentColor">
        <text x="60" y="20" textAnchor="middle" fontSize="11" fontWeight="800" letterSpacing="0.5">PERFECT</text>
        <text x="60" y="32" textAnchor="middle" fontSize="11" fontWeight="800" letterSpacing="0.5">MONEY</text>
      </svg>
    ),
  },
  {
    name: 'Wise',
    svg: (
      <svg viewBox="0 0 120 40" fill="currentColor">
        <path d="M30 10L45 30H15L30 10Z" opacity="0.3" />
        <path d="M25 14L38 30H12L25 14Z" opacity="0.6" />
        <text x="78" y="24" textAnchor="middle" fontSize="14" fontWeight="700">wise</text>
      </svg>
    ),
  },
  {
    name: 'Solana Pay',
    svg: (
      <svg viewBox="0 0 120 40" fill="currentColor">
        <path d="M18 28L38 28L34 32H14L18 28Z" opacity="0.9" />
        <path d="M14 17L34 17L38 13H18L14 17Z" opacity="0.6" />
        <path d="M18 22.5L38 22.5L34 18.5H14L18 22.5Z" opacity="0.75" />
        <text x="78" y="24" textAnchor="middle" fontSize="10" fontWeight="700" letterSpacing="0.5">Solana</text>
      </svg>
    ),
  },
  {
    name: 'Litecoin',
    svg: (
      <svg viewBox="40 2 40 36" fill="currentColor">
        <text x="60" y="30" textAnchor="middle" fontSize="28" fontWeight="300" fontFamily="serif">Ł</text>
      </svg>
    ),
  },
  {
    name: 'Ripple',
    svg: (
      <svg viewBox="40 4 40 32" fill="currentColor">
        <circle cx="60" cy="12" r="5" opacity="0.8" />
        <circle cx="48" cy="28" r="5" opacity="0.6" />
        <circle cx="72" cy="28" r="5" opacity="0.6" />
        <line x1="60" y1="17" x2="50" y2="24" stroke="currentColor" strokeWidth="2" opacity="0.5" />
        <line x1="60" y1="17" x2="70" y2="24" stroke="currentColor" strokeWidth="2" opacity="0.5" />
      </svg>
    ),
  },
  {
    name: 'Telegram',
    svg: (
      <svg viewBox="0 0 120 40" fill="currentColor">
        <path d="M35 6L10 18L20 21L24 34L30 26L38 32L42 6L35 6ZM36 11L23 23L21 20L36 11Z" opacity="0.8" />
        <text x="78" y="24" textAnchor="middle" fontSize="9" fontWeight="600" letterSpacing="0.5">Telegram</text>
      </svg>
    ),
  },
  {
    name: 'Cash App',
    svg: (
      <svg viewBox="0 0 120 40" fill="currentColor">
        <rect x="18" y="6" rx="8" ry="8" width="28" height="28" opacity="0.15" />
        <text x="32" y="26" textAnchor="middle" fontSize="20" fontWeight="800">$</text>
        <text x="78" y="24" textAnchor="middle" fontSize="10" fontWeight="700">Cash App</text>
      </svg>
    ),
  },
  {
    name: 'Revolut',
    svg: (
      <svg viewBox="0 0 120 40" fill="currentColor">
        <text x="60" y="26" textAnchor="middle" fontSize="14" fontWeight="700" letterSpacing="0.5">Revolut</text>
      </svg>
    ),
  },
  {
    name: 'USDC',
    svg: (
      <svg viewBox="40 2 40 36" fill="currentColor">
        <circle cx="60" cy="20" r="16" opacity="0.15" />
        <circle cx="60" cy="20" r="12" opacity="0.1" />
        <text x="60" y="25" textAnchor="middle" fontSize="12" fontWeight="800">USDC</text>
      </svg>
    ),
  },
  {
    name: 'Dogecoin',
    svg: (
      <svg viewBox="40 4 40 34" fill="currentColor">
        <text x="60" y="30" textAnchor="middle" fontSize="24" fontWeight="800">Ð</text>
      </svg>
    ),
  },
  {
    name: 'Western Union',
    svg: (
      <svg viewBox="30 6 60 28" fill="currentColor">
        <text x="60" y="18" textAnchor="middle" fontSize="8" fontWeight="800" letterSpacing="0.5">WESTERN</text>
        <text x="60" y="30" textAnchor="middle" fontSize="10" fontWeight="800" letterSpacing="1">UNION</text>
      </svg>
    ),
  },
  {
    name: 'MoneyGram',
    svg: (
      <svg viewBox="30 6 60 28" fill="currentColor">
        <text x="60" y="18" textAnchor="middle" fontSize="8" fontWeight="700" letterSpacing="0.5">MONEY</text>
        <text x="60" y="30" textAnchor="middle" fontSize="10" fontWeight="700" letterSpacing="0.5">GRAM</text>
      </svg>
    ),
  },
  {
    name: 'Polygon',
    svg: (
      <svg viewBox="48 4 24 38" fill="currentColor">
        <path d="M68 13L60 8L52 13V23L60 28L68 23V13Z" opacity="0.3" />
        <path d="M66 14L60 10L54 14V22L60 26L66 22V14Z" opacity="0.6" />
        <text x="60" y="38" textAnchor="middle" fontSize="7" fontWeight="600" letterSpacing="0.5">POLYGON</text>
      </svg>
    ),
  },
  {
    name: 'Avalanche',
    svg: (
      <svg viewBox="38 2 44 34" fill="currentColor">
        <path d="M60 6L78 32H42L60 6Z" opacity="0.3" />
        <path d="M54 32L46 32L56 16L60 22L54 32Z" opacity="0.7" />
        <path d="M66 32L74 32L64 16L60 22L66 32Z" opacity="0.7" />
      </svg>
    ),
  },
];

// Split partners into 2 rows
const row1 = partners.slice(0, Math.ceil(partners.length / 2));
const row2 = partners.slice(Math.ceil(partners.length / 2));

export default function PaymentPartners() {
  return (
    <section className={styles.partners} id="payment-partners-section">
      <div className="container">
        <div className="section-header">
          <p className="section-tag">// Partners</p>
          <h2 className="section-title">
            Payment <span className="gradient-text">Partners</span>
          </h2>
          <p className="section-subtitle">
            We support a wide range of payment methods and cryptocurrencies for seamless deposits and withdrawals
          </p>
        </div>
      </div>

      <div className={styles.sliderWrapper}>
        {/* Row 1 — scrolls left */}
        <div className={styles.sliderRow}>
          <div className={`${styles.sliderTrack} ${styles.scrollLeft}`}>
            {[...row1, ...row1, ...row1].map((partner, i) => (
              <div key={`r1-${i}`} className={styles.partnerCard}>
                <div className={styles.partnerLogo}>{partner.svg}</div>
                <span className={styles.partnerName}>{partner.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 — scrolls right */}
        <div className={styles.sliderRow}>
          <div className={`${styles.sliderTrack} ${styles.scrollRight}`}>
            {[...row2, ...row2, ...row2].map((partner, i) => (
              <div key={`r2-${i}`} className={styles.partnerCard}>
                <div className={styles.partnerLogo}>{partner.svg}</div>
                <span className={styles.partnerName}>{partner.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Fade edges */}
        <div className={styles.fadeLeft} />
        <div className={styles.fadeRight} />
      </div>
    </section>
  );
}
