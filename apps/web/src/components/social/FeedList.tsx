'use client';

import { useEffect, useRef, useCallback, type ReactNode } from 'react';

/**
 * FeedList — Wrapper with infinite scroll logic for the social feed.
 * Triggers onLoadMore when the user scrolls near the bottom.
 */
export interface FeedListProps {
  children: ReactNode;
  onLoadMore: () => void;
  hasMore: boolean;
  loading?: boolean;
  className?: string;
}

export default function FeedList({
  children,
  onLoadMore,
  hasMore,
  loading = false,
  className = '',
}: FeedListProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !loading) {
        onLoadMore();
      }
    },
    [hasMore, loading, onLoadMore]
  );

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin: '200px',
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [handleIntersection]);

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {children}

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center py-6">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}

      {/* Intersection observer sentinel */}
      {hasMore && <div ref={sentinelRef} className="h-1" aria-hidden="true" />}
    </div>
  );
}
