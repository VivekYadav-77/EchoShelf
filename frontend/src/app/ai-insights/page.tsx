'use client';

import { useQuery } from '@tanstack/react-query';
import { aiApi } from '@/features/ai/api';

function RefreshIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

export default function AiInsightsPage() {
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['ai', 'summary'],
    queryFn: aiApi.getLibrarySummary,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="rail" style={{ paddingTop: '3rem' }}>
        <p className="loading-text">Analyzing your library...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rail" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
        <p style={{ fontSize: '1.125rem', color: 'var(--fg)', marginBottom: '0.5rem' }}>
          Analysis failed.
        </p>
        <p style={{ fontSize: '0.875rem', color: 'var(--fg-dim)', marginBottom: '1.5rem' }}>
          Make sure you have albums in your library, then try again.
        </p>
        <button
          onClick={() => refetch()}
          className="btn-ghost"
          style={{ fontSize: '0.8125rem', padding: '0.5rem 1.25rem' }}
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="rail" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>

      {/* Page heading */}
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: '3rem',
          paddingBottom: '1.5rem',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div>
          <h1
            className="wordmark"
            style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--fg)', letterSpacing: '-0.02em' }}
          >
            AI Insights
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--fg-dim)', marginTop: '0.35rem' }}>
            Personalized analysis of your music identity.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          title="Refresh analysis"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'none',
            border: 'none',
            fontSize: '0.75rem',
            letterSpacing: '0.06em',
            color: 'var(--fg-dim)',
            cursor: isFetching ? 'not-allowed' : 'pointer',
            padding: 0,
            transition: 'color 0.15s ease',
            fontFamily: 'var(--font-mono), monospace',
            textTransform: 'uppercase',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--fg)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--fg-dim)')}
        >
          <RefreshIcon />
          {isFetching ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Music profile summary */}
      <section style={{ marginBottom: '4rem' }}>
        <span
          className="wordmark"
          style={{
            display: 'block',
            fontSize: '0.7rem',
            letterSpacing: '0.12em',
            color: 'var(--brick)',
            marginBottom: '1rem',
          }}
        >
          01-Your music profile
        </span>

        <div
          className="accent-block"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {data?.summary
            ?.split('\n')
            .filter((p: string) => p.trim())
            .map((paragraph: string, idx: number) => (
              <p
                key={idx}
                style={{
                  fontSize: '1rem',
                  lineHeight: 1.75,
                  color: 'var(--fg)',
                }}
              >
                {paragraph}
              </p>
            ))}
        </div>
      </section>

      {/* Recommendations */}
      {data?.recommendations && data.recommendations.length > 0 && (
        <section>
          <span
            className="wordmark"
            style={{
              display: 'block',
              fontSize: '0.7rem',
              letterSpacing: '0.12em',
              color: 'var(--brick)',
              marginBottom: '1.5rem',
            }}
          >
            02-Recommended for you
          </span>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {data.recommendations.map((rec: any, idx: number) => (
              <div
                key={idx}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.5rem 1fr',
                  gap: '1.25rem',
                  alignItems: 'start',
                  padding: '1.25rem 0',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                <span
                  className="wordmark"
                  style={{
                    fontSize: '0.7rem',
                    color: 'var(--fg-dim)',
                    letterSpacing: '0.06em',
                    paddingTop: '0.2rem',
                  }}
                >
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <div>
                  <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--fg)', marginBottom: '0.15rem' }}>
                    {rec.title}
                  </p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--fg-dim)', marginBottom: '0.75rem' }}>
                    {rec.artist}
                  </p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--fg-dim)', lineHeight: 1.6 }}>
                    {rec.reason}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
