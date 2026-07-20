import type { User } from '@wander/shared-types';
import type { TypedSupabaseClient, PaginatedResult } from './types';

const DEFAULT_PAGE_SIZE = 20;

/** Follow a user */
export async function follow(client: TypedSupabaseClient, userId: string): Promise<void> {
  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError) throw new Error(userError.message);

  const { error } = await client.from('follows').insert({
    follower_id: userData.user.id,
    following_id: userId,
  });

  if (error) throw new Error(error.message);
}

/** Unfollow a user */
export async function unfollow(client: TypedSupabaseClient, userId: string): Promise<void> {
  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError) throw new Error(userError.message);

  const { error } = await client
    .from('follows')
    .delete()
    .eq('follower_id', userData.user.id)
    .eq('following_id', userId);

  if (error) throw new Error(error.message);
}

/** Check if the current user is following a given user */
export async function isFollowing(
  client: TypedSupabaseClient,
  userId: string,
): Promise<boolean> {
  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError) throw new Error(userError.message);

  const { data, error } = await client
    .from('follows')
    .select('follower_id')
    .eq('follower_id', userData.user.id)
    .eq('following_id', userId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data !== null;
}

/** Get followers of a user with cursor-based pagination */
export async function getFollowers(
  client: TypedSupabaseClient,
  userId: string,
  cursor?: string,
  limit: number = DEFAULT_PAGE_SIZE,
): Promise<PaginatedResult<User>> {
  let query = client
    .from('follows')
    .select('follower_id, created_at, profiles!follows_follower_id_fkey(id, username, display_name, avatar_url, bio, created_at)')
    .eq('following_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit + 1);

  if (cursor) {
    query = query.lt('created_at', cursor);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  const hasMore = data.length > limit;
  const sliced = hasMore ? data.slice(0, limit) : data;
  const items = sliced.map((row: any) => row.profiles as User);
  const lastItem = sliced[sliced.length - 1];
  const next_cursor = hasMore && lastItem ? lastItem.created_at : null;

  return { items, next_cursor };
}

/** Get users that a user is following with cursor-based pagination */
export async function getFollowing(
  client: TypedSupabaseClient,
  userId: string,
  cursor?: string,
  limit: number = DEFAULT_PAGE_SIZE,
): Promise<PaginatedResult<User>> {
  let query = client
    .from('follows')
    .select('following_id, created_at, profiles!follows_following_id_fkey(id, username, display_name, avatar_url, bio, created_at)')
    .eq('follower_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit + 1);

  if (cursor) {
    query = query.lt('created_at', cursor);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  const hasMore = data.length > limit;
  const sliced = hasMore ? data.slice(0, limit) : data;
  const items = sliced.map((row: any) => row.profiles as User);
  const lastItem = sliced[sliced.length - 1];
  const next_cursor = hasMore && lastItem ? lastItem.created_at : null;

  return { items, next_cursor };
}
