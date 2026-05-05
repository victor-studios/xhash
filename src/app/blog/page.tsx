import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowRight } from 'lucide-react';
import { blogPostsFull } from '@/data/blog-posts';
import styles from './blog.module.css';

export const metadata: Metadata = {
  title: 'Blog — XHash',
  description:
    'Stay updated with the latest crypto mining news, market analysis, educational guides, and platform updates from XHash.',
};

export default function BlogPage() {
  return (
    <div className={styles.blogPage}>
      <div className="container">
        {/* Page Hero */}
        <div className={styles.pageHero}>
          <h1 className={styles.pageTitle}>
            Our <span className="gradient-text">Blog</span>
          </h1>
          <p className={styles.pageSubtitle}>
            Stay informed with the latest insights on crypto mining, market trends,
            and educational resources from our team of experts.
          </p>
        </div>

        {/* Blog Grid */}
        <div className={styles.blogGrid} id="blog-grid">
          {blogPostsFull.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className={styles.blogCard}
            >
              <div className={styles.blogCardImage}>
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className={styles.blogCardImg}
                />
                <div className={styles.blogCardImgOverlay} />
              </div>
              <div className={styles.blogCardContent}>
                <div className={styles.blogCardMeta}>
                  <span className={styles.blogCategory}>{post.category}</span>
                  <span className={styles.blogDate}>
                    <Calendar size={12} />
                    {post.date}
                  </span>
                </div>
                <h2 className={styles.blogCardTitle}>{post.title}</h2>
                <p className={styles.blogCardExcerpt}>{post.excerpt}</p>
                <span className={styles.readMore}>
                  Read More <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
