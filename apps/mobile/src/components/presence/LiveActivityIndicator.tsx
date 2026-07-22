/**
 * LiveActivityIndicator — Pulsing green dot with scrolling text ticker indicating live activity.
 * Uses React Native Animated API for the pulsing effect.
 */
import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

export interface LiveActivityIndicatorProps {
  /** Activity text (e.g. "Walking in Central Park") */
  text: string;
  /** Whether the activity is currently live */
  isLive?: boolean;
  /** Optional user name */
  userName?: string;
}

/**
 * LiveActivityIndicator renders a pulsing green dot with a ticker text for live activity.
 */
export default function LiveActivityIndicator({
  text,
  isLive = true,
  userName,
}: LiveActivityIndicatorProps): JSX.Element {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isLive) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.4,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      );
      animation.start();
      return () => animation.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isLive, pulseAnim]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.dot, { opacity: pulseAnim }]}
      />
      <View style={styles.textContainer}>
        {userName && <Text style={styles.userName}>{userName}</Text>}
        <Text style={styles.text} numberOfLines={1}>
          {text}
        </Text>
      </View>
      {isLive && <Text style={styles.liveLabel}>LIVE</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(0, 210, 106, 0.08)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 210, 106, 0.2)',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00D26A',
  },
  textContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: 4,
  },
  userName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#E2E8F0',
  },
  text: {
    fontSize: 13,
    color: '#374151',
    flex: 1,
  },
  liveLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#00D26A',
    letterSpacing: 0.5,
  },
});
