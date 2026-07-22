/**
 * Walk preview card shown after generation.
 * Displays a summary of the generated walk before user starts it.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Walk, VibeTag } from '@wander/shared-types';

export interface WalkPreviewCardProps {
  /** The generated walk data */
  walk: Pick<Walk, 'title' | 'narrative' | 'duration_minutes' | 'distance_km' | 'vibe_tags' | 'stops'>;
}

/**
 * WalkPreviewCard shows a compact summary of a generated walk
 * including title, narrative snippet, stats, and vibe tags.
 */
export default function WalkPreviewCard({ walk }: WalkPreviewCardProps): JSX.Element {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{walk.title}</Text>
      <Text style={styles.narrative} numberOfLines={3}>
        {walk.narrative}
      </Text>
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{walk.duration_minutes}m</Text>
          <Text style={styles.statLabel}>Duration</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{walk.distance_km.toFixed(1)}km</Text>
          <Text style={styles.statLabel}>Distance</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{walk.stops.length}</Text>
          <Text style={styles.statLabel}>Stops</Text>
        </View>
      </View>
      <View style={styles.vibeRow}>
        {walk.vibe_tags.map((vibe: VibeTag) => (
          <View key={vibe} style={styles.vibeChip}>
            <Text style={styles.vibeText}>{vibe}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 20,
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  narrative: {
    fontSize: 14,
    color: '#C7C7C7',
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 24,
    paddingTop: 8,
  },
  stat: {
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#C3B1FF',
  },
  statLabel: {
    fontSize: 12,
    color: '#484848',
    textTransform: 'uppercase',
  },
  vibeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    paddingTop: 4,
  },
  vibeChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
    backgroundColor: '#222222',
  },
  vibeText: {
    fontSize: 12,
    color: '#C7C7C7',
  },
});
