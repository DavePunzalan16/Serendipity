-- Migration: Database functions for feed, discovery, and like toggle
-- Requirements: 6.1, 6.3, 8.1, 7.1

-- Feed query with cursor-based pagination
CREATE OR REPLACE FUNCTION get_feed(
  p_user_id UUID,
  p_cursor TIMESTAMPTZ DEFAULT NULL,
  p_limit INTEGER DEFAULT 20
) RETURNS TABLE (
  id UUID,
  user_id UUID,
  title TEXT,
  narrative TEXT,
  visibility TEXT,
  vibe_tags TEXT[],
  duration_minutes INTEGER,
  distance_km NUMERIC,
  like_count INTEGER,
  comment_count INTEGER,
  created_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  username TEXT,
  display_name TEXT,
  avatar_url TEXT,
  is_liked BOOLEAN
) AS $$
  SELECT w.id, w.user_id, w.title, w.narrative, w.visibility, w.vibe_tags,
    w.duration_minutes, w.distance_km, w.like_count, w.comment_count,
    w.created_at, w.completed_at,
    p.username, p.display_name, p.avatar_url,
    EXISTS(SELECT 1 FROM walk_likes WHERE user_id = p_user_id AND walk_id = w.id) as is_liked
  FROM walks w
  JOIN profiles p ON w.user_id = p.id
  WHERE w.user_id IN (SELECT following_id FROM follows WHERE follower_id = p_user_id)
    AND w.status = 'completed'
    AND (w.visibility = 'public' OR w.visibility = 'friends_only')
    AND (p_cursor IS NULL OR w.created_at < p_cursor)
  ORDER BY w.created_at DESC
  LIMIT p_limit;
$$ LANGUAGE sql SECURITY DEFINER;

-- Discovery query with spatial filtering
CREATE OR REPLACE FUNCTION discover_walks(
  p_viewport GEOMETRY,
  p_vibe_tag TEXT DEFAULT NULL,
  p_radius_km NUMERIC DEFAULT NULL,
  p_user_location GEOMETRY DEFAULT NULL,
  p_sort TEXT DEFAULT 'recent',
  p_cursor TIMESTAMPTZ DEFAULT NULL,
  p_limit INTEGER DEFAULT 50
) RETURNS TABLE (
  id UUID,
  user_id UUID,
  title TEXT,
  narrative TEXT,
  vibe_tags TEXT[],
  duration_minutes INTEGER,
  distance_km NUMERIC,
  like_count INTEGER,
  start_point GEOMETRY,
  route_geometry GEOMETRY,
  created_at TIMESTAMPTZ,
  username TEXT,
  display_name TEXT,
  avatar_url TEXT
) AS $$
  SELECT w.id, w.user_id, w.title, w.narrative, w.vibe_tags,
    w.duration_minutes, w.distance_km, w.like_count,
    w.start_point, w.route_geometry, w.created_at,
    p.username, p.display_name, p.avatar_url
  FROM walks w
  JOIN profiles p ON w.user_id = p.id
  WHERE w.visibility = 'public'
    AND w.status = 'completed'
    AND ST_Intersects(w.start_point, p_viewport)
    AND (p_vibe_tag IS NULL OR p_vibe_tag = ANY(w.vibe_tags))
    AND (p_radius_km IS NULL OR p_user_location IS NULL
      OR ST_DWithin(w.start_point::geography, p_user_location::geography, p_radius_km * 1000))
    AND (p_cursor IS NULL OR w.created_at < p_cursor)
  ORDER BY
    CASE WHEN p_sort = 'popular' THEN w.like_count END DESC NULLS LAST,
    w.created_at DESC
  LIMIT p_limit;
$$ LANGUAGE sql SECURITY DEFINER;

-- Toggle like with count update (atomic)
CREATE OR REPLACE FUNCTION toggle_like(p_walk_id UUID)
RETURNS TABLE (liked BOOLEAN, like_count INTEGER) AS $$
DECLARE
  v_exists BOOLEAN;
  v_count INTEGER;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM walk_likes WHERE user_id = auth.uid() AND walk_id = p_walk_id
  ) INTO v_exists;

  IF v_exists THEN
    DELETE FROM walk_likes WHERE user_id = auth.uid() AND walk_id = p_walk_id;
    UPDATE walks SET like_count = walks.like_count - 1 WHERE id = p_walk_id RETURNING walks.like_count INTO v_count;
    RETURN QUERY SELECT false, v_count;
  ELSE
    INSERT INTO walk_likes (user_id, walk_id) VALUES (auth.uid(), p_walk_id);
    UPDATE walks SET like_count = walks.like_count + 1 WHERE id = p_walk_id RETURNING walks.like_count INTO v_count;
    RETURN QUERY SELECT true, v_count;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
