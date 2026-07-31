'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/features/auth/api';
import { useAuthStore } from '@/features/auth/store';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: async () => {
      try {
        const user = await authApi.getCurrentUser();
        setUser(user);
        router.push('/search');
      } catch {
        setErrorMsg('Failed to load user profile');
      }
    },
    onError: (error: any) => {
      setErrorMsg(error.response?.data?.message || 'Invalid email or password');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    loginMutation.mutate({ email, password });
  };

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 56px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
      }}
    >
      <div style={{ width: '100%', maxWidth: '360px' }}>

        {/* Heading */}
        <h1
          className="wordmark"
          style={{
            fontSize: '2.5rem',
            fontWeight: 600,
            color: 'var(--fg)',
            letterSpacing: '-0.02em',
            marginBottom: '0.5rem',
          }}
        >
          Sign in.
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--fg-dim)', marginBottom: '2.5rem' }}>
          Welcome back to EchoShelf.
        </p>

        {/* Error */}
        {errorMsg && (
          <p
            style={{
              fontSize: '0.8125rem',
              color: 'var(--brick)',
              marginBottom: '1.25rem',
            }}
          >
            {errorMsg}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.75rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--fg-dim)',
                marginBottom: '0.5rem',
                fontFamily: 'var(--font-mono), monospace',
              }}
            >
              Email
            </label>
            <input
              id="login-email"
              type="email"
              required
              className="field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.75rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--fg-dim)',
                marginBottom: '0.5rem',
                fontFamily: 'var(--font-mono), monospace',
              }}
            >
              Password
            </label>
            <input
              id="login-password"
              type="password"
              required
              className="field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button
            id="login-submit"
            type="submit"
            disabled={loginMutation.isPending}
            className="btn-brick"
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        {/* Footer link */}
        <p
          style={{
            marginTop: '2rem',
            fontSize: '0.8125rem',
            color: 'var(--fg-dim)',
            borderTop: '1px solid var(--border)',
            paddingTop: '1.5rem',
          }}
        >
          No account?{' '}
          <Link
            href="/register"
            style={{
              color: 'var(--fg)',
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
            }}
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
