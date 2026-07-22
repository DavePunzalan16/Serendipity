/**
 * Horizontal scroll of vibe filter chips + sort toggle for Discover.
 * Allows filtering community walks by vibe and sorting by recent/popular.
 */
import React from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
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

export type SortOption = 'recent' | 'popular';

export interface DiscoverFiltersProps {
  /** Currently selected vibe filters */
  selectedVibes: VibeTag[];
  /** Callback when vibe filters change */
  onVibesChange: (vibes: VibeTag[]) => void;
  /** Current sort option */
  sortBy: SortOption;
  /** Callback when sort changes */
  onSortChange: (sort: SortOption) => void;
}

/**
 * DiscoverFilters renders a horizontal scrollable row of vibe filter chips
 * and a sort toggle for the Discover map/list view.
 */
export default function DiscoverFilters({
  selectedVibes,
  onVibesChange,
  sortBy,
  onSortChange,
}: DiscoverFiltersProps): JSX.Element {
  const toggleVibe = (vibe: VibeTag) => {
    if (selectedVibes.includes(vibe)) {
      onVibesChange(selectedVibes.filter((v) => v !== vibe));
    } else {
      onVibesChange([...selectedVibes, vibe]);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipScroll}
      >
        {ALL_VIBES.map((vibe) => {
          const isSelected = selectedVibes.includes(vibe);
          return (
            <TouchableOpacity
              key={vibe}
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => toggleVibe(vibe)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {vibe}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <View style={styles.sortRow}>
        <TouchableOpacity
          style={[styles.sortButton, sortBy === 'recent' && styles.sortActive]}
          onPress={() => onSortChange('recent')}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityState={{ selected: sortBy === 'recent' }}
        >
          <Text style={[styles.sortText, sortBy === 'recent' && styles.sortTextActive]}>
            Recent
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortButton, sortBy === 'popular' && styles.sortActive]}
          onPress={() => onSortChange('popular')}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityState={{ selected: sortBy === 'popular' }}
        >
          <Text style={[styles.sortText, sortBy === 'popular' && styles.sortTextActive]}>
            Popular
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    paddingVertical: 8,
  },
  chipScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#484848',
    backgroundColor: 'transparent',
  },
  chipSelected: {
    backgroundColor: '#C3B1FF',
    borderColor: '#C3B1FF',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#C7C7C7',
  },
  chipTextSelected: {
    color: '#0A0A0A',
  },
  sortRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    backgroundColor: '#222222',
  },
  sortActive: {
    backgroundColor: '#C3B1FF',
  },
  sortText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#C7C7C7',
  },
  sortTextActive: {
    color: '#0A0A0A',
  },
});
