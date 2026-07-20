import { createClient } from '@supabase/supabase-js';
import type { ClientOptions, TypedSupabaseClient } from './types';

/**
 * Creates a typed Supabase client instance configured for the Wander application.
 * Both web and mobile apps use this factory to get a consistent client.
 */
export function createSupabaseClient(options: ClientOptions): TypedSupabaseClient {
  const { supabaseUrl, supabaseAnonKey, storage, auth } = options;

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: auth?.autoRefreshToken ?? true,
      persistSession: auth?.persistSession ?? true,
      detectSessionInUrl: auth?.detectSessionInUrl ?? true,
      ...(storage ? { storage } : {}),
    },
  });
}
