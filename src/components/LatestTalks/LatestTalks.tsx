import Image from 'next/image';
import { blogPosts } from '@/data/content';
import styles from './LatestTalks.module.css';

const blogImages = [
  '/images/blog-gpu-mining.png',
  '/images/blog-market-analysis.png',
  '/images/blog-hash-rates.png',
  '/images/blog-bitcoin-halving.png',
];

export default function LatestTalks() {
  return (
    <section className={styles.latestTalks} id="latest-talks-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Latest <span className="gradient-text">Talks</span></h2>
        </div>

        <div className={styles.talksGrid}>
          {blogPosts.map((post, index) => (
            <article key={post.id} className={styles.talkCard}>
              <div className={styles.talkImage}>
                <Image
                  src={blogImages[index] || blogImages[0]}
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
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
