/**
 * Primary CTA button for walk generation.
 * Prominent action button that triggers the AI walk generation flow.
 */
import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

export interface GenerateButtonProps {
  /** Callback when button is pressed */
  onPress: () => void;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Whether generation is in progress */
  loading?: boolean;
}

/**
 * GenerateButton is the main CTA for initiating walk generation.
 * Displays loading indicator during generation.
 */
export default function GenerateButton({
  onPress,
  disabled = false,
  loading = false,
}: GenerateButtonProps): JSX.Element {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel="Generate walk"
      accessibilityState={{ disabled: disabled || loading }}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#0A0A0A" />
      ) : (
        <Text style={styles.text}>Generate Walk</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#C3B1FF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54,
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
