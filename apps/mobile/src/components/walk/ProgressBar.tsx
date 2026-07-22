/**
 * Walk progress bar showing stops visited vs total.
 * Compact horizontal bar with label.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export interface ProgressBarProps {
  /** Number of stops visited */
  visited: number;
  /** Total number of stops */
  total: number;
}

/**
 * ProgressBar renders a horizontal fill bar indicating walk completion.
 * Displays "X / Y stops" label.
 */
export default function ProgressBar({ visited, total }: ProgressBarProps): JSX.Element {
  const progress = total > 0 ? visited / total : 0;

  return (
    <View style={styles.container} accessibilityRole="progressbar" accessibilityValue={{ now: visited, min: 0, max: total }}>
      <View style={styles.barBackground}>
        <View style={[styles.barFill, { width: `${progress * 100}%` }]} />
      </View>
      <Text style={styles.label}>
        {visited} / {total} stops
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  barBackground: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#484848',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: '#C3B1FF',
  },
  label: {
    fontSize: 12,
    color: '#C7C7C7',
    fontWeight: '500',
  },
});
