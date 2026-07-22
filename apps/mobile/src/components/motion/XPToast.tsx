/**
 * Animated "+X XP" toast notification from bottom.
 * Auto-dismisses after a short duration.
 */
import React, { useEffect, useRef } from 'react';
import { Text, Animated, StyleSheet } from 'react-native';

export interface XPToastProps {
  /** XP amount to display */
  amount: number;
  /** Whether the toast is visible */
  visible: boolean;
  /** Callback when animation completes */
  onComplete?: () => void;
}

/**
 * XPToast renders an animated "+X XP" notification that slides up
 * from the bottom and fades out automatically.
 */
export default function XPToast({
  amount,
  visible,
  onComplete,
}: XPToastProps): JSX.Element | null {
  const translateY = useRef(new Animated.Value(80)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      translateY.setValue(80);
      opacity.setValue(0);

      Animated.sequence([
        Animated.parallel([
          Animated.spring(translateY, {
            toValue: 0,
            friction: 6,
            tension: 80,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(1500),
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -30,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        onComplete?.();
      });
    }
  }, [visible, translateY, opacity, onComplete]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateY }], opacity },
      ]}
      accessibilityLabel={`Plus ${amount} XP earned`}
    >
      <Text style={styles.text}>+{amount} XP</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    backgroundColor: '#C3B1FF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 100,
    shadowColor: '#C3B1FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0A0A0A',
  },
});
