export interface MiningPackage {
  id: string;
  slug: string;
  name: string;
  subtitle?: string;
  crypto: string;
  crypto_icon: string;
  crypto_color: string;
  duration_months: number;
  price: number;
  total_return: number;
  slots_total: number;
  slots_available: number;
  is_sold_out: boolean;
  created_at?: string;
}
export interface Depositor {
  id: string;
  name: string;
  country: string;
  flag: string;
  amount: string;
  date: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
}

export interface CryptoPrice {
  id: string;
  name: string;
  symbol: string;
  price: string;
  change: string;
  isPositive: boolean;
  icon: string;
}

export interface NavLink {
  label: string;
  href: string;
}
