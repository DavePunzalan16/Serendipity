/**
 * WeeklyLeaderboardWidget — Compact top-5 leaderboard widget for embedding in the feed.
 */
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

export interface LeaderboardWidgetEntry {
  /** Unique user ID */
  id: string;
  /** User display name */
  name: string;
  /** Avatar URI */
  avatarUrl: string;
  /** Primary stat value */
  stat: string;
}

export interface WeeklyLeaderboardWidgetProps {
  /** Top 5 entries */
  entries: LeaderboardWidgetEntry[];
  /** Callback when "View All" is tapped */
  onViewAll?: () => void;
  /** Title override */
  title?: string;
}

/**
 * WeeklyLeaderboardWidget renders a compact top-5 leaderboard card for the feed.
 */
export default function WeeklyLeaderboardWidget({
  entries,
  onViewAll,
  title = 'Weekly Leaderboard',
}: WeeklyLeaderboardWidgetProps): JSX.Element {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {onViewAll && (
          <TouchableOpacity onPress={onViewAll} accessibilityRole="button">
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        )}
      </View>
      {entries.slice(0, 5).map((entry, index) => (
        <View key={entry.id} style={styles.row}>
          <Text style={styles.rank}>{index + 1}</Text>
          <Image source={{ uri: entry.avatarUrl }} style={styles.avatar} />
          <Text style={styles.name} numberOfLines={1}>
            {entry.name}
          </Text>
          <Text style={styles.stat}>{entry.stat}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: '#374151',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E2E8F0',
  },
  viewAll: {
    fontSize: 13,
    fontWeight: '600',
    color: '#00D26A',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rank: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    width: 18,
    textAlign: 'center',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#374151',
  },
  name: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: '#E2E8F0',
  },
  stat: {
    fontSize: 13,
    fontWeight: '600',
    color: '#00E5FF',
  },
});
