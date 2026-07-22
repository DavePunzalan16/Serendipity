import { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ProfileHeader, ProfileStats, WalkGrid, FollowButton } from '../../src/components/social';
import { ProfileBadgeGrid } from '../../src/components/gamification';
import type { Profile, Walk, VibeTag } from '@wander/shared-types';
import type { BadgeItem } from '../../src/components/gamification/ProfileBadgeGrid';

const MOCK_PUBLIC_PROFILE: Profile = {
  id: 'user-kate',
  username: 'wanderer_kate',
  display_name: 'Kate Wanderer',
  bio: 'Finding beauty in forgotten corners. Street art enthusiast, café collector, and sunset chaser.',
  avatar_url: null,
  created_at: '2024-03-01T00:00:00Z',
  follower_count: 312,
  following_count: 148,
  total_walks: 89,
  total_distance_km: 245.6,
  favorite_vibes: ['artsy', 'urban', 'hidden-gems'] as VibeTag[],
  badges: [],
};

const MOCK_WALKS: Walk[] = [
  {
    id: 'kate-w1',
    user_id: 'user-kate',
    title: 'Street Art Safari',
    narrative: 'A vibrant crawl through the best murals in the downtown area.',
    visibility: 'public',
    duration_minutes: 50,
    distance_km: 2.8,
    vibe_tags: ['artsy', 'urban'] as VibeTag[],
    stops: [],
    photos: [{ id: 'pk1', walk_id: 'kate-w1', stop_id: null, storage_path: '/walks/kate-w1/pk1.jpg', url: 'https://picsum.photos/200/150?random=20', captured_at: '2024-12-16T10:00:00Z' }],
    route_geometry: { type: 'LineString', coordinates: [[-74.006, 40.7128], [-74.002, 40.715]] },
    start_point: { type: 'Point', coordinates: [-74.006, 40.7128] },
    like_count: 45,
    comment_count: 12,
    created_at: '2024-12-16T10:00:00Z',
    completed_at: '2024-12-16T10:50:00Z',
  },
  {
    id: 'kate-w2',
    user_id: 'user-kate',
    title: 'Sunset Pier Walk',
    narrative: 'Golden hour reflections along the waterfront boardwalk.',
    visibility: 'public',
    duration_minutes: 35,
    distance_km: 1.9,
    vibe_tags: ['scenic', 'cozy'] as VibeTag[],
    stops: [],
    photos: [{ id: 'pk2', walk_id: 'kate-w2', stop_id: null, storage_path: '/walks/kate-w2/pk2.jpg', url: 'https://picsum.photos/200/150?random=21', captured_at: '2024-12-14T17:00:00Z' }],
    route_geometry: { type: 'LineString', coordinates: [[-74.006, 40.7128], [-74.001, 40.716]] },
    start_point: { type: 'Point', coordinates: [-74.006, 40.7128] },
    like_count: 67,
    comment_count: 8,
    created_at: '2024-12-14T17:00:00Z',
    completed_at: '2024-12-14T17:35:00Z',
  },
  {
    id: 'kate-w3',
    user_id: 'user-kate',
    title: 'Hidden Bookshops',
    narrative: 'A literary wander through independent bookstores and reading corners.',
    visibility: 'public',
    duration_minutes: 60,
    distance_km: 3.2,
    vibe_tags: ['cozy', 'hidden-gems'] as VibeTag[],
    stops: [],
    photos: [{ id: 'pk3', walk_id: 'kate-w3', stop_id: null, storage_path: '/walks/kate-w3/pk3.jpg', url: 'https://picsum.photos/200/150?random=22', captured_at: '2024-12-10T11:00:00Z' }],
    route_geometry: { type: 'LineString', coordinates: [[-74.006, 40.7128], [-73.998, 40.718]] },
    start_point: { type: 'Point', coordinates: [-74.006, 40.7128] },
    like_count: 38,
    comment_count: 5,
    created_at: '2024-12-10T11:00:00Z',
    completed_at: '2024-12-10T12:00:00Z',
  },
];

const MOCK_BADGES: BadgeItem[] = [
  {
    badge: { id: 'b1', name: 'First Steps', icon_url: 'https://picsum.photos/56?random=30', description: 'Complete your first walk', earned_at: '2024-03-15T00:00:00Z' },
    unlocked: true,
  },
  {
    badge: { id: 'b2', name: 'Art Lover', icon_url: 'https://picsum.photos/56?random=31', description: 'Complete 20 artsy walks', earned_at: '2024-07-10T00:00:00Z' },
    unlocked: true,
  },
  {
    badge: { id: 'b3', name: 'Explorer', icon_url: 'https://picsum.photos/56?random=32', description: 'Walk 200km total', earned_at: '2024-09-20T00:00:00Z' },
    unlocked: true,
  },
  {
    badge: { id: 'b4', name: 'Night Owl', icon_url: 'https://picsum.photos/56?random=33', description: 'Complete 10 night walks', earned_at: '2024-11-05T00:00:00Z' },
    unlocked: true,
  },
  {
    badge: { id: 'b5', name: 'Trailblazer', icon_url: 'https://picsum.photos/56?random=34', description: 'Create a walk with 50+ likes', earned_at: '' },
    unlocked: false,
  },
];

export default function PublicProfileScreen(): JSX.Element {
  const { username } = useLocalSearchParams<{ username: string }>();
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollowToggle = () => {
    setIsFollowing((prev) => !prev);
  };

  const handleWalkPress = (walkId: string) => {
    router.push(`/walk/${walkId}`);
  };

  const handleFollowersPress = () => {
    // Open followers modal
  };

  const handleFollowingPress = () => {
    // Open following modal
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader
          profile={MOCK_PUBLIC_PROFILE}
          isOwnProfile={false}
          isFollowing={isFollowing}
          onFollowToggle={handleFollowToggle}
          onFollowersPress={handleFollowersPress}
          onFollowingPress={handleFollowingPress}
        />

        <ProfileStats
          totalWalks={MOCK_PUBLIC_PROFILE.total_walks}
          totalDistanceKm={MOCK_PUBLIC_PROFILE.total_distance_km}
          favoriteVibes={MOCK_PUBLIC_PROFILE.favorite_vibes}
        />

        <View style={styles.badgeSection}>
          <ProfileBadgeGrid badges={MOCK_BADGES} />
        </View>

        <View style={styles.walksSection}>
          <Text style={styles.sectionTitle}>Walks</Text>
          <WalkGrid walks={MOCK_WALKS} onWalkPress={handleWalkPress} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E0031',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  badgeSection: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  walksSection: {
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
});
