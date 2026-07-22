import { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MapView, StopList, NarrativeBanner, ProgressBar } from '../../src/components/walk';
import { CommentThread, LikeButton } from '../../src/components/social';
import type { Stop, Comment } from '@wander/shared-types';

const MOCK_STOPS: Stop[] = [
  {
    id: 's1',
    walk_id: 'walk-1',
    name: 'The Painted Alley',
    description: 'A narrow lane covered in vibrant street murals dating back to the 1990s.',
    narrative: 'The colors here shift with the light — morning pastels, afternoon neons.',
    order_index: 0,
    position: { type: 'Point', coordinates: [-74.006, 40.7128] },
    visited: true,
    visited_at: '2024-12-18T10:15:00Z',
    place_id: null,
  },
  {
    id: 's2',
    walk_id: 'walk-1',
    name: 'Café Obscura',
    description: 'Tiny espresso spot with rotating local art displays and a hidden courtyard.',
    narrative: 'Order the house blend and ask about the rotating exhibit in the back.',
    order_index: 1,
    position: { type: 'Point', coordinates: [-74.004, 40.714] },
    visited: true,
    visited_at: '2024-12-18T10:28:00Z',
    place_id: null,
  },
  {
    id: 's3',
    walk_id: 'walk-1',
    name: 'River Bend Overlook',
    description: 'A quiet bench with a view of the old stone bridge and passing boats.',
    narrative: 'Pause here. Watch the water. The bridge has stood for over a century.',
    order_index: 2,
    position: { type: 'Point', coordinates: [-74.001, 40.716] },
    visited: false,
    visited_at: null,
    place_id: null,
  },
  {
    id: 's4',
    walk_id: 'walk-1',
    name: 'The Book Garden',
    description: 'An open-air reading nook hidden behind the library with vintage shelves.',
    narrative: 'Take a book, leave a book. The garden smells of old paper and jasmine.',
    order_index: 3,
    position: { type: 'Point', coordinates: [-73.998, 40.718] },
    visited: false,
    visited_at: null,
    place_id: null,
  },
];

const MOCK_ROUTE_COORDINATES: [number, number][] = [
  [-74.006, 40.7128],
  [-74.005, 40.7135],
  [-74.004, 40.714],
  [-74.002, 40.715],
  [-74.001, 40.716],
  [-73.999, 40.717],
  [-73.998, 40.718],
];

const MOCK_COMMENTS: Comment[] = [
  {
    id: 'c1',
    user_id: 'user-2',
    walk_id: 'walk-1',
    text: 'Love the painted alley! I need to check this route out.',
    user: { id: 'user-2', username: 'urban_drift', display_name: 'Urban Drift', avatar_url: null },
    created_at: '2024-12-18T12:00:00Z',
  },
  {
    id: 'c2',
    user_id: 'user-3',
    walk_id: 'walk-1',
    text: 'Café Obscura is one of my favorites. Great pick by the algorithm!',
    user: { id: 'user-3', username: 'slow_steps', display_name: 'Slow Steps', avatar_url: null },
    created_at: '2024-12-18T14:30:00Z',
  },
];

const MOCK_NARRATIVE = "A curated path through the lesser-known murals, tucked-away cafés, and secret overlooks of the arts district. Each stop reveals a different layer of the neighborhood's creative soul.";

export default function WalkDetailScreen(): JSX.Element {
  const { walkId } = useLocalSearchParams<{ walkId: string }>();
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(24);

  const visitedCount = MOCK_STOPS.filter((s) => s.visited).length;

  const handleLikeToggle = () => {
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const handleUserPress = (userId: string) => {
    router.push(`/u/${userId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Hidden Art Trail</Text>
          <Text style={styles.meta}>35 min • 1.9 km • 4 stops</Text>
        </View>

        <View style={styles.mapSection}>
          <MapView
            routeCoordinates={MOCK_ROUTE_COORDINATES}
            stops={MOCK_STOPS}
          />
        </View>

        <View style={styles.progressSection}>
          <ProgressBar visited={visitedCount} total={MOCK_STOPS.length} />
        </View>

        <View style={styles.narrativeSection}>
          <NarrativeBanner narrative={MOCK_NARRATIVE} />
        </View>

        <View style={styles.likeSection}>
          <LikeButton
            liked={liked}
            count={likeCount}
            onToggle={handleLikeToggle}
          />
        </View>

        <View style={styles.stopsSection}>
          <Text style={styles.sectionTitle}>Stops</Text>
          <StopList
            stops={MOCK_STOPS}
            currentStopId="s3"
          />
        </View>

        <View style={styles.commentsSection}>
          <Text style={styles.sectionTitle}>Comments</Text>
          <CommentThread
            comments={MOCK_COMMENTS}
            onUserPress={handleUserPress}
          />
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
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  meta: {
    fontSize: 14,
    color: '#C7C7C7',
  },
  mapSection: {
    height: 280,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  progressSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  narrativeSection: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  likeSection: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#484848',
    borderBottomWidth: 1,
    borderBottomColor: '#484848',
    marginHorizontal: 16,
  },
  stopsSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    maxHeight: 360,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  commentsSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
});
