export interface MiningPackage {
  id: string;
  slug: string;
  name: string;
  subtitle?: string;
  crypto: string;
  cryptoIcon: string;
  cryptoColor: string;
  capacityCurrent: number;
  capacityTotal: number;
  duration: string;
  dailyMining: string;
  hardwareCost: string;
  totalReturn: string;
  totalPrice: string;
  contractProfit: string;
  fixedReturn: string;
  returnType: string;
  dailyRate: string;
  referralReward: string;
  isSoldOut: boolean;
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
