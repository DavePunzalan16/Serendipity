import type { Profile, User } from '@wander/shared-types';
import type { TypedSupabaseClient } from './types';

/** Get a user's profile by username */
export async function getByUsername(
  client: TypedSupabaseClient,
  username: string,
): Promise<Profile> {
  const { data, error } = await client
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single();

  if (error) throw new Error(error.message);
  return data as Profile;
}

/** Update the current user's profile */
export async function updateProfile(
  client: TypedSupabaseClient,
  data: Partial<Pick<Profile, 'display_name' | 'bio' | 'username' | 'favorite_vibes'>>,
): Promise<Profile> {
  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError) throw new Error(userError.message);

  const { data: profile, error } = await client
    .from('profiles')
    .update(data)
    .eq('id', userData.user.id)
    .select('*')
    .single();

  if (error) throw new Error(error.message);
  return profile as Profile;
}

/** Upload an avatar image and update the profile avatar_url */
export async function uploadAvatar(
  client: TypedSupabaseClient,
  file: File | Blob,
): Promise<string> {
  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError) throw new Error(userError.message);

  const userId = userData.user.id;
  const filePath = `${userId}/avatar`;

  const { error: uploadError } = await client.storage
    .from('avatars')
    .upload(filePath, file, { upsert: true });

  if (uploadError) throw new Error(uploadError.message);

  const { data: urlData } = client.storage.from('avatars').getPublicUrl(filePath);
  const publicUrl = urlData.publicUrl;

  // Update profile with new avatar URL
  await client.from('profiles').update({ avatar_url: publicUrl }).eq('id', userId);

  return publicUrl;
}

/** Search for users by username or display name */
export async function searchProfiles(
  client: TypedSupabaseClient,
  query: string,
): Promise<User[]> {
  const { data, error } = await client
    .from('profiles')
    .select('id, username, display_name, avatar_url, bio, created_at')
    .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`)
    .limit(20);

  if (error) throw new Error(error.message);
  return data as User[];
}
