import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Mock stop name/description generators based on vibe tags.
 * In production this would call an AI service; here we use curated lists.
 */
const VIBE_STOP_OPTIONS: Record<string, { names: string[]; descriptions: string[] }> = {
  chill: {
    names: ["Quiet Garden Nook", "Sunset Bench", "Calm Corner Café", "Zen Fountain Plaza"],
    descriptions: [
      "A peaceful spot to pause and breathe deeply.",
      "Watch the world slow down from this hidden bench.",
      "Let the ambient sounds wash over you here.",
      "A tranquil pause between the city's heartbeat.",
    ],
  },
  adventurous: {
    names: ["Hidden Alley Mural", "Rooftop Overlook", "Secret Staircase", "Urban Trail Head"],
    descriptions: [
      "Discover street art that tells a forgotten story.",
      "Climb up for a view that rewards the bold.",
      "A passage most people walk right past.",
      "The city reveals its wild side here.",
    ],
  },
  social: {
    names: ["Community Board Corner", "Busker's Stage", "Popup Market Spot", "Shared Table Park"],
    descriptions: [
      "See what the neighborhood is up to today.",
      "Pause and enjoy live street performance.",
      "Local vendors gather here on good days.",
      "A natural gathering point for friendly faces.",
    ],
  },
  cultural: {
    names: ["Historic Plaque Stop", "Local Gallery Window", "Heritage Archway", "Storyteller's Bench"],
    descriptions: [
      "A piece of history hiding in plain sight.",
      "Peek through the window at rotating local art.",
      "Architecture that whispers tales of another era.",
      "Sit where generations have shared stories.",
    ],
  },
  default: {
    names: ["Interesting Corner", "Scenic Pause", "Discovery Point", "Wander Waypoint"],
    descriptions: [
      "A spot worth stopping at on your walk.",
      "Take a moment to look around and notice something new.",
      "There's always something to discover if you look closely.",
      "Let serendipity guide your next thought here.",
    ],
  },
};

function generateMockStop(vibeTags: string[] | null) {
  // Pick the first matching vibe tag, or use default
  const tag = vibeTags?.find((t) => t in VIBE_STOP_OPTIONS) ?? "default";
  const options = VIBE_STOP_OPTIONS[tag] ?? VIBE_STOP_OPTIONS["default"]!;

  const nameIdx = Math.floor(Math.random() * options!.names.length);
  const descIdx = Math.floor(Math.random() * options!.descriptions.length);

  return {
    name: options!.names[nameIdx],
    description: options!.descriptions[descIdx],
  };
}

/**
 * POST /api/walk/[walkId]/swap-stop
 *
 * Swaps an existing stop with a new randomly generated stop.
 * The new stop keeps the same order_index but gets a fresh name/description
 * based on the walk's vibe_tags.
 *
 * Request body: { "stop_id": string }
 *
 * - Returns 401 if not authenticated
 * - Returns 400 if stop_id is missing
 * - Returns 404 if walk not found or user is not the owner
 * - Returns 409 if walk is not in 'active' status
 * - Returns 404 if the specified stop does not belong to the walk
 * - Returns 200 with the new stop on success
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

    // Parse request body
    const body = await request.json();
    const { stop_id } = body;

    if (!stop_id) {
      return NextResponse.json(
        { error: "stop_id is required" },
        { status: 400 }
      );
    }

    // Fetch the walk and verify ownership + active status
    const { data: walk, error: walkError } = await supabase
      .from("walks")
      .select("id, user_id, status, vibe_tags")
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
        { error: "Walk must be in active status to swap stops" },
        { status: 409 }
      );
    }

    // Fetch the stop to be swapped
    const { data: existingStop, error: stopError } = await supabase
      .from("stops")
      .select("id, order_index, position, place_id, geofence_radius_m")
      .eq("id", stop_id)
      .eq("walk_id", walkId)
      .single();

    if (stopError || !existingStop) {
      return NextResponse.json(
        { error: "Stop not found in this walk" },
        { status: 404 }
      );
    }

    // Generate new stop data based on walk's vibe tags
    const { name, description } = generateMockStop(walk.vibe_tags);

    // Delete the old stop
    const { error: deleteError } = await supabase
      .from("stops")
      .delete()
      .eq("id", stop_id);

    if (deleteError) {
      throw deleteError;
    }

    // Insert the new stop with the same order_index
    const { data: newStop, error: insertError } = await supabase
      .from("stops")
      .insert({
        walk_id: walkId,
        name,
        description,
        order_index: existingStop.order_index,
        position: existingStop.position,
        place_id: existingStop.place_id,
        geofence_radius_m: existingStop.geofence_radius_m,
        visited: false,
        visited_at: null,
      })
      .select("*")
      .single();

    if (insertError || !newStop) {
      throw insertError;
    }

    return NextResponse.json({ stop: newStop }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
