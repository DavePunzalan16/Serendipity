import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/profile/search?q=<query>
 *
 * Searches for users by username or display_name using trigram matching.
 * Returns up to 20 matching profiles.
 * Requirements: 5.5 (search by display name or username within 2 seconds)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: "Search query parameter 'q' is required" },
        { status: 400 }
      );
    }

    const trimmedQuery = query.trim();

    const supabase = await createClient();

    // Use ilike for trigram-compatible matching on username and display_name.
    // The GIN trigram indexes on profiles support this pattern efficiently.
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("id, username, display_name, avatar_url, bio, created_at")
      .or(
        `username.ilike.%${trimmedQuery}%,display_name.ilike.%${trimmedQuery}%`
      )
      .limit(20);

    if (error) {
      return NextResponse.json(
        { error: "Search failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ profiles: profiles ?? [] });
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
