import type { FeedRequest, FeedResponse } from '@wander/shared-types';
import type { TypedSupabaseClient } from './types';

const DEFAULT_FEED_LIMIT = 20;

/** Get the social feed for the current user with cursor-based pagination */
export async function getFeed(
  client: TypedSupabaseClient,
  params: FeedRequest,
): Promise<FeedResponse> {
  const limit = params.limit ?? DEFAULT_FEED_LIMIT;

  let query = client
    .from('feed_cards')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit + 1);

  if (params.cursor) {
    query = query.lt('created_at', params.cursor);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  const hasMore = data.length > limit;
  const items = hasMore ? data.slice(0, limit) : data;
  const next_cursor = hasMore ? items[items.length - 1].created_at : null;

  return { items, next_cursor };
}
