import type { SupabaseClient } from '@supabase/supabase-js';

/** Options for creating a Supabase client instance */
export interface ClientOptions {
  supabaseUrl: string;
  supabaseAnonKey: string;
  /** Optional custom storage for session persistence (e.g., SecureStore on mobile) */
  storage?: {
    getItem: (key: string) => string | null | Promise<string | null>;
    setItem: (key: string, value: string) => void | Promise<void>;
    removeItem: (key: string) => void | Promise<void>;
  };
  /** Optional custom auth configuration */
  auth?: {
    autoRefreshToken?: boolean;
    persistSession?: boolean;
    detectSessionInUrl?: boolean;
  };
}

/** Result from authentication operations */
export interface AuthResult {
  user: {
    id: string;
    email: string | undefined;
  } | null;
  session: {
    access_token: string;
    refresh_token: string;
    expires_at: number | undefined;
  } | null;
  error: string | null;
}

/** MFA enrollment result */
export interface MFAEnrollResult {
  qr_code: string;
  secret: string;
  recovery_codes: string[];
}

/** AAL (Authenticator Assurance Level) status */
export interface AALStatus {
  currentLevel: 'aal1' | 'aal2';
  nextLevel: 'aal1' | 'aal2' | null;
}

/** Walk completion data for finalizing an active walk */
export interface WalkCompletionData {
  title: string;
  narrative: string;
  distance_km: number;
  duration_minutes: number;
  completed_at: string;
}

/** Generic paginated result for list queries */
export interface PaginatedResult<T> {
  items: T[];
  next_cursor: string | null;
}

/** History request parameters */
export interface HistoryRequest {
  user_id?: string;
  vibe_tag?: string;
  date_from?: string;
  date_to?: string;
  cursor?: string;
  limit?: number;
}

/** Typed Supabase client alias */
export type TypedSupabaseClient = SupabaseClient;
