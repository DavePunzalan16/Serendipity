/**
 * Map view with walk pins for the Discover tab.
 * Displays community walks as pin markers using react-native-maps.
 */
import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import RNMapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import type { Walk } from '@wander/shared-types';

export interface DiscoverMapProps {
  /** Walks to display as pins */
  walks: Pick<Walk, 'id' | 'title' | 'start_point' | 'vibe_tags'>[];
  /** Callback when a walk pin is pressed */
  onWalkPress: (walkId: string) => void;
  /** Initial region to center the map */
  initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
}

/**
 * DiscoverMap renders a full-screen map with walk pin markers.
 * Tapping a pin triggers the walk preview popover.
 */
export default function DiscoverMap({
  walks,
  onWalkPress,
  initialRegion,
}: DiscoverMapProps): JSX.Element {
  const defaultRegion = initialRegion ?? {
    latitude: 40.7128,
    longitude: -74.006,
    latitudeDelta: 0.08,
    longitudeDelta: 0.08,
  };

  return (
    <View style={styles.container}>
      <RNMapView
        style={styles.map}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        initialRegion={defaultRegion}
        showsUserLocation
        showsMyLocationButton
      >
        {walks.map((walk) => (
          <Marker
            key={walk.id}
            coordinate={{
              latitude: walk.start_point.coordinates[1],
              longitude: walk.start_point.coordinates[0],
            }}
            title={walk.title}
            pinColor="#C3B1FF"
            onPress={() => onWalkPress(walk.id)}
          />
        ))}
      </RNMapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
