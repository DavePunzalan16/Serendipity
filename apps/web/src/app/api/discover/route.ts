import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;

/**
 * GET /api/discover
 *
 * Public discovery endpoint — returns walks within a map viewport with optional
 * vibe tag filtering, radius constraints, and sort modes.
 *
 * Query params:
 *   - north, south, east, west: viewport bounds (required)
 *   - vibe: filter by vibe tag (optional)
 *   - radius_km: distance radius in km (optional, requires lat/lng)
 *   - lat, lng: user location for radius filtering (optional)
 *   - sort: "recent" (default) or "popular"
 *   - cursor: ISO timestamp for cursor-based pagination (optional)
 *   - limit: number of items to return, default 50, max 100 (optional)
 *
 * Response: { walks: WalkMapItem[], next_cursor: string | null }
 *
 * No authentication required — discovery is public.
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = request.nextUrl;

    // Parse viewport bounds (required)
    const north = parseFloat(searchParams.get("north") ?? "");
    const south = parseFloat(searchParams.get("south") ?? "");
    const east = parseFloat(searchParams.get("east") ?? "");
    const west = parseFloat(searchParams.get("west") ?? "");

    if ([north, south, east, west].some(Number.isNaN)) {
      return NextResponse.json(
        { error: "Viewport bounds (north, south, east, west) are required" },
        { status: 400 }
      );
    }

    // Parse optional filters
    const vibe = searchParams.get("vibe") || null;
    const radiusKm = parseFloat(searchParams.get("radius_km") ?? "");
    const lat = parseFloat(searchParams.get("lat") ?? "");
    const lng = parseFloat(searchParams.get("lng") ?? "");
    const sort = searchParams.get("sort") === "popular" ? "popular" : "recent";
    const cursor = searchParams.get("cursor") || null;

    const limitParam = parseInt(searchParams.get("limit") ?? "", 10);
    const limit = Number.isNaN(limitParam)
      ? DEFAULT_LIMIT
      : Math.min(Math.max(limitParam, 1), MAX_LIMIT);

    // Build PostGIS viewport geometry
    const p_viewport = `SRID=4326;${buildEnvelope(west, south, east, north)}`;

    // Build optional user location point for radius filtering
    let p_user_location: string | null = null;
    let p_radius_km: number | null = null;

    if (!Number.isNaN(radiusKm) && !Number.isNaN(lat) && !Number.isNaN(lng)) {
      p_user_location = `SRID=4326;POINT(${lng} ${lat})`;
      p_radius_km = radiusKm;
    }

    // Call the discover_walks database function
    const { data, error: rpcError } = await supabase.rpc("discover_walks", {
      p_viewport,
      p_vibe_tag: vibe,
      p_radius_km,
      p_user_location,
      p_sort: sort,
      p_cursor: cursor,
      p_limit: limit,
    });

    if (rpcError) {
      throw rpcError;
    }

    const rows = data ?? [];

    // Map DB rows to WalkMapItem format
    const walks = rows.map((row: Record<string, unknown>) => ({
      id: row.id,
      user_id: row.user_id,
      title: row.title,
      narrative_snippet: row.narrative
        ? String(row.narrative).slice(0, 200)
        : "",
      vibe_tags: row.vibe_tags ?? [],
      duration_minutes: row.duration_minutes ?? 0,
      distance_km: row.distance_km ?? 0,
      like_count: row.like_count ?? 0,
      start_point: row.start_point,
      route_geometry: row.route_geometry,
      created_at: row.created_at,
      user: {
        username: row.username,
        display_name: row.display_name,
        avatar_url: row.avatar_url,
      },
    }));

    // Determine next_cursor: last item's created_at if we got a full page
    const next_cursor =
      walks.length >= limit
        ? (walks[walks.length - 1].created_at as string)
        : null;

    return NextResponse.json({ walks, next_cursor });
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

/**
 * Builds a WKT polygon representing the viewport envelope.
 */
function buildEnvelope(
  west: number,
  south: number,
  east: number,
  north: number
): string {
  return `POLYGON((${west} ${south},${east} ${south},${east} ${north},${west} ${north},${west} ${south}))`;
}
