'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Input from '@/components/ui/Input';
import styles from '@/components/AuthForm/AuthForm.module.css';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const { resetPassword, verifyOtp, updatePassword } = useAuth();
  const router = useRouter();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    const { success, error: authError } = await resetPassword(email);
    setLoading(false);

    if (success) {
      setStep(2);
    } else {
      setError(authError || 'Failed to send reset code. Please try again.');
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!otp || !newPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    
    // First, verify the OTP which establishes a session
    const { success: verifySuccess, error: verifyError } = await verifyOtp(email, otp, 'recovery');
    
    if (verifySuccess) {
      // Then, update the password for the newly established session
      const { success: updateSuccess, error: updateError } = await updatePassword(newPassword);
      
      setLoading(false);
      if (updateSuccess) {
        // Redirect to login after successful reset
        router.push('/login?reset=success');
      } else {
        setError(updateError || 'Failed to update password. Please try again.');
      }
    } else {
      setLoading(false);
      setError(verifyError || 'Verification failed. Please check your code.');
    }
  };

  return (
    <div className={styles.authPage}>
      <div className="container">
        <div className={styles.authInner}>
          <div className={styles.authContent}>
            <h1 className={styles.authTitle}>
              Reset <span className={styles.highlight}>Password</span>
            </h1>
            <p className={styles.authDescription}>
              {step === 1 
                ? "Enter your email address and we'll send you a 6-digit code to reset your password."
                : `We've sent a 6-digit verification code to ${email}. Please enter it below along with your new password.`
              }
            </p>

            {step === 1 ? (
              <form className={styles.authForm} id="forgot-password-form" onSubmit={handleEmailSubmit}>
                <Input
                  type="email"
                  placeholder="Email Address"
                  id="reset-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                {error && <div className={styles.errorMsg}>{error}</div>}

                <button 
                  type="submit" 
                  className={`${styles.submitBtn} ${loading ? styles.loading : ''}`} 
                  id="reset-email-submit"
                  disabled={loading}
                >
                  {loading ? 'Sending Code...' : 'Send Reset Code'}
                </button>

                <div className={styles.authSwitch}>
                  Remember your password? <Link href="/login">Login</Link>
                </div>
              </form>
            ) : (
              <form className={styles.authForm} id="update-password-form" onSubmit={handleResetSubmit}>
                <Input
                  type="text"
                  placeholder="6-digit Verification Code"
                  id="reset-otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />

                <div className={styles.formRow}>
                  <Input
                    type="password"
                    placeholder="New Password"
                    id="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <Input
                    type="password"
                    placeholder="Confirm New Password"
                    id="new-password-confirm"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                {error && <div className={styles.errorMsg}>{error}</div>}

                <button 
                  type="submit" 
                  className={`${styles.submitBtn} ${loading ? styles.loading : ''}`} 
                  id="update-password-submit"
                  disabled={loading}
                >
                  {loading ? 'Updating Password...' : 'Reset Password'}
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
