/** Total walks, distance, favorite vibes grid. */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { VibeTag } from '@wander/shared-types';
import { Chip } from '../ui';

export interface ProfileStatsProps {
  totalWalks: number;
  totalDistanceKm: number;
  favoriteVibes: VibeTag[];
}

export default function ProfileStats({
  totalWalks,
  totalDistanceKm,
  favoriteVibes,
}: ProfileStatsProps): JSX.Element {
  return (
    <View style={styles.container}>
      <View style={styles.metricsRow}>
        <View style={styles.metric}>
          <Text style={styles.metricValue}>{totalWalks}</Text>
          <Text style={styles.metricLabel}>Walks</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.metric}>
          <Text style={styles.metricValue}>{totalDistanceKm.toFixed(1)}</Text>
          <Text style={styles.metricLabel}>km walked</Text>
        </View>
      </View>

      {favoriteVibes.length > 0 && (
        <View style={styles.vibesSection}>
          <Text style={styles.vibesTitle}>Favorite Vibes</Text>
          <View style={styles.vibesGrid}>
            {favoriteVibes.map((vibe) => (
              <Chip key={vibe} label={vibe} selected />
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  metric: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  metricLabel: {
    fontSize: 12,
    color: '#C7C7C7',
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: '#484848',
  },
  vibesSection: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#484848',
    paddingTop: 16,
  },
  vibesTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#C7C7C7',
    marginBottom: 10,
  },
  vibesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
