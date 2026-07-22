/** Follow/Unfollow button with optimistic state. */
import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

export interface FollowButtonProps {
  isFollowing: boolean;
  onToggle: () => void;
  loading?: boolean;
}

export default function FollowButton({
  isFollowing,
  onToggle,
  loading = false,
}: FollowButtonProps): JSX.Element {
  const [optimistic, setOptimistic] = useState(isFollowing);

  React.useEffect(() => {
    setOptimistic(isFollowing);
  }, [isFollowing]);

  const handlePress = () => {
    setOptimistic((prev) => !prev);
    onToggle();
  };

  return (
    <TouchableOpacity
      style={[styles.button, optimistic ? styles.unfollowButton : styles.followButton]}
      onPress={handlePress}
      disabled={loading}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={optimistic ? 'Unfollow' : 'Follow'}
    >
      {loading ? (
        <ActivityIndicator size="small" color={optimistic ? '#C3B1FF' : '#0A0A0A'} />
      ) : (
        <Text style={[styles.text, optimistic ? styles.unfollowText : styles.followText]}>
          {optimistic ? 'Following' : 'Follow'}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 100,
    paddingHorizontal: 24,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  followButton: {
    backgroundColor: '#C3B1FF',
  },
  unfollowButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#C3B1FF',
  },
  text: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  followText: {
    color: '#0A0A0A',
  },
  unfollowText: {
    color: '#C3B1FF',
  },
});
