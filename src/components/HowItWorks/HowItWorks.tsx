import Link from 'next/link';
import Button from '@/components/ui/Button';
import { howItWorks } from '@/data/content';
import styles from './HowItWorks.module.css';

export default function HowItWorks() {
  return (
    <section className={styles.howItWorks} id="how-it-works-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">
            Start making a profit with mining <span className="gradient-text">right now!</span>
          </h2>
        </div>

        <div className={styles.stepsContainer}>
          {howItWorks.map((item) => (
            <div key={item.step} className={styles.step}>
              <div className={styles.stepNumber}>{item.step}</div>
              <h3 className={styles.stepTitle}>{item.title}</h3>
              <p className={styles.stepDescription}>{item.description}</p>
            </div>
          ))}
        </div>

        <div className={styles.ctaWrapper}>
          <Link href="/register">
            <Button variant="primary" size="lg">Start Mining Now</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
