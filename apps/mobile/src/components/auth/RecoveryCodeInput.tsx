/** Input for entering a recovery code to regain account access. */
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Input, Button } from '../ui';

export interface RecoveryCodeInputProps {
  onSubmit: (code: string) => void;
  loading?: boolean;
  error?: string;
}

export default function RecoveryCodeInput({
  onSubmit,
  loading = false,
  error,
}: RecoveryCodeInputProps): JSX.Element {
  const [code, setCode] = useState('');

  const handleSubmit = () => {
    const trimmed = code.trim();
    if (trimmed) {
      onSubmit(trimmed);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Recovery Code</Text>
      <Text style={styles.subtitle}>
        Enter one of your saved recovery codes to access your account.
      </Text>

      <Input
        label="Recovery Code"
        value={code}
        onChangeText={setCode}
        placeholder="Enter your recovery code"
        error={error}
      />

      <Button
        title="Verify Recovery Code"
        onPress={handleSubmit}
        loading={loading}
        disabled={!code.trim()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#C7C7C7',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
});
