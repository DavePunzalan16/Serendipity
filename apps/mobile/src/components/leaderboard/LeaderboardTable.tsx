/**
 * LeaderboardTable — FlatList-based ranked table with scope, period, and metric selector buttons.
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import LeaderboardRow, { LeaderboardRowProps } from './LeaderboardRow';

export type LeaderboardScope = 'friends' | 'club' | 'global';
export type LeaderboardPeriod = 'week' | 'month' | 'allTime';
export type LeaderboardMetric = 'distance' | 'steps' | 'walks';

export interface LeaderboardEntry extends Omit<LeaderboardRowProps, 'isCurrentUser'> {
  /** Unique user ID */
  id: string;
}

export interface LeaderboardTableProps {
  /** Array of leaderboard entries */
  entries: LeaderboardEntry[];
  /** Current user ID (to highlight their row) */
  currentUserId?: string;
  /** Initial scope */
  initialScope?: LeaderboardScope;
  /** Initial period */
  initialPeriod?: LeaderboardPeriod;
  /** Initial metric */
  initialMetric?: LeaderboardMetric;
  /** Callback when filters change */
  onFilterChange?: (scope: LeaderboardScope, period: LeaderboardPeriod, metric: LeaderboardMetric) => void;
}

const SCOPES: { key: LeaderboardScope; label: string }[] = [
  { key: 'friends', label: 'Friends' },
  { key: 'club', label: 'Club' },
  { key: 'global', label: 'Global' },
];

const PERIODS: { key: LeaderboardPeriod; label: string }[] = [
  { key: 'week', label: 'Week' },
  { key: 'month', label: 'Month' },
  { key: 'allTime', label: 'All Time' },
];

const METRICS: { key: LeaderboardMetric; label: string }[] = [
  { key: 'distance', label: 'Distance' },
  { key: 'steps', label: 'Steps' },
  { key: 'walks', label: 'Walks' },
];

/**
 * LeaderboardTable renders a full leaderboard with filter chips and a ranked FlatList.
 */
export default function LeaderboardTable({
  entries,
  currentUserId,
  initialScope = 'friends',
  initialPeriod = 'week',
  initialMetric = 'distance',
  onFilterChange,
}: LeaderboardTableProps): JSX.Element {
  const [scope, setScope] = useState<LeaderboardScope>(initialScope);
  const [period, setPeriod] = useState<LeaderboardPeriod>(initialPeriod);
  const [metric, setMetric] = useState<LeaderboardMetric>(initialMetric);

  const handleScopeChange = (s: LeaderboardScope) => {
    setScope(s);
    onFilterChange?.(s, period, metric);
  };

  const handlePeriodChange = (p: LeaderboardPeriod) => {
    setPeriod(p);
    onFilterChange?.(scope, p, metric);
  };

  const handleMetricChange = (m: LeaderboardMetric) => {
    setMetric(m);
    onFilterChange?.(scope, period, m);
  };

  const renderChipRow = <T extends string>(
    items: { key: T; label: string }[],
    active: T,
    onPress: (key: T) => void,
  ) => (
    <View style={styles.chipRow}>
      {items.map((item) => (
        <TouchableOpacity
          key={item.key}
          style={[styles.chip, active === item.key && styles.chipActive]}
          onPress={() => onPress(item.key)}
          accessibilityRole="button"
          accessibilityState={{ selected: active === item.key }}
        >
          <Text
            style={[
              styles.chipText,
              active === item.key && styles.chipTextActive,
            ]}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {renderChipRow(SCOPES, scope, handleScopeChange)}
      {renderChipRow(PERIODS, period, handlePeriodChange)}
      {renderChipRow(METRICS, metric, handleMetricChange)}

      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <LeaderboardRow
            {...item}
            isCurrentUser={item.id === currentUserId}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0F1A',
    gap: 12,
    paddingTop: 12,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#374151',
  },
  chipActive: {
    backgroundColor: 'rgba(0, 210, 106, 0.12)',
    borderColor: '#00D26A',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#E2E8F0',
  },
  chipTextActive: {
    color: '#00D26A',
    fontWeight: '600',
  },
  list: {
    paddingHorizontal: 8,
    paddingBottom: 24,
  },
});
