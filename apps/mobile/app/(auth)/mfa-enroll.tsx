import { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { MfaEnrollForm } from '../../src/components/auth';

const PLACEHOLDER_QR_URI = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/Wander:alex@example.com?secret=JBSWY3DPEHPK3PXP&issuer=Wander';

export default function MfaEnrollScreen(): JSX.Element {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const handleVerify = (code: string) => {
    setLoading(true);
    setError(undefined);
    // Simulate TOTP verification
    setTimeout(() => {
      setLoading(false);
      // On success: router.replace('/(tabs)/profile');
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Security Setup</Text>
          <Text style={styles.subtitle}>
            Add an extra layer of security to your account
          </Text>
        </View>

        <MfaEnrollForm
          qrCodeUri={PLACEHOLDER_QR_URI}
          onVerify={handleVerify}
          loading={loading}
          error={error}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E0031',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#C7C7C7',
    textAlign: 'center',
  },
});
