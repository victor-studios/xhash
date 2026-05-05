'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Camera } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import styles from './Settings.module.css';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'withdraw' | 'security'>('profile');
  const { user } = useAuth();
  const { toast } = useToast();

  // Profile state
  const [displayName, setDisplayName] = useState(user?.name || '');
  const [username, setUsername] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  // Withdraw settings state
  const [paymentMethod, setPaymentMethod] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [withdrawPassword, setWithdrawPassword] = useState('');

  // Security settings state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [twoFA, setTwoFA] = useState(true);

  const getTitleMap = {
    profile: 'Profile Details',
    withdraw: 'Withdraw Settings',
    security: 'Security Settings',
  };

  /* ─── Save Handlers ─── */
  const handleSaveProfile = () => {
    if (!displayName.trim() || !username.trim() || !email.trim()) {
      toast({ variant: 'error', title: 'Missing Fields', message: 'Please fill in all profile fields.' });
      return;
    }
    if (!email.includes('@')) {
      toast({ variant: 'error', title: 'Invalid Email', message: 'Please enter a valid email address.' });
      return;
    }
    toast({ variant: 'success', title: 'Profile Updated', message: 'Your profile details have been saved.' });
  };

  const handleSaveWithdraw = () => {
    if (!paymentMethod) {
      toast({ variant: 'error', title: 'Payment Method Required', message: 'Please select a payment method.' });
      return;
    }
    if (!walletAddress.trim()) {
      toast({ variant: 'error', title: 'Wallet Address Required', message: 'Please enter your wallet address.' });
      return;
    }
    if (!withdrawPassword) {
      toast({ variant: 'error', title: 'Password Required', message: 'Please enter your password to confirm.' });
      return;
    }
    toast({ variant: 'success', title: 'Withdraw Settings Saved', message: 'Your withdrawal preferences have been updated.' });
  };

  const handleSaveSecurity = () => {
    if (!currentPassword) {
      toast({ variant: 'error', title: 'Current Password Required', message: 'Please enter your current password.' });
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      toast({ variant: 'error', title: 'Weak Password', message: 'New password must be at least 6 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ variant: 'error', title: 'Passwords Don\'t Match', message: 'New password and confirmation must match.' });
      return;
    }
    toast({ variant: 'success', title: 'Password Updated', message: 'Your password has been changed successfully.' });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setSecurityCode('');
  };

  const handleSendCode = () => {
    toast({ variant: 'info', title: 'Code Sent', message: 'A verification code has been sent to your email.' });
  };

  return (
    <>
      {/* Tabs */}
      <div className="dash-tabs">
        <button
          className={`dash-tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button
          className={`dash-tab ${activeTab === 'withdraw' ? 'active' : ''}`}
          onClick={() => setActiveTab('withdraw')}
        >
          Withdraw
        </button>
        <button
          className={`dash-tab ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          Security
        </button>
      </div>

      <div className="dash-tab-content">
        {/* ─── Profile Tab ─── */}
        {activeTab === 'profile' && (
          <>
            <div className={styles.profileForm}>
              <div className={styles.formFields}>
                <h3 className={styles.tabSectionTitle}>Profile Details</h3>
                <div className="dash-input-group">
                  <input
                    type="text"
                    className="dash-input"
                    placeholder="Display Name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    id="profile-display-name"
                  />
                  <input
                    type="text"
                    className="dash-input"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    id="profile-username"
                  />
                  <input
                    type="email"
                    className="dash-input"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    id="profile-email"
                  />
                </div>

                <p className={styles.changeLabel}>Change user details</p>
                <button className="dash-btn-green" id="save-profile-btn" onClick={handleSaveProfile}>
                  Save changes
                </button>
              </div>

              <div className={styles.avatarSection}>
                <div className={styles.avatarWrapper}>
                  <div className={styles.avatar}>
                    <span className={styles.avatarInitial}>
                      {(user?.name || 'U')[0].toUpperCase()}
                    </span>
                  </div>
                  <button className={styles.cameraBtn} aria-label="Change photo">
                    <Camera size={16} />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ─── Withdraw Tab ─── */}
        {activeTab === 'withdraw' && (
          <>
            <h3 className={styles.tabSectionTitle}>Withdraw Settings</h3>

            <div className="dash-input-group">
              <select
                className="dash-select"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                id="settings-payment-method"
              >
                <option value="" disabled>Select Payment Method</option>
                <option value="btc">BTC [Network: Bitcoin]</option>
                <option value="eth">ETH [Network: Ethereum]</option>
                <option value="usdt-trc20">USDT – TRC20 [Network: Tron]</option>
                <option value="usdt-erc20">USDT – ERC20 [Network: Ethereum]</option>
                <option value="ltc">LTC [Network: Litecoin]</option>
                <option value="usdc">USDC [Network: Ethereum]</option>
                <option value="bch">BCH [Network: Bitcoin Cash]</option>
              </select>

              <input
                type="text"
                className="dash-input"
                placeholder="Wallet Address"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                id="settings-wallet-address"
              />

              <div className="dash-input-with-btn">
                <input
                  type="text"
                  className="dash-input"
                  placeholder="Verification Code"
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value)}
                  id="settings-verify-code"
                />
                <button className="dash-inline-btn" id="settings-send-code-btn" onClick={handleSendCode}>
                  Send Code
                </button>
              </div>

              <input
                type="password"
                className="dash-input"
                placeholder="Enter Password"
                value={withdrawPassword}
                onChange={(e) => setWithdrawPassword(e.target.value)}
                id="settings-withdraw-password"
              />
            </div>

            <button className="dash-btn-green" id="settings-save-withdraw" onClick={handleSaveWithdraw}>
              Save Changes
            </button>
          </>
        )}

        {/* ─── Security Tab ─── */}
        {activeTab === 'security' && (
          <>
            <h3 className={styles.tabSectionTitle}>Change Password</h3>

            <div className="dash-input-group">
              <input
                type="password"
                className="dash-input"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                id="settings-current-password"
              />
              <input
                type="password"
                className="dash-input"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                id="settings-new-password"
              />
              <input
                type="password"
                className="dash-input"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                id="settings-confirm-password"
              />

              <div className="dash-input-with-btn">
                <input
                  type="text"
                  className="dash-input"
                  placeholder="Verification Code"
                  value={securityCode}
                  onChange={(e) => setSecurityCode(e.target.value)}
                  id="settings-security-code"
                />
                <button className="dash-inline-btn" id="settings-send-security-code" onClick={handleSendCode}>
                  Send Code
                </button>
              </div>
            </div>

            <h3 className={styles.tabSectionTitle} style={{ marginTop: 'var(--space-xl)' }}>
              Two Factor Authentication
            </h3>

            <div className="toggle-wrapper" style={{ marginBottom: 'var(--space-xl)' }}>
              <span className="toggle-label">Turn on 2FA</span>
              <input
                type="checkbox"
                className="toggle"
                checked={twoFA}
                onChange={(e) => {
                  setTwoFA(e.target.checked);
                  toast({
                    variant: 'info',
                    title: e.target.checked ? '2FA Enabled' : '2FA Disabled',
                    message: e.target.checked
                      ? 'Two-factor authentication has been turned on.'
                      : 'Two-factor authentication has been turned off.',
                  });
                }}
                id="settings-2fa-toggle"
              />
            </div>

            <button className="dash-btn-green" id="settings-save-security" onClick={handleSaveSecurity}>
              Save Changes
            </button>
          </>
        )}
      </div>
    </>
  );
}
