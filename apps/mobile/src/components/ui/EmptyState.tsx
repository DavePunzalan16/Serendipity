/** Centered empty state with optional icon, subtitle, and action button. */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export interface EmptyStateProps {
  icon?: string;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon,
  title,
  subtitle,
  actionLabel,
  onAction,
}: EmptyStateProps): JSX.Element {
  return (
    <View style={styles.container}>
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {actionLabel && onAction && (
        <TouchableOpacity
          style={styles.button}
          onPress={onAction}
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  icon: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#C7C7C7',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#C3B1FF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 100,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0A0A0A',
    textTransform: 'uppercase',
  },
});
