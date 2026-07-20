import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/walk/history
 *
 * Returns the authenticated user's completed walks in reverse-chronological order.
 * Supports cursor-based pagination and optional filtering by vibe tag and date range.
 *
 * Query params:
 *   - cursor: ISO timestamp for cursor-based pagination
 *   - limit: number of results (default 20, max 100)
 *   - vibe: filter by vibe tag
 *   - from: filter walks created on or after this date (ISO date string)
 *   - to: filter walks created on or before this date (ISO date string)
 *
 * Returns:
 *   { walks: WalkHistoryItem[], next_cursor: string | null }
 *
 * - Returns 401 if not authenticated
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
    const searchParams = request.nextUrl.searchParams;
    const cursor = searchParams.get("cursor");
    const limitParam = searchParams.get("limit");
    const vibe = searchParams.get("vibe");
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const limit = Math.min(Math.max(parseInt(limitParam || "20", 10) || 20, 1), 100);

    // Build query
    let query = supabase
      .from("walks")
      .select(
        "id, title, created_at, completed_at, duration_minutes, distance_km, vibe_tags, like_count, comment_count"
      )
      .eq("user_id", user.id)
      .eq("status", "completed")
      .order("created_at", { ascending: false })
      .limit(limit);

    // Apply cursor pagination
    if (cursor) {
      query = query.lt("created_at", cursor);
    }

    // Filter by vibe tag
    if (vibe) {
      query = query.contains("vibe_tags", [vibe]);
    }

    // Filter by date range
    if (from) {
      query = query.gte("created_at", from);
    }
    if (to) {
      query = query.lte("created_at", to);
    }

    const { data: walks, error: queryError } = await query;

    if (queryError) {
      throw queryError;
    }

    // Determine next cursor
    const next_cursor =
      walks && walks.length === limit
        ? walks[walks.length - 1]!.created_at
        : null;

    // Map to response shape
    const walkItems = (walks || []).map((walk) => ({
      id: walk.id,
      title: walk.title,
      date: walk.created_at,
      duration: walk.duration_minutes,
      distance: walk.distance_km,
      vibe_tags: walk.vibe_tags,
      like_count: walk.like_count,
      comment_count: walk.comment_count,
      created_at: walk.created_at,
      completed_at: walk.completed_at,
    }));

    return NextResponse.json(
      { walks: walkItems, next_cursor },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
