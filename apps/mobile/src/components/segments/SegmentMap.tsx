/**
 * SegmentMap — Placeholder map view showing a highlighted walking segment path.
 * Replace the placeholder View with an actual map implementation (e.g. react-native-maps).
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export interface Coordinate {
  /** Latitude */
  latitude: number;
  /** Longitude */
  longitude: number;
}

export interface SegmentMapProps {
  /** Segment name displayed over the map */
  segmentName: string;
  /** Start coordinate of the segment */
  start: Coordinate;
  /** End coordinate of the segment */
  end: Coordinate;
  /** Optional waypoints along the segment */
  waypoints?: Coordinate[];
  /** Map container height */
  height?: number;
}

/**
 * SegmentMap renders a placeholder map view for a highlighted segment.
 * This component should be replaced with react-native-maps integration.
 */
export default function SegmentMap({
  segmentName,
  start,
  end,
  waypoints = [],
  height = 200,
}: SegmentMapProps): JSX.Element {
  return (
    <View style={[styles.container, { height }]}>
      <View style={styles.mapPlaceholder}>
        <Text style={styles.placeholderText}>🗺️</Text>
        <Text style={styles.segmentName}>{segmentName}</Text>
        <Text style={styles.coords}>
          {start.latitude.toFixed(4)}, {start.longitude.toFixed(4)} →{' '}
          {end.latitude.toFixed(4)}, {end.longitude.toFixed(4)}
        </Text>
        {waypoints.length > 0 && (
          <Text style={styles.waypoints}>
            {waypoints.length} waypoint{waypoints.length !== 1 ? 's' : ''}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#374151',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  placeholderText: {
    fontSize: 32,
  },
  segmentName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E2E8F0',
  },
  coords: {
    fontSize: 11,
    color: '#374151',
  },
  waypoints: {
    fontSize: 11,
    color: '#00E5FF',
  },
});
