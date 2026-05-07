'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import XHashLogo from '@/components/XHashLogo/XHashLogo';
import { ArrowRight, ArrowLeft, Shield } from 'lucide-react';
import styles from './AdminLogin.module.css';

const PIN_LENGTH = 8;

export default function AdminLoginPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [pinDigits, setPinDigits] = useState<string[]>(Array(PIN_LENGTH).fill(''));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const pinRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first PIN box when entering step 2
  useEffect(() => {
    if (step === 2) {
      setTimeout(() => pinRefs.current[0]?.focus(), 150);
    }
  }, [step]);

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password.trim()) {
      setError('Username and password are required');
      return;
    }
    setStep(2);
  };

  const handlePinChange = (index: number, value: string) => {
    // Allow only alphanumeric characters
    const char = value.replace(/[^a-zA-Z0-9]/g, '').slice(-1).toUpperCase();
    const newDigits = [...pinDigits];
    newDigits[index] = char;
    setPinDigits(newDigits);

    // Auto-focus next box
    if (char && index < PIN_LENGTH - 1) {
      pinRefs.current[index + 1]?.focus();
    }
  };

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace') {
      if (!pinDigits[index] && index > 0) {
        // Move focus back and clear previous
        const newDigits = [...pinDigits];
        newDigits[index - 1] = '';
        setPinDigits(newDigits);
        pinRefs.current[index - 1]?.focus();
      } else {
        const newDigits = [...pinDigits];
        newDigits[index] = '';
        setPinDigits(newDigits);
      }
      e.preventDefault();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      pinRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < PIN_LENGTH - 1) {
      pinRefs.current[index + 1]?.focus();
    }
  };

  const handlePinPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, PIN_LENGTH);
    const newDigits = [...pinDigits];
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i];
    }
    setPinDigits(newDigits);
    // Focus the next empty or last box
    const nextEmpty = newDigits.findIndex(d => !d);
    pinRefs.current[nextEmpty >= 0 ? nextEmpty : PIN_LENGTH - 1]?.focus();
  };

  const handleSubmit = async () => {
    setError('');
    const pin = pinDigits.join('');
    if (pin.length !== PIN_LENGTH) {
      setError('Please enter the complete 8-character PIN');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, pin }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Authentication failed');
        setLoading(false);
        return;
      }

      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_data', JSON.stringify({
        adminId: data.admin.id,
        username: data.admin.username,
        level: data.admin.level,
        displayName: data.admin.displayName,
      }));

      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Network error');
      setLoading(false);
    }
  };

  const pinFilled = pinDigits.filter(d => d).length;

  return (
    <div className={styles.loginPage}>
      <div className={styles.bgOrb1} />
      <div className={styles.bgOrb2} />
      <div className={styles.gridOverlay} />

      <div className={styles.loginCard}>
        {/* Top gradient line */}
        <div className={styles.header}>
          <XHashLogo height={28} />
          <div className={styles.adminBadge}>ADMIN PANEL</div>
        </div>

        {/* Step indicator */}
        <div className={styles.stepIndicator}>
          <div className={`${styles.stepDot} ${step >= 1 ? styles.stepActive : ''}`}>
            <span>1</span>
          </div>
          <div className={styles.stepLine}>
            <div className={`${styles.stepLineFill} ${step >= 2 ? styles.stepLineFilled : ''}`} />
          </div>
          <div className={`${styles.stepDot} ${step >= 2 ? styles.stepActive : ''}`}>
            <span>2</span>
          </div>
        </div>

        {/* ── STEP 1: Credentials ── */}
        {step === 1 && (
          <div className={styles.stepContent} key="step1">
            <h1 className={styles.title}>
              Secure <span className={styles.highlight}>Login</span>
            </h1>
            <p className={styles.subtitle}>
              Enter your admin credentials to continue.
            </p>

            <form onSubmit={handleStep1} className={styles.form}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Username</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Enter admin username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  autoFocus
                  id="admin-username"
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Password</label>
                <input
                  type="password"
                  className={styles.input}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  id="admin-password"
                />
              </div>

              {error && <div className={styles.errorMsg}>{error}</div>}

              <button type="submit" className={styles.submitBtn} id="admin-step1-next">
                Continue <ArrowRight size={18} />
              </button>
            </form>
          </div>
        )}

        {/* ── STEP 2: Security PIN ── */}
        {step === 2 && (
          <div className={styles.stepContent} key="step2">
            <div className={styles.pinIconWrap}>
              <Shield size={32} />
            </div>
            <h1 className={styles.title}>
              Security <span className={styles.highlight}>PIN</span>
            </h1>
            <p className={styles.subtitle}>
              Enter the 8-character security PIN to access the dashboard.
            </p>

            <div className={styles.otpContainer} onPaste={handlePinPaste}>
              {pinDigits.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { pinRefs.current[i] = el; }}
                  type="text"
                  inputMode="text"
                  maxLength={1}
                  className={`${styles.otpBox} ${digit ? styles.otpBoxFilled : ''}`}
                  value={digit}
                  onChange={(e) => handlePinChange(i, e.target.value)}
                  onKeyDown={(e) => handlePinKeyDown(i, e)}
                  autoComplete="off"
                  id={`admin-pin-${i}`}
                />
              ))}
            </div>

            {/* Progress bar under OTP boxes */}
            <div className={styles.pinProgress}>
              <div
                className={styles.pinProgressFill}
                style={{ width: `${(pinFilled / PIN_LENGTH) * 100}%` }}
              />
            </div>
            <p className={styles.pinCount}>{pinFilled} / {PIN_LENGTH} characters</p>

            {error && <div className={styles.errorMsg}>{error}</div>}

            <div className={styles.stepActions}>
              <button
                type="button"
                className={styles.backBtn}
                onClick={() => { setStep(1); setError(''); setPinDigits(Array(PIN_LENGTH).fill('')); }}
              >
                <ArrowLeft size={16} /> Back
              </button>
              <button
                type="button"
                className={`${styles.submitBtn} ${loading ? styles.loading : ''}`}
                disabled={loading || pinFilled < PIN_LENGTH}
                onClick={handleSubmit}
                id="admin-login-submit"
              >
                {loading ? 'Authenticating...' : 'Access Dashboard'}
              </button>
            </div>
          </div>
        )}

        <div className={styles.securityNote}>
          🔒 This area is restricted. Unauthorized access attempts are logged.
        </div>
      </div>
    </div>
  );
}
