import { z } from 'zod';

// --- GeoJSON primitive schemas ---

export const PointSchema = z.object({
  type: z.literal('Point'),
  coordinates: z.tuple([z.number(), z.number()]),
});

export const LineStringSchema = z.object({
  type: z.literal('LineString'),
  coordinates: z.array(z.tuple([z.number(), z.number()])).min(2),
});

// --- Enums / Literal Unions ---

export const VibeTagSchema = z.enum([
  'cozy',
  'urban',
  'nature',
  'historic',
  'artsy',
  'foodie',
  'nightlife',
  'scenic',
  'adventure',
  'hidden-gems',
]);

export const VisibilitySettingSchema = z.enum([
  'public',
  'friends_only',
  'private',
]);

// --- User schemas ---

export const UserSchema = z.object({
  id: z.string(),
  username: z.string(),
  display_name: z.string(),
  avatar_url: z.string().nullable(),
  bio: z.string().nullable(),
  created_at: z.string(),
});

export const BadgeSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  icon_url: z.string(),
  earned_at: z.string(),
});

export const ProfileSchema = UserSchema.extend({
  total_walks: z.number(),
  total_distance_km: z.number(),
  favorite_vibes: z.array(VibeTagSchema),
  badges: z.array(BadgeSchema),
  follower_count: z.number(),
  following_count: z.number(),
});

// --- Walk schemas ---

export const WalkPhotoSchema = z.object({
  id: z.string(),
  walk_id: z.string(),
  stop_id: z.string().nullable(),
  storage_path: z.string(),
  url: z.string(),
  captured_at: z.string(),
});

export const StopSchema = z.object({
  id: z.string(),
  walk_id: z.string(),
  name: z.string(),
  description: z.string(),
  narrative: z.string(),
  position: PointSchema,
  order_index: z.number(),
  visited: z.boolean(),
  visited_at: z.string().nullable(),
  place_id: z.string().nullable(),
});

export const WalkSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  title: z.string(),
  narrative: z.string(),
  visibility: VisibilitySettingSchema,
  vibe_tags: z.array(VibeTagSchema),
  duration_minutes: z.number(),
  distance_km: z.number(),
  route_geometry: LineStringSchema,
  start_point: PointSchema,
  created_at: z.string(),
  completed_at: z.string().nullable(),
  like_count: z.number(),
  comment_count: z.number(),
  photos: z.array(WalkPhotoSchema),
  stops: z.array(StopSchema),
});

// --- Social schemas ---

export const FeedCardUserSchema = UserSchema.pick({
  id: true,
  username: true,
  display_name: true,
  avatar_url: true,
});

export const FeedCardSchema = z.object({
  walk_id: z.string(),
  user: FeedCardUserSchema,
  narrative_snippet: z.string(),
  route_thumbnail_url: z.string(),
  distance_km: z.number(),
  duration_minutes: z.number(),
  vibe_tags: z.array(VibeTagSchema),
  like_count: z.number(),
  comment_count: z.number(),
  is_liked_by_viewer: z.boolean(),
  created_at: z.string(),
});

export const CommentSchema = z.object({
  id: z.string(),
  walk_id: z.string(),
  user_id: z.string(),
  user: FeedCardUserSchema,
  text: z.string(),
  created_at: z.string(),
});

export const FollowRelationshipSchema = z.object({
  follower_id: z.string(),
  following_id: z.string(),
  created_at: z.string(),
});

// --- API request/response schemas ---

export const FeedRequestSchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().optional(),
});

export const FeedResponseSchema = z.object({
  items: z.array(FeedCardSchema),
  next_cursor: z.string().nullable(),
});

export const ViewportSchema = z.object({
  north: z.number(),
  south: z.number(),
  east: z.number(),
  west: z.number(),
});

export const DiscoverRequestSchema = z.object({
  viewport: ViewportSchema,
  vibe_tag: VibeTagSchema.optional(),
  radius_km: z.number().optional(),
  sort: z.enum(['recent', 'popular']).optional(),
  cursor: z.string().optional(),
  limit: z.number().optional(),
});

export const WalkMapItemUserSchema = UserSchema.pick({
  username: true,
  display_name: true,
  avatar_url: true,
});

export const WalkMapItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  start_point: PointSchema,
  route_geometry: LineStringSchema,
  vibe_tags: z.array(VibeTagSchema),
  distance_km: z.number(),
  duration_minutes: z.number(),
  like_count: z.number(),
  user: WalkMapItemUserSchema,
});

export const DiscoverResponseSchema = z.object({
  walks: z.array(WalkMapItemSchema),
  next_cursor: z.string().nullable(),
});

export const WalkGenerationRequestSchema = z.object({
  duration_minutes: z.number(),
  vibe_tags: z.array(VibeTagSchema),
  start_location: PointSchema,
});

export const NotificationPreferencesSchema = z.object({
  new_follower: z.boolean(),
  walk_liked: z.boolean(),
  walk_commented: z.boolean(),
  stop_arrival: z.boolean(),
});
