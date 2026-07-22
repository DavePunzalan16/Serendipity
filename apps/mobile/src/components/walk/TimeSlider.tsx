/**
 * Duration selector for walk generation.
 * Provides a button row for selecting walk duration between 15-120 minutes.
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const DURATION_OPTIONS = [15, 30, 45, 60, 90, 120] as const;

export interface TimeSliderProps {
  /** Currently selected duration in minutes */
  value: number;
  /** Callback when duration changes */
  onChange: (minutes: number) => void;
  /** Minimum allowed duration in minutes */
  min?: number;
  /** Maximum allowed duration in minutes */
  max?: number;
}

/**
 * TimeSlider renders a row of duration buttons for walk time selection.
 * Users can pick from predefined durations (15–120 min).
 */
export default function TimeSlider({
  value,
  onChange,
  min = 15,
  max = 120,
}: TimeSliderProps): JSX.Element {
  const options = DURATION_OPTIONS.filter((d) => d >= min && d <= max);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Duration</Text>
      <View style={styles.row}>
        {options.map((duration) => {
          const isSelected = value === duration;
          return (
            <TouchableOpacity
              key={duration}
              style={[styles.button, isSelected && styles.buttonSelected]}
              onPress={() => onChange(duration)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`${duration} minutes`}
            >
              <Text style={[styles.buttonText, isSelected && styles.buttonTextSelected]}>
                {duration}m
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#C7C7C7',
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#484848',
    backgroundColor: 'transparent',
  },
  buttonSelected: {
    backgroundColor: '#C3B1FF',
    borderColor: '#C3B1FF',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#C7C7C7',
  },
  buttonTextSelected: {
    color: '#0A0A0A',
  },
});
