/**
 * JoinClubButton — Toggle button for joining or leaving a club.
 */
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export interface JoinClubButtonProps {
  /** Whether the user has joined the club */
  isJoined: boolean;
  /** Callback when the button is pressed */
  onToggle: () => void;
  /** Whether the button is in a loading state */
  loading?: boolean;
}

/**
 * JoinClubButton renders a Join/Leave toggle with green theme styling.
 */
export default function JoinClubButton({
  isJoined,
  onToggle,
  loading = false,
}: JoinClubButtonProps): JSX.Element {
  return (
    <TouchableOpacity
      style={[styles.button, isJoined && styles.buttonJoined]}
      onPress={onToggle}
      disabled={loading}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={isJoined ? 'Leave club' : 'Join club'}
      accessibilityState={{ disabled: loading }}
    >
      <Text style={[styles.text, isJoined && styles.textJoined]}>
        {loading ? '...' : isJoined ? 'Leave Club' : 'Join Club'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#00D26A',
    alignItems: 'center',
    minWidth: 100,
  },
  buttonJoined: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#374151',
  },
  text: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0A0F1A',
  },
  textJoined: {
    color: '#E2E8F0',
  },
});
