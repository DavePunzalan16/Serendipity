import { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SignupForm, GoogleOAuthButton } from '../../src/components/auth';

export default function SignupScreen(): JSX.Element {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const handleSignup = (email: string, password: string) => {
    setLoading(true);
    setError(undefined);
    // Simulate signup
    setTimeout(() => {
      setLoading(false);
      // On success: router.replace('/(tabs)/feed');
    }, 1500);
  };

  const handleGoogleOAuth = () => {
    setGoogleLoading(true);
    // Simulate Google OAuth flow
    setTimeout(() => {
      setGoogleLoading(false);
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.logo}>Wander</Text>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Start discovering walks in your neighborhood
            </Text>
          </View>

          <SignupForm
            onSubmit={handleSignup}
            loading={loading}
            error={error}
          />

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.oauthSection}>
            <GoogleOAuthButton
              onPress={handleGoogleOAuth}
              loading={googleLoading}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Already have an account?{' '}
              <Text
                style={styles.footerLink}
                onPress={() => router.push('/(auth)/login')}
              >
                Sign In
              </Text>
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
    marginBottom: 32,
  },
  logo: {
    fontSize: 40,
    fontWeight: '700',
    color: '#C3B1FF',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#C7C7C7',
    textAlign: 'center',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#484848',
  },
  dividerText: {
    fontSize: 13,
    color: '#484848',
    marginHorizontal: 12,
    fontWeight: '500',
  },
  oauthSection: {
    paddingHorizontal: 16,
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
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
