/** FlatList with pull-to-refresh and infinite scroll for feed items. */
import React from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import type { FeedCard as FeedCardType } from '@wander/shared-types';
import FeedCard from './FeedCard';
import FeedEmptyState from './FeedEmptyState';
import { Skeleton } from '../ui';

export interface FeedListProps {
  items: FeedCardType[];
  refreshing: boolean;
  onRefresh: () => void;
  onEndReached: () => void;
  loadingMore?: boolean;
  onItemPress?: (walkId: string) => void;
  onLike?: (walkId: string) => void;
  onComment?: (walkId: string) => void;
  onUserPress?: (userId: string) => void;
  onDiscover?: () => void;
}

export default function FeedList({
  items,
  refreshing,
  onRefresh,
  onEndReached,
  loadingMore = false,
  onItemPress,
  onLike,
  onComment,
  onUserPress,
  onDiscover,
}: FeedListProps): JSX.Element {
  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.walk_id}
      renderItem={({ item }) => (
        <FeedCard
          item={item}
          onPress={onItemPress}
          onLike={onLike}
          onComment={onComment}
          onUserPress={onUserPress}
        />
      )}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#C3B1FF"
          colors={['#C3B1FF']}
        />
      }
      onEndReached={onEndReached}
      onEndReachedThreshold={0.3}
      ListEmptyComponent={<FeedEmptyState onDiscover={onDiscover} />}
      ListFooterComponent={
        loadingMore ? (
          <View style={styles.footer}>
            <Skeleton />
          </View>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    flexGrow: 1,
  },
  footer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});
