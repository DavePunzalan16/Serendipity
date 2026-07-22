/**
 * Progressively reveals polyline points on the map.
 * Uses animated state to incrementally draw the route.
 */
import React, { useEffect, useState, useRef } from 'react';
import { Animated } from 'react-native';
import { Polyline } from 'react-native-maps';
import type { Walk } from '@wander/shared-types';

export interface RouteDrawAnimationProps {
  /** Full route coordinates (GeoJSON [lng, lat] pairs) */
  coordinates: Walk['route_geometry']['coordinates'];
  /** Duration of the full reveal animation in ms */
  duration?: number;
  /** Whether the animation should play */
  active: boolean;
  /** Polyline color */
  strokeColor?: string;
  /** Polyline width */
  strokeWidth?: number;
  /** Callback when animation completes */
  onComplete?: () => void;
}

/**
 * RouteDrawAnimation progressively reveals polyline points to create
 * a "drawing" effect on the map. Coordinates are revealed incrementally
 * based on the animated progress value.
 */
export default function RouteDrawAnimation({
  coordinates,
  duration = 2000,
  active,
  strokeColor = '#C3B1FF',
  strokeWidth = 4,
  onComplete,
}: RouteDrawAnimationProps): JSX.Element | null {
  const [visibleCount, setVisibleCount] = useState(0);
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (active && coordinates.length > 0) {
      progress.setValue(0);
      setVisibleCount(0);

      const listener = progress.addListener(({ value }) => {
        const count = Math.floor(value * coordinates.length);
        setVisibleCount(count);
      });

      Animated.timing(progress, {
        toValue: 1,
        duration,
        useNativeDriver: false,
      }).start(() => {
        setVisibleCount(coordinates.length);
        onComplete?.();
      });

      return () => {
        progress.removeListener(listener);
      };
    }
  }, [active, coordinates, duration, progress, onComplete]);

  if (visibleCount === 0) return null;

  const visibleCoords = coordinates
    .slice(0, visibleCount)
    .map(([lng, lat]) => ({
      latitude: lat,
      longitude: lng,
    }));

  if (visibleCoords.length < 2) return null;

  return (
    <Polyline
      coordinates={visibleCoords}
      strokeColor={strokeColor}
      strokeWidth={strokeWidth}
    />
  );
}
