import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/walk/[walkId]/like
 *
 * Toggles the like state for the authenticated user on the specified walk.
 * Uses the `toggle_like` DB function for atomic toggle + count update.
 *
 * - Returns 401 if not authenticated
 * - Returns { liked: boolean, like_count: number } on success
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

    // Call atomic toggle_like function
    const { data, error: rpcError } = await supabase.rpc("toggle_like", {
      p_walk_id: walkId,
    });

    if (rpcError) {
      throw rpcError;
    }

    return NextResponse.json(
      { liked: data.liked, like_count: data.like_count },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
