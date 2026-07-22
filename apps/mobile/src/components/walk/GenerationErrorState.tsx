/**
 * Error state with retry button for walk generation failures.
 * Shown when AI walk generation encounters an error.
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export interface GenerationErrorStateProps {
  /** Error message to display */
  message?: string;
  /** Callback when retry is pressed */
  onRetry: () => void;
}

/**
 * GenerationErrorState displays a user-friendly error message
 * with a retry button when walk generation fails.
 */
export default function GenerationErrorState({
  message = 'Something went wrong while generating your walk.',
  onRetry,
}: GenerationErrorStateProps): JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>😕</Text>
      <Text style={styles.title}>Generation Failed</Text>
      <Text style={styles.message}>{message}</Text>
      <TouchableOpacity
        style={styles.retryButton}
        onPress={onRetry}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Retry walk generation"
      >
        <Text style={styles.retryText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 12,
  },
  emoji: {
    fontSize: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  message: {
    fontSize: 14,
    color: '#C7C7C7',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  retryButton: {
    marginTop: 8,
    backgroundColor: '#C3B1FF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 100,
  },
  retryText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0A0A0A',
    textTransform: 'uppercase',
  },
});
