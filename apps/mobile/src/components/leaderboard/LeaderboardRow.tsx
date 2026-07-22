/**
 * LeaderboardRow — A single row in the leaderboard table showing rank, avatar, name, stat, and rank-change arrow.
 */
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export interface LeaderboardRowProps {
  /** Current rank position */
  rank: number;
  /** User avatar URI */
  avatarUrl: string;
  /** Display name */
  name: string;
  /** Stat value (e.g. "12.4 km") */
  stat: string;
  /** Rank change: positive = moved up, negative = moved down, 0 = no change */
  rankChange: number;
  /** Whether this row is highlighted (current user) */
  isCurrentUser?: boolean;
}

/**
 * LeaderboardRow renders a single ranked entry with avatar, name, stat, and rank-change indicator.
 */
export default function LeaderboardRow({
  rank,
  avatarUrl,
  name,
  stat,
  rankChange,
  isCurrentUser = false,
}: LeaderboardRowProps): JSX.Element {
  const changeColor =
    rankChange > 0 ? '#00D26A' : rankChange < 0 ? '#EF4444' : '#374151';
  const changeSymbol = rankChange > 0 ? '▲' : rankChange < 0 ? '▼' : '–';

  return (
    <View style={[styles.row, isCurrentUser && styles.rowHighlight]}>
      <Text style={styles.rank}>{rank}</Text>
      <Image source={{ uri: avatarUrl }} style={styles.avatar} />
      <Text style={styles.name} numberOfLines={1}>
        {name}
      </Text>
      <Text style={styles.stat}>{stat}</Text>
      <Text style={[styles.change, { color: changeColor }]}>
        {changeSymbol} {Math.abs(rankChange) > 0 ? Math.abs(rankChange) : ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 10,
  },
  rowHighlight: {
    backgroundColor: 'rgba(0, 210, 106, 0.08)',
    borderWidth: 1,
    borderColor: '#00D26A',
  },
  rank: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E2E8F0',
    width: 24,
    textAlign: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#374151',
  },
  name: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#E2E8F0',
  },
  stat: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00D26A',
  },
  change: {
    fontSize: 12,
    fontWeight: '600',
    width: 32,
    textAlign: 'right',
  },
});
