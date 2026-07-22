/**
 * WalkShareCard — A shareable card layout showing walk stats and narrative text.
 * Designed to be captured as an image for sharing to social platforms.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export interface WalkShareCardProps {
  /** User display name */
  userName: string;
  /** Walk title or narrative */
  narrative: string;
  /** Distance walked */
  distance: string;
  /** Duration of the walk */
  duration: string;
  /** Number of steps */
  steps?: string;
  /** Date of the walk */
  date: string;
  /** Optional route name */
  routeName?: string;
}

/**
 * WalkShareCard renders a branded shareable card with walk stats and narrative.
 */
export default function WalkShareCard({
  userName,
  narrative,
  distance,
  duration,
  steps,
  date,
  routeName,
}: WalkShareCardProps): JSX.Element {
  return (
    <View style={styles.card}>
      {/* Brand Header */}
      <View style={styles.brandRow}>
        <View style={styles.brandDot} />
        <Text style={styles.brandText}>Serendipity</Text>
      </View>

      {/* Narrative */}
      <Text style={styles.narrative}>{narrative}</Text>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{distance}</Text>
          <Text style={styles.statLabel}>Distance</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{duration}</Text>
          <Text style={styles.statLabel}>Duration</Text>
        </View>
        {steps && (
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{steps}</Text>
            <Text style={styles.statLabel}>Steps</Text>
          </View>
        )}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.userName}>{userName}</Text>
        <Text style={styles.meta}>
          {routeName ? `${routeName} • ` : ''}{date}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#00D26A',
  },
  brandText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#00D26A',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  narrative: {
    fontSize: 16,
    fontWeight: '500',
    color: '#E2E8F0',
    lineHeight: 22,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
    paddingVertical: 10,
    backgroundColor: '#0A0F1A',
    borderRadius: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#00D26A',
  },
  statLabel: {
    fontSize: 11,
    color: '#374151',
    textTransform: 'uppercase',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#374151',
    paddingTop: 12,
    gap: 2,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E2E8F0',
  },
  meta: {
    fontSize: 12,
    color: '#374151',
  },
});
