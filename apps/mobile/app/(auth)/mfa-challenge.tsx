import { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { MfaChallengeForm } from '../../src/components/auth';

export default function MfaChallengeScreen(): JSX.Element {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const handleSubmit = (code: string) => {
    setLoading(true);
    setError(undefined);
    // Simulate TOTP challenge verification
    setTimeout(() => {
      setLoading(false);
      // On success: router.replace('/(tabs)/feed');
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <Text style={styles.icon}>🔐</Text>
            </View>
            <Text style={styles.title}>Verification Required</Text>
            <Text style={styles.subtitle}>
              Your account has two-factor authentication enabled
            </Text>
          </View>

          <MfaChallengeForm
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Lost your authenticator?{' '}
              <Text style={styles.footerLink}>Use recovery code</Text>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E0031',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    fontSize: 28,
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
    lineHeight: 22,
  },
  footer: {
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    color: '#C7C7C7',
  },
  footerLink: {
    color: '#C3B1FF',
    fontWeight: '700',
  },
});
