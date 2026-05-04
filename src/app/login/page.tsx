'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Input from '@/components/ui/Input';
import styles from '@/components/AuthForm/AuthForm.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter your email and password');
      return;
    }

    setLoading(true);
    // Simulate a brief loading state
    setTimeout(() => {
      const success = login(email, password);
      if (success) {
        router.push('/');
      } else {
        setError('Login failed. Please try again.');
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className={styles.authPage}>
      <div className="container">
        <div className={styles.authInner}>
          <div className={styles.authContent}>
            <h1 className={styles.authTitle}>
              Welcome <span className={styles.highlight}>Back</span>
            </h1>
            <p className={styles.authDescription}>
              Log in to your XHash dashboard to track mining performance, manage active allocations, 
              and withdraw your earnings.
            </p>

            <form className={styles.authForm} id="login-form" onSubmit={handleSubmit}>
              <Input
                type="email"
                placeholder="Email"
                id="login-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                type="password"
                placeholder="Password"
                id="login-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {error && <div className={styles.errorMsg}>{error}</div>}

              <div className={styles.forgotPassword}>
                <Link href="/forgot-password">Forgot Password?</Link>
              </div>

              <button 
                type="submit" 
                className={`${styles.submitBtn} ${loading ? styles.loading : ''}`} 
                id="login-submit"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>

              <div className={styles.authSwitch}>
                Don&apos;t have an account? <Link href="/register">Register</Link>
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
