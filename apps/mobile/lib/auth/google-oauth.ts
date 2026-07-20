import { createSupabaseClient, type AuthResult } from '@wander/api-client';
import * as SecureStore from 'expo-secure-store';
import * as Linking from 'expo-linking';

/**
 * Custom storage adapter using Expo SecureStore for session persistence.
 */
const secureStoreAdapter = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

/**
 * Creates a Supabase client configured for mobile with SecureStore persistence.
 */
function getMobileSupabaseClient() {
  return createSupabaseClient({
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL!,
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
    storage: secureStoreAdapter,
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
}

/**
 * The redirect URI for the mobile app using the `wander://` custom scheme.
 * This matches the scheme defined in app.config.ts.
 */
const MOBILE_REDIRECT_URI = Linking.createURL('auth/callback');

/**
 * Initiates the Google OAuth flow for the mobile app.
 *
 * Uses Supabase's signInWithOAuth which generates the Google consent URL,
 * then opens it in the system browser. After authentication, Google redirects
 * back to the Supabase auth server, which redirects to our app via the
 * `wander://auth/callback` deep link.
 *
 * The returned URL should be opened with `Linking.openURL()` or `WebBrowser.openAuthSessionAsync()`.
 */
export async function initiateGoogleOAuth(): Promise<{ url: string } | { error: string }> {
  const supabase = getMobileSupabaseClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: MOBILE_REDIRECT_URI,
      skipBrowserRedirect: true,
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { url: data.url };
}

/**
 * Handles the OAuth callback deep link by extracting the session from the URL.
 *
 * Call this when the app receives a deep link at `wander://auth/callback`.
 * Supabase appends access_token and refresh_token as URL fragment parameters.
 */
export async function handleOAuthCallback(url: string): Promise<AuthResult> {
  const supabase = getMobileSupabaseClient();

  // Parse the URL fragment to extract tokens
  const parsedUrl = new URL(url);
  const hashParams = new URLSearchParams(parsedUrl.hash.substring(1));
  const accessToken = hashParams.get('access_token');
  const refreshToken = hashParams.get('refresh_token');

  if (!accessToken || !refreshToken) {
    return { user: null, session: null, error: 'Missing tokens in callback URL' };
  }

  const { data, error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  if (error) {
    return { user: null, session: null, error: error.message };
  }

  return {
    user: data.user
      ? { id: data.user.id, email: data.user.email }
      : null,
    session: data.session
      ? {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: data.session.expires_at,
        }
      : null,
    error: null,
  };
}
