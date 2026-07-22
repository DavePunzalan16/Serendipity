/** Renders a single feed item (avatar, username, narrative, tags, stats, like/comment). */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import type { FeedCard as FeedCardType } from '@wander/shared-types';
import { Avatar, Chip } from '../ui';
import LikeButton from './LikeButton';

export interface FeedCardProps {
  item: FeedCardType;
  onPress?: (walkId: string) => void;
  onLike?: (walkId: string) => void;
  onComment?: (walkId: string) => void;
  onUserPress?: (userId: string) => void;
}

export default function FeedCard({
  item,
  onPress,
  onLike,
  onComment,
  onUserPress,
}: FeedCardProps): JSX.Element {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress?.(item.walk_id)}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`Walk by ${item.user.display_name}`}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.userRow}
          onPress={() => onUserPress?.(item.user.id)}
          accessibilityLabel={`View ${item.user.display_name}'s profile`}
        >
          <Avatar uri={item.user.avatar_url ?? undefined} initials={item.user.display_name[0]} size="sm" />
          <Text style={styles.username}>{item.user.display_name}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.narrative} numberOfLines={3}>
        {item.narrative_snippet}
      </Text>

      {item.vibe_tags.length > 0 && (
        <View style={styles.tagsRow}>
          {item.vibe_tags.slice(0, 3).map((tag) => (
            <Chip key={tag} label={tag} />
          ))}
        </View>
      )}

      <View style={styles.statsRow}>
        <Text style={styles.stat}>
          {item.distance_km.toFixed(1)} km • {item.duration_minutes} min
        </Text>
      </View>

      <View style={styles.actionsRow}>
        <LikeButton
          liked={item.is_liked_by_viewer}
          count={item.like_count}
          onToggle={() => onLike?.(item.walk_id)}
        />
        <TouchableOpacity
          style={styles.commentButton}
          onPress={() => onComment?.(item.walk_id)}
          accessibilityLabel={`${item.comment_count} comments`}
          accessibilityRole="button"
        >
          <Text style={styles.commentIcon}>💬</Text>
          <Text style={styles.actionCount}>{item.comment_count}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  username: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  narrative: {
    fontSize: 14,
    color: '#C7C7C7',
    lineHeight: 20,
    marginBottom: 12,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  statsRow: {
    marginBottom: 12,
  },
  stat: {
    fontSize: 13,
    color: '#484848',
    fontWeight: '500',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    borderTopWidth: 1,
    borderTopColor: '#484848',
    paddingTop: 12,
  },
  commentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  commentIcon: {
    fontSize: 16,
  },
  actionCount: {
    fontSize: 13,
    color: '#C7C7C7',
    fontWeight: '500',
  },
});
