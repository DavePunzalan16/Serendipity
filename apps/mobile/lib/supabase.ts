import { createSupabaseClient } from "@wander/api-client";
import * as SecureStore from "expo-secure-store";
import { AppState } from "react-native";
import type { TypedSupabaseClient } from "@wander/api-client";

/**
 * SecureStore adapter for Supabase session persistence on mobile.
 * Tokens are stored encrypted on-device (Req 1.5).
 */
const secureStoreAdapter = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

/**
 * Singleton Supabase client for mobile with SecureStore session persistence.
 * Configured with autoRefreshToken to handle silent session refresh (Req 1.6).
 */
let _client: TypedSupabaseClient | null = null;

export function getSupabaseClient(): TypedSupabaseClient {
  if (!_client) {
    _client = createSupabaseClient({
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL!,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
      storage: secureStoreAdapter,
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });

    // Silent session refresh when app returns to foreground (Req 1.6).
    // Supabase's autoRefreshToken handles expiry during active use,
    // but we also need to refresh when returning from background.
    AppState.addEventListener("change", (state) => {
      if (state === "active" && _client) {
        _client.auth.startAutoRefresh();
      } else if (state !== "active" && _client) {
        _client.auth.stopAutoRefresh();
      }
    });
  }

  return _client;
}
