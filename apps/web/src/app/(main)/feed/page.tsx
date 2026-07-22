'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { PageContainer } from '@/components/layout';
import { FeedList, FeedCard, FeedEmptyState, LikeButton } from '@/components/social';
import type { FeedItem } from '@/components/social';

// Placeholder data so the page looks real
const PLACEHOLDER_ITEMS: FeedItem[] = [
  {
    id: '1',
    walkId: 'walk-001',
    user: { username: 'wanderlust_maya', avatarUrl: '/img/WandererIcon.png' },
    narrative:
      'Stumbled upon a hidden courtyard garden tucked behind the old bookshop on Elm Street. The ivy-covered walls and vintage wrought-iron bench made it feel like stepping into a secret world.',
    vibeTags: ['hidden-gems', 'cozy'],
    stats: { distance: '2.4 km', duration: '35 min' },
    likeCount: 24,
    commentCount: 5,
    isLiked: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '2',
    walkId: 'walk-002',
    user: { username: 'urban_nomad', avatarUrl: '/img/WandererIcon.png' },
    narrative:
      'The sunset over the river bridge was unreal tonight. Watched the light shift from amber to deep violet while street musicians played something jazzy in the distance.',
    vibeTags: ['scenic', 'nightlife'],
    stats: { distance: '3.1 km', duration: '45 min' },
    likeCount: 42,
    commentCount: 8,
    isLiked: true,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: '3',
    walkId: 'walk-003',
    user: { username: 'artsy_alex', avatarUrl: '/img/WandererIcon.png' },
    narrative:
      'Found three new murals in the warehouse district. The largest one spans an entire building facade — a giant phoenix in neon colors. The artist was still working on details when I passed.',
    vibeTags: ['artsy', 'urban'],
    stats: { distance: '1.8 km', duration: '25 min' },
    likeCount: 18,
    commentCount: 3,
    isLiked: false,
    createdAt: new Date(Date.now() - 18000000).toISOString(),
  },
];

export default function FeedPage() {
  const router = useRouter();
  const [items] = useState<FeedItem[]>(PLACEHOLDER_ITEMS);
  const [loading, setLoading] = useState(false);
  const [hasMore] = useState(false);

  const handleLoadMore = useCallback(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const handleLikeToggle = useCallback(async (walkId: string, liked: boolean) => {
    // Optimistic — would call API in production
  }, []);

  const handleDiscover = useCallback(() => {
    router.push('/discover');
  }, [router]);

  return (
    <PageContainer className="py-12">
      <h1 className="mb-8 font-display text-5xl tracking-tight text-white md:text-6xl">
        Feed
      </h1>

      {items.length === 0 ? (
        <FeedEmptyState onDiscover={handleDiscover} />
      ) : (
        <div className="mx-auto max-w-lg">
          <FeedList onLoadMore={handleLoadMore} hasMore={hasMore} loading={loading}>
            {items.map((item) => (
              <FeedCard key={item.id} item={item} onLikeToggle={handleLikeToggle} />
            ))}
          </FeedList>
        </div>
      )}
    </PageContainer>
  );
}
