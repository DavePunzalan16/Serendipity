import { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { DiscoverMap, DiscoverFilters, WalkPreviewPopover } from '../../src/components/discover';
import type { VibeTag, Walk } from '@wander/shared-types';
import type { SortOption } from '../../src/components/discover/DiscoverFilters';

const PLACEHOLDER_WALKS: Pick<Walk, 'id' | 'title' | 'start_point' | 'vibe_tags'>[] = [
  {
    id: 'discover-1',
    title: 'Hidden Art Trail',
    start_point: { type: 'Point', coordinates: [-74.006, 40.7128] },
    vibe_tags: ['artsy', 'urban'],
  },
  {
    id: 'discover-2',
    title: 'Canal Sunset Loop',
    start_point: { type: 'Point', coordinates: [-73.99, 40.72] },
    vibe_tags: ['scenic', 'nature'],
  },
  {
    id: 'discover-3',
    title: 'Night Market Wander',
    start_point: { type: 'Point', coordinates: [-74.012, 40.708] },
    vibe_tags: ['foodie', 'nightlife'],
  },
];

const PREVIEW_WALK: Pick<Walk, 'id' | 'title' | 'narrative' | 'duration_minutes' | 'distance_km' | 'vibe_tags' | 'like_count'> = {
  id: 'discover-1',
  title: 'Hidden Art Trail',
  narrative: 'A curated walk through the lesser-known murals and installations tucked in alleys and courtyards of the arts district.',
  duration_minutes: 35,
  distance_km: 1.9,
  vibe_tags: ['artsy', 'urban'],
  like_count: 24,
};

export default function DiscoverScreen(): JSX.Element {
  const router = useRouter();
  const [selectedVibes, setSelectedVibes] = useState<VibeTag[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [selectedWalkId, setSelectedWalkId] = useState<string | null>(null);

  const handleWalkPress = (walkId: string) => {
    setSelectedWalkId(walkId);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover</Text>
      </View>

      <DiscoverFilters
        selectedVibes={selectedVibes}
        onVibesChange={setSelectedVibes}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <View style={styles.mapContainer}>
        <DiscoverMap
          walks={PLACEHOLDER_WALKS}
          onWalkPress={handleWalkPress}
          initialRegion={{
            latitude: 40.7128,
            longitude: -74.006,
            latitudeDelta: 0.04,
            longitudeDelta: 0.04,
          }}
        />

        <WalkPreviewPopover
          walk={selectedWalkId ? PREVIEW_WALK : null}
          visible={selectedWalkId !== null}
        />
      </View>
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
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  mapContainer: {
    flex: 1,
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
});
