'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { libraryApi } from '@/features/library/api';

function StarRating({
  rating,
  editable = false,
  onChange,
}: {
  rating: number;
  editable?: boolean;
  onChange?: (n: number) => void;
}) {
  return (
    <span style={{ letterSpacing: '0.05em', fontSize: '1rem', cursor: editable ? 'pointer' : 'default' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => editable && onChange?.(star)}
          style={{
            color: star <= rating ? 'var(--fg)' : 'var(--border)',
            transition: 'color 0.1s ease',
          }}
        >
          ★
        </span>
      ))}
    </span>
  );
}

export default function LibraryPage() {
  const queryClient = useQueryClient();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [editRating, setEditRating] = useState<number>(0);
  const [editNotes, setEditNotes] = useState<string>('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['library'],
    queryFn: () => libraryApi.getLibrary(0, 50),
  });

  const deleteMutation = useMutation({
    mutationFn: libraryApi.deleteLibraryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['library'] });
      setDeleteConfirmId(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: any }) =>
      libraryApi.updateLibraryItem(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['library'] });
      setExpandedId(null);
    },
  });

  const handleExpand = (item: any) => {
    if (expandedId === item.id) {
      setExpandedId(null);
    } else {
      setExpandedId(item.id);
      setEditRating(item.userRating || 0);
      setEditNotes(item.userNotes || '');
    }
  };

  const handleSave = (id: number) => {
    updateMutation.mutate({ id, updates: { userRating: editRating, userNotes: editNotes } });
  };

  return (
    <div className="rail" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>

      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: '2.5rem',
          paddingBottom: '1.5rem',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <h1
          className="wordmark"
          style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--fg)', letterSpacing: '-0.02em' }}
        >
          Library
        </h1>
        {data?.content && (
          <span
            style={{
              fontSize: '0.75rem',
              color: 'var(--fg-dim)',
              fontFamily: 'var(--font-mono), monospace',
              letterSpacing: '0.06em',
            }}
          >
            {data.content.length} albums
          </span>
        )}
      </div>

      {/* Loading */}
      {isLoading && <p className="loading-text">Loading library...</p>}

      {/* Empty state */}
      {!isLoading && data?.content?.length === 0 && (
        <div style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
          <p style={{ fontSize: '1.125rem', color: 'var(--fg-dim)', marginBottom: '0.5rem' }}>
            Your library is empty.
          </p>
          <p style={{ fontSize: '0.875rem', color: 'var(--fg-dim)' }}>
            Use the Search page to find and save albums.
          </p>
        </div>
      )}

      {/* Column headers */}
      {!isLoading && data?.content && data.content.length > 0 && (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '48px 1fr 1fr auto auto',
              gap: '1rem',
              alignItems: 'center',
              padding: '0 0 0.75rem',
              borderBottom: '1px solid var(--border)',
              marginBottom: '0',
            }}
          >
            {['', 'Album', 'Artist', 'Rating', ''].map((col, i) => (
              <span
                key={i}
                style={{
                  fontSize: '0.7rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--fg-dim)',
                  fontFamily: 'var(--font-mono), monospace',
                }}
              >
                {col}
              </span>
            ))}
          </div>

          {/* Rows */}
          {data.content.map((item: any) => (
            <div key={item.id}>
              {/* Main row */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '48px 1fr 1fr auto auto',
                  gap: '1rem',
                  alignItems: 'center',
                  padding: '0.875rem 0',
                  borderBottom: '1px solid var(--border)',
                  cursor: 'pointer',
                }}
                onClick={() => handleExpand(item)}
              >
                {/* Thumbnail */}
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    flexShrink: 0,
                    overflow: 'hidden',
                    backgroundColor: 'var(--border)',
                  }}
                >
                  {item.artworkUrl ? (
                    <img
                      src={item.artworkUrl.replace('100x100', '200x200')}
                      alt={item.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  ) : null}
                </div>

                {/* Title */}
                <span
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: 'var(--fg)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.title}
                </span>

                {/* Artist */}
                <span
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--fg-dim)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.artistName}
                </span>

                {/* Rating */}
                <StarRating rating={item.userRating || 0} />

                {/* Expand indicator */}
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--fg-dim)',
                    fontFamily: 'var(--font-mono), monospace',
                    userSelect: 'none',
                  }}
                >
                  {expandedId === item.id ? '−' : '+'}
                </span>
              </div>

              {/* Expanded edit/detail row */}
              {expandedId === item.id && (
                <div
                  style={{
                    borderBottom: '1px solid var(--border)',
                    padding: '1.25rem 0 1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.25rem',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Rating edit */}
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.7rem',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: 'var(--fg-dim)',
                        fontFamily: 'var(--font-mono), monospace',
                        marginBottom: '0.5rem',
                      }}
                    >
                      Rating
                    </label>
                    <StarRating rating={editRating} editable onChange={setEditRating} />
                  </div>

                  {/* Notes edit */}
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.7rem',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: 'var(--fg-dim)',
                        fontFamily: 'var(--font-mono), monospace',
                        marginBottom: '0.5rem',
                      }}
                    >
                      Notes
                    </label>
                    <textarea
                      rows={2}
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      placeholder="What do you think of this album?"
                      style={{
                        width: '100%',
                        background: 'transparent',
                        color: 'var(--fg)',
                        border: 'none',
                        borderBottom: '1px solid var(--border)',
                        padding: '0.5rem 0',
                        fontSize: '0.875rem',
                        outline: 'none',
                        resize: 'none',
                        fontFamily: 'var(--font-inter), sans-serif',
                      }}
                    />
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <button
                      onClick={() => handleSave(item.id)}
                      disabled={updateMutation.isPending}
                      className="btn-brick"
                      style={{ padding: '0.375rem 1rem', fontSize: '0.8125rem' }}
                    >
                      {updateMutation.isPending ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => setExpandedId(null)}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '0.8125rem',
                        color: 'var(--fg-dim)',
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    >
                      Cancel
                    </button>

                    {/* Delete — inline confirm */}
                    {deleteConfirmId === item.id ? (
                      <span style={{ marginLeft: 'auto', fontSize: '0.8125rem', color: 'var(--fg-dim)' }}>
                        Remove?{' '}
                        <button
                          onClick={() => deleteMutation.mutate(item.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '0.8125rem',
                            color: 'var(--brick)',
                            cursor: 'pointer',
                            padding: 0,
                            fontWeight: 600,
                          }}
                        >
                          Yes
                        </button>
                        {' / '}
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '0.8125rem',
                            color: 'var(--fg-dim)',
                            cursor: 'pointer',
                            padding: 0,
                          }}
                        >
                          No
                        </button>
                      </span>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(item.id)}
                        style={{
                          marginLeft: 'auto',
                          background: 'none',
                          border: 'none',
                          fontSize: '0.8125rem',
                          color: 'var(--fg-dim)',
                          cursor: 'pointer',
                          padding: 0,
                          transition: 'color 0.15s ease',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--brick)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--fg-dim)')}
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {/* Existing notes display */}
                  {item.userNotes && expandedId !== item.id && (
                    <p
                      className="accent-block"
                      style={{ fontSize: '0.875rem', color: 'var(--fg-dim)', fontStyle: 'italic' }}
                    >
                      {item.userNotes}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
