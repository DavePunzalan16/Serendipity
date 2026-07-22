/** Google OAuth button using expo-auth-session pattern (not web OAuth). */
import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, ActivityIndicator } from 'react-native';

export interface GoogleOAuthButtonProps {
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export default function GoogleOAuthButton({
  onPress,
  loading = false,
  disabled = false,
}: GoogleOAuthButtonProps): JSX.Element {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel="Sign in with Google"
    >
      {loading ? (
        <ActivityIndicator size="small" color="#0A0A0A" />
      ) : (
        <View style={styles.content}>
          <Text style={styles.gIcon}>G</Text>
          <Text style={styles.label}>Continue with Google</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FFFFFF',
    borderRadius: 100,
    paddingHorizontal: 24,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  disabled: {
    opacity: 0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  gIcon: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4285F4',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0A0A0A',
  },
});
