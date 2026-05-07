'use client';

import React from 'react';
import styles from './ProcessSection.module.css';

export default function ProcessSection() {
  return (
    <>
      <section className={styles.processSection}>
        <div className={styles.container}>
          <div className={styles.processLayout}>
            {/* Left Content */}
            <div className={styles.processContent}>
              <div className="section-tag">// The Process</div>
              <h2 className={styles.sectionTitle}>The XHash Process</h2>
              <p className={styles.processLeadText}>
                You buy virtual mining capacity on our platform. We use those funds to rent and deploy real, high-performance miners in our global data centres, and you earn the rewards directly. It's that simple.
              </p>
              
              <div className={styles.processSteps}>
                <div className={styles.processStep}>
                  <div className={styles.stepNumber}>01</div>
                  <div>
                    <h4 className={styles.stepTitle}>Purchase Capacity</h4>
                    <p className={styles.stepDesc}>Select a mining package that fits your investment goals without the hardware hassle.</p>
                  </div>
                </div>
                <div className={styles.processStep}>
                  <div className={styles.stepNumber}>02</div>
                  <div>
                    <h4 className={styles.stepTitle}>Hardware Deployment</h4>
                    <p className={styles.stepDesc}>We instantly allocate real, enterprise-grade miners (ASICs & GPUs) to your account.</p>
                  </div>
                </div>
                <div className={styles.processStep}>
                  <div className={styles.stepNumber}>03</div>
                  <div>
                    <h4 className={styles.stepTitle}>Daily Earnings</h4>
                    <p className={styles.stepDesc}>Block rewards are credited directly to your secure XHash wallet every single day.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Visuals - Accordion */}
            <div className={styles.processVisualsAccordion}>
              <div className={styles.accordionItem}>
                <img src="/images/about/btc-rig.jpg.webp" alt="Modern Bitcoin Mining Rig" />
                <div className={styles.accordionContent}>
                  <span className={styles.accordionTitle}>ASIC Clusters</span>
                </div>
              </div>
              <div className={styles.accordionItem}>
                <img src="/images/about/eth-rig.jpg.webp" alt="Ethereum Mining Rig" />
                <div className={styles.accordionContent}>
                  <span className={styles.accordionTitle}>GPU Arrays</span>
                </div>
              </div>
              <div className={styles.accordionItem}>
                <img src="/images/about/whatsminer.png.webp" alt="WhatsMiner" />
                <div className={styles.accordionContent}>
                  <span className={styles.accordionTitle}>Next-Gen Hardware</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <div className={styles.divider} />
    </>
  );
}
