'use client';

import { useState, useCallback } from 'react';
import { PageContainer } from '@/components/layout';
import { MapPlaceholder, StopList, NarrativeBanner, ProgressBar } from '@/components/walk';
import { CommentThread, LikeButton } from '@/components/social';
import type { Stop, Comment } from '@wander/shared-types';

// Placeholder stops
const PLACEHOLDER_STOPS: Stop[] = [
  {
    id: 's1',
    order_index: 0,
    title: 'Artisan Coffee House',
    description: 'A cozy third-wave café tucked beneath a canopy of wisteria. Try the oat milk flat white.',
    latitude: 40.7128,
    longitude: -74.006,
    visited: true,
  },
  {
    id: 's2',
    order_index: 1,
    title: 'The Secret Garden',
    description: 'Push through the unassuming iron gate to find a lush community garden with vintage benches.',
    latitude: 40.714,
    longitude: -74.007,
    visited: true,
  },
  {
    id: 's3',
    order_index: 2,
    title: 'Sunset Bridge Viewpoint',
    description: 'The best vantage point for watching the sun set over the city skyline. Arrive early for golden hour.',
    latitude: 40.715,
    longitude: -74.009,
    visited: false,
  },
  {
    id: 's4',
    order_index: 3,
    title: 'Vinyl Records & Vintage',
    description: 'A treasure trove of rare records and retro finds. The owner plays jazz on Saturday afternoons.',
    latitude: 40.716,
    longitude: -74.004,
    visited: false,
  },
] as Stop[];

// Placeholder comments
const PLACEHOLDER_COMMENTS: Comment[] = [
  {
    id: 'c1',
    user: { username: 'urban_nomad', avatar_url: '/img/WandererIcon.png', display_name: 'Jordan Lee' },
    text: 'This walk was incredible! The secret garden stop is an absolute gem.',
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'c2',
    user: { username: 'artsy_alex', avatar_url: '/img/WandererIcon.png', display_name: 'Alex Rivera' },
    text: 'Did this last weekend — the coffee house has the best pastries too!',
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
] as Comment[];

export default function WalkDetailPage() {
  const [comments, setComments] = useState<Comment[]>(PLACEHOLDER_COMMENTS);
  const visitedCount = PLACEHOLDER_STOPS.filter((s) => s.visited).length;

  const handleCommentSubmit = useCallback(async (text: string) => {
    const newComment: Comment = {
      id: `c${Date.now()}`,
      user: { username: 'you', avatar_url: '/img/WandererIcon.png', display_name: 'You' },
      text,
      created_at: new Date().toISOString(),
    } as Comment;
    setComments((prev) => [...prev, newComment]);
  }, []);

  const handleLikeToggle = useCallback((liked: boolean) => {
    // Would call API in production
  }, []);

  return (
    <PageContainer className="py-12">
      {/* Walk title & like */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-4xl tracking-tight text-white md:text-5xl">
            Hidden Gems of Riverside
          </h1>
          <p className="mt-1 font-body text-sm text-offwhite/60">
            by @wanderlust_maya · 2.4 km · 35 min
          </p>
        </div>
        <LikeButton liked={false} count={24} onToggle={handleLikeToggle} />
      </div>

      {/* Narrative */}
      <NarrativeBanner
        narrative="A curated stroll through quiet alleyways and charming spots along the waterfront. Discover vintage shops, cozy cafés, and a park overlook with panoramic views. Each stop was chosen to give you a moment of surprise — from the ivy-covered garden hidden behind an iron gate to the record shop that still plays vinyl on weekend afternoons."
        className="mb-8"
      />

      {/* Map */}
      <MapPlaceholder height="h-48 md:h-64" className="mb-8" />

      {/* Progress */}
      <ProgressBar visited={visitedCount} total={PLACEHOLDER_STOPS.length} className="mb-8" />

      {/* Stops */}
      <section className="mb-10">
        <h2 className="mb-4 font-display text-2xl text-white">Stops</h2>
        <StopList stops={PLACEHOLDER_STOPS} />
      </section>

      {/* Comments */}
      <section id="comments">
        <h2 className="mb-4 font-display text-2xl text-white">Comments</h2>
        <CommentThread comments={comments} onSubmitComment={handleCommentSubmit} />
      </section>
    </PageContainer>
  );
}
