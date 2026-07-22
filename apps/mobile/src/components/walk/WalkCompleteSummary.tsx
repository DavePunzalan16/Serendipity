/**
 * Summary card shown after completing a walk.
 * Displays walk stats and any badges earned during the walk.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Walk, Badge } from '@wander/shared-types';

export interface WalkCompleteSummaryProps {
  /** The completed walk data */
  walk: Pick<Walk, 'title' | 'duration_minutes' | 'distance_km' | 'stops'>;
  /** Badges earned during this walk */
  badgesEarned?: Badge[];
  /** Total XP gained */
  xpGained?: number;
}

/**
 * WalkCompleteSummary renders a celebration card with walk statistics
 * and any badges/XP earned upon walk completion.
 */
export default function WalkCompleteSummary({
  walk,
  badgesEarned = [],
  xpGained = 0,
}: WalkCompleteSummaryProps): JSX.Element {
  const stopsVisited = walk.stops.filter((s) => s.visited).length;

  return (
    <View style={styles.card}>
      <Text style={styles.emoji}>🎉</Text>
      <Text style={styles.title}>Walk Complete!</Text>
      <Text style={styles.walkTitle}>{walk.title}</Text>

      <View style={styles.statsGrid}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{walk.duration_minutes}m</Text>
          <Text style={styles.statLabel}>Duration</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{walk.distance_km.toFixed(1)}km</Text>
          <Text style={styles.statLabel}>Distance</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{stopsVisited}/{walk.stops.length}</Text>
          <Text style={styles.statLabel}>Stops</Text>
        </View>
      </View>

      {xpGained > 0 && (
        <View style={styles.xpRow}>
          <Text style={styles.xpText}>+{xpGained} XP</Text>
        </View>
      )}

      {badgesEarned.length > 0 && (
        <View style={styles.badgesSection}>
          <Text style={styles.badgesTitle}>Badges Earned</Text>
          <View style={styles.badgeRow}>
            {badgesEarned.map((badge) => (
              <View key={badge.id} style={styles.badge}>
                <Text style={styles.badgeEmoji}>🏅</Text>
                <Text style={styles.badgeName}>{badge.name}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  emoji: {
    fontSize: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  walkTitle: {
    fontSize: 16,
    color: '#C7C7C7',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 32,
    paddingTop: 12,
  },
  stat: {
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#C3B1FF',
  },
  statLabel: {
    fontSize: 12,
    color: '#484848',
    textTransform: 'uppercase',
  },
  xpRow: {
    paddingTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: '#222222',
    borderRadius: 100,
  },
  xpText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#C3B1FF',
  },
  badgesSection: {
    width: '100%',
    paddingTop: 12,
    gap: 8,
  },
  badgesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#C7C7C7',
    textTransform: 'uppercase',
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badge: {
    alignItems: 'center',
    gap: 4,
  },
  badgeEmoji: {
    fontSize: 28,
  },
  badgeName: {
    fontSize: 11,
    color: '#C7C7C7',
    textAlign: 'center',
    maxWidth: 70,
  },
});
