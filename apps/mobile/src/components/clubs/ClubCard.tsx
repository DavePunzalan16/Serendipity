/**
 * ClubCard — Club preview card showing name, member count, and a join button.
 */
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

export interface ClubCardProps {
  /** Club display name */
  name: string;
  /** Club avatar/logo URI */
  avatarUrl?: string;
  /** Number of members */
  memberCount: number;
  /** Short club description */
  description?: string;
  /** Whether the current user has joined this club */
  isJoined?: boolean;
  /** Callback when join/leave is tapped */
  onJoinToggle?: () => void;
  /** Callback when the card is tapped */
  onPress?: () => void;
}

/**
 * ClubCard renders a compact club preview with name, member count, and join action.
 */
export default function ClubCard({
  name,
  avatarUrl,
  memberCount,
  description,
  isJoined = false,
  onJoinToggle,
  onPress,
}: ClubCardProps): JSX.Element {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`Club: ${name}`}
    >
      {avatarUrl && (
        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
      )}
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        {description && (
          <Text style={styles.description} numberOfLines={2}>
            {description}
          </Text>
        )}
        <Text style={styles.members}>{memberCount} members</Text>
      </View>
      <TouchableOpacity
        style={[styles.joinBtn, isJoined && styles.joinedBtn]}
        onPress={onJoinToggle}
        accessibilityRole="button"
        accessibilityLabel={isJoined ? 'Leave club' : 'Join club'}
      >
        <Text style={[styles.joinText, isJoined && styles.joinedText]}>
          {isJoined ? 'Joined' : 'Join'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#374151',
  },
  content: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: '#E2E8F0',
  },
  description: {
    fontSize: 12,
    color: '#374151',
    lineHeight: 16,
  },
  members: {
    fontSize: 12,
    fontWeight: '500',
    color: '#00E5FF',
  },
  joinBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: '#00D26A',
  },
  joinedBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#00D26A',
  },
  joinText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0A0F1A',
  },
  joinedText: {
    color: '#00D26A',
  },
});
