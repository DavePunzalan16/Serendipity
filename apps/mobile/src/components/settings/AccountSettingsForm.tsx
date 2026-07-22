/**
 * Account settings form with username, email display, and delete account option.
 */
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import type { User } from '@wander/shared-types';

export interface AccountSettingsFormProps {
  /** Current user data */
  user: Pick<User, 'username' | 'display_name'>;
  /** User email (from auth, not editable) */
  email: string;
  /** Callback when username changes */
  onUsernameChange: (username: string) => void;
  /** Callback when display name changes */
  onDisplayNameChange: (name: string) => void;
}

/**
 * AccountSettingsForm renders editable fields for username and display name,
 * plus a read-only email display.
 */
export default function AccountSettingsForm({
  user,
  email,
  onUsernameChange,
  onDisplayNameChange,
}: AccountSettingsFormProps): JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Account</Text>

      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>Display Name</Text>
          <TextInput
            style={styles.input}
            value={user.display_name}
            onChangeText={onDisplayNameChange}
            placeholder="Your display name"
            placeholderTextColor="#484848"
            autoCapitalize="words"
            accessibilityLabel="Display name"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            value={user.username}
            onChangeText={onUsernameChange}
            placeholder="your_username"
            placeholderTextColor="#484848"
            autoCapitalize="none"
            autoCorrect={false}
            accessibilityLabel="Username"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.readOnly}>
            <Text style={styles.readOnlyText}>{email}</Text>
          </View>
          <Text style={styles.hint}>Email cannot be changed here</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  form: {
    gap: 16,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#C7C7C7',
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#484848',
  },
  readOnly: {
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#484848',
    opacity: 0.6,
  },
  readOnlyText: {
    fontSize: 16,
    color: '#C7C7C7',
  },
  hint: {
    fontSize: 11,
    color: '#484848',
  },
});
