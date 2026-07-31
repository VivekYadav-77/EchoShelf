'use client';

import { useAuthStore } from '@/features/auth/store';

export default function ProfilePage() {
  const { user, isLoading } = useAuthStore();

  if (isLoading || !user) {
    return (
      <div className="rail" style={{ marginTop: '3rem', textAlign: 'center' }}>
        <div className="loading-text">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="rail" style={{ marginTop: '3rem', marginBottom: '4rem' }}>
      <h1 style={{ marginBottom: '2rem', fontSize: '1.75rem', letterSpacing: '-0.02em' }}>Profile</h1>
      
      <div className="card" style={{ padding: '2rem', borderRadius: '4px' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', color: 'var(--fg-dim)', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: 500 }}>
            Username
          </label>
          <div style={{ fontSize: '1.125rem' }}>
            {user.username}
          </div>
        </div>
        
        <div>
          <label style={{ display: 'block', color: 'var(--fg-dim)', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: 500 }}>
            Email Address
          </label>
          <div style={{ fontSize: '1.125rem' }}>
            {user.email}
          </div>
        </div>
      </div>
    </div>
  );
}
