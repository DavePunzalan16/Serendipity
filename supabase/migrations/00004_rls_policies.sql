-- Row Level Security Policies
-- Requirements: 16.1, 16.2, 16.3, 16.4, 16.5

-- =============================================================================
-- Profiles: public read, owner write
-- =============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- =============================================================================
-- Follows: authenticated insert/delete own rows, public read
-- =============================================================================
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "follows_select" ON follows FOR SELECT USING (true);
CREATE POLICY "follows_insert" ON follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "follows_delete" ON follows FOR DELETE USING (auth.uid() = follower_id);

-- =============================================================================
-- Walks: visibility-based access
-- =============================================================================
ALTER TABLE walks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "walks_select" ON walks FOR SELECT USING (
  user_id = auth.uid()
  OR visibility = 'public'
  OR (visibility = 'friends_only' AND EXISTS (
    SELECT 1 FROM follows WHERE follower_id = auth.uid() AND following_id = walks.user_id
  ))
);
CREATE POLICY "walks_insert" ON walks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "walks_update" ON walks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "walks_delete" ON walks FOR DELETE USING (auth.uid() = user_id);

-- =============================================================================
-- Walk likes: authenticated users can like visible walks
-- =============================================================================
ALTER TABLE walk_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "likes_select" ON walk_likes FOR SELECT USING (true);
CREATE POLICY "likes_insert" ON walk_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "likes_delete" ON walk_likes FOR DELETE USING (auth.uid() = user_id);

-- =============================================================================
-- Walk comments: authenticated users can comment on visible walks
-- =============================================================================
ALTER TABLE walk_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "comments_select" ON walk_comments FOR SELECT USING (true);
CREATE POLICY "comments_insert" ON walk_comments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =============================================================================
-- Walk photos: owner write, visibility-based read via walk join
-- =============================================================================
ALTER TABLE walk_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "photos_select" ON walk_photos FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM walks WHERE walks.id = walk_photos.walk_id AND (
      walks.user_id = auth.uid()
      OR walks.visibility = 'public'
      OR (walks.visibility = 'friends_only' AND EXISTS (
        SELECT 1 FROM follows WHERE follower_id = auth.uid() AND following_id = walks.user_id
      ))
    )
  )
);
CREATE POLICY "photos_insert" ON walk_photos FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM walks WHERE walks.id = walk_photos.walk_id AND walks.user_id = auth.uid())
);

-- =============================================================================
-- Stops: inherit walk visibility
-- =============================================================================
ALTER TABLE stops ENABLE ROW LEVEL SECURITY;
CREATE POLICY "stops_select" ON stops FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM walks WHERE walks.id = stops.walk_id AND (
      walks.user_id = auth.uid()
      OR walks.visibility = 'public'
      OR (walks.visibility = 'friends_only' AND EXISTS (
        SELECT 1 FROM follows WHERE follower_id = auth.uid() AND following_id = walks.user_id
      ))
    )
  )
);
CREATE POLICY "stops_insert" ON stops FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM walks WHERE walks.id = stops.walk_id AND walks.user_id = auth.uid())
);
CREATE POLICY "stops_update" ON stops FOR UPDATE USING (
  EXISTS (SELECT 1 FROM walks WHERE walks.id = stops.walk_id AND walks.user_id = auth.uid())
);
