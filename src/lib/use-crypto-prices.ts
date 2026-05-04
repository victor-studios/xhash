'use client';

import { useState, useEffect } from 'react';

interface CoinPrice {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  image: string;
}

const COINGECKO_URL = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,ripple,dogecoin,solana,cardano,litecoin,polkadot,avalanche-2,chainlink,the-open-network,shiba-inu&order=market_cap_desc&sparkline=false';

// Fallback data in case API rate-limits
const fallbackData: CoinPrice[] = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'btc', current_price: 96417.68, price_change_percentage_24h: 1.45, image: '' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'eth', current_price: 3764.10, price_change_percentage_24h: -0.32, image: '' },
  { id: 'ripple', name: 'XRP', symbol: 'xrp', current_price: 2.1983, price_change_percentage_24h: 1.85, image: '' },
  { id: 'solana', name: 'Solana', symbol: 'sol', current_price: 177.51, price_change_percentage_24h: -2.15, image: '' },
  { id: 'dogecoin', name: 'Dogecoin', symbol: 'doge', current_price: 0.3821, price_change_percentage_24h: 3.12, image: '' },
  { id: 'cardano', name: 'Cardano', symbol: 'ada', current_price: 0.7138, price_change_percentage_24h: 0.87, image: '' },
  { id: 'the-open-network', name: 'Toncoin', symbol: 'ton', current_price: 5.63, price_change_percentage_24h: 2.41, image: '' },
  { id: 'avalanche-2', name: 'Avalanche', symbol: 'avax', current_price: 37.82, price_change_percentage_24h: -1.18, image: '' },
  { id: 'shiba-inu', name: 'Shiba Inu', symbol: 'shib', current_price: 0.00002341, price_change_percentage_24h: 4.52, image: '' },
  { id: 'chainlink', name: 'Chainlink', symbol: 'link', current_price: 15.47, price_change_percentage_24h: 0.93, image: '' },
  { id: 'litecoin', name: 'Litecoin', symbol: 'ltc', current_price: 84.30, price_change_percentage_24h: 1.23, image: '' },
  { id: 'polkadot', name: 'Polkadot', symbol: 'dot', current_price: 7.42, price_change_percentage_24h: -0.56, image: '' },
];

const cryptoEmojis: Record<string, string> = {
  bitcoin: '₿',
  ethereum: '⟠',
  ripple: '✕',
  dogecoin: 'Ð',
  solana: '◎',
  cardano: '₳',
  litecoin: 'Ł',
  polkadot: '●',
  'avalanche-2': '🔺',
  chainlink: '⬡',
  'the-open-network': '💎',
  'shiba-inu': '🐕',
};

export function useCryptoPrices() {
  const [prices, setPrices] = useState<CoinPrice[]>(fallbackData);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchPrices = async () => {
    try {
      const res = await fetch(COINGECKO_URL);
      if (!res.ok) throw new Error('API rate limited');
      const data: CoinPrice[] = await res.json();
      setPrices(data);
      setLastUpdated(new Date());
    } catch {
      // Use fallback data on error
      setPrices(fallbackData);
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
    // Refresh every 60 seconds (CoinGecko free tier: 10-30 calls/min)
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  const formattedPrices = prices.map((coin) => ({
    id: coin.id,
    name: coin.name,
    symbol: coin.symbol.toUpperCase(),
    price: coin.current_price.toLocaleString('en-US', {
      minimumFractionDigits: coin.current_price < 1 ? 4 : 2,
      maximumFractionDigits: coin.current_price < 1 ? 6 : 2,
    }),
    rawPrice: coin.current_price,
    change: `${coin.price_change_percentage_24h >= 0 ? '+' : ''}${coin.price_change_percentage_24h.toFixed(2)}%`,
    isPositive: coin.price_change_percentage_24h >= 0,
    icon: cryptoEmojis[coin.id] || '●',
    image: coin.image,
  }));

  return { prices: formattedPrices, loading, lastUpdated, refetch: fetchPrices };
}
