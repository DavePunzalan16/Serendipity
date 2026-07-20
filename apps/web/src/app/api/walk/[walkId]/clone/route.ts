import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/walk/[walkId]/clone
 *
 * Clones a walk's route and stops into a new walk for the authenticated user.
 * The new walk gets:
 *   - title prefixed with "Re: "
 *   - same route_geometry, start_point, vibe_tags
 *   - duplicated stops (reset to unvisited)
 *   - status "active", visibility "friends_only"
 *
 * - Returns 401 if not authenticated
 * - Returns 404 if the original walk is not found or not public
 * - Returns 201 with the new walk on success
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

    // Fetch the original walk (must be public or owned by user)
    const { data: originalWalk, error: walkError } = await supabase
      .from("walks")
      .select(
        "id, title, route_geometry, start_point, vibe_tags, distance_km"
      )
      .eq("id", walkId)
      .single();

    if (walkError || !originalWalk) {
      return NextResponse.json(
        { error: "Walk not found" },
        { status: 404 }
      );
    }

    // Fetch the original stops
    const { data: originalStops, error: stopsError } = await supabase
      .from("stops")
      .select(
        "name, description, narrative, position, order_index, place_id, geofence_radius_m"
      )
      .eq("walk_id", walkId)
      .order("order_index", { ascending: true });

    if (stopsError) {
      throw stopsError;
    }

    // Create the cloned walk
    const { data: newWalk, error: insertError } = await supabase
      .from("walks")
      .insert({
        user_id: user.id,
        title: `Re: ${originalWalk.title}`,
        route_geometry: originalWalk.route_geometry,
        start_point: originalWalk.start_point,
        vibe_tags: originalWalk.vibe_tags ?? [],
        distance_km: originalWalk.distance_km,
        status: "active",
        visibility: "friends_only",
      })
      .select("id, title, vibe_tags, status, visibility, created_at")
      .single();

    if (insertError || !newWalk) {
      throw insertError;
    }

    // Duplicate stops into the new walk (reset visited state)
    if (originalStops && originalStops.length > 0) {
      const clonedStops = originalStops.map(
        (stop: Record<string, unknown>) => ({
          walk_id: newWalk.id,
          name: stop.name,
          description: stop.description,
          narrative: stop.narrative,
          position: stop.position,
          order_index: stop.order_index,
          place_id: stop.place_id,
          geofence_radius_m: stop.geofence_radius_m,
          visited: false,
          visited_at: null,
        })
      );

      const { error: stopsInsertError } = await supabase
        .from("stops")
        .insert(clonedStops);

      if (stopsInsertError) {
        throw stopsInsertError;
      }
    }

    return NextResponse.json(
      {
        walk: {
          id: newWalk.id,
          title: newWalk.title,
          vibe_tags: newWalk.vibe_tags,
          status: newWalk.status,
          visibility: newWalk.visibility,
          created_at: newWalk.created_at,
          cloned_from: walkId,
          stops_count: originalStops?.length ?? 0,
        },
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
