'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { PageContainer } from '@/components/layout';
import { DiscoverFilters, WalkPreviewCard, WalkThisRouteButton } from '@/components/discover';
import { MapPlaceholder } from '@/components/walk';
import type { VibeTag, WalkMapItem } from '@wander/shared-types';

// Placeholder discover walks
const PLACEHOLDER_WALKS: WalkMapItem[] = [
  {
    id: 'disc-1',
    title: 'Riverside Arts Trail',
    latitude: 40.7128,
    longitude: -74.006,
    duration_minutes: 40,
    distance_km: 2.8,
    like_count: 34,
    vibe_tags: ['artsy', 'scenic'] as VibeTag[],
    user: { username: 'artsy_alex', display_name: 'Alex Rivera', avatar_url: '/img/WandererIcon.png' },
  },
  {
    id: 'disc-2',
    title: 'Hidden Cafés Loop',
    latitude: 40.7282,
    longitude: -73.7949,
    duration_minutes: 30,
    distance_km: 1.9,
    like_count: 52,
    vibe_tags: ['cozy', 'foodie'] as VibeTag[],
    user: { username: 'wanderlust_maya', display_name: 'Maya Chen', avatar_url: '/img/WandererIcon.png' },
  },
  {
    id: 'disc-3',
    title: 'Night Market Wander',
    latitude: 40.758,
    longitude: -73.9855,
    duration_minutes: 55,
    distance_km: 3.2,
    like_count: 28,
    vibe_tags: ['nightlife', 'foodie'] as VibeTag[],
    user: { username: 'urban_nomad', display_name: 'Jordan Lee', avatar_url: '/img/WandererIcon.png' },
  },
  {
    id: 'disc-4',
    title: 'Historic Quarter Walk',
    latitude: 40.7061,
    longitude: -74.009,
    duration_minutes: 60,
    distance_km: 4.1,
    like_count: 19,
    vibe_tags: ['historic', 'scenic'] as VibeTag[],
    user: { username: 'history_buff', display_name: 'Sam Park', avatar_url: '/img/WandererIcon.png' },
  },
  {
    id: 'disc-5',
    title: 'Urban Nature Escape',
    latitude: 40.7831,
    longitude: -73.9712,
    duration_minutes: 45,
    distance_km: 3.5,
    like_count: 41,
    vibe_tags: ['nature', 'adventure'] as VibeTag[],
    user: { username: 'green_walker', display_name: 'Kai Nakamura', avatar_url: '/img/WandererIcon.png' },
  },
  {
    id: 'disc-6',
    title: 'Street Art Safari',
    latitude: 40.6892,
    longitude: -73.9857,
    duration_minutes: 35,
    distance_km: 2.2,
    like_count: 63,
    vibe_tags: ['artsy', 'urban'] as VibeTag[],
    user: { username: 'artsy_alex', display_name: 'Alex Rivera', avatar_url: '/img/WandererIcon.png' },
  },
] as WalkMapItem[];

export default function DiscoverPage() {
  const router = useRouter();
  const [selectedVibe, setSelectedVibe] = useState<VibeTag | null>(null);
  const [sort, setSort] = useState<'recent' | 'popular'>('popular');
  const [radiusKm, setRadiusKm] = useState(10);
  const [selectedWalk, setSelectedWalk] = useState<string | null>(null);

  const filteredWalks = selectedVibe
    ? PLACEHOLDER_WALKS.filter((w) => w.vibe_tags.includes(selectedVibe))
    : PLACEHOLDER_WALKS;

  const handleWalkRoute = useCallback(
    (walkId: string) => {
      router.push(`/walk/${walkId}`);
    },
    [router]
  );

  return (
    <PageContainer className="py-12">
      <h1 className="mb-2 font-display text-5xl tracking-tight text-white md:text-6xl">
        Discover
      </h1>
      <p className="mb-8 font-body text-base text-offwhite/70">
        Find walks near you curated by the community.
      </p>

      {/* Map placeholder */}
      <MapPlaceholder height="h-56 md:h-72" className="mb-8" />

      {/* Filters */}
      <DiscoverFilters
        selectedVibe={selectedVibe}
        onVibeChange={setSelectedVibe}
        sort={sort}
        onSortChange={setSort}
        radiusKm={radiusKm}
        onRadiusChange={setRadiusKm}
        className="mb-8"
      />

      {/* Walk grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredWalks.map((walk) => (
          <div key={walk.id} className="flex flex-col gap-3">
            <div
              className="cursor-pointer"
              onClick={() => setSelectedWalk(walk.id === selectedWalk ? null : walk.id)}
            >
              <WalkPreviewCard walk={walk} />
            </div>
            {selectedWalk === walk.id && (
              <WalkThisRouteButton walkId={walk.id} onClick={handleWalkRoute} />
            )}
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
