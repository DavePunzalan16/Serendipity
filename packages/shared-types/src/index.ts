// @wander/shared-types
// TypeScript type definitions shared between web and mobile apps

// User types
export type { User, Profile, Badge } from './types/user';

// Walk types
export type { Walk, Stop, WalkPhoto, VibeTag, VisibilitySetting } from './types/walk';

// Social types
export type { FeedCard, Comment, FollowRelationship } from './types/social';

// API types
export type {
  FeedRequest,
  FeedResponse,
  DiscoverRequest,
  DiscoverResponse,
  Viewport,
  WalkMapItem,
  WalkGenerationRequest,
  NotificationPreferences,
} from './types/api';

// Zod schemas for runtime validation
export {
  // GeoJSON
  PointSchema,
  LineStringSchema,
  // Enums
  VibeTagSchema,
  VisibilitySettingSchema,
  // User
  UserSchema,
  BadgeSchema,
  ProfileSchema,
  // Walk
  WalkPhotoSchema,
  StopSchema,
  WalkSchema,
  // Social
  FeedCardUserSchema,
  FeedCardSchema,
  CommentSchema,
  FollowRelationshipSchema,
  // API
  FeedRequestSchema,
  FeedResponseSchema,
  ViewportSchema,
  DiscoverRequestSchema,
  WalkMapItemUserSchema,
  WalkMapItemSchema,
  DiscoverResponseSchema,
  WalkGenerationRequestSchema,
  NotificationPreferencesSchema,
} from './schemas';
