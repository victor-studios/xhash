import type { Metadata } from 'next';
import ClientProviders from './providers';
import CryptoTicker from '@/components/CryptoTicker/CryptoTicker';
import Navbar from '@/components/Navbar/Navbar';
import { ConditionalFooter } from '@/components/ConditionalLayout';
import './globals.css';

export const metadata: Metadata = {
  title: 'XHash — GPU-Powered Crypto Mining Platform',
  description: 'Start mining cryptocurrency today with XHash. No hardware needed. Access GPU-powered compute, track real-time performance, and earn daily returns with our mining packages.',
  keywords: ['crypto mining', 'GPU mining', 'bitcoin mining', 'cloud mining', 'XHash', 'cryptocurrency'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>
          <CryptoTicker />
          <Navbar />
          <main style={{ paddingTop: 'calc(var(--navbar-height) + var(--ticker-height, 32px))' }}>
            {children}
          </main>
          <ConditionalFooter />
        </ClientProviders>
      </body>
    </html>
  );
}
