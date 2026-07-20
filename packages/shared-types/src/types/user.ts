import type { VibeTag } from './walk';

export interface User {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
}

export interface Profile extends User {
  total_walks: number;
  total_distance_km: number;
  favorite_vibes: VibeTag[];
  badges: Badge[];
  follower_count: number;
  following_count: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon_url: string;
  earned_at: string;
}
