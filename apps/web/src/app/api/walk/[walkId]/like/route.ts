import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/walk/[walkId]/like
 *
 * Toggles a like on a walk for the authenticated user.
 * Uses the `toggle_like()` database function for atomic like/unlike + count update.
 *
 * - Returns 401 if not authenticated
 * - Returns { liked, like_count } on success
 *
 * Requirements: 7.1, 7.4, 18.4
 */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ walkId: string }> }
) {
  try {
    const { walkId } = await params;
    const supabase = await createClient();

    // Check authentication (Req 7.4)
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

    // Call the toggle_like database function (Req 7.1, 18.4)
    const { data, error: rpcError } = await supabase.rpc("toggle_like", {
      p_walk_id: walkId,
    });

    if (rpcError) {
      // Walk not found or RLS denied access
      if (rpcError.code === "23503") {
        return NextResponse.json(
          { error: "Walk not found" },
          { status: 404 }
        );
      }
      throw rpcError;
    }

    // toggle_like returns a single row with { liked, like_count }
    const result = Array.isArray(data) ? data[0] : data;

    return NextResponse.json({
      liked: result.liked,
      like_count: result.like_count,
    });
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
