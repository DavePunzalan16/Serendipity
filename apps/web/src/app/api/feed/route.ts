import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

/**
 * GET /api/feed
 *
 * Returns the social feed for the authenticated user with cursor-based pagination.
 * Fetches walks from followed users with 'public' or 'friends_only' visibility.
 *
 * Query params:
 *   - cursor: ISO timestamp for cursor-based pagination (optional)
 *   - limit: number of items to return, default 20, max 50 (optional)
 *
 * Response: { items: FeedCard[], next_cursor: string | null }
 *
 * - Returns 401 if not authenticated
 * - Returns empty items array with hint when no feed items exist
 *
 * Requirements: 6.1, 6.3, 8.1
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Parse query params
    const { searchParams } = request.nextUrl;
    const cursor = searchParams.get("cursor") || null;
    const limitParam = parseInt(searchParams.get("limit") ?? "", 10);
    const limit = Number.isNaN(limitParam)
      ? DEFAULT_LIMIT
      : Math.min(Math.max(limitParam, 1), MAX_LIMIT);

    // Call the get_feed database function
    const { data, error: rpcError } = await supabase.rpc("get_feed", {
      p_user_id: user.id,
      p_cursor: cursor,
      p_limit: limit,
    });

    if (rpcError) {
      throw rpcError;
    }

    const rows = data ?? [];

    // Empty state detection
    if (rows.length === 0) {
      return NextResponse.json({
        items: [],
        next_cursor: null,
        hint: cursor
          ? "No more walks to show."
          : "Follow other wanderers to see their walks here.",
      });
    }

    // Map DB rows to FeedCard shape
    const items = rows.map((row: Record<string, unknown>) => ({
      walk_id: row.id,
      user: {
        id: row.user_id,
        username: row.username,
        display_name: row.display_name,
        avatar_url: row.avatar_url,
      },
      narrative_snippet: row.narrative
        ? String(row.narrative).slice(0, 200)
        : "",
      route_thumbnail_url: "", // Thumbnail generated client-side from route geometry
      distance_km: row.distance_km ?? 0,
      duration_minutes: row.duration_minutes ?? 0,
      vibe_tags: row.vibe_tags ?? [],
      like_count: row.like_count ?? 0,
      comment_count: row.comment_count ?? 0,
      is_liked_by_viewer: row.is_liked ?? false,
      created_at: row.created_at,
    }));

    // Determine next_cursor: last item's created_at if we got a full page
    const next_cursor =
      items.length >= limit
        ? (items[items.length - 1].created_at as string)
        : null;

    return NextResponse.json({ items, next_cursor });
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
