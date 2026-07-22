/** Animated slide-in toast notification from the top. */
import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastProps {
  message: string;
  type: ToastType;
  visible: boolean;
}

const TYPE_COLORS: Record<ToastType, string> = {
  success: '#2ECC71',
  error: '#FF4444',
  info: '#C3B1FF',
};

export default function Toast({
  message,
  type,
  visible,
}: ToastProps): JSX.Element {
  const translateY = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : -100,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible, translateY]);

  return (
    <Animated.View
      style={[
        styles.container,
        { borderLeftColor: TYPE_COLORS[type], transform: [{ translateY }] },
      ]}
      pointerEvents="none"
      accessibilityLiveRegion="polite"
    >
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    borderLeftWidth: 4,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 8,
    zIndex: 9999,
  },
  message: {
    fontSize: 14,
    color: '#FFFFFF',
  },
});
