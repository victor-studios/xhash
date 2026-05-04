import type { Metadata } from 'next';
import { partners } from '@/data/affiliate';
import styles from './partners.module.css';

export const metadata: Metadata = {
  title: 'Our Partners — XHash',
  description:
    'Meet the trusted partners and technology providers powering the XHash GPU mining platform.',
};

export default function PartnersPage() {
  return (
    <div className={styles.partnersPage}>
      <div className="container">
        {/* Page Hero */}
        <div className={styles.pageHero}>
          <h1 className={styles.pageTitle}>Our Partners</h1>
          <p className={styles.pageSubtitle}>
            Lorem ipsum dolor sit amet consectetur. Viverra arcu velit sit eget sed mauris dignissim id.
            Commodo lorem at nunc risus rhoncus suspendisse sed dui vitae. Nisl libero pulvinar feugiat
            amet purus sed a. Bibendum sed scelerisque id dui.
          </p>
        </div>

        {/* Partners Grid */}
        <div className={styles.partnersGrid} id="partners-grid">
          {partners.map((partner, index) => (
            <div
              key={index}
              className={styles.partnerCard}
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className={styles.partnerLogo}>
                <div
                  className={styles.partnerLogoChar}
                  style={{
                    background: `linear-gradient(135deg, ${partner.color}, ${partner.color}88)`,
                  }}
                >
                  {partner.logo}
                </div>
                <span className={styles.partnerName}>{partner.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
