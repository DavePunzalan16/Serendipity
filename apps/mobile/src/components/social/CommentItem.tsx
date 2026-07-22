/** Single comment with avatar, username, text, and timestamp. */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { Comment } from '@wander/shared-types';
import { Avatar } from '../ui';

export interface CommentItemProps {
  comment: Comment;
  onUserPress?: (userId: string) => void;
}

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'now';
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

export default function CommentItem({
  comment,
  onUserPress,
}: CommentItemProps): JSX.Element {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => onUserPress?.(comment.user.id)}
        accessibilityLabel={`View ${comment.user.display_name}'s profile`}
      >
        <Avatar
          uri={comment.user.avatar_url ?? undefined}
          initials={comment.user.display_name[0]}
          size="sm"
        />
      </TouchableOpacity>
      <View style={styles.body}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => onUserPress?.(comment.user.id)}>
            <Text style={styles.username}>{comment.user.display_name}</Text>
          </TouchableOpacity>
          <Text style={styles.timestamp}>{formatTimeAgo(comment.created_at)}</Text>
        </View>
        <Text style={styles.text}>{comment.text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  body: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  username: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  timestamp: {
    fontSize: 12,
    color: '#484848',
  },
  text: {
    fontSize: 14,
    color: '#C7C7C7',
    lineHeight: 19,
  },
});
