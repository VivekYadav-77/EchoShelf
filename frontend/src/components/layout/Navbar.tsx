'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/features/auth/store';
import { authApi } from '@/features/auth/api';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useTheme } from '@/components/providers/ThemeProvider';
import { useEffect } from 'react';

const NAV_LINKS = [
  { href: '/search', label: 'Search' },
  { href: '/library', label: 'Library' },
  { href: '/analytics', label: 'Analytics' },
  { href: '/ai-insights', label: 'AI Insights' },
];

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export default function Navbar() {
  const { user, isAuthenticated, isLoading, setUser, setLoading, logout } = useAuthStore();
  const { theme, toggle } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    authApi.getCurrentUser()
      .then(user => setUser(user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [setUser, setLoading]);

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      logout();
      router.push('/login');
    }
  });

  return (
    <nav
      style={{
        borderBottom: '1px solid var(--border)',
        backgroundColor: 'var(--bg)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        className="rail"
        style={{
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '2rem',
        }}
      >
        {/* Wordmark */}
        <Link
          href={isAuthenticated && !isLoading ? '/dashboard' : '/'}
          className="wordmark"
          style={{
            fontSize: '1rem',
            fontWeight: 600,
            color: 'var(--fg)',
            letterSpacing: '0.08em',
            flexShrink: 0,
          }}
        >
          ECHOSHELF
        </Link>

        {/* Nav links-only when authenticated */}
        {!isLoading && isAuthenticated && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flex: 1 }}>
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname === href || pathname.startsWith(href + '/');
              return (
                <Link
                  key={href}
                  href={href}
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    color: active ? 'var(--fg)' : 'var(--fg-dim)',
                    padding: '0.375rem 0.75rem',
                    borderBottom: active ? '1px solid var(--fg)' : '1px solid transparent',
                    transition: 'color 0.15s ease, border-color 0.15s ease',
                    letterSpacing: '0.02em',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={e => {
                    if (!active) (e.currentTarget as HTMLElement).style.color = 'var(--fg)';
                  }}
                  onMouseLeave={e => {
                    if (!active) (e.currentTarget as HTMLElement).style.color = 'var(--fg-dim)';
                  }}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        )}

        {/* Right side controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
          {/* Theme toggle */}
          <button
            onClick={toggle}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--fg-dim)',
              cursor: 'pointer',
              padding: '0.25rem',
              display: 'flex',
              alignItems: 'center',
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--fg)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--fg-dim)')}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>

          {/* Auth controls */}
          {!isLoading && (
            isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span
                  style={{
                    fontSize: '0.8125rem',
                    color: 'var(--fg-dim)',
                    display: 'none',
                  }}
                  className="md:block"
                >
                  {user?.username}
                </span>
                <button
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isPending}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '0.8125rem',
                    color: 'var(--fg-dim)',
                    cursor: 'pointer',
                    padding: 0,
                    letterSpacing: '0.02em',
                    transition: 'color 0.15s ease',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--brick)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--fg-dim)')}
                >
                  {logoutMutation.isPending ? '...' : 'Sign out'}
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Link
                  href="/login"
                  style={{
                    fontSize: '0.8125rem',
                    color: 'var(--fg-dim)',
                    transition: 'color 0.15s ease',
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--fg)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--fg-dim)'}
                >
                  Sign in
                </Link>
                <Link href="/register" className="btn-brick" style={{ padding: '0.375rem 0.875rem', fontSize: '0.8125rem' }}>
                  Get started
                </Link>
              </div>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
