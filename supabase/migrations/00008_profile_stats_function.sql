-- Atomic function to increment profile walk stats on walk completion
CREATE OR REPLACE FUNCTION increment_profile_stats(
  p_user_id UUID,
  p_distance_km NUMERIC
) RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET
    total_walks = total_walks + 1,
    total_distance_km = total_distance_km + COALESCE(p_distance_km, 0),
    updated_at = now()
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
