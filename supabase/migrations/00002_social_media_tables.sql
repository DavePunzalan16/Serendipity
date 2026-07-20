-- Walk photos table
CREATE TABLE walk_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  walk_id UUID NOT NULL REFERENCES walks(id) ON DELETE CASCADE,
  stop_id UUID REFERENCES stops(id) ON DELETE SET NULL,
  storage_path TEXT NOT NULL,
  captured_at TIMESTAMPTZ DEFAULT now()
);

-- Walk likes table
CREATE TABLE walk_likes (
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  walk_id UUID NOT NULL REFERENCES walks(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, walk_id)
);

-- Walk comments table
CREATE TABLE walk_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  walk_id UUID NOT NULL REFERENCES walks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  text TEXT NOT NULL CHECK (char_length(text) > 0 AND char_length(text) <= 1000),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Push tokens table (for multi-device support)
CREATE TABLE push_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('ios', 'android')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, token)
);

-- Badges table
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_url TEXT NOT NULL
);

-- User badges table
CREATE TABLE user_badges (
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, badge_id)
);
