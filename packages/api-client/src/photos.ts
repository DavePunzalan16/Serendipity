import type { WalkPhoto } from '@wander/shared-types';
import type { TypedSupabaseClient } from './types';

/** Upload a photo for a walk (optionally associated with a stop) */
export async function upload(
  client: TypedSupabaseClient,
  walkId: string,
  stopId: string | null,
  file: File | Blob,
): Promise<WalkPhoto> {
  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError) throw new Error(userError.message);

  const timestamp = Date.now();
  const filePath = `${walkId}/${timestamp}`;

  const { error: uploadError } = await client.storage
    .from('walk-photos')
    .upload(filePath, file);

  if (uploadError) throw new Error(uploadError.message);

  const { data: urlData } = client.storage.from('walk-photos').getPublicUrl(filePath);

  // Insert photo record
  const { data, error } = await client
    .from('walk_photos')
    .insert({
      walk_id: walkId,
      stop_id: stopId,
      storage_path: filePath,
      url: urlData.publicUrl,
      captured_at: new Date().toISOString(),
    })
    .select('*')
    .single();

  if (error) throw new Error(error.message);
  return data as WalkPhoto;
}

/** Get all photos for a walk */
export async function getForWalk(
  client: TypedSupabaseClient,
  walkId: string,
): Promise<WalkPhoto[]> {
  const { data, error } = await client
    .from('walk_photos')
    .select('*')
    .eq('walk_id', walkId)
    .order('captured_at', { ascending: true });

  if (error) throw new Error(error.message);
  return data as WalkPhoto[];
}
