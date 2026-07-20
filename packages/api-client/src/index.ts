// @wander/api-client
// Typed Supabase client wrapper with domain-specific query functions

// Client factory
export { createSupabaseClient } from './client';

// Internal types
export type {
  ClientOptions,
  AuthResult,
  MFAEnrollResult,
  AALStatus,
  WalkCompletionData,
  PaginatedResult,
  HistoryRequest,
  TypedSupabaseClient,
} from './types';

// Auth functions
export * as auth from './auth';

// Profile functions
export * as profiles from './profiles';

// Follow functions
export * as follows from './follows';

// Feed functions
export * as feed from './feed';

// Walk functions
export * as walks from './walks';

// Walk engine functions
export * as walkEngine from './walk-engine';

// Photo functions
export * as photos from './photos';

// Notification functions
export * as notifications from './notifications';
