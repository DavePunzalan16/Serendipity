/**
 * NearbyFriendsBanner — Animated banner displayed when a friend is walking nearby.
 * Uses React Native Animated API for slide-in effect.
 */
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  Animated,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export interface NearbyFriendsBannerProps {
  /** Friend's display name */
  friendName: string;
  /** Friend's avatar URI */
  avatarUrl: string;
  /** Activity description (e.g. "Walking 0.3 km away") */
  activityText: string;
  /** Whether the banner is visible */
  visible: boolean;
  /** Callback when the banner is tapped */
  onPress?: () => void;
  /** Callback when dismiss is tapped */
  onDismiss?: () => void;
}

/**
 * NearbyFriendsBanner renders an animated slide-in banner for nearby friend activity.
 */
export default function NearbyFriendsBanner({
  friendName,
  avatarUrl,
  activityText,
  visible,
  onPress,
  onDismiss,
}: NearbyFriendsBannerProps): JSX.Element {
  const translateY = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: visible ? 0 : -100,
      tension: 60,
      friction: 10,
      useNativeDriver: true,
    }).start();
  }, [visible, translateY]);

  return (
    <Animated.View
      style={[
        styles.banner,
        { transform: [{ translateY }] },
      ]}
    >
      <TouchableOpacity
        style={styles.content}
        onPress={onPress}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel={`${friendName} is nearby: ${activityText}`}
      >
        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        <View style={styles.textContainer}>
          <Text style={styles.name}>{friendName}</Text>
          <Text style={styles.activity}>{activityText}</Text>
        </View>
        <View style={styles.indicator}>
          <View style={styles.dot} />
        </View>
      </TouchableOpacity>
      {onDismiss && (
        <TouchableOpacity
          style={styles.dismissBtn}
          onPress={onDismiss}
          accessibilityRole="button"
          accessibilityLabel="Dismiss nearby friend notification"
        >
          <Text style={styles.dismissText}>✕</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 0,
    left: 16,
    right: 16,
    backgroundColor: '#111827',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#00E5FF',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#00E5FF',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#374151',
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E2E8F0',
  },
  activity: {
    fontSize: 12,
    color: '#00E5FF',
  },
  indicator: {
    width: 24,
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00E5FF',
  },
  dismissBtn: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dismissText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '600',
  },
});
