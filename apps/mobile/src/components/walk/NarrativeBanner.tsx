/**
 * Expandable narrative text banner at top of active walk.
 * Shows a snippet of the walk narrative with tap-to-expand.
 */
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export interface NarrativeBannerProps {
  /** The full narrative text */
  narrative: string;
  /** Maximum lines shown when collapsed */
  collapsedLines?: number;
}

/**
 * NarrativeBanner renders the walk narrative as an expandable banner.
 * Collapsed by default, tapping toggles full text visibility.
 */
export default function NarrativeBanner({
  narrative,
  collapsedLines = 2,
}: NarrativeBannerProps): JSX.Element {
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={expanded ? 'Collapse narrative' : 'Expand narrative'}
    >
      <Text
        style={styles.narrative}
        numberOfLines={expanded ? undefined : collapsedLines}
      >
        {narrative}
      </Text>
      <Text style={styles.toggle}>
        {expanded ? 'Show less' : 'Read more'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    gap: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#C3B1FF',
  },
  narrative: {
    fontSize: 14,
    color: '#C7C7C7',
    lineHeight: 20,
  },
  toggle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#C3B1FF',
  },
});
