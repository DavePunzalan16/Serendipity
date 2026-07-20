import type { NotificationPreferences } from '@wander/shared-types';
import type { TypedSupabaseClient } from './types';

/** Get the current user's notification preferences */
export async function getPreferences(
  client: TypedSupabaseClient,
): Promise<NotificationPreferences> {
  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError) throw new Error(userError.message);

  const { data, error } = await client
    .from('notification_preferences')
    .select('*')
    .eq('user_id', userData.user.id)
    .single();

  if (error) throw new Error(error.message);
  return data as NotificationPreferences;
}

/** Update the current user's notification preferences */
export async function updatePreferences(
  client: TypedSupabaseClient,
  prefs: Partial<NotificationPreferences>,
): Promise<void> {
  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError) throw new Error(userError.message);

  const { error } = await client
    .from('notification_preferences')
    .update(prefs)
    .eq('user_id', userData.user.id);

  if (error) throw new Error(error.message);
}

/** Register a push notification token for the current user's device */
export async function registerPushToken(
  client: TypedSupabaseClient,
  token: string,
): Promise<void> {
  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError) throw new Error(userError.message);

  const { error } = await client.from('push_tokens').upsert(
    {
      user_id: userData.user.id,
      token,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,token' },
  );

  if (error) throw new Error(error.message);
}
