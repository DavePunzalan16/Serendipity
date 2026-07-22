/**
 * ClubList — FlatList of ClubCard components with pull-to-refresh support.
 */
import React from 'react';
import { FlatList, StyleSheet, RefreshControl } from 'react-native';
import ClubCard, { ClubCardProps } from './ClubCard';

export interface ClubListItem extends ClubCardProps {
  /** Unique club ID */
  id: string;
}

export interface ClubListProps {
  /** Array of club data */
  clubs: ClubListItem[];
  /** Whether the list is refreshing */
  refreshing?: boolean;
  /** Callback for pull-to-refresh */
  onRefresh?: () => void;
  /** Callback when a club card is pressed */
  onClubPress?: (clubId: string) => void;
  /** Callback when join/leave is toggled */
  onJoinToggle?: (clubId: string) => void;
}

/**
 * ClubList renders a scrollable list of ClubCards.
 */
export default function ClubList({
  clubs,
  refreshing = false,
  onRefresh,
  onClubPress,
  onJoinToggle,
}: ClubListProps): JSX.Element {
  return (
    <FlatList
      data={clubs}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ClubCard
          {...item}
          onPress={() => onClubPress?.(item.id)}
          onJoinToggle={() => onJoinToggle?.(item.id)}
        />
      )}
      contentContainerStyle={styles.list}
      ItemSeparatorComponent={() => <></>}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#00D26A"
            colors={['#00D26A']}
          />
        ) : undefined
      }
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
    gap: 12,
  },
});
