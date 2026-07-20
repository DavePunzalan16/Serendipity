import type { Point, LineString } from 'geojson';
import type { User } from './user';
import type { VibeTag } from './walk';
import type { FeedCard } from './social';

export interface FeedRequest {
  cursor?: string;
  limit?: number;
}

export interface FeedResponse {
  items: FeedCard[];
  next_cursor: string | null;
}

export interface DiscoverRequest {
  viewport: Viewport;
  vibe_tag?: VibeTag;
  radius_km?: number;
  sort?: 'recent' | 'popular';
  cursor?: string;
  limit?: number;
}

export interface Viewport {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface DiscoverResponse {
  walks: WalkMapItem[];
  next_cursor: string | null;
}

export interface WalkMapItem {
  id: string;
  title: string;
  start_point: Point;
  route_geometry: LineString;
  vibe_tags: VibeTag[];
  distance_km: number;
  duration_minutes: number;
  like_count: number;
  user: Pick<User, 'username' | 'display_name' | 'avatar_url'>;
}

export interface WalkGenerationRequest {
  duration_minutes: number;
  vibe_tags: VibeTag[];
  start_location: Point;
}

export interface NotificationPreferences {
  new_follower: boolean;
  walk_liked: boolean;
  walk_commented: boolean;
  stop_arrival: boolean;
}
