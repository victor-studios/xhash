import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { miningPackages } from '@/data/packages';
import PackageDetail from '@/components/PackageDetail/PackageDetail';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return miningPackages.map((pkg) => ({
    slug: pkg.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const pkg = miningPackages.find((p) => p.slug === slug);
  if (!pkg) return { title: 'Package Not Found — XHash' };

  return {
    title: `${pkg.name} ${pkg.subtitle ? `(${pkg.subtitle})` : ''} — XHash Mining`,
    description: `Start mining ${pkg.crypto} with XHash. ${pkg.duration} contract, ${pkg.dailyRate} daily rate, ${pkg.totalReturn} total return.`,
  };
}

export default async function PackageDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const pkg = miningPackages.find((p) => p.slug === slug);

  if (!pkg) {
    notFound();
  }

  return <PackageDetail pkg={pkg} />;
}
