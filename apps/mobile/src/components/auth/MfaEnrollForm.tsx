/** Shows QR code image from URI and verification code input for MFA enrollment. */
import React, { useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Input, Button } from '../ui';

export interface MfaEnrollFormProps {
  qrCodeUri: string;
  onVerify: (code: string) => void;
  loading?: boolean;
  error?: string;
}

export default function MfaEnrollForm({
  qrCodeUri,
  onVerify,
  loading = false,
  error,
}: MfaEnrollFormProps): JSX.Element {
  const [code, setCode] = useState('');

  const handleSubmit = () => {
    if (code.trim().length === 6) {
      onVerify(code.trim());
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Set Up Two-Factor Authentication</Text>
      <Text style={styles.subtitle}>
        Scan the QR code below with your authenticator app, then enter the 6-digit code.
      </Text>

      <View style={styles.qrContainer}>
        <Image
          source={{ uri: qrCodeUri }}
          style={styles.qrImage}
          accessibilityLabel="QR code for authenticator app"
          resizeMode="contain"
        />
      </View>

      <Input
        label="Verification Code"
        value={code}
        onChangeText={(text) => setCode(text.replace(/[^0-9]/g, '').slice(0, 6))}
        placeholder="000000"
        error={error}
      />

      <Button
        title="Verify & Enable"
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
  qrContainer: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignSelf: 'center',
  },
  qrImage: {
    width: 200,
    height: 200,
  },
});
