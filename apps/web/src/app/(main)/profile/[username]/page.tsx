'use client';

import { useState, useCallback } from 'react';
import { PageContainer } from '@/components/layout';
import { ProfileHeader, ProfileStats, WalkGrid, FollowButton } from '@/components/social';
import { ProfileBadgeGrid, LevelProgressBar } from '@/components/gamification';
import type { Profile, Walk, Badge } from '@wander/shared-types';

// Placeholder profile data
const PLACEHOLDER_PROFILE: Profile = {
  id: 'user-001',
  username: 'wanderlust_maya',
  display_name: 'Maya Chen',
  avatar_url: '/img/WandererIcon.png',
  bio: 'Urban explorer and coffee enthusiast. Always looking for hidden corners and cozy spots in the city.',
  favorite_vibes: ['cozy', 'hidden-gems', 'foodie'],
  created_at: '2024-01-15',
} as Profile;

const PLACEHOLDER_WALKS: Walk[] = [
  {
    id: 'w1',
    title: 'Morning Coffee Trail',
    narrative: 'A peaceful morning walk through the café district, discovering artisan roasters and quiet courtyards.',
    duration_minutes: 30,
    distance_km: 2.1,
    like_count: 18,
    vibe_tags: ['cozy', 'foodie'],
  },
  {
    id: 'w2',
    title: 'Sunset Bridge Walk',
    narrative: 'Following the river path as the sun dips below the skyline. Golden hour magic everywhere.',
    duration_minutes: 45,
    distance_km: 3.4,
    like_count: 32,
    vibe_tags: ['scenic', 'urban'],
  },
  {
    id: 'w3',
    title: 'Bookshop Crawl',
    narrative: 'Five independent bookshops in one walk. Each with its own character and hidden reading nooks.',
    duration_minutes: 55,
    distance_km: 2.8,
    like_count: 27,
    vibe_tags: ['cozy', 'hidden-gems'],
  },
  {
    id: 'w4',
    title: 'Market Morning',
    narrative: 'Fresh produce, street food, and local artisans. The weekend market is alive with color and flavor.',
    duration_minutes: 40,
    distance_km: 1.9,
    like_count: 41,
    vibe_tags: ['foodie', 'urban'],
  },
  {
    id: 'w5',
    title: 'Garden District',
    narrative: 'Winding through community gardens and pocket parks. A green escape in the heart of the city.',
    duration_minutes: 35,
    distance_km: 2.5,
    like_count: 15,
    vibe_tags: ['nature', 'cozy'],
  },
  {
    id: 'w6',
    title: 'Mural Alley',
    narrative: 'Discovering vibrant murals hidden in narrow alleys. Each turn reveals a new masterpiece.',
    duration_minutes: 25,
    distance_km: 1.6,
    like_count: 23,
    vibe_tags: ['artsy', 'urban'],
  },
] as Walk[];

const PLACEHOLDER_BADGES: Badge[] = [
  { id: 'b1', name: 'First Steps', icon_url: '/img/WandererIcon.png', description: 'Complete your first walk' },
  { id: 'b2', name: 'Explorer', icon_url: '/img/WandererIcon.png', description: '10 walks completed' },
  { id: 'b3', name: 'Social Butterfly', icon_url: '/img/WandererIcon.png', description: '50 likes received' },
  { id: 'b4', name: 'Night Owl', icon_url: '/img/WandererIcon.png', description: '5 nighttime walks' },
  { id: 'b5', name: 'Trailblazer', icon_url: '/img/WandererIcon.png', description: 'Walk 50km total' },
] as Badge[];

export default function ProfilePage() {
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollowToggle = useCallback(async (following: boolean) => {
    // Would call API in production
    await new Promise((r) => setTimeout(r, 500));
  }, []);

  return (
    <PageContainer className="py-12">
      {/* Profile header */}
      <ProfileHeader profile={PLACEHOLDER_PROFILE} className="mb-6" />

      {/* Follow button */}
      <div className="mb-8 flex justify-center">
        <FollowButton isFollowing={isFollowing} onToggle={handleFollowToggle} />
      </div>

      {/* Level progress */}
      <LevelProgressBar
        currentXP={720}
        nextLevelXP={1000}
        level={7}
        className="mx-auto mb-8 max-w-md"
      />

      {/* Stats */}
      <ProfileStats
        totalWalks={42}
        totalDistanceKm={128.5}
        followerCount={234}
        followingCount={89}
        className="mb-10"
      />

      {/* Badges section */}
      <section className="mb-10">
        <h2 className="mb-4 font-display text-3xl text-white">Badges</h2>
        <ProfileBadgeGrid earnedBadges={PLACEHOLDER_BADGES} />
      </section>

      {/* Walks section */}
      <section>
        <h2 className="mb-4 font-display text-3xl text-white">Walks</h2>
        <WalkGrid walks={PLACEHOLDER_WALKS} />
      </section>
    </PageContainer>
  );
}
