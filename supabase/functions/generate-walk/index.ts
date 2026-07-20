/// <reference lib="deno.window" />

/**
 * Supabase Edge Function: generate-walk
 *
 * Generates an AI-curated walk with stops based on user preferences.
 * This is a stub that returns mock data. Full implementation will integrate
 * Claude (route narration) and Google Places/Directions APIs.
 *
 * Request body:
 * {
 *   duration_minutes: number,
 *   vibe_tags: string[],
 *   start_location: { lat: number, lng: number }
 * }
 *
 * Response:
 * {
 *   walk: { duration_minutes, vibe_tags, start_point, route_geometry },
 *   stops: Array<{ name, description, position, order_index }>
 * }
 */

interface StartLocation {
  lat: number;
  lng: number;
}

interface GenerateWalkRequest {
  duration_minutes: number;
  vibe_tags: string[];
  start_location: StartLocation;
}

interface Stop {
  name: string;
  description: string;
  position: { lat: number; lng: number };
  order_index: number;
}

interface GenerateWalkResponse {
  walk: {
    duration_minutes: number;
    vibe_tags: string[];
    start_point: { lat: number; lng: number };
    route_geometry: { lat: number; lng: number }[];
  };
  stops: Stop[];
}

const MOCK_STOPS: Record<string, { name: string; description: string }[]> = {
  chill: [
    { name: "Quiet Garden Nook", description: "A peaceful hideaway with rustling leaves." },
    { name: "Sunset Bench", description: "Watch the golden hour from this quiet perch." },
    { name: "Zen Fountain Plaza", description: "Running water and open space for a mindful pause." },
  ],
  adventurous: [
    { name: "Hidden Alley Mural", description: "Street art that tells a forgotten story." },
    { name: "Rooftop Overlook", description: "Climb up for a panoramic reward." },
    { name: "Secret Staircase", description: "A passageway into another world." },
  ],
  social: [
    { name: "Busker's Stage", description: "Live street music turns strangers into an audience." },
    { name: "Popup Market Spot", description: "Local vendors and handmade finds." },
    { name: "Dog Park Hangout", description: "Happy dogs and happier owners." },
  ],
  cultural: [
    { name: "Historic Plaque Stop", description: "History hiding in plain sight." },
    { name: "Heritage Archway", description: "Architecture from another era." },
    { name: "Old Library Steps", description: "The weight of knowledge surrounds you." },
  ],
  foodie: [
    { name: "Cozy Café Corner", description: "Artisan coffee and fresh pastries." },
    { name: "Street Food Alley", description: "Sizzling flavors from around the world." },
    { name: "Spice Market Lane", description: "Follow your nose through towers of spice." },
  ],
  nature: [
    { name: "Hidden Garden Gate", description: "A green pocket paradise." },
    { name: "Creek Crossing", description: "Stepping stones under a canopy of green." },
    { name: "Wildflower Meadow", description: "Seasonal blooms in vivid color." },
  ],
  default: [
    { name: "Discovery Point", description: "Something new reveals itself here." },
    { name: "Scenic Pause", description: "Take a moment to soak it in." },
    { name: "Wander Waypoint", description: "Let serendipity guide you." },
  ],
};

function generateMockStops(vibeTags: string[], count: number, startLocation: StartLocation): Stop[] {
  const stops: Stop[] = [];
  const baseBearing = Math.random() * 2 * Math.PI;

  for (let i = 0; i < count; i++) {
    const tag = vibeTags[i % vibeTags.length];
    const options = MOCK_STOPS[tag] ?? MOCK_STOPS["default"];
    const pick = options[Math.floor(Math.random() * options.length)];

    // Generate position offset (~200-500m from start in a rough line)
    const distance = 0.002 + (i + 1) * 0.0015;
    const angle = baseBearing + (Math.random() - 0.5) * 0.8;

    stops.push({
      name: pick.name,
      description: pick.description,
      position: {
        lat: startLocation.lat + distance * Math.cos(angle),
        lng: startLocation.lng + distance * Math.sin(angle),
      },
      order_index: i,
    });
  }

  return stops;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body: GenerateWalkRequest = await req.json();
    const { duration_minutes, vibe_tags, start_location } = body;

    // Validate inputs
    if (typeof duration_minutes !== "number" || duration_minutes < 5 || duration_minutes > 180) {
      return new Response(
        JSON.stringify({ error: "duration_minutes must be between 5 and 180" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!Array.isArray(vibe_tags) || vibe_tags.length === 0) {
      return new Response(
        JSON.stringify({ error: "vibe_tags must be a non-empty array" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!start_location || typeof start_location.lat !== "number" || typeof start_location.lng !== "number") {
      return new Response(
        JSON.stringify({ error: "start_location must include numeric lat and lng" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // TODO: Replace with real AI + Places + Directions integration
    // - Call Claude API for thematic stop narration
    // - Call Google Places API for real POIs matching vibe
    // - Call Google Directions API for walking route geometry

    const stopCount = Math.min(5, Math.max(3, Math.floor(duration_minutes / 15)));
    const stops = generateMockStops(vibe_tags, stopCount, start_location);

    const routeGeometry = [
      { lat: start_location.lat, lng: start_location.lng },
      ...stops.map((s) => s.position),
    ];

    const response: GenerateWalkResponse = {
      walk: {
        duration_minutes,
        vibe_tags,
        start_point: start_location,
        route_geometry: routeGeometry,
      },
      stops,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (_error) {
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
