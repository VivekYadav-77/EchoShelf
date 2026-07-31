'use client';

import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@/features/analytics/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

// Monochromatic palette: shades of fg and one brick accent
const MONO_COLORS = [
  '#c0392b', // brick-highlight color
  '#888888',
  '#aaaaaa',
  '#cccccc',
  '#444444',
  '#666666',
  '#999999',
  '#bbbbbb',
];

const CHART_STYLE = {
  backgroundColor: 'var(--bg)',
  border: '1px solid var(--border)',
  borderRadius: 0,
  fontSize: '0.75rem',
  color: 'var(--fg)',
};

const AXIS_TICK = { fill: 'var(--fg-dim)', fontSize: 11 };
const GRID_STROKE = 'var(--border)';

function SectionHeading({ label, title }: { label: string; title: string }) {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <span
        className="wordmark"
        style={{
          display: 'block',
          fontSize: '0.7rem',
          letterSpacing: '0.12em',
          color: 'var(--brick)',
          marginBottom: '0.35rem',
        }}
      >
        {label}
      </span>
      <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--fg)' }}>{title}</h2>
    </div>
  );
}

export default function AnalyticsPage() {
  const { data: genres, isLoading: genresLoading } = useQuery({
    queryKey: ['analytics', 'genres'],
    queryFn: analyticsApi.getGenreDistribution,
  });

  const { data: years, isLoading: yearsLoading } = useQuery({
    queryKey: ['analytics', 'years'],
    queryFn: analyticsApi.getReleasesByYear,
  });

  const { data: artists, isLoading: artistsLoading } = useQuery({
    queryKey: ['analytics', 'artists'],
    queryFn: analyticsApi.getTopArtists,
  });

  const { data: ratings, isLoading: ratingsLoading } = useQuery({
    queryKey: ['analytics', 'ratings'],
    queryFn: analyticsApi.getRatingDistribution,
  });

  const { data: prices, isLoading: pricesLoading } = useQuery({
    queryKey: ['analytics', 'prices'],
    queryFn: analyticsApi.getPriceHistogram,
  });

  const isLoading = genresLoading || yearsLoading || artistsLoading || ratingsLoading || pricesLoading;

  if (isLoading) {
    return (
      <div className="rail" style={{ paddingTop: '3rem' }}>
        <p className="loading-text">Loading analytics...</p>
      </div>
    );
  }

  const hasData = genres?.length > 0;

  if (!hasData) {
    return (
      <div className="rail" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
        <p style={{ fontSize: '1.125rem', color: 'var(--fg-dim)', marginBottom: '0.5rem' }}>
          No data to analyze yet.
        </p>
        <p style={{ fontSize: '0.875rem', color: 'var(--fg-dim)' }}>
          Add some albums to your library to see analytics.
        </p>
      </div>
    );
  }

  return (
    <div className="rail" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>

      {/* Page heading */}
      <div
        style={{
          marginBottom: '3rem',
          paddingBottom: '1.5rem',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <h1
          className="wordmark"
          style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--fg)', letterSpacing: '-0.02em' }}
        >
          Analytics
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--fg-dim)', marginTop: '0.35rem' }}>
          Your library in numbers.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>

        {/* Genre Distribution */}
        <section>
          <SectionHeading label="01" title="Genre breakdown" />
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genres}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={110}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="label"
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {genres?.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={MONO_COLORS[index % MONO_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={CHART_STYLE} itemStyle={{ color: 'var(--fg)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <hr className="rule" style={{ marginTop: '2rem' }} />
        </section>

        {/* Release Timeline */}
        <section>
          <SectionHeading label="02" title="Release timeline" />
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={years} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c0392b" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#c0392b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
                <XAxis dataKey="label" tick={AXIS_TICK} axisLine={false} tickLine={false} />
                <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={CHART_STYLE} labelStyle={{ color: 'var(--brick)' }} />
                <Area type="monotone" dataKey="value" stroke="#c0392b" strokeWidth={2} fill="url(#areaGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <hr className="rule" style={{ marginTop: '2rem' }} />
        </section>

        {/* Top Artists */}
        <section>
          <SectionHeading label="03" title="Top artists" />
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={artists?.slice(0, 10)} layout="vertical" margin={{ top: 0, right: 20, left: 60, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} horizontal={false} />
                <XAxis type="number" tick={AXIS_TICK} axisLine={false} tickLine={false} allowDecimals={false} />
                <YAxis dataKey="label" type="category" tick={{ ...AXIS_TICK, fill: 'var(--fg)' }} axisLine={false} tickLine={false} width={60} />
                <Tooltip contentStyle={CHART_STYLE} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="value" fill="var(--fg-dim)" radius={0}>
                  {artists?.slice(0, 10).map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#c0392b' : 'var(--fg-dim)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <hr className="rule" style={{ marginTop: '2rem' }} />
        </section>

        {/* Ratings + Prices side by side */}
        <section>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
            <div>
              <SectionHeading label="04" title="Rating distribution" />
              <div style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ratings} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
                    <XAxis dataKey="label" tick={AXIS_TICK} axisLine={false} tickLine={false} />
                    <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip contentStyle={CHART_STYLE} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                    <Bar dataKey="value" fill="#c0392b" radius={0} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <SectionHeading label="05" title="Price histogram" />
              <div style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={prices} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
                    <XAxis dataKey="label" tick={AXIS_TICK} axisLine={false} tickLine={false} />
                    <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip contentStyle={CHART_STYLE} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                    <Bar dataKey="value" fill="var(--fg-dim)" radius={0} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
