/** Circular avatar showing an image or initials fallback. */
import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle } from 'react-native';

export interface AvatarProps {
  uri?: string;
  initials?: string;
  size?: 'sm' | 'md' | 'lg';
}

const SIZES: Record<NonNullable<AvatarProps['size']>, number> = {
  sm: 32,
  md: 48,
  lg: 72,
};

export default function Avatar({
  uri,
  initials,
  size = 'md',
}: AvatarProps): JSX.Element {
  const dimension = SIZES[size];

  const containerStyle: ViewStyle = {
    width: dimension,
    height: dimension,
    borderRadius: dimension / 2,
  };

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[styles.image, containerStyle]}
        accessibilityLabel={initials ? `Avatar for ${initials}` : 'User avatar'}
      />
    );
  }

  return (
    <View style={[styles.fallback, containerStyle]}>
      <Text style={[styles.initials, { fontSize: dimension * 0.4 }]}>
        {initials ?? '?'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: '#484848',
  },
  fallback: {
    backgroundColor: '#C3B1FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontWeight: '700',
    color: '#0A0A0A',
  },
});
