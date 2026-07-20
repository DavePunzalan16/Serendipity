'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import FeedCard, { FeedItem } from '../../../components/social/FeedCard';

interface FeedResponse {
  items: FeedItem[];
  nextCursor: string | null;
}

function FeedSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-dark-gray/20 bg-surface p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-dark-gray/40" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-24 rounded bg-dark-gray/40" />
          <div className="h-2 w-16 rounded bg-dark-gray/30" />
        </div>
      </div>
      <div className="mb-3 space-y-2">
        <div className="h-3 w-full rounded bg-dark-gray/30" />
        <div className="h-3 w-4/5 rounded bg-dark-gray/30" />
        <div className="h-3 w-2/3 rounded bg-dark-gray/30" />
      </div>
      <div className="mb-3 flex gap-2">
        <div className="h-6 w-16 rounded-full bg-dark-gray/20" />
        <div className="h-6 w-20 rounded-full bg-dark-gray/20" />
      </div>
      <div className="flex gap-4">
        <div className="h-3 w-14 rounded bg-dark-gray/20" />
        <div className="h-3 w-14 rounded bg-dark-gray/20" />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <svg
        className="mb-6 h-16 w-16 text-primary/40"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
        />
      </svg>
      <h2 className="mb-2 font-display text-2xl text-white">No walks yet</h2>
      <p className="mb-6 max-w-sm font-body text-sm text-offwhite/70">
        Follow other wanderers to see their walks here
      </p>
      <Link
        href="/discover"
        className="rounded-full bg-primary px-6 py-3 font-body text-sm font-bold uppercase text-black transition-opacity hover:opacity-90"
      >
        Discover wanderers
      </Link>
    </div>
  );
}

export default function FeedPage() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const observerRef = useRef<HTMLDivElement | null>(null);

  const fetchFeed = useCallback(async (nextCursor?: string | null) => {
    try {
      const url = new URL('/api/feed', window.location.origin);
      if (nextCursor) {
        url.searchParams.set('cursor', nextCursor);
      }

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error('Failed to load feed');

      const data: FeedResponse = await res.json();

      setItems((prev) => (nextCursor ? [...prev, ...data.items] : data.items));
      setCursor(data.nextCursor);
      setHasMore(data.nextCursor !== null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
  }, []);

  // Initial load
  useEffect(() => {
    setIsLoading(true);
    fetchFeed().finally(() => setIsLoading(false));
  }, [fetchFeed]);

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    if (!hasMore || isLoading || isLoadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore && !isLoadingMore) {
          setIsLoadingMore(true);
          fetchFeed(cursor).finally(() => setIsLoadingMore(false));
        }
      },
      { rootMargin: '200px' }
    );

    const el = observerRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
      observer.disconnect();
    };
  }, [hasMore, isLoading, isLoadingMore, cursor, fetchFeed]);

  const handleLikeToggle = useCallback(async (walkId: string, liked: boolean) => {
    try {
      await fetch(`/api/walk/${walkId}/like`, {
        method: liked ? 'POST' : 'DELETE',
      });
    } catch {
      // Optimistic UI — revert on failure would be a future enhancement
    }
  }, []);

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 font-display text-4xl text-white">Feed</h1>

      {/* Loading state */}
      {isLoading && (
        <div className="space-y-4">
          <FeedSkeleton />
          <FeedSkeleton />
          <FeedSkeleton />
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center">
          <p className="font-body text-sm text-red-300">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setIsLoading(true);
              fetchFeed().finally(() => setIsLoading(false));
            }}
            className="mt-3 font-body text-sm font-semibold text-primary hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && items.length === 0 && <EmptyState />}

      {/* Feed items */}
      {!isLoading && items.length > 0 && (
        <div className="space-y-4">
          {items.map((item) => (
            <FeedCard key={item.id} item={item} onLikeToggle={handleLikeToggle} />
          ))}

          {/* Load-more sentinel */}
          {hasMore && (
            <div ref={observerRef} className="py-4">
              {isLoadingMore && <FeedSkeleton />}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
