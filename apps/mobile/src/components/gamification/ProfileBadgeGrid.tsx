/**
 * Grid of badge icons for the user profile.
 * Locked badges display in grayscale, unlocked in full color.
 */
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import type { Badge } from '@wander/shared-types';

export interface BadgeItem {
  /** Badge definition */
  badge: Badge;
  /** Whether the user has earned this badge */
  unlocked: boolean;
}

export interface ProfileBadgeGridProps {
  /** All badges with unlock status */
  badges: BadgeItem[];
  /** Callback when a badge is pressed */
  onBadgePress?: (badge: Badge) => void;
}

/**
 * ProfileBadgeGrid renders a grid of badge icons.
 * Unlocked badges are shown in full color; locked ones are grayscale.
 */
export default function ProfileBadgeGrid({
  badges,
  onBadgePress,
}: ProfileBadgeGridProps): JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Badges</Text>
      <View style={styles.grid}>
        {badges.map(({ badge, unlocked }) => (
          <View
            key={badge.id}
            style={[styles.badgeCell, !unlocked && styles.badgeLocked]}
            accessible
            accessibilityLabel={`${badge.name} badge, ${unlocked ? 'unlocked' : 'locked'}`}
          >
            <Image
              source={{ uri: badge.icon_url }}
              style={[styles.badgeImage, !unlocked && styles.badgeImageLocked]}
              resizeMode="cover"
            />
            <Text
              style={[styles.badgeName, !unlocked && styles.badgeNameLocked]}
              numberOfLines={1}
            >
              {badge.name}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  heading: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badgeCell: {
    width: 72,
    alignItems: 'center',
    gap: 4,
  },
  badgeLocked: {
    opacity: 0.4,
  },
  badgeImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#222222',
  },
  badgeImageLocked: {
    // Grayscale effect approximation via reduced opacity on container
  },
  badgeName: {
    fontSize: 10,
    color: '#C7C7C7',
    textAlign: 'center',
    fontWeight: '500',
  },
  badgeNameLocked: {
    color: '#484848',
  },
});
