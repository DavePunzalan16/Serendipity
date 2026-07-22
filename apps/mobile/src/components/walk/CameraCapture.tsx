/**
 * Camera capture using expo-camera.
 * Handles permission checks with graceful fallback and associates photos with nearest stop.
 */
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import type { Stop } from '@wander/shared-types';

export interface CameraCaptureProps {
  /** Current walk stops for photo association */
  stops: Stop[];
  /** Callback with captured photo URI and associated stop */
  onCapture: (photoUri: string, nearestStop: Stop | null) => void;
  /** Callback to dismiss camera */
  onClose: () => void;
}

/**
 * CameraCapture wraps expo-camera with permission checks.
 * Provides a graceful fallback when camera access is denied,
 * and associates captured photos with the nearest walk stop.
 */
export default function CameraCapture({
  stops,
  onCapture,
  onClose,
}: CameraCaptureProps): JSX.Element {
  const [permission, requestPermission] = useCameraPermissions();
  const [capturing, setCapturing] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  const findNearestStop = (): Stop | null => {
    const unvisited = stops.filter((s) => !s.visited);
    return unvisited.length > 0 ? unvisited[0] : stops[stops.length - 1] ?? null;
  };

  const handleCapture = async () => {
    if (!cameraRef.current || capturing) return;
    setCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      if (photo) {
        const nearestStop = findNearestStop();
        onCapture(photo.uri, nearestStop);
      }
    } finally {
      setCapturing(false);
    }
  };

  // Permission not yet determined
  if (!permission) {
    return (
      <View style={styles.fallback}>
        <ActivityIndicator size="large" color="#C3B1FF" />
      </View>
    );
  }

  // Permission denied — graceful fallback
  if (!permission.granted) {
    return (
      <View style={styles.fallback}>
        <Text style={styles.fallbackTitle}>Camera Access Required</Text>
        <Text style={styles.fallbackText}>
          Allow camera access to take photos during your walk.
        </Text>
        <TouchableOpacity
          style={styles.grantButton}
          onPress={requestPermission}
          activeOpacity={0.7}
          accessibilityRole="button"
        >
          <Text style={styles.grantText}>Grant Access</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
          activeOpacity={0.7}
          accessibilityRole="button"
        >
          <Text style={styles.closeText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back">
        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.closeButtonOverlay}
            onPress={onClose}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Close camera"
          >
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.captureButton, capturing && styles.disabled]}
            onPress={handleCapture}
            disabled={capturing}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Take photo"
          >
            <View style={styles.captureInner} />
          </TouchableOpacity>
          <View style={styles.spacer} />
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#FFFFFF',
  },
  closeButtonOverlay: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  spacer: {
    width: 40,
  },
  fallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#1E0031',
    gap: 12,
  },
  fallbackTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  fallbackText: {
    fontSize: 14,
    color: '#C7C7C7',
    textAlign: 'center',
  },
  grantButton: {
    marginTop: 8,
    backgroundColor: '#C3B1FF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 100,
  },
  grantText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0A0A0A',
    textTransform: 'uppercase',
  },
  closeButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  closeText: {
    fontSize: 14,
    color: '#C7C7C7',
  },
  disabled: {
    opacity: 0.5,
  },
});
