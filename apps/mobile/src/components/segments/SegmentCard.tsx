/**
 * SegmentCard — Displays a walking segment with name, distance, and a mini-leaderboard preview.
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export interface SegmentLeaderEntry {
  /** User display name */
  name: string;
  /** Time or stat value */
  stat: string;
}

export interface SegmentCardProps {
  /** Segment name */
  name: string;
  /** Segment distance (e.g. "1.2 km") */
  distance: string;
  /** Top entries for the mini-leaderboard */
  topEntries: SegmentLeaderEntry[];
  /** Current user's rank on this segment */
  userRank?: number;
  /** Callback when the segment card is pressed */
  onPress?: () => void;
}

/**
 * SegmentCard renders a segment preview with an embedded mini-leaderboard.
 */
export default function SegmentCard({
  name,
  distance,
  topEntries,
  userRank,
  onPress,
}: SegmentCardProps): JSX.Element {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`Segment: ${name}`}
    >
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.distance}>{distance}</Text>
        </View>
        {userRank !== undefined && (
          <View style={styles.rankBadge}>
            <Text style={styles.rankText}>#{userRank}</Text>
          </View>
        )}
      </View>

      {/* Mini Leaderboard */}
      {topEntries.length > 0 && (
        <View style={styles.miniBoard}>
          {topEntries.slice(0, 3).map((entry, index) => (
            <View key={index} style={styles.miniRow}>
              <Text style={styles.miniRank}>{index + 1}</Text>
              <Text style={styles.miniName} numberOfLines={1}>
                {entry.name}
              </Text>
              <Text style={styles.miniStat}>{entry.stat}</Text>
            </View>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: '#374151',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: '#E2E8F0',
  },
  distance: {
    fontSize: 12,
    color: '#374151',
  },
  rankBadge: {
    backgroundColor: 'rgba(0, 229, 255, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rankText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#00E5FF',
  },
  miniBoard: {
    gap: 4,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  miniRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  miniRank: {
    fontSize: 11,
    fontWeight: '700',
    color: '#374151',
    width: 14,
  },
  miniName: {
    flex: 1,
    fontSize: 12,
    color: '#E2E8F0',
  },
  miniStat: {
    fontSize: 12,
    fontWeight: '600',
    color: '#00D26A',
  },
});
