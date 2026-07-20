import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** Allowed avatar MIME types */
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

/** Maximum avatar file size: 5MB */
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

/** Map MIME type to file extension */
const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

/**
 * POST /api/profile/avatar
 *
 * Uploads an avatar image for the authenticated user.
 * Validates:
 *   - Content-Type is one of JPEG, PNG, WebP, GIF (Req 4.5)
 *   - File size ≤ 5MB (Req 4.5)
 * Uploads to Supabase Storage `avatars` bucket at path: `{user_id}/avatar.{ext}`
 * Updates the profile's avatar_url with the public URL.
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Authenticate user
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

    // Get the form data
    const formData = await request.formData();
    const file = formData.get("avatar");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "No avatar file provided" },
        { status: 400 }
      );
    }

    // Validate MIME type
    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        {
          error: `Invalid file type: ${file.type}. Allowed types: JPEG, PNG, WebP, GIF`,
        },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        {
          error: `File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB. Maximum size is 5MB`,
        },
        { status: 400 }
      );
    }

    // Determine file extension from MIME type
    const ext = MIME_TO_EXT[file.type] ?? "jpg";
    const filePath = `${user.id}/avatar.${ext}`;

    // Upload to Supabase Storage (upsert to replace existing avatar)
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: "Failed to upload avatar" },
        { status: 500 }
      );
    }

    // Get the public URL for the uploaded file
    const { data: urlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    const publicUrl = urlData.publicUrl;

    // Update the profile with the new avatar URL
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
      .eq("id", user.id);

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update profile avatar URL" },
        { status: 500 }
      );
    }

    return NextResponse.json({ avatar_url: publicUrl });
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
