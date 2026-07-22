/** Uses expo-image-picker with permission check and graceful fallback for avatar uploads. */
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Avatar } from '../ui';

export interface AvatarUploaderProps {
  currentUri?: string | null;
  initials?: string;
  onImageSelected: (uri: string) => void;
}

export default function AvatarUploader({
  currentUri,
  initials,
  onImageSelected,
}: AvatarUploaderProps): JSX.Element {
  const [localUri, setLocalUri] = useState<string | null>(null);

  const displayUri = localUri ?? currentUri ?? undefined;

  const requestPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'web') return true;

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please allow access to your photo library to upload an avatar.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const handlePick = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const uri = result.assets[0].uri;
        setLocalUri(uri);
        onImageSelected(uri);
      }
    } catch {
      Alert.alert('Error', 'Unable to open image picker. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handlePick}
        style={styles.avatarWrapper}
        accessibilityRole="button"
        accessibilityLabel="Change avatar photo"
      >
        {displayUri ? (
          <Image source={{ uri: displayUri }} style={styles.avatarImage} />
        ) : (
          <Avatar initials={initials} size="lg" />
        )}
        <View style={styles.overlay}>
          <Text style={styles.overlayText}>📷</Text>
        </View>
      </TouchableOpacity>
      <Text style={styles.hint}>Tap to change photo</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarWrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    overflow: 'hidden',
    position: 'relative',
  },
  avatarImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayText: {
    fontSize: 24,
  },
  hint: {
    fontSize: 12,
    color: '#C7C7C7',
    marginTop: 8,
  },
});
