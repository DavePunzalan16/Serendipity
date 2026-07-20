import type { User } from './user';
import type { VibeTag } from './walk';

export interface FeedCard {
  walk_id: string;
  user: Pick<User, 'id' | 'username' | 'display_name' | 'avatar_url'>;
  narrative_snippet: string;
  route_thumbnail_url: string;
  distance_km: number;
  duration_minutes: number;
  vibe_tags: VibeTag[];
  like_count: number;
  comment_count: number;
  is_liked_by_viewer: boolean;
  created_at: string;
}

export interface Comment {
  id: string;
  walk_id: string;
  user_id: string;
  user: Pick<User, 'id' | 'username' | 'display_name' | 'avatar_url'>;
  text: string;
  created_at: string;
}

export interface FollowRelationship {
  follower_id: string;
  following_id: string;
  created_at: string;
}
