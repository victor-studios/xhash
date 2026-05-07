import Image from 'next/image';
import Link from 'next/link';
import { sortedBlogPosts } from '@/data/blog-posts';
import styles from './LatestTalks.module.css';

export default function LatestTalks() {
  return (
    <section className={styles.latestTalks} id="latest-talks-section">
      <div className="container">
        <div className="section-header">
          <p className="section-tag">// Our Blog</p>
          <h2 className="section-title">Latest <span className="gradient-text">Talks</span></h2>
        </div>

        <div className={styles.talksGrid}>
          {sortedBlogPosts.slice(0, 4).map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className={styles.talkCard}>
              <div className={styles.talkImage}>
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className={styles.talkImg}
                />
                <div className={styles.talkImageOverlay} />
              </div>
              <div className={styles.talkContent}>
                <div className={styles.talkCategory}>{post.category}</div>
                <h3 className={styles.talkTitle}>{post.title}</h3>
                <p className={styles.talkExcerpt}>{post.excerpt}</p>
                <div className={styles.talkDate}>{post.date}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
