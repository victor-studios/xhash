import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, ArrowLeft } from 'lucide-react';
import { blogPostsFull } from '@/data/blog-posts';
import styles from './blogDetail.module.css';

const blogIcons: Record<string, string> = {
  'future-of-gpu-mining-2026': '⛏️',
  'crypto-market-analysis-what-to-expect': '📊',
  'understanding-hash-rates-profitability': '🔗',
  'bitcoin-halving-impact-on-miners': '₿',
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPostsFull.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPostsFull.find((p) => p.slug === slug);
  if (!post) return { title: 'Post Not Found — XHash' };

  return {
    title: `${post.title} — XHash Blog`,
    description: post.excerpt,
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = blogPostsFull.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const heroIcon = blogIcons[post.slug] || '📰';

  /* Determine if a content block is a sub-heading (short, no period) */
  function isSubHeading(text: string) {
    return text.length < 60 && !text.endsWith('.');
  }

  return (
    <div className={styles.blogDetail}>
      <div className="container">
        {/* Hero Image */}
        <div className={styles.heroImage}>{heroIcon}</div>

        {/* Article */}
        <article className={styles.articleWrapper}>
          <h1 className={styles.articleTitle}>{post.title}</h1>

          <div className={styles.articleMeta}>
            <span className={styles.metaDate}>
              <Calendar size={14} />
              {post.date}
            </span>
            <span className={styles.metaCategory}>{post.category}</span>
          </div>

          <div className={styles.articleBody}>
            {post.content.map((block, index) =>
              isSubHeading(block) ? (
                <h2 key={index} className={styles.subHeading}>
                  {block}
                </h2>
              ) : (
                <p key={index} className={styles.paragraph}>
                  {block}
                </p>
              )
            )}
          </div>

          <Link href="/blog" className={styles.backLink}>
            <ArrowLeft size={16} />
            Back to Blog
          </Link>
        </article>
      </div>
    </div>
  );
}
