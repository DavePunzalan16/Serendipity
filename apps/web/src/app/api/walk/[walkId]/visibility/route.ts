import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const VALID_VISIBILITY_VALUES = ["public", "friends_only", "private"] as const;

/**
 * PATCH /api/walk/[walkId]/visibility
 *
 * Updates the visibility setting for a walk.
 * Only the walk owner can update visibility (enforced by RLS `walks_update` policy).
 *
 * Request body: { "visibility": "public" | "friends_only" | "private" }
 *
 * - Returns 401 if not authenticated
 * - Returns 400 if visibility value is invalid
 * - Returns 404 if walk not found or user is not the owner (RLS returns empty result)
 * - Returns 200 with updated visibility on success
 *
 * Requirements: 3.2, 18.7
 */
export async function PATCH(
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

    // Parse and validate request body
    const body = await request.json();
    const { visibility } = body;

    if (
      !visibility ||
      !VALID_VISIBILITY_VALUES.includes(visibility)
    ) {
      return NextResponse.json(
        {
          error: "Invalid visibility value. Must be one of: public, friends_only, private",
        },
        { status: 400 }
      );
    }

    // Update walk visibility — RLS enforces owner-only updates
    const { data: updatedWalk, error: updateError } = await supabase
      .from("walks")
      .update({ visibility })
      .eq("id", walkId)
      .select("id, visibility")
      .single();

    if (updateError || !updatedWalk) {
      // RLS will cause an empty result if user is not the owner,
      // or the walk doesn't exist — return 404 in both cases (Req 3.7)
      return NextResponse.json(
        { error: "Walk not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: updatedWalk.id,
      visibility: updatedWalk.visibility,
    });
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
