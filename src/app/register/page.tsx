'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Input from '@/components/ui/Input';
import styles from '@/components/AuthForm/AuthForm.module.css';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }

    const success = register(email, password);
    if (success) {
      router.push('/');
    }
  };

  return (
    <div className={styles.authPage}>
      <div className="container">
        <div className={styles.authInner}>
          <div className={styles.authContent}>
            <h1 className={styles.authTitle}>
              Welcome to <span className={styles.highlight}>XHash</span>
            </h1>
            <p className={styles.authDescription}>
              Create your free account to start mining cryptocurrency. Access GPU-powered compute 
              infrastructure and earn daily returns with transparent performance metrics.
            </p>

            <form className={styles.authForm} id="register-form" onSubmit={handleSubmit}>
              <Input
                type="email"
                placeholder="Email"
                id="register-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <div className={styles.formRow}>
                <Input
                  type="password"
                  placeholder="Password"
                  id="register-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Input
                  type="password"
                  placeholder="Retype Password"
                  id="register-password-confirm"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <div className={styles.captchaRow}>
                <Input
                  type="text"
                  placeholder="Verification Code"
                  id="register-captcha"
                />
                <div className={styles.captchaImage} title="Click to refresh">
                  AY5D6W
                </div>
              </div>

              {error && <div className={styles.errorMsg}>{error}</div>}

              <div className={styles.termsRow}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  id="register-terms"
                  required
                />
                <label htmlFor="register-terms" className={styles.termsText}>
                  I agree to terms and conditions. All mining contracts are final and non-refundable. 
                  Please review our privacy policy before proceeding.
                </label>
              </div>

              <button type="submit" className={styles.submitBtn} id="register-submit">
                Register
              </button>

              <div className={styles.authSwitch}>
                Already have an account? <Link href="/login">Login</Link>
              </div>
            </form>
          </div>

          <div className={styles.authIllustration}>
            <Image
              src="/images/hero-illustration.png"
              alt="XHash Mining Platform"
              width={500}
              height={500}
              className={styles.authImage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
