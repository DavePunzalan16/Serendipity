# Requirements Document

## Introduction

Wander v2 is a social walking-discovery application that extends the core walk generation engine (v1) with a full social layer and discovery system. Users generate AI-curated walks based on time and vibe preferences, then share completed walks to a social feed where friends and the public can view routes, photos, and narratives. A discovery map allows browsing publicly shared walks nearby filtered by vibe, distance, and popularity. The system targets both web (Next.js on Vercel) and mobile (React Native + Expo) platforms via a shared monorepo architecture, with Supabase as the backend.

## Glossary

- **Wander_System**: The complete Wander v2 application spanning web and mobile platforms
- **Auth_Service**: The authentication subsystem powered by Supabase Auth, handling sign-up, login, MFA, and session management
- **Profile_Service**: The subsystem responsible for user profile creation, editing, and public display
- **Follow_Service**: The subsystem managing one-way follow relationships between users
- **Feed_Service**: The subsystem that aggregates and delivers followed users' walks in reverse-chronological order
- **Interaction_Service**: The subsystem handling likes and comments on walks
- **Discovery_Service**: The subsystem providing map-based browsing of public walks using PostGIS spatial queries
- **Walk_Engine**: The AI-powered walk generation subsystem that curates routes based on time and vibe inputs
- **Visibility_Setting**: A per-walk access control value of Public, Friends_Only, or Private
- **Vibe_Tag**: A categorical label describing the mood or theme of a walk (e.g., "cozy", "urban", "nature")
- **Walk**: A completed walking route containing stops, route geometry, photos, narrative, stats, and metadata
- **Stop**: A point of interest along a walk route where the user checks in
- **AAL**: Authenticator Assurance Level as defined by Supabase MFA (aal1 = password only, aal2 = password + TOTP)
- **Feed_Card**: A UI component displaying a walk summary in the social feed
- **Route_Thumbnail**: A static map image showing the walk's route geometry
- **Cursor**: An opaque pagination token used for cursor-based feed and discovery queries
- **Viewport**: A geographic bounding box defined by the user's current map view

## Requirements

### Requirement 1: User Registration and Login

**User Story:** As a new user, I want to sign up and log in with email or Google OAuth, so that I can access the Wander platform securely.

#### Acceptance Criteria

1. WHEN a user submits a valid email and password, THE Auth_Service SHALL create a new account and issue an authenticated session
2. WHEN a user selects Google OAuth, THE Auth_Service SHALL redirect to Google, complete the OAuth flow, and issue an authenticated session
3. WHEN a user submits invalid credentials during login, THE Auth_Service SHALL return a descriptive error message without revealing whether the email exists
4. WHILE a session is active on web, THE Auth_Service SHALL manage session tokens via Supabase SSR cookies
5. WHILE a session is active on mobile, THE Auth_Service SHALL store session tokens in Expo SecureStore
6. WHEN a session token expires, THE Auth_Service SHALL attempt a silent refresh using the stored refresh token before requiring re-authentication

### Requirement 2: Multi-Factor Authentication

**User Story:** As a security-conscious user, I want to optionally enable TOTP-based two-factor authentication with recovery codes, so that my account is protected against credential theft.

#### Acceptance Criteria

1. WHEN a user initiates MFA enrollment, THE Auth_Service SHALL generate a TOTP secret, display a QR code, and require a valid TOTP code to confirm enrollment
2. WHEN MFA enrollment is confirmed, THE Auth_Service SHALL generate and display a set of single-use recovery codes
3. WHEN a user with MFA enabled logs in successfully with password, THE Auth_Service SHALL present a TOTP challenge before granting aal2 access
4. WHEN a user enters a valid recovery code instead of a TOTP code, THE Auth_Service SHALL grant aal2 access and invalidate that recovery code
5. WHILE a route requires aal2 and the user session is aal1, THE Auth_Service SHALL redirect to the MFA challenge screen
6. THE Auth_Service SHALL enforce aal2 on all protected routes via middleware on web and navigation guards on mobile

### Requirement 3: Walk Visibility and Location Privacy

**User Story:** As a user who values privacy, I want to control who can see each of my walks and ensure my live location is never exposed publicly, so that I feel safe sharing my walking activity.

#### Acceptance Criteria

1. THE Wander_System SHALL default new walks to a Visibility_Setting of Friends_Only
2. WHEN a user changes a walk's Visibility_Setting, THE Wander_System SHALL update access control and reflect the change within 5 seconds
3. WHILE a walk has Visibility_Setting of Private, THE Wander_System SHALL restrict access to only the walk owner
4. WHILE a walk has Visibility_Setting of Friends_Only, THE Wander_System SHALL restrict access to the walk owner and users who follow the owner
5. WHILE a walk has Visibility_Setting of Public, THE Wander_System SHALL allow any authenticated or unauthenticated user to view the walk
6. THE Wander_System SHALL enforce that live GPS location during an active walk is never shared with any other user or exposed via any API
7. IF a user attempts to access a walk they are not authorized to view, THEN THE Wander_System SHALL return a 404 response without confirming the walk exists

### Requirement 4: User Profile

**User Story:** As a user, I want a profile page displaying my avatar, display name, bio, stats, and badges, so that others can learn about my walking activity.

#### Acceptance Criteria

1. THE Profile_Service SHALL display the user's avatar, display name, bio, join date, total walks, total distance, favorite Vibe_Tags, and badges on the profile page
2. WHEN a user updates their profile fields, THE Profile_Service SHALL persist changes and reflect them on the profile page within 3 seconds
3. THE Profile_Service SHALL expose a public profile URL at /profile/[username] that is viewable without authentication
4. WHILE viewing a public profile of a user with only Private walks, THE Profile_Service SHALL display profile metadata but no walk content
5. WHEN a user uploads an avatar image, THE Profile_Service SHALL validate the file is an image of 5MB or less and store it in the avatars storage bucket

### Requirement 5: Follow System

**User Story:** As a user, I want to follow other users and see follower/following counts, so that I can build a network and curate my social feed.

#### Acceptance Criteria

1. WHEN a user follows another user, THE Follow_Service SHALL create a one-way follow relationship and increment the following count for the follower and the follower count for the followed user
2. WHEN a user unfollows another user, THE Follow_Service SHALL remove the follow relationship and decrement the respective counts
3. THE Follow_Service SHALL prevent a user from following themselves
4. THE Follow_Service SHALL prevent duplicate follow relationships between the same pair of users
5. WHEN a user searches for other users by display name or username, THE Follow_Service SHALL return matching results within 2 seconds
6. THE Follow_Service SHALL display follower and following counts on each user's profile

### Requirement 6: Social Feed

**User Story:** As a user, I want to see a reverse-chronological feed of walks from people I follow, so that I can discover what my friends have been exploring.

#### Acceptance Criteria

1. WHEN a user opens the feed, THE Feed_Service SHALL display walks from followed users in reverse-chronological order
2. THE Feed_Service SHALL only include walks with Visibility_Setting of Public or Friends_Only (where the viewer follows the walk owner)
3. WHEN the user scrolls to the bottom of the current feed page, THE Feed_Service SHALL load the next page of results using cursor-based pagination
4. THE Feed_Service SHALL render each walk as a Feed_Card containing the walk narrative snippet, Route_Thumbnail, distance, duration, Vibe_Tags, like count, and comment count
5. WHEN the feed contains no walks, THE Feed_Service SHALL display an empty state suggesting users to follow
6. WHEN a new walk is posted by a followed user, THE Feed_Service SHALL include it in the feed on the next refresh or scroll

### Requirement 7: Likes and Comments

**User Story:** As a user, I want to like and comment on walks, so that I can engage with the walking community.

#### Acceptance Criteria

1. WHEN a user taps the like button on a walk, THE Interaction_Service SHALL toggle the like state and update the like count with optimistic UI feedback
2. WHEN a user submits a text comment on a walk, THE Interaction_Service SHALL persist the comment and display it in the walk's comment thread
3. THE Interaction_Service SHALL display comments in chronological order within the comment thread
4. THE Interaction_Service SHALL restrict liking and commenting to authenticated users only
5. IF a user submits an empty comment, THEN THE Interaction_Service SHALL reject the submission and display a validation error
6. THE Interaction_Service SHALL limit comment length to 1000 characters

### Requirement 8: Discovery Map

**User Story:** As a user, I want to browse a map of publicly shared walks near me, so that I can find interesting new routes to explore.

#### Acceptance Criteria

1. WHEN a user opens the discovery map, THE Discovery_Service SHALL display public walks within the current map Viewport
2. WHEN a user applies a Vibe_Tag filter, THE Discovery_Service SHALL show only walks matching the selected tag within the Viewport
3. WHEN a user applies a distance radius filter, THE Discovery_Service SHALL show only walks whose start point is within the specified radius of the user's location
4. WHEN a user applies a popularity sort, THE Discovery_Service SHALL order results by like count descending
5. WHEN a user selects a walk on the map, THE Discovery_Service SHALL display a walk preview card with route, stats, and a "Walk this route" action
6. WHEN a user selects "Walk this route", THE Discovery_Service SHALL clone the walk's route and stops into a new walk for the user to navigate
7. THE Discovery_Service SHALL use PostGIS spatial queries to efficiently retrieve walks within the Viewport

### Requirement 9: Walk Generation

**User Story:** As a user, I want to input my available time and preferred vibe to generate an AI-curated walking route, so that I can enjoy serendipitous discoveries.

#### Acceptance Criteria

1. WHEN a user provides a time duration and selects one or more Vibe_Tags, THE Walk_Engine SHALL generate a curated route with Stops matching the vibe within the time constraint
2. THE Walk_Engine SHALL use the Claude API to select and narrate Stops with contextual descriptions
3. THE Walk_Engine SHALL use Google Places API to source real points of interest for Stops
4. THE Walk_Engine SHALL use Google Directions API to produce walkable route geometry between Stops
5. WHEN the user is navigating a walk and requests to swap a Stop, THE Walk_Engine SHALL replace it with an alternative Stop matching the same vibe and time constraints
6. WHEN a walk is completed, THE Walk_Engine SHALL persist the walk with route geometry, Stop details, photos, narrative, duration, distance, and timestamp

### Requirement 10: Live Walk Navigation

**User Story:** As a user on mobile, I want live GPS tracking and geofence-based arrival detection during a walk, so that I receive a seamless guided experience.

#### Acceptance Criteria

1. WHILE a user is navigating an active walk on mobile, THE Wander_System SHALL track GPS position using background location services
2. WHEN the user enters a geofenced area around a Stop, THE Wander_System SHALL trigger an arrival notification and mark the Stop as visited
3. WHILE the app is in the background during an active walk, THE Wander_System SHALL continue GPS tracking and geofence monitoring
4. THE Wander_System SHALL display the user's current position on the route map in real time with a position update interval of 5 seconds or less
5. IF GPS signal is lost for more than 30 seconds, THEN THE Wander_System SHALL display a connectivity warning to the user

### Requirement 11: Walk Photos

**User Story:** As a user, I want to capture and attach photos during a walk, so that my shared walks include visual memories.

#### Acceptance Criteria

1. WHEN a user takes a photo during a walk, THE Wander_System SHALL associate the photo with the current or nearest Stop
2. THE Wander_System SHALL upload walk photos to the walk-photos storage bucket
3. THE Wander_System SHALL limit the number of photos per walk to 20
4. WHEN a walk with photos is viewed by an authorized user, THE Wander_System SHALL display the photos in the walk detail view
5. THE Wander_System SHALL compress photos to a maximum dimension of 2048px before upload to optimize storage and loading

### Requirement 12: Push Notifications

**User Story:** As a user, I want to receive push notifications for social interactions and walk events, so that I stay engaged with the community.

#### Acceptance Criteria

1. WHEN a user receives a new follower, THE Wander_System SHALL send a push notification to the followed user's mobile device
2. WHEN a user's walk receives a like, THE Wander_System SHALL send a push notification to the walk owner's mobile device
3. WHEN a user's walk receives a comment, THE Wander_System SHALL send a push notification to the walk owner's mobile device
4. WHEN a user arrives at a Stop during an active walk, THE Wander_System SHALL display a local notification with the Stop narrative
5. THE Wander_System SHALL allow users to configure notification preferences (enable/disable per notification type)
6. THE Wander_System SHALL deliver push notifications via Supabase Edge Functions and expo-notifications

### Requirement 13: Motion and Animation Design

**User Story:** As a user, I want a premium, animated visual experience across the application, so that interactions feel polished and engaging.

#### Acceptance Criteria

1. THE Wander_System SHALL implement page transitions and micro-interactions using Framer Motion on web and React Native Reanimated 3 on mobile
2. WHEN a user taps the like button, THE Wander_System SHALL display an animated heart-burst effect
3. WHEN a user arrives at a Stop, THE Wander_System SHALL display a celebration animation
4. THE Wander_System SHALL implement parallax scroll effects and 3D elements on the landing page using GSAP and React Three Fiber (web only)
5. WHILE the user has prefers-reduced-motion enabled, THE Wander_System SHALL disable all non-essential animations and provide static alternatives
6. THE Wander_System SHALL ensure animations do not block user interaction or degrade performance below 60fps on target devices

### Requirement 14: Cross-Platform Architecture

**User Story:** As a development team, I want a monorepo with shared types, API client, and design tokens, so that web and mobile platforms stay consistent and development is efficient.

#### Acceptance Criteria

1. THE Wander_System SHALL organize code as a Turborepo + pnpm workspace monorepo with /apps/web, /apps/mobile, and /packages directories
2. THE Wander_System SHALL share TypeScript type definitions for User, Walk, Stop, and all data models via the shared-types package
3. THE Wander_System SHALL share a typed Supabase client wrapper and query functions via the api-client package
4. THE Wander_System SHALL share design tokens via the ui-tokens package
5. WHEN a shared package is modified, THE Wander_System SHALL propagate changes to dependent apps via Turborepo's dependency graph

### Requirement 15: Deep Linking

**User Story:** As a user, I want to open shared walk links or profile links directly in the mobile app, so that navigation from external sources is seamless.

#### Acceptance Criteria

1. WHEN a user taps a walk URL on a device with the app installed, THE Wander_System SHALL open the walk detail screen in the mobile app via Universal Links (iOS) or App Links (Android)
2. WHEN a user taps a profile URL on a device with the app installed, THE Wander_System SHALL open the profile screen in the mobile app
3. IF the mobile app is not installed, THEN THE Wander_System SHALL fall back to opening the URL in the web browser
4. THE Wander_System SHALL support deep link paths for walk detail (/walk/[walkId]), profile (/profile/[username]), and discovery map (/discover)

### Requirement 16: Data Persistence and Security

**User Story:** As a user, I want my data to be securely stored with proper access controls, so that unauthorized access is prevented at the database level.

#### Acceptance Criteria

1. THE Wander_System SHALL enforce Row Level Security (RLS) policies on all database tables
2. THE Wander_System SHALL restrict profile updates to the profile owner via RLS
3. THE Wander_System SHALL restrict walk visibility based on the walk's Visibility_Setting and the viewer's follow relationship via RLS
4. THE Wander_System SHALL restrict avatar uploads to the owning user and allow public read access
5. THE Wander_System SHALL restrict walk-photo uploads to the walk owner and control read access through walk visibility policies at the query layer
6. THE Wander_System SHALL use PostGIS-enabled Postgres for all spatial data storage and queries
7. IF a database query fails due to an RLS policy violation, THEN THE Wander_System SHALL return a generic 403 response without leaking policy details

### Requirement 17: Walk History

**User Story:** As a user, I want to view my past walks in a personal history list, so that I can revisit routes and track my walking activity over time.

#### Acceptance Criteria

1. WHEN a user opens their walk history, THE Wander_System SHALL display all their completed walks in reverse-chronological order
2. THE Wander_System SHALL display each history entry with the walk date, duration, distance, Vibe_Tags, and Route_Thumbnail
3. WHEN a user selects a walk from history, THE Wander_System SHALL display the full walk detail including route, Stops, photos, and narrative
4. THE Wander_System SHALL support filtering walk history by Vibe_Tag and date range

### Requirement 18: API Contract Compliance

**User Story:** As a developer, I want well-defined API endpoints for all social features, so that web and mobile clients interact with the backend consistently.

#### Acceptance Criteria

1. THE Wander_System SHALL expose GET /api/profile/[username] returning profile data with public walk summaries
2. THE Wander_System SHALL expose POST /api/follow/[userId] and DELETE /api/follow/[userId] for follow and unfollow actions
3. THE Wander_System SHALL expose GET /api/feed with cursor-based pagination parameters returning Feed_Cards for the authenticated user
4. THE Wander_System SHALL expose POST /api/walk/[walkId]/like as a toggle that creates or removes a like
5. THE Wander_System SHALL expose POST /api/walk/[walkId]/comment accepting a text body and returning the created comment
6. THE Wander_System SHALL expose GET /api/discover accepting Viewport bounds, optional Vibe_Tag filter, distance radius, and sort parameters
7. THE Wander_System SHALL expose PATCH /api/walk/[walkId]/visibility accepting a new Visibility_Setting value
8. IF an API request is made without valid authentication where required, THEN THE Wander_System SHALL return a 401 response with a descriptive error code
