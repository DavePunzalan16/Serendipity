/** Themed button with primary, secondary, and danger variants. */
import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  loading?: boolean;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
}: ButtonProps): JSX.Element {
  const containerStyle: ViewStyle[] = [
    styles.base,
    styles[`${variant}Container`],
    disabled && styles.disabled,
  ].filter(Boolean) as ViewStyle[];

  const textStyle: TextStyle[] = [
    styles.baseText,
    styles[`${variant}Text`],
  ];

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? '#0A0A0A' : '#C3B1FF'}
        />
      ) : (
        <Text style={textStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  baseText: {
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  primaryContainer: {
    backgroundColor: '#C3B1FF',
  },
  primaryText: {
    color: '#0A0A0A',
  },
  secondaryContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#C3B1FF',
  },
  secondaryText: {
    color: '#C3B1FF',
  },
  dangerContainer: {
    backgroundColor: '#FF4444',
  },
  dangerText: {
    color: '#FFFFFF',
  },
  disabled: {
    opacity: 0.5,
  },
});
