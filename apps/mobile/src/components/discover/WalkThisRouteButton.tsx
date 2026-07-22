/**
 * CTA button to clone/start a discovered walk.
 * Allows users to walk a route they found on the Discover map.
 */
import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';

export interface WalkThisRouteButtonProps {
  /** Callback when button is pressed */
  onPress: () => void;
  /** Whether the action is in progress */
  loading?: boolean;
  /** Whether the button should be disabled */
  disabled?: boolean;
}

/**
 * WalkThisRouteButton is the primary CTA for starting a discovered walk.
 * Clones the route for the current user.
 */
export default function WalkThisRouteButton({
  onPress,
  loading = false,
  disabled = false,
}: WalkThisRouteButtonProps): JSX.Element {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel="Walk this route"
      accessibilityState={{ disabled: disabled || loading }}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#0A0A0A" />
      ) : (
        <Text style={styles.text}>Walk This Route</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#C3B1FF',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0A0A0A',
    textTransform: 'uppercase',
  },
  disabled: {
    opacity: 0.5,
  },
});
