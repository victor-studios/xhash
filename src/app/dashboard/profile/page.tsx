'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Camera } from 'lucide-react';
import styles from './ProfileDetails.module.css';

export default function ProfilePage() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState(user?.name || '');
  const [username, setUsername] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  return (
    <>
      <h1 className="dash-page-title">Profile details</h1>

      <div className="dash-card">
        <div className={styles.profileForm}>
          <div className={styles.formFields}>
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
      </div>
    </>
  );
}
