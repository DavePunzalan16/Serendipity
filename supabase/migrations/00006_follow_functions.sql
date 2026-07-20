-- Migration: Atomic follow/unfollow functions with count management
-- Requirements: 5.1, 5.2, 5.3, 5.4, 5.6

-- Follow a user atomically (insert + increment counts)
CREATE OR REPLACE FUNCTION follow_user(p_target_user_id UUID)
RETURNS void AS $$
BEGIN
  -- Insert follow relationship (PK and CHECK constraints prevent duplicates and self-follow)
  INSERT INTO follows (follower_id, following_id)
  VALUES (auth.uid(), p_target_user_id);

  -- Increment follower_count on the followed user
  UPDATE profiles
  SET follower_count = follower_count + 1
  WHERE id = p_target_user_id;

  -- Increment following_count on the current user
  UPDATE profiles
  SET following_count = following_count + 1
  WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Unfollow a user atomically (delete + decrement counts)
CREATE OR REPLACE FUNCTION unfollow_user(p_target_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_row_count INTEGER;
BEGIN
  -- Attempt to delete follow relationship
  DELETE FROM follows
  WHERE follower_id = auth.uid() AND following_id = p_target_user_id;

  -- Check if a row was actually deleted
  GET DIAGNOSTICS v_row_count = ROW_COUNT;

  IF v_row_count > 0 THEN
    -- Decrement follower_count on the unfollowed user (never below 0)
    UPDATE profiles
    SET follower_count = GREATEST(0, follower_count - 1)
    WHERE id = p_target_user_id;

    -- Decrement following_count on the current user (never below 0)
    UPDATE profiles
    SET following_count = GREATEST(0, following_count - 1)
    WHERE id = auth.uid();

    RETURN true;
  END IF;

  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
