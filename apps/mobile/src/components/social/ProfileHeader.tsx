/** Avatar, display name, bio, follower/following counts. */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { Profile } from '@wander/shared-types';
import { Avatar } from '../ui';
import FollowButton from './FollowButton';

export interface ProfileHeaderProps {
  profile: Profile;
  isOwnProfile?: boolean;
  isFollowing?: boolean;
  onFollowToggle?: () => void;
  onFollowersPress?: () => void;
  onFollowingPress?: () => void;
  onEditPress?: () => void;
}

export default function ProfileHeader({
  profile,
  isOwnProfile = false,
  isFollowing = false,
  onFollowToggle,
  onFollowersPress,
  onFollowingPress,
  onEditPress,
}: ProfileHeaderProps): JSX.Element {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Avatar uri={profile.avatar_url ?? undefined} initials={profile.display_name[0]} size="lg" />
        <View style={styles.countsRow}>
          <TouchableOpacity
            style={styles.countBlock}
            onPress={onFollowersPress}
            accessibilityLabel={`${profile.follower_count} followers`}
          >
            <Text style={styles.countNumber}>{profile.follower_count}</Text>
            <Text style={styles.countLabel}>Followers</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.countBlock}
            onPress={onFollowingPress}
            accessibilityLabel={`${profile.following_count} following`}
          >
            <Text style={styles.countNumber}>{profile.following_count}</Text>
            <Text style={styles.countLabel}>Following</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.displayName}>{profile.display_name}</Text>
      {profile.bio && <Text style={styles.bio}>{profile.bio}</Text>}

      <View style={styles.actionRow}>
        {isOwnProfile ? (
          <TouchableOpacity
            style={styles.editButton}
            onPress={onEditPress}
            accessibilityRole="button"
            accessibilityLabel="Edit profile"
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        ) : (
          <FollowButton
            isFollowing={isFollowing}
            onToggle={onFollowToggle ?? (() => {})}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    marginBottom: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 12,
  },
  countsRow: {
    flexDirection: 'row',
    gap: 24,
  },
  countBlock: {
    alignItems: 'center',
  },
  countNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  countLabel: {
    fontSize: 12,
    color: '#C7C7C7',
  },
  displayName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  bio: {
    fontSize: 14,
    color: '#C7C7C7',
    lineHeight: 20,
    marginBottom: 12,
  },
  actionRow: {
    marginTop: 8,
  },
  editButton: {
    borderWidth: 1.5,
    borderColor: '#C3B1FF',
    borderRadius: 100,
    paddingHorizontal: 24,
    paddingVertical: 10,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#C3B1FF',
    textTransform: 'uppercase',
  },
});
