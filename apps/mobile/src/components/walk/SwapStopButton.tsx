/**
 * Button to trigger a stop swap during an active walk.
 * Compact secondary-style button placed on stop cards.
 */
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export interface SwapStopButtonProps {
  /** Callback when swap is requested */
  onPress: () => void;
  /** Whether swap is currently in progress */
  loading?: boolean;
  /** Whether the button should be disabled */
  disabled?: boolean;
}

/**
 * SwapStopButton provides a compact action button to initiate
 * replacing the current stop with an AI-generated alternative.
 */
export default function SwapStopButton({
  onPress,
  loading = false,
  disabled = false,
}: SwapStopButtonProps): JSX.Element {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel="Swap this stop"
      accessibilityState={{ disabled: disabled || loading }}
    >
      <Text style={styles.text}>{loading ? 'Swapping…' : 'Swap Stop'}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#C3B1FF',
    backgroundColor: 'transparent',
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
    color: '#C3B1FF',
    textTransform: 'uppercase',
  },
  disabled: {
    opacity: 0.5,
  },
});
