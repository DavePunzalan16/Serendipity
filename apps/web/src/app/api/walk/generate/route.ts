import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Mock stop names mapped by vibe tag.
 * In production these would come from an AI service + Google Places.
 */
const VIBE_STOPS: Record<string, { name: string; description: string }[]> = {
  chill: [
    { name: "Quiet Garden Nook", description: "A peaceful hideaway with rustling leaves and soft light." },
    { name: "Sunset Bench", description: "Watch the golden hour paint the rooftops from this quiet perch." },
    { name: "Calm Corner Café", description: "The kind of place where time slows down with every sip." },
    { name: "Zen Fountain Plaza", description: "Running water and open space for a mindful pause." },
    { name: "Whispering Willows Path", description: "Dappled shade and birdsong guide your steps." },
  ],
  adventurous: [
    { name: "Hidden Alley Mural", description: "Street art that tells a story most people walk right past." },
    { name: "Rooftop Overlook", description: "Climb up for a panoramic reward that few know about." },
    { name: "Secret Staircase", description: "A passageway that feels like stepping into another world." },
    { name: "Urban Trail Head", description: "Where the city meets the wild—an unexpected trailhead." },
    { name: "Abandoned Rail Bridge", description: "Repurposed infrastructure with gritty charm and wide views." },
  ],
  social: [
    { name: "Community Board Corner", description: "See what the neighborhood is buzzing about today." },
    { name: "Busker's Stage", description: "Live street music that turns strangers into an audience." },
    { name: "Popup Market Spot", description: "Local vendors and handmade finds on a good day." },
    { name: "Shared Table Park", description: "A long table under old trees—sit and say hello." },
    { name: "Dog Park Hangout", description: "Happy dogs and happier owners make this a social hub." },
  ],
  cultural: [
    { name: "Historic Plaque Stop", description: "A piece of history hiding in plain sight on this wall." },
    { name: "Local Gallery Window", description: "Rotating art behind glass—a free exhibition any time." },
    { name: "Heritage Archway", description: "Architecture that whispers of another era." },
    { name: "Storyteller's Bench", description: "Generations have shared tales in this exact spot." },
    { name: "Old Library Steps", description: "Carved stone and the weight of knowledge surround you." },
  ],
  foodie: [
    { name: "Cozy Café Corner", description: "Artisan coffee and the aroma of fresh pastries linger here." },
    { name: "Street Food Alley", description: "A parade of sizzling flavors from around the world." },
    { name: "Urban Art Gallery", description: "Walls alive with color frame a tucked-away food stand." },
    { name: "Spice Market Lane", description: "Follow your nose through towers of cumin, saffron, and chili." },
    { name: "Bakery Window Stop", description: "Warm bread smells drift out—resistance is futile." },
  ],
  nature: [
    { name: "Hidden Garden Gate", description: "Push through the ivy and discover a green pocket paradise." },
    { name: "Creek Crossing", description: "Stepping stones over gentle water under a canopy of green." },
    { name: "Wildflower Meadow", description: "Seasonal blooms paint this clearing in vivid color." },
    { name: "Ancient Oak Pause", description: "A single tree older than the surrounding buildings—sit beneath it." },
    { name: "Birdsong Lookout", description: "An elevated clearing where you can hear the dawn chorus all day." },
  ],
  default: [
    { name: "Interesting Corner", description: "A spot worth stopping at—look around carefully." },
    { name: "Scenic Pause", description: "Take a moment to soak in the surroundings." },
    { name: "Discovery Point", description: "Something new reveals itself if you look closely." },
    { name: "Wander Waypoint", description: "Let serendipity guide your next thought here." },
    { name: "The Unexpected Turn", description: "Sometimes the best finds are around the unplanned corner." },
  ],
};

function pickStopsForVibes(vibeTags: string[], count: number) {
  const stops: { name: string; description: string }[] = [];
  const usedNames = new Set<string>();

  for (let i = 0; i < count; i++) {
    // Cycle through provided vibe tags
    const tag = vibeTags[i % vibeTags.length];
    const options = VIBE_STOPS[tag] ?? VIBE_STOPS["default"];

    // Pick a random stop that hasn't been used yet
    const available = options.filter((s) => !usedNames.has(s.name));
    const pool = available.length > 0 ? available : options;
    const pick = pool[Math.floor(Math.random() * pool.length)];

    usedNames.add(pick.name);
    stops.push(pick);
  }

  return stops;
}

/**
 * Generates slight lat/lng offsets for mock stop positions around a start location.
 * Each stop is offset ~200-500m in a rough line from the start.
 */
function generateStopPositions(
  startLat: number,
  startLng: number,
  count: number
): { lat: number; lng: number }[] {
  const positions: { lat: number; lng: number }[] = [];
  // Roughly 0.002-0.004 degrees ≈ 200-400m
  const baseBearing = Math.random() * 2 * Math.PI;

  for (let i = 0; i < count; i++) {
    const distance = 0.002 + (i + 1) * 0.0015;
    const angle = baseBearing + (Math.random() - 0.5) * 0.8;
    positions.push({
      lat: startLat + distance * Math.cos(angle),
      lng: startLng + distance * Math.sin(angle),
    });
  }

  return positions;
}

/**
 * Builds a WKT LineString from an array of {lat, lng} points.
 * PostGIS expects POINT(lng lat) ordering.
 */
function buildLineStringWKT(points: { lat: number; lng: number }[]): string {
  const coords = points.map((p) => `${p.lng} ${p.lat}`).join(", ");
  return `SRID=4326;LINESTRING(${coords})`;
}

/**
 * POST /api/walk/generate
 *
 * Generates a new walk with AI-curated stops (mocked for now).
 *
 * Request body:
 * {
 *   duration_minutes: number,
 *   vibe_tags: string[],
 *   start_location: { lat: number, lng: number }
 * }
 *
 * - Returns 401 if not authenticated
 * - Returns 400 if required fields are missing or invalid
 * - Returns 201 with the created walk and stops on success
 */
export async function POST(request: Request) {
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

    // Parse and validate request body
    const body = await request.json();
    const { duration_minutes, vibe_tags, start_location } = body;

    if (
      typeof duration_minutes !== "number" ||
      duration_minutes < 5 ||
      duration_minutes > 180
    ) {
      return NextResponse.json(
        { error: "duration_minutes must be a number between 5 and 180" },
        { status: 400 }
      );
    }

    if (!Array.isArray(vibe_tags) || vibe_tags.length === 0) {
      return NextResponse.json(
        { error: "vibe_tags must be a non-empty array of strings" },
        { status: 400 }
      );
    }

    if (
      !start_location ||
      typeof start_location.lat !== "number" ||
      typeof start_location.lng !== "number"
    ) {
      return NextResponse.json(
        { error: "start_location must include numeric lat and lng" },
        { status: 400 }
      );
    }

    // Determine number of stops based on duration (3-5 stops)
    const stopCount = Math.min(5, Math.max(3, Math.floor(duration_minutes / 15)));

    // Generate mock stop data
    const stopData = pickStopsForVibes(vibe_tags, stopCount);
    const stopPositions = generateStopPositions(
      start_location.lat,
      start_location.lng,
      stopCount
    );

    // Build route geometry as a LineString connecting start → stops
    const allPoints = [
      { lat: start_location.lat, lng: start_location.lng },
      ...stopPositions,
    ];
    const routeGeometry = buildLineStringWKT(allPoints);

    // Create the walk record
    const startPointWKT = `SRID=4326;POINT(${start_location.lng} ${start_location.lat})`;

    const { data: walk, error: walkError } = await supabase
      .from("walks")
      .insert({
        user_id: user.id,
        status: "active",
        visibility: "friends_only",
        duration_minutes,
        vibe_tags,
        start_point: startPointWKT,
        route_geometry: routeGeometry,
      })
      .select("*")
      .single();

    if (walkError || !walk) {
      console.error("Failed to create walk:", walkError);
      return NextResponse.json(
        { error: "Failed to create walk" },
        { status: 500 }
      );
    }

    // Create stops for the walk
    const stopsToInsert = stopData.map((stop, index) => ({
      walk_id: walk.id,
      name: stop.name,
      description: stop.description,
      order_index: index,
      position: `SRID=4326;POINT(${stopPositions[index].lng} ${stopPositions[index].lat})`,
      visited: false,
      geofence_radius_m: 50,
    }));

    const { data: stops, error: stopsError } = await supabase
      .from("stops")
      .insert(stopsToInsert)
      .select("*");

    if (stopsError || !stops) {
      console.error("Failed to create stops:", stopsError);
      // Clean up the walk if stops fail
      await supabase.from("walks").delete().eq("id", walk.id);
      return NextResponse.json(
        { error: "Failed to create walk stops" },
        { status: 500 }
      );
    }

    return NextResponse.json({ walk, stops }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
