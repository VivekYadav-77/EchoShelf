'use client';

import { useAuthStore } from '@/features/auth/store';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuthStore();

  return (
    <div style={{ minHeight: 'calc(100vh - 56px)', padding: '2rem 1.5rem' }}>
      <div className="rail" style={{ paddingTop: '3rem' }}>
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
          Welcome back, {user?.username || 'Listener'}.
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--fg-dim)', marginBottom: '3rem' }}>
          Your music catalog is ready. What would you like to do today?
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {[
            {
              title: 'Search & Discover',
              desc: 'Find new albums in the iTunes catalog to add to your library.',
              href: '/search',
              linkText: 'Search now',
            },
            {
              title: 'Your Library',
              desc: 'View your saved albums, personal ratings, and notes.',
              href: '/library',
              linkText: 'Go to library',
            },
            {
              title: 'Analytics',
              desc: 'Visualize your music taste through charts and breakdowns.',
              href: '/analytics',
              linkText: 'View analytics',
            },
            {
              title: 'AI Insights',
              desc: 'Get an AI-generated analysis of your unique listening identity.',
              href: '/ai-insights',
              linkText: 'Get insights',
            },
          ].map((card, i) => (
            <div
              key={i}
              className="card"
              style={{
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <h2 style={{ fontSize: '1.125rem', color: 'var(--fg)', marginBottom: '0.5rem' }}>
                {card.title}
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--fg-dim)', flex: 1, marginBottom: '1.5rem' }}>
                {card.desc}
              </p>
              <Link
                href={card.href}
                className="btn-ghost"
                style={{ alignSelf: 'flex-start', padding: '0.375rem 0.875rem', fontSize: '0.8125rem' }}
              >
                {card.linkText}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
