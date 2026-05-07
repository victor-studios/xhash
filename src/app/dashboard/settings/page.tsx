'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Camera } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import styles from './Settings.module.css';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'withdraw' | 'security'>('profile');
  const { user, login, updateProfileDetails, updateEmail, verifyOtp, updatePassword } = useAuth();
  const { toast } = useToast();

  // Profile state
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [emailOtp, setEmailOtp] = useState('');

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setUsername(user.username || '');
      setEmail(user.email || '');
    }
  }, [user]);

  // Withdraw settings state
  const [paymentMethod, setPaymentMethod] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [withdrawPassword, setWithdrawPassword] = useState('');
  const [walletLoading, setWalletLoading] = useState(true);

  // Security settings state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityLoading, setSecurityLoading] = useState(false);

  const getTitleMap = {
    profile: 'Profile Details',
    withdraw: 'Withdraw Settings',
    security: 'Security Settings',
  };

  // Load wallet settings from Supabase profile
  useEffect(() => {
    async function loadWallet() {
      if (!user?.id) return;
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('wallet_network, wallet_address')
          .eq('id', user.id)
          .single();
        if (profile) {
          setPaymentMethod(profile.wallet_network || '');
          setWalletAddress(profile.wallet_address || '');
        }
      } catch (err) {
        console.error('Failed to load wallet settings:', err);
      } finally {
        setWalletLoading(false);
      }
    }
    loadWallet();
  }, [user?.id]);

  /* ─── Save Handlers ─── */
  const handleSaveProfile = async () => {
    if (!displayName.trim() || !username.trim() || !email.trim()) {
      toast({ variant: 'error', title: 'Missing Fields', message: 'Please fill in all profile fields.' });
      return;
    }
    if (!email.includes('@')) {
      toast({ variant: 'error', title: 'Invalid Email', message: 'Please enter a valid email address.' });
      return;
    }

    let profileUpdated = false;
    let emailOtpSent = false;

    // 1. Update Profile Details
    if (displayName !== user?.displayName || username !== user?.username) {
      const { success, error } = await updateProfileDetails({
        username,
        display_name: displayName,
      });
      if (!success) {
        toast({ variant: 'error', title: 'Profile Error', message: error || 'Failed to update profile details' });
        return;
      }
      profileUpdated = true;
    }

    // 2. Update Email
    if (email !== user?.email) {
      const { success, error } = await updateEmail(email);
      if (!success) {
        toast({ variant: 'error', title: 'Email Error', message: error || 'Failed to update email' });
        return;
      }
      emailOtpSent = true;
      setIsVerifyingEmail(true);
    }

    if (emailOtpSent) {
      toast({ variant: 'info', title: 'OTP Sent', message: 'Please check your new email for a verification code.' });
    } else if (profileUpdated) {
      toast({ variant: 'success', title: 'Profile Updated', message: 'Your profile details have been saved.' });
    }
  };

  const handleVerifyEmail = async () => {
    if (!emailOtp.trim()) {
      toast({ variant: 'error', title: 'Missing OTP', message: 'Please enter the verification code.' });
      return;
    }
    
    const { success, error } = await verifyOtp(email, emailOtp, 'email_change');
    if (!success) {
      toast({ variant: 'error', title: 'Verification Failed', message: error || 'Invalid OTP code.' });
      return;
    }

    setIsVerifyingEmail(false);
    setEmailOtp('');
    toast({ variant: 'success', title: 'Email Updated', message: 'Your email has been successfully changed.' });
  };

  const handleSaveWithdraw = async () => {
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

    if (user?.email) {
      const { success } = await login(user.email, withdrawPassword);
      if (!success) {
        toast({ variant: 'error', title: 'Invalid Password', message: 'The password you entered is incorrect.' });
        return;
      }
    } else {
      toast({ variant: 'error', title: 'Error', message: 'User not authenticated properly.' });
      return;
    }
    
    // Save wallet settings to Supabase profile
    const { error } = await supabase
      .from('profiles')
      .update({ wallet_network: paymentMethod, wallet_address: walletAddress })
      .eq('id', user.id);

    if (error) {
      toast({ variant: 'error', title: 'Save Failed', message: 'Could not save wallet settings.' });
      return;
    }

    setWithdrawPassword('');
    toast({ variant: 'success', title: 'Withdraw Settings Saved', message: 'Your withdrawal preferences have been updated.' });
  };

  const handleSaveSecurity = async () => {
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

    setSecurityLoading(true);

    try {
      // 1. Verify current password by attempting sign-in
      if (!user?.email) throw new Error('User email not found');
      const { success: loginSuccess } = await login(user.email, currentPassword);
      if (!loginSuccess) {
        toast({ variant: 'error', title: 'Wrong Password', message: 'Your current password is incorrect.' });
        setSecurityLoading(false);
        return;
      }

      // 2. Actually update the password via Supabase
      const { success, error } = await updatePassword(newPassword);
      if (!success) {
        toast({ variant: 'error', title: 'Update Failed', message: error || 'Could not update your password.' });
        setSecurityLoading(false);
        return;
      }

      toast({ variant: 'success', title: 'Password Updated', message: 'Your password has been changed successfully.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      toast({ variant: 'error', title: 'Error', message: err.message || 'Something went wrong.' });
    } finally {
      setSecurityLoading(false);
    }
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

                {isVerifyingEmail && (
                  <div className="dash-input-with-btn" style={{ marginTop: '1rem' }}>
                    <input
                      type="text"
                      className="dash-input"
                      placeholder="Enter Email OTP"
                      value={emailOtp}
                      onChange={(e) => setEmailOtp(e.target.value)}
                    />
                    <button className="dash-inline-btn" onClick={handleVerifyEmail}>
                      Verify
                    </button>
                  </div>
                )}

                <p className={styles.changeLabel}>Change user details</p>
                <button className="dash-btn-green" id="save-profile-btn" onClick={handleSaveProfile}>
                  Save changes
                </button>
              </div>

              <div className={styles.avatarSection}>
                <div className={styles.avatarWrapper}>
                  <div className={styles.avatar}>
                    <span className={styles.avatarInitial}>
                      {(user?.displayName || user?.name || 'U')[0].toUpperCase()}
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
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                <div 
                  onClick={() => setPaymentMethod('usdt-trc20')}
                  style={{ 
                    flex: 1, 
                    padding: '1rem', 
                    border: paymentMethod === 'usdt-trc20' ? '2px solid var(--accent-primary)' : '1px solid var(--border-default)', 
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    background: paymentMethod === 'usdt-trc20' ? 'var(--bg-card-elevated)' : 'var(--bg-input)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ 
                    minWidth: '36px', height: '36px', borderRadius: '50%', 
                    backgroundColor: '#26A17B', color: '#fff', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    fontWeight: 'bold', fontSize: '1.2rem', boxShadow: '0 0 10px rgba(38, 161, 123, 0.4)' 
                  }}>₮</div>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '0.95rem', color: 'var(--text-primary)' }}>USDT (Tron)</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TRC20 Network</div>
                  </div>
                </div>

                <div 
                  onClick={() => setPaymentMethod('usdt-bep20')}
                  style={{ 
                    flex: 1, 
                    padding: '1rem', 
                    border: paymentMethod === 'usdt-bep20' ? '2px solid var(--accent-primary)' : '1px solid var(--border-default)', 
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    background: paymentMethod === 'usdt-bep20' ? 'var(--bg-card-elevated)' : 'var(--bg-input)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ 
                    minWidth: '36px', height: '36px', borderRadius: '50%', 
                    backgroundColor: '#F3BA2F', color: '#000', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    fontWeight: 'bold', fontSize: '1.2rem', boxShadow: '0 0 10px rgba(243, 186, 47, 0.4)' 
                  }}>₮</div>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '0.95rem', color: 'var(--text-primary)' }}>USDT (Binance)</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>BEP20 Network</div>
                  </div>
                </div>
              </div>

              <input
                type="text"
                className="dash-input"
                placeholder="Wallet Address"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                id="settings-wallet-address"
                autoComplete="off"
                name="wallet_address_new"
              />

              <input
                type="password"
                className="dash-input"
                placeholder="Enter Password"
                value={withdrawPassword}
                onChange={(e) => setWithdrawPassword(e.target.value)}
                id="settings-withdraw-password"
                autoComplete="new-password"
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
                placeholder="New Password (min 6 characters)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                id="settings-new-password"
              />
              <input
                type="password"
                className="dash-input"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                id="settings-confirm-password"
              />
            </div>

            <button 
              className="dash-btn-green" 
              id="settings-save-security" 
              onClick={handleSaveSecurity}
              disabled={securityLoading}
            >
              {securityLoading ? 'Updating...' : 'Save Changes'}
            </button>
          </>
        )}
      </div>
    </>
  );
}
