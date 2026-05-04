import { Depositor, BlogPost, CryptoPrice, NavLink } from '@/types';

export const navLinks: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Mining', href: '/mining' },
  { label: 'Affiliate', href: '/affiliate' },
  { label: 'About Us', href: '/about' },
  { label: 'Blog', href: '/blog' },
];

export const heroStats = [
  { label: 'Customers Worldwide', value: '150K+' },
  { label: 'Total Miners', value: '25K+' },
  { label: 'Crypto Mined', value: '$45M+' },
];

export const features = [
  {
    icon: 'Shield',
    title: 'Security Guaranteed',
    description: 'Your investments are protected with industry-leading security protocols, multi-signature wallets, and 24/7 monitoring systems ensuring maximum safety.',
  },
  {
    icon: 'BarChart3',
    title: 'Full Transparency',
    description: 'Access real-time dashboards showing hash rates, uptime, energy usage, and earnings. Every metric is verifiable and updated continuously.',
  },
  {
    icon: 'Headphones',
    title: 'Expert Support',
    description: 'Our dedicated support team of mining experts is available around the clock to assist you with any questions or technical issues.',
  },
];

export const howItWorks = [
  {
    step: 1,
    title: 'Sign Up',
    description: 'Create your free account in minutes. Complete verification and set up your secure wallet to receive mining payouts.',
  },
  {
    step: 2,
    title: 'Choose your package',
    description: 'Select from our range of GPU-powered mining packages. Each plan offers different hash rates, durations, and profitability levels.',
  },
  {
    step: 3,
    title: 'Get Mining',
    description: 'Start earning immediately. Track your mining performance, daily returns, and withdraw profits to your wallet at any time.',
  },
];

export const topDepositors: Depositor[] = [
  { id: '1', name: 'MT*****ey', country: 'Nigeria', flag: '🇳🇬', amount: '$12,500.00', date: '2 hours ago' },
  { id: '2', name: 'JH*****an', country: 'Australia', flag: '🇦🇺', amount: '$8,200.00', date: '3 hours ago' },
  { id: '3', name: 'RK*****ar', country: 'India', flag: '🇮🇳', amount: '$15,000.00', date: '4 hours ago' },
  { id: '4', name: 'PL*****os', country: 'South Africa', flag: '🇿🇦', amount: '$6,800.00', date: '5 hours ago' },
  { id: '5', name: 'AC*****ni', country: 'Italy', flag: '🇮🇹', amount: '$9,400.00', date: '5 hours ago' },
  { id: '6', name: 'SM*****th', country: 'United States', flag: '🇺🇸', amount: '$20,000.00', date: '6 hours ago' },
  { id: '7', name: 'WK*****ng', country: 'UK', flag: '🇬🇧', amount: '$11,300.00', date: '7 hours ago' },
  { id: '8', name: 'TY*****ko', country: 'Japan', flag: '🇯🇵', amount: '$7,600.00', date: '8 hours ago' },
];

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Future of GPU Mining in 2026',
    excerpt: 'Explore how GPU mining is evolving with new algorithms and energy-efficient hardware.',
    image: '/images/blog-1.jpg',
    date: 'May 1, 2026',
    category: 'Mining',
  },
  {
    id: '2',
    title: 'Crypto Market Analysis: What to Expect',
    excerpt: 'Expert insights into cryptocurrency market trends and predictions for the coming quarter.',
    image: '/images/blog-2.jpg',
    date: 'Apr 28, 2026',
    category: 'Analysis',
  },
  {
    id: '3',
    title: 'Understanding Hash Rates & Profitability',
    excerpt: 'A comprehensive guide to hash rates, difficulty adjustments, and maximizing your mining returns.',
    image: '/images/blog-3.jpg',
    date: 'Apr 25, 2026',
    category: 'Education',
  },
  {
    id: '4',
    title: 'Bitcoin Halving Impact on Miners',
    excerpt: 'How the latest halving event affects mining profitability and what strategies to adopt.',
    image: '/images/blog-4.jpg',
    date: 'Apr 20, 2026',
    category: 'Bitcoin',
  },
];

export const cryptoPrices: CryptoPrice[] = [
  { id: '1', name: 'Bitcoin', symbol: 'BTC', price: '26,617.68', change: '+1.45%', isPositive: true, icon: '₿' },
  { id: '2', name: 'Ethereum', symbol: 'ETH', price: '1,764.1', change: '-0.32%', isPositive: false, icon: '⟠' },
  { id: '3', name: 'XRP', symbol: 'XRP', price: '0.99830', change: '+1.85%', isPositive: true, icon: '✕' },
  { id: '4', name: 'Dogecoin', symbol: 'DOGE', price: '0.48211', change: '+3.12%', isPositive: true, icon: 'Ð' },
  { id: '5', name: 'Solana', symbol: 'SOL', price: '77.51', change: '-2.15%', isPositive: false, icon: '◎' },
  { id: '6', name: 'Cardano', symbol: 'ADA', price: '0.071387', change: '+0.87%', isPositive: true, icon: '₳' },
];

export const paymentPartners = [
  { name: 'Google Pay', icon: 'G' },
  { name: 'Meta Pay', icon: 'M' },
  { name: 'Crypto', icon: 'C' },
  { name: 'Telegram', icon: 'T' },
  { name: 'Payoneer', icon: 'P' },
];
