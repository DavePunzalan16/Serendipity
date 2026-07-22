/** Pill-shaped chip with selected/unselected state. */
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}

export default function Chip({
  label,
  selected = false,
  onPress,
}: ChipProps): JSX.Element {
  return (
    <TouchableOpacity
      style={[styles.chip, selected && styles.chipSelected]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      <Text style={[styles.label, selected && styles.labelSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#484848',
    backgroundColor: 'transparent',
  },
  chipSelected: {
    backgroundColor: '#C3B1FF',
    borderColor: '#C3B1FF',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#C7C7C7',
  },
  labelSelected: {
    color: '#0A0A0A',
  },
});
