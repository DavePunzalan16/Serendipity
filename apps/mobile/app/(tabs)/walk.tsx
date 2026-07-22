import { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { TimeSlider, VibeChips, GenerateButton, WalkPreviewCard, StopList } from '../../src/components/walk';
import { ChallengeCard } from '../../src/components/gamification';
import type { VibeTag, Walk, Stop } from '@wander/shared-types';

const MOCK_STOPS: Stop[] = [
  {
    id: 's1',
    walk_id: 'generated-1',
    name: 'The Painted Alley',
    description: 'A narrow lane covered in vibrant street murals dating back to the 1990s.',
    narrative: 'The colors here shift with the light — morning pastels, afternoon neons.',
    order_index: 0,
    position: { type: 'Point', coordinates: [-74.006, 40.7128] },
    visited: false,
    visited_at: null,
    place_id: null,
  },
  {
    id: 's2',
    walk_id: 'generated-1',
    name: 'Café Obscura',
    description: 'Tiny espresso spot with rotating local art displays and a hidden courtyard.',
    narrative: 'Order the house blend and ask about the rotating exhibit in the back.',
    order_index: 1,
    position: { type: 'Point', coordinates: [-74.004, 40.714] },
    visited: false,
    visited_at: null,
    place_id: null,
  },
  {
    id: 's3',
    walk_id: 'generated-1',
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
    walk_id: 'generated-1',
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

const MOCK_GENERATED_WALK: Pick<Walk, 'title' | 'narrative' | 'duration_minutes' | 'distance_km' | 'vibe_tags' | 'stops'> = {
  title: 'Hidden Art Trail',
  narrative: 'A curated path through the lesser-known murals, tucked-away cafés, and secret overlooks of the arts district.',
  duration_minutes: 35,
  distance_km: 1.9,
  vibe_tags: ['artsy', 'urban'],
  stops: MOCK_STOPS,
};

export default function WalkGenerationScreen(): JSX.Element {
  const router = useRouter();
  const [duration, setDuration] = useState(30);
  const [selectedVibes, setSelectedVibes] = useState<VibeTag[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWalk, setGeneratedWalk] = useState<typeof MOCK_GENERATED_WALK | null>(null);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedWalk(MOCK_GENERATED_WALK);
      setIsGenerating(false);
    }, 2000);
  };

  const handleReset = () => {
    setGeneratedWalk(null);
    setSelectedVibes([]);
    setDuration(30);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.headerTitle}>Generate a Walk</Text>
        <Text style={styles.headerSubtitle}>
          Choose your time and vibe to start exploring
        </Text>

        {!generatedWalk ? (
          <View style={styles.formSection}>
            <TimeSlider value={duration} onChange={setDuration} />

            <View style={styles.spacer} />

            <VibeChips
              selected={selectedVibes}
              onChange={setSelectedVibes}
              maxSelection={3}
            />

            <View style={styles.spacer} />

            <GenerateButton
              onPress={handleGenerate}
              loading={isGenerating}
              disabled={isGenerating}
            />

            <View style={styles.challengeSection}>
              <Text style={styles.sectionTitle}>Active Challenge</Text>
              <ChallengeCard
                title="Weekend Explorer"
                description="Complete 3 walks this weekend to earn the Explorer badge"
                progress={0.33}
                timeRemaining="2 days left"
              />
            </View>
          </View>
        ) : (
          <View style={styles.resultSection}>
            <WalkPreviewCard walk={generatedWalk} />

            <View style={styles.spacer} />

            <Text style={styles.sectionTitle}>Your Stops</Text>
            <View style={styles.stopListWrapper}>
              <StopList stops={generatedWalk.stops} />
            </View>

            <View style={styles.actionsRow}>
              <GenerateButton
                onPress={() => router.push(`/walk/generated-1`)}
                loading={false}
                disabled={false}
              />
            </View>

            <View style={styles.resetRow}>
              <Text style={styles.resetLink} onPress={handleReset}>
                ← Try different settings
              </Text>
            </View>
          </View>
        )}
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#C7C7C7',
    marginBottom: 32,
  },
  formSection: {
    gap: 0,
  },
  resultSection: {
    gap: 0,
  },
  spacer: {
    height: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
    marginTop: 8,
  },
  challengeSection: {
    marginTop: 32,
    gap: 12,
  },
  stopListWrapper: {
    maxHeight: 320,
  },
  actionsRow: {
    marginTop: 24,
  },
  resetRow: {
    marginTop: 16,
    alignItems: 'center',
  },
  resetLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#C3B1FF',
  },
});
