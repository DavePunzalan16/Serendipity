import type { Point, LineString } from 'geojson';

export type VibeTag =
  | 'cozy'
  | 'urban'
  | 'nature'
  | 'historic'
  | 'artsy'
  | 'foodie'
  | 'nightlife'
  | 'scenic'
  | 'adventure'
  | 'hidden-gems';

export type VisibilitySetting = 'public' | 'friends_only' | 'private';

export interface Walk {
  id: string;
  user_id: string;
  title: string;
  narrative: string;
  visibility: VisibilitySetting;
  vibe_tags: VibeTag[];
  duration_minutes: number;
  distance_km: number;
  route_geometry: LineString;
  start_point: Point;
  created_at: string;
  completed_at: string | null;
  like_count: number;
  comment_count: number;
  photos: WalkPhoto[];
  stops: Stop[];
}

export interface Stop {
  id: string;
  walk_id: string;
  name: string;
  description: string;
  narrative: string;
  position: Point;
  order_index: number;
  visited: boolean;
  visited_at: string | null;
  place_id: string | null;
}

export interface WalkPhoto {
  id: string;
  walk_id: string;
  stop_id: string | null;
  storage_path: string;
  url: string;
  captured_at: string;
}
