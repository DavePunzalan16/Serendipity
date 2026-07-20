import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/walk/[walkId]/comment
 *
 * Creates a new comment on the specified walk.
 * Inserts into `walk_comments` and increments `comment_count` on the walks table.
 *
 * - Returns 401 if not authenticated
 * - Returns 400 if body is empty or exceeds 1000 chars
 * - Returns the created comment with user info on success
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ walkId: string }> }
) {
  try {
    const { walkId } = await params;
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

    // Parse and validate body
    const { body } = await request.json();

    if (!body || typeof body !== "string" || body.trim().length === 0) {
      return NextResponse.json(
        { error: "Comment body is required" },
        { status: 400 }
      );
    }

    if (body.length > 1000) {
      return NextResponse.json(
        { error: "Comment must be 1000 characters or less" },
        { status: 400 }
      );
    }

    // Insert the comment
    const { data: comment, error: insertError } = await supabase
      .from("walk_comments")
      .insert({
        walk_id: walkId,
        user_id: user.id,
        body: body.trim(),
      })
      .select(
        `
        id,
        body,
        created_at,
        user_id,
        profiles:user_id (
          username,
          display_name,
          avatar_url
        )
      `
      )
      .single();

    if (insertError) {
      throw insertError;
    }

    // Increment comment_count on the walk
    const { error: updateError } = await supabase.rpc("increment", {
      table_name: "walks",
      column_name: "comment_count",
      row_id: walkId,
    });

    if (updateError) {
      // Comment was created but count update failed — log but don't fail the request
      console.error("Failed to increment comment_count:", updateError);
    }

    return NextResponse.json(comment, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/walk/[walkId]/comment
 *
 * Retrieves comments for a walk in chronological order (ascending by created_at).
 * Supports cursor-based pagination.
 *
 * Query params:
 * - cursor: ISO timestamp to paginate after (optional)
 * - limit: number of comments to fetch (default 20, max 50)
 *
 * Returns { comments: Comment[], next_cursor: string | null }
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ walkId: string }> }
) {
  try {
    const { walkId } = await params;
    const supabase = await createClient();

    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor");
    const limitParam = searchParams.get("limit");
    const limit = Math.min(Math.max(parseInt(limitParam || "20", 10) || 20, 1), 50);

    // Build query
    let query = supabase
      .from("walk_comments")
      .select(
        `
        id,
        body,
        created_at,
        user_id,
        profiles:user_id (
          username,
          display_name,
          avatar_url
        )
      `
      )
      .eq("walk_id", walkId)
      .order("created_at", { ascending: true })
      .limit(limit + 1); // Fetch one extra to determine if there's a next page

    if (cursor) {
      query = query.gt("created_at", cursor);
    }

    const { data: comments, error } = await query;

    if (error) {
      throw error;
    }

    // Determine pagination
    let next_cursor: string | null = null;
    if (comments && comments.length > limit) {
      const lastIncluded = comments[limit - 1];
      next_cursor = lastIncluded.created_at;
      comments.splice(limit); // Remove the extra item
    }

    return NextResponse.json(
      { comments: comments || [], next_cursor },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
