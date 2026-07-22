/**
 * Security settings screen with MFA status, enable/disable, and change password.
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  StyleSheet,
} from 'react-native';

export interface SecuritySettingsScreenProps {
  /** Whether MFA is currently enabled */
  mfaEnabled: boolean;
  /** Callback to toggle MFA */
  onToggleMfa: (enabled: boolean) => void;
  /** Callback to initiate password change */
  onChangePassword: () => void;
  /** Whether MFA toggle is in progress */
  mfaLoading?: boolean;
}

/**
 * SecuritySettingsScreen provides controls for MFA management
 * and password change functionality.
 */
export default function SecuritySettingsScreen({
  mfaEnabled,
  onToggleMfa,
  onChangePassword,
  mfaLoading = false,
}: SecuritySettingsScreenProps): JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Security</Text>

      <View style={styles.section}>
        <View style={styles.row}>
          <View style={styles.rowContent}>
            <Text style={styles.rowTitle}>Two-Factor Authentication</Text>
            <Text style={styles.rowDescription}>
              {mfaEnabled
                ? 'Your account is protected with TOTP'
                : 'Add an extra layer of security'}
            </Text>
          </View>
          <Switch
            value={mfaEnabled}
            onValueChange={onToggleMfa}
            disabled={mfaLoading}
            trackColor={{ false: '#484848', true: '#C3B1FF' }}
            thumbColor={mfaEnabled ? '#FFFFFF' : '#C7C7C7'}
            accessibilityLabel="Toggle two-factor authentication"
          />
        </View>

        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.row}
          onPress={onChangePassword}
          activeOpacity={0.7}
          accessibilityRole="button"
        >
          <View style={styles.rowContent}>
            <Text style={styles.rowTitle}>Change Password</Text>
            <Text style={styles.rowDescription}>
              Update your account password
            </Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statusRow}>
        <View
          style={[
            styles.statusDot,
            mfaEnabled ? styles.statusActive : styles.statusInactive,
          ]}
        />
        <Text style={styles.statusText}>
          MFA Status: {mfaEnabled ? 'Active' : 'Inactive'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  section: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  rowContent: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  rowDescription: {
    fontSize: 13,
    color: '#C7C7C7',
  },
  chevron: {
    fontSize: 24,
    color: '#484848',
  },
  divider: {
    height: 1,
    backgroundColor: '#484848',
    marginHorizontal: 16,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusActive: {
    backgroundColor: '#4CAF50',
  },
  statusInactive: {
    backgroundColor: '#FF4444',
  },
  statusText: {
    fontSize: 13,
    color: '#C7C7C7',
  },
});
