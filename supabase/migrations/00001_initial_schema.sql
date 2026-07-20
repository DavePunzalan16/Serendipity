-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  bio TEXT DEFAULT '',
  avatar_url TEXT,
  total_walks INTEGER DEFAULT 0,
  total_distance_km NUMERIC(10,2) DEFAULT 0,
  favorite_vibes TEXT[] DEFAULT '{}',
  follower_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  notification_preferences JSONB DEFAULT '{"new_follower": true, "walk_liked": true, "walk_commented": true, "stop_arrival": true}',
  push_token TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Follows table
CREATE TABLE follows (
  follower_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (follower_id, following_id),
  CONSTRAINT no_self_follow CHECK (follower_id != following_id)
);

-- Walks table
CREATE TABLE walks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  narrative TEXT DEFAULT '',
  visibility TEXT NOT NULL DEFAULT 'friends_only'
    CHECK (visibility IN ('public', 'friends_only', 'private')),
  vibe_tags TEXT[] DEFAULT '{}',
  duration_minutes INTEGER,
  distance_km NUMERIC(10,2),
  route_geometry GEOMETRY(LineString, 4326),
  start_point GEOMETRY(Point, 4326),
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'completed', 'abandoned')),
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Stops table
CREATE TABLE stops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  walk_id UUID NOT NULL REFERENCES walks(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  narrative TEXT DEFAULT '',
  position GEOMETRY(Point, 4326) NOT NULL,
  order_index INTEGER NOT NULL,
  visited BOOLEAN DEFAULT false,
  visited_at TIMESTAMPTZ,
  place_id TEXT,
  geofence_radius_m INTEGER DEFAULT 50,
  created_at TIMESTAMPTZ DEFAULT now()
);
