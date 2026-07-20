import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/walk/[walkId]/complete
 *
 * Marks a walk as completed.
 * Updates walk: status → 'completed', completed_at → now(), calculates duration.
 * Increments user profile: total_walks + 1, total_distance_km + walk.distance_km.
 *
 * - Returns 401 if not authenticated
 * - Returns 404 if walk not found or user is not the owner
 * - Returns 409 if walk is not in 'active' status
 * - Returns 200 with the updated walk on success
 *
 * Requirements: 9.6
 */
export async function POST(
  _request: Request,
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

    // Fetch the walk and verify ownership + active status
    const { data: walk, error: walkError } = await supabase
      .from("walks")
      .select("id, user_id, status, distance_km, created_at")
      .eq("id", walkId)
      .eq("user_id", user.id)
      .single();

    if (walkError || !walk) {
      return NextResponse.json(
        { error: "Walk not found" },
        { status: 404 }
      );
    }

    if (walk.status !== "active") {
      return NextResponse.json(
        { error: "Walk must be in active status to complete" },
        { status: 409 }
      );
    }

    // Calculate duration from creation to now
    const completedAt = new Date().toISOString();
    const createdAt = new Date(walk.created_at);
    const durationMinutes = Math.round(
      (Date.now() - createdAt.getTime()) / (1000 * 60)
    );

    // Update walk to completed
    const { data: updatedWalk, error: updateError } = await supabase
      .from("walks")
      .update({
        status: "completed",
        completed_at: completedAt,
        duration_minutes: durationMinutes,
      })
      .eq("id", walkId)
      .select("*")
      .single();

    if (updateError || !updatedWalk) {
      return NextResponse.json(
        { error: "Failed to complete walk" },
        { status: 500 }
      );
    }

    // Increment user profile stats
    const distanceToAdd = parseFloat(walk.distance_km) || 0;

    await supabase.rpc("increment_profile_stats", {
      p_user_id: user.id,
      p_distance_km: distanceToAdd,
    }).catch((err: unknown) => {
      console.warn("Could not update profile stats:", err);
    });

    return NextResponse.json({ walk: updatedWalk }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
