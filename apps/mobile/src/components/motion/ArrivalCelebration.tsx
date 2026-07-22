/**
 * Animated celebration on geofence arrival.
 * Uses React Native Animated API with scale/opacity transforms.
 */
import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import type { Stop } from '@wander/shared-types';

export interface ArrivalCelebrationProps {
  /** The stop that was reached */
  stop: Stop;
  /** Whether the celebration is active */
  visible: boolean;
  /** Callback when animation completes */
  onComplete?: () => void;
}

/**
 * ArrivalCelebration renders a scale+fade animation when the user
 * arrives at a geofenced walk stop. Automatically dismisses after animation.
 */
export default function ArrivalCelebration({
  stop,
  visible,
  onComplete,
}: ArrivalCelebrationProps): JSX.Element | null {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          tension: 60,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Hold for a moment then fade out
        setTimeout(() => {
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }).start(() => {
            scaleAnim.setValue(0);
            onComplete?.();
          });
        }, 2000);
      });
    }
  }, [visible, scaleAnim, opacityAnim, onComplete]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
      accessibilityLabel={`Arrived at ${stop.name}`}
    >
      <Text style={styles.emoji}>📍</Text>
      <Text style={styles.title}>You've arrived!</Text>
      <Text style={styles.stopName}>{stop.name}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(30, 0, 49, 0.9)',
    zIndex: 100,
  },
  emoji: {
    fontSize: 56,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  stopName: {
    fontSize: 18,
    color: '#C3B1FF',
    fontWeight: '500',
  },
});
