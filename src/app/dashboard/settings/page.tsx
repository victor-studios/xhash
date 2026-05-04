'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Camera } from 'lucide-react';
import styles from './Settings.module.css';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'withdraw' | 'security'>('profile');
  const { user } = useAuth();

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

  return (
    <>
      <h1 className="dash-page-title">{getTitleMap[activeTab]}</h1>

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
                <button className="dash-btn-green" id="save-profile-btn">
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
                <button className="dash-inline-btn" id="settings-send-code-btn">
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

            <button className="dash-btn-green" id="settings-save-withdraw">
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
                <button className="dash-inline-btn" id="settings-send-security-code">
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
                onChange={(e) => setTwoFA(e.target.checked)}
                id="settings-2fa-toggle"
              />
            </div>

            <button className="dash-btn-green" id="settings-save-security">
              Save Changes
            </button>
          </>
        )}
      </div>
    </>
  );
}
