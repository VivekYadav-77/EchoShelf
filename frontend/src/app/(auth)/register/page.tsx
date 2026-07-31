'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/features/auth/api';
import Link from 'next/link';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      router.push('/login');
    },
    onError: (error: any) => {
      setErrorMsg(error.response?.data?.message || 'Registration failed');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    registerMutation.mutate({ username, email, password });
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
          Create account.
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--fg-dim)', marginBottom: '2.5rem' }}>
          Start building your music library.
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
              Username
            </label>
            <input
              id="register-username"
              type="text"
              required
              minLength={3}
              maxLength={50}
              className="field"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="musiclover99"
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
              Email
            </label>
            <input
              id="register-email"
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
              id="register-password"
              type="password"
              required
              minLength={6}
              className="field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button
            id="register-submit"
            type="submit"
            disabled={registerMutation.isPending}
            className="btn-brick"
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            {registerMutation.isPending ? 'Creating account...' : 'Create account'}
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
          Already have an account?{' '}
          <Link
            href="/login"
            style={{
              color: 'var(--fg)',
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
            }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
