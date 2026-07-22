/**
 * Map view wrapping react-native-maps with Google provider.
 * Shows route polyline and stop markers for the active walk.
 */
import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import RNMapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import type { Walk, Stop } from '@wander/shared-types';

export interface MapViewProps {
  /** Walk route geometry (GeoJSON LineString coordinates) */
  routeCoordinates: Walk['route_geometry']['coordinates'];
  /** Stops to display as markers */
  stops: Stop[];
  /** Callback when a stop marker is pressed */
  onStopPress?: (stop: Stop) => void;
  /** Optional custom map style JSON */
  customMapStyle?: object[];
}

/**
 * MapView renders a Google Maps view with route polyline and stop markers.
 * Coordinates are converted from GeoJSON [lng, lat] to RN Maps {latitude, longitude}.
 */
export default function MapView({
  routeCoordinates,
  stops,
  onStopPress,
  customMapStyle,
}: MapViewProps): JSX.Element {
  const polylineCoords = routeCoordinates.map(([lng, lat]) => ({
    latitude: lat,
    longitude: lng,
  }));

  const initialRegion = polylineCoords.length > 0
    ? {
        latitude: polylineCoords[0].latitude,
        longitude: polylineCoords[0].longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }
    : {
        latitude: 40.7128,
        longitude: -74.006,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };

  return (
    <View style={styles.container}>
      <RNMapView
        style={styles.map}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        initialRegion={initialRegion}
        customMapStyle={customMapStyle}
        showsUserLocation
        showsMyLocationButton
      >
        {polylineCoords.length > 0 && (
          <Polyline
            coordinates={polylineCoords}
            strokeColor="#C3B1FF"
            strokeWidth={4}
          />
        )}
        {stops.map((stop) => (
          <Marker
            key={stop.id}
            coordinate={{
              latitude: stop.position.coordinates[1],
              longitude: stop.position.coordinates[0],
            }}
            title={stop.name}
            description={stop.description}
            pinColor={stop.visited ? '#4CAF50' : '#C3B1FF'}
            onPress={() => onStopPress?.(stop)}
          />
        ))}
      </RNMapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
    minHeight: 300,
  },
});
