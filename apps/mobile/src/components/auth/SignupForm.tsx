/** Email, password, and confirm password signup form with submit handler. */
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Input, Button } from '../ui';

export interface SignupFormProps {
  onSubmit: (email: string, password: string) => void;
  loading?: boolean;
  error?: string;
}

export default function SignupForm({
  onSubmit,
  loading = false,
  error,
}: SignupFormProps): JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = () => {
    if (password !== confirm) {
      setLocalError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setLocalError('Password must be at least 8 characters');
      return;
    }
    setLocalError('');
    onSubmit(email.trim(), password);
  };

  const displayError = localError || error;

  return (
    <View style={styles.container}>
      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        error={displayError && !localError ? error : undefined}
      />
      <Input
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="At least 8 characters"
        secureTextEntry
      />
      <Input
        label="Confirm Password"
        value={confirm}
        onChangeText={setConfirm}
        placeholder="Re-enter your password"
        secureTextEntry
        error={localError || undefined}
      />
      <Button
        title="Create Account"
        onPress={handleSubmit}
        loading={loading}
        disabled={!email.trim() || !password || !confirm}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
