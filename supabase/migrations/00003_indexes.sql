-- Enable trigram extension for profile search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Spatial indexes for discovery queries
CREATE INDEX idx_walks_start_point ON walks USING GIST (start_point);
CREATE INDEX idx_walks_route_geometry ON walks USING GIST (route_geometry);
CREATE INDEX idx_stops_position ON stops USING GIST (position);

-- Feed query optimization
CREATE INDEX idx_walks_user_created ON walks (user_id, created_at DESC);
CREATE INDEX idx_walks_visibility ON walks (visibility);

-- Follow indexes
CREATE INDEX idx_follows_follower ON follows (follower_id);
CREATE INDEX idx_follows_following ON follows (following_id);

-- Comment and like lookups
CREATE INDEX idx_comments_walk ON walk_comments (walk_id, created_at);
CREATE INDEX idx_likes_walk ON walk_likes (walk_id);
CREATE INDEX idx_likes_user_walk ON walk_likes (user_id, walk_id);

-- Profile search (trigram indexes for fuzzy matching)
CREATE INDEX idx_profiles_username_trgm ON profiles USING GIN (username gin_trgm_ops);
CREATE INDEX idx_profiles_display_name_trgm ON profiles USING GIN (display_name gin_trgm_ops);
