/**
 * Location picker using expo-location.
 * Requests permission, gets current position, and provides a fallback UI
 * when permissions are denied.
 */
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import type { Point } from 'geojson';

export interface LocationPickerProps {
  /** Callback when location is resolved */
  onLocationResolved: (point: Point) => void;
  /** Optional fallback location if permission denied */
  fallbackLocation?: Point;
}

type LocationState =
  | { status: 'loading' }
  | { status: 'resolved'; point: Point }
  | { status: 'denied' }
  | { status: 'error'; message: string };

/**
 * LocationPicker wraps expo-location with permission checks and graceful fallback.
 * Shows loading state while fetching, error/fallback when denied.
 */
export default function LocationPicker({
  onLocationResolved,
  fallbackLocation,
}: LocationPickerProps): JSX.Element {
  const [state, setState] = useState<LocationState>({ status: 'loading' });

  const requestLocation = async () => {
    setState({ status: 'loading' });

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      if (fallbackLocation) {
        setState({ status: 'resolved', point: fallbackLocation });
        onLocationResolved(fallbackLocation);
      } else {
        setState({ status: 'denied' });
      }
      return;
    }

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const point: Point = {
        type: 'Point',
        coordinates: [location.coords.longitude, location.coords.latitude],
      };
      setState({ status: 'resolved', point });
      onLocationResolved(point);
    } catch (err) {
      setState({ status: 'error', message: 'Unable to get location' });
    }
  };

  useEffect(() => {
    requestLocation();
  }, []);

  if (state.status === 'loading') {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color="#C3B1FF" />
        <Text style={styles.text}>Getting your location…</Text>
      </View>
    );
  }

  if (state.status === 'denied') {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Location permission denied</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={requestLocation}
          accessibilityRole="button"
        >
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (state.status === 'error') {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{state.message}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={requestLocation}
          accessibilityRole="button"
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.resolvedRow}>
        <View style={styles.dot} />
        <Text style={styles.text}>Location set</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  text: {
    fontSize: 14,
    color: '#C7C7C7',
  },
  errorText: {
    fontSize: 14,
    color: '#FF4444',
  },
  retryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#C3B1FF',
  },
  retryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#C3B1FF',
  },
  resolvedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
  },
});
