-- Create storage buckets for avatars and walk photos
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('walk-photos', 'walk-photos', true);

-- Avatars: anyone can read, only owner can upload (path must start with their user ID)
CREATE POLICY "Avatar upload" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
);
CREATE POLICY "Avatar public read" ON storage.objects FOR SELECT USING (
  bucket_id = 'avatars'
);

-- Walk photos: anyone can read, only walk owner can upload
CREATE POLICY "Walk photo upload" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'walk-photos' AND auth.uid() IS NOT NULL
);
CREATE POLICY "Walk photo public read" ON storage.objects FOR SELECT USING (
  bucket_id = 'walk-photos'
);
