# Implementation Plan: Wander v2 Social Walk

## Overview

This plan implements the Wander v2 social walking-discovery app as a Turborepo + pnpm monorepo with Next.js web app, Expo mobile app, and shared packages. The backend uses Supabase (Postgres + PostGIS, Auth, Storage, Edge Functions) with external integrations for AI walk curation (Claude), place sourcing (Google Places), and routing (Google Directions). Implementation proceeds from scaffolding → database → shared packages → API layer → frontends → deployment.

## Tasks

- [x] 1. Monorepo scaffolding and project setup
  - [x] 1.1 Initialize Turborepo monorepo with pnpm workspaces
    - Create root `package.json`, `pnpm-workspace.yaml`, and `turbo.json`
    - Configure workspace packages: `apps/web`, `apps/mobile`, `packages/shared-types`, `packages/api-client`, `packages/ui-tokens`
    - Add root dev dependencies: `turbo`, `typescript`, `eslint`, `prettier`
    - Configure Turborepo pipeline for `build`, `dev`, `lint`, `test` tasks
    - _Requirements: 14.1, 14.5_

  - [x] 1.2 Scaffold Next.js web app (`apps/web`)
    - Initialize Next.js 14+ with App Router, TypeScript, Tailwind CSS
    - Set up route groups: `(auth)`, `(main)` with nested routes for feed, discover, walk, profile
    - Create `middleware.ts` stub for AAL checking and session refresh
    - Add dependencies: `@supabase/ssr`, `framer-motion`, `gsap`, `@react-three/fiber`
    - _Requirements: 14.1_

  - [x] 1.3 Scaffold Expo mobile app (`apps/mobile`)
    - Initialize Expo project with Expo Router (file-based routing)
    - Set up tab navigation: feed, discover, walk, profile
    - Set up auth route group
    - Add dependencies: `expo-location`, `expo-camera`, `expo-notifications`, `expo-secure-store`, `react-native-reanimated`, `moti`
    - _Requirements: 14.1_

  - [x] 1.4 Configure shared TypeScript and ESLint configuration
    - Create shared `tsconfig.base.json` referenced by all packages
    - Create shared ESLint config package
    - Ensure all packages reference the shared config
    - _Requirements: 14.1_

- [x] 2. Database schema and migrations
  - [x] 2.1 Create initial Supabase migration with PostGIS and core tables
    - Enable PostGIS extension
    - Create `profiles`, `follows`, `walks`, `stops` tables with all columns, constraints, and foreign keys
    - Include `no_self_follow` CHECK constraint on follows
    - Include visibility CHECK constraint on walks
    - _Requirements: 16.6, 5.3, 3.1_

  - [x] 2.2 Create social and media tables migration
    - Create `walk_photos`, `walk_likes`, `walk_comments`, `push_tokens`, `badges`, `user_badges` tables
    - Include comment length CHECK constraint (1–1000 chars)
    - Include unique constraint on `walk_likes(user_id, walk_id)` and `push_tokens(user_id, token)`
    - _Requirements: 7.6, 12.6_

  - [x] 2.3 Create indexes migration
    - Add spatial GiST indexes on `walks.start_point`, `walks.route_geometry`, `stops.position`
    - Add feed query indexes on `walks(user_id, created_at DESC)`, `walks(visibility)`
    - Add follow indexes on `follows(follower_id)`, `follows(following_id)`
    - Add comment/like indexes and trigram indexes for profile search
    - _Requirements: 8.7, 6.1, 5.5_

  - [x] 2.4 Create Row Level Security policies migration
    - Enable RLS on all tables
    - Implement profiles policies (public read, owner update)
    - Implement follows policies (authenticated insert/delete own, public read)
    - Implement walks visibility-based select policy (owner OR public OR friends_only with follow check)
    - Implement walk_photos, stops, walk_likes, walk_comments policies
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5_

  - [x] 2.5 Create database functions migration
    - Implement `get_feed()` function with cursor-based pagination
    - Implement `discover_walks()` function with spatial filtering and sorting
    - Implement `toggle_like()` atomic function with count update
    - _Requirements: 6.1, 6.3, 8.1, 7.1_

  - [x] 2.6 Write property tests for visibility RLS logic
    - **Property 1: Walk visibility access control**
    - **Property 2: Unauthorized access returns opaque 404**
    - **Property 3: New walks default to friends_only visibility**
    - **Validates: Requirements 3.3, 3.4, 3.5, 3.7, 3.1, 16.3**

- [x] 3. Shared packages implementation
  - [x] 3.1 Implement `packages/shared-types` with all interfaces and enums
    - Define `User`, `Profile`, `Walk`, `Stop`, `WalkPhoto`, `FeedCard`, `Comment`, `FollowRelationship`, `Badge` interfaces
    - Define `VibeTag`, `VisibilitySetting` types
    - Define `FeedRequest`, `FeedResponse`, `DiscoverRequest`, `DiscoverResponse`, `Viewport`, `WalkMapItem`, `WalkGenerationRequest`, `NotificationPreferences` API types
    - Add Zod schemas for runtime validation of all request/response types
    - _Requirements: 14.2_

  - [x] 3.2 Implement `packages/api-client` with typed Supabase client
    - Create Supabase client factory (`createSupabaseClient`) with typed database schema
    - Implement auth functions (signUp, signIn, OAuth, MFA enroll/verify, recovery code, AAL check, refresh, signOut)
    - Implement profile functions (getByUsername, update, uploadAvatar, search)
    - Implement follow functions (follow, unfollow, isFollowing, getFollowers, getFollowing)
    - Implement feed function with cursor pagination
    - Implement walk functions (getById, like toggle, comment, getComments, updateVisibility, getHistory, discover, cloneRoute)
    - Implement walkEngine functions (generate, swapStop, completeWalk)
    - Implement photo functions (upload, getForWalk)
    - Implement notification functions (getPreferences, updatePreferences, registerPushToken)
    - _Requirements: 14.3, 18.1, 18.2, 18.3, 18.4, 18.5, 18.6, 18.7_

  - [x] 3.3 Implement `packages/ui-tokens` with design tokens
    - Export color tokens, spacing scale, border radius tokens, typography tokens
    - Provide tokens as CSS custom properties and as TypeScript constants
    - _Requirements: 14.4_

- [x] 4. Authentication system
  - [x] 4.1 Implement email signup and login flows
    - Create signup API route with Supabase Auth email/password
    - Create login API route
    - Implement error message opacity (same error for invalid email or password)
    - Implement session token management via SSR cookies (web) and SecureStore (mobile)
    - Implement silent session refresh on token expiry
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

  - [x] 4.2 Implement Google OAuth flow
    - Configure Supabase Google OAuth provider
    - Implement OAuth redirect and callback handling for web
    - Implement OAuth redirect and callback handling for mobile (expo-auth-session)
    - _Requirements: 1.2_

  - [x] 4.3 Implement MFA enrollment and challenge
    - Create MFA enrollment endpoint (TOTP secret generation, QR code, confirmation)
    - Generate and display recovery codes on enrollment confirmation
    - Create MFA challenge endpoint (TOTP verification)
    - Implement recovery code verification with single-use invalidation
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [x] 4.4 Implement AAL enforcement middleware
    - Create web middleware that checks AAL level on protected routes and redirects to MFA challenge if aal1
    - Create mobile navigation guard for AAL enforcement
    - _Requirements: 2.5, 2.6_

  - [x] 4.5 Write property tests for authentication
    - **Property 23: AAL enforcement on protected routes**
    - **Property 24: Recovery code single-use invalidation**
    - **Property 31: Unauthenticated API rejection**
    - **Property 33: Login error message opacity**
    - **Validates: Requirements 2.5, 2.6, 2.4, 18.8, 1.3**

- [ ] 5. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Social layer API implementation
  - [x] 6.1 Implement profile CRUD and search
    - Create GET `/api/profile/[username]` route returning profile with public walk summaries
    - Create PATCH profile update endpoint (display_name, bio, favorite_vibes)
    - Implement avatar upload with image type validation (JPEG, PNG, WebP, GIF) and 5MB limit
    - Implement user search by username/display_name with trigram matching
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 5.5, 18.1_

  - [-] 6.2 Write property tests for profile operations
    - **Property 25: Profile update round-trip**
    - **Property 26: Avatar upload validation**
    - **Property 27: Owner-only write operations**
    - **Property 32: User search relevance**
    - **Validates: Requirements 4.2, 4.5, 16.2, 16.4, 16.5, 5.5**

  - [x] 6.3 Implement follow/unfollow system
    - Create POST `/api/follow/[userId]` for following (with self-follow and duplicate prevention)
    - Create DELETE `/api/follow/[userId]` for unfollowing
    - Implement follower/following count increment/decrement atomically
    - Expose follower and following counts on profile
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.6, 18.2_

  - [-] 6.4 Write property tests for follow system
    - **Property 4: Follow/unfollow round-trip preserves counts**
    - **Property 5: Follow constraint enforcement**
    - **Validates: Requirements 5.1, 5.2, 5.3, 5.4**

  - [-] 6.5 Implement social feed with cursor pagination
    - Create GET `/api/feed` with cursor-based pagination
    - Filter to walks from followed users with visibility 'public' or 'friends_only'
    - Return FeedCard data (narrative snippet, route thumbnail, distance, duration, vibe tags, like/comment counts, is_liked)
    - Implement empty state detection
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 18.3_

  - [ ] 6.6 Write property tests for feed
    - **Property 6: Feed content correctness**
    - **Property 7: Cursor-based pagination completeness**
    - **Property 8: Feed card data completeness**
    - **Validates: Requirements 6.1, 6.2, 6.3, 6.4**

  - [-] 6.7 Implement like toggle and comments
    - Create POST `/api/walk/[walkId]/like` as toggle using `toggle_like()` DB function
    - Create POST `/api/walk/[walkId]/comment` with text validation (non-empty, ≤1000 chars)
    - Implement comment retrieval in chronological order with cursor pagination
    - Restrict liking/commenting to authenticated users
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 18.4, 18.5_

  - [ ] 6.8 Write property tests for interactions
    - **Property 9: Like toggle idempotence**
    - **Property 10: Comment persistence round-trip**
    - **Property 11: Comment ordering**
    - **Property 12: Comment validation rejects invalid input**
    - **Validates: Requirements 7.1, 7.2, 7.3, 7.5, 7.6**

  - [ ] 6.9 Implement discovery API with PostGIS spatial queries
    - Create GET `/api/discover` accepting viewport bounds, vibe tag filter, distance radius, sort
    - Use `discover_walks()` DB function with PostGIS ST_Intersects and ST_DWithin
    - Implement popularity sort (like_count DESC)
    - Implement walk clone route (POST `/api/walk/[walkId]/clone`)
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 18.6_

  - [ ] 6.10 Write property tests for discovery
    - **Property 13: Discovery filter correctness**
    - **Property 14: Discovery popularity sort**
    - **Property 15: Walk clone preserves route and stops**
    - **Validates: Requirements 8.1, 8.2, 8.3, 8.4, 8.6**

  - [-] 6.11 Implement walk visibility management
    - Create PATCH `/api/walk/[walkId]/visibility` accepting new visibility setting
    - Enforce owner-only updates
    - _Requirements: 3.2, 18.7_

  - [ ] 6.12 Implement walk history endpoint
    - Create GET `/api/walk/history` with reverse-chronological ordering
    - Support filtering by vibe tag and date range
    - Return walk entries with date, duration, distance, vibe tags, route thumbnail
    - _Requirements: 17.1, 17.2, 17.3, 17.4_

  - [ ] 6.13 Write property tests for walk history
    - **Property 29: Walk history ordering and filtering**
    - **Validates: Requirements 17.1, 17.4**

  - [ ] 6.14 Write property tests for security
    - **Property 28: Error response sanitization**
    - **Validates: Requirements 16.7**

- [ ] 7. Walk engine implementation
  - [ ] 7.1 Implement walk generation Edge Function
    - Create Supabase Edge Function `generate-walk`
    - Integrate Claude API for stop selection and narrative generation based on vibe tags
    - Integrate Google Places API for sourcing real POIs near user location
    - Integrate Google Directions API for walkable route geometry between stops
    - Validate generated walk fits time constraint (±10% tolerance)
    - Persist generated walk with route geometry, stops, narrative, duration, distance
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

  - [ ] 7.2 Implement stop swap functionality
    - Create endpoint to replace a stop during active walk
    - Source alternative stop matching walk's vibe tags via Google Places
    - Recalculate route geometry with replacement stop via Google Directions
    - Validate total duration remains within original time constraint
    - _Requirements: 9.5_

  - [ ] 7.3 Implement walk completion logic
    - Create walk completion endpoint
    - Persist final walk data (route geometry, stop details, photos, narrative, duration, distance, timestamp)
    - Update walk status from 'active' to 'completed'
    - Update user profile stats (total_walks, total_distance_km)
    - _Requirements: 9.6_

  - [ ] 7.4 Write property tests for walk engine
    - **Property 16: Walk generation output satisfies constraints**
    - **Property 17: Stop swap preserves vibe and time constraints**
    - **Property 18: Geofence arrival detection**
    - **Validates: Requirements 9.1, 9.5, 10.2**

- [ ] 8. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 9. Web frontend implementation
  - [ ] 9.1 Implement auth pages (login, signup, MFA enroll, MFA challenge)
    - Create login page with email/password form and Google OAuth button
    - Create signup page with email/password form
    - Create MFA enrollment page with QR code display and TOTP verification
    - Create MFA challenge page with TOTP input and recovery code option
    - Wire to api-client auth functions
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 2.3, 2.4_

  - [ ] 9.2 Implement landing page with 3D/parallax effects
    - Build hero section with GSAP ScrollTrigger parallax
    - Implement 3D route visualization with React Three Fiber
    - Add call-to-action and feature highlights
    - Implement `prefers-reduced-motion` check to disable animations
    - _Requirements: 13.4, 13.5_

  - [ ] 9.3 Implement feed page with infinite scroll
    - Build FeedCard component with narrative snippet, route thumbnail, stats, vibe tags
    - Implement infinite scroll with cursor-based pagination
    - Implement like toggle with animated heart-burst (Framer Motion)
    - Implement empty state with follow suggestions
    - _Requirements: 6.1, 6.3, 6.4, 6.5, 7.1, 13.2_

  - [ ] 9.4 Implement walk detail page
    - Display full route on map, stop list, narrative, photos gallery
    - Implement comment thread with chronological ordering and submission form
    - Display like count with toggle button
    - Show walk stats (distance, duration, vibe tags)
    - _Requirements: 7.2, 7.3, 11.4, 17.3_

  - [ ] 9.5 Implement discovery map page
    - Render map with public walk pins using MapboxGL or Google Maps
    - Implement viewport-based walk loading
    - Add vibe tag filter, distance radius filter, popularity sort controls
    - Implement walk preview card on pin selection with "Walk this route" action
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

  - [ ] 9.6 Implement profile pages
    - Build own profile page with avatar, stats, badges, walk grid, settings
    - Build public profile page at `/profile/[username]`
    - Implement profile editing (display name, bio, avatar upload)
    - Implement follow/unfollow button with follower/following counts
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 5.1, 5.2, 5.6_

  - [ ] 9.7 Implement walk generation flow (web)
    - Build time duration input and vibe tag selector
    - Implement location selection (use browser geolocation or manual pin)
    - Call walk generation API and display loading state
    - Display generated walk with route preview and stop list
    - _Requirements: 9.1_

  - [ ] 9.8 Implement page transitions and micro-interactions
    - Set up Framer Motion `AnimatePresence` with shared layout animations for page transitions
    - Implement card hover states, button interactions
    - Add `useReducedMotion()` hook to disable all non-essential animations
    - Ensure animations maintain 60fps
    - _Requirements: 13.1, 13.5, 13.6_

  - [ ] 9.9 Write property test for reduced motion compliance (web)
    - **Property 34: Reduced motion compliance**
    - **Validates: Requirements 13.5**

- [ ] 10. Mobile frontend implementation
  - [ ] 10.1 Implement tab navigation and auth screens
    - Set up Expo Router tab navigation (feed, discover, walk, profile)
    - Implement login/signup screens with email and Google OAuth
    - Implement MFA enrollment and challenge screens
    - Store session tokens in Expo SecureStore
    - _Requirements: 1.1, 1.2, 1.5, 2.1, 2.3_

  - [ ] 10.2 Implement live GPS tracking and geofence-based arrivals
    - Configure `expo-location` for background location tracking
    - Implement geofence registration around each stop (50m radius)
    - Trigger arrival notification and mark stop as visited when entering geofence
    - Display current position on route map with ≤5s update interval
    - Handle GPS signal loss (>30s warning)
    - Implement stop arrival celebration animation (Reanimated 3)
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 13.3_

  - [ ] 10.3 Implement camera integration and photo management
    - Integrate `expo-camera` for photo capture during walks
    - Associate captured photo with nearest stop (minimum distance)
    - Compress image to max 2048px dimension before upload
    - Upload to walk-photos storage bucket
    - Enforce 20-photo-per-walk limit
    - _Requirements: 11.1, 11.2, 11.3, 11.5_

  - [ ] 10.4 Write property tests for media handling
    - **Property 19: Photo-to-stop association uses nearest stop**
    - **Property 20: Photo count limit enforcement**
    - **Property 21: Image compression output constraint**
    - **Validates: Requirements 11.1, 11.3, 11.5**

  - [ ] 10.5 Implement push notifications
    - Create Edge Function for sending push notifications via expo-notifications
    - Register push token on app launch
    - Handle new follower, walk liked, walk commented notification triggers
    - Display local notification on stop arrival with stop narrative
    - Implement notification preferences (enable/disable per type)
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6_

  - [ ] 10.6 Write property tests for notifications
    - **Property 22: Notification preference filtering**
    - **Validates: Requirements 12.5**

  - [ ] 10.7 Implement mobile feed, discovery, and profile screens
    - Build feed screen with pull-to-refresh and infinite scroll
    - Build discovery map screen with walk pins and filters
    - Build profile/settings screen with edit capabilities
    - Implement like toggle with animation (Moti)
    - _Requirements: 6.1, 8.1, 4.1, 7.1_

  - [ ] 10.8 Implement deep linking
    - Configure Universal Links (iOS) and App Links (Android) for walk detail, profile, and discover URLs
    - Parse deep link paths: `/walk/[walkId]`, `/profile/[username]`, `/discover`
    - Navigate to correct screen on deep link open
    - Fall back to web browser when app not installed
    - _Requirements: 15.1, 15.2, 15.3, 15.4_

  - [ ] 10.9 Write property tests for deep linking
    - **Property 30: Deep link URL parsing**
    - **Validates: Requirements 15.4**

- [ ] 11. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 12. Deployment and environment configuration
  - [ ] 12.1 Configure Vercel deployment for web app
    - Set up Vercel project with Turborepo monorepo settings
    - Configure environment variables (Supabase URL, anon key, Google API keys, Claude API key)
    - Configure build command to use Turborepo pipeline
    - Set up preview deployments for PRs
    - _Requirements: 14.1_

  - [ ] 12.2 Configure EAS Build for mobile app
    - Set up EAS Build profiles (development, preview, production)
    - Configure app signing (iOS certificates, Android keystore)
    - Set up environment variables for Supabase and API keys
    - Configure over-the-air updates via EAS Update
    - _Requirements: 14.1_

  - [ ] 12.3 Deploy Supabase Edge Functions
    - Deploy `generate-walk` Edge Function
    - Deploy push notification Edge Function
    - Configure Edge Function environment secrets (Claude API key, Google API keys)
    - Set up Supabase project with PostGIS-enabled database
    - _Requirements: 9.2, 12.6_

  - [ ] 12.4 Configure storage buckets and policies
    - Create `avatars` bucket with owner upload, public read policies
    - Create `walk-photos` bucket with walk-owner upload, visibility-controlled read
    - _Requirements: 16.4, 16.5_

- [ ] 13. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document (34 total, using fast-check)
- Unit tests validate specific examples and edge cases
- All property test tasks reference their corresponding property number from the design
- The implementation uses TypeScript throughout (shared-types, api-client, web, mobile, tests)
- External API integrations (Claude, Google Places, Google Directions) should use MSW mocks in tests

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "1.3", "1.4"] },
    { "id": 2, "tasks": ["2.1", "3.1", "3.3"] },
    { "id": 3, "tasks": ["2.2", "2.3", "3.2"] },
    { "id": 4, "tasks": ["2.4", "2.5"] },
    { "id": 5, "tasks": ["2.6", "4.1", "4.2"] },
    { "id": 6, "tasks": ["4.3", "4.4"] },
    { "id": 7, "tasks": ["4.5", "6.1", "6.3"] },
    { "id": 8, "tasks": ["6.2", "6.4", "6.5", "6.7", "6.11", "6.12"] },
    { "id": 9, "tasks": ["6.6", "6.8", "6.9", "6.13", "6.14"] },
    { "id": 10, "tasks": ["6.10", "7.1"] },
    { "id": 11, "tasks": ["7.2", "7.3"] },
    { "id": 12, "tasks": ["7.4", "9.1", "10.1"] },
    { "id": 13, "tasks": ["9.2", "9.3", "9.4", "9.5", "9.6", "9.7", "10.2", "10.5", "10.7"] },
    { "id": 14, "tasks": ["9.8", "10.3", "10.8"] },
    { "id": 15, "tasks": ["9.9", "10.4", "10.6", "10.9"] },
    { "id": 16, "tasks": ["12.1", "12.2", "12.3", "12.4"] }
  ]
}
```
