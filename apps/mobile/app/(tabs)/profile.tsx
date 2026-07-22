import { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ProfileHeader, ProfileStats, WalkGrid } from '../../src/components/social';
import { ProfileBadgeGrid, LevelProgressBar } from '../../src/components/gamification';
import type { Profile, Walk, Badge, VibeTag } from '@wander/shared-types';
import type { BadgeItem } from '../../src/components/gamification/ProfileBadgeGrid';

const MOCK_PROFILE: Profile = {
  id: 'user-self',
  username: 'alex_wanders',
  display_name: 'Alex Wanderer',
  bio: 'Exploring cities one step at a time. Always looking for the path less traveled.',
  avatar_url: null,
  created_at: '2024-06-01T00:00:00Z',
  follower_count: 182,
  following_count: 94,
  total_walks: 47,
  total_distance_km: 128.4,
  favorite_vibes: ['scenic', 'cozy', 'historic'] as VibeTag[],
  badges: [],
};

const MOCK_WALKS: Walk[] = [
  {
    id: 'h1',
    user_id: 'user-self',
    title: 'Sunset Canal Stroll',
    narrative: 'A peaceful walk along the canal as the sun sets behind the old bridges.',
    visibility: 'public',
    duration_minutes: 40,
    distance_km: 2.1,
    vibe_tags: ['scenic', 'cozy'] as VibeTag[],
    stops: [],
    photos: [{ id: 'p1', walk_id: 'h1', stop_id: null, storage_path: '/walks/h1/p1.jpg', url: 'https://picsum.photos/200/150?random=1', captured_at: '2024-12-18T10:00:00Z' }],
    route_geometry: { type: 'LineString', coordinates: [[-74.006, 40.7128], [-74.004, 40.714]] },
    start_point: { type: 'Point', coordinates: [-74.006, 40.7128] },
    like_count: 12,
    comment_count: 3,
    created_at: '2024-12-18T10:00:00Z',
    completed_at: '2024-12-18T10:40:00Z',
  },
  {
    id: 'h2',
    user_id: 'user-self',
    title: 'Market District Wander',
    narrative: 'Navigating the morning rush through spice shops and vintage stalls.',
    visibility: 'public',
    duration_minutes: 55,
    distance_km: 3.0,
    vibe_tags: ['foodie', 'urban'] as VibeTag[],
    stops: [],
    photos: [{ id: 'p2', walk_id: 'h2', stop_id: null, storage_path: '/walks/h2/p2.jpg', url: 'https://picsum.photos/200/150?random=2', captured_at: '2024-12-15T14:00:00Z' }],
    route_geometry: { type: 'LineString', coordinates: [[-74.006, 40.7128], [-74.002, 40.715]] },
    start_point: { type: 'Point', coordinates: [-74.006, 40.7128] },
    like_count: 8,
    comment_count: 2,
    created_at: '2024-12-15T14:00:00Z',
    completed_at: '2024-12-15T14:55:00Z',
  },
  {
    id: 'h3',
    user_id: 'user-self',
    title: 'Old Town Night Walk',
    narrative: 'The cobblestone streets come alive with lantern light after dark.',
    visibility: 'public',
    duration_minutes: 35,
    distance_km: 1.8,
    vibe_tags: ['historic', 'nightlife'] as VibeTag[],
    stops: [],
    photos: [{ id: 'p3', walk_id: 'h3', stop_id: null, storage_path: '/walks/h3/p3.jpg', url: 'https://picsum.photos/200/150?random=3', captured_at: '2024-12-12T20:00:00Z' }],
    route_geometry: { type: 'LineString', coordinates: [[-74.006, 40.7128], [-74.001, 40.716]] },
    start_point: { type: 'Point', coordinates: [-74.006, 40.7128] },
    like_count: 19,
    comment_count: 6,
    created_at: '2024-12-12T20:00:00Z',
    completed_at: '2024-12-12T20:35:00Z',
  },
  {
    id: 'h4',
    user_id: 'user-self',
    title: 'Riverside Nature Loop',
    narrative: 'Following the river path through ancient willows and wildflower meadows.',
    visibility: 'public',
    duration_minutes: 70,
    distance_km: 4.2,
    vibe_tags: ['nature', 'scenic'] as VibeTag[],
    stops: [],
    photos: [{ id: 'p4', walk_id: 'h4', stop_id: null, storage_path: '/walks/h4/p4.jpg', url: 'https://picsum.photos/200/150?random=4', captured_at: '2024-12-08T09:00:00Z' }],
    route_geometry: { type: 'LineString', coordinates: [[-74.006, 40.7128], [-73.998, 40.718]] },
    start_point: { type: 'Point', coordinates: [-74.006, 40.7128] },
    like_count: 31,
    comment_count: 9,
    created_at: '2024-12-08T09:00:00Z',
    completed_at: '2024-12-08T10:10:00Z',
  },
];

const MOCK_BADGES: BadgeItem[] = [
  {
    badge: { id: 'b1', name: 'First Steps', icon_url: 'https://picsum.photos/56?random=10', description: 'Complete your first walk', earned_at: '2024-06-15T00:00:00Z' },
    unlocked: true,
  },
  {
    badge: { id: 'b2', name: 'Night Owl', icon_url: 'https://picsum.photos/56?random=11', description: 'Complete 5 night walks', earned_at: '2024-08-20T00:00:00Z' },
    unlocked: true,
  },
  {
    badge: { id: 'b3', name: 'Explorer', icon_url: 'https://picsum.photos/56?random=12', description: 'Walk 100km total', earned_at: '2024-10-01T00:00:00Z' },
    unlocked: true,
  },
  {
    badge: { id: 'b4', name: 'Foodie', icon_url: 'https://picsum.photos/56?random=13', description: 'Complete 10 foodie walks', earned_at: '' },
    unlocked: false,
  },
  {
    badge: { id: 'b5', name: 'Social Butterfly', icon_url: 'https://picsum.photos/56?random=14', description: 'Get 50 followers', earned_at: '' },
    unlocked: false,
  },
];

export default function ProfileScreen(): JSX.Element {
  const router = useRouter();
  const [profile] = useState<Profile>(MOCK_PROFILE);

  const handleWalkPress = (walkId: string) => {
    router.push(`/walk/${walkId}`);
  };

  const handleEditProfile = () => {
    // Navigate to edit profile
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader
          profile={profile}
          isOwnProfile
          onEditPress={handleEditProfile}
        />

        <ProfileStats
          totalWalks={profile.total_walks}
          totalDistanceKm={profile.total_distance_km}
          favoriteVibes={profile.favorite_vibes}
        />

        <View style={styles.levelSection}>
          <LevelProgressBar
            level={7}
            currentXP={2340}
            requiredXP={3000}
          />
        </View>

        <View style={styles.badgeSection}>
          <ProfileBadgeGrid badges={MOCK_BADGES} />
        </View>

        <View style={styles.walksSection}>
          <Text style={styles.sectionTitle}>Walk History</Text>
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
  levelSection: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
