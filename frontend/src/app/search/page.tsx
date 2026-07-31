'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { searchApi } from '@/features/search/api';
import { libraryApi } from '@/features/library/api';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [searchTrigger, setSearchTrigger] = useState('');
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['search', searchTrigger],
    queryFn: () => searchApi.searchAlbums(searchTrigger),
    enabled: searchTrigger.length > 0,
  });

  const saveMutation = useMutation({
    mutationFn: libraryApi.saveToLibrary,
    onSuccess: (_data, variables: any) => {
      queryClient.invalidateQueries({ queryKey: ['library'] });
      setSavedIds(prev => new Set(prev).add(variables.appleCatalogId));
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to add to library');
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchTrigger(query.trim());
    }
  };

  const handleSave = (album: any) => {
    saveMutation.mutate({
      appleCatalogId: album.collectionId,
      title: album.collectionName,
      artistName: album.artistName,
      genre: album.primaryGenreName,
      releaseDate: album.releaseDate ? album.releaseDate.split('T')[0] : null,
      trackCount: album.trackCount,
      artworkUrl: album.artworkUrl100,
      collectionPrice: album.collectionPrice,
    });
  };

  return (
    <div className="rail" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>

      {/* Search form-input as hero */}
      <form onSubmit={handleSearch} style={{ marginBottom: '3rem' }}>
        <div style={{ position: 'relative' }}>
          <input
            id="search-input"
            type="text"
            placeholder="Search albums or artists..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: '100%',
              background: 'transparent',
              color: 'var(--fg)',
              border: 'none',
              borderBottom: '1px solid var(--border)',
              padding: '1rem 6rem 1rem 0',
              fontSize: 'clamp(1.25rem, 3vw, 2rem)',
              fontFamily: 'var(--font-inter), sans-serif',
              outline: 'none',
              transition: 'border-color 0.15s ease',
            }}
            onFocus={e => (e.currentTarget.style.borderBottomColor = 'var(--fg)')}
            onBlur={e => (e.currentTarget.style.borderBottomColor = 'var(--border)')}
          />
          <button
            id="search-submit"
            type="submit"
            className="btn-brick"
            style={{
              position: 'absolute',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              padding: '0.5rem 1.25rem',
              fontSize: '0.8125rem',
            }}
          >
            Search
          </button>
        </div>
      </form>

      {/* States */}
      {isLoading && (
        <p className="loading-text">Searching...</p>
      )}

      {isError && (
        <p style={{ fontSize: '0.875rem', color: 'var(--brick)' }}>
          Search failed. Please try again.
        </p>
      )}

      {data?.results?.length === 0 && (
        <p style={{ fontSize: '0.875rem', color: 'var(--fg-dim)' }}>
          No albums found for &ldquo;{searchTrigger}&rdquo;.
        </p>
      )}

      {/* Results grid */}
      {data?.results && data.results.length > 0 && (
        <>
          <p
            style={{
              fontSize: '0.75rem',
              color: 'var(--fg-dim)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-mono), monospace',
              marginBottom: '1.5rem',
            }}
          >
            {data.results.length} results for &ldquo;{searchTrigger}&rdquo;
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: '1px',
              border: '1px solid var(--border)',
            }}
          >
            {data.results.map((album: any) => {
              const isSaved = savedIds.has(album.collectionId);
              return (
                <div
                  key={album.collectionId}
                  style={{
                    backgroundColor: 'var(--bg)',
                    borderRight: '1px solid var(--border)',
                    borderBottom: '1px solid var(--border)',
                    overflow: 'hidden',
                  }}
                >
                  {/* Artwork */}
                  <div style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden' }}>
                    {album.artworkUrl100 ? (
                      <img
                        src={album.artworkUrl100.replace('100x100', '400x400')}
                        alt={album.collectionName}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          backgroundColor: 'var(--border)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <span style={{ fontSize: '0.75rem', color: 'var(--fg-dim)' }}>No art</span>
                      </div>
                    )}
                  </div>

                  {/* Meta */}
                  <div style={{ padding: '0.75rem' }}>
                    <p
                      style={{
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        color: 'var(--fg)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        marginBottom: '0.2rem',
                      }}
                      title={album.collectionName}
                    >
                      {album.collectionName}
                    </p>
                    <p
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--fg-dim)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        marginBottom: '0.5rem',
                      }}
                      title={album.artistName}
                    >
                      {album.artistName}
                    </p>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderTop: '1px solid var(--border)',
                        paddingTop: '0.5rem',
                      }}
                    >
                      <span style={{ fontSize: '0.7rem', color: 'var(--fg-dim)' }}>
                        {album.releaseDate?.substring(0, 4)}
                      </span>
                      <button
                        onClick={() => !isSaved && handleSave(album)}
                        disabled={isSaved || saveMutation.isPending}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: isSaved ? 'default' : 'pointer',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          color: isSaved ? 'var(--fg-dim)' : 'var(--brick)',
                          padding: 0,
                          transition: 'opacity 0.15s ease',
                        }}
                      >
                        {isSaved ? 'Saved' : '+ Add'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
