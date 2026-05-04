import { Shield, BarChart3, Headphones } from 'lucide-react';
import { features } from '@/data/content';
import styles from './Features.module.css';

const iconMap: Record<string, React.ReactNode> = {
  Shield: <Shield size={28} />,
  BarChart3: <BarChart3 size={28} />,
  Headphones: <Headphones size={28} />,
};

export default function Features() {
  return (
    <section className={styles.features} id="features-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Why Choose <span className="gradient-text">XHash</span>?</h2>
          <p className="section-subtitle">
            Industry-leading infrastructure designed for maximum performance, security, and transparency.
          </p>
        </div>

        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div
              key={index}
              className={styles.featureCard}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className={styles.featureIcon}>
                {iconMap[feature.icon]}
              </div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
