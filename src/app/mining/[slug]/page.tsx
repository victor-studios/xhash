import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { MiningPackage } from '@/types';
import PackageDetail from '@/components/PackageDetail/PackageDetail';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60; // revalidate every minute

export async function generateStaticParams() {
  const { data: plans } = await supabase.from('mining_plans').select('slug');
  return (plans || []).map((pkg) => ({
    slug: pkg.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { data: pkg } = await supabase.from('mining_plans').select('*').eq('slug', slug).single();
  if (!pkg) return { title: 'Package Not Found — XHash' };

  return {
    title: `${pkg.name} ${pkg.subtitle ? `(${pkg.subtitle})` : ''} — XHash Mining`,
    description: `Start mining ${pkg.crypto} with XHash. ${pkg.duration_months} Month contract, $${pkg.price} price, $${pkg.total_return} total return.`,
  };
}

export default async function PackageDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const { data: pkg } = await supabase.from('mining_plans').select('*').eq('slug', slug).single();

  if (!pkg) {
    notFound();
  }

  return <PackageDetail pkg={pkg as MiningPackage} />;
}
