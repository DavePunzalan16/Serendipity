import { useState, useCallback } from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { FeedList } from '../../src/components/social';
import type { FeedCard as FeedCardType } from '@wander/shared-types';

const PLACEHOLDER_FEED: FeedCardType[] = [
  {
    walk_id: 'walk-1',
    user: {
      id: 'user-1',
      username: 'wanderer_kate',
      display_name: 'Kate Wanderer',
      avatar_url: null,
    },
    narrative_snippet:
      'Stumbled upon a hidden courtyard behind the old library. The ivy-covered walls felt like stepping into another era.',
    route_thumbnail_url: 'https://picsum.photos/400/200?random=1',
    vibe_tags: ['cozy', 'historic', 'hidden-gems'],
    distance_km: 2.3,
    duration_minutes: 45,
    like_count: 24,
    comment_count: 5,
    is_liked_by_viewer: false,
    created_at: '2024-12-18T10:00:00Z',
  },
  {
    walk_id: 'walk-2',
    user: {
      id: 'user-2',
      username: 'urban_drift',
      display_name: 'Urban Drift',
      avatar_url: null,
    },
    narrative_snippet:
      'Night walk through the arts district. Every mural tells a different story under the streetlights.',
    route_thumbnail_url: 'https://picsum.photos/400/200?random=2',
    vibe_tags: ['artsy', 'nightlife', 'urban'],
    distance_km: 1.8,
    duration_minutes: 30,
    like_count: 18,
    comment_count: 3,
    is_liked_by_viewer: true,
    created_at: '2024-12-17T20:00:00Z',
  },
  {
    walk_id: 'walk-3',
    user: {
      id: 'user-3',
      username: 'slow_steps',
      display_name: 'Slow Steps',
      avatar_url: null,
    },
    narrative_snippet:
      'Found a tiny café that only opens on Wednesdays. The barista recommended a trail along the canal I never knew existed.',
    route_thumbnail_url: 'https://picsum.photos/400/200?random=3',
    vibe_tags: ['cozy', 'foodie', 'nature'],
    distance_km: 3.1,
    duration_minutes: 60,
    like_count: 42,
    comment_count: 11,
    is_liked_by_viewer: false,
    created_at: '2024-12-16T14:00:00Z',
  },
];

export default function FeedScreen(): JSX.Element {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [items, setItems] = useState<FeedCardType[]>(PLACEHOLDER_FEED);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setItems(PLACEHOLDER_FEED);
      setRefreshing(false);
    }, 1500);
  }, []);

  const handleEndReached = () => {
    // Placeholder: load more items
  };

  const handleItemPress = (walkId: string) => {
    router.push(`/walk/${walkId}`);
  };

  const handleLike = (walkId: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.walk_id === walkId
          ? {
              ...item,
              is_liked_by_viewer: !item.is_liked_by_viewer,
              like_count: item.is_liked_by_viewer
                ? item.like_count - 1
                : item.like_count + 1,
            }
          : item,
      ),
    );
  };

  const handleComment = (walkId: string) => {
    router.push(`/walk/${walkId}`);
  };

  const handleUserPress = (userId: string) => {
    router.push(`/u/${userId}`);
  };

  const handleDiscover = () => {
    router.push('/(tabs)/discover');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Feed</Text>
      </View>
      <FeedList
        items={items}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onEndReached={handleEndReached}
        onItemPress={handleItemPress}
        onLike={handleLike}
        onComment={handleComment}
        onUserPress={handleUserPress}
        onDiscover={handleDiscover}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E0031',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
