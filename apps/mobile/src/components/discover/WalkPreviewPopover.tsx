/**
 * Bottom sheet preview shown when a walk pin is tapped on the Discover map.
 * Compact walk summary that slides up from the bottom.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Walk, VibeTag } from '@wander/shared-types';

export interface WalkPreviewPopoverProps {
  /** Walk data to preview */
  walk: Pick<Walk, 'id' | 'title' | 'narrative' | 'duration_minutes' | 'distance_km' | 'vibe_tags' | 'like_count'> | null;
  /** Whether the popover is visible */
  visible: boolean;
}

/**
 * WalkPreviewPopover renders a bottom-positioned card with walk summary.
 * Shown when a pin is tapped on the Discover map.
 */
export default function WalkPreviewPopover({
  walk,
  visible,
}: WalkPreviewPopoverProps): JSX.Element | null {
  if (!visible || !walk) return null;

  return (
    <View style={styles.container}>
      <View style={styles.handle} />
      <Text style={styles.title}>{walk.title}</Text>
      <Text style={styles.narrative} numberOfLines={2}>
        {walk.narrative}
      </Text>
      <View style={styles.metaRow}>
        <Text style={styles.meta}>{walk.duration_minutes}m</Text>
        <Text style={styles.metaDivider}>•</Text>
        <Text style={styles.meta}>{walk.distance_km.toFixed(1)}km</Text>
        <Text style={styles.metaDivider}>•</Text>
        <Text style={styles.meta}>{walk.like_count} ❤️</Text>
      </View>
      <View style={styles.vibeRow}>
        {walk.vibe_tags.map((vibe: VibeTag) => (
          <View key={vibe} style={styles.vibeChip}>
            <Text style={styles.vibeText}>{vibe}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingTop: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#484848',
    alignSelf: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  narrative: {
    fontSize: 13,
    color: '#C7C7C7',
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  meta: {
    fontSize: 13,
    fontWeight: '500',
    color: '#C3B1FF',
  },
  metaDivider: {
    fontSize: 13,
    color: '#484848',
  },
  vibeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  vibeChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
    backgroundColor: '#222222',
  },
  vibeText: {
    fontSize: 11,
    color: '#C7C7C7',
  },
});
