/** 6-digit TOTP code input with submit for MFA challenge verification. */
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Input, Button } from '../ui';

export interface MfaChallengeFormProps {
  onSubmit: (code: string) => void;
  loading?: boolean;
  error?: string;
}

export default function MfaChallengeForm({
  onSubmit,
  loading = false,
  error,
}: MfaChallengeFormProps): JSX.Element {
  const [code, setCode] = useState('');

  const handleSubmit = () => {
    if (code.trim().length === 6) {
      onSubmit(code.trim());
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Two-Factor Authentication</Text>
      <Text style={styles.subtitle}>
        Enter the 6-digit code from your authenticator app.
      </Text>

      <Input
        label="Verification Code"
        value={code}
        onChangeText={(text) => setCode(text.replace(/[^0-9]/g, '').slice(0, 6))}
        placeholder="000000"
        error={error}
      />

      <Button
        title="Verify"
        onPress={handleSubmit}
        loading={loading}
        disabled={code.trim().length !== 6}
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
