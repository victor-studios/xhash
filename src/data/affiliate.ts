export interface AffiliateBenefit {
  icon: string;
  title: string;
  description: string;
}

export interface AffiliateStep {
  number: string;
  description: string;
}

export interface Partner {
  name: string;
  logo: string;
  color: string;
}

export const affiliateBenefits: AffiliateBenefit[] = [
  {
    icon: 'Gift',
    title: 'NO DEPOSIT',
    description:
      "You don't even need to have your deposit to enjoy the benefits of an affiliate program.",
  },
  {
    icon: 'DollarSign',
    title: 'HIGH PAYOUTS',
    description:
      'You will receive up to a 4.5% referral reward from each user\'s purchased order.',
  },
  {
    icon: 'Clock',
    title: 'INSTANT PAYMENTS',
    description:
      'We pay out the referral reward instantly with Crypto. A referral reward is credited to the account balance.',
  },
  {
    icon: 'Infinity',
    title: 'NO LIMITS',
    description:
      'With unlimited referrals, your earning potential is endless.',
  },
];

export const affiliateSteps: AffiliateStep[] = [
  {
    number: '01',
    description: 'Sign up and get a referral link.',
  },
  {
    number: '02',
    description: 'Invite your friends use referral link.',
  },
  {
    number: '03',
    description: 'Referrals buy packages.',
  },
  {
    number: '04',
    description: 'Get Your Reward.',
  },
];

export const partners: Partner[] = [
  { name: 'Google', logo: 'G', color: '#4285F4' },
  { name: 'Meta', logo: '∞', color: '#0668E1' },
  { name: 'Mastercard', logo: 'M', color: '#7B61FF' },
  { name: 'Telegram', logo: '✈', color: '#229ED9' },
  { name: 'Payoneer', logo: 'P', color: '#FF4800' },
  { name: 'MetaMask', logo: '🦊', color: '#E2761B' },
  { name: 'Trust Wallet', logo: '🛡', color: '#3375BB' },
  { name: 'Discord', logo: '💬', color: '#5865F2' },
  { name: 'Stripe', logo: 'S', color: '#635BFF' },
  { name: 'NVIDIA', logo: 'N', color: '#76B900' },
  { name: 'Blockchain', logo: '◆', color: '#00D2FF' },
  { name: 'Chainlink', logo: '⬡', color: '#375BD2' },
  { name: 'Solana', logo: '◎', color: '#14F195' },
  { name: 'Twitter', logo: '𝕏', color: '#1DA1F2' },
  { name: 'Reddit', logo: 'R', color: '#FF4500' },
];
