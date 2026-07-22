/** Heart icon with optimistic toggle and animated press feedback. */
import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  Animated,
  StyleSheet,
} from 'react-native';

export interface LikeButtonProps {
  liked: boolean;
  count: number;
  onToggle: () => void;
}

export default function LikeButton({
  liked,
  count,
  onToggle,
}: LikeButtonProps): JSX.Element {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.3,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    onToggle();
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={liked ? 'Unlike' : 'Like'}
      accessibilityState={{ selected: liked }}
    >
      <Animated.Text style={[styles.icon, { transform: [{ scale }] }]}>
        {liked ? '❤️' : '🤍'}
      </Animated.Text>
      <Text style={[styles.count, liked && styles.countLiked]}>{count}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  icon: {
    fontSize: 18,
  },
  count: {
    fontSize: 13,
    color: '#C7C7C7',
    fontWeight: '500',
  },
  countLiked: {
    color: '#C3B1FF',
  },
});
