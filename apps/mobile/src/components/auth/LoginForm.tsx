/** Email and password login form with submit handler. */
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Input, Button } from '../ui';

export interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
  loading?: boolean;
  error?: string;
}

export default function LoginForm({
  onSubmit,
  loading = false,
  error,
}: LoginFormProps): JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    onSubmit(email.trim(), password);
  };

  return (
    <View style={styles.container}>
      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        error={error}
      />
      <Input
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        secureTextEntry
      />
      <Button
        title="Sign In"
        onPress={handleSubmit}
        loading={loading}
        disabled={!email.trim() || !password}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
