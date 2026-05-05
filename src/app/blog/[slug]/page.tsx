import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Calendar, ArrowLeft, Tag } from 'lucide-react';
import { blogPostsFull } from '@/data/blog-posts';
import styles from './blogDetail.module.css';

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
    openGraph: {
      images: [post.image],
    },
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = blogPostsFull.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  /* Determine if a content block is a sub-heading (short, no period) */
  function isSubHeading(text: string) {
    return text.length < 60 && !text.endsWith('.');
  }

  return (
    <div className={styles.blogDetail}>
      <div className="container">

        {/* Hero Image */}
        <div className={styles.heroImage}>
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 900px"
            className={styles.heroImg}
          />
          <div className={styles.heroOverlay} />
        </div>

        {/* Article */}
        <article className={styles.articleWrapper}>
          <div className={styles.articleMeta}>
            <span className={styles.metaDate}>
              <Calendar size={14} />
              {post.date}
            </span>
            <span className={styles.metaCategory}>
              <Tag size={11} />
              {post.category}
            </span>
          </div>

          <h1 className={styles.articleTitle}>{post.title}</h1>
          <p className={styles.articleLead}>{post.excerpt}</p>

          <div className={styles.divider} />

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
