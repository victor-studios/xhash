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
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const { register, verifyOtp } = useAuth();
  const router = useRouter();

  const handleRegisterSubmit = async (e: React.FormEvent) => {
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
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const { success, error: authError } = await register(email, password);
    setLoading(false);

    if (success) {
      setStep(2);
    } else {
      setError(authError || 'Registration failed. Please try again.');
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!otp) {
      setError('Please enter the verification code');
      return;
    }

    setLoading(true);
    const { success, error: authError } = await verifyOtp(email, otp, 'signup');
    setLoading(false);

    if (success) {
      router.push('/dashboard');
    } else {
      setError(authError || 'Verification failed. Please check your code.');
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
              {step === 1 
                ? "Create your free account to start mining cryptocurrency. Access GPU-powered compute infrastructure and earn daily returns with transparent performance metrics."
                : `We've sent a 6-digit verification code to ${email}. Please enter it below to complete your registration.`
              }
            </p>

            {step === 1 ? (
              <form className={styles.authForm} id="register-form" onSubmit={handleRegisterSubmit}>
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

                <button 
                  type="submit" 
                  className={`${styles.submitBtn} ${loading ? styles.loading : ''}`} 
                  id="register-submit"
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Continue'}
                </button>

                <div className={styles.authSwitch}>
                  Already have an account? <Link href="/login">Login</Link>
                </div>
              </form>
            ) : (
              <form className={styles.authForm} id="verify-otp-form" onSubmit={handleOtpSubmit}>
                <Input
                  type="text"
                  placeholder="6-digit Verification Code"
                  id="register-otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />

                {error && <div className={styles.errorMsg}>{error}</div>}

                <button 
                  type="submit" 
                  className={`${styles.submitBtn} ${loading ? styles.loading : ''}`} 
                  id="verify-submit"
                  disabled={loading}
                >
                  {loading ? 'Verifying...' : 'Verify Email'}
                </button>
                
                <div className={styles.authSwitch}>
                  <button type="button" onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, font: 'inherit', textDecoration: 'underline' }}>
                    Go back to change email
                  </button>
                </div>
              </form>
            )}
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
