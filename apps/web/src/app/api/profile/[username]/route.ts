import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/profile/[username]
 *
 * Returns the public profile for a user by username, including visible walk summaries.
 * Viewable without authentication (Req 4.3: public profile URL).
 * If the user has only private walks, profile metadata is shown but no walk content (Req 4.4).
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    const supabase = await createClient();

    // Fetch profile by username
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("username", username)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    // Fetch badges for the user
    const { data: badges } = await supabase
      .from("user_badges")
      .select("badge_id, earned_at, badges(id, name, description, icon_url)")
      .eq("user_id", profile.id);

    // Fetch public walk summaries (RLS handles visibility filtering)
    // Only show public walks on a public profile view
    const { data: walks } = await supabase
      .from("walks")
      .select(
        "id, title, narrative, vibe_tags, duration_minutes, distance_km, like_count, comment_count, created_at, completed_at, visibility"
      )
      .eq("user_id", profile.id)
      .eq("visibility", "public")
      .eq("status", "completed")
      .order("created_at", { ascending: false })
      .limit(10);

    const formattedBadges = (badges ?? []).map((b: any) => ({
      id: b.badges?.id ?? b.badge_id,
      name: b.badges?.name ?? "",
      description: b.badges?.description ?? "",
      icon_url: b.badges?.icon_url ?? "",
      earned_at: b.earned_at,
    }));

    return NextResponse.json({
      profile: {
        id: profile.id,
        username: profile.username,
        display_name: profile.display_name,
        bio: profile.bio,
        avatar_url: profile.avatar_url,
        total_walks: profile.total_walks,
        total_distance_km: profile.total_distance_km,
        favorite_vibes: profile.favorite_vibes,
        follower_count: profile.follower_count,
        following_count: profile.following_count,
        badges: formattedBadges,
        created_at: profile.created_at,
      },
      walks: walks ?? [],
    });
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/profile/[username]
 *
 * Updates the authenticated user's profile. Only the profile owner can update.
 * Allows updating: display_name, bio, favorite_vibes.
 * Requirements: 4.2 (profile field updates), 16.2 (owner-only write via RLS).
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    const supabase = await createClient();

    // Get the authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Verify the user owns this profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    if (profile.id !== user.id) {
      return NextResponse.json(
        { error: "You can only update your own profile" },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Only allow specific fields to be updated
    const allowedFields: Record<string, unknown> = {};
    if (body.display_name !== undefined) {
      allowedFields.display_name = body.display_name;
    }
    if (body.bio !== undefined) {
      allowedFields.bio = body.bio;
    }
    if (body.favorite_vibes !== undefined) {
      allowedFields.favorite_vibes = body.favorite_vibes;
    }

    if (Object.keys(allowedFields).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    // Set updated_at timestamp
    allowedFields.updated_at = new Date().toISOString();

    const { data: updatedProfile, error: updateError } = await supabase
      .from("profiles")
      .update(allowedFields)
      .eq("id", user.id)
      .select("*")
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({ profile: updatedProfile });
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
