/**
 * Multi-select vibe tag chips for walk generation.
 * Displays all available vibes as selectable chip buttons.
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { VibeTag } from '@wander/shared-types';

const ALL_VIBES: VibeTag[] = [
  'cozy',
  'urban',
  'nature',
  'historic',
  'artsy',
  'foodie',
  'nightlife',
  'scenic',
  'adventure',
  'hidden-gems',
];

export interface VibeChipsProps {
  /** Currently selected vibe tags */
  selected: VibeTag[];
  /** Callback when selection changes */
  onChange: (vibes: VibeTag[]) => void;
  /** Maximum number of vibes that can be selected */
  maxSelection?: number;
}

/**
 * VibeChips renders a wrap-layout of selectable vibe tags.
 * Tapping a chip toggles its selection state.
 */
export default function VibeChips({
  selected,
  onChange,
  maxSelection = 3,
}: VibeChipsProps): JSX.Element {
  const handleToggle = (vibe: VibeTag) => {
    if (selected.includes(vibe)) {
      onChange(selected.filter((v) => v !== vibe));
    } else if (selected.length < maxSelection) {
      onChange([...selected, vibe]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Vibes (pick up to {maxSelection})</Text>
      <View style={styles.chipRow}>
        {ALL_VIBES.map((vibe) => {
          const isSelected = selected.includes(vibe);
          const isDisabled = !isSelected && selected.length >= maxSelection;
          return (
            <TouchableOpacity
              key={vibe}
              style={[
                styles.chip,
                isSelected && styles.chipSelected,
                isDisabled && styles.chipDisabled,
              ]}
              onPress={() => handleToggle(vibe)}
              disabled={isDisabled}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected, disabled: isDisabled }}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {vibe}
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
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
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
  chipDisabled: {
    opacity: 0.4,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#C7C7C7',
  },
  chipTextSelected: {
    color: '#0A0A0A',
  },
});
