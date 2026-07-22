/** FlatList of comments for a walk. */
import React from 'react';
import { FlatList, StyleSheet, View, Text } from 'react-native';
import type { Comment } from '@wander/shared-types';
import CommentItem from './CommentItem';

export interface CommentThreadProps {
  comments: Comment[];
  loading?: boolean;
  onUserPress?: (userId: string) => void;
}

export default function CommentThread({
  comments,
  loading = false,
  onUserPress,
}: CommentThreadProps): JSX.Element {
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading comments…</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={comments}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <CommentItem comment={item} onUserPress={onUserPress} />
      )}
      contentContainerStyle={styles.content}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No comments yet. Be the first!</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: 8,
    flexGrow: 1,
  },
  loadingContainer: {
    padding: 24,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#C7C7C7',
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#484848',
  },
});
