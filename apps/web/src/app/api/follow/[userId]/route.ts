import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/follow/[userId]
 *
 * Creates a follow relationship from the authenticated user to the target user.
 * Uses the `follow_user` DB function for atomic insert + count increment.
 *
 * - Returns 401 if not authenticated
 * - Returns 400 if attempting to follow yourself
 * - Returns 409 if already following
 * - Returns 200 on success
 *
 * Requirements: 5.1, 5.3, 5.4, 5.6, 18.2
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId: targetUserId } = await params;
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

    // Prevent self-follow (Req 5.3)
    if (user.id === targetUserId) {
      return NextResponse.json(
        { error: "Cannot follow yourself" },
        { status: 400 }
      );
    }

    // Call atomic follow function
    const { error: rpcError } = await supabase.rpc("follow_user", {
      p_target_user_id: targetUserId,
    });

    if (rpcError) {
      // Handle constraint violations from the DB function
      if (rpcError.code === "23505") {
        // unique_violation — duplicate follow
        return NextResponse.json(
          { error: "Already following this user" },
          { status: 409 }
        );
      }
      if (rpcError.code === "23514") {
        // check_violation — self-follow (DB-level fallback)
        return NextResponse.json(
          { error: "Cannot follow yourself" },
          { status: 400 }
        );
      }
      if (rpcError.code === "23503") {
        // foreign_key_violation — target user doesn't exist
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }
      throw rpcError;
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/follow/[userId]
 *
 * Removes a follow relationship from the authenticated user to the target user.
 * Uses the `unfollow_user` DB function for atomic delete + count decrement.
 *
 * - Returns 401 if not authenticated
 * - Returns 200 on success (idempotent — returns success even if not following)
 *
 * Requirements: 5.2, 5.6, 18.2
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId: targetUserId } = await params;
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

    // Call atomic unfollow function (returns true if actually unfollowed, false if wasn't following)
    const { error: rpcError } = await supabase.rpc("unfollow_user", {
      p_target_user_id: targetUserId,
    });

    if (rpcError) {
      throw rpcError;
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
