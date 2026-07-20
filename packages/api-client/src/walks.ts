import type {
  Walk,
  Comment,
  VisibilitySetting,
  DiscoverRequest,
  DiscoverResponse,
} from '@wander/shared-types';
import type { TypedSupabaseClient, PaginatedResult, HistoryRequest } from './types';

const DEFAULT_PAGE_SIZE = 20;

/** Get a walk by its ID */
export async function getById(client: TypedSupabaseClient, walkId: string): Promise<Walk> {
  const { data, error } = await client
    .from('walks')
    .select('*, stops(*), photos:walk_photos(*)')
    .eq('id', walkId)
    .single();

  if (error) throw new Error(error.message);
  return data as Walk;
}

/** Toggle like on a walk. Returns the new liked state and like count. */
export async function likeToggle(
  client: TypedSupabaseClient,
  walkId: string,
): Promise<{ liked: boolean; like_count: number }> {
  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError) throw new Error(userError.message);

  const userId = userData.user.id;

  // Check if already liked
  const { data: existing } = await client
    .from('walk_likes')
    .select('id')
    .eq('walk_id', walkId)
    .eq('user_id', userId)
    .maybeSingle();

  if (existing) {
    // Unlike
    await client.from('walk_likes').delete().eq('walk_id', walkId).eq('user_id', userId);
  } else {
    // Like
    const { error } = await client
      .from('walk_likes')
      .insert({ walk_id: walkId, user_id: userId });
    if (error) throw new Error(error.message);
  }

  // Get updated count
  const { count, error: countError } = await client
    .from('walk_likes')
    .select('*', { count: 'exact', head: true })
    .eq('walk_id', walkId);

  if (countError) throw new Error(countError.message);

  return { liked: !existing, like_count: count ?? 0 };
}

/** Add a comment to a walk */
export async function comment(
  client: TypedSupabaseClient,
  walkId: string,
  text: string,
): Promise<Comment> {
  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError) throw new Error(userError.message);

  const { data, error } = await client
    .from('walk_comments')
    .insert({ walk_id: walkId, user_id: userData.user.id, text })
    .select('*, user:profiles!walk_comments_user_id_fkey(id, username, display_name, avatar_url)')
    .single();

  if (error) throw new Error(error.message);
  return data as unknown as Comment;
}

/** Get comments for a walk with cursor-based pagination */
export async function getComments(
  client: TypedSupabaseClient,
  walkId: string,
  cursor?: string,
  limit: number = DEFAULT_PAGE_SIZE,
): Promise<PaginatedResult<Comment>> {
  let query = client
    .from('walk_comments')
    .select('*, user:profiles!walk_comments_user_id_fkey(id, username, display_name, avatar_url)')
    .eq('walk_id', walkId)
    .order('created_at', { ascending: true })
    .limit(limit + 1);

  if (cursor) {
    query = query.gt('created_at', cursor);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  const hasMore = data.length > limit;
  const items = (hasMore ? data.slice(0, limit) : data) as unknown as Comment[];
  const lastItem = items[items.length - 1];
  const next_cursor = hasMore && lastItem ? lastItem.created_at : null;

  return { items, next_cursor };
}

/** Update a walk's visibility setting */
export async function updateVisibility(
  client: TypedSupabaseClient,
  walkId: string,
  visibility: VisibilitySetting,
): Promise<void> {
  const { error } = await client
    .from('walks')
    .update({ visibility })
    .eq('id', walkId);

  if (error) throw new Error(error.message);
}

/** Get walk history for the current user with optional filters */
export async function getHistory(
  client: TypedSupabaseClient,
  params: HistoryRequest,
): Promise<PaginatedResult<Walk>> {
  const limit = params.limit ?? DEFAULT_PAGE_SIZE;

  let query = client
    .from('walks')
    .select('*, stops(*), photos:walk_photos(*)')
    .order('created_at', { ascending: false })
    .limit(limit + 1);

  if (params.user_id) {
    query = query.eq('user_id', params.user_id);
  } else {
    // Default to current user
    const { data: userData, error: userError } = await client.auth.getUser();
    if (userError) throw new Error(userError.message);
    query = query.eq('user_id', userData.user.id);
  }

  if (params.vibe_tag) {
    query = query.contains('vibe_tags', [params.vibe_tag]);
  }
  if (params.date_from) {
    query = query.gte('created_at', params.date_from);
  }
  if (params.date_to) {
    query = query.lte('created_at', params.date_to);
  }
  if (params.cursor) {
    query = query.lt('created_at', params.cursor);
  }

  // Only show completed walks in history
  query = query.not('completed_at', 'is', null);

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  const hasMore = data.length > limit;
  const items = (hasMore ? data.slice(0, limit) : data) as Walk[];
  const lastItem = items[items.length - 1];
  const next_cursor = hasMore && lastItem ? lastItem.created_at : null;

  return { items, next_cursor };
}

/** Discover public walks within a viewport with optional filters */
export async function discover(
  client: TypedSupabaseClient,
  params: DiscoverRequest,
): Promise<DiscoverResponse> {
  const limit = params.limit ?? DEFAULT_PAGE_SIZE;

  const { data, error } = await client.rpc('discover_walks', {
    viewport_north: params.viewport.north,
    viewport_south: params.viewport.south,
    viewport_east: params.viewport.east,
    viewport_west: params.viewport.west,
    filter_vibe_tag: params.vibe_tag ?? null,
    filter_radius_km: params.radius_km ?? null,
    sort_by: params.sort ?? 'recent',
    page_cursor: params.cursor ?? null,
    page_limit: limit,
  });

  if (error) throw new Error(error.message);
  return data as DiscoverResponse;
}

/** Clone an existing walk's route into a new walk for the current user */
export async function cloneRoute(
  client: TypedSupabaseClient,
  walkId: string,
): Promise<Walk> {
  const { data, error } = await client.rpc('clone_walk_route', { source_walk_id: walkId });
  if (error) throw new Error(error.message);

  // Fetch the newly created walk
  const newWalkId = (data as any).id ?? data;
  return getById(client, typeof newWalkId === 'string' ? newWalkId : walkId);
}
